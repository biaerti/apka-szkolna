import { useMemo, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useStore } from '../../data/store';
import { idPracZadania, wyslijZdjecie, zapiszPrace } from '../../data/pracePisemne';
import {
  czytajPaczke,
  dopasujKlase,
  kluczKlasy,
  type Paczka,
  type PaczkaPraca,
  type PracaDane,
} from '../../lib/pracePisemne';
import type { SchoolClass, Student } from '../../data/types';

/**
 * Import paczki prac (folder z prace.json i zdjecia/<klasa>/*.jpg, przygotowany
 * przez Claude'a z fotek). Od razu dla wszystkich klas z paczki: podpis z pracy
 * jest dopasowany do ucznia, Bartek tylko poprawia, gdzie trzeba. Prace, ktore
 * juz sa w apce (to samo id), sa pomijane - import mozna powtorzyc.
 */

interface Wiersz {
  id: string;
  klasa: SchoolClass;
  praca: PaczkaPraca;
  studentId: string | null;
  juzJest: boolean;
}

export function pracaId(zadanie: string, klasa: string, nr: number): string {
  return `${zadanie}-${kluczKlasy(klasa)}-${nr}`;
}

function nazwaUcznia(s: Student) {
  return `${s.number}. ${s.lastName} ${s.firstName}`;
}

