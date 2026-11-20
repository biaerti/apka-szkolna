import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { wczytajPraceKlasy } from '../data/pracePisemne';
import { CZESCI_LISTU, maCzesc, type PracaPisemna } from '../lib/pracePisemne';
import type { Student } from '../data/types';

/**
 * Kartki z informacja zwrotna do prac pisemnych - po jednej na ucznia, do
 * zszycia z praca. Bez poprawionego calego tekstu: co sie udalo, co poprawic
 * (forma ucznia -> poprawna), jedna wskazowka, ocena i przypomnienie budowy listu.
 * ?dwie=1 - dwie kartki A5 na jednej A4 (do przeciecia).
 */

const AKCENT = '#0f9f9b';

function Uklad() {
  // Schemat listu - ten sam dla wszystkich, na dole kartki.
  const linia = (szer: string) => <div className="h-[3px] rounded bg-gray-300" style={{ width: szer }} />;
  return (
    <div className="flex gap-4 rounded-lg border border-gray-300 p-3 text-[10.5pt]">
      <div className="w-[40%] space-y-1.5 rounded border border-gray-300 bg-white p-2.5 text-[8.5pt] leading-tight">
        <p className="text-right font-semibold">Wrocław, 20.11.2026 r.</p>
        <p className="font-semibold">Kochana Babciu!</p>
        <div className="space-y-1 pl-3">{linia('85%')}</div>
        <div className="space-y-1">{linia('100%')}{linia('92%')}</div>
        <div className="space-y-1 pl-3">{linia('80%')}</div>
        <div className="space-y-1">{linia('100%')}{linia('70%')}</div>
        <p className="pt-1 text-right font-semibold">Ściskam Cię mocno</p>
        <p className="text-right font-semibold">Twój wnuczek</p>
      </div>
      <div className="flex-1 space-y-1 leading-snug">
        <p className="font-bold" style={{ color: AKCENT }}>Jak piszemy list?</p>
        <p>1. W prawym górnym rogu: <b>miejscowość i data</b>.</p>
        <p>2. <b>Nagłówek</b>: Kochana Babciu! (potem wielka litera) albo Kochana Babciu, (potem mała litera).</p>
        <p>3. <b>Wstęp</b>, <b>rozwinięcie</b>, <b>zakończenie</b> - każda myśl w nowym akapicie, z wcięciem.</p>
        <p>4. <b>Ty, Ciebie, Cię, Tobie, Twój</b> - wielką literą.</p>
        <p>5. Na końcu <b>pozdrowienia</b> i <b>podpis</b>.</p>
      </div>
    </div>
  );
}

