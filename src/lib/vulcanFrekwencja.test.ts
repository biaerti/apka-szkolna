import { describe, expect, it } from 'vitest';
import type { SchoolClass, Student } from '../data/types';
import { buildFrekwencjaTransfer, checkRoster, rosterSummary, rowMatchesStudent, type FrekwencjaJob } from './vulcanFrekwencja';

const st = (id: string, number: number, lastName: string, firstName: string, active = true): Student => ({
  id,
  classId: 'c1',
  number,
  lastName,
  firstName,
  active,
});

describe('rowMatchesStudent', () => {
  it('lapie drugie imie i wielkosc liter', () => {
    expect(rowMatchesStudent('Staroń Oliwia Julia', { lastName: 'Staroń', firstName: 'Oliwia' })).toBe(true);
    expect(rowMatchesStudent('staroń  oliwia', { lastName: 'Staroń', firstName: 'Oliwia' })).toBe(true);
  });
  it('nie myli imion zaczynajacych sie tak samo', () => {
    expect(rowMatchesStudent('Nowak Anna', { lastName: 'Nowak', firstName: 'An' })).toBe(false);
  });
});

describe('checkRoster', () => {
  const students = [st('a', 6, 'Kowalska', 'Paulina'), st('b', 21, 'Niewiadomska', 'Zofia'), st('c', 12, 'Odszedł', 'Jan')];
  const rows = [
    { number: 6, name: 'Kowalska Paulina Joanna' },
    { number: 20, name: 'Niewiadomska Zofia' },
    { number: 7, name: 'Nowy Uczeń' },
  ];
  it('poprawia numery i wypisuje roznice', () => {
    const check = checkRoster(rows, students);
    expect(check.numberFixes).toEqual([{ studentId: 'b', from: 21, to: 20 }]);
    expect(check.missingInApp.map((r) => r.number)).toEqual([7]);
    expect(check.missingInVulcan.map((s) => s.id)).toEqual(['c']);
    expect(rosterSummary(check)).toBe('poprawione numery: 21→20; w VULCANIE, brak w apce: nr 7; w apce, brak w VULCANIE: nr 12');
  });
  it('bez ogonkow i z literowka: poprawia pisownie z VULCANA', () => {
    const kids = [st('p', 17, 'Pokładenko', 'Kira'), st('m', 9, 'Mikalauskajte', 'Kiryl')];
    const check = checkRoster(
      [
        { number: 17, name: 'Pokladenko Kira', main: 'Pokladenko Kira' },
        { number: 9, name: 'Mikalauskaite Kiryl', main: 'Mikalauskaite Kiryl' },
      ],
      kids,
    );
    expect(check.missingInApp).toEqual([]);
    expect(check.missingInVulcan).toEqual([]);
    expect(check.nameFixes).toEqual([{ studentId: 'm', lastName: 'Mikalauskaite', firstName: 'Kiryl' }]);
  });
  it('"ni" w kolumnie = nauczanie indywidualne, a pelna lista wylacza tych, co odeszli', () => {
    const kids = [1, 2, 3, 4, 5, 6].map((n) => st(`s${n}`, n, `Uczen${'abcdef'[n - 1]}`, 'X'));
    const rows = [1, 2, 3, 4, 5].map((n) => ({ number: n, name: `Uczen${'abcdef'[n - 1]} X`, symbol: n === 3 ? 'ni' : '' }));
    const check = checkRoster(rows, kids);
    expect(check.individual).toEqual(['s3']);
    expect(check.trusted).toBe(true);
    expect(check.missingInVulcan.map((s) => s.id)).toEqual(['s6']);
  });
  it('odwrocone imie i nazwisko, inna pisownia z tym samym numerem: nikt nie wylatuje (4A i 4C, 2026-10-07)', () => {
    const kids = [1, 2, 3, 4, 5].map((n) => st(`s${n}`, n, `Uczen${'abcde'[n - 1]}`, 'X'));
    kids.push(st('zofia', 21, 'Zofia', 'Niewiadomska'), st('jas', 27, 'Lendwaj', 'Jasiek'));
    const rows = [
      ...[1, 2, 3, 4, 5].map((n) => ({ number: n, name: `Uczen${'abcde'[n - 1]} X` })),
      { number: 20, name: 'Niewiadomska Zofia', main: 'Niewiadomska Zofia' },
      { number: 27, name: 'Lendvai Jascha', main: 'Lendvai Jascha' },
    ];
    const check = checkRoster(rows, kids);
    expect(check.missingInApp).toEqual([]);
    expect(check.missingInVulcan).toEqual([]);
    expect(check.numberFixes).toEqual([{ studentId: 'zofia', from: 21, to: 20 }]);
    expect(check.nameFixes).toEqual([
      { studentId: 'zofia', lastName: 'Niewiadomska', firstName: 'Zofia' },
      { studentId: 'jas', lastName: 'Lendvai', firstName: 'Jascha' },
    ]);
  });
  it('nieznany wiersz w VULCANIE = nikogo nie wylaczamy', () => {
    const kids = [1, 2, 3, 4, 5, 6].map((n) => st(`s${n}`, n, `Uczen${'abcdef'[n - 1]}`, 'X'));
    const rows = [...[1, 2, 3, 4, 5].map((n) => ({ number: n, name: `Uczen${'abcdef'[n - 1]} X` })), { number: 9, name: 'Zupelnie Ktosinny' }];
    const check = checkRoster(rows, kids);
    expect(check.missingInVulcan.map((s) => s.id)).toEqual(['s6']);
    expect(check.trusted).toBe(false);
  });
  it('wylaczony przez pomylke wraca, gdy jest w VULCANIE', () => {
    const kids = [1, 2, 3, 4, 5].map((n) => st(`s${n}`, n, `Uczen${'abcde'[n - 1]}`, 'X'));
    kids.push(st('zofia', 21, 'Zofia', 'Niewiadomska', false));
    const rows = [...[1, 2, 3, 4, 5].map((n) => ({ number: n, name: `Uczen${'abcde'[n - 1]} X` })), { number: 20, name: 'Niewiadomska Zofia', main: 'Niewiadomska Zofia' }];
    const check = checkRoster(rows, kids);
    expect(check.reactivate).toEqual(['zofia']);
    expect(check.missingInApp).toEqual([]);
  });
  it('lista innej klasy nie wylacza nikogo', () => {
    const kids = [1, 2, 3, 4, 5, 6].map((n) => st(`s${n}`, n, `Uczen${'abcdef'[n - 1]}`, 'X'));
    const rows = [1, 2, 3, 4, 5, 6].map((n) => ({ number: n, name: `Obcy${'abcdef'[n - 1]}ski Y` }));
    expect(checkRoster(rows, kids).trusted).toBe(false);
  });
  it('pomija nieaktywnych', () => {
    expect(checkRoster([], [st('x', 9, 'A', 'B', false)]).missingInVulcan).toEqual([]);
  });
});

