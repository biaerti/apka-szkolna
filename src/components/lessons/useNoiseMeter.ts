// Decybelomierz na prezentacji - mierzy halas mikrofonem komputera.
// Pasek "ladowania kartkowki" rosnie, gdy klasa przekracza prog glosnosci:
// lekko nad progiem laduje sie powoli, mocno nad progiem - szybko.
// W ciszy ladunek powoli opada (klasa moze "odpracowac" halas).

import { useEffect, useRef, useState } from 'react';

const THRESHOLD_KEY = 'noise.threshold';
const CALIBRATION_KEY = 'noise.calibration';

// Skala wyswietlana na pasku poziomu (typowa klasa: 45-85 dB).
export const DB_MIN = 35;
export const DB_MAX = 105;

const DEFAULT_THRESHOLD = 68;
// Mikrofony laptopow nie sa skalibrowane - offset dBFS -> "dB" dobrany tak,
// zeby zwykla rozmowa wypadala kolo 60-70. Do doszlifowania z fizycznym miernikiem.
const DEFAULT_CALIBRATION = 100;

// Pelne naladowanie: ~60 s przy +10 dB nad progiem, ~4 min przy +5 dB.
export function chargeRatePerSecond(overDb: number): number {
  return Math.pow(overDb / 10, 1.5) / 60;
}
// W ciszy pasek opada z pelna po ~10 minutach.
const DECAY_PER_SECOND = 1 / 600;

function readNumber(key: string, fallback: number): number {
  const raw = localStorage.getItem(key);
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export interface NoiseMeter {
  supported: boolean;
  running: boolean;
  error: string | null;
  level: number; // wygladzony poziom w "dB"
  charge: number; // 0..1 naladowanie kartkowki
  full: boolean;
  threshold: number;
  calibration: number;
  start: () => void;
  stop: () => void;
  setThreshold: (db: number) => void;
  setCalibration: (offset: number) => void;
  resetCharge: () => void;
}

export function useNoiseMeter(): NoiseMeter {
  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(DB_MIN);
  const [charge, setCharge] = useState(0);
  const [threshold, setThresholdState] = useState(() => readNumber(THRESHOLD_KEY, DEFAULT_THRESHOLD));
  const [calibration, setCalibrationState] = useState(() => readNumber(CALIBRATION_KEY, DEFAULT_CALIBRATION));

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef(0);
  // Wartosci czytane w petli rAF - refy, zeby petla nie restartowala przy kazdej zmianie.
  const thresholdRef = useRef(threshold);
  const calibrationRef = useRef(calibration);
  const chargeRef = useRef(0);
  const levelRef = useRef(DB_MIN);

  function setThreshold(db: number) {
    const v = Math.round(Math.max(DB_MIN + 5, Math.min(DB_MAX - 5, db)));
    thresholdRef.current = v;
    setThresholdState(v);
    localStorage.setItem(THRESHOLD_KEY, String(v));
  }

  function setCalibration(offset: number) {
    const v = Math.round(Math.max(60, Math.min(140, offset)));
    calibrationRef.current = v;
    setCalibrationState(v);
    localStorage.setItem(CALIBRATION_KEY, String(v));
  }

  function resetCharge() {
    chargeRef.current = 0;
    setCharge(0);
  }

  function stop() {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setRunning(false);
  }

  async function start() {
    if (streamRef.current) return;
    setError(null);
    let stream: MediaStream;
    try {
      // Wylaczone filtry - odszumianie i AGC zaklamalyby pomiar glosnosci.
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      setError('Brak dostępu do mikrofonu');
      return;
    }
    streamRef.current = stream;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);

    let last = performance.now();
    // setInterval zamiast rAF - dziala takze, gdy okno jest w tle
    // (przegladarka dlawi wtedy interwaly do ~1 Hz, dtCharge to nadrabia).
    const tick = () => {
      const now = performance.now();
      const dtRaw = (now - last) / 1000;
      last = now;
      // Dwa limity: krotki dla wygladzania poziomu, dluzszy dla ladowania -
      // gdy przegladarka dlawi rAF (okno w tle), czas ladowania liczy sie dalej.
      const dt = Math.min(0.2, dtRaw);
      const dtCharge = Math.min(1, dtRaw);

      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const db = rms > 0 ? 20 * Math.log10(rms) + calibrationRef.current : DB_MIN;

      // Szybki atak, wolniejsze opadanie - jak tryb FAST w miernikach.
      const tau = db > levelRef.current ? 0.12 : 0.4;
      const alpha = 1 - Math.exp(-dt / tau);
      levelRef.current += (db - levelRef.current) * alpha;

      const over = levelRef.current - thresholdRef.current;
      if (over > 0) {
        chargeRef.current = Math.min(1, chargeRef.current + dtCharge * chargeRatePerSecond(over));
      } else {
        chargeRef.current = Math.max(0, chargeRef.current - dtCharge * DECAY_PER_SECOND);
      }

      setLevel(levelRef.current);
      setCharge(chargeRef.current);
    };
    timerRef.current = window.setInterval(tick, 100);
    setRunning(true);
  }

  // Sprzatanie przy wyjsciu z prezentacji.
  useEffect(() => stop, []);

  return {
    supported,
    running,
    error,
    level,
    charge,
    full: charge >= 1,
    threshold,
    calibration,
    start,
    stop,
    setThreshold,
    setCalibration,
    resetCharge,
  };
}
