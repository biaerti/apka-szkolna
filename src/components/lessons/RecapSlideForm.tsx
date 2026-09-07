import type { QuestionSet, Slide } from '../../data/types';
import { resolveRecapMode } from '../../lib/recap';
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
  const mode = resolveRecapMode(slide);
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
      {mode !== 'demo' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tryb rundy</label>
          {/* Jedyny aktualny tryb slajdu recap to kolo powtorzeniowe. 'po-lekcji'
              (stary tryb, wycofany - patrz src/lib/recap.ts) pokazujemy tylko wtedy,
              gdy slajd juz go ma (stare dane), zeby Select nie stal na wartosci
              bez opcji; wybor powtorzeniowego nadpisuje go na stale. */}
          <Select
            value={mode}
            onChange={(e) =>
              onChange({ ...slide, mode: e.target.value === 'po-lekcji' ? 'po-lekcji' : 'powtorzeniowe' })
            }
          >
            {mode === 'po-lekcji' && <option value="po-lekcji">koło po lekcji (stary tryb)</option>}
            <option value="powtorzeniowe">koło powtórzeniowe (pełne ocenianie)</option>
          </Select>
        </div>
      )}
    </div>
  );
}