describe('buildFrekwencjaTransfer', () => {
  it('dokleja nazwiska tylko lokalnie i mapuje statusy na legende VULCANA', () => {
    const job: FrekwencjaJob = {
      id: 'vf-1',
      date: '2026-09-24',
      period: 1,
      classId: 'c1',
      marks: [
        { studentId: 'a', status: 'absent' },
        { studentId: 'b', status: 'late' },
        { studentId: 'z', status: 'present' },
      ],
      topic: ' Temat ',
      status: 'pending',
      createdAt: '',
    };
    const cls: SchoolClass = { id: 'c1', name: 'V A' } as SchoolClass;
    const ni = { ...st('n', 9, 'N', 'n', false), note: 'nauczanie indywidualne' };
    const odszedl = st('o', 12, 'O', 'o', false);
    const t = buildFrekwencjaTransfer(job, cls, [st('b', 2, 'B', 'b'), st('a', 1, 'A', 'a'), ni, odszedl]);
    expect(t.vulcanClassName).toBe('5A');
    expect(t.topic).toBe('Temat');
    expect(t.students.map((s) => [s.number, s.legend])).toEqual([
      [1, 'nieobecność'],
      [2, 'spóźnienie'],
      [9, 'nauczanie indywidualne'],
    ]);
  });
});
