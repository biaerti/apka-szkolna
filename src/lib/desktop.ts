// Mostek do shella desktopowego (Tauri v2, folder desktop/). Trasa /panel
// dziala tez w zwyklej przegladarce - wtedy isTauri() = false, a wszystkie
// funkcje sa no-opami, wiec panel da sie testowac bez budowania exe.
//
// Wzorowane na desktop-bridge.ts z notatka-lekarza, ale okrojone do tego, co
// panel naprawde robi: zmiana rozmiaru okna (pigulka <-> kolo), przeciaganie,
// zamkniecie i zdarzenie "zwin sie" z paska zadan.

type TauriGlobal = {
  core: { invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown> };
  window?: {
    getCurrentWindow: () => {
      close: () => Promise<void>;
      setSize: (size: unknown) => Promise<void>;
      setPosition: (pos: unknown) => Promise<void>;
      outerPosition: () => Promise<{ x: number; y: number }>;
      scaleFactor: () => Promise<number>;
      startDragging: () => Promise<void>;
    };
    currentMonitor: () => Promise<{
      size: { width: number; height: number };
      position: { x: number; y: number };
    } | null>;
  };
  dpi?: {
    LogicalSize: new (width: number, height: number) => unknown;
    PhysicalPosition: new (x: number, y: number) => unknown;
  };
  event?: {
    listen: (event: string, handler: (ev: unknown) => void) => Promise<() => void | Promise<void>>;
  };
};

/** Nazwa musi zgadzac sie ze stala ZDARZENIE w desktop/src-tauri/src/pasek_zadan.rs. */
const ZDARZENIE_ZWIN = 'panel://zwin-do-pigulki';

function tauri(): TauriGlobal | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __TAURI__?: TauriGlobal }).__TAURI__ ?? null;
}

export function isTauri(): boolean {
  return tauri() !== null;
}

/**
 * Ustawia rozmiar okna (px logiczne) i wpycha je z powrotem w monitor.
 * Tauri kotwiczy setSize w lewym gornym rogu, wiec rozwiniecie pigulki stojacej
 * przy dolnej krawedzi wyjechaloby poza ekran - stad korekta pozycji.
 */
export async function ustawRozmiarOkna(width: number, height: number): Promise<void> {
  const t = tauri();
  if (!t?.window || !t.dpi) return;
  try {
    const okno = t.window.getCurrentWindow();
    await okno.setSize(new t.dpi.LogicalSize(width, height));
    const mon = await t.window.currentMonitor();
    if (!mon) return;
    const scale = await okno.scaleFactor();
    const pos = await okno.outerPosition();
    const wPhys = Math.round(width * scale);
    const hPhys = Math.round(height * scale);
    // Zapas na pasek zadan, zeby dolna krawedz panelu nie chowala sie pod nim.
    const zapasDol = Math.round(48 * scale);
    const maxX = mon.position.x + mon.size.width - wPhys;
    const maxY = mon.position.y + mon.size.height - hPhys - zapasDol;
    const x = Math.min(Math.max(pos.x, mon.position.x), Math.max(mon.position.x, maxX));
    const y = Math.min(Math.max(pos.y, mon.position.y), Math.max(mon.position.y, maxY));
    if (x !== pos.x || y !== pos.y) {
      await okno.setPosition(new t.dpi.PhysicalPosition(x, y));
    }
  } catch {
    // Brak uprawnienia albo starszy exe - panel dziala dalej, tylko sie nie przesuwa.
  }
}

/**
 * Reczne przeciaganie okna. Nie uzywamy data-tauri-drag-region, bo ten polyka
 * klik - a uchwyt pigulki ma byc jednoczesnie przyciskiem "rozwin".
 */
export async function przeciagnijOkno(): Promise<void> {
  const t = tauri();
  if (!t?.window) return;
  try {
    await t.window.getCurrentWindow().startDragging();
  } catch {}
}

export async function zamknijOkno(): Promise<void> {
  const t = tauri();
  if (!t?.window) return;
  try {
    await t.window.getCurrentWindow().close();
  } catch {}
}

/**
 * Klik w ikone na pasku zadan nie chowa okna - natywna strona przechwytuje
 * minimalizacje i przysyla to zdarzenie, a panel zwija sie do pigulki.
 * Zasada z notatki lekarza: nie ma stanu "apka dziala, a nic nie widac".
 */
export async function nasluchujZwiniecia(onZwin: () => void): Promise<(() => void | Promise<void>) | null> {
  const t = tauri();
  if (!t?.event) return null;
  try {
    return await t.event.listen(ZDARZENIE_ZWIN, () => onZwin());
  } catch {
    return null;
  }
}
