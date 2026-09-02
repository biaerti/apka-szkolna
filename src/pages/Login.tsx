// Ekran logowania (tryb chmury). Rejestracji kont nie ma - konto zaklada sie
// w panelu Supabase.

import { FormEvent, useState } from 'react';
import { useAuth } from '../data/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-gray-900">Apka szkolna</h1>
        <p className="mb-6 text-sm text-gray-500">Zaloguj się, aby zsynchronizować dane z chmurą.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="login-email">
              E-mail
            </label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="login-password">
              Hasło
            </label>
            <Input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="md" className="w-full" disabled={loading}>
            {loading ? 'Logowanie...' : 'Zaloguj'}
          </Button>
        </form>
      </div>
    </div>
  );
}
