import { Link, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { bonusPoints, formatQuizDate, pointsLabel, questionPoints, renumber, totalPoints } from '../lib/quiz';
import type { QuizQuestion } from '../data/types';
import './QuizPrint.css';

function AnswerSpace({ question }: { question: QuizQuestion }) {
  if (question.printLayout === 'table') return <div className="quiz-print-table-space" aria-hidden="true" />;
  const lines = Math.min(8, Math.max(1, question.printLines ?? 3));
  return (
    <div className="quiz-print-answer-lines" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => <div key={i} />)}
    </div>
  );
}

export function QuizPrint() {
  const { id } = useParams<{ id: string }>();
  const quiz = useStore((s) => s.quizzes.find((item) => item.id === id));
  const cls = useStore((s) => s.classes.find((item) => item.id === quiz?.classId));

  if (!quiz) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <p>Nie znaleziono kartkówki.</p>
        <Link to="/kartkowki" className="text-accent-700 underline">Wróć do kartkówek</Link>
      </main>
    );
  }

  const questions = renumber(quiz.questions);
  const normal = questions.filter((q) => !q.bonus);
  const bonus = questions.filter((q) => q.bonus);

  return (
    <main className="quiz-print-preview">
      <div className="quiz-print-toolbar no-print">
        <Link to={`/kartkowki/${quiz.id}`} className="text-sm text-accent-700 hover:underline">← Kartkówka</Link>
        <Button onClick={() => window.print()} disabled={questions.length === 0}>Drukuj</Button>
      </div>

      <article className="quiz-print-sheet">
        <header className="quiz-print-header">
          <div className="quiz-print-eyebrow">Język polski{cls ? ` · ${cls.name}` : ''}</div>
          <h1>{quiz.title}</h1>
          <div className="quiz-print-details">
            <span>Imię i nazwisko: ....................................................................</span>
            <span>Klasa: ..........</span>
            <span>Data: {formatQuizDate(quiz.date) || '....................'}</span>
          </div>
          <p className="quiz-print-score-note">
            Zadania: {pointsLabel(totalPoints(questions))}
            {bonus.length > 0 && ` · Bonus: dodatkowe ${pointsLabel(bonusPoints(questions))}`}
          </p>
        </header>

        {questions.length === 0 && <p>Ta kartkówka nie ma jeszcze pytań.</p>}
        {normal.map((q, index) => (
          <section key={q.id} className="quiz-print-question">
            <div className="quiz-print-question-title">
              <span className="quiz-print-number">{index + 1}.</span>
              <p>{q.text}</p>
              <span className="quiz-print-points">{pointsLabel(questionPoints(q))}</span>
            </div>
            <AnswerSpace question={q} />
          </section>
        ))}

        {bonus.map((q) => (
          <section key={q.id} className="quiz-print-question quiz-print-bonus">
            <div className="quiz-print-question-title">
              <span className="quiz-print-bonus-label">Zadanie bonusowe</span>
              <span className="quiz-print-points">{pointsLabel(questionPoints(q))}</span>
            </div>
            <p className="quiz-print-bonus-text">{q.text}</p>
            <AnswerSpace question={q} />
          </section>
        ))}

        <footer className="quiz-print-footer">
          <span>Wynik: .......... / {totalPoints(questions)} pkt</span>
          {bonus.length > 0 && <span>Bonus: .......... / {bonusPoints(questions)} pkt</span>}
        </footer>
      </article>
    </main>
  );
}
