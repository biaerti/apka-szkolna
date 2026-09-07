// Formularz "Dodaj własne pytanie" - tresc + odpowiedz (opcjonalna). Po
// dodaniu pola sie czyszcza i kursor wraca do tresci, zeby dalo sie wpisac
// kilka pytan pod rzad bez klikania.

import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function OwnQuestionForm({ onAdd, onClose }: { onAdd: (text: string, answer?: string) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const textRef = useRef<HTMLInputElement>(null);

  function submit() {
    const t = text.trim();
    if (!t) return;
    onAdd(t, answer.trim() || undefined);
    setText('');
    setAnswer('');
    textRef.current?.focus();
  }

  return (
    <form
      className="rounded-lg border border-accent-200 bg-accent-50/40 px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="mb-2 text-sm font-medium text-gray-700">Własne pytanie</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Treść pytania"
          className="flex-1"
          autoFocus
        />
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Odpowiedź (opcjonalnie, tylko dla Ciebie)"
          className="flex-1"
        />
      </div>
      <div className="mt-2 flex gap-2">
        <Button size="sm" type="submit" disabled={!text.trim()}>
          Dodaj
        </Button>
        <Button size="sm" variant="ghost" type="button" onClick={onClose}>
          Zamknij
        </Button>
      </div>
    </form>
  );
}
