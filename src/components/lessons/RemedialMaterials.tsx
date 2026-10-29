import { useEffect, useState } from 'react';
import { DownloadIcon } from '../ui/icons';
import { useStore } from '../../data/store';
import { toDateKey } from '../../lib/dates';
import {
  kluczPostepu,
  ustawPostepArkusza,
  wczytajPostepArkuszy,
  type PostepArkuszy,
} from '../../data/arkuszePostep';
import {
  POLSKI_OD_ZERA,
  REMEDIAL_KEY_HREF,
  REMEDIAL_WORKSHEETS,
  polskiOdZeraUrl,
  type PolskiOdZeraWersja,
} from '../../data/remedial';

function DownloadLink({ href, label, text = 'Pobierz DOCX' }: { href: string; label: string; text?: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      aria-label={label}
    >
      <DownloadIcon />
      {text}
    </a>
  );
}

const WERSJE: Array<{ wersja: PolskiOdZeraWersja; label: string }> = [
  { wersja: 'A4', label: 'Do druku A4' },
  { wersja: 'A5', label: 'A5' },
];

export function PolskiOdZeraMaterials() {
  const [info, setInfo] = useState<string | null>(null);

  async function otworz(czesc: number, wersja: PolskiOdZeraWersja) {
    // Okno otwieramy od razu (w kliknieciu), bo po await przegladarka blokuje popup.
    const okno = window.open('', '_blank');
    try {
      const url = await polskiOdZeraUrl(czesc, wersja);
      if (okno) okno.location.href = url;
      else window.location.href = url;
      setInfo(null);
    } catch (e) {
      okno?.close();
      setInfo(e instanceof Error ? e.message : 'Nie udało się otworzyć pliku.');
    }
  }

  const btn = 'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';
  return (
    <section aria-labelledby="polski-od-zera-heading" className="max-w-4xl">
      <div className="mb-5 max-w-3xl">
        <h2 id="polski-od-zera-heading" className="text-lg font-semibold text-gray-900">
          Mój polski od zera
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Zeszyt A5 do samodzielnej pracy na lekcjach dla uczniów, którzy dopiero uczą się polskiego (polecenia po rosyjsku, klucz na końcu). Wersję A4 drukuj jednostronnie i przetnij stos na pół: lewą kupkę połóż na prawej i zeszyt jest po kolei (numery stron na dole).
        </p>
      </div>
      <ol className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {POLSKI_OD_ZERA.map(({ czesc, tematy }) => (
          <li
            key={czesc}
            className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex min-w-0 gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-sm font-semibold tabular-nums text-accent-700">
                {czesc}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">Część {czesc}</h3>
                <p className="mt-0.5 text-sm leading-5 text-gray-600">{tematy}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {WERSJE.map(({ wersja, label }) => (
                <button key={wersja} type="button" onClick={() => otworz(czesc, wersja)} className={btn}>
                  {label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {info && <p className="mt-2 text-sm text-gray-500">{info}</p>}
    </section>
  );
}

type Worksheet = (typeof REMEDIAL_WORKSHEETS)[number];

/** Nazwa pliku bez rozszerzenia - klucz arkusza w arkusze_postep. */
const worksheetId = (worksheet: Worksheet) => worksheet.href.split('/').pop()!.replace(/\.docx$/, '');

const krotkaData = (key: string) => {
  const [, m, d] = key.split('-');
  return `${Number(d)}.${m}`;
};

interface PostepProps {
  postep: PostepArkuszy;
  onToggle: (arkusz: string, classId: string) => void;
}

/** Odhaczanie, z ktora klasa arkusz byl juz robiony (klasy nie ida tym samym tempem). */
function ClassProgress({ worksheet, title, postep, onToggle }: PostepProps & { worksheet: Worksheet; title: string }) {
  const classes = useStore((s) => s.classes);
  if (classes.length === 0) return null;
  const id = worksheetId(worksheet);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" role="group" aria-label={`Z którymi klasami zrobiony: ${title}`}>
      {[...classes]
        .sort((a, b) => a.order - b.order)
        .map((c) => {
          const done = postep[kluczPostepu(id, c.id)];
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={Boolean(done)}
              onClick={() => onToggle(id, c.id)}
              aria-label={done ? `${c.name}, zrobione ${krotkaData(done)}` : `${c.name}, jeszcze nie`}
              title={done ? `Zrobione ${krotkaData(done)} - kliknij, żeby odznaczyć` : 'Kliknij, gdy zrobisz ten arkusz z klasą'}
              className={
                done
                  ? 'inline-flex min-h-8 items-center gap-1 rounded-full border border-green-600 bg-green-50 px-2.5 text-xs font-semibold text-green-800 transition-colors hover:bg-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500'
                  : 'inline-flex min-h-8 items-center rounded-full border border-dashed border-gray-300 px-2.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500'
              }
            >
              {done ? `✓ ${c.name} · ${krotkaData(done)}` : c.name}
            </button>
          );
        })}
    </div>
  );
}

function WorksheetList({
  items,
  postep,
  onToggle,
}: PostepProps & { items: ReadonlyArray<{ worksheet: Worksheet; number: number }> }) {
  return (
    <ol className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {items.map(({ worksheet, number }) => (
        <li
          key={worksheet.href}
          className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div className="flex min-w-0 gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-sm font-semibold tabular-nums text-accent-700">
              {number}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{worksheet.title}</h3>
              <p className="mt-0.5 text-sm leading-5 text-gray-600">{worksheet.description}</p>
              <ClassProgress worksheet={worksheet} title={worksheet.title} postep={postep} onToggle={onToggle} />
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={worksheet.projectorHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-accent-500 bg-accent-50 px-3.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              aria-label={`Otwórz arkusz ${number}: ${worksheet.title} na projektorze`}
            >
              Projektor
            </a>
            <DownloadLink href={worksheet.href} label={`Pobierz arkusz ${number}: ${worksheet.title} (DOCX, A4 dwustronnie)`} text="DOCX" />
            <DownloadLink
              href={worksheet.a5Href}
              label={`Pobierz arkusz ${number}: ${worksheet.title} (PDF, dwie strony A5 na jednej A4)`}
              text="PDF 2×A5"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function RemedialMaterials() {
  const numbered = REMEDIAL_WORKSHEETS.map((worksheet, index) => ({ worksheet, number: index + 1 }));
  const base = numbered.filter(({ worksheet }) => !('levelUp' in worksheet));
  const levelUp = numbered.filter(({ worksheet }) => 'levelUp' in worksheet);
  const [postep, setPostep] = useState<PostepArkuszy>({});
  const [tylkoTu, setTylkoTu] = useState(false);

  useEffect(() => {
    let aktualne = true;
    void wczytajPostepArkuszy().then((p) => aktualne && setPostep(p));
    return () => {
      aktualne = false;
    };
  }, []);

  function toggle(arkusz: string, classId: string) {
    const key = kluczPostepu(arkusz, classId);
    const doneOn = postep[key] ? null : toDateKey(new Date());
    setPostep((p) => {
      const next = { ...p };
      if (doneOn) next[key] = doneOn;
      else delete next[key];
      return next;
    });
    void ustawPostepArkusza(arkusz, classId, doneOn).then((gdzie) => setTylkoTu(gdzie === 'przegladarka'));
  }

  return (
    <section aria-labelledby="remedial-heading" className="max-w-4xl">
      <div className="mb-5 max-w-3xl">
        <h2 id="remedial-heading" className="text-lg font-semibold text-gray-900">
          Arkusze na zajęcia wyrównawcze
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Każdy arkusz to czytanie ze zrozumieniem, ćwiczenia językowe i krótka wypowiedź. DOCX to kartka A4 drukowana dwustronnie, PDF 2×A5 mieści obie strony obok siebie na jednej stronie A4 (druk jednostronny, poziomo). Pod tytułem odhaczasz klasy, z którymi arkusz jest już zrobiony.
        </p>
        {tylkoTu && (
          <p className="mt-1 text-sm text-amber-700">Odhaczenie zapisane tylko w tej przeglądarce - chmura jeszcze go nie przyjęła.</p>
        )}
      </div>

      <WorksheetList items={base} postep={postep} onToggle={toggle} />

      <div className="mb-3 mt-8 max-w-3xl">
        <h3 className="font-semibold text-gray-900">Poziom wyżej</h3>
        <p className="mt-0.5 text-sm leading-5 text-gray-600">
          Dla tych, którym podstawowe arkusze idą łatwo: odpowiedzi trzeba wywnioskować, a nie przepisać z tekstu.
        </p>
      </div>
      <WorksheetList items={levelUp} postep={postep} onToggle={toggle} />

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Klucz odpowiedzi dla nauczyciela</h3>
          <p className="mt-0.5 text-sm leading-5 text-gray-600">
            Odpowiedzi do wszystkich siedmiu arkuszy, kryteria do wypowiedzi otwartych i krótka wskazówka do wspólnego omówienia.
          </p>
        </div>
        <DownloadLink href={REMEDIAL_KEY_HREF} label="Pobierz klucz odpowiedzi do arkuszy wyrównawczych" />
      </div>
    </section>
  );
}
