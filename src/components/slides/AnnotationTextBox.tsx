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
  onCommit,
  onCancel,
}: AnnotationTextBoxProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef<{ x: number; box: TextBoxSize } | null>(null);

  // Fokus dopiero po zamontowaniu pola, a nie przez `autoFocus`: przegladarka w
  // ramach obslugi mousedown przenosi fokus na klikniety element (czyli z
  // powrotem na slajd), co natychmiast zamykalo swiezo otwarte pole.
  useEffect(() => {
    textRef.current?.focus();
    const el = textRef.current;
    if (el) el.selectionStart = el.selectionEnd = el.value.length;
  }, []);

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

  // Wiersze licza sie z tresci, zeby ramka nie miala pustego pasa pod tekstem.
  const rows = Math.max(1, value.split('\n').length);

  return (
    <div className="absolute" style={{ left: x, top: y, width }} onPointerDown={(e) => e.stopPropagation()}>
      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
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
          if (!resizing) onCommit();
        }}
        placeholder="Wpisz tekst, Enter zatwierdza"
        rows={rows}
        className="block w-full resize-none overflow-hidden rounded-md border-2 border-dashed px-2 py-1 font-semibold leading-tight outline-none"
        style={{
          color,
          borderColor: color,
          // Neutralna przymglona podkladka - czytelna i na ciemnym slajdzie, i na jasnej notatce.
          background: 'rgba(128,128,128,0.25)',
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
        className="absolute -bottom-2 -right-2 h-6 w-6 cursor-nwse-resize rounded-full border-2 shadow"
        style={{ borderColor: color, background: 'rgba(128,128,128,0.55)', touchAction: 'none' }}
      />
    </div>
  );
}
