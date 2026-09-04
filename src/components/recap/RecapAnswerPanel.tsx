// Prawa kolumna ekranu powtorki: imie wylosowanego ucznia, panel pytania,
// przyciski oceny (albo "gotowe, nastepny" w trybie bez ocen). Wydzielone z
// RecapSession.tsx, zeby komponent zmiescil sie w limicie 250 linii.

import { QuestionPanel } from './QuestionPanel';
import { ScoreButtons } from './ScoreButtons';
import type { RecapSessionState } from './useRecapSession';

export interface RecapAnswerPanelProps {
  session: RecapSessionState;
  onOpenHint: () => void;
  onOpenUwaga: () => void;
}

export function RecapAnswerPanel({ session, onOpenHint, onOpenUwaga }: RecapAnswerPanelProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-4 py-2">
      {/* Kto teraz odpowiada. Samo duze nazwisko okazalo sie nieoczywiste na
          projektorze, wiec wylosowana osoba dostaje wlasna ramke w kolorze akcentu
          - widac ja z konca sali i nie gasnie po wpisaniu oceny. */}
      <div className="shrink-0">
        {session.currentStudent ? (
          <div className="rounded-xl border-4 border-accent-400 bg-accent-900/40 px-4 py-2 text-center">
            <p className="text-xs uppercase tracking-widest text-accent-300">Odpowiada</p>
            <p className="font-bold leading-tight text-white" style={{ fontSize: 'clamp(36px, 5.5vw, 76px)' }}>
              {session.currentStudent.firstName} {session.currentStudent.lastName}
            </p>
          </div>
        ) : (
          <p
            className="text-center font-bold leading-tight text-gray-400"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Kręć kołem
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <QuestionPanel
          question={session.currentQuestion}
          index={session.questionIndex}
          total={session.orderedQuestions.length}
          onNext={session.nextQuestion}
          onPrev={session.prevQuestion}
          randomOrder={session.randomOrder}
          onToggleRandom={session.setRandomOrder}
          showAnswer={session.showAnswer}
          onToggleShowAnswer={() => session.setShowAnswer((v) => !v)}
        />
      </div>

      <div className="shrink-0">
        {session.grading ? (
          <ScoreButtons
            disabled={!session.currentStudent}
            graded={session.graded}
            onGrade={session.grade}
            canPass={session.currentCanPass}
            canEarnPlus={session.currentCanEarnPlus}
            passesUsed={session.currentPassesUsed}
            passesPerMonth={session.settings.passesPerMonth}
            hintGivesMinus={session.settings.hintGivesMinus}
            onOpenHint={onOpenHint}
            onOpenUwaga={onOpenUwaga}
          />
        ) : (
          <button
            type="button"
            onClick={session.markDoneNoGrade}
            disabled={!session.currentStudent}
            className="w-full rounded-lg bg-accent-600 px-4 py-4 text-2xl font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
          >
            Gotowe, następny (Enter)
          </button>
        )}
      </div>
    </div>
  );
}
