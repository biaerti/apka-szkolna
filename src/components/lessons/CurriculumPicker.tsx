// Wybor kodow podstawy programowej (do dziennika Vulcan) - wyszukiwarka + grupy + checkboxy + chipy.

import { useMemo, useState } from 'react';
import { CURRICULUM } from '../../data/podstawa';
import { Input } from '../ui/Input';

export function CurriculumPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (codes: string[]) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRICULUM;
    return CURRICULUM.filter(
      (item) => item.code.toLowerCase().includes(q) || item.text.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof CURRICULUM>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function toggle(code: string) {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700"
            >
              {code}
              <button
                type="button"
                onClick={() => toggle(code)}
                className="text-accent-500 hover:text-accent-800"
                aria-label={`Usuń kod ${code}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj kodu lub treści..."
        className="mb-2"
      />
      <div className="max-h-56 overflow-y-auto rounded-md border border-gray-200">
        {grouped.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-gray-500">Brak wyników.</p>
        ) : (
          grouped.map(([group, items]) => (
            <div key={group} className="border-b border-gray-100 last:border-b-0">
              <p className="bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group}
              </p>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <label
                    key={item.code}
                    className="flex cursor-pointer items-start gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                      checked={selected.includes(item.code)}
                      onChange={() => toggle(item.code)}
                    />
                    <span>
                      <span className="font-medium text-gray-900">{item.code}</span> {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
