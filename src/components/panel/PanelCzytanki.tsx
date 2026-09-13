import { useRef, useState } from 'react';
import { CZYTANKI, type Czytanka } from '../../data/czytanki';

export function PanelCzytanki() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<Czytanka | null>(null);
  const [playing, setPlaying] = useState(false);

  function select(item: Czytanka) {
    const audio = audioRef.current;
    if (!audio) return;
    if (current?.id !== item.id) {
      audio.src = item.audio;
      setCurrent(item);
    }
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) void audio.play().then(() => setPlaying(true));
    else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col p-3">
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
      <div className="mb-3 rounded-lg bg-gray-800 p-3">
        <p className="truncate text-sm font-semibold text-white">{current?.title ?? 'Wybierz czytankę'}</p>
        <p className="mt-0.5 text-xs text-gray-400">{current ? `${current.author ?? ''} - podręcznik s. ${current.pages}` : 'Odtwarzanie działa nad oknem podręcznika'}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={!current} onClick={toggle} className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">{playing ? 'Pauza' : 'Odtwórz'}</button>
          <button type="button" disabled={!current} onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }} className="rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-200 disabled:opacity-40">-10 s</button>
          <button type="button" disabled={!current} onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10; }} className="rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-200 disabled:opacity-40">+10 s</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {CZYTANKI.map((item) => (
          <button key={item.id} type="button" onClick={() => select(item)} className={`mb-1 w-full rounded-lg px-3 py-2 text-left ${current?.id === item.id ? 'bg-accent-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
            <span className="block truncate text-sm font-medium">{item.title}</span>
            <span className={`block text-xs ${current?.id === item.id ? 'text-indigo-100' : 'text-gray-400'}`}>s. {item.pages}{item.author ? ` - ${item.author}` : ''}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
