// Wspolne klocki lekcji klasy 5 (textbook5.ts - dzial 1, textbook5dzial2.ts - dzial 2).

import type { Slide, SlideArt, StudentAction } from './types';
import { newId } from './id';

export interface Topic {
  title: string;
  /** Naglowek grupy na liscie lekcji, np. "Dział 2 - Uwaga, uczucia!". */
  dzial?: string;
  topic: string;
  textbookPage: number;
  teacherPlan: string;
  questions: Array<{ text: string; answer: string }>;
  /** ownQuestionSetId - zestaw pytan tej lekcji (kolo po filmie z jej wlasnymi pytaniami). */
  makeSlides: (previousQuestionSetId?: string, ownQuestionSetId?: string) => Slide[];
}

/** Sekcje planu: "## Naglowek" + tresc, oddzielone pusta linia (markdown-lite). */
export function plan(...sections: Array<[string, string]>): string {
  return sections.map(([heading, body]) => `## ${heading}\n\n${body}`).join('\n\n');
}

export function slideTopic(topic: string): Slide {
  return { id: newId(), kind: 'topic', topic, variant: 'write' };
}
export function slideRead(title: string, page: number, pageTo: number, body: string, timerSec: number): Slide {
  return { id: newId(), kind: 'read', title, source: 'Podręcznik', page, pageTo, body, timerSec };
}
export function slideText(title: string, body: string, art?: SlideArt): Slide { return { id: newId(), kind: 'text', title, body, art }; }
export function slideTask(code: string, body: string, timerSec: number, art?: SlideArt, answerExample?: string): Slide {
  return { id: newId(), kind: 'task', code, body, timerSec, art, answerExample, studentAction: 'write-answer' };
}
export function slideVideo(videoId: string): Slide { return { id: newId(), kind: 'video', videoId }; }
export function slideCzytanka(czytankaId: string): Slide { return { id: newId(), kind: 'czytanka', czytankaId }; }
/** Screen z podręcznika (ramka teorii) z numerem strony nad obrazem. */
export function slideTextbookImage(url: string, page: number, title: string): Slide {
  return { id: newId(), kind: 'image', url, page, title, studentAction: 'look' };
}
/** Screen zadania z podrecznika - z kodem, wiec dziala na nim kolo na lekcji (K). */
export function slideTextbookTask(url: string, page: number, code: string, title: string, studentAction: StudentAction, studentActionText?: string): Slide {
  return { id: newId(), kind: 'image', url, page, code, title, studentAction, studentActionText };
}
export function slideRecap(questionSetId: string): Slide { return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' }; }
/** Notatka zamykajaca lekcje: "Temat: <krotka nazwa>" + kilka linijek do przepisania. */
export function slideNote(temat: string, body: string): Slide {
  return { id: newId(), kind: 'note', title: 'Notatka do zeszytu', body: `**Temat:** ${temat}\n${body}` };
}
export function recap(questionSetId?: string): Slide[] { return questionSetId ? [slideRecap(questionSetId)] : []; }
