import clsx from 'clsx';
import type { LessonSection } from '../../lib/lessonMaterial';

// Zakladki listy lekcji: Powtorzeniowe | Dzial 1 | Dzial 2 ... Zamiast
// naglowkow grup w tabeli - jeden dzial na raz, krotsza lista.
export function MaterialTabs({ sections, activeKey, onSelect }: { sections: LessonSection[]; activeKey: string; onSelect: (key: string) => void }) {
  return (
    <div role="tablist" aria-label="Dział" className="mb-4 inline-flex flex-wrap rounded-lg bg-gray-100 p-1">
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          role="tab"
          title={section.title}
          aria-selected={activeKey === section.key}
          onClick={() => onSelect(section.key)}
          className={clsx(
            'flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
            activeKey === section.key ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-900',
          )}
        >
          {section.label}
          <span className={clsx('rounded-full px-2 py-0.5 text-xs tabular-nums', activeKey === section.key ? 'bg-accent-50 text-accent-700' : 'bg-gray-200 text-gray-600')}>{section.lessons.length}</span>
        </button>
      ))}
    </div>
  );
}
