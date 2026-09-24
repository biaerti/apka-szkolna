import type { Slide } from '../../data/types';
import { CZYTANKI } from '../../data/czytanki';

type CzytankaSlide = Extract<Slide, { kind: 'czytanka' }>;

export function CzytankaSlideForm({ slide, onChange }: { slide: CzytankaSlide; onChange: (next: CzytankaSlide) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Czytanka</label>
      <select
        value={slide.czytankaId}
        onChange={(e) => onChange({ ...slide, czytankaId: e.target.value })}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">- wybierz czytankę -</option>
        {CZYTANKI.map((c) => (
          <option key={c.id} value={c.id}>
            {c.lekcja}. {c.title}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-gray-500">Tekst podświetla się w rytm lektora. Wymaga pliku z czasami słów (audio-czytanki/synchronizuj.py).</p>
    </div>
  );
}
