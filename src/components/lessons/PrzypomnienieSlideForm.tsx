import type { Slide } from '../../data/types';
import { PRZYPOMNIENIA } from '../../data/przypomnienia';

type PrzypomnienieSlide = Extract<Slide, { kind: 'przypomnienie' }>;

export function PrzypomnienieSlideForm({ slide, onChange }: { slide: PrzypomnienieSlide; onChange: (next: PrzypomnienieSlide) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Przypomnienie</label>
      <select
        value={slide.przypomnienieId}
        onChange={(e) => onChange({ ...slide, przypomnienieId: e.target.value })}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">- wybierz przypomnienie -</option>
        {PRZYPOMNIENIA.map((p) => (
          <option key={p.id} value={p.id}>
            {p.naglowek ? `${p.naglowek}: ` : ''}{p.tytul} ({p.kroki.length} kroków)
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-gray-500">Na lekcji strzałka odsłania kolejne kroki (reguła, przykład z animacją), a gdy wszystko widać - idzie do następnego slajdu. Treść jest w src/data/przypomnienia.ts.</p>
    </div>
  );
}
