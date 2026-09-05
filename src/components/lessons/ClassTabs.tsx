// Przelacznik klas na ekranie Lekcje. Lista lekcji jest wspolna dla rocznika,
// zakladka wybiera KLASE - czyli czyj postep ogladamy i dla kogo "Pokaz".

import clsx from 'clsx';
import type { SchoolClass } from '../../data/types';

export function ClassTabs({
  classes,
  activeId,
  onSelect,
}: {
  classes: SchoolClass[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Klasa" className="mb-4 flex flex-wrap gap-1 border-b border-gray-200">
      {classes.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(c.id)}
            className={clsx(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-500',
              active
                ? 'border-accent-600 text-accent-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800',
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
