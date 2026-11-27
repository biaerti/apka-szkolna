// Odtwarzanie nagran kursu i krotkie dzwieki "dobrze / zle / koniec" (Web Audio,
// bez plikow). Jedno nagranie naraz: nowe zatrzymuje poprzednie.

let biezace: HTMLAudioElement | null = null;
const cache = new Map<string, HTMLAudioElement>();
let dzwiekiWlaczone = true;

export function ustawDzwieki(wl: boolean): void {
  dzwiekiWlaczone = wl;
}

function element(url: string): HTMLAudioElement {
  let a = cache.get(url);
  if (!a) {
    a = new Audio(url);
    a.preload = 'auto';
    cache.set(url, a);
  }
  return a;
}

/** Wczytuje nagrania z wyprzedzeniem (np. opcje nastepnego zadania). */
export function wczytaj(urls: string[]): void {
  for (const u of urls.slice(0, 12)) element(u);
}

export function zatrzymaj(): void {
  if (biezace) {
    biezace.pause();
    biezace = null;
  }
}

/** Gra nagranie. `wolno` - 70% predkosci (wysokosc glosu zostaje). */
export function graj(url: string, wolno = false): Promise<void> {
  zatrzymaj();
  const a = element(url);
  a.currentTime = 0;
  a.playbackRate = wolno ? 0.7 : 1;
  biezace = a;
  return new Promise((ok) => {
    const koniec = () => {
      a.removeEventListener('ended', koniec);
      a.removeEventListener('error', koniec);
      ok();
    };
    a.addEventListener('ended', koniec);
    a.addEventListener('error', koniec);
    a.play().catch(koniec);
  });
}

let ctx: AudioContext | null = null;

function ton(czestotliwosci: number[], dlugosc = 0.12, typ: OscillatorType = 'sine', glosnosc = 0.12): void {
  if (!dzwiekiWlaczone) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    const start = ctx.currentTime;
    czestotliwosci.forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = typ;
      o.frequency.value = f;
      const t = start + i * dlugosc * 0.8;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(glosnosc, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dlugosc * 1.6);
      o.connect(g).connect(ctx!.destination);
      o.start(t);
      o.stop(t + dlugosc * 1.8);
    });
  } catch {
    // bez dzwieku
  }
}

export const dzwiek = {
  dobrze: () => ton([660, 990], 0.1, 'triangle'),
  zle: () => ton([220, 196], 0.14, 'sine', 0.09),
  klik: () => ton([520], 0.04, 'triangle', 0.05),
  koniec: () => ton([523, 659, 784, 1047], 0.13, 'triangle'),
};
