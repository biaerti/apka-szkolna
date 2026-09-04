// Renderuje pojedynczy slajd w pelnym rozmiarze (ciemne tlo, jasny tekst) -
// wspolny komponent uzywany zarowno przez prezentacje, jak i podglad w edytorze.

import type { Slide } from '../../data/types';
import { TitleSlideView } from './TitleSlideView';
import { TextSlideView } from './TextSlideView';
import { TaskSlideView } from './TaskSlideView';
import { ReadSlideView } from './ReadSlideView';
import { NoteSlideView } from './NoteSlideView';
import { RecapSlideView } from './RecapSlideView';
import { ImageSlideView } from './ImageSlideView';

export function SlideView({
  slide,
  classId,
  onRecapExit,
}: {
  slide: Slide;
  classId: string;
  onRecapExit?: () => void;
}) {
  return (
    <div className="h-full w-full bg-gray-950 text-gray-100">
      {slide.kind === 'title' && <TitleSlideView slide={slide} />}
      {slide.kind === 'text' && <TextSlideView slide={slide} />}
      {slide.kind === 'task' && <TaskSlideView slide={slide} />}
      {slide.kind === 'read' && <ReadSlideView slide={slide} />}
      {slide.kind === 'note' && <NoteSlideView slide={slide} />}
      {slide.kind === 'image' && <ImageSlideView slide={slide} />}
      {slide.kind === 'recap' && <RecapSlideView slide={slide} classId={classId} onExit={onRecapExit} />}
    </div>
  );
}
