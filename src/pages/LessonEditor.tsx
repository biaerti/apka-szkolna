import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { AddSlideMenu } from '../components/lessons/AddSlideMenu';
import { SlideListItem } from '../components/lessons/SlideListItem';
import { SlideForm } from '../components/lessons/SlideForm';
import { SlidePreview } from '../components/lessons/SlidePreview';
import { CurriculumPicker } from '../components/lessons/CurriculumPicker';
import { createSlide, duplicateSlide, type SlideKind } from '../components/lessons/slideDefaults';
import type { Slide } from '../data/types';
import { classesOfGrade } from '../lib/grade';
import { classLessonCode } from '../lib/lessonCode';
import { lessonMaterialType } from '../lib/lessonMaterial';

export function LessonEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessons = useStore((s) => s.lessons);
  const classes = useStore((s) => s.classes);
  const questionSets = useStore((s) => s.questionSets);
  // updateLessonFromEditor (nie zwykle updateLesson) - zapis z tego ekranu ma
  // oznaczyc lekcje jako "edytowana recznie" (patrz store.manuallyEditedLessonIds),
  // zeby "Odswiez wstawione materialy" nie nadpisalo cicho zmian nauczyciela.
  const updateLesson = useStore((s) => s.updateLessonFromEditor);

  const lesson = lessons.find((l) => l.id === id);
  const classId = searchParams.get('klasa') ?? (lesson ? classesOfGrade(classes, lesson.grade)[0]?.id : undefined);
  const materialType = searchParams.get('typ') ?? lesson?.materialType ?? 'textbook';
  const displayCode = lesson && classId ? classLessonCode(lessons, lesson, classId) : lesson?.code;
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(lesson?.slides[0]?.id ?? null);

  const selectedIndex = useMemo(
    () => lesson?.slides.findIndex((s) => s.id === selectedSlideId) ?? -1,
    [lesson, selectedSlideId],
  );
  const selectedSlide = selectedIndex >= 0 ? lesson?.slides[selectedIndex] : undefined;

  const sortedQuestionSets = useMemo(
    () => [...questionSets].sort((a, b) => a.name.localeCompare(b.name, 'pl')),
    [questionSets],
  );

  if (!lesson) {
    return (
      <EmptyState
        title="Nie znaleziono lekcji"
        description="Ta lekcja mogła zostać usunięta."
        action={
          <Button variant="secondary" onClick={() => navigate('/lekcje')}>
            Wróć do listy lekcji
          </Button>
        }
      />
    );
  }

  function setSlides(slides: Slide[]) {
    if (!lesson) return;
    updateLesson(lesson.id, { slides });
  }

  function addSlide(kind: SlideKind) {
    if (!lesson) return;
    const slide = createSlide(kind, lesson.slides);
    setSlides([...lesson.slides, slide]);
    setSelectedSlideId(slide.id);
  }

  function moveSlide(index: number, direction: 'up' | 'down') {
    if (!lesson) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= lesson.slides.length) return;
    const next = [...lesson.slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
  }

  function duplicateAt(index: number) {
    if (!lesson) return;
    const copy = duplicateSlide(lesson.slides[index]);
    const next = [...lesson.slides];
    next.splice(index + 1, 0, copy);
    setSlides(next);
    setSelectedSlideId(copy.id);
  }

  function removeAt(index: number) {
    if (!lesson) return;
    const removedId = lesson.slides[index].id;
    const next = lesson.slides.filter((_, i) => i !== index);
    setSlides(next);
    if (selectedSlideId === removedId) {
      setSelectedSlideId(next[Math.max(0, index - 1)]?.id ?? null);
    }
  }

  function updateSlide(next: Slide) {
    if (!lesson) return;
    setSlides(lesson.slides.map((s) => (s.id === next.id ? next : s)));
  }

  return (
    <div>
      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">
            <button
              className="text-gray-500 hover:text-accent-700 hover:underline"
              onClick={() => navigate(`/lekcje?klasa=${classId}&typ=${materialType}`)}
            >
              Lekcje
            </button>
            <span className="mx-1.5 text-gray-400">/</span>
            {displayCode && <span className="mr-2 font-semibold tabular-nums text-gray-500">{displayCode}</span>}
            <span className="text-gray-700">{lesson.title || 'Nowa lekcja'}</span>
          </p>
          <Button onClick={() => navigate(`/lekcje/${lesson.id}/pokaz/${classId}?typ=${materialType}`)}>Pokaż</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[7rem_1fr] lg:grid-cols-[7rem_1fr_1fr]">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kod</label>
            {/* W materiale z podrecznika kod zalezy od postepu aktywnej klasy. */}
            <Input
              value={displayCode ?? ''}
              disabled={lessonMaterialType(lesson) === 'textbook'}
              onChange={(e) => updateLesson(lesson.id, { code: e.target.value.trim() || undefined })}
              placeholder="4.1"
            />
            {lessonMaterialType(lesson) === 'textbook' && <p className="mt-1 text-xs text-gray-500">Numer wynika z ukończonych lekcji tej klasy.</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł</label>
            <Input value={lesson.title} onChange={(e) => updateLesson(lesson.id, { title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dział</label>
            {/* Grupuje lekcje na liscie pod wspolnym naglowkiem, np. "Powtórka 1-3". Puste = bez naglowka. */}
            <Input
              value={lesson.dzial ?? ''}
              onChange={(e) => updateLesson(lesson.id, { dzial: e.target.value || undefined })}
              placeholder="np. Powtórka 1-3"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rodzaj materiału</label>
            <Select value={lesson.materialType ?? 'textbook'} onChange={(e) => updateLesson(lesson.id, { materialType: e.target.value as 'review' | 'textbook' })}>
              <option value="textbook">Z podręcznika</option>
              <option value="review">Powtórzeniowy</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Strona podręcznika</label>
              <Input type="number" min={1} value={lesson.textbookPage ?? ''} onChange={(e) => updateLesson(lesson.id, { textbookPage: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Strona ćwiczeń</label>
              <Input type="number" min={1} value={lesson.exercisePage ?? ''} onChange={(e) => updateLesson(lesson.id, { exercisePage: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notatka do zeszytu - A5</label>
            <textarea
              value={lesson.notebookNote ?? ''}
              onChange={(e) => updateLesson(lesson.id, { notebookNote: e.target.value || undefined })}
              rows={6}
              placeholder="Krótka notatka lub szablon do uzupełnienia przez ucznia"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Plan lekcji dla mnie</label>
            <textarea
              value={lesson.teacherPlan ?? ''}
              onChange={(e) => updateLesson(lesson.id, { teacherPlan: e.target.value || undefined })}
              rows={8}
              placeholder="Co czytamy, o czym powiedzieć, jak wyjaśnić, co narysować na tablicy. Widać tylko pod przyciskiem Plan, nie na projektorze."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Zestaw pytań do koła</label>
            {/* Zestaw pytan do kola powtorzeniowego na poczatku nastepnej lekcji
                (pytania inne niz zadania z lekcji). Kolo na lekcji nie korzysta
                z zestawu - losuje osobe do zadania ze slajdu task. Stary tryb
                po-lekcji - patrz src/lib/recap.ts (RecapMode). */}
            <div className="flex items-center gap-2">
              <Select
                value={lesson.questionSetId ?? ''}
                onChange={(e) => updateLesson(lesson.id, { questionSetId: e.target.value || undefined })}
              >
                <option value="">Brak</option>
                {sortedQuestionSets.map((qs) => (
                  <option key={qs.id} value={qs.id}>
                    {qs.name}
                  </option>
                ))}
              </Select>
              {lesson.questionSetId && (
                <button
                  className="shrink-0 text-sm text-accent-700 hover:underline"
                  onClick={() => navigate(`/pytania/${lesson.questionSetId}?lekcja=${lesson.id}`)}
                >
                  Edytuj pytania
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">Do dziennika</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Temat do wpisania w dzienniku</label>
            <Input
              value={lesson.registerTopic ?? ''}
              onChange={(e) => updateLesson(lesson.id, { registerTopic: e.target.value || undefined })}
              placeholder={lesson.title || 'Temat lekcji'}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kody podstawy programowej</label>
            <CurriculumPicker
              selected={lesson.curriculum ?? []}
              onChange={(codes) => updateLesson(lesson.id, { curriculum: codes.length > 0 ? codes : undefined })}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="mb-3">
            <AddSlideMenu onAdd={addSlide} />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            {lesson.slides.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-gray-500">Brak slajdów. Dodaj pierwszy powyżej.</p>
            ) : (
              lesson.slides.map((slide, idx) => (
                <SlideListItem
                  key={slide.id}
                  slide={slide}
                  index={idx}
                  total={lesson.slides.length}
                  selected={slide.id === selectedSlideId}
                  onSelect={() => setSelectedSlideId(slide.id)}
                  onMoveUp={() => moveSlide(idx, 'up')}
                  onMoveDown={() => moveSlide(idx, 'down')}
                  onDuplicate={() => duplicateAt(idx)}
                  onRemove={() => removeAt(idx)}
                />
              ))
            )}
          </div>
        </div>

        <div>
          {selectedSlide ? (
            <div className="space-y-4">
              <SlidePreview
                slide={selectedSlide}
                classId={classId ?? ''}
                lessonCode={displayCode}
                lessonTopic={lesson.registerTopic || lesson.title}
              />
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <SlideForm
                  slide={selectedSlide}
                  onChange={updateSlide}
                  questionSets={questionSets}
                  lessonTopic={lesson.registerTopic || lesson.title}
                  lessonCode={displayCode}
                />
              </div>
            </div>
          ) : (
            <EmptyState title="Wybierz slajd" description="Zaznacz slajd z listy po lewej albo dodaj nowy." />
          )}
        </div>
      </div>
    </div>
  );
}
