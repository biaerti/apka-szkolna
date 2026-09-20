// Pole dopisku na slajdzie: textarea plus uchwyt skalowania w prawym dolnym
// rogu.
//
// Uchwyt zmienia SZEROKOSC RAMKI I WIELKOSC LITER naraz (scaleTextBox w
// annotations.ts). Nauczyciel prowadzi lekcje przy klasie i nie ma czasu na
// osobny suwak wielkosci - ciagnie rog tak, jak ciagnie sie pole tekstowe w
// kazdym innym programie, a litery ida za ramka. Wysokosc dobiera sie sama do
// tresci, zeby dopisek nie mial pustego pasa pod ostatnim wierszem.
//
// Wszystkie wymiary sa w pikselach kartki 1280x720 (patrz AnnotationLayer) -
// dlatego przeliczamy ruch myszy przez skale kartki na ekranie.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { scaleTextBox, type TextBoxSize } from './annotations';

export interface AnnotationTextBoxProps {
  x: number;
  y: number;
  value: string;
  color: string;
  size: number;
  width: number;
  /** Ile miejsca zostalo do prawej krawedzi kartki - dalej pole nie roscie. */
  maxWidth: number;
  /** Ile pikseli ekranu przypada na piksel kartki - do przeliczenia ruchu uchwytu. */
  scale: number;
  onValue: (value: string) => void;
  onSize: (next: TextBoxSize) => void;
  onMove: (next: { x: number; y: number }) => void;
  onCommit: () => void;
  onCancel: () => void;
}

export function AnnotationTextBox({
  x,
  y,
  value,
  color,
  size,
  width,
  maxWidth,
  scale,
  onValue,
  onSize,
  onMove,
  onCommit,
  onCancel,
}: AnnotationTextBoxProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [resizing, setResizing] = useState(false);
  const [moving, setMoving] = useState(false);
  const startRef = useRef<{ x: number; box: TextBoxSize } | null>(null);
  const moveRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);

  // Fokus dopiero po zamontowaniu pola, a nie przez `autoFocus`: przegladarka w
  // ramach obslugi mousedown przenosi fokus na klikniety element (czyli z
  // powrotem na slajd), co natychmiast zamykalo swiezo otwarte pole.
  useEffect(() => {
    textRef.current?.focus();
    const el = textRef.current;
    if (el) el.selectionStart = el.selectionEnd = el.value.length;
  }, []);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [value, width, size]);

  function startResize(e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, box: { width, size } };
    setResizing(true);
  }

  function onResizeMove(e: ReactPointerEvent) {
    const start = startRef.current;
    if (!start || !resizing) return;
    const dx = (e.clientX - start.x) / (scale || 1);
    onSize(scaleTextBox(start.box, dx, maxWidth));
  }

  function endResize() {
    startRef.current = null;
    setResizing(false);
    textRef.current?.focus();
  }

  function startMove(e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    moveRef.current = { pointerX: e.clientX, pointerY: e.clientY, x, y };
    setMoving(true);
  }

  function move(e: ReactPointerEvent) {
    const start = moveRef.current;
    if (!start) return;
    const nextX = start.x + (e.clientX - start.pointerX) / (scale || 1);
    const nextY = start.y + (e.clientY - start.pointerY) / (scale || 1);
    onMove({ x: nextX, y: nextY });
  }

  function endMove() {
    moveRef.current = null;
    setMoving(false);
    textRef.current?.focus();
  }

  function changeFontSize(delta: number) {
    onSize({ width, size: Math.max(14, Math.min(160, size + delta)) });
    window.setTimeout(() => textRef.current?.focus(), 0);
  }

  return (
    <div className="absolute pt-8" style={{ left: x, top: y, width }} onPointerDown={(e) => e.stopPropagation()}>
      <div className="absolute left-0 top-0 flex h-8 min-w-max items-center justify-between gap-2 rounded-t-md bg-gray-950/95 px-2 text-white shadow-lg">
        <button
          type="button"
          aria-label="Przenieś dopisek"
          title="Przeciągnij, aby przenieść dopisek"
          onPointerDown={startMove}
          onPointerMove={move}
          onPointerUp={endMove}
          onPointerCancel={endMove}
          className="flex h-7 cursor-grab items-center gap-1.5 px-1 text-sm font-medium active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
            <i className="h-1 w-1 rounded-full bg-current" /><i className="h-1 w-1 rounded-full bg-current" />
            <i className="h-1 w-1 rounded-full bg-current" /><i className="h-1 w-1 rounded-full bg-current" />
          </span>
          Przenieś
        </button>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Zmniejsz tekst" title="Zmniejsz tekst" onPointerDown={(e) => e.preventDefault()} onClick={() => changeFontSize(-4)} className="h-7 w-7 rounded text-lg leading-none text-gray-200 hover:bg-white/10">−</button>
          <span className="min-w-8 text-center text-xs tabular-nums text-gray-300">{size}</span>
          <button type="button" aria-label="Powiększ tekst" title="Powiększ tekst" onPointerDown={(e) => e.preventDefault()} onClick={() => changeFontSize(4)} className="h-7 w-7 rounded text-lg leading-none text-gray-200 hover:bg-white/10">+</button>
          <button type="button" onPointerDown={(e) => e.preventDefault()} onClick={onCancel} className="h-7 rounded px-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">
            Anuluj
          </button>
          <button type="button" onPointerDown={(e) => e.preventDefault()} onClick={onCommit} className="h-7 rounded bg-white px-2 text-sm font-semibold text-gray-950 hover:bg-gray-100">
            Zapisz
          </button>
        </div>
      </div>
      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          // Enter zapisuje - dopiski przy klasie to jedna, dwie linijki, a
          // siegniecie po mysz do "Zapisz" (albo pamietanie Ctrl+Enter)
          // wybijalo z rytmu. Nowa linia: Shift+Enter.
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onCommit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        // Przeciaganie uchwytu zabiera fokus polu - zamkniecie dopisku w takiej
        // chwili kasowaloby wlasnie skalowany tekst.
        onBlur={() => {
          if (!resizing && !moving) onCommit();
        }}
        placeholder="Wpisz tekst...  Enter zapisuje"
        rows={1}
        className="block w-full resize-none overflow-hidden rounded-b-md border-2 px-3 py-2 font-semibold leading-tight outline-none"
        style={{
          color,
          borderColor: color,
          // Neutralna przymglona podkladka - czytelna i na ciemnym slajdzie, i na jasnej notatce.
          background: color === '#111827' ? 'rgba(255,255,255,0.94)' : 'rgba(17,24,39,0.94)',
          fontSize: size,
        }}
      />
      <div
        role="slider"
        tabIndex={-1}
        aria-label="Wielkość pola tekstowego"
        aria-valuenow={size}
        title="Przeciągnij, żeby zmienić wielkość pola i liter"
        onPointerDown={startResize}
        onPointerMove={onResizeMove}
        onPointerUp={endResize}
        onPointerCancel={endResize}
        className="absolute -bottom-3 -right-3 flex h-8 w-8 cursor-nwse-resize items-center justify-center rounded-full border-2 bg-gray-950 shadow-lg"
        style={{ borderColor: color, touchAction: 'none' }}
      />
    </div>
  );
}
