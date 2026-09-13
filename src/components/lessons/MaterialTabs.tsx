import clsx from 'clsx';
import type { LessonMaterialType } from '../../data/types';

export function MaterialTabs({ active, counts, onSelect }: { active: LessonMaterialType; counts: Record<LessonMaterialType, number>; onSelect: (type: LessonMaterialType) => void }) {
  const tabs: Array<{ type: LessonMaterialType; label: string }> = [
    { type: 'textbook', label: 'Z podręcznika' },
    { type: 'review', label: 'Powtórzeniowe' },
  ];
  return (
    <div role="tablist" aria-label="Rodzaj lekcji" className="mb-4 inline-flex rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.type}
          type="button"
          role="tab"
          aria-selected={active === tab.type}
          onClick={() => onSelect(tab.type)}
          className={clsx(
            'flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
            active === tab.type ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-900',
          )}
        >
          {tab.label}
          <span className={clsx('rounded-full px-2 py-0.5 text-xs tabular-nums', active === tab.type ? 'bg-accent-50 text-accent-700' : 'bg-gray-200 text-gray-600')}>{counts[tab.type]}</span>
        </button>
      ))}
    </div>
  );
}
