// Identyfikator TEGO urzadzenia (przegladarki) - losowy, trzymany w
// localStorage obok store. Po co: zdarzenie kola zapisane na telefonie
// (widok "Sala") ma sie na komputerze pokazac jako popup, a zapisane na
// komputerze - nie. Bez id urzadzenia komputer nie odroznilby "moje" od
// "z telefonu", bo oba wpisy wygladaja w chmurze tak samo.
//
// To nie jest identyfikator uzytkownika ani sesji - dwa okna tej samej
// przegladarki dziela jeden id (ten sam localStorage), i o to chodzi:
// panel i apka na tym samym komputerze to jedno "urzadzenie".

import { newId } from '../data/id';

const KEY = 'apka-szkolna-device';
let cached: string | null = null;

export function getDeviceId(): string {
  if (cached) return cached;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return (cached = stored);
    const fresh = newId();
    localStorage.setItem(KEY, fresh);
    return (cached = fresh);
  } catch {
    // Tryb prywatny / zablokowany storage - id na czas zycia strony.
    return (cached = newId());
  }
}
