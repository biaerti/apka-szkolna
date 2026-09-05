// Menu rozwijane (akcje "wiecej", gotowe materialy). Panel renderuje sie przez
// portal z pozycja fixed, zeby nie przycinal go kontener tabeli z overflow-x-auto.
// Zamyka sie po wyborze, kliknieciu obok, Escape i przewinieciu strony.
// Klawiatura: strzalki gora/dol, Home/End, Enter/Spacja - jak natywne menu.

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export interface MenuAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** Krotkie wyjasnienie pod etykieta, np. dlaczego pozycja jest nieaktywna. */
  hint?: string;
  danger?: boolean;
}

export type MenuItem = MenuAction | 'separator';

export interface MenuTriggerProps {
  ref: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
}

export function Menu({
  items,
  renderTrigger,
  align = 'end',
}: {
  items: MenuItem[];
  renderTrigger: (props: MenuTriggerProps) => ReactNode;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [active, setActive] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const actions = items.filter((i): i is MenuAction => i !== 'separator');
  const enabledIdx = actions.map((a, i) => (a.disabled ? -1 : i)).filter((i) => i >= 0);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !panelRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const p = panelRef.current.getBoundingClientRect();
    const margin = 8;
    let left = align === 'end' ? t.right - p.width : t.left;
    left = Math.max(margin, Math.min(left, window.innerWidth - p.width - margin));
    let top = t.bottom + 4;
    if (top + p.height > window.innerHeight - margin) top = Math.max(margin, t.top - p.height - 4);
    setPos({ top, left });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        if (enabledIdx.length === 0) return;
        const cur = enabledIdx.indexOf(active);
        let next: number;
        if (e.key === 'Home') next = enabledIdx[0];
        else if (e.key === 'End') next = enabledIdx[enabledIdx.length - 1];
        else if (e.key === 'ArrowDown') next = enabledIdx[(cur + 1) % enabledIdx.length];
        else next = enabledIdx[(cur - 1 + enabledIdx.length) % enabledIdx.length];
        setActive(next);
        (panelRef.current?.querySelector(`[data-idx="${next}"]`) as HTMLElement | null)?.focus();
      }
    }
    const close = () => setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, active, enabledIdx]);

  function toggle() {
    setActive(-1);
    setPos(null);
    setOpen((o) => !o);
  }

  let actionIdx = -1;

  return (
    <>
      {renderTrigger({
        ref: (el) => {
          triggerRef.current = el;
        },
        onClick: toggle,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            className="fixed z-50 min-w-[14rem] max-w-sm rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg shadow-gray-900/10"
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden' }}
          >
            {items.map((item, i) => {
              if (item === 'separator') return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
              actionIdx += 1;
              const idx = actionIdx;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  data-idx={idx}
                  disabled={item.disabled}
                  tabIndex={-1}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                  className={clsx(
                    'flex w-full flex-col items-start px-3 py-1.5 text-left leading-snug outline-none',
                    'focus-visible:bg-gray-100 enabled:hover:bg-gray-100 disabled:cursor-default',
                    item.danger ? 'text-red-700' : 'text-gray-800',
                    item.disabled && 'text-gray-400',
                  )}
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="text-xs text-gray-500">{item.hint}</span>}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
