import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DZIALY, LEKCJE } from '../data/odzera';
import { PLAN_DZIALOW } from '../data/odzera/plan';
import {
  KARTY,
  POLECENIA,
  POLECENIE_ZESZYT,
  bezInterpunkcji,
  doLiter,
  dystraktory,
  fiszkiNaDzis,
  gwiazdki,
  kafelkiLiter,
  kafelkiZdania,
  kartyLekcji,
  linieZeszytu,
  poziom,
  pulaDo,
  rng,
  seria,
  slugOZ,
  sprawdzTekst,
  stanyLekcji,
  zadaniaCwiczenia,
  zadaniaNowe,
  zadaniaPowtorki,
  zadaniaTestu,
  zadanieDzwonek,
  type WynikOZ,
} from './odzera';
import { wymowa } from './odzeraWymowa';

const cyrylica = /[Ѐ-ӿ]/;

describe('wymowa cyrylica', () => {
  it('jak w zeszycie: ł = ў, rz po p jak ш, akcent na przedostatniej', () => {
    expect(wymowa('szkoła', 'ru')).toBe('шко́ўа');
    expect(wymowa('Dzień dobry!', 'ru')).toBe('джень до́бры');
    expect(wymowa('Przepraszam.', 'ru')).toBe('пшепра́шам');
    expect(wymowa('Dziękuję.', 'ru')).toBe('дженку́е');
  });
  it('ukrainska wersja: y = и, i = і, ś = сь', () => {
    expect(wymowa('Dzień dobry!', 'ua')).toBe('дзєнь до́бри');
    expect(wymowa('siostra', 'ua')).toBe('сьо́стра');
    expect(wymowa('zima', 'ua')).toBe('зі́ма');
  });
  it('kazde slowo kursu da sie zapisac cyrylica (bez lacinskich liter)', () => {
    for (const k of KARTY.values()) {
      for (const j of ['ru', 'ua'] as const) {
        const w = k.wym?.[j] ?? wymowa(k.pl, j);
        expect(w, `${k.pl} (${j}): ${w}`).not.toMatch(/[a-ząćęłńóśźż]/i);
      }
    }
  });
});

