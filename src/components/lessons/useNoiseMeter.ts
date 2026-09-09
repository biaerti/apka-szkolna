// Decybelomierz na prezentacji - mierzy halas mikrofonem komputera albo
// fizycznym miernikiem Habotest HT622B po USB (WebSerial, patrz lib/ht622b).
// Pasek "ladowania kartkowki" rosnie, gdy klasa przekracza prog glosnosci:
// lekko nad progiem laduje sie powoli, mocno nad progiem - szybko.
// W ciszy ladunek powoli opada (klasa moze "odpracowac" halas).

import { useEffect, useRef, useState } from 'react';
import { feedHt622b } from '../../lib/ht622b';

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
// Ladowanie rusza dopiero po ciaglym halasie nad progiem - pojedyncze zdanie
// nauczyciela nie nabija paska. Krotki dip pod prog nie zeruje licznika.
const SUSTAIN_SECONDS = 3;
const SUSTAIN_RESET_AFTER_SECONDS = 1;

export interface ChargeState {
  charge: number; // 0..1
  overTime: number; // ile sekund ciagiem nad progiem
  belowTime: number; // ile sekund ciagiem pod progiem
}

// Czysty krok symulacji ladowania - wydzielony do testow.
export function advanceCharge(s: ChargeState, overDb: number, dt: number, paused: boolean): ChargeState {
  let { charge, overTime, belowTime } = s;
  if (overDb > 0) {
    overTime += dt;
    belowTime = 0;
  } else {
    belowTime += dt;
    if (belowTime >= SUSTAIN_RESET_AFTER_SECONDS) overTime = 0;
  }
  if (!paused) {
    if (overDb > 0 && overTime >= SUSTAIN_SECONDS) {
      charge = Math.min(1, charge + dt * chargeRatePerSecond(overDb));
    } else if (overDb <= 0) {
      charge = Math.max(0, charge - dt * DECAY_PER_SECOND);
    }
  }
  return { charge, overTime, belowTime };
}

// Odczyt z miernika starszy niz tyle ms = utrata sygnalu (USB wylaczone/SONE).
const METER_STALE_MS = 3000;

