// Dane startowe ladowane przy pierwszym uruchomieniu (pusty store).
// Klasa "IV A" (docs/SEED_IVA.txt) + puste klasy IV B, IV C, V A. To tylko dane
// startowe trybu lokalnego - prawdziwa, aktualna lista (z przejsciami miedzy
// klasami) jest zaszyfrowana w Supabase. Nowych nazwisk tu nie dopisujemy, bo
// repo jest publiczne; dwie osoby, ktore opuscily IV A, zostaly usuniete.

import { newId } from './id';
import { parseStudentsText } from '../lib/parseStudents';
import type { Question, QuestionSet, SchoolClass, Settings, Student } from './types';

const SEED_IVA_TEXT = `
1. Cisowski Jakub
2. Downar Adam
3. Khaladtsou Pavel
4. Koleśnikowicz Mateusz
5. Kowalska Paulina
6. Łakatosz Santiago - orzeczenie
7. Maruda Diana
8. Pagacz Antonina
9. Patejuk Ignacy - orzeczenie
10. Podiuk Aleksandra
11. Radysh Artem
12. Rychwicki Dawid
13. Snopczyńska Gabriela
14. Szybka Alicja
15. Vinnyk Denys
16. Zimnowodzki Wiktor
17. Żukowska Zuzanna
18. Żurek Zuzanna
`.trim();

export interface SeedData {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  settings: Settings;
}

export function buildSeedData(): SeedData {
  const classIVA: SchoolClass = { id: newId(), name: 'IV A', order: 0 };
  const classIVB: SchoolClass = { id: newId(), name: 'IV B', order: 1 };
  const classIVC: SchoolClass = { id: newId(), name: 'IV C', order: 2 };
  const classVA: SchoolClass = { id: newId(), name: 'V A', order: 3 };

  const parsed = parseStudentsText(SEED_IVA_TEXT);
  const students: Student[] = parsed.map((p, idx) => ({
    id: newId(),
    classId: classIVA.id,
    firstName: p.firstName,
    lastName: p.lastName,
    number: p.number ?? idx + 1,
    note: p.note,
    active: true,
  }));

  const settings: Settings = {
    passesPerMonth: 2,
    hintGivesMinus: true,
    wheelSpinSec: 4,
    plusesForFive: 3,
    plombyForOne: 3,
    reviewQuestionCount: 5,
    answerTimerSec: 30,
    slideFontPercent: 100,
  };

  return {
    classes: [classIVA, classIVB, classIVC, classVA],
    students,
    questionSets: [],
    questions: [],
    settings,
  };
}
