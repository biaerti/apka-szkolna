// Temat z pulpitu do VULCANA ("do VULCANA" przy lekcji na planie tygodnia).
//
// Dodatek juz umie utworzyc lekcje z tematem - robi to przy frekwencji z
// telefonu, gdy lekcji jeszcze nie ma. Tu wysylamy ta sama paczke
// 'frekwencja', ale z topicOnly: true i bez uczniow: bot otwiera godzine w
// drzewie, tworzy lekcje z tematem i konczy, bez ruszania frekwencji. Gdy
// lekcja w VULCANIE juz jest, nic nie zmienia i odpowiada existed: true.
//
// Co poszlo, pamieta przegladarka (localStorage) - to wygoda tego komputera,
// nie stan do chmury.

import type { Lesson, SchoolClass, TimetableEntry, VulcanLesson } from '../data/types';
import { assignedLessonForSlot, dayEntries, lessonTitleWithPart } from './dashboardPlan';
import { toDateKey } from './dates';
import { vulcanClassName } from './vulcan';
import type { VulcanFrekwencjaTransfer } from './vulcanFrekwencja';

export interface TopicItem {
  date: string;
  period: number;
  classId: string;
  /** Nazwa klasy jak w VULCANIE ("4B"). */
  vulcanClassName: string;
  topic: string;
}

export type TopicSendStatus = 'queued' | 'sending' | 'done' | 'exists' | 'error';

export interface TopicSendState {
  status: TopicSendStatus;
  topic: string;
  message?: string;
}

export type VulcanTopicTransfer = Omit<VulcanFrekwencjaTransfer, 'students'> & { students: []; topicOnly: true };

export const TOPIC_JOB_PREFIX = 'vt-';
const STORAGE_KEY = 'apka-szkolna-vulcan-tematy';

export function topicKey(item: Pick<TopicItem, 'date' | 'period' | 'classId'>): string {
  return `${item.date}-${item.period}-${item.classId}`;
}

export function isTopicJobId(jobId: string | undefined): boolean {
  return typeof jobId === 'string' && jobId.startsWith(TOPIC_JOB_PREFIX);
}

export function buildTopicTransfer(item: TopicItem): VulcanTopicTransfer {
  return {
    version: 1,
    kind: 'frekwencja',
    topicOnly: true,
    jobId: `${TOPIC_JOB_PREFIX}${topicKey(item)}`,
    date: item.date,
    period: item.period,
    vulcanClassName: item.vulcanClassName,
    topic: item.topic.trim(),
    students: [],
    background: true,
  };
}

/** Temat do dziennika - tak samo jak w Dzienniku lekcji (Journal.tsx). */
export function registerTopic(lesson: Lesson, part: number): string {
  return lessonTitleWithPart(lesson.registerTopic ?? lesson.topic ?? lesson.title, part);
}

/** Lekcja z planu z wybranym tematem jako paczka do VULCANA (brak tematu albo klasy = nic). */
export function topicItemForSlot(lessons: Lesson[], schoolClass: SchoolClass, date: string, period: number): TopicItem | undefined {
  const assigned = assignedLessonForSlot(lessons, schoolClass.id, date, period);
  if (!assigned) return undefined;
  return { date, period, classId: schoolClass.id, vulcanClassName: vulcanClassName(schoolClass.name), topic: registerTopic(assigned.lesson, assigned.part) };
}

/** Wszystkie lekcje tygodnia z wybranym tematem (pon-pt). */
export function weekTopicItems(days: Date[], lessons: Lesson[], classes: SchoolClass[], timetable: TimetableEntry[], vulcanLessons: VulcanLesson[]): TopicItem[] {
  const items: TopicItem[] = [];
  for (const date of days.slice(0, 5)) {
    for (const entry of dayEntries(date, vulcanLessons, timetable)) {
      const schoolClass = entry.classId ? classes.find((cls) => cls.id === entry.classId) : undefined;
      const item = schoolClass && topicItemForSlot(lessons, schoolClass, toDateKey(date), entry.period);
      if (item) items.push(item);
    }
  }
  return items;
}

/** Lekcja jest juz w VULCANIE z tym tematem - przycisk niepotrzebny. */
export function isTopicSent(state: TopicSendState | undefined, topic: string): boolean {
  return Boolean(state && (state.status === 'done' || state.status === 'exists') && state.topic === topic.trim());
}

export function loadSentTopics(): Record<string, TopicSendState> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

/** Zapisuje tylko zakonczone (done/exists) - kolejka i bledy zyja w pamieci. */
export function saveSentTopics(states: Record<string, TopicSendState>): void {
  const kept = Object.fromEntries(Object.entries(states).filter(([, state]) => state.status === 'done' || state.status === 'exists'));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
  } catch {
    /* tryb prywatny albo pelny magazyn - po odswiezeniu przycisk wroci */
  }
}
