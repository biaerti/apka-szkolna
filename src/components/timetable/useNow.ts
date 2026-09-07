// Hook "aktualny czas": odswieza komponent co `intervalMs` (setInterval),
// a wartosc bierze z Date.now() - dzieki temu zegar nie dryfuje przy
// nieregularnych tickach (ten sam styl co src/lib/timer.ts).

import { useEffect, useState } from 'react';

export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date(Date.now())), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
  return now;
}
