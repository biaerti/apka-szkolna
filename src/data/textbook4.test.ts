import { describe, expect, it } from 'vitest';
import { buildTextbook4, TEXTBOOK4_TOPIC_COUNT } from './textbook4';
import { ROZDZIAL_2 } from './textbook4rozdzial2';
import { ROZDZIAL_3 } from './textbook4rozdzial3';
import { LEKTURA_CHLOPCY } from './lekturaChlopcy';
import { filmikById } from './filmiki';
import { cwiczenieById } from './cwiczenia';
import { estimateTextHeight, fitFontSize } from '../components/slides/fitText';

describe('buildTextbook4', () => {
  it('trzyma kolejnosc tematow z podrecznika i ich strony', () => {
    const bundle = buildTextbook4('IV', ['4a', '4b']);
    expect(bundle.lessons).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    expect(bundle.lessons[0]).toMatchObject({ title: '1-2. Krok po kroku tworzymy pierwszą wspólną opowieść', textbookPage: 12 });
    expect(bundle.lessons.find((l) => l.title.startsWith('5-6.'))).toMatchObject({ textbookPage: 22 });
    const pages = bundle.lessons.filter((l) => l.dzial !== ROZDZIAL_2 && l.dzial !== LEKTURA_CHLOPCY).map((l) => l.textbookPage ?? 0);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('kazda lekcja zaczyna sie zapisaniem tematu i konczy notatka do zeszytu', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    // Rozdzial II ma wlasny format (klasa 5) - osobny test nizej.
    const rozdzial1 = bundle.lessons.filter((l) => l.dzial !== ROZDZIAL_2 && l.dzial !== LEKTURA_CHLOPCY && l.dzial !== ROZDZIAL_3);
    expect(rozdzial1.slice(5).map((lesson) => lesson.title)).toEqual([
      '8. Dlaczego warto być sobą?',
      '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
      '11-13. Czas na czasownik',
      '14. Czy każda nasza wypowiedź jest zdaniem?',
      '15. Tworzymy plan ramowy',
      '16. Co już wiesz? Co umiesz?',
    ]);
    for (const [index, lesson] of rozdzial1.entries()) {
      expect(lesson.exercisePage).toBeUndefined();
      expect(lesson.slides[0]).toMatchObject({ kind: 'topic', variant: 'write' });
      // Formaty: dawny (slajd read, notatka na koniec) albo nowy - czytanka z
      // lektorem lub filmik, a notatka PRZED zadaniami. Zadania nowego formatu
      // moga byc screenami z podrecznika (obraz ze strona i kodem).
      const czytanka = lesson.slides.some((slide) => slide.kind === 'czytanka');
      const filmik = lesson.slides.some((slide) => slide.kind === 'video');
      const screeny = lesson.slides.filter((slide) => slide.kind === 'image' && slide.code);
      const nowyFormat = czytanka || filmik || screeny.length > 0;
      expect(nowyFormat || lesson.slides.some((slide) => slide.kind === 'read')).toBe(true);
      // Pierwsze piec tematow ma 3-4 zadania, krotsze prezentacje podsumowujace - 2,
      // plan ramowy ma dwa slajdy rozmowy i dwa zadania, screeny nie sa taskami.
      const expectedTasks = lesson.title.startsWith('15.') ? 4 : screeny.length > 0 || filmik ? 0 : czytanka ? 3 : index >= 5 ? 2 : lesson.title.startsWith('4.') ? 4 : 3;
      expect(lesson.slides.filter((slide) => slide.kind === 'task')).toHaveLength(expectedTasks);
      expect(lesson.slides.filter((slide) => slide.kind === 'task').every((slide) => Boolean(slide.answerExample))).toBe(true);
      // Zadnych slajdow zwiazanych z kartami A5 - Bartek moze ich nie drukowac.
      expect(lesson.slides.some((slide) => slide.kind === 'topic' && slide.variant === 'handout')).toBe(false);
      expect(lesson.slides.some((slide) => slide.kind === 'text' && slide.title === 'Wracamy do karty A5')).toBe(false);
      // Zadania bez plakietki "do zeszytu" - Bartek ja wycofal z tych prezentacji.
      expect(lesson.slides.filter((slide) => slide.kind === 'task').some((slide) => slide.zeszyt)).toBe(false);
      // Kazda lekcje zamyka notatka "Temat: ..." do przepisania.
      const closing = nowyFormat ? lesson.slides.find((slide) => slide.kind === 'note')! : lesson.slides[lesson.slides.length - 1];
      expect(closing).toMatchObject({ kind: 'note', title: 'Notatka do zeszytu' });
      expect(closing.kind === 'note' ? closing.body : '').toMatch(/^\*\*Temat:\*\* /);
      // Notatka A5 do wydruku jest pelna (bez luk {{...}}) - nie ma juz slajdu
      // wracania do karty, wiec nie byloby kiedy uzupelniac pol.
      expect(lesson.notebookNote).toBeTruthy();
      expect(lesson.notebookNote).not.toMatch(/\{\{/);
    }
    const firstRead = bundle.lessons[0].slides.find((slide) => slide.kind === 'read');
    expect(firstRead).toMatchObject({ page: 12, pageTo: 15, timerSec: 20 * 60 });
  });

  it('zadania mieszcza sie na slajdzie projektora', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const tasks = bundle.lessons.flatMap((lesson) => lesson.slides.filter((slide) => slide.kind === 'task'));
    for (const task of tasks) {
      const opts = { width: task.art ? 620 : 1000, height: 430, min: 26, max: 66 };
      const size = fitFontSize(task.body, opts);
      expect(estimateTextHeight(task.body, size, opts), `${task.code}: ${task.body.slice(0, 40)}`).toBeLessThanOrEqual(opts.height);
    }
  });

  it('kazdy temat ma notatke A5 i pytania do kola z odpowiedziami', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.questionSets).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    for (const lesson of bundle.lessons.filter((l) => l.dzial !== ROZDZIAL_2 && l.dzial !== LEKTURA_CHLOPCY && l.dzial !== ROZDZIAL_3)) {
      expect(lesson.notebookNote).toBeTruthy();
    }
    for (const lesson of bundle.lessons) {
      const qs = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      expect(qs.length).toBeGreaterThanOrEqual(4);
      expect(qs.every((q) => Boolean(q.answer))).toBe(true);
    }
  });

  it('czasownik: ramka, filmik, kolo z pytaniami z filmu, notatka i screeny zadan', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lesson = bundle.lessons.find((l) => l.title === '11-13. Czas na czasownik')!;
    expect(lesson.slides.map((slide) => slide.kind)).toEqual([
      'topic', 'recap', 'image', 'video', 'recap', 'note', 'cwiczenie', 'cwiczenie', 'title', 'image', 'image', 'image', 'image', 'image',
    ]);
    // Po notatce odmiana na slajdzie: osoby i liczby, potem czas przeszly z rodzajami.
    expect(lesson.slides.slice(6, 8)).toEqual([
      expect.objectContaining({ cwiczenieId: 'k4-czasownik-terazniejszy' }),
      expect.objectContaining({ cwiczenieId: 'k4-czasownik-przeszly' }),
    ]);
    // Kolo na start powtarza poprzednia lekcje, kolo po filmie pyta o zadania z filmu.
    expect(lesson.slides[1]).toMatchObject({ kind: 'recap' });
    expect(lesson.slides[1]).not.toMatchObject({ questionSetId: lesson.questionSetId });
    expect(lesson.slides[4]).toMatchObject({ kind: 'recap', questionSetId: lesson.questionSetId });
    const setQuestions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
    expect(setQuestions).toHaveLength(4);
    // Kazdy screen zadania ma strone i kod, wiec dziala na nim kolo na lekcji.
    const screeny = lesson.slides.slice(9);
    expect(screeny.every((slide) => slide.kind === 'image' && typeof slide.page === 'number' && Boolean(slide.code))).toBe(true);
  });

  it('wypowiedzenia: film, nowe podobne zadania przez 60 sekund i graficzna notatka', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lesson = bundle.lessons.find((l) => l.title === '14. Czy każda nasza wypowiedź jest zdaniem?')!;

    expect(lesson.slides.map((slide) => slide.kind)).toEqual([
      'topic', 'recap', 'video', 'recap', 'note', 'title', 'image', 'image', 'image',
    ]);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'wypowiedzenia-film1' });
    expect(lesson.slides[3]).toMatchObject({
      kind: 'recap',
      questionSetId: lesson.questionSetId,
      questionCount: 4,
      afterVideoPractice: true,
    });
    expect(lesson.slides[4]).toMatchObject({ kind: 'note', diagram: 'wypowiedzenia' });
    expect(lesson.slides[5]).toMatchObject({ kind: 'title', subtitle: 'Otwórzcie podręczniki na stronie 45' });
    expect(lesson.slides.slice(6)).toEqual([
      expect.objectContaining({ kind: 'image', page: 45, code: 's.45 zad.2', title: 'Zadanie 2', studentAction: 'textbook' }),
      expect.objectContaining({ kind: 'image', page: 45, code: 's.45 zad.3', title: 'Zadanie 3', studentAction: 'oral', studentActionText: 'Ustnie' }),
      expect.objectContaining({ kind: 'image', page: 45, code: 's.45 zad.4', title: 'Zadanie 4', studentAction: 'write-answer', studentActionText: 'Do zeszytu' }),
    ]);

    const questions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
    expect(questions).toHaveLength(4);
    expect(questions.some((q) => q.text.includes('Nie otwierać okna'))).toBe(true);
  });

  it('plan ramowy: czytanka, rozmowa, filmik, kolo z nowymi zadaniami, notatka i zadania 5-6', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lesson = bundle.lessons.find((l) => l.title === '15. Tworzymy plan ramowy')!;

    expect(lesson.slides.map((slide) => slide.kind)).toEqual([
      'topic', 'recap', 'czytanka', 'task', 'task', 'video', 'recap', 'note', 'title', 'task', 'task',
    ]);
    expect(lesson.slides[2]).toMatchObject({ kind: 'czytanka', czytankaId: 'historia-o-akceptacji' });
    expect(lesson.slides[3]).toMatchObject({ kind: 'task', code: 'PYT. 1-3', studentAction: 'oral' });
    expect(lesson.slides[4]).toMatchObject({ kind: 'task', code: 'PYT. 4-6', studentAction: 'oral' });
    expect(lesson.slides[5]).toMatchObject({ kind: 'video', videoId: 'plan-ramowy-film1' });
    expect(filmikById('plan-ramowy-film1')).toBeTruthy();
    expect(lesson.slides[6]).toMatchObject({ kind: 'recap', questionSetId: lesson.questionSetId, questionCount: 5 });
    expect(lesson.slides[7]).toMatchObject({ kind: 'note', diagram: 'planRamowy' });
    expect(lesson.slides[9]).toMatchObject({ kind: 'task', code: 'Z5', studentAction: 'write-answer' });
    expect(lesson.slides[10]).toMatchObject({ kind: 'task', code: 'Z6', studentAction: 'oral' });

    // Notatka tylko z wiedzy - bez tresci czytanki.
    expect(lesson.notebookNote).not.toMatch(/Bartek|Temperówk|Miłosz/);
    const questions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
    expect(questions).toHaveLength(5);
    expect(questions.some((q) => q.text.includes('Wrócić do domu'))).toBe(true);
  });

  it('podsumowanie rozdzialu I: film ze wszystkiego, kolo z nowymi pytaniami i notatka', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lesson = bundle.lessons.find((l) => l.title === '16. Co już wiesz? Co umiesz?')!;

    expect(lesson.slides.map((slide) => slide.kind)).toEqual(['topic', 'recap', 'video', 'recap', 'note']);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'podsumowanie4-dzial1-film1' });
    expect(filmikById('podsumowanie4-dzial1-film1')).toBeTruthy();
    expect(lesson.slides[3]).toMatchObject({ kind: 'recap', questionSetId: lesson.questionSetId, questionCount: 6 });
    expect(lesson.teacherPlan).toContain('klasa4-rozdzial1-powtorka.pdf');
    expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId)).toHaveLength(8);
  });

  it('rozdzial II: film bez powtornego kola, notatka, potem 2-3 karty Ćwiczymy razem', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const r2 = bundle.lessons.filter((l) => l.dzial === ROZDZIAL_2);
    expect(r2).toHaveLength(12);
    expect(r2[0].title.startsWith('18.')).toBe(true);
    const filmy = r2.map((l) => l.slides.find((s) => s.kind === 'video'));
    expect(filmy.every((s) => s?.kind === 'video' && Boolean(filmikById(s.videoId)))).toBe(true);
    for (const lesson of r2) {
      expect(lesson.slides[0]).toMatchObject({ kind: 'topic', variant: 'write' });
      expect(lesson.teacherPlan).toBeTruthy();
      const kinds = lesson.slides.map((s) => s.kind);
      const video = kinds.indexOf('video');
      // Po filmie nie powtarzamy od razu tego samego zestawu. Pytania tej
      // lekcji wroca w kole na poczatku nastepnej lekcji.
      expect(lesson.slides[video + 1]?.kind).not.toBe('recap');
      expect(lesson.slides.slice(video + 1).some((s) => s.kind === 'recap' && s.questionSetId === lesson.questionSetId)).toBe(false);
      const note = lesson.slides.find((s) => s.kind === 'note');
      expect(note?.kind === 'note' ? note.body : '').toMatch(/^\*\*Temat:\*\* /);
      // Po notatce tylko 2-3 karty "Ćwiczymy razem" - screenow zadan z
      // podrecznika juz tam nie dajemy (Bartek 2026-10-13).
      const poNotatce = lesson.slides.slice(kinds.indexOf('note') + 1);
      expect(poNotatce.length).toBeGreaterThanOrEqual(2);
      expect(poNotatce.length).toBeLessThanOrEqual(3);
      expect(poNotatce.every((s) => s.kind === 'cwiczenie' && Boolean(cwiczenieById(s.cwiczenieId)))).toBe(true);
      expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId).length).toBeGreaterThanOrEqual(5);
    }
    // Cztery czytanki na rozdzial: dwa teksty z planu + wiersz do porownania i Michalak do asertywnosci (Bartek, 2026-10-13).
    expect(r2.flatMap((l) => l.slides.filter((s) => s.kind === 'czytanka'))).toHaveLength(4);
  });

  it('lektura Chłopcy z Placu Broni: osobna zakladka, film, 2 karty i notatka na koniec', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lektura = bundle.lessons.filter((l) => l.dzial === LEKTURA_CHLOPCY);
    expect(lektura).toHaveLength(6);
    for (const [i, lesson] of lektura.entries()) {
      // Bez podrecznika - zadnego "Podręcznik s. 0" na liscie lekcji.
      expect(lesson.textbookPage).toBeUndefined();
      expect(lesson.teacherPlan).toBeTruthy();
      expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'video', 'cwiczenie', 'cwiczenie', 'note']);
      const video = lesson.slides[2];
      expect(video.kind === 'video' && video.videoId).toBe(`placu-broni-film${i + 1}`);
      expect(video.kind === 'video' && Boolean(filmikById(video.videoId))).toBe(true);
      // Kolo na start: 3 pytania z poprzedniej lekcji, nie z tej.
      expect(lesson.slides[1]).toMatchObject({ kind: 'recap', questionCount: 3 });
      expect(lesson.slides[1]).not.toMatchObject({ questionSetId: lesson.questionSetId });
      expect(lesson.slides.filter((s) => s.kind === 'cwiczenie').every((s) => s.kind === 'cwiczenie' && Boolean(cwiczenieById(s.cwiczenieId)))).toBe(true);
      // Notatka: 2 zdania z pojecia, nie streszczenie.
      const note = lesson.slides[5];
      expect(note.kind === 'note' ? note.body.split('\n').length : 0).toBe(3);
      expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('rozdzial III: kolo 3 pytan, film, 2-3 karty Ćwiczymy razem i notatka na koniec', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const r3 = bundle.lessons.filter((l) => l.dzial === ROZDZIAL_3);
    expect(r3).toHaveLength(10);
    expect(r3.map((l) => l.title.slice(0, 3))).toEqual(['30.', '31.', '32.', '33.', '34.', '35.', '36.', '37.', '38.', '39.']);
    for (const lesson of r3) {
      const kinds = lesson.slides.map((s) => s.kind);
      expect(kinds[0]).toBe('topic');
      // Kolo na start: 3 pytania z poprzedniej lekcji, nie z tej.
      expect(lesson.slides[1]).toMatchObject({ kind: 'recap', questionCount: 3 });
      expect(lesson.slides[1]).not.toMatchObject({ questionSetId: lesson.questionSetId });
      const video = lesson.slides.find((s) => s.kind === 'video');
      expect(video?.kind === 'video' && Boolean(filmikById(video.videoId))).toBe(true);
      // Po filmie 2-3 karty, a notatka zamyka lekcje.
      const poFilmie = lesson.slides.slice(kinds.indexOf('video') + 1);
      expect(poFilmie[poFilmie.length - 1].kind).toBe('note');
      const karty = poFilmie.slice(0, -1);
      expect(karty.length).toBeGreaterThanOrEqual(2);
      expect(karty.length).toBeLessThanOrEqual(3);
      expect(karty.every((s) => s.kind === 'cwiczenie' && Boolean(cwiczenieById(s.cwiczenieId)))).toBe(true);
      expect(lesson.teacherPlan).toBeTruthy();
      expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId).length).toBeGreaterThanOrEqual(6);
    }
    // Dwa teksty na rozdzial: Grabarczyk i Vestly.
    expect(r3.flatMap((l) => l.slides.filter((s) => s.kind === 'czytanka'))).toHaveLength(2);
  });

  it('nie pokazuje materialu klasy czwartej w innym roczniku', () => {
    expect(() => buildTextbook4('V', [])).toThrow();
  });
});
