// "Zestaw pytań" z menu wiersza lekcji: caly material pytaniowy lekcji w jednym
// miejscu, w dwoch grupach, ktore nauczyciel rozroznia na co dzien:
//
// - ZADANIA (Z1, Z2...) - polecenia ze slajdow, robione NA lekcji,
// - PYTANIA POWTORZENIOWE (PZ1, PZ2...) - zestaw do kola na poczatku
//   nastepnej lekcji.
//
// Wszystko jest edytowalne od razu, bez wchodzenia w edytor lekcji. Lekcja i
// zestaw pytan naleza do ROCZNIKA, wiec kazda poprawka dziala od razu we
// wszystkich jego klasach.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, Question, Slide } from '../../data/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { lessonReviewQuestions, lessonTasks } from '../../lib/lessonQuestions';

export function LessonQuestionsModal({
  lesson,
  questions,
  classNames,
  onClose,
  onChangeSlides,
  onChangeQuestion,
  onMoveQuestion,
  onRemoveQuestion,
  onAddQuestion,
  onCreateQuestionSet,
}: {
  lesson: Lesson;
  questions: Question[];
  classNames: string;
  onClose: () => void;
  onChangeSlides: (slides: Slide[]) => void;
  onChangeQuestion: (id: string, patch: Partial<Question>) => void;
  onMoveQuestion: (id: string, direction: 'up' | 'down') => void;
  onRemoveQuestion: (id: string) => void;
  onAddQuestion: (text: string) => void;
  onCreateQuestionSet: () => void;
}) {
  const navigate = useNavigate();
  const [newText, setNewText] = useState('');

  const tasks = lessonTasks(lesson);
  const review = lessonReviewQuestions(lesson, questions);
  const byId = new Map(questions.map((q) => [q.id, q]));

  function updateTask(slideId: string, patch: { title?: string; body?: string }) {
    onChangeSlides(lesson.slides.map((s) => (s.id === slideId && s.kind === 'task' ? { ...s, ...patch } : s)));
  }

  /** Aktualna tresc slajdu - czytamy z lekcji, bo pola sa edytowane wprost. */
  function taskSlide(slideId: string) {
    const slide = lesson.slides.find((s) => s.id === slideId);
    return slide && slide.kind === 'task' ? slide : null;
  }

  function addReviewQuestion() {
    const text = newText.trim();
    if (!text) return;
    onAddQuestion(text);
    setNewText('');
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Zestaw pytań"
      widthClassName="max-w-3xl"
      footer={
        <>
          <Button variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj`)}>
            Otwórz lekcję
          </Button>
          <Button onClick={onClose}>Gotowe</Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-500">
        {lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-600">{lesson.code}</span>}
        {lesson.title}
      </p>

      <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
        <section>
          <h3 className="text-sm font-semibold text-gray-900">Zadania z lekcji</h3>
          <p className="mb-2 text-xs text-gray-500">Polecenia ze slajdów - te, które klasa robi na lekcji.</p>
          {tasks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
              Ta lekcja nie ma jeszcze slajdów z zadaniami.
            </p>
          ) : (
            <div className="rounded-lg border border-gray-200">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 border-b border-gray-100 px-3 py-2.5 last:border-b-0">
                  <span className="mt-2 w-9 shrink-0 text-sm font-semibold text-gray-400">{task.code}</span>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={taskSlide(task.id)?.title ?? ''}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      placeholder="Tytuł zadania (opcjonalnie)"
                    />
                    <Textarea
                      value={taskSlide(task.id)?.body ?? ''}
                      onChange={(e) => updateTask(task.id, { body: e.target.value })}
                      rows={2}
                      placeholder="Polecenie"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-900">Pytania powtórzeniowe</h3>
          <p className="mb-2 text-xs text-gray-500">
            Koło na początku następnej lekcji. W kartkówce mają kody PZ1, PZ2...
          </p>
          {!lesson.questionSetId ? (
            <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center">
              <p className="mb-3 text-sm text-gray-500">Ta lekcja nie ma jeszcze pytań powtórzeniowych.</p>
              <Button variant="secondary" size="sm" onClick={onCreateQuestionSet}>
                Dodaj pytania powtórzeniowe
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200">
              {review.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-gray-100 px-3 py-2.5">
                  <span className="mt-2 w-9 shrink-0 text-sm font-semibold text-gray-400">{item.code}</span>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                    <Input
                      value={byId.get(item.id)?.text ?? ''}
                      onChange={(e) => onChangeQuestion(item.id, { text: e.target.value })}
                      placeholder="Treść pytania"
                      className="flex-1"
                    />
                    <Input
                      value={byId.get(item.id)?.answer ?? ''}
                      onChange={(e) => onChangeQuestion(item.id, { answer: e.target.value || undefined })}
                      placeholder="Odpowiedź (opcjonalnie)"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => onMoveQuestion(item.id, 'up')}>
                      Góra
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={idx === review.length - 1}
                      onClick={() => onMoveQuestion(item.id, 'down')}
                    >
                      Dół
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onRemoveQuestion(item.id)}>
                      Usuń
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <Input
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Nowe pytanie powtórzeniowe - Enter, aby dodać"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addReviewQuestion();
                    }
                  }}
                />
                <Button size="sm" onClick={addReviewQuestion} disabled={!newText.trim()}>
                  Dodaj
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <p className="mt-4 text-xs text-gray-500">Zmiany dotyczą wszystkich klas rocznika: {classNames}.</p>
    </Modal>
  );
}
