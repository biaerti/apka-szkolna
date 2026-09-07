import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import type { LessonQuestionOption } from './quiz';
import { buildQuizPrompt, parseGeneratedQuiz } from './quizPrompt';

const LESSON: Lesson = {
  id: 'l1',
  grade: 'IV',
  order: 0,
  code: '4.2',
  title: 'Powtórka 1-3: Głoski, litery, sylaby',
  registerTopic: 'Powtórzenie wiadomości z klas 1-3',
  curriculum: ['II.3.5', 'II.4.1'],
  progress: {},
  slides: [],
};

const OPTION: LessonQuestionOption = {
  lesson: LESSON,
  tasks: [{ id: 's1', kind: 'zadanie', code: 'Z1', text: 'Podziel na sylaby:\nczekolada' }],
  review: [{ id: 'q1', kind: 'powtorzeniowe', code: 'PZ1', text: 'Ile samogłosek ma wyraz zeszyt?', answer: '2' }],
};

describe('buildQuizPrompt', () => {
  const prompt = buildQuizPrompt({ kind: 'kartkowka', className: 'IV B', lessons: [OPTION], count: 6 });

  it('mowi wprost, ile zadan, dla kogo i ze ma byc trudno', () => {
    expect(prompt).toContain('kartkówkę');
    expect(prompt).toContain('IV B');
    expect(prompt).toContain('6 zadań');
    expect(prompt).toContain('TRUDNA');
  });

  it('podaje material lekcji: kod, temat do dziennika, kody podstawy, zadania i pytania', () => {
    expect(prompt).toContain('4.2 Powtórka 1-3: Głoski, litery, sylaby');
    expect(prompt).toContain('Powtórzenie wiadomości z klas 1-3');
    expect(prompt).toContain('II.3.5, II.4.1');
    // Wielolinijkowe polecenie splaszczone do jednej linii spisu.
    expect(prompt).toContain('- Z1: Podziel na sylaby: czekolada');
    expect(prompt).toContain('- PZ1: Ile samogłosek ma wyraz zeszyt? (odp.: 2)');
  });

  it('opisuje punktacje i format odpowiedzi, ktory potem sam parsuje', () => {
    expect(prompt).toContain('więcej niż połowa przykładów dobrze - 1 pkt');
    expect(prompt).toContain('[1] Treść zadania za 1 punkt.');
    expect(parseGeneratedQuiz(prompt.slice(prompt.indexOf('[1] Treść')))).toHaveLength(2);
  });
});

describe('parseGeneratedQuiz', () => {
  it('czyta punkty ze znacznika, tresc i odpowiedz', () => {
    const out = parseGeneratedQuiz(`[1] Co to jest sylaba?
Odp.: część wyrazu z jedną samogłoską

[2] Podziel na sylaby:
a) czekolada
b) rower
Odp.: a) cze-ko-la-da b) ro-wer`);
    expect(out).toEqual([
      { text: 'Co to jest sylaba?', answer: 'część wyrazu z jedną samogłoską', points: 1 },
      { text: 'Podziel na sylaby:\na) czekolada\nb) rower', answer: 'a) cze-ko-la-da b) ro-wer', points: 2 },
    ]);
  });

  it('pomija wstep agenta przed pierwszym zadaniem', () => {
    const out = parseGeneratedQuiz('Jasne, oto kartkówka:\n\n[1] Pytanie');
    expect(out).toEqual([{ text: 'Pytanie', points: 1 }]);
  });

  it('przyjmuje tez zapis "1. (2 pkt)" i zadanie bez odpowiedzi', () => {
    const out = parseGeneratedQuiz('1. (2 pkt) Odmień przez przypadki: kot');
    expect(out).toEqual([{ text: 'Odmień przez przypadki: kot', points: 2 }]);
  });

  it('pusty tekst to brak zadan', () => {
    expect(parseGeneratedQuiz('   \n\n ')).toEqual([]);
  });
});
