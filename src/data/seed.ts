// Dane startowe ladowane przy pierwszym uruchomieniu (pusty store).
// Klasa "IV A" z 20 uczniami (docs/SEED_IVA.txt) + puste klasy IV B, IV C, V A.

import { newId } from './id';
import { parseStudentsText } from '../lib/parseStudents';
import type { Question, QuestionSet, SchoolClass, Settings, Student } from './types';

const SEED_IVA_TEXT = `
1. Cisowski Jakub
2. Downar Adam
3. Khaladtsou Pavel
4. Koleśnikowicz Mateusz
5. Kowalska Paulina
6. Kuzmenko Nikita
7. Lendhai Jascha - orzeczenie
8. Łakatosz Santiago - orzeczenie
9. Maruda Diana
10. Pagacz Antonina
11. Patejuk Ignacy - orzeczenie
12. Podiuk Aleksandra
13. Radysh Artem
14. Rychwicki Dawid
15. Snopczyńska Gabriela
16. Szybka Alicja
17. Vinnyk Denys
18. Zimnowodzki Wiktor
19. Żukowska Zuzanna
20. Żurek Zuzanna
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
    passesPerWeek: 2,
    hintGivesMinus: true,
    wheelSpinSec: 4,
  };

  return {
    classes: [classIVA, classIVB, classIVC, classVA],
    students,
    questionSets: [],
    questions: [],
    settings,
  };
}
