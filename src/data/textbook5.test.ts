import { describe, expect, it } from 'vitest';
import { buildTextbook5, RETIRED_TEXTBOOK5_TITLES, TEXTBOOK5_TOPIC_COUNT } from './textbook5';
import { cwiczenieById } from './cwiczenia';

describe('buildTextbook5', () => {
  const bundle = buildTextbook5('V', ['klasa-5a']);

  it('jest tylko dla klasy V', () => {
    expect(() => buildTextbook5('IV', [])).toThrow();
  });

  it('zaczyna od dialogu na Sztuce programowania', () => {
    expect(bundle.lessons).toHaveLength(TEXTBOOK5_TOPIC_COUNT);
    expect(bundle.lessons[0].title).toContain('dialog');
    expect(bundle.lessons[0].teacherPlan).toContain('Sztuk');
  });

  it('lekcja o gloskach: film, kolo z jej 5 zadaniami, zadanie z podrecznika', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('4. Głoski'))!;
    expect(lesson.teacherPlan).toContain('## Po lekcji uczeń');
    const kinds = lesson.slides.map((s) => s.kind);
    expect(kinds).toEqual(['topic', 'recap', 'video', 'recap', 'note', 'image', 'task', 'task']);
    const own = lesson.slides[3];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(5);
    expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId)).toHaveLength(5);
  });

  it('lekcja o Dziesiatym poziomie: definicje, czytanka, plan i zadania 5-9', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('7. Dziesiąty poziom'))!;
    expect(lesson.topic).toBe('Pomaganie - dziesiąty poziom przyjaźni');
    expect(lesson.textbookPage).toBe(31);
    expect(lesson.slides.map((s) => s.kind)).toEqual([
      'topic', 'recap', 'image', 'image', 'czytanka', 'task', 'note', 'image', 'image', 'image',
    ]);
    expect(lesson.slides[4]).toMatchObject({ kind: 'czytanka', czytankaId: 'dziesiaty-poziom' });

    const plan = lesson.slides[5];
    expect(plan).toMatchObject({
      kind: 'task',
      code: 'Z2',
      page: 34,
      exerciseNo: '2',
      studentAction: 'write-answer',
    });
    expect(plan.kind === 'task' && plan.body).toContain('Plan wydarzeń');
    expect(plan.kind === 'task' && plan.answerExample).toContain('Spotkanie Dominika');

    expect(lesson.slides[lesson.slides.length - 1]).toMatchObject({
      kind: 'image',
      code: 's. 35 zad. 9',
      studentAction: 'write-answer',
    });
  });

  it('nieosobowe formy: powtorka z filmu, nowe formy, zadania 1 i 3 oraz graficzna notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('12. Kiedy stosować'))!;
    expect(lesson.textbookPage).toBe(48);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'video', 'text', 'image', 'image', 'note']);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'wypowiedzenia-film1' });
    expect(lesson.slides[4]).toMatchObject({ kind: 'image', code: 's. 48 zad. 1', studentAction: 'write-answer' });
    expect(lesson.slides[5]).toMatchObject({ kind: 'image', code: 's. 49 zad. 3', studentAction: 'write-answer' });
    expect(lesson.slides[6]).toMatchObject({ kind: 'note', diagram: 'formyCzasownika' });
  });

  it('tryby czasownika: nowy film, zadania 2, 3 i 5 oraz graficzna notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('13. Co wyrażamy'))!;
    expect(lesson.textbookPage).toBe(50);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'video', 'image', 'image', 'image', 'note']);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'tryby-czasownika-film1' });
    expect(lesson.slides.slice(3, 6).map((s) => s.kind === 'image' && s.code)).toEqual([
      's. 51 zad. 2',
      's. 51 zad. 3',
      's. 52 zad. 5',
    ]);
    expect(lesson.slides[6]).toMatchObject({ kind: 'note', diagram: 'trybyCzasownika' });
  });

  it('rym: zaraz po Wikipedii, teoria i karta pracy Bartka jako obrazy, kolo, notatka; bez filmu', () => {
    const index = bundle.lessons.findIndex((l) => l.title.startsWith('15a. Rym'));
    expect(bundle.lessons[index - 1].title).toMatch(/^15\. Wikipedia/);
    const lesson = bundle.lessons[index];
    expect(lesson.registerTopic).toBe('Rym - schematy i rodzaje rymów');
    expect(lesson.slides.some((s) => s.kind === 'video')).toBe(false);
    const obrazy = lesson.slides.filter((s) => s.kind === 'image');
    expect(obrazy).toHaveLength(12);
    expect(obrazy.every((s) => s.kind === 'image' && s.url.startsWith('czytanki:rymy-'))).toBe(true);
    expect(lesson.slides.slice(-2).map((s) => s.kind)).toEqual(['recap', 'note']);
  });

  it('Wikipedia: czytanka, film, mapa s. 40-41, kolo z 6 pytaniami, notatka i zadanie domowe', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('15. Wikipedia'))!;
    expect(lesson.textbookPage).toBe(54);
    expect(lesson.slides.map((s) => s.kind)).toEqual([
      'topic', 'recap', 'czytanka', 'video', 'task', 'image', 'task', 'recap', 'note', 'image',
    ]);
    expect(lesson.slides[2]).toMatchObject({ kind: 'czytanka', czytankaId: 'wikipedia' });
    expect(lesson.slides[3]).toMatchObject({ kind: 'video', videoId: 'wikipedia-film1' });
    expect(lesson.slides[5]).toMatchObject({ kind: 'image', url: 'czytanki:komunikacja-s40-41.webp', page: 40 });
    const own = lesson.slides[7];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(6);
  });

  it('kazda lekcja ma plan dla nauczyciela, temat na starcie i notatke', () => {
    for (const lesson of bundle.lessons) {
      expect(lesson.teacherPlan).toMatch(/^## /);
      expect(lesson.slides[0].kind).toBe('topic');
      // Powtorka przed sprawdzianem (16a) to same karty - bez nowej notatki.
      if (!lesson.title.startsWith('16a.')) expect(lesson.slides.some((s) => s.kind === 'note'), lesson.title).toBe(true);
    }
  });

  it('kolo powtorzeniowe lekcji N pyta o lekcje N-1', () => {
    bundle.lessons.forEach((lesson, index) => {
      const recap = lesson.slides.find((s) => s.kind === 'recap' && s.questionSetId !== lesson.questionSetId);
      if (index === 0) expect(recap).toBeUndefined();
      else expect(recap && recap.kind === 'recap' && recap.questionSetId).toBe(bundle.lessons[index - 1].questionSetId);
    });
  });

  it('nie uzywa kursywy ani tabel, ktorych markdown-lite nie rysuje', () => {
    for (const lesson of bundle.lessons) {
      const text = JSON.stringify(lesson.slides) + lesson.teacherPlan;
      expect(text).not.toMatch(/(^|[^*\w])\*[^*\s][^*]*[^*\s]\*(?!\*)/);
      expect(text).not.toMatch(/\| \w+ \|/);
    }
  });

  it('podsumowanie dzialu: mapa s. 56, film, kolo z 6 pytaniami, dwa zadania i notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('16. Podsumowanie'))!;
    expect(lesson.textbookPage).toBe(56);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'image', 'video', 'recap', 'task', 'task', 'note']);
    expect(lesson.slides[3]).toMatchObject({ kind: 'video', videoId: 'podsumowanie5-dzial1-film1' });
    const own = lesson.slides[4];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(6);
  });

  it('dzial 2 idzie po dziale 1 jako osobna grupa na liscie lekcji', () => {
    const dzialy = [...new Set(bundle.lessons.map((l) => l.dzial))];
    expect(dzialy).toEqual(['Dział 1 - W poszukiwaniu przyjaźni', 'Dział 2 - Uwaga, uczucia!', 'Dział 3 - Ideały, autorytety, idole']);
    const pierwsza = bundle.lessons.findIndex((l) => l.dzial === 'Dział 2 - Uwaga, uczucia!');
    expect(bundle.lessons[pierwsza].title).toBe('17. Przenośnia - słowa nie wprost');
    expect(bundle.lessons.slice(pierwsza, pierwsza + 13).every((l) => l.dzial === 'Dział 2 - Uwaga, uczucia!')).toBe(true);
  });

  it('dzial 2: kazdy screen zadania to jedno zadanie z numerem strony i kodem dla kola', () => {
    const dzial2 = bundle.lessons.filter((l) => l.dzial === 'Dział 2 - Uwaga, uczucia!');
    expect(dzial2).toHaveLength(13);
    for (const lesson of dzial2) {
      for (const slide of lesson.slides) {
        if (slide.kind !== 'image') continue;
        expect(slide.url).toMatch(/^czytanki:d2-s\d{2}/);
        expect(slide.page).toBeGreaterThanOrEqual(60);
        if (slide.code) {
          expect(slide.code).toMatch(/^s\. \d+ (zad\. \d+|rozgrzewka)$/);
          expect(slide.url).toContain(`-s${slide.page}`);
        }
      }
    }
  });

  it('dzial 2: tylko dwie lekcje z czytanym wierszem, reszta bez dlugich tekstow', () => {
    const czytanki = bundle.lessons.flatMap((l) => l.slides.filter((s) => s.kind === 'czytanka').map((s) => s.kind === 'czytanka' && s.czytankaId));
    expect(czytanki).toEqual(expect.arrayContaining(['co-to-jest-radosc', 'przenosnie', 'co-to-znaczy', 'lwy']));
    const lwy = bundle.lessons.find((l) => l.title.startsWith('20.'))!;
    expect(lwy.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'czytanka', 'image', 'image', 'image', 'video', 'note', 'cwiczenie', 'cwiczenie']);
  });

  it('dzial 2: po notatce 1-3 karty Ćwiczymy razem, screeny zadan tylko przed filmem', () => {
    const dzial2 = bundle.lessons.filter((l) => l.dzial === 'Dział 2 - Uwaga, uczucia!');
    for (const lesson of dzial2) {
      const poNotatce = lesson.slides.slice(lesson.slides.findIndex((s) => s.kind === 'note') + 1);
      const karty = poNotatce.filter((s) => s.kind === 'cwiczenie');
      expect(karty.length, lesson.title).toBeGreaterThanOrEqual(1);
      expect(karty.length, lesson.title).toBeLessThanOrEqual(3);
      expect(karty.every((s) => s.kind === 'cwiczenie' && Boolean(cwiczenieById(s.cwiczenieId))), lesson.title).toBe(true);
      expect(poNotatce[0]?.kind, lesson.title).toBe('cwiczenie');
      // Wyjatek: recytacja - lamance i oddech to teksty do mowienia na glos cala klasa.
      if (!lesson.title.startsWith('21.')) expect(poNotatce.some((s) => s.kind === 'image'), lesson.title).toBe(false);
    }
  });

  it('powtorka przed sprawdzianem dzialu 1: same karty Ćwiczymy razem i opowiadanie na koniec', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('16a.'))!;
    expect(lesson.dzial).toBe('Dział 1 - W poszukiwaniu przyjaźni');
    const karty = lesson.slides.filter((s) => s.kind === 'cwiczenie');
    expect(karty).toHaveLength(14);
    expect(karty.every((s) => s.kind === 'cwiczenie' && Boolean(cwiczenieById(s.cwiczenieId)))).toBe(true);
    expect(lesson.slides[lesson.slides.length - 1].kind).toBe('task');
  });

  it('wycofane tematy nie wracaja w materiale', () => {
    for (const lesson of bundle.lessons) expect(RETIRED_TEXTBOOK5_TITLES.has(lesson.title)).toBe(false);
  });

  it('dzial 3 w nowym formacie: kolo z 3 pytaniami, film, 2-3 karty, notatka na koncu', () => {
    const dzial3 = bundle.lessons.filter((l) => l.dzial === 'Dział 3 - Ideały, autorytety, idole');
    expect(dzial3.map((l) => l.title.split('.')[0])).toEqual(['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41']);
    for (const lesson of dzial3) {
      const kinds = lesson.slides.map((s) => s.kind);
      expect(lesson.slides[1], lesson.title).toMatchObject({ kind: 'recap', questionCount: 3 });
      expect(kinds.filter((k) => k === 'video'), lesson.title).toHaveLength(1);
      expect(kinds[kinds.length - 1], lesson.title).toBe('note');
      const karty = lesson.slides.filter((s) => s.kind === 'cwiczenie');
      expect(karty.length, lesson.title).toBeGreaterThanOrEqual(2);
      expect(karty.length, lesson.title).toBeLessThanOrEqual(3);
      for (const k of karty) expect(k.kind === 'cwiczenie' && cwiczenieById(k.cwiczenieId), lesson.title).toBeTruthy();
      // screeny z podrecznika tylko przed filmem
      const film = kinds.indexOf('video');
      expect(kinds.slice(film).includes('image'), lesson.title).toBe(false);
      expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId), lesson.title).toHaveLength(6);
    }
  });
});
