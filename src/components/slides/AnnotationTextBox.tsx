// Pole dopisku na slajdzie - pasek narzedzi z boku, tak jak w multibooku GWO:
// kosz, A+/A- i uchwyt do noszenia pola po kartce.
//
// Pole jest "co widzisz, to dostaniesz": tekst w trakcie pisania stoi w tym
// samym punkcie kartki, ma te sama wielkosc liter i to samo zawijanie co gotowy
// dopisek (AnnotationTexts). Dlatego textarea nie ma ani ramki, ani wyscielenia
// - ramke rysuje podkladka LEZACA OBOK tekstu (ujemny inset), a pasek narzedzi
// wisi absolutnie poza polem. Nic z tego nie przesuwa liter, wiec zatwierdzenie
// dopisku nie jest juz skokiem.
//
// Uchwyt w prawym dolnym rogu zmienia SZEROKOSC RAMKI I WIELKOSC LITER naraz
// (scaleTextBox w annotations.ts) - ciagnie sie rog tak jak w kazdym innym
// programie, a litery ida za ramka. A+/A- robia to samo klikiem, gdy uchwyt
// jest za blisko krawedzi kartki.
//
// Wszystkie wymiary sa w pikselach kartki 1280x720 (patrz AnnotationLayer) -
// dlatego przeliczamy ruch myszy przez skale kartki na ekranie.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { scaleTextBox, TEXT_SIZE_MAX, TEXT_SIZE_MIN, type TextBoxSize } from './annotations';

export interface AnnotationTextBoxProps {
  x: number;
  y: number;
  value: string;
  color: string;
  size: number;
  width: number;
  /** Ile miejsca zostalo do prawej krawedzi kartki - dalej pole nie rosnie. */
  maxWidth: number;
  /** Ile pikseli ekranu przypada na piksel kartki - do przeliczenia ruchu uchwytu. */
  scale: number;
  onValue: (value: string) => void;
  onSize: (next: TextBoxSize) => void;
  onMove: (next: { x: number; y: number }) => void;
  onCommit: () => void;
  onCancel: () => void;
  /** Kosz: wyrzuca dopisek - takze ten, ktory juz stal na slajdzie. */
  onDelete: () => void;
}

/** Szerokosc paska narzedzi w pikselach kartki - po to, zeby wiedziec, czy miesci sie z lewej. */
const TOOLBAR_W = 150;

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
  onDelete,
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

  /** A+ / A-: ta sama proporcja co uchwyt, wiec ramka i litery nie rozjezdzaja sie. */
  function changeFontSize(step: number) {
    const next = Math.max(TEXT_SIZE_MIN, Math.min(TEXT_SIZE_MAX, Math.round(size * step)));
    if (next === size) return;
    onSize({ width: Math.min(maxWidth, Math.round((width * next) / size)), size: next });
    window.setTimeout(() => textRef.current?.focus(), 0);
  }

  // Pasek stoi z lewej strony pola (jak w GWO). Przy samej krawedzi kartki nie
  // ma tam miejsca - wtedy siada nad polem.
  const toolbarStyle =
    x > TOOLBAR_W + 16 ? { right: '100%', top: 0, marginRight: 10 } : { left: 0, bottom: '100%', marginBottom: 10 };

  const buttonClass = 'flex h-9 w-9 items-center justify-center rounded text-gray-100 hover:bg-white/15';

  return (
    <div className="absolute" style={{ left: x, top: y, width }} onPointerDown={(e) => e.stopPropagation()}>
      {/* Ramka i podkladka leza OBOK tekstu, nie pod nim - inaczej przesuwalyby litery. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded"
        style={{
          inset: -10,
          border: `2px dashed ${color}`,
          opacity: 0.6,
          // Neutralna przymglona podkladka - czytelna i na ciemnym slajdzie, i na jasnej notatce.
          background: color === '#111827' ? 'rgba(255,255,255,0.88)' : 'rgba(17,24,39,0.88)',
        }}
      />

      <div className="absolute flex items-center gap-0.5 rounded-md bg-gray-950/95 px-1 shadow-lg" style={toolbarStyle}>
        <button
          type="button"
          aria-label="Usuń dopisek"
          title="Usuń dopisek"
          onPointerDown={(e) => e.preventDefault()}
          onClick={onDelete}
          className={buttonClass}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M10 7V5h4v2M7 7l1 12h8l1-12M10 11v5M14 11v5" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Powiększ tekst"
          title="Powiększ tekst"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => changeFontSize(1.15)}
          className={buttonClass}
        >
          <span className="text-lg leading-none">A</span>
          <span className="ml-0.5 text-xs leading-none">+</span>
        </button>
        <button
          type="button"
          aria-label="Zmniejsz tekst"
          title="Zmniejsz tekst"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => changeFontSize(1 / 1.15)}
          className={buttonClass}
        >
          <span className="text-sm leading-none">A</span>
          <span className="ml-0.5 text-xs leading-none">−</span>
        </button>
        <button
          type="button"
          aria-label="Przenieś dopisek"
          title="Przeciągnij, aby przenieść dopisek"
          onPointerDown={startMove}
          onPointerMove={move}
          onPointerUp={endMove}
          onPointerCancel={endMove}
          className="flex h-9 w-8 cursor-grab items-center justify-center rounded text-gray-100 hover:bg-white/15 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />
          </svg>
        </button>
      </div>

      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          // Enter zapisuje - dopiski przy klasie to jedna, dwie linijki, a
          // siegniecie po mysz wybijalo z rytmu. Nowa linia: Shift+Enter.
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
        placeholder="Wpisz tekst…"
        rows={1}
        // Zero ramki i zero wyscielenia: litery maja stac tam, gdzie stanie
        // gotowy dopisek (ten sam left/top/fontSize co w AnnotationTexts).
        className="relative block w-full resize-none overflow-hidden border-0 p-0 font-semibold leading-tight outline-none"
        style={{ color, caretColor: color, background: 'transparent', fontSize: size }}
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
        className="absolute -bottom-4 -right-4 flex h-7 w-7 cursor-nwse-resize items-center justify-center rounded-full border-2 bg-gray-950 shadow-lg"
        style={{ borderColor: color, touchAction: 'none' }}
      />
    </div>
  );
}
