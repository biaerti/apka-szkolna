// Ekran hasla do danych uczniow - pokazywany po zalogowaniu na urzadzeniu, ktore
// nie ma jeszcze klucza (imiona i nazwiska sa w chmurze zaszyfrowane).

import { FormEvent, useState } from 'react';
import { unlockStudentData } from '../data/remote/studentCryptoRemote';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function UnlockStudents({ onUnlocked, onSignOut }: { onUnlocked: () => void; onSignOut: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      if (await unlockStudentData(password)) {
        onUnlocked();
        return;
      }
      setError('Złe hasło do danych uczniów.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się sprawdzić hasła.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-gray-900">Hasło do danych uczniów</h1>
        <p className="mb-6 text-sm text-gray-500">
          Imiona i nazwiska są w chmurze zaszyfrowane. Podaj hasło raz na tym urządzeniu.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="unlock-password"
            type="password"
            required
            autoFocus
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="md" className="w-full" disabled={loading}>
            {loading ? 'Sprawdzanie...' : 'Odblokuj'}
          </Button>
          <button type="button" className="w-full text-sm text-gray-500 hover:text-gray-700" onClick={onSignOut}>
            Wyloguj
          </button>
        </form>
      </div>
    </div>
  );
}
