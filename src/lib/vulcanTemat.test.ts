import { describe, expect, it } from 'vitest';
import type { Lesson, SchoolClass, TimetableEntry } from '../data/types';
import { buildTopicTransfer, isTopicJobId, isTopicSent, weekTopicItems } from './vulcanTemat';

const lesson: Lesson = {
  id: 'l1', grade: 'IV', title: '16. Co już wiesz?', registerTopic: 'Powtórzenie działu I', order: 1, slides: [],
  progress: { c1: { status: 'planned', lessonSlots: [
    { id: '2026-10-05-3', date: '2026-10-05', period: 3 },
    { id: '2026-10-05-4', date: '2026-10-05', period: 4 },
  ] } },
};
const cls = { id: 'c1', name: 'IV A', order: 1 } as SchoolClass;
const timetable: TimetableEntry[] = [
  { id: 't3', weekday: 1, period: 3, classId: 'c1' },
  { id: 't4', weekday: 1, period: 4, classId: 'c1' },
  { id: 't5', weekday: 1, period: 5, classId: 'c1' },
];
const monday = new Date('2026-10-05T12:00:00');

describe('temat z pulpitu do VULCANA', () => {
  it('bierze lekcje tygodnia z wybranym tematem, z częścią przy drugim użyciu', () => {
    const items = weekTopicItems([monday], [lesson], [cls], timetable, []);
    expect(items.map((item) => [item.period, item.vulcanClassName, item.topic])).toEqual([
      [3, '4A', 'Powtórzenie działu I'],
      [4, '4A', 'Powtórzenie działu I cz. 2'],
    ]);
  });

  it('paczka to frekwencja bez uczniów z flagą topicOnly', () => {
    const [item] = weekTopicItems([monday], [lesson], [cls], timetable, []);
    const transfer = buildTopicTransfer(item);
    expect(transfer).toMatchObject({ kind: 'frekwencja', topicOnly: true, students: [], period: 3, date: '2026-10-05' });
    expect(isTopicJobId(transfer.jobId)).toBe(true);
    expect(isTopicJobId('vf-2026-10-05-3-c1')).toBe(false);
  });

  it('po zmianie tematu przycisk wraca', () => {
    expect(isTopicSent({ status: 'done', topic: 'A' }, 'A')).toBe(true);
    expect(isTopicSent({ status: 'exists', topic: 'A' }, 'B')).toBe(false);
    expect(isTopicSent({ status: 'error', topic: 'A' }, 'A')).toBe(false);
  });
});
