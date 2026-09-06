import type { Slide } from '../../data/types';
import { resolveRecapMode } from '../../lib/recap';
import { RecapSession } from '../recap/RecapSession';

export function RecapSlideView({
  slide,
  classId,
  onExit,
}: {
  slide: Extract<Slide, { kind: 'recap' }>;
  classId: string;
  onExit?: () => void;
}) {
  const mode = resolveRecapMode(slide);
  return (
    <div className="h-full">
      <RecapSession
        classId={classId}
        setId={slide.questionSetId}
        onExit={onExit}
        embedded
        demoVariant={mode === 'demo'}
        recapMode={mode === 'powtorzeniowe' ? 'powtorzeniowe' : 'po-lekcji'}
      />
    </div>
  );
}
