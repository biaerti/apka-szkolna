// Kurs "Polski od zera": wymowa polskiego slowa zapisana cyrylica, jak w papierowym
// zeszycie "Mój polski od zera" (szkoła [шкоўа], dziękuję [дженкуе]). Dwie wersje:
// rosyjska (ś = щ, ć = ч, y = ы, e = э) i ukrainska (ś = сь, ć = ць, y = и, i = і, e = е).
// Akcent (prawie zawsze przedostatnia sylaba) zaznaczamy kreska nad samogloska.
// To pomoc przy pierwszym czytaniu, nie transkrypcja fonetyczna - w trudnych
// miejscach tresc kursu moze ja nadpisac polem `wym`.

export type JezykWymowy = 'ru' | 'ua';

const AKCENT = '́';
const SAMOGLOSKI = 'aąeęioóuy';

interface Jednostka {
  cyr: string;
  /** Jednostka niesie sylabe (samogloska) - do akcentu. */
  sylaba: boolean;
}

/** Samogloska po zmiekczeniu (po i, j albo miekkiej spolglosce) - rosyjska i ukrainska. */
const JOTOWANE: Record<string, { ru: string; ua: string }> = {
  a: { ru: 'я', ua: 'я' },
  e: { ru: 'е', ua: 'є' },
  o: { ru: 'ё', ua: 'ьо' },
  ó: { ru: 'ю', ua: 'ю' },
  u: { ru: 'ю', ua: 'ю' },
  ą: { ru: 'ён', ua: 'ьон' },
  ę: { ru: 'ен', ua: 'єн' },
};

/** Miekkie spolgloski (ś, ć, ź, ń, dź i si, ci, zi, ni, dzi przed samogloska). */
const MIEKKIE: Record<string, { ru: string; ua: string; ruKoniec: string; uaKoniec: string }> = {
  s: { ru: 'щ', ua: 'с', ruKoniec: 'щ', uaKoniec: 'сь' },
  c: { ru: 'ч', ua: 'ц', ruKoniec: 'чь', uaKoniec: 'ць' },
  z: { ru: 'жь', ua: 'з', ruKoniec: 'жь', uaKoniec: 'зь' },
  n: { ru: 'н', ua: 'н', ruKoniec: 'нь', uaKoniec: 'нь' },
  dz: { ru: 'дж', ua: 'дз', ruKoniec: 'джь', uaKoniec: 'дзь' },
};

const TWARDE: Array<[string, string, string]> = [
  // [polskie, ru, ua] - najdluzsze najpierw
  ['szcz', 'щ', 'шч'],
  ['sz', 'ш', 'ш'],
  ['cz', 'ч', 'ч'],
  ['ch', 'х', 'х'],
  ['dż', 'дж', 'дж'],
  ['dz', 'дз', 'дз'],
  ['ż', 'ж', 'ж'],
  ['ł', 'ў', 'ў'],
  ['b', 'б', 'б'],
  ['c', 'ц', 'ц'],
  ['d', 'д', 'д'],
  ['f', 'ф', 'ф'],
  ['g', 'г', 'ґ'],
  ['h', 'х', 'х'],
  ['k', 'к', 'к'],
  ['l', 'л', 'л'],
  ['m', 'м', 'м'],
  ['n', 'н', 'н'],
  ['p', 'п', 'п'],
  ['r', 'р', 'р'],
  ['s', 'с', 'с'],
  ['t', 'т', 'т'],
  ['w', 'в', 'в'],
  ['z', 'з', 'з'],
  ['v', 'в', 'в'],
  ['x', 'кс', 'кс'],
  ['q', 'к', 'к'],
];

const BEZDZWIECZNE = ['p', 't', 'k', 'ch', 'f', 's', 'sz', 'c', 'cz'];

function samogloska(z: string, j: JezykWymowy, poSyczacej: boolean, nastepne: string, koniecSlowa: boolean): string {
  switch (z) {
    case 'a':
      return 'а';
    case 'o':
      return 'о';
    case 'u':
    case 'ó':
      return 'у';
    case 'y':
      return j === 'ru' ? 'ы' : 'и';
    case 'i':
      return j === 'ru' ? 'и' : 'і';
    case 'e':
      return j === 'ru' && !poSyczacej ? 'э' : 'е';
    case 'ą':
      if (koniecSlowa) return 'он';
      return 'bp'.includes(nastepne) ? 'ом' : 'он';
    case 'ę': {
      const e = j === 'ru' && !poSyczacej ? 'э' : 'е';
      if (koniecSlowa || 'lł'.includes(nastepne)) return e;
      return 'bp'.includes(nastepne) ? `${e}м` : `${e}н`;
    }
    default:
      return z;
  }
}

