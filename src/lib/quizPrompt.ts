// Generowanie kartkowki BEZ zadnego API w apce.
//
// Apka sklada gotowe polecenie z materialu wybranych lekcji, nauczyciel kopiuje
// je do Claude (schowek dziala tez na szkolnym Chrome 109 na http - patrz
// src/lib/clipboard.ts), a odpowiedz wkleja z powrotem. Dzieki temu nie ma
// klucza API w przegladarce, nie ma kosztow za token i nic nie przestaje
// dzialac, gdy w szkole nie ma internetu poza dziennikiem.
//
// Kartkowki sa KARNE (za halas), wiec polecenie wprost prosi o zadania
// trudniejsze niz to, co bylo na lekcji - nie o powtorzenie cwiczen.

import type { QuizKind } from '../data/types';
import type { LessonQuestionOption } from './quiz';
import { POINTS_RULE, quizKindAccusative } from './quiz';

export interface QuizPromptInput {
  kind: QuizKind;
  className: string;
  /** Lekcje, z ktorych ma powstac kartkowka (juz zawezone do zaznaczonych). */
  lessons: LessonQuestionOption[];
  /** Ile zadan ma miec kartkowka. */
  count: number;
}

/** Polecenie do wklejenia agentowi. Zwyklym tekstem, bez markdownu - idzie do schowka. */
export function buildQuizPrompt({ kind, className, lessons, count }: QuizPromptInput): string {
  const parts: string[] = [];

  parts.push(
    `Ułóż ${quizKindAccusative(kind)} z języka polskiego dla klasy ${className} (szkoła podstawowa) - ${count} zadań.`,
    '',
    'Kontekst: to kartkówka karna, pisana za hałas na lekcji. Ma być TRUDNA - trudniejsza niż ćwiczenia,',
    'które klasa robiła na lekcji. Nie przepisuj poleceń z materiału niżej: zbuduj nowe zadania na tej samej',
    'wiedzy, ale wymagające więcej myślenia (własne przykłady, wyjątki, uzasadnienie odpowiedzi, przykłady',
    'z pułapką). Język poleceń zostaw prosty i konkretny - to dzieci z klasy IV.',
    '',
    'Punktacja:',
    '- zadanie za 1 pkt to jedno polecenie - zrobione albo nie,',
    `- ${POINTS_RULE}`,
    '- zadania za 2 pkt mają mieć 4-6 przykładów do zrobienia.',
    'Zrób mniej więcej połowę zadań za 2 pkt.',
    '',
    'Materiał, z którego ma być kartkówka:',
  );

  for (const { lesson, tasks, review } of lessons) {
    parts.push('', `${lesson.code ? lesson.code + ' ' : ''}${lesson.title}`);
    const registerTopic = lesson.registerTopic ?? '';
    if (registerTopic) parts.push(`Temat w dzienniku: ${registerTopic}`);
    const curriculum = lesson.curriculum ?? [];
    if (curriculum.length > 0) parts.push(`Podstawa programowa: ${curriculum.join(', ')}`);
    if (tasks.length > 0) {
      parts.push('Zadania robione na lekcji:');
      for (const t of tasks) parts.push(`- ${t.code}: ${oneLine(t.text)}`);
    }
    if (review.length > 0) {
      parts.push('Pytania powtórzeniowe (koło na następnej lekcji):');
      for (const q of review) parts.push(`- ${q.code}: ${oneLine(q.text)}${q.answer ? ` (odp.: ${oneLine(q.answer)})` : ''}`);
    }
  }

  parts.push(
    '',
    'Odpowiedz SAMYMI zadaniami, w tym formacie i bez żadnego wstępu ani komentarza:',
    '',
    '[1] Treść zadania za 1 punkt.',
    'Odp.: poprawna odpowiedź',
    '',
    '[2] Treść zadania za 2 punkty, z przykładami a) b) c) d).',
    'Odp.: a) ... b) ... c) ... d) ...',
    '',
    'Liczba w nawiasie kwadratowym to punkty za zadanie. Każde zadanie oddziel pustą linią.',
    'Odpowiedź podaj zawsze - jest tylko dla nauczyciela, dzieci jej nie zobaczą.',
  );

  return parts.join('\n');
}

/** Polecenia zadan bywaja wielolinijkowe - w spisie materialu chcemy jedna linie. */
function oneLine(text: string): string {
  return text.replace(/\s*\n\s*/g, ' ').trim();
}

export interface ParsedQuizQuestion {
  text: string;
  answer?: string;
  points: number;
}

const POINTS_LINE = /^\s*(?:\d+[.)]\s*)?[[(](\d)(?:\s*(?:pkt|p|punkty?|punkt))?[\])]\s*/i;
// "Odp.:", "Odp:", "Odpowiedź:" - separator moze byc zlozony (kropka i dwukropek).
const ANSWER_LINE = /^\s*odp(?:owied[źz])?\s*[.:]+\s*/i;

/**
 * Parser odpowiedzi agenta. Nowe zadanie zaczyna sie od "[2]" (albo "(2 pkt)"),
 * linia "Odp.: ..." jest odpowiedzia, reszta linii dokleja sie do tresci - dzieki
 * temu zadanie z przykladami a) b) c) w osobnych liniach zostaje w calosci.
 * Zadanie bez znacznika punktow liczymy jako 1 pkt, zeby zle sformatowana
 * odpowiedz agenta nie przepadla po cichu.
 */
export function parseGeneratedQuiz(input: string): ParsedQuizQuestion[] {
  const out: ParsedQuizQuestion[] = [];
  let current: { lines: string[]; answer: string[]; points: number } | null = null;
  let inAnswer = false;

  function flush() {
    if (!current) return;
    const text = current.lines.join('\n').trim();
    if (text) {
      const item: ParsedQuizQuestion = { text, points: current.points };
      const answer = current.answer.join('\n').trim();
      if (answer) item.answer = answer;
      out.push(item);
    }
    current = null;
    inAnswer = false;
  }

  for (const raw of input.split(/\r?\n/)) {
    const line = raw.trim();
    const marker = POINTS_LINE.exec(line);
    if (marker) {
      flush();
      const points = Number(marker[1]);
      current = { lines: [line.slice(marker[0].length).trim()], answer: [], points: points > 0 ? points : 1 };
      continue;
    }
    if (!line) {
      inAnswer = false;
      continue;
    }
    if (!current) {
      // Tekst przed pierwszym znacznikiem: agent mimo wszystko dopisal wstep -
      // pomijamy go, zamiast robic z niego zadanie.
      continue;
    }
    const answerStart = ANSWER_LINE.exec(line);
    if (answerStart) {
      inAnswer = true;
      current.answer.push(line.slice(answerStart[0].length).trim());
      continue;
    }
    if (inAnswer) current.answer.push(line);
    else current.lines.push(line);
  }
  flush();

  return out;
}
