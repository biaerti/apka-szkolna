import { describe, expect, it } from 'vitest';
import type { Lesson, SchoolClass, Student, TimetableEntry } from '../data/types';
import { buildVulcanTransfer, suggestedJournalLesson, vulcanClassName } from './vulcan';

const classes: SchoolClass[] = [{ id: 'c1', name: 'IV A', order: 0 }];
const lessons: Lesson[] = [
  { id: 'l1', grade: 'IV', title: 'Pierwsza', order: 0, progress: { c1: { status: 'done' } }, slides: [] },
  { id: 'l2', grade: 'IV', title: 'Druga', order: 1, progress: {}, slides: [], registerTopic: 'Temat drugi', curriculum: ['II.1.1'] },
];

describe('VULCAN transfer', () => {
  it('zamienia nazwę klasy na zapis VULCANA', () => {
    expect(vulcanClassName('IV A')).toBe('4A');
    expect(vulcanClassName('VIII C')).toBe('8C');
  });

  it('podpowiada pierwszą niezrobioną lekcję klasy', () => {
    expect(suggestedJournalLesson(lessons, classes, 'c1', '2026-09-14')?.id).toBe('l2');
  });

  it('rozróżnia dwie lekcje tej samej klasy w jednym dniu', () => {
    const scheduled = [
      { ...lessons[0], progress: { c1: { status: 'in_progress' as const, lessonDate: '2026-09-14', lessonPeriod: 2 } } },
      { ...lessons[1], progress: { c1: { status: 'in_progress' as const, lessonDate: '2026-09-14', lessonPeriod: 3 } } },
    ];
    expect(suggestedJournalLesson(scheduled, classes, 'c1', '2026-09-14', 2)?.id).toBe('l1');
    expect(suggestedJournalLesson(scheduled, classes, 'c1', '2026-09-14', 3)?.id).toBe('l2');
  });

  it('buduje symbole obecności, nieobecności i spóźnienia', () => {
    const students: Student[] = [
      { id: 's1', classId: 'c1', firstName: 'Ada', lastName: 'Nowak', number: 1, active: true },
      { id: 's2', classId: 'c1', firstName: 'Jan', lastName: 'Kowalski', number: 2, active: true },
      { id: 's3', classId: 'c1', firstName: 'Ola', lastName: 'Lis', number: 3, active: true },
    ];
    const entry: TimetableEntry = { id: 't', weekday: 1, period: 2, classId: 'c1' };
    const payload = buildVulcanTransfer({
      date: '2026-09-14', entry, schoolClass: classes[0], lesson: lessons[1], topic: ' Temat ', students,
      attendance: new Map([['s2', 'absent'], ['s3', 'late']]),
    });
    expect(payload.topic).toBe('Temat');
    expect(payload.attendance.map((row) => row.symbol)).toEqual(['.', '-', 's']);
  });
});
