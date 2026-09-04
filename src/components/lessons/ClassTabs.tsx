// Przelacznik klas na ekranie Lekcje - kazda klasa ma osobna kolejke lekcji
// i osobny postep (status), pytania sa wspolne (te same zestawy moga byc
// przypisane do kilku klas rownoleglych, np. wszystkie czwarte).

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
    <div className="mb-4 flex flex-wrap gap-2">
      {classes.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={
            c.id === activeId
              ? 'rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white'
              : 'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
          }
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
