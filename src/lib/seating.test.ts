import { describe, expect, it } from 'vitest';
import type { Seat, Student } from '../data/types';
import {
  buildDeskGrid,
  deskName,
  placeStudent,
  SEAT_ROWS,
  seatId,
  seatLabel,
  seatLabelByStudent,
  shortName,
  unseatedStudents,
} from './seating';

function student(id: string, firstName: string, lastName: string, classId = 'c1', active = true): Student {
  return { id, classId, firstName, lastName, number: 1, active };
}

const students: Student[] = [
  student('s1', 'Zosia', 'Kowalska'),
  student('s2', 'Zosia', 'Krupa'),
  student('s3', 'Antek', 'Nowak'),
  student('s4', 'Ola', 'Skreślona', 'c1', false),
  student('s5', 'Marek', 'Inna', 'c2'),
];

const seats: Seat[] = [
  { id: seatId('s1'), classId: 'c1', studentId: 's1', column: 'P', row: 1, side: 1 },
  { id: seatId('s2'), classId: 'c1', studentId: 's2', column: 'P', row: 1, side: 2 },
  { id: seatId('s4'), classId: 'c1', studentId: 's4', column: 'L', row: 3, side: 1 },
  { id: seatId('s5'), classId: 'c2', studentId: 's5', column: 'S', row: 2, side: 1 },
];

describe('seating', () => {
  it('etykieta lawki to kolumna i rzad', () => {
    expect(seatLabel({ column: 'P', row: 1 })).toBe('P1');
    expect(seatLabel({ column: 'S', row: 5 })).toBe('S5');
  });

  it('siatka ma stala liczbe rzedow i trzy kolumny L S P', () => {
    const grid = buildDeskGrid(seats, students, 'c1');
    expect(grid).toHaveLength(SEAT_ROWS);
    expect(grid[0].map((d) => d.column)).toEqual(['L', 'S', 'P']);
    expect(grid[0][2].label).toBe('P1');
  });

  it('sadza uczniow na wlasciwych miejscach i pomija nieaktywnych oraz inne klasy', () => {
    const grid = buildDeskGrid(seats, students, 'c1');
    const p1 = grid[0][2];
    expect(p1.places[0].student?.id).toBe('s1');
    expect(p1.places[1].student?.id).toBe('s2');
    expect(grid[2][0].places[0].student).toBeUndefined(); // s4 skreslona
    expect(grid[1][1].places[0].student).toBeUndefined(); // s5 z innej klasy
  });

  it('lista bez lawki zawiera tylko aktywnych uczniow klasy bez miejsca', () => {
    expect(unseatedStudents(seats, students, 'c1').map((s) => s.id)).toEqual(['s3']);
  });

  it('mapa etykiet po uczniu', () => {
    const labels = seatLabelByStudent(seats, 'c1');
    expect(labels.get('s1')).toBe('P1');
    expect(labels.has('s3')).toBe(false);
    expect(labels.has('s5')).toBe(false);
  });

  it('krotki podpis rozroznia dwie Zosie z tym samym inicjalem', () => {
    const cls = students.filter((s) => s.classId === 'c1');
    expect(shortName(students[0], cls)).toBe('Zosia Ko.');
    expect(shortName(students[1], cls)).toBe('Zosia Kr.');
    expect(shortName(students[2], cls)).toBe('Antek N.');
  });

  describe('placeStudent', () => {
    it('sadza ucznia bez lawki na wolnym miejscu', () => {
      const next = placeStudent(seats, { classId: 'c1', studentId: 's3', column: 'L', row: 2, side: 1 });
      expect(next.find((s) => s.studentId === 's3')).toMatchObject({ id: 'seat-s3', column: 'L', row: 2, side: 1 });
      expect(next).toHaveLength(seats.length + 1);
    });

    it('przesadzenie zastepuje stare miejsce zamiast dokladac drugie', () => {
      const next = placeStudent(seats, { classId: 'c1', studentId: 's1', column: 'S', row: 4, side: 2 });
      expect(next.filter((s) => s.studentId === 's1')).toHaveLength(1);
      expect(next.find((s) => s.studentId === 's1')).toMatchObject({ column: 'S', row: 4, side: 2 });
    });

    it('zajete miejsce to zamiana, gdy oboje siedza', () => {
      const withS3 = placeStudent(seats, { classId: 'c1', studentId: 's3', column: 'L', row: 2, side: 1 });
      const next = placeStudent(withS3, { classId: 'c1', studentId: 's3', column: 'P', row: 1, side: 1 });
      expect(next.find((s) => s.studentId === 's3')).toMatchObject({ column: 'P', row: 1, side: 1 });
      expect(next.find((s) => s.studentId === 's1')).toMatchObject({ column: 'L', row: 2, side: 1 });
    });

    it('uczen bez lawki wypycha siedzacego do "bez lawki"', () => {
      const next = placeStudent(seats, { classId: 'c1', studentId: 's3', column: 'P', row: 1, side: 1 });
      expect(next.find((s) => s.studentId === 's1')).toBeUndefined();
      expect(next.find((s) => s.studentId === 's3')).toMatchObject({ column: 'P', row: 1, side: 1 });
    });

    it('to samo miejsce zwraca te sama liste', () => {
      expect(placeStudent(seats, { classId: 'c1', studentId: 's1', column: 'P', row: 1, side: 1 })).toBe(seats);
    });
  });
});

describe('deskName', () => {
  it('daje pierwsze imie, a inicjal dokłada dopiero przy powtórce imienia', () => {
    const cls = [
      student('a', 'Zosia', 'Kowalska'),
      student('b', 'Zosia', 'Krupa'),
      student('c', 'Antek', 'Nowak'),
      student('d', 'Jeronimo Andres', 'Lopez'),
    ];
    expect(deskName(cls[0], cls)).toBe('Zosia Ko.');
    expect(deskName(cls[1], cls)).toBe('Zosia Kr.');
    expect(deskName(cls[2], cls)).toBe('Antek');
    expect(deskName(cls[3], cls)).toBe('Jeronimo');
  });
});
