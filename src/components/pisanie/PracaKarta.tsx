import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { adresZdjecia, usunPrace, zapiszPrace } from '../../data/pracePisemne';
import { CZESCI_LISTU, maCzesc, type Blad, type PracaPisemna } from '../../lib/pracePisemne';
import type { Student } from '../../data/types';

function Zdjecie({ sciezka }: { sciezka: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [blad, setBlad] = useState(false);
  useEffect(() => {
    let zywy = true;
    adresZdjecia(sciezka).then(
      (u) => zywy && setUrl(u),
      () => zywy && setBlad(true),
    );
    return () => {
      zywy = false;
    };
  }, [sciezka]);
  if (blad) return <div className="rounded bg-gray-100 p-4 text-xs text-gray-500">Nie udało się otworzyć zdjęcia.</div>;
  if (!url) return <div className="h-64 animate-pulse rounded bg-gray-100" />;
  return (
    <a href={url} target="_blank" rel="noreferrer" title="Otwórz w pełnym rozmiarze">
      <img src={url} alt="Zdjęcie pracy" className="w-full rounded border border-gray-200" />
    </a>
  );
}

function ListaBledow({ tytul, bledy }: { tytul: string; bledy?: Blad[] }) {
  if (!bledy || bledy.length === 0) return null;
  return (
    <p>
      <span className="font-medium">{tytul}:</span>{' '}
      {bledy.map(([zle, dobrze], i) => (
        <span key={i}>
          {i > 0 && ', '}
          <span className="line-through decoration-red-400">{zle}</span> → {dobrze}
        </span>
      ))}
    </p>
  );
}

const linie = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

/** Jedna praca: zdjecia, ocena, informacja dla ucznia i opinia do edycji, szczegoly oceny pod spodem. */
export function PracaKarta({
  praca,
  uczniowie,
  onClose,
  onChanged,
}: {
  praca: PracaPisemna;
  uczniowie: Student[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const d = praca.dane;
  const [studentId, setStudentId] = useState(praca.studentId ?? '');
  const [ocena, setOcena] = useState(d.ocena);
  const [brawo, setBrawo] = useState(d.informacja_dla_ucznia.brawo.join('\n'));
  const [popraw, setPopraw] = useState(d.informacja_dla_ucznia.popraw.join('\n'));
  const [nastepnym, setNastepnym] = useState(d.informacja_dla_ucznia.nastepnym_razem);
  const [opinia, setOpinia] = useState(d.opinia_dla_nauczyciela);
  const [zajety, setZajety] = useState(false);
  const [blad, setBlad] = useState<string | null>(null);
  const [potwierdzUsun, setPotwierdzUsun] = useState(false);

  async function zapisz() {
    setZajety(true);
    setBlad(null);
    try {
      await zapiszPrace({
        ...praca,
        studentId: studentId || null,
        dane: {
          ...d,
          ocena: ocena.trim(),
          opinia_dla_nauczyciela: opinia.trim(),
          informacja_dla_ucznia: { brawo: linie(brawo), popraw: linie(popraw), nastepnym_razem: nastepnym.trim() },
        },
      });
      onChanged();
      onClose();
    } catch (e) {
      setBlad(e instanceof Error ? e.message : String(e));
    } finally {
      setZajety(false);
    }
  }

  async function usun() {
    setZajety(true);
    try {
      await usunPrace(praca);
      onChanged();
      onClose();
    } catch (e) {
      setBlad(e instanceof Error ? e.message : String(e));
      setZajety(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`${praca.tytul} - podpis: ${d.podpis || 'brak'}`}
      widthClassName="max-w-6xl"
      footer={
        <>
          {potwierdzUsun ? (
            <Button variant="danger" onClick={usun} disabled={zajety} className="mr-auto">
              Na pewno usunąć pracę i zdjęcia?
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setPotwierdzUsun(true)} className="mr-auto">
              Usuń pracę
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Zamknij
          </Button>
          <Button onClick={zapisz} disabled={zajety}>
            Zapisz
          </Button>
        </>
      }
    >
      <div className="grid max-h-[72vh] grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-5 overflow-y-auto">
        <div className="space-y-3">
          {praca.zdjecia.map((s) => (
            <Zdjecie key={s} sciezka={s} />
          ))}
        </div>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <label>
              <span className="text-gray-600">Uczeń</span>
              <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">- nieprzypisana -</option>
                {uczniowie.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.number}. {s.lastName} {s.firstName}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              <span className="text-gray-600">Ocena</span>
              <Input value={ocena} onChange={(e) => setOcena(e.target.value)} />
            </label>
          </div>
          {d.uzasadnienie_oceny && <p className="text-gray-500">{d.uzasadnienie_oceny}</p>}
          <label className="block">
            <span className="text-gray-600">Brawo (każdy punkt w osobnej linii)</span>
            <Textarea rows={3} value={brawo} onChange={(e) => setBrawo(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-gray-600">Popraw</span>
            <Textarea rows={3} value={popraw} onChange={(e) => setPopraw(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-gray-600">Następnym razem</span>
            <Input value={nastepnym} onChange={(e) => setNastepnym(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-gray-600">Opinia o pisaniu (dla Ciebie, nie drukuje się)</span>
            <Textarea rows={4} value={opinia} onChange={(e) => setOpinia(e.target.value)} />
          </label>
          {blad && <p className="text-red-600">{blad}</p>}

          <details className="rounded border border-gray-200 p-3">
            <summary className="cursor-pointer font-medium">Szczegóły oceny</summary>
            <div className="mt-2 space-y-1.5 text-gray-700">
              <p>
                <span className="font-medium">Części listu: </span>
                {CZESCI_LISTU.map(([k, nazwa]) => (
                  <span key={k} className={maCzesc(d, k) ? 'mr-2' : 'mr-2 text-red-600'}>
                    {maCzesc(d, k) ? '✓' : '✗'} {nazwa}
                  </span>
                ))}
              </p>
              {d.tresc && <p><span className="font-medium">Treść:</span> {d.tresc}</p>}
              {d.pismo && <p><span className="font-medium">Pismo:</span> {d.pismo}</p>}
              <p>
                <span className="font-medium">Akapity:</span> {d.akapity ? 'tak' : 'nie'} ·{' '}
                <span className="font-medium">Ty/Ciebie wielką literą:</span> {d.zwroty_wielka_litera ?? '-'} ·{' '}
                <span className="font-medium">Długość:</span> ok. {d.dlugosc_slow ?? '?'} słów
              </p>
              <ListaBledow tytul="Ortografia" bledy={d.bledy_ortograficzne} />
              <ListaBledow tytul="Interpunkcja" bledy={d.bledy_interpunkcyjne} />
              <ListaBledow tytul="Inne" bledy={d.inne_bledy} />
              {d.uwagi && <p className="text-gray-500"><span className="font-medium">Uwagi przy przepisywaniu:</span> {d.uwagi}</p>}
            </div>
          </details>
          <details className="rounded border border-gray-200 p-3">
            <summary className="cursor-pointer font-medium">Przepisany tekst (z błędami ucznia)</summary>
            <p className="mt-2 whitespace-pre-wrap font-serif text-gray-800">{d.transkrypcja}</p>
          </details>
        </div>
      </div>
    </Modal>
  );
}
