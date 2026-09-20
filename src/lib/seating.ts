// Miejsca w lawkach - obliczenia pod widok "Sala" (src/pages/Sala.tsx).
//
// Sala jest jedna dla wszystkich klas: trzy kolumny lawek (L / S / P, patrzac
// od tablicy w strone klasy - P jest po prawej rece nauczyciela) po piec
// rzedow, w kazdej lawce dwa miejsca. Rzad 1 stoi przy tablicy. Etykieta
// lawki to litera kolumny i numer rzedu ("P1"), bo tak Bartek mowi o lawkach
// na lekcji. Na ekranie tablica jest na dole, a rzedy ida w gore - odwraca to
// samo wyswietlanie w DeskGrid, dane zostaja w kolejnosci od tablicy.
//
// Tu sa same czyste funkcje; stan (lista Seat) siedzi w store.

import type { Seat, SeatColumn, Student } from '../data/types';

export const SEAT_COLUMNS: SeatColumn[] = ['L', 'S', 'P'];
export const SEAT_ROWS = 5;
export const SEAT_SIDES: Array<1 | 2> = [1, 2];

/** Polozenie miejsca bez ucznia - to, co klika sie w siatce. */
export interface SeatPosition {
  column: SeatColumn;
  row: number;
  side: 1 | 2;
}

/** Id miejsca wyliczane z ucznia: jeden uczen = najwyzej jedno miejsce (upsert). */
export function seatId(studentId: string): string {
  return `seat-${studentId}`;
}

/** "P1", "S3" - etykieta lawki bez strony (w UI widac oba nazwiska w lawce). */
export function seatLabel(seat: Pick<Seat, 'column' | 'row'>): string {
  return `${seat.column}${seat.row}`;
}

/** Klucz miejsca w mapach - kolumna, rzad i strona. */
export function seatKey(pos: SeatPosition): string {
  return `${pos.column}${pos.row}-${pos.side}`;
}

export function samePosition(a: SeatPosition, b: SeatPosition): boolean {
  return a.column === b.column && a.row === b.row && a.side === b.side;
}

/**
 * Sadza ucznia na miejscu i zwraca nowa liste (albo TE SAMA, gdy nic sie nie
 * zmienia). Zajete miejsce oznacza zamiane: tamten uczen dostaje dotychczasowe
 * miejsce sadzanego, a gdy sadzany miejsca nie mial - schodzi do "bez lawki".
 * Tak dziala tryb "Rozsadz" na telefonie: tap w miejsce, tap w ucznia.
 */
export function placeStudent(
  seats: Seat[],
  { classId, studentId, column, row, side }: { classId: string; studentId: string } & SeatPosition,
): Seat[] {
  const target = { column, row, side };
  const mine = seats.find((seat) => seat.studentId === studentId);
  const taken = seats.find((seat) => seat.classId === classId && samePosition(seat, target));
  if (taken && taken.studentId === studentId) return seats;
  const rest = seats.filter((seat) => seat.studentId !== studentId && seat.id !== taken?.id);
  const next: Seat[] = [...rest, { id: seatId(studentId), classId, studentId, ...target }];
  if (taken && mine) next.push({ ...taken, column: mine.column, row: mine.row, side: mine.side });
  return next;
}

/** Miejsca jednej klasy. */
export function seatsOfClass(seats: Seat[], classId: string): Seat[] {
  return seats.filter((seat) => seat.classId === classId);
}

/** Jedna lawka w siatce: dwa miejsca, kazde z uczniem albo puste. */
export interface Desk {
  column: SeatColumn;
  row: number;
  label: string;
  places: Array<{ side: 1 | 2; student?: Student }>;
}

/**
 * Siatka lawek klasy: rzedy od tablicy, w rzedzie kolumny L S P. Zawsze
 * SEAT_ROWS rzedow, zeby w trybie rozsadzania byly wolne miejsca do klikania.
 * Uczen nieaktywny (skreslony) nie siedzi nigdzie, nawet jesli ma stary wpis.
 */
export function buildDeskGrid(seats: Seat[], students: Student[], classId: string): Desk[][] {
  const byKey = new Map<string, Student>();
  const studentById = new Map(students.filter((st) => st.active).map((st) => [st.id, st]));
  for (const seat of seatsOfClass(seats, classId)) {
    const student = studentById.get(seat.studentId);
    if (student) byKey.set(seatKey(seat), student);
  }
  const rows: Desk[][] = [];
  for (let row = 1; row <= SEAT_ROWS; row++) {
    rows.push(
      SEAT_COLUMNS.map((column) => ({
        column,
        row,
        label: seatLabel({ column, row }),
        places: SEAT_SIDES.map((side) => ({ side, student: byKey.get(seatKey({ column, row, side })) })),
      })),
    );
  }
  return rows;
}

/** Etykieta lawki kazdego ucznia klasy ("P1"); brak wpisu = uczen bez lawki. */
export function seatLabelByStudent(seats: Seat[], classId: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const seat of seatsOfClass(seats, classId)) out.set(seat.studentId, seatLabel(seat));
  return out;
}

/** Aktywni uczniowie klasy, ktorzy nie maja jeszcze miejsca - do listy "Bez lawki". */
export function unseatedStudents(seats: Seat[], students: Student[], classId: string): Student[] {
  const seated = new Set(seatsOfClass(seats, classId).map((seat) => seat.studentId));
  return students
    .filter((st) => st.classId === classId && st.active && !seated.has(st.id))
    .sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl') || a.firstName.localeCompare(b.firstName, 'pl'));
}

/**
 * Krotki podpis na kafelku lawki: imie i inicjal nazwiska ("Zosia K."). Na
 * telefonie w lawce mieszcza sie dwa takie podpisy, pelne nazwisko juz nie.
 * Gdy w klasie sa dwie osoby o tym samym imieniu i inicjale, dokladamy
 * drugi znak nazwiska, zeby dalo sie je odroznic.
 */
export function shortName(student: Student, classmates: Student[]): string {
  const initial = student.lastName.slice(0, 1);
  const clash = classmates.some(
    (other) =>
      other.id !== student.id &&
      other.firstName === student.firstName &&
      other.lastName.slice(0, 1) === initial,
  );
  const tail = clash ? student.lastName.slice(0, 2) : initial;
  return `${student.firstName} ${tail}.`;
}
