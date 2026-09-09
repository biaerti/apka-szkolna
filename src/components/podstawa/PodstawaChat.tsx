import { FormEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Prosty czat z podstawa programowa - historia trzymana w useState, bez zapisu.
// Endpoint /api/podstawa-chat: funkcja Vercel (produkcja) lub middleware Vite (dev).
export function PodstawaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/podstawa-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? `Błąd serwera (${res.status})`);
      }
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się pobrać odpowiedzi.');
    } finally {
      setBusy(false);
      // Przewin na dol po dolozeniu wiadomosci
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      }, 0);
    }
  }

  return (
    <section className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">Zapytaj o podstawę</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Asystent zna pełny tekst podstawy dla klas IV-VI i listę lektur.
        </p>
      </div>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400">
            Np. "Które wymagania dotyczą zaproszenia?" albo "Czy Ania z Zielonego Wzgórza jest
            obowiązkowa?"
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={clsx(
              'whitespace-pre-wrap rounded-md px-3 py-2 text-sm',
              m.role === 'user' ? 'ml-6 bg-accent-50 text-accent-900' : 'mr-6 bg-gray-100 text-gray-800',
            )}
          >
            {m.content}
          </div>
        ))}
        {busy && <p className="text-sm text-gray-400">Piszę odpowiedź...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zadaj pytanie..."
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          Wyślij
        </Button>
      </form>
    </section>
  );
}
