import { describe, expect, it } from 'vitest';
import { DYKTANDA, dostepneLekcje } from '../data/dyktanda';
import {
  INNE,
  POMINIETE,
  SZABLONY_UWAG,
  bledyWgReguly,
  czasProby,
  doPoprawy,
  probyPoUwadze,
  szablonUwagi,
  grupyBledu,
  lekcjaTygodnia,
  podpowiedzSzablonu,
  podsumujProby,
  przekladUwagi,
  terminLekcji,
  wypelnijSzablon,
} from './dyktandoPostepy';

const dzienTygodnia = (key: string) => new Date(`${key}T12:00:00Z`).getUTCDay();

describe('daty lekcji w JSON-ach', () => {
  it('kazda lekcja startuje w poniedzialek, po kolei i bez powtorek', () => {
    const daty = DYKTANDA.map((l) => l.od);
    for (const d of daty) expect(dzienTygodnia(d), d).toBe(1);
    expect([...daty].sort()).toEqual(daty);
    expect(new Set(daty).size).toBe(daty.length);
    expect(DYKTANDA.map((l) => l.nr)).toEqual(DYKTANDA.map((_, i) => i + 1));
  });

  it('termin kazdej lekcji to niedziela', () => {
    for (const l of DYKTANDA) expect(dzienTygodnia(terminLekcji(l)), l.id).toBe(0);
  });
});

describe('lekcjaTygodnia', () => {
  it('przed kursem nie ma lekcji tygodnia', () => {
    expect(lekcjaTygodnia('2026-11-22')).toBeNull();
  });

  it('w tygodniu lekcji 1: termin w niedziele 29.11', () => {
    const t = lekcjaTygodnia('2026-11-27')!;
    expect(t.lekcja.nr).toBe(1);
    expect(t.termin).toBe('2026-11-29');
    expect(t.dniDoTerminu).toBe(3);
    expect(lekcjaTygodnia('2026-11-29')!.dniDoTerminu).toBe(1);
  });

  it('w poniedzialek wchodzi nastepna lekcja', () => {
    expect(lekcjaTygodnia('2026-11-30')!.lekcja.nr).toBe(2);
  });

  it('przerwa swiateczna: lekcja 5 ma dwa tygodnie', () => {
    const t = lekcjaTygodnia('2026-12-30')!;
    expect(t.lekcja.nr).toBe(5);
    expect(t.termin).toBe('2027-01-03');
  });

  it('ostatnia lekcja ma tydzien, potem kurs sie konczy', () => {
    const ostatnia = DYKTANDA[DYKTANDA.length - 1];
    const t = lekcjaTygodnia(ostatnia.od)!;
    expect(t.lekcja.id).toBe(ostatnia.id);
    expect(t.dniDoTerminu).toBe(7);
    expect(lekcjaTygodnia('2027-03-01')).toBeNull();
  });

  it('zgadza sie z dostepneLekcje: lekcja tygodnia to ostatnia otwarta', () => {
    for (const l of DYKTANDA) {
      const { dostepne } = dostepneLekcje(l.od);
      expect(dostepne[dostepne.length - 1].id).toBe(l.id);
      expect(lekcjaTygodnia(l.od)!.lekcja.id).toBe(l.id);
    }
  });
});

describe('podsumujProby', () => {
  const proby = [
    { lekcja: 'a', punkty: 20, maks: 30, sekundy: 400, created_at: '2026-11-24T10:00:00Z' },
    { lekcja: 'a', punkty: 28, maks: 30, sekundy: 300, created_at: '2026-11-25T10:00:00Z' },
    { lekcja: 'a', punkty: 25, maks: 30, sekundy: 200, created_at: '2026-11-26T10:00:00Z' },
    { lekcja: 'b', punkty: 30, maks: 30, sekundy: 100, created_at: '2026-11-26T11:00:00Z' },
  ];

  it('liczba prob, najlepsza i ostatnia', () => {
    const p = podsumujProby(proby, 'a')!;
    expect(p.ile).toBe(3);
    expect(p.najlepsza.punkty).toBe(28);
    expect(p.ostatnia.punkty).toBe(25);
    expect(podsumujProby(proby, 'c')).toBeNull();
  });

  it('czas po ludzku', () => {
    expect(czasProby(45)).toBe('45 s');
    expect(czasProby(370)).toBe('6 min');
    expect(czasProby(null)).toBe('');
  });

  it('podpowiada szablon uwagi', () => {
    expect(podpowiedzSzablonu(null)).toBe('zrob');
    expect(podpowiedzSzablonu(podsumujProby(proby, 'b'))).toBe('brawo');
    expect(podpowiedzSzablonu(podsumujProby(proby, 'a'))).toBe('postep');
    expect(podpowiedzSzablonu(podsumujProby(proby.slice(0, 1), 'a'))).toBe('popraw');
  });
});

