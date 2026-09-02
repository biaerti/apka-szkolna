import type { Slide } from '../../data/types';
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
  return (
    <div className="h-full">
      <RecapSession classId={classId} setId={slide.questionSetId} onExit={onExit} embedded />
    </div>
  );
}
