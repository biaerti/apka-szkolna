import type { QuestionSet, Slide } from '../../data/types';
import { TitleSlideForm } from './TitleSlideForm';
import { TextSlideForm } from './TextSlideForm';
import { TaskSlideForm } from './TaskSlideForm';
import { ReadSlideForm } from './ReadSlideForm';
import { NoteSlideForm } from './NoteSlideForm';
import { RecapSlideForm } from './RecapSlideForm';
import { ImageSlideForm } from './ImageSlideForm';

export function SlideForm({
  slide,
  onChange,
  questionSets,
}: {
  slide: Slide;
  onChange: (next: Slide) => void;
  questionSets: QuestionSet[];
}) {
  switch (slide.kind) {
    case 'title':
      return <TitleSlideForm slide={slide} onChange={onChange} />;
    case 'text':
      return <TextSlideForm slide={slide} onChange={onChange} />;
    case 'task':
      return <TaskSlideForm slide={slide} onChange={onChange} />;
    case 'read':
      return <ReadSlideForm slide={slide} onChange={onChange} />;
    case 'note':
      return <NoteSlideForm slide={slide} onChange={onChange} />;
    case 'recap':
      return <RecapSlideForm slide={slide} onChange={onChange} questionSets={questionSets} />;
    case 'image':
      return <ImageSlideForm slide={slide} onChange={onChange} />;
    default:
      return null;
  }
}
