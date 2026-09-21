// Wazne info: wyciaganie punktow dla rodzicow z przeslanego maila.
//
// Czysta logika (prompt + parsowanie odpowiedzi modelu + skladanie paczki na
// WhatsAppa), bez sieci - zeby dalo sie to testowac jednostkowo. Sam IMAP
// i wolanie OpenRouter siedza w wazneInfoMail.ts (tylko Node), a zapis do
// Supabase w api/wazne-info-pull.ts.

export type WazneInfoStatus = 'nowe' | 'wyslane' | 'pominiete';

export interface WazneInfoPunkt {
  tytul: string;
  tresc: string;
  /** "RRRR-MM-DD" albo null, gdy informacja nie ma terminu. */
  termin: string | null;
  linki: string[];
}

export interface WazneInfo extends WazneInfoPunkt {
  id: string;
  messageId: string | null;
  nadawca: string | null;
  temat: string | null;
  /** ISO - kiedy mail przyszedl na skrzynke (null dla punktow dodanych recznie). */
  otrzymano: string | null;
  status: WazneInfoStatus;
  paczkaId: string | null;
  createdAt: string;
}

export interface WazneInfoPaczka {
  id: string;
  tekst: string;
  wyslano: string;
}

export interface MailDoPrzerobienia {
  messageId: string;
  nadawca: string;
  temat: string;
  /** ISO daty otrzymania. */
  otrzymano: string;
  tekst: string;
}

/** Wynik sprawdzenia skrzynki (api/wazne-info-pull.ts). */
export interface PullResult {
  /** Ile maili bylo w skrzynce. */
  wSkrzynce: number;
  /** Ile nowych maili przerobiono. */
  przerobione: number;
  /** Ile punktow dodano. */
  punkty: number;
}

/** Tyle znakow maila trafia do modelu - reszta to zwykle stopki i cytowania. */
const MAX_MAIL_CHARS = 12000;

export function buildExtractSystemPrompt(dzisiaj: string): string {
  return [
    'Jesteś asystentem wychowawcy klasy 4 szkoły podstawowej. Nauczyciel przesyła Ci maile',
    'ze szkoły (od dyrekcji, innych nauczycieli, z dziennika elektronicznego), a Ty wyciągasz',
    'z nich informacje, które wychowawca ma przekazać RODZICOM uczniów na grupie WhatsApp.',
    '',
    'Zasady:',
    '- Wypisz tylko to, co dotyczy rodziców lub uczniów tej klasy (terminy, konkursy, wycieczki,',
    '  zebrania, składki, zgody do podpisania, zmiany w planie, dni wolne, co przynieść itp.).',
    '- Pomiń sprawy wewnętrzne dla nauczycieli (organizacja pracy zespołów, dyżury, rady pedagogiczne),',
    '  a zwłaszcza loginy, hasła i dane do logowania - tych NIGDY nie przepisuj.',
    '- Jeden mail może dać kilka punktów, jeśli dotyczy kilku osobnych spraw; jeśli to jedna sprawa, daj jeden punkt.',
    '- "tytul": krótko, do 8 słów. "tresc": 1-3 zdania po polsku, prostym językiem, jak do rodziców,',
    '  z konkretami (daty, godziny, kwoty, co zrobić). Bez zwrotów "Szanowni Państwo".',
    '- "termin": data "RRRR-MM-DD", do której trzeba coś zrobić albo kiedy odbywa się wydarzenie',
    '  (jeśli jest kilka dat, weź najwcześniejszą istotną dla rodziców); null, gdy brak terminu.',
    `  Dzisiaj jest ${dzisiaj} - daty bez roku licz względem dzisiaj (najbliższa przyszła).`,
    '- "linki": adresy stron z maila, które przydadzą się rodzicom (regulaminy, formularze, strona konkursu).',
    '- Jeśli mail nie zawiera nic dla rodziców, zwróć pustą listę.',
    '',
    'Odpowiadaj WYŁĄCZNIE JSON-em w formacie:',
    '{"punkty":[{"tytul":"...","tresc":"...","termin":"RRRR-MM-DD" | null,"linki":["..."]}]}',
  ].join('\n');
}

export function buildExtractUserPrompt(mail: MailDoPrzerobienia): string {
  const tekst = mail.tekst.length > MAX_MAIL_CHARS ? `${mail.tekst.slice(0, MAX_MAIL_CHARS)}\n[...]` : mail.tekst;
  return [`Od: ${mail.nadawca}`, `Temat: ${mail.temat}`, `Otrzymano: ${mail.otrzymano}`, '', tekst].join('\n');
}

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Parsuje odpowiedz modelu. Toleruje plot ```json ... ``` i smieci wokol JSON-a. */
export function parseExtractResponse(text: string): WazneInfoPunkt[] {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  const punkty = (parsed as { punkty?: unknown })?.punkty;
  if (!Array.isArray(punkty)) return [];
  const wynik: WazneInfoPunkt[] = [];
  for (const p of punkty) {
    if (!p || typeof p !== 'object') continue;
    const { tytul, tresc, termin, linki } = p as Record<string, unknown>;
    if (typeof tytul !== 'string' || !tytul.trim()) continue;
    wynik.push({
      tytul: tytul.trim(),
      tresc: typeof tresc === 'string' ? tresc.trim() : '',
      termin: isDateKey(termin) ? termin : null,
      linki: Array.isArray(linki)
        ? linki.filter((l): l is string => typeof l === 'string' && /^https?:\/\//.test(l))
        : [],
    });
  }
  return wynik;
}

// --- paczka na WhatsAppa -----------------------------------------------------

const MIESIACE = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

/** "2026-10-09" -> "9 października". */
export function formatTermin(termin: string): string {
  const [, m, d] = termin.split('-').map(Number);
  return `${d} ${MIESIACE[(m ?? 1) - 1]}`;
}

/** Sklada wiadomosc na WhatsAppa z zaznaczonych punktow (pogrubienie *tak* jak w WhatsAppie). */
export function buildPaczkaText(punkty: WazneInfoPunkt[]): string {
  if (punkty.length === 0) return '';
  const linie: string[] = ['Dzień dobry, kilka ważnych informacji:', ''];
  punkty.forEach((p, i) => {
    const termin = p.termin ? ` (do ${formatTermin(p.termin)})` : '';
    linie.push(`${i + 1}. *${p.tytul}*${termin}`);
    if (p.tresc) linie.push(p.tresc);
    for (const link of p.linki) linie.push(link);
    linie.push('');
  });
  linie.push('Pozdrawiam');
  return linie.join('\n');
}

/** Ile dni do terminu liczac od `dzisiaj` ("RRRR-MM-DD"); ujemne = po terminie. */
export function dniDoTerminu(termin: string, dzisiaj: string): number {
  const a = Date.UTC(...splitKey(termin));
  const b = Date.UTC(...splitKey(dzisiaj));
  return Math.round((a - b) / 86400000);
}

function splitKey(key: string): [number, number, number] {
  const [y, m, d] = key.split('-').map(Number);
  return [y, (m ?? 1) - 1, d ?? 1];
}
