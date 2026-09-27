import { useLayoutEffect, useState } from 'react';

// Tryb ciemny panelu nauczyciela. Klasa "dark" wisi na <html> tylko wtedy, gdy
// zamontowany jest AppShell - prezentacja na projektorze, panel desktopowy
// i wydruki zyja poza nim i zostaja jasne. Wybor pamietany w tej przegladarce.
const KEY = 'motyw';

function readDark(): boolean {
  try {
    return localStorage.getItem(KEY) === 'ciemny';
  } catch {
    return false;
  }
}

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState(readDark);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    return () => document.documentElement.classList.remove('dark');
  }, [dark]);

  const toggle = () =>
    setDark((d) => {
      try {
        localStorage.setItem(KEY, d ? 'jasny' : 'ciemny');
      } catch {
        // tylko wygoda - bez localStorage tryb nie przetrwa odswiezenia
      }
      return !d;
    });

  return [dark, toggle];
}