function Kartka({ praca, uczen, klasa, dwie }: { praca: PracaPisemna; uczen?: Student; klasa: string; dwie: boolean }) {
  const d = praca.dane;
  const info = d.informacja_dla_ucznia;
  return (
    <section
      className={`kartka flex flex-col overflow-hidden bg-white text-gray-900 ${dwie ? 'gap-2 px-[12mm] py-[7mm]' : 'gap-3 px-[14mm] py-[11mm]'}`}
      style={{ height: dwie ? '148.5mm' : '297mm', fontSize: dwie ? '10pt' : '12pt' }}
    >
      <header className="flex items-start justify-between gap-4 border-b-2 pb-2" style={{ borderColor: AKCENT }}>
        <div>
          <p className="text-[9pt] uppercase tracking-wide text-gray-500">Informacja zwrotna · {praca.tytul}</p>
          <p className="text-[15pt] font-bold">
            {uczen ? `${uczen.firstName} ${uczen.lastName}` : d.podpis}
            <span className="ml-2 text-[11pt] font-normal text-gray-500">kl. {klasa}</span>
          </p>
        </div>
        <div className="shrink-0 rounded-lg border-2 px-4 py-1 text-center" style={{ borderColor: AKCENT }}>
          <p className="text-[8pt] uppercase text-gray-500">Ocena</p>
          <p className="text-[22pt] font-bold leading-none" style={{ color: AKCENT }}>{d.ocena}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10pt]">
        <span className="font-semibold">Części Twojego listu:</span>
        {CZESCI_LISTU.map(([k, nazwa]) => (
          <span key={k} className={maCzesc(d, k) ? '' : 'font-semibold text-red-600'}>
            {maCzesc(d, k) ? '✓' : '✗'} {nazwa}
          </span>
        ))}
      </div>

      <div>
        <p className="font-bold" style={{ color: AKCENT }}>Co Ci się udało</p>
        <ul className="ml-5 list-disc space-y-0.5">
          {info.brawo.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
      {info.popraw.length > 0 && (
        <div>
          <p className="font-bold text-[#c2410c]">Popraw</p>
          <ul className="ml-5 list-disc space-y-0.5">
            {info.popraw.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      {info.nastepnym_razem && (
        <p>
          <span className="font-bold">Następnym razem: </span>
          {info.nastepnym_razem}
        </p>
      )}
      <div className="mt-auto">
        {dwie ? (
          <p className="rounded border border-gray-300 px-2 py-1 text-[8.5pt] leading-snug">
            <b style={{ color: AKCENT }}>List:</b> miejscowość i data (prawy górny róg) → nagłówek (Kochana Babciu! albo
            Kochana Babciu,) → wstęp → rozwinięcie → zakończenie → pozdrowienia → podpis. Każda myśl w nowym akapicie.{' '}
            <b>Ty, Ciebie, Cię, Tobie, Twój</b> - wielką literą.
          </p>
        ) : (
          <Uklad />
        )}
      </div>
    </section>
  );
}

export function PracePrint() {
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const zadanie = params.get('zadanie');
  const dwie = params.get('dwie') === '1';
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const [prace, setPrace] = useState<PracaPisemna[] | null>(null);
  const [blad, setBlad] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    wczytajPraceKlasy(id).then(setPrace, (e: unknown) => setBlad(e instanceof Error ? e.message : String(e)));
  }, [id]);

  const klasa = classes.find((c) => c.id === id);
  const lista = useMemo(() => {
    const nr = (p: PracaPisemna) => students.find((s) => s.id === p.studentId)?.number ?? 999;
    return (prace ?? []).filter((p) => !zadanie || p.zadanie === zadanie).sort((a, b) => nr(a) - nr(b));
  }, [prace, students, zadanie]);

  return (
    <div className="min-h-screen bg-gray-200 print:bg-white">
      <style>{`@page { size: A4; margin: 0 } @media print { .kartka { break-inside: avoid } .arkusz { break-after: page } }`}</style>
      <div className="flex items-center gap-2 p-3 print:hidden">
        <Link to={`/klasy/${id}`}>
          <Button variant="secondary">Wróć</Button>
        </Link>
        <Button onClick={() => window.print()} disabled={lista.length === 0}>
          Drukuj ({lista.length})
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const p = new URLSearchParams(params);
            if (dwie) p.delete('dwie');
            else p.set('dwie', '1');
            setParams(p);
          }}
        >
          {dwie ? 'Jedna kartka na A4' : 'Dwie na A4 (do przecięcia)'}
        </Button>
        {blad && <span className="text-sm text-red-600">{blad}</span>}
        {prace === null && !blad && <span className="text-sm text-gray-500">Wczytuję...</span>}
      </div>
      <div className="mx-auto w-[210mm] space-y-4 print:space-y-0">
        {(dwie ? poDwie(lista) : lista.map((p) => [p])).map((arkusz, i) => (
          <div key={i} className="arkusz overflow-hidden shadow print:shadow-none" style={{ height: '297mm' }}>
            {arkusz.map((p, j) => (
              <div key={p.id} className={dwie && j === 0 ? 'border-b border-dashed border-gray-400' : ''}>
                <Kartka
                  praca={p}
                  uczen={students.find((s) => s.id === p.studentId)}
                  klasa={klasa?.name ?? ''}
                  dwie={dwie}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function poDwie<T>(lista: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < lista.length; i += 2) out.push(lista.slice(i, i + 2));
  return out;
}
