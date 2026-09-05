import type { QuestionSet, Slide } from '../../data/types';
import { Select } from '../ui/Select';

type RecapSlide = Extract<Slide, { kind: 'recap' }>;

export function RecapSlideForm({
  slide,
  onChange,
  questionSets,
}: {
  slide: RecapSlide;
  onChange: (next: RecapSlide) => void;
  questionSets: QuestionSet[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Zestaw pytań</label>
        <Select value={slide.questionSetId} onChange={(e) => onChange({ ...slide, questionSetId: e.target.value })}>
          <option value="">Wybierz zestaw...</option>
          {questionSets.map((qs) => (
            <option key={qs.id} value={qs.id}>
              {qs.name}
            </option>
          ))}
        </Select>
        {questionSets.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">
            Brak zestawów pytań. Zestaw dodaje się z listy lekcji: „dodaj pytania do koła" przy lekcji.
          </p>
        )}
      </div>
    </div>
  );
}
