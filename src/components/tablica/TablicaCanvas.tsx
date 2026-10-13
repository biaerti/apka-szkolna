// Canvas Excalidraw dla "Tablicy dzialu". Osobny plik, bo strona laduje go
// leniwie - Excalidraw wazy ~1 MB i nie ma po co siedziec w glownym bundlu.
// Czcionki (Excalifont, Nunito) Excalidraw dociaga sam z CDN.

import { useEffect, useRef, useState } from 'react';
import { Excalidraw, convertToExcalidrawElements, getSceneVersion } from '@excalidraw/excalidraw';
import type { ExcalidrawElementSkeleton } from '@excalidraw/excalidraw/data/transform';
import type { BinaryFiles, ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import '@excalidraw/excalidraw/index.css';
import { wczytajTablice, zapiszTablice, type ScenaTablicy } from '../../data/tablice';
import type { SzkieletElementu } from '../../lib/tablicaDzialu';

export type StanZapisu = 'wczytuje' | 'zapisane' | 'zapisuje' | 'lokalnie' | 'blad';

interface Props {
  id: string;
  szkic: () => SzkieletElementu[];
  /** Zmienia sie przy kliknieciu "Nowa mapa" - canvas wstawia wtedy szkic od nowa. */
  resetToken: number;
  onStan: (stan: StanZapisu) => void;
}

const ZAPIS_PO_MS = 1200;

function zeSzkicu(szkic: SzkieletElementu[]): ExcalidrawElement[] {
  return convertToExcalidrawElements(szkic as unknown as ExcalidrawElementSkeleton[], { regenerateIds: true });
}

function dopasuj(instancja: ExcalidrawImperativeAPI) {
  instancja.scrollToContent(undefined, { fitToViewport: true, viewportZoomFactor: 0.8 });
}

/**
 * Wstawia mape dopiero po wczytaniu czcionek: Excalidraw mierzy szerokosc tekstu
 * przy tworzeniu elementu, a zmierzony zapasowa czcionka tekst bylby potem przyciety.
 */
async function wstawSzkic(instancja: ExcalidrawImperativeAPI, szkic: SzkieletElementu[]) {
  const probka = 'AaZzĄąĘęÓóŁłŚśŻżŹźĆćŃń✓';
  await Promise.all(['20px Excalifont', '20px Nunito'].map((font) => document.fonts.load(font, probka).catch(() => [])));
  instancja.updateScene({ elements: zeSzkicu(szkic) });
  dopasuj(instancja);
}

export default function TablicaCanvas({ id, szkic, resetToken, onStan }: Props) {
  const [initial, setInitial] = useState<ExcalidrawInitialDataState | null>(null);
  const api = useRef<ExcalidrawImperativeAPI | null>(null);
  const wersja = useRef<number>(-1);
  const oczekuje = useRef<ScenaTablicy | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const pierwszyReset = useRef(resetToken);
  /** Tablica jeszcze nie zapisana - po starcie Excalidraw wstawiamy mape. */
  const nowa = useRef(false);

  async function zapisz() {
    window.clearTimeout(timer.current);
    const scena = oczekuje.current;
    if (!scena) return;
    oczekuje.current = null;
    onStan('zapisuje');
    try {
      onStan((await zapiszTablice(id, scena)) === 'chmura' ? 'zapisane' : 'lokalnie');
    } catch {
      onStan('blad');
    }
  }

  useEffect(() => {
    let aktywny = true;
    onStan('wczytuje');
    void wczytajTablice(id).then((scena) => {
      if (!aktywny) return;
      nowa.current = !scena;
      setInitial({
        elements: (scena?.elements as ExcalidrawElement[] | undefined) ?? [],
        files: (scena?.files as BinaryFiles | undefined) ?? {},
        appState: { viewBackgroundColor: '#ffffff', currentItemFontFamily: 5, currentItemStrokeWidth: 2 },
        scrollToContent: true,
      });
      onStan('zapisane');
    });
    // Przy wyjsciu z tablicy dopisujemy to, co jeszcze czeka na zapis.
    const przedZamknieciem = () => void zapisz();
    window.addEventListener('beforeunload', przedZamknieciem);
    return () => {
      aktywny = false;
      window.removeEventListener('beforeunload', przedZamknieciem);
      void zapisz();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (resetToken === pierwszyReset.current || !api.current) return;
    void wstawSzkic(api.current, szkic());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  if (!initial) return <div className="flex h-full items-center justify-center text-sm text-gray-500">Wczytuję tablicę…</div>;

  return (
    <Excalidraw
      initialData={initial}
      excalidrawAPI={(instancja) => {
        if (api.current === instancja) return;
        api.current = instancja;
        // Na projektorze cala mapa ma byc widoczna od razu - dopasowujemy przyblizenie,
        // gdy Excalidraw zmierzy juz rozmiar canvasu.
        window.setTimeout(() => (nowa.current ? void wstawSzkic(instancja, szkic()) : dopasuj(instancja)), 100);
      }}
      langCode="pl-PL"
      theme="light"
      UIOptions={{ canvasActions: { toggleTheme: false, loadScene: false, saveToActiveFile: false } }}
      onChange={(elements, _appState, files) => {
        // onChange leci tez przy przewijaniu i zaznaczaniu - zapisujemy tylko zmiany rysunku.
        const nowa = getSceneVersion(elements) + Object.keys(files).length;
        if (wersja.current === -1) {
          wersja.current = nowa;
          return;
        }
        if (nowa === wersja.current) return;
        wersja.current = nowa;
        const widoczne = elements.filter((element) => !element.isDeleted);
        const uzyte = new Set<string>(widoczne.flatMap((element) => ('fileId' in element && element.fileId ? [element.fileId] : [])));
        oczekuje.current = {
          elements: widoczne as unknown[],
          files: Object.fromEntries(Object.entries(files).filter(([fileId]) => uzyte.has(fileId))),
        };
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => void zapisz(), ZAPIS_PO_MS);
      }}
    />
  );
}