function readNumber(key: string, fallback: number): number {
  const raw = localStorage.getItem(key);
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Minimalne typy WebSerial - brak ich w lib.dom projektu.
interface SerialPortLike {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  setSignals?(signals: { dataTerminalReady?: boolean; requestToSend?: boolean }): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
}
interface SerialLike {
  requestPort(): Promise<SerialPortLike>;
  getPorts(): Promise<SerialPortLike[]>;
}

function webSerial(): SerialLike | undefined {
  return (navigator as unknown as { serial?: SerialLike }).serial;
}

export type MeterStatus = 'off' | 'ok' | 'no-data';

export interface NoiseMeter {
  supported: boolean;
  meterSupported: boolean;
  running: boolean;
  error: string | null;
  level: number; // wygladzony poziom w dB
  charge: number; // 0..1 naladowanie kartkowki
  full: boolean;
  threshold: number;
  calibration: number;
  meterStatus: MeterStatus; // fizyczny miernik USB
  paused: boolean; // pauza ladowania (klawisz M), gdy mowi nauczyciel
  start: () => void;
  stop: () => void;
  connectMeter: () => void;
  togglePause: () => void;
  setThreshold: (db: number) => void;
  setCalibration: (offset: number) => void;
  resetCharge: () => void;
}

export function useNoiseMeter(): NoiseMeter {
  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  const meterSupported = typeof navigator !== 'undefined' && !!webSerial();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(DB_MIN);
  const [charge, setCharge] = useState(0);
  const [meterStatus, setMeterStatus] = useState<MeterStatus>('off');
  const [paused, setPaused] = useState(false);
  const [threshold, setThresholdState] = useState(() => readNumber(THRESHOLD_KEY, DEFAULT_THRESHOLD));
  const [calibration, setCalibrationState] = useState(() => readNumber(CALIBRATION_KEY, DEFAULT_CALIBRATION));

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef(0);
  const portRef = useRef<SerialPortLike | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  // Wartosci czytane w petli - refy, zeby petla nie restartowala przy kazdej zmianie.
  const thresholdRef = useRef(threshold);
  const calibrationRef = useRef(calibration);
  const chargeRef = useRef<ChargeState>({ charge: 0, overTime: 0, belowTime: 0 });
  const pausedRef = useRef(false);
  const levelRef = useRef(DB_MIN);
  const meterDbRef = useRef(0);
  const meterAtRef = useRef(0);
  const stoppedRef = useRef(false);

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
    chargeRef.current = { charge: 0, overTime: 0, belowTime: 0 };
    setCharge(0);
  }

  function togglePause() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }

  function stop() {
    stoppedRef.current = true;
    clearInterval(timerRef.current);
    timerRef.current = 0;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    readerRef.current?.cancel().catch(() => {});
    readerRef.current = null;
    portRef.current?.close().catch(() => {});
    portRef.current = null;
    meterAtRef.current = 0;
    setMeterStatus('off');
    setRunning(false);
  }

  // Wspolna petla pomiaru: swiezy odczyt z miernika USB ma pierwszenstwo,
  // inaczej liczymy dB z mikrofonu. setInterval zamiast rAF - dziala takze,
  // gdy okno jest w tle (dlawione do ~1 Hz, dtCharge to nadrabia).
  function ensureLoop() {
    if (timerRef.current) return;
    stoppedRef.current = false;
    const buf = new Float32Array(2048);
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dtRaw = (now - last) / 1000;
      last = now;
      const dt = Math.min(0.2, dtRaw);
      const dtCharge = Math.min(1, dtRaw);

      const meterFresh = meterAtRef.current > 0 && now - meterAtRef.current < METER_STALE_MS;
      if (portRef.current) setMeterStatus(meterFresh ? 'ok' : 'no-data');

      let db: number | null = null;
      if (meterFresh) {
        db = meterDbRef.current;
      } else if (analyserRef.current) {
        const analyser = analyserRef.current;
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        db = rms > 0 ? 20 * Math.log10(rms) + calibrationRef.current : DB_MIN;
      }

      if (db !== null) {
        // Szybki atak, wolniejsze opadanie - jak tryb FAST w miernikach.
        const tau = db > levelRef.current ? 0.12 : 0.4;
        const alpha = 1 - Math.exp(-dt / tau);
        levelRef.current += (db - levelRef.current) * alpha;

        const over = levelRef.current - thresholdRef.current;
        chargeRef.current = advanceCharge(chargeRef.current, over, dtCharge, pausedRef.current);
      }

      setLevel(levelRef.current);
      setCharge(chargeRef.current.charge);
    };
    timerRef.current = window.setInterval(tick, 100);
    setRunning(true);
  }

  async function start() {
    setError(null);
    if (!streamRef.current) {
      try {
        // Wylaczone filtry - odszumianie i AGC zaklamalyby pomiar glosnosci.
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        streamRef.current = stream;
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch {
        // Bez mikrofonu tez startujemy - moze byc podpiety miernik USB.
        setError('Brak dostępu do mikrofonu');
      }
    }
    ensureLoop();
    // Miernik podlaczony wczesniej (zapamietana zgoda) podpinamy bez pytania.
    reconnectSavedMeter();
  }

  async function openMeterPort(port: SerialPortLike) {
    await port.open({ baudRate: 9600 });
    await port.setSignals?.({ dataTerminalReady: true, requestToSend: true }).catch(() => {});
    if (!port.readable) throw new Error('port bez odczytu');
    portRef.current = port;
    setMeterStatus('no-data');
    ensureLoop();
    const reader = port.readable.getReader();
    readerRef.current = reader;
    let pending = new Uint8Array(0);
    try {
      while (!stoppedRef.current) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value || value.length === 0) continue;
        const merged = new Uint8Array(pending.length + value.length);
        merged.set(pending);
        merged.set(value, pending.length);
        const { readings, rest } = feedHt622b(merged);
        pending = new Uint8Array(rest);
        const lastReading = readings[readings.length - 1];
        if (lastReading) {
          meterDbRef.current = lastReading.db;
          meterAtRef.current = performance.now();
        }
      }
    } catch {
      // Odpiety kabel itp. - wracamy na mikrofon, status zaktualizuje petla.
    } finally {
      reader.releaseLock();
      if (portRef.current === port) {
        portRef.current = null;
        meterAtRef.current = 0;
        if (!stoppedRef.current) setMeterStatus('off');
        port.close().catch(() => {});
      }
    }
  }

  async function reconnectSavedMeter() {
    const serial = webSerial();
    if (!serial || portRef.current) return;
    try {
      const ports = await serial.getPorts();
      if (ports.length > 0) await openMeterPort(ports[0]);
    } catch {
      // Brak zapisanego portu albo nie da sie otworzyc - zostaje mikrofon.
    }
  }

  async function connectMeter() {
    const serial = webSerial();
    if (!serial || portRef.current) return;
    try {
      const port = await serial.requestPort();
      await openMeterPort(port);
    } catch {
      // Uzytkownik zamknal okno wyboru portu - nic nie robimy.
    }
  }

  // Sprzatanie przy wyjsciu z prezentacji.
  useEffect(() => stop, []);

  return {
    supported,
    meterSupported,
    running,
    error,
    level,
    charge,
    full: charge >= 1,
    threshold,
    calibration,
    meterStatus,
    paused,
    start,
    stop,
    connectMeter,
    togglePause,
    setThreshold,
    setCalibration,
    resetCharge,
  };
}
