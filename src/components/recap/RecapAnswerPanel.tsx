// Prawa kolumna ekranu powtorki: imie wylosowanego ucznia, panel pytania,
// przyciski oceny (albo "gotowe, nastepny" w trybie bez ocen). Wydzielone z
// RecapSession.tsx, zeby komponent zmiescil sie w limicie 250 linii.

import { QuestionPanel } from './QuestionPanel';
import { ScoreButtons } from './ScoreButtons';
import type { RecapSessionState } from './useRecapSession';
import type { Question } from '../../data/types';

export interface RecapAnswerPanelProps {
  session: RecapSessionState;
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void;
  onGrade: (result: 'plus' | 'kropka' | 'plomba') => void;
  onSkip: () => void;
  onShowOverview: () => void;
  /** Pytania rundy jako numerki nad pytaniem - klik podswietla wybrane pytanie. */
  questions?: Question[];
  completedQuestionIds?: Set<string>;
  onJumpToQuestion?: (id: string) => void;
  /** Stale polecenie rundy - wazniejsze niz wylosowane pytanie (patrz QuestionPanel). */
  prompt?: string | null;
  promptHint?: string | null;
}

export function RecapAnswerPanel({
  session,
  onUpdateQuestion,
  onGrade,
  onSkip,
  onShowOverview,
  questions,
  completedQuestionIds,
  onJumpToQuestion,
  prompt,
  promptHint,
}: RecapAnswerPanelProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-4 py-2">
      {/* Kto teraz odpowiada. Samo duze nazwisko okazalo sie nieoczywiste na
          projektorze, wiec wylosowana osoba dostaje wlasna ramke w kolorze akcentu
          - widac ja z konca sali i nie gasnie po wpisaniu oceny. */}
      <div className="shrink-0">
        {session.currentStudent ? (
          <div className="relative rounded-xl border-4 border-accent-400 bg-accent-900/40 px-4 py-2 text-center">
            {/* Numer z dziennika - dyskretnie w rogu, zeby nauczyciel szybko
                znalazl ucznia na liscie, ale nazwisko zostalo najwieksze. */}
            <span className="absolute right-3 top-2 text-sm font-semibold tabular-nums text-accent-300/80">
              nr {session.currentStudent.number}
            </span>
            <p className="text-sm uppercase tracking-widest text-accent-300">Odpowiada</p>
            <p className="font-bold leading-tight text-white" style={{ fontSize: 'clamp(40px, 6.4vw, 112px)' }}>
              {session.currentStudent.firstName} {session.currentStudent.lastName}
            </p>
          </div>
        ) : (
          <p
            className="text-center font-bold leading-tight text-gray-400"
            style={{ fontSize: 'clamp(40px, 6vw, 100px)' }}
          >
            {session.pickMode === 'sequential' ? 'Wybierz ucznia' : session.pickMode === 'sala' ? 'Losuj z rozkładu' : 'Kręć kołem'}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <QuestionPanel
          question={session.currentQuestion}
          prompt={prompt}
          promptHint={promptHint}
          index={session.questionIndex}
          total={session.orderedQuestions.length}
          onNext={session.nextQuestion}
          onPrev={session.prevQuestion}
          randomOrder={session.randomOrder}
          onToggleRandom={session.setRandomOrder}
          showRandomControl={session.recapMode !== 'powtorzeniowe'}
          showAnswer={session.showAnswer}
          onToggleShowAnswer={() => session.setShowAnswer((v) => !v)}
          onUpdateQuestion={onUpdateQuestion}
          onShowOverview={onShowOverview}
          questions={questions}
          completedQuestionIds={completedQuestionIds}
          onJumpToQuestion={onJumpToQuestion}
        />
      </div>

      <div className="shrink-0">
        {session.grading ? (
          <ScoreButtons
            disabled={!session.currentStudent}
            graded={session.graded}
            recapMode={session.recapMode}
            onGrade={onGrade}
            onSkip={onSkip}
          />
        ) : (
          <button
            type="button"
            onClick={onSkip}
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
