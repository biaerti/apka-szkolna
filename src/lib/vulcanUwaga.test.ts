import { describe, expect, it } from 'vitest';
import type { LessonPeriod, RecapEvent, SchoolClass, Student } from '../data/types';
import { buildVulcanUwagaTransfer, uczenForm, uwagaCategory, uwagaSentence } from './vulcanUwaga';

describe('vulcanUwaga', () => {
  it('rozroznia ucznia i uczennice po imieniu, z wyjatkami', () => {
    expect(uczenForm('Wiktoria')).toBe('Uczennica');
    expect(uczenForm('Oskar')).toBe('Uczeń');
    expect(uczenForm('Kuba')).toBe('Uczeń');
  });

  it('gotowce dostaja kategorie z listy VULCANA, wlasna tresc idzie jako Uwaga', () => {
    expect(uwagaCategory('Przeszkadza na lekcji')).toBe('Zachowanie na lekcji');
    expect(uwagaCategory('Nie wykonuje poleceń')).toBe('Wypełnianie obowiązków ucznia');
    expect(uwagaCategory('Wyśmiewa kolegów')).toBe('Szacunek dla innych osób');
    expect(uwagaCategory('rzucał gumką')).toBe('Uwaga');
    expect(uwagaCategory(undefined)).toBe('Uwaga');
  });

  it('gotowiec zamienia sie w pelne zdanie z wlasciwa forma', () => {
    expect(uwagaSentence('Telefon na lekcji', 'Wiktoria')).toBe(
      'Uczennica korzysta z telefonu w trakcie lekcji mimo upomnienia nauczyciela.',
    );
    expect(uwagaSentence('Przeszkadza na lekcji', 'Oskar')).toMatch(/^Uczeń przeszkadza/);
  });

  it('wlasna tresc dostaje duza litere i kropke, pusta - domyslna tresc', () => {
    expect(uwagaSentence('rzucał gumką w kolegów', 'Iwo')).toBe('Rzucał gumką w kolegów.');
    expect(uwagaSentence('Nie ma zeszytu!', 'Iwo')).toBe('Nie ma zeszytu!');
    expect(uwagaSentence(undefined, 'Iwo')).toBe('Przeszkadza na lekcji.');
  });

  it('buduje paczke z dniem, numerem lekcji i nazwa klasy w zapisie VULCANA', () => {
    const periods: LessonPeriod[] = [
      { no: 1, start: '08:00', end: '08:45' },
      { no: 2, start: '08:55', end: '09:40' },
    ] as LessonPeriod[];
    const event: RecapEvent = {
      id: 'e1',
      studentId: 's1',
      classId: 'c1',
      result: 'uwaga',
      note: 'Rozmawia i przekrzykuje',
      at: new Date(2026, 8, 18, 9, 10).toISOString(),
    };
    const student: Student = { id: 's1', classId: 'c1', firstName: 'Oskar', lastName: 'Lobpreis', number: 11, active: true };
    const schoolClass: SchoolClass = { id: 'c1', name: 'IV B', order: 1 };
    const t = buildVulcanUwagaTransfer({ event, student, schoolClass, periods });
    expect(t).toMatchObject({
      version: 1,
      kind: 'uwaga',
      eventId: 'e1',
      date: '2026-09-18',
      period: 2,
      vulcanClassName: '4B',
      category: 'Zachowanie na lekcji',
      student: { lastName: 'Lobpreis', number: 11 },
    });
    expect(t.content).toMatch(/^Uczeń rozmawia/);
  });
});