describe('bledy wedlug reguly', () => {
  it('rozpoznaje regule bledu', () => {
    expect(grupyBledu({ wzor: 'góra', wpisane: 'gura' })).toEqual(['ó / u']);
    expect(grupyBledu({ wzor: 'rzeka', wpisane: 'żeka' })).toEqual(['rz / ż']);
    expect(grupyBledu({ wzor: 'szkoła', wpisane: 'szkola' })).toEqual(['ł / l']);
    expect(grupyBledu({ wzor: 'herbata', wpisane: 'cherbata' })).toEqual(['ch / h']);
    expect(grupyBledu({ wzor: 'szkoła', wpisane: 'shkoła' })).toEqual(['sz, cz']);
    expect(grupyBledu({ wzor: 'kot', wpisane: null })).toEqual([POMINIETE]);
    expect(grupyBledu({ wzor: 'kot', wpisane: 'kat' })).toEqual([INNE]);
  });

  it('jedno slowo moze miec dwie reguly', () => {
    expect(grupyBledu({ wzor: 'różowy', wpisane: 'rużowy' })).toEqual(['ó / u']);
    expect(grupyBledu({ wzor: 'może', wpisane: 'mosze' }).length).toBeGreaterThan(0);
  });

  it('grupuje i liczy uczniow, te same slowa z kilku prob licza sie raz', () => {
    const g = bledyWgReguly([
      { uczenId: 'u1', wzor: 'góra', wpisane: 'gura' },
      { uczenId: 'u1', wzor: 'góra', wpisane: 'gura' },
      { uczenId: 'u2', wzor: 'stół', wpisane: 'stuł' },
      { uczenId: 'u2', wzor: 'rzeka', wpisane: 'żeka' },
    ]);
    expect(g[0]).toMatchObject({ grupa: 'ó / u', ile: 2, uczniowie: 2 });
    expect(g[1]).toMatchObject({ grupa: 'rz / ż', ile: 1, uczniowie: 1 });
    expect(g[0].przyklady.map((p) => p.wzor)).toEqual(['góra', 'stół']);
  });
});

describe('szablony uwag', () => {
  it('kazdy szablon ma tlumaczenia i miesci sie w limicie bazy', () => {
    for (const s of SZABLONY_UWAG) {
      const w = wypelnijSzablon(s, 'rz / ż');
      expect(w.pl.length).toBeLessThanOrEqual(400);
      expect(w.ua && w.es).toBeTruthy();
      expect(w.pl).not.toContain('{');
    }
  });

  it('tlumaczy niezmieniony szablon, a wlasny tekst zostawia po polsku', () => {
    expect(przekladUwagi('Popraw ó / u i zrób tę lekcję jeszcze raz.', 'ua', 'ó / u')).toBe('Попрацюй над ó / u і зроби цей урок ще раз.');
    expect(przekladUwagi('Brawo! Bez błędów. Tak trzymaj!', 'es')).toBe('¡Bravo! Sin errores. ¡Sigue así!');
    expect(przekladUwagi('Brawo, Daniel!', 'ua')).toBeNull();
  });
});

describe('do poprawy po uwadze', () => {
  const proba = { punkty: 20, maks: 31, created_at: '2026-11-24T10:00:00Z' };
  const popraw = { tresc: 'Popraw ó / u i zrób tę lekcję jeszcze raz.', created_at: '2026-11-25T10:00:00Z' };

  it('rozpoznaje szablon z wstawiona regula', () => {
    expect(szablonUwagi(popraw.tresc)).toBe('popraw');
    expect(szablonUwagi('Brawo! Bez błędów. Tak trzymaj!')).toBe('brawo');
    expect(szablonUwagi('Brawo, tak dalej')).toBeNull();
  });

  it('uwaga po probie = do poprawy, nowa proba zamyka', () => {
    expect(doPoprawy(popraw, [proba])).toBe(true);
    expect(doPoprawy(popraw, [proba, { ...proba, punkty: 25, created_at: '2026-11-26T10:00:00Z' }])).toBe(false);
    expect(doPoprawy(undefined, [proba])).toBe(false);
  });

  it('pochwala i pelny wynik nie wymagaja poprawy', () => {
    expect(doPoprawy({ ...popraw, tresc: 'Widać postęp! Coraz mniej błędów.' }, [proba])).toBe(false);
    expect(doPoprawy(popraw, [{ ...proba, punkty: 31 }])).toBe(false);
    expect(doPoprawy({ ...popraw, tresc: 'Popatrz jeszcze na ł.' }, [proba])).toBe(true);
  });

  it('proby po uwadze', () => {
    expect(probyPoUwadze([proba, { ...proba, created_at: '2026-11-26T10:00:00Z' }], popraw)).toHaveLength(1);
  });
});
