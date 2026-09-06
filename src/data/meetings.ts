// Skrypt pierwszego zebrania z rodzicami (9 wrzesnia 2026 (sroda), 17:30).
// Trzymany w kodzie tylko jako dane startowe - po wstawieniu do store
// nauczyciel edytuje go w zakladce "Zebrania" i kod juz go nie nadpisuje.

import { newId } from './id';
import type { Meeting } from './types';

const PIERWSZE_ZEBRANIE_SKRYPT = `## 1. Obiady

- Obiady ruszyły od poniedziałku **7 września** - już się wydają.
- Do obiadów potrzebna jest **umowa obiadowa**. Można ją wziąć w portierni, u pani intendentki albo pobrać ze strony szkoły.
- Wypełnioną umowę można **oddać mnie** - zbiorę i przekażę dalej.

## 2. Warzywa i owoce + mleko

- Rozdaję dziś karteczki - zgody do podpisania na miejscu.
- **Dwa osobne podpisy**: jeden na warzywa i owoce, drugi na mleko. Można podpisać jedno, drugie albo oba.
- Proszę podpisać i oddać od razu, żeby nie wracać do tego na kolejnym zebraniu.

## 3. Rada Rodziców - wybór trójki klasowej

- Trzeba dziś wybrać **trójkę klasową** (3 osoby).
- **2 z 3 osób** idą na spotkanie z dyrektorem: **środa 16 września, 18:30**.
- Sala jeszcze nieznana - podam informację, jak dostanę.
- Potrzebne dane kontaktowe wybranych osób.

## 4. Etyka - zapisy

- **I religia, i etyka są nieobowiązkowe.** Dziecko może chodzić na oba przedmioty, na jeden albo na żaden.
- Ale to nie jest decyzja "na próbę": **jak się zapisze na etykę, to trzeba chodzić, a ocena idzie na świadectwo.**
- Dlatego proszę o przemyślaną decyzję, nie na zasadzie "zobaczymy".
- Rozdaję **zgodę zbiorczą** - obejmuje wycieczki, etykę itp. Proszę o wypełnienie i zwrot.

## Do wzięcia na zebranie

- karteczki "Warzywa i owoce" / mleko (dwa pola podpisu)
- zgody zbiorcze (wycieczki, etyka)
- lista obecności i kartka na dane trójki klasowej
- kilka wydruków umowy obiadowej dla chętnych

## Do dopytania w szkole

- sala na spotkanie z dyrektorem 16.09 o 18:30`;

/** Dane startowe zakladki "Zebrania": jeden kafelek z pierwszym zebraniem. */
export function buildSeedMeetings(): Meeting[] {
  return [
    {
      id: newId(),
      title: 'Pierwsze zebranie',
      date: '2026-09-09',
      time: '17:30',
      place: '',
      script: PIERWSZE_ZEBRANIE_SKRYPT,
      order: 0,
    },
  ];
}
