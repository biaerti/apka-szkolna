import type { Slide } from '../../data/types';
import { CWICZENIA } from '../../data/cwiczenia';

type CwiczenieSlide = Extract<Slide, { kind: 'cwiczenie' }>;

export function CwiczenieSlideForm({ slide, onChange }: { slide: CwiczenieSlide; onChange: (next: CwiczenieSlide) => void }) {
  const wybrane = CWICZENIA.find((c) => c.id === slide.cwiczenieId);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Ćwiczenie</label>
      <select
        value={slide.cwiczenieId}
        onChange={(e) => onChange({ ...slide, cwiczenieId: e.target.value })}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">- wybierz ćwiczenie -</option>
        {CWICZENIA.map((c) => (
          <option key={c.id} value={c.id}>
            {c.tytul} ({c.typ === 'tabela' ? `${c.wyrazy.length} wyrazów` : `${c.przyklady.length} przykładów`})
          </option>
        ))}
      </select>
      {wybrane && <p className="mt-2 text-sm text-gray-600">{wybrane.polecenie}</p>}
      <p className="mt-2 text-xs text-gray-500">Na lekcji wpisujecie odpowiedzi na slajdzie i klikacie „Sprawdź”. Przykłady są w src/data/cwiczenia4.ts.</p>
    </div>
  );
}
