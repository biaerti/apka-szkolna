import type { Lesson, LessonProgress, SchoolClass, Student, TimetableEntry } from '../data/types';
import type { AttendanceStatus } from './attendance';
import { classGrade, lessonProgress } from './grade';
import { slotsFromProgress } from './lessonSlots';

export interface VulcanAttendanceRow {
  studentId: string;
  number: number;
  firstName: string;
  lastName: string;
  status: AttendanceStatus;
  symbol: '.' | '-' | 's';
}

export interface VulcanTransfer {
  version: 1;
  date: string;
  period: number;
  classId: string;
  className: string;
  vulcanClassName: string;
  subject: 'Język polski';
  lessonId: string;
  lessonCode?: string;
  topic: string;
  curriculum: string[];
  attendance: VulcanAttendanceRow[];
}

export interface VulcanScheduleEntry {
  date: string;
  period: number;
  className: string;
  subject: string;
  replacement?: string;
}

const ROMAN: Record<string, string> = {
  I: '1', II: '2', III: '3', IV: '4', V: '5', VI: '6', VII: '7', VIII: '8', IX: '9', X: '10',
};

/** "IV A" -> "4A", czyli zapis używany na liście lekcji VULCANA. */
export function vulcanClassName(name: string): string {
  const parts = name.trim().toUpperCase().split(/\s+/);
  const grade = ROMAN[parts[0]] ?? parts[0];
  return `${grade}${parts.slice(1).join('')}`;
}

export function lessonsForJournal(lessons: Lesson[], classes: SchoolClass[], classId: string): Lesson[] {
  const cls = classes.find((item) => item.id === classId);
  if (!cls) return [];
  const grade = classGrade(cls.name);
  return lessons.filter((lesson) => lesson.grade === grade).sort((a, b) => a.order - b.order);
}

export function suggestedJournalLesson(
  lessons: Lesson[],
  classes: SchoolClass[],
  classId: string,
  date: string,
  period?: number,
): Lesson | undefined {
  const candidates = lessonsForJournal(lessons, classes, classId);
  return (
    candidates.find((lesson) => {
      const progress = lessonProgress(lesson, classId);
      return slotsFromProgress(progress).some((slot) => slot.date === date && (period === undefined || slot.period === period));
    }) ??
    candidates.find((lesson) => period === undefined && lessonProgress(lesson, classId).lessonDate === date) ??
    candidates.find((lesson) => {
      const status: LessonProgress['status'] = lessonProgress(lesson, classId).status;
      return status === 'in_progress';
    }) ??
    candidates.find((lesson) => {
      const status = lessonProgress(lesson, classId).status;
      return status === 'planned';
    })
  );
}

export function buildVulcanTransfer(args: {
  date: string;
  entry: TimetableEntry;
  schoolClass: SchoolClass;
  lesson: Lesson;
  topic: string;
  students: Student[];
  attendance: Map<string, AttendanceStatus>;
}): VulcanTransfer {
  const { date, entry, schoolClass, lesson, students, attendance } = args;
  return {
    version: 1,
    date,
    period: entry.period,
    classId: schoolClass.id,
    className: schoolClass.name,
    vulcanClassName: vulcanClassName(schoolClass.name),
    subject: 'Język polski',
    lessonId: lesson.id,
    lessonCode: lesson.code,
    topic: args.topic.trim(),
    curriculum: lesson.curriculum ?? [],
    attendance: [...students]
      .filter((student) => student.active)
      .sort((a, b) => a.number - b.number)
      .map((student) => {
        const status = attendance.get(student.id) ?? 'present';
        return {
          studentId: student.id,
          number: student.number,
          firstName: student.firstName,
          lastName: student.lastName,
          status,
          symbol: status === 'absent' ? '-' : status === 'late' ? 's' : '.',
        };
      }),
  };
}