export function ImportPracModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const [paczka, setPaczka] = useState<Paczka | null>(null);
  const [pliki, setPliki] = useState<Map<string, File>>(new Map());
  const [wiersze, setWiersze] = useState<Wiersz[]>([]);
  const [blad, setBlad] = useState<string | null>(null);
  const [postep, setPostep] = useState<string | null>(null);

  const uczniowieKlasy = useMemo(() => {
    const m = new Map<string, Student[]>();
    for (const c of classes) {
      m.set(c.id, students.filter((s) => s.classId === c.id && s.active).sort((a, b) => a.number - b.number));
    }
    return m;
  }, [classes, students]);

  async function wybierzFolder(lista: FileList | null) {
    setBlad(null);
    if (!lista || lista.length === 0) return;
    const wszystkie = Array.from(lista);
    const json = wszystkie.find((f) => f.name === 'prace.json');
    if (!json) {
      setBlad('W folderze nie ma pliku prace.json.');
      return;
    }
    try {
      const p = czytajPaczke(await json.text());
      const mapa = new Map<string, File>();
      for (const f of wszystkie) {
        const czesci = f.webkitRelativePath.split('/');
        if (czesci.length >= 2) mapa.set(`${kluczKlasy(czesci[czesci.length - 2])}/${f.name}`, f);
      }
      const istniejace = await idPracZadania(p.zadanie);
      const nowe: Wiersz[] = [];
      const brakKlas: string[] = [];
      for (const k of p.klasy) {
        const klasa = classes.find((c) => kluczKlasy(c.name) === kluczKlasy(k.klasa));
        if (!klasa) {
          brakKlas.push(k.klasa);
          continue;
        }
        const przypisania = dopasujKlase(k.prace, uczniowieKlasy.get(klasa.id) ?? []);
        k.prace.forEach((praca, i) => {
          const id = pracaId(p.zadanie, k.klasa, praca.nr);
          nowe.push({ id, klasa, praca, studentId: przypisania[i], juzJest: istniejace.has(id) });
        });
      }
      if (brakKlas.length > 0) setBlad(`Nie znalazłem w apce klas: ${brakKlas.join(', ')}.`);
      setPaczka(p);
      setPliki(mapa);
      setWiersze(nowe);
    } catch (e) {
      setBlad(e instanceof Error ? e.message : String(e));
    }
  }

  function ustawUcznia(id: string, studentId: string | null) {
    setWiersze((w) => w.map((x) => (x.id === id ? { ...x, studentId } : x)));
  }

  async function importuj() {
    if (!paczka) return;
    const doWyslania = wiersze.filter((w) => !w.juzJest);
    setBlad(null);
    try {
      for (let i = 0; i < doWyslania.length; i++) {
        const w = doWyslania[i];
        setPostep(`Szyfruję i wysyłam ${i + 1} z ${doWyslania.length}...`);
        const sciezki: string[] = [];
        for (const nazwa of w.praca.zdjecia) {
          const plik = pliki.get(`${kluczKlasy(w.klasa.name)}/${nazwa}`);
          if (!plik) throw new Error(`Brak zdjęcia ${nazwa} (klasa ${w.klasa.name}).`);
          sciezki.push(await wyslijZdjecie(plik));
        }
        const { nr: _nr, zdjecia: _z, ...dane } = w.praca;
        await zapiszPrace({
          id: w.id,
          classId: w.klasa.id,
          studentId: w.studentId,
          zadanie: paczka.zadanie,
          tytul: paczka.tytul,
          data: paczka.data,
          dane: dane as PracaDane,
          zdjecia: sciezki,
        });
      }
      setPostep(null);
      setPaczka(null);
      setWiersze([]);
      onDone();
      onClose();
    } catch (e) {
      setPostep(null);
      setBlad(e instanceof Error ? e.message : String(e));
    }
  }

  const doWyslania = wiersze.filter((w) => !w.juzJest);
  const bezUcznia = doWyslania.filter((w) => !w.studentId).length;
  const klasyWPaczce = [...new Set(wiersze.map((w) => w.klasa.id))];

  return (
    <Modal
      open={open}
      onClose={postep ? () => undefined : onClose}
      title="Import prac pisemnych"
      widthClassName="max-w-3xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={Boolean(postep)}>
            Anuluj
          </Button>
          <Button onClick={importuj} disabled={!paczka || doWyslania.length === 0 || Boolean(postep)}>
            {postep ?? `Zapisz ${doWyslania.length} prac`}
          </Button>
        </>
      }
    >
      {!paczka && (
        <label className="block text-sm text-gray-700">
          Wybierz folder paczki (z plikiem prace.json):
          <input
            type="file"
            className="mt-2 block text-sm"
            // folder zamiast pojedynczych plikow - Chrome 109 to obsluguje
            {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
            onChange={(e) => wybierzFolder(e.target.files)}
          />
        </label>
      )}
      {blad && <p className="mt-2 text-sm text-red-600">{blad}</p>}
      {paczka && (
        <div className="max-h-[65vh] space-y-5 overflow-y-auto">
          <p className="text-sm text-gray-600">
            {paczka.tytul} · {wiersze.length} prac
            {bezUcznia > 0 && <span className="text-amber-700"> · {bezUcznia} bez ucznia - wybierz albo zostaw na później</span>}
          </p>
          {klasyWPaczce.map((classId) => {
            const uczniowie = uczniowieKlasy.get(classId) ?? [];
            const wKlasie = wiersze.filter((w) => w.klasa.id === classId);
            const zajeci = new Map<string, number>();
            for (const w of wKlasie) if (w.studentId) zajeci.set(w.studentId, (zajeci.get(w.studentId) ?? 0) + 1);
            return (
              <div key={classId}>
                <h3 className="mb-1 font-semibold text-gray-900">{wKlasie[0].klasa.name}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {wKlasie.map((w) => (
                      <tr key={w.id} className={`border-t border-gray-100 ${w.juzJest ? 'opacity-50' : ''}`}>
                        <td className="w-8 py-1 text-gray-400">{w.praca.nr}</td>
                        <td className="py-1 pr-2">
                          <span className="font-medium">{w.praca.podpis || 'bez podpisu'}</span>
                          <span className="ml-2 text-gray-500">ocena {w.praca.ocena}</span>
                          {w.juzJest && <span className="ml-2 text-gray-500">już w apce</span>}
                        </td>
                        <td className="w-72 py-1">
                          <Select
                            value={w.studentId ?? ''}
                            disabled={w.juzJest}
                            className={
                              !w.studentId
                                ? 'border-amber-400'
                                : (zajeci.get(w.studentId) ?? 0) > 1
                                  ? 'border-red-400'
                                  : ''
                            }
                            onChange={(e) => ustawUcznia(w.id, e.target.value || null)}
                          >
                            <option value="">- nie wiem / później -</option>
                            {uczniowie.map((s) => (
                              <option key={s.id} value={s.id}>
                                {nazwaUcznia(s)}
                              </option>
                            ))}
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          <p className="text-xs text-gray-500">
            Przed wysłaniem tekst, ocena i zdjęcia są szyfrowane Twoim hasłem do danych uczniów. Czerwona ramka: ten sam uczeń przy
            dwóch pracach.
          </p>
        </div>
      )}
    </Modal>
  );
}
