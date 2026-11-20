import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import { wczytajPraceKlasy } from '../../data/pracePisemne';
import type { PracaPisemna } from '../../lib/pracePisemne';
import type { Student } from '../../data/types';
import { ImportPracModal } from './ImportPracModal';
import { PracaKarta } from './PracaKarta';

const krotkaData = (iso: string) => iso.slice(8, 10) + '.' + iso.slice(5, 7);

/**
 * Zakladka "Pisanie" w klasie: prace pisemne kazdego ucznia (zdjecia, ocena,
 * informacja zwrotna, opinia o pisaniu) - do opinii na koniec roku i rozmow z rodzicami.
 */
export function PisanieKlasy({ classId, students }: { classId: string; students: Student[] }) {
  const [prace, setPrace] = useState<PracaPisemna[] | null>(null);
  const [blad, setBlad] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [otwarta, setOtwarta] = useState<PracaPisemna | null>(null);

  const wczytaj = useCallback(() => {
    setBlad(null);
    wczytajPraceKlasy(classId).then(setPrace, (e: unknown) => setBlad(e instanceof Error ? e.message : String(e)));
  }, [classId]);

  useEffect(wczytaj, [wczytaj]);

  const aktywni = useMemo(() => students.filter((s) => s.active), [students]);
  const zadania = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of prace ?? []) if (!m.has(p.zadanie)) m.set(p.zadanie, p.tytul);
    return [...m.entries()];
  }, [prace]);
  const bezUcznia = (prace ?? []).filter((p) => !p.studentId || !students.some((s) => s.id === p.studentId));

  function chip(p: PracaPisemna) {
    return (
      <button
        key={p.id}
        type="button"
        onClick={() => setOtwarta(p)}
        className="mr-1.5 rounded border border-gray-200 px-2 py-0.5 text-sm hover:border-accent-400 hover:bg-accent-50"
        title={p.tytul}
      >
        {krotkaData(p.data)} · <span className="font-semibold">{p.dane.ocena}</span>
      </button>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => setImportOpen(true)}>
          Importuj prace
        </Button>
        {zadania.map(([zadanie, tytul]) => (
          <Link key={zadanie} to={`/klasy/${classId}/pisanie/druk?zadanie=${encodeURIComponent(zadanie)}`} target="_blank">
            <Button variant="secondary" title={tytul}>
              Drukuj informacje zwrotne{zadania.length > 1 ? ` - ${tytul}` : ''}
            </Button>
          </Link>
        ))}
      </div>

      {blad && <p className="mb-3 text-sm text-red-600">{blad}</p>}
      {prace === null && !blad && <p className="text-sm text-gray-500">Wczytuję prace...</p>}
      {prace !== null && prace.length === 0 && (
        <EmptyState title="Brak prac" description="Zaimportuj paczkę prac przygotowaną z fotek." />
      )}

      {prace !== null && prace.length > 0 && (
        <>
          {bezUcznia.length > 0 && (
            <p className="mb-3 text-sm text-amber-700">
              Bez ucznia ({bezUcznia.length}): {bezUcznia.map((p) => (
                <span key={p.id}>
                  {p.dane.podpis || 'bez podpisu'} {chip(p)}
                </span>
              ))}
            </p>
          )}
          <Table>
            <THead>
              <TR>
                <TH>Nr</TH>
                <TH>Uczeń</TH>
                <TH>Prace</TH>
              </TR>
            </THead>
            <TBody>
              {aktywni.map((s) => {
                const jego = prace.filter((p) => p.studentId === s.id);
                return (
                  <TR key={s.id}>
                    <TD>{s.number}</TD>
                    <TD className="font-medium text-gray-900">
                      {s.lastName} {s.firstName}
                    </TD>
                    <TD>{jego.length > 0 ? jego.map(chip) : <span className="text-gray-400">-</span>}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </>
      )}

      <ImportPracModal open={importOpen} onClose={() => setImportOpen(false)} onDone={wczytaj} />
      {otwarta && (
        <PracaKarta praca={otwarta} uczniowie={aktywni} onClose={() => setOtwarta(null)} onChanged={wczytaj} />
      )}
    </div>
  );
}