describe('tresc kursu', () => {
  it('dzialy i lekcje maja kolejne numery', () => {
    DZIALY.forEach((d, i) => expect(d.nr).toBe(i + 1));
    LEKCJE.forEach((l, i) => expect(l.nr).toBe(i + 1));
    for (const d of DZIALY) {
      expect(d.lekcje.length).toBeGreaterThanOrEqual(5);
      expect(d.lekcje[d.lekcje.length - 1].test, `dzial ${d.nr} konczy sie "Sprawdź się"`).toBe(true);
      expect(d.kolor).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('kazda lekcja (poza testem) ma 6-10 slow i 3-6 zdan', () => {
    for (const l of LEKCJE) {
      if (l.test) {
        expect(l.slowa).toEqual([]);
        continue;
      }
      expect(l.slowa.length, `lekcja ${l.nr}`).toBeGreaterThanOrEqual(6);
      expect(l.slowa.length, `lekcja ${l.nr}`).toBeLessThanOrEqual(10);
      expect((l.zdania ?? []).length, `lekcja ${l.nr}`).toBeGreaterThanOrEqual(3);
      expect((l.zdania ?? []).length, `lekcja ${l.nr}`).toBeLessThanOrEqual(6);
    }
  });

  it('tytuly, cele i tlumaczenia sa po rosyjsku i ukrainsku', () => {
    const sprawdz = (t: { ru: string; ua: string }, gdzie: string) => {
      expect(t.ru.trim(), gdzie).not.toBe('');
      expect(t.ua.trim(), gdzie).not.toBe('');
      expect(t.ru, gdzie).toMatch(cyrylica);
      expect(t.ua, gdzie).toMatch(cyrylica);
    };
    for (const d of DZIALY) sprawdz(d.tytul, `dzial ${d.nr}`);
    for (const l of LEKCJE) {
      sprawdz(l.tytul, `lekcja ${l.nr}`);
      sprawdz(l.cel, `cel ${l.nr}`);
      for (const s of l.slowa) sprawdz(s, s.pl);
      for (const z of l.zdania ?? []) sprawdz(z, z.pl);
      for (const z of l.zasady ?? []) {
        sprawdz(z.opis, `zasada ${z.litery}`);
        sprawdz(z.dzwiek, `zasada ${z.litery}`);
      }
    }
  });

  it('ukrainskie tlumaczenia nie maja rosyjskich liter, rosyjskie - ukrainskich', () => {
    for (const k of KARTY.values()) {
      expect(k.ua, k.pl).not.toMatch(/[ыэёъ]/i);
      expect(k.ru, k.pl).not.toMatch(/[іїєґ]/i);
    }
    for (const l of LEKCJE) {
      expect(l.cel.ua + l.tytul.ua).not.toMatch(/[ыэёъ]/i);
      expect(l.cel.ru + l.tytul.ru).not.toMatch(/[іїєґ]/i);
    }
  });

  it('kazde slowo i zdanie ma unikalne nagranie w calym kursie', () => {
    const widziane = new Map<string, string>();
    for (const l of LEKCJE) {
      for (const t of [...l.slowa.map((s) => s.pl), ...(l.zdania ?? []).map((z) => z.pl)]) {
        const s = slugOZ(t);
        expect(widziane.has(s), `"${t}" (lekcja ${l.nr}) ma to samo nagranie co "${widziane.get(s)}"`).toBe(false);
        widziane.set(s, t);
      }
    }
  });

  it('w lekcji kazde slowo ma inny obrazek', () => {
    for (const l of LEKCJE) {
      const e = l.slowa.map((s) => s.e);
      expect(new Set(e).size, `lekcja ${l.nr}`).toBe(e.length);
      for (const x of e) expect(x.trim()).not.toBe('');
    }
  });

  it('przyklady zasad to slowa z tej albo wczesniejszych lekcji', () => {
    for (const l of LEKCJE) {
      for (const z of l.zasady ?? []) {
        expect(z.przyklady.length).toBeGreaterThan(0);
        for (const p of z.przyklady) {
          const k = KARTY.get(slugOZ(p));
          expect(k, `przyklad "${p}" w lekcji ${l.nr}`).toBeDefined();
          expect(k!.lekcja).toBeLessThanOrEqual(l.nr);
        }
      }
    }
  });

  it('lektorka nie czyta golych liter (TTS czyta je jako nazwy liter)', () => {
    for (const k of KARTY.values()) {
      const t = k.lektor ?? k.pl;
      for (const slowo of bezInterpunkcji(t).toLowerCase().split(' ')) {
        if (['i', 'a', 'o', 'u', 'w', 'z'].includes(slowo)) continue; // spojniki i przyimki
        expect([...slowo].length, `"${t}": samo "${slowo}"`).toBeGreaterThan(1);
      }
    }
  });

  it('dzialy zgadzaja sie z planem roku (kolor, emoji, numery lekcji)', () => {
    for (const d of DZIALY) {
      const p = PLAN_DZIALOW.find((x) => x.nr === d.nr);
      expect(p, `dzial ${d.nr} w plan.ts`).toBeDefined();
      expect(d.kolor.toLowerCase()).toBe(p!.kolor.toLowerCase());
      expect(d.e).toBe(p!.e);
      // lekcje dzialu N to 6(N-1)+1 ... 6N
      expect(d.lekcje.map((l) => l.nr)).toEqual(d.lekcje.map((_, i) => (d.nr - 1) * 6 + i + 1));
    }
  });

  it('polecenia maja nagrania (lista w tools/odzera-audio.py)', () => {
    const py = readFileSync('tools/odzera-audio.py', 'utf-8');
    for (const p of [...Object.values(POLECENIA), POLECENIE_ZESZYT]) expect(py, p.pl).toContain(`"${p.pl}"`);
  });

  it('slowa bez flag w emoji (na Windowsie wygladaja jak litery)', () => {
    for (const l of LEKCJE) for (const s of l.slowa) expect(s.e, s.pl).not.toMatch(/[\u{1F1E6}-\u{1F1FF}]/u);
  });

  it('zdania koncza sie kropka, wykrzyknikiem albo pytajnikiem', () => {
    for (const k of KARTY.values()) if (k.zdanie) expect(k.pl, k.pl).toMatch(/[.!?]$/);
  });
});

describe('zadania', () => {
  const r = rng('test');
  const l1 = LEKCJE[0];

  it('etap Nowe: najpierw zasady, kazde slowo poznane i sprawdzone sluchem', () => {
    const z = zadaniaNowe(l1, rng('a'));
    expect(z[0].typ).toBe('zasada');
    for (const k of kartyLekcji(1).filter((x) => !x.zdanie)) {
      expect(z.some((x) => x.typ === 'poznaj' && x.karta.id === k.id)).toBe(true);
      expect(z.some((x) => x.typ === 'sluchaj' && x.karta.id === k.id)).toBe(true);
    }
    // poznaj przed sprawdzeniem
    const i = z.findIndex((x) => x.typ === 'sluchaj');
    const k = (z[i] as { karta: { id: string } }).karta.id;
    expect(z.findIndex((x) => x.typ === 'poznaj' && x.karta.id === k)).toBeLessThan(i);
  });

  it('kazda lekcja ma 20-35 cwiczen (krotko: 10-22), klucze unikalne', () => {
    for (const l of LEKCJE.filter((x) => !x.test)) {
      const pelne = zadaniaCwiczenia(l, rng(`p${l.nr}`));
      const krotkie = zadaniaCwiczenia(l, rng(`k${l.nr}`), true);
      expect(pelne.length, `lekcja ${l.nr}`).toBeGreaterThanOrEqual(20);
      expect(pelne.length, `lekcja ${l.nr}`).toBeLessThanOrEqual(35);
      expect(krotkie.length, `lekcja ${l.nr}`).toBeGreaterThanOrEqual(10);
      expect(krotkie.length, `lekcja ${l.nr}`).toBeLessThanOrEqual(22);
      expect(new Set(pelne.map((z) => z.klucz)).size).toBe(pelne.length);
    }
  });

  it('opcje wyboru: dobra odpowiedz jest jedna, obrazki i teksty sie nie powtarzaja', () => {
    for (const l of LEKCJE.filter((x) => !x.test)) {
      for (const z of [...zadaniaNowe(l, rng('o')), ...zadaniaCwiczenia(l, rng('o'))]) {
        if (!('opcje' in z)) continue;
        expect(z.opcje.filter((o) => o.id === z.karta.id)).toHaveLength(1);
        expect(new Set(z.opcje.map((o) => o.e)).size, z.klucz).toBe(z.opcje.length);
        expect(new Set(z.opcje.map((o) => o.ru)).size, z.klucz).toBe(z.opcje.length);
        expect(z.opcje.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('opcje pochodza z lekcji, ktore uczen juz zna', () => {
    const z = zadaniaCwiczenia(LEKCJE[1], rng('x'));
    for (const x of z) if ('opcje' in x) for (const o of x.opcje) expect(o.lekcja).toBeLessThanOrEqual(2);
    expect(dystraktory(kartyLekcji(1)[0], pulaDo(1), r).every((k) => k.lekcja === 1)).toBe(true);
  });

  it('kafelki: te same litery + litery do pomylenia; zdanie + jeden obcy wyraz', () => {
    const k = KARTY.get('lyzka')!;
    expect(doLiter(k)).toBe(true);
    const kaf = kafelkiLiter(k, rng('l'));
    for (const lit of [...'łyżka']) expect(kaf).toContain(lit);
    expect(kaf.length).toBeGreaterThan(5);
    const zd = KARTY.get('to-jest-szkola')!;
    const kz = kafelkiZdania(zd, kartyLekcji(3).filter((x) => x.zdanie), rng('z'));
    expect(kz).toEqual(expect.arrayContaining(['To', 'jest', 'szkoła']));
    expect(kz.length).toBe(4);
  });

  it('test dzialu: ok. 20 zadan z calego dzialu', () => {
    const z = zadaniaTestu(DZIALY[0], rng('t'));
    expect(z.length).toBeGreaterThanOrEqual(16);
    expect(new Set(z.map((x) => x.klucz)).size).toBe(z.length);
  });

  it('powtorka i do dzwonka daja zadania z kart', () => {
    const fiszki = kartyLekcji(1).map((k, i) => ({ item: k.id, box: i % 5, due: '2026-12-01', last_known: i % 2 === 0 }));
    const p = zadaniaPowtorki(fiszkiNaDzis(fiszki, '2026-12-01'), rng('p'));
    expect(p.length).toBe(fiszki.length);
    const m = new Map(fiszki.map((f) => [f.item, f]));
    for (let n = 0; n < 30; n++) expect(zadanieDzwonek(pulaDo(1), m, rng(`d${n}`), [], n)).not.toBeNull();
  });
});

describe('sprawdzanie i postep', () => {
  it('sprawdzTekst: wielka litera i kropka nie licza sie, brak ogonkow = "ogonki"', () => {
    expect(sprawdzTekst('dzień dobry', 'Dzień dobry!')).toBe('dobrze');
    expect(sprawdzTekst('dzien dobry', 'Dzień dobry!')).toBe('ogonki');
    expect(sprawdzTekst('dzień dobre', 'Dzień dobry!')).toBe('zle');
  });

  it('fiszki na dzis: tylko po terminie, najpierw najstarsze', () => {
    const f = [
      { item: 'szkola', box: 2, due: '2026-12-03', last_known: true },
      { item: 'mysz', box: 0, due: '2026-12-01', last_known: false },
      { item: 'czapka', box: 1, due: '2026-12-09', last_known: true },
      { item: 'nie-ma-takiego', box: 0, due: '2026-12-01', last_known: false },
    ];
    expect(fiszkiNaDzis(f, '2026-12-05').map((x) => x.item)).toEqual(['mysz', 'szkola']);
  });

  it('poziom i gwiazdki', () => {
    expect(poziom(0).poziom).toBe(1);
    expect(poziom(99).poziom).toBe(1);
    expect(poziom(100).poziom).toBe(2);
    expect(poziom(300)).toEqual({ poziom: 3, od: 300, do: 600 });
    expect(gwiazdki(19, 20)).toBe(3);
    expect(gwiazdki(15, 20)).toBe(2);
    expect(gwiazdki(5, 20)).toBe(1);
  });

  it('seria: dni bez polskiego nie przerywaja, dzien bez nauki przerywa', () => {
    // IV A: polski pn, wt, sr, pt
    const dni = [1, 2, 3, 5];
    const pt = new Date('2026-12-11T10:00:00+01:00');
    expect(seria(new Set(['2026-12-07', '2026-12-08', '2026-12-09', '2026-12-11']), dni, pt)).toBe(4);
    // dzis (pt) jeszcze nic - seria trwa
    expect(seria(new Set(['2026-12-07', '2026-12-08', '2026-12-09']), dni, pt)).toBe(3);
    // sroda opuszczona
    expect(seria(new Set(['2026-12-07', '2026-12-08', '2026-12-11']), dni, pt)).toBe(1);
  });

  it('stany lekcji: tryb lekcja otwiera tyle, ile godzin; dom - po kolei', () => {
    const w = (nr: number): WynikOZ => ({ lekcja: nr, czesc: 'lekcja', punkty: 9, maks: 10, xp: 100, sekundy: 600, ukonczona: true, created_at: '2026-12-01T09:00:00Z' });
    const s = stanyLekcji([w(1)], 3);
    expect(s.get(1)).toBe('zrobiona');
    expect(s.get(2)).toBe('teraz');
    expect(s.get(3)).toBe('otwarta');
    expect(s.get(4)).toBe('zamknieta');
    const zero = stanyLekcji([], 0);
    expect(zero.get(1)).toBe('zamknieta');
    const dom = stanyLekcji([w(1), w(2)], null);
    expect(dom.get(3)).toBe('teraz');
    expect(dom.get(4)).toBe('zamknieta');
  });

  it('zeszyt dokleja tlumaczenie do slow z lekcji', () => {
    const linie = linieZeszytu(LEKCJE[0], 'ru');
    expect(linie[0]).toEqual({ pl: 'Cześć!', tlum: 'Привет! / Пока!' });
  });
});
