// Odtwarzacz czytanek - jeden obiekt Audio poza drzewem DOM.
//
// Hook trzyma go ten, kto zyje dluzej niz widok listy: w panelu desktopowym to
// Panel (a nie PanelCzytanki), bo przelaczenie na kolo albo zwiniecie do
// pigulki nie moze urywac czytania w polowie zdania.

import { useCallback, useEffect, useRef, useState } from 'react';
import { czytankaUrl, type Czytanka } from '../../data/czytanki';

export type CzytankaPlayer = ReturnType<typeof useCzytankaPlayer>;

export function useCzytankaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Klik w druga czytanke, zanim pierwsza dostala podpisany URL, nie moze
  // skonczyc sie odtworzeniem tej pierwszej.
  const zadanieRef = useRef(0);
  const [current, setCurrent] = useState<Czytanka | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function audio(): HTMLAudioElement {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }

  useEffect(() => {
    const a = audio();
    const onTime = () => setCurrentTime(a.currentTime);
    const onLoaded = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      if (!a.src) return;
      setPlaying(false);
      setLoading(false);
      setError('Nie udało się wczytać nagrania.');
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onPause);
    a.addEventListener('error', onError);
    return () => {
      a.pause();
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onPause);
      a.removeEventListener('error', onError);
    };
  }, []);

  const play = useCallback(
    async (c: Czytanka) => {
      const a = audio();
      setError(null);
      if (current?.id === c.id && a.src) {
        void a.play().catch(() => undefined);
        return;
      }
      const nr = ++zadanieRef.current;
      a.pause();
      setCurrent(c);
      setCurrentTime(0);
      setDuration(0);
      setLoading(true);
      try {
        const url = await czytankaUrl(c);
        if (nr !== zadanieRef.current) return;
        a.src = url;
        await a.play();
      } catch (e) {
        if (nr !== zadanieRef.current) return;
        setError(e instanceof Error && e.message ? e.message : 'Nie udało się odtworzyć nagrania.');
      } finally {
        if (nr === zadanieRef.current) setLoading(false);
      }
    },
    [current],
  );

  const toggle = useCallback(() => {
    const a = audio();
    if (!current || !a.src) return;
    if (a.paused) void a.play().catch(() => undefined);
    else a.pause();
  }, [current]);

  const seekBy = useCallback((delta: number) => {
    const a = audio();
    if (!a.src) return;
    const koniec = Number.isFinite(a.duration) ? a.duration : a.currentTime + delta;
    a.currentTime = Math.max(0, Math.min(koniec, a.currentTime + delta));
  }, []);

  const seekTo = useCallback((fraction: number) => {
    const a = audio();
    if (!a.src || !Number.isFinite(a.duration)) return;
    a.currentTime = Math.max(0, Math.min(a.duration, fraction * a.duration));
  }, []);

  const stop = useCallback(() => {
    const a = audio();
    zadanieRef.current++;
    a.pause();
    a.removeAttribute('src');
    a.load();
    setCurrent(null);
    setPlaying(false);
    setLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  return { current, playing, loading, currentTime, duration, error, play, toggle, seekBy, seekTo, stop };
}

export function formatCzasu(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