function jednostkiSlowa(slowo: string, j: JezykWymowy): Jednostka[] {
  const s = slowo.toLowerCase();
  const out: Jednostka[] = [];
  let i = 0;
  let poprzednia = '';
  const jestSam = (c: string | undefined) => c !== undefined && SAMOGLOSKI.includes(c);
  while (i < s.length) {
    const reszta = s.slice(i);
    // miekka spolgloska: ś ć ź ń dź albo si ci zi ni dzi (+ samogloska lub koniec/spolgloska)
    let miekka: { klucz: string; dl: number; zI: boolean } | null = null;
    if (reszta.startsWith('dź')) miekka = { klucz: 'dz', dl: 2, zI: false };
    else if (reszta.startsWith('dzi')) miekka = { klucz: 'dz', dl: 3, zI: true };
    else if ('śćźń'.includes(reszta[0])) miekka = { klucz: { ś: 's', ć: 'c', ź: 'z', ń: 'n' }[reszta[0]]!, dl: 1, zI: false };
    else if (/^[sczn]i/.test(reszta) && !(reszta[0] === 'c' && s[i - 1] === 's') && !(reszta[0] === 'z' && 'sdcr'.includes(s[i - 1] ?? ''))) {
      miekka = { klucz: reszta[0], dl: 2, zI: true };
    }
    if (miekka) {
      const m = MIEKKIE[miekka.klucz];
      const dalej = s[i + miekka.dl];
      if (jestSam(dalej) && dalej !== 'i' && dalej !== 'y') {
        // spolgloska + samogloska jotowana
        const kon = j === 'ru' ? m.ru : m.ua;
        let sam: string | undefined = j === 'ru' ? JOTOWANE[dalej]?.ru : JOTOWANE[dalej]?.ua;
        if (j === 'ru' && (kon.endsWith('щ') || kon.endsWith('ч') || kon.endsWith('ж'))) {
          // po щ/ч/ж po rosyjsku piszemy zwykla samogloske (чоча, не чёча)
          sam = { a: 'а', e: 'е', o: 'о', ó: 'у', u: 'у', ą: 'он', ę: 'ен' }[dalej];
        }
        if (j === 'ru' && kon === 'жь') {
          out.push({ cyr: 'ж', sylaba: false });
        } else {
          out.push({ cyr: kon.replace(/ь$/, ''), sylaba: false });
        }
        const koniec = i + miekka.dl + 1 >= s.length;
        let samTekst = sam ?? dalej;
        if (dalej === 'ę' && koniec) samTekst = samTekst.replace(/н$/, '');
        if (dalej === 'ą' && koniec) samTekst = samTekst.replace(/н$/, 'н');
        out.push({ cyr: samTekst, sylaba: true });
        poprzednia = dalej;
        i += miekka.dl + 1;
        continue;
      }
      if (miekka.zI) {
        // si, zi, ci, ni + spolgloska albo koniec: "zima", "cicho", "nic"
        const kon = j === 'ru' ? m.ru.replace(/ь$/, '') : m.ua;
        out.push({ cyr: kon, sylaba: false });
        out.push({ cyr: j === 'ru' ? 'и' : 'і', sylaba: true });
        poprzednia = 'i';
        i += miekka.dl;
        continue;
      }
      const koniec = !jestSam(dalej);
      out.push({ cyr: j === 'ru' ? (koniec ? m.ruKoniec : m.ru) : koniec ? m.uaKoniec : m.ua, sylaba: false });
      poprzednia = miekka.klucz;
      i += miekka.dl;
      continue;
    }
    // rz (po bezdzwiecznej jak sz)
    if (reszta.startsWith('rz')) {
      out.push({ cyr: BEZDZWIECZNE.includes(poprzednia) ? 'ш' : 'ж', sylaba: false });
      poprzednia = 'rz';
      i += 2;
      continue;
    }
    // j + samogloska
    if (reszta[0] === 'j' && jestSam(reszta[1]) && reszta[1] !== 'i' && reszta[1] !== 'y') {
      const z = reszta[1];
      const koniec = i + 2 >= s.length;
      let sam = j === 'ru' ? JOTOWANE[z].ru : JOTOWANE[z].ua.replace(/^ь/, 'й');
      if (z === 'ę' && koniec) sam = sam.replace(/н$/, '');
            out.push({ cyr: sam, sylaba: true });
      poprzednia = z;
      i += 2;
      continue;
    }
    // spolgloska + i + samogloska: "pies", "miasto" - zmiekczenie
    const twarda = TWARDE.find(([pl]) => reszta.startsWith(pl));
    if (twarda) {
      const [pl, ru, ua] = twarda;
      const poI = s[i + pl.length] === 'i' && jestSam(s[i + pl.length + 1]) && !'iy'.includes(s[i + pl.length + 1]);
      out.push({ cyr: j === 'ru' ? ru : ua, sylaba: false });
      if (poI) {
        const z = s[i + pl.length + 1];
        const koniec = i + pl.length + 2 >= s.length;
        let sam = j === 'ru' ? JOTOWANE[z].ru : JOTOWANE[z].ua;
        if (z === 'ę' && koniec) sam = sam.replace(/н$/, '');
                out.push({ cyr: sam, sylaba: true });
        poprzednia = z;
        i += pl.length + 2;
        continue;
      }
      poprzednia = pl;
      i += pl.length;
      continue;
    }
    if (reszta[0] === 'j') {
      out.push({ cyr: 'й', sylaba: false });
      poprzednia = 'j';
      i += 1;
      continue;
    }
    if (jestSam(reszta[0])) {
      const poSyczacej = ['sz', 'cz', 'rz', 'ż', 'c', 'dz', 'dż', 'szcz'].includes(poprzednia) || 'śćźń'.includes(poprzednia);
      const koniec = i + 1 >= s.length;
      out.push({ cyr: samogloska(reszta[0], j, poSyczacej, s[i + 1] ?? '', koniec), sylaba: true });
      poprzednia = reszta[0];
      i += 1;
      continue;
    }
    // inny znak (apostrof, cyfra) - bez zmian
    out.push({ cyr: reszta[0], sylaba: false });
    poprzednia = reszta[0];
    i += 1;
  }
  return out;
}

