// Materialy po dziale nad lista lekcji zakladki: zeszyt powtorzeniowy (link do
// VULCANA) i sprawdzian z grupami A-D + klucz (z prywatnego bucketu).

import { useState } from 'react';
import { materialyDzialu, sprawdzianUrl, zeszytUrl } from '../../data/materialyDzialow';

export function DzialMaterialsBar({ grade, dzial }: { grade: string; dzial?: string }) {
  const [info, setInfo] = useState<string | null>(null);
  const materialy = materialyDzialu(grade, dzial);
  if (!materialy) return null;
  const zeszyt = zeszytUrl(materialy.folder);

  async function kopiuj() {
    try {
      await navigator.clipboard.writeText(zeszyt);
      setInfo('Skopiowano link - wklej go w VULCANIE.');
    } catch {
      setInfo(zeszyt);
    }
  }

  async function otworzSprawdzian(klucz: boolean) {
    // Okno otwieramy od razu (w kliknieciu), bo po await przegladarka blokuje popup.
    const okno = window.open('', '_blank');
    try {
      const url = await sprawdzianUrl(materialy!.folder, klucz);
      if (okno) okno.location.href = url;
      else window.location.href = url;
      setInfo(null);
    } catch (e) {
      okno?.close();
      setInfo(e instanceof Error ? e.message : 'Nie udało się otworzyć sprawdzianu.');
    }
  }

  const btn = 'rounded-md border border-gray-200 bg-white px-2.5 py-1 font-medium text-gray-700 hover:border-accent-300 hover:text-accent-700';
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm">
      <span className="mr-1 text-gray-500">Po dziale</span>
      <a href={zeszyt} target="_blank" rel="noreferrer" className={btn}>Zeszyt powtórzeniowy</a>
      <button type="button" onClick={kopiuj} className={btn}>Kopiuj link do VULCANA</button>
      <span className="mx-1 h-4 w-px bg-gray-300" aria-hidden="true" />
      <button type="button" onClick={() => otworzSprawdzian(false)} className={btn}>Sprawdzian A-D</button>
      <button type="button" onClick={() => otworzSprawdzian(true)} className={btn}>Klucz</button>
      {info && <span className="ml-auto text-xs text-gray-500">{info}</span>}
    </div>
  );
}