/** Dodaje kreske akcentu do pierwszej samogloski cyrylicy w jednostce. */
function zAkcentem(cyr: string): string {
  const idx = [...cyr].findIndex((c) => 'аеёиіоуыэюяє'.includes(c));
  if (idx < 0) return cyr;
  const znaki = [...cyr];
  // ё ma juz akcent w sobie
  if (znaki[idx] === 'ё') return cyr;
  znaki.splice(idx + 1, 0, AKCENT);
  return znaki.join('');
}

/** Dzwieczna spolgloska na koncu slowa brzmi bezdzwiecznie: chleb [хлеп], Pokaż [по́каш]. */
const UBEZDZWIECZNIENIE: Record<string, string> = {
  б: 'п', д: 'т', г: 'к', ґ: 'к', в: 'ф', з: 'с', ж: 'ш', дз: 'ц', дж: 'ч', жь: 'щ', зь: 'сь', дзь: 'ць', джь: 'чь',
};

/** Wymowa jednego slowa (bez interpunkcji) z akcentem na przedostatniej sylabie. */
export function wymowaSlowa(slowo: string, j: JezykWymowy, akcent = true): string {
  const jedn = jednostkiSlowa(slowo, j);
  const ost = jedn[jedn.length - 1];
  if (ost && !ost.sylaba && jedn.length > 1 && UBEZDZWIECZNIENIE[ost.cyr]) {
    jedn[jedn.length - 1] = { ...ost, cyr: UBEZDZWIECZNIENIE[ost.cyr] };
  }
  const sylaby = jedn.map((x, i) => (x.sylaba ? i : -1)).filter((i) => i >= 0);
  if (akcent && sylaby.length >= 2) {
    const idx = sylaby[sylaby.length - 2];
    jedn[idx] = { ...jedn[idx], cyr: zAkcentem(jedn[idx].cyr) };
  }
  return jedn.map((x) => x.cyr).join('');
}

/**
 * Wymowa calego tekstu (slowa lub zdania): kazde slowo osobno, interpunkcja
 * zostaje. Krotkie slowa (jedna sylaba) bez akcentu.
 */
export function wymowa(tekst: string, j: JezykWymowy): string {
  return tekst
    .split(/(\s+)/)
    .map((kawalek) => {
      if (/^\s+$/.test(kawalek) || !kawalek) return kawalek;
      const m = kawalek.match(/^([^\p{L}]*)([\p{L}-]+)([^\p{L}]*)$/u);
      if (!m) return kawalek;
      const [, przed, slowo, po] = m;
      return przed + slowo.split('-').map((s) => wymowaSlowa(s, j)).join('-') + po.replace(/[.!?,;:]/g, '');
    })
    .join('')
    .trim();
}
