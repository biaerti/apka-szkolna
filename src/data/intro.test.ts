// Lekcja zapoznawcza jest budowana z RULE_SECTIONS (zasady.ts) i z kodow podstawy
// programowej (podstawa.ts). Oba powiazania sa "po stringach", a Lessons.tsx lapie
// wyjatek z buildIntroLesson w try/catch - czyli literowka w tytule sekcji albo w
// kodzie podstawy nie wywalilaby aplikacji, tylko po cichu ukryla przycisk
// "Lekcja zapoznawcza". Te testy sa po to, zeby taka zmiana wysypala sie tutaj.

import { describe, expect, it } from 'vitest';
import { buildIntroLesson } from './intro';
import { curriculumByCode } from './podstawa';
import { RULE_SECTIONS } from './zasady';

describe('buildIntroLesson', () => {
  const CLASS_ID = 'class-1';

  it('buduje sie bez wyjatku - wszystkie sekcje zasad, do ktorych siega, istnieja', () => {
    expect(() => buildIntroLesson('IV', [CLASS_ID])).not.toThrow();
  });

  it('zwraca zestaw 20 pytan przypisany do wskazanych klas', () => {
    const { questionSet, questions } = buildIntroLesson('IV', [CLASS_ID]);
    expect(questionSet.classIds).toEqual([CLASS_ID]);
    expect(questions).toHaveLength(20);
    expect(questions.every((q) => q.setId === questionSet.id)).toBe(true);
  });

  it('lekcja nalezy do rocznika i nie ma jeszcze postepu w zadnej klasie', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.grade).toBe('IV');
    expect(lesson.progress).toEqual({});
  });

  it('slajdy recap wskazuja na zbudowany zestaw pytan', () => {
    const { lesson, questionSet } = buildIntroLesson('IV', [CLASS_ID]);
    const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
    // Dwa kola: pierwsze na pokazanie ("zobaczcie, to wasze imiona"), drugie na
    // wlasciwa runde zapoznawcza.
    expect(recapSlides).toHaveLength(2);
    for (const slide of recapSlides) {
      expect(slide.kind === 'recap' && slide.questionSetId).toBe(questionSet.id);
    }
  });

  it('konczy sie notatka do zeszytu, a potem slajdem pozegnalnym', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const kinds = lesson.slides.map((s) => s.kind);
    expect(kinds).toContain('note');
    expect(kinds.indexOf('note')).toBe(kinds.length - 2);
    expect(kinds[kinds.length - 1]).toBe('title');
  });

  it('uzywa wylacznie kodow podstawy programowej, ktore naprawde istnieja', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.curriculum && lesson.curriculum.length).toBeTruthy();
    for (const code of lesson.curriculum ?? []) {
      expect(curriculumByCode(code), `nieznany kod podstawy: ${code}`).toBeDefined();
    }
  });

  it('ma wypelniony temat pod dziennik Vulcan', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.registerTopic).toBeTruthy();
  });

  it('slajd topic ma krotki temat do zeszytu (krotszy niz temat do dziennika), bez stopera', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const topicSlide = lesson.slides.find((s) => s.kind === 'topic');
    expect(topicSlide && topicSlide.kind === 'topic' ? topicSlide.topic : undefined).toBeTruthy();
    if (topicSlide && topicSlide.kind === 'topic') {
      expect(topicSlide.topic!.length).toBeLessThanOrEqual(40);
      expect(topicSlide.topic!.length).toBeLessThan((lesson.registerTopic ?? '').length);
      // Slajd tematu nie ma juz pola stopera - odliczanie wlacza sie kolkiem na slajdzie.
      expect('timerSec' in topicSlide).toBe(false);
    }
  });

  it('ma slajd z ilustracja "procenty"', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const hasProcenty = lesson.slides.some((s) => 'art' in s && s.art === 'procenty');
    expect(hasProcenty).toBe(true);
  });

  function allText(lesson: ReturnType<typeof buildIntroLesson>['lesson']): string {
    return lesson.slides
      .map((s) => ('body' in s ? s.body : 'title' in s ? (s.title ?? '') : ''))
      .join(' \n ');
  }

  it('wspomina o 2 pasach, a nie o starym limicie 3 pasow', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const text = allText(lesson);
    expect(text).toContain('2 pasy');
  });

  it('nie zawiera juz usunietego watku odrabiania plomb / zadan naprawczych', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const text = allText(lesson).toLowerCase();
    expect(text).not.toContain('odrabia');
    expect(text).not.toContain('zadanie naprawcze');
    expect(text).not.toContain('decybelomierz');
  });

  it('wspomina, ze progi ocen obowiazuja w calej szkole (WZO)', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(allText(lesson)).toContain('WZO');
  });

  it('dla klasy VIII wspomina egzamin osmoklasisty, dla innych klas nie', () => {
    const { lesson: lesson8 } = buildIntroLesson('VIII', [CLASS_ID]);
    expect(allText(lesson8)).toContain('egzamin ósmoklasisty');

    const { lesson: lesson4 } = buildIntroLesson('IV', [CLASS_ID]);
    expect(allText(lesson4)).not.toContain('egzamin ósmoklasisty');
  });

  it('ma slajd o pasach i slajd z przykladem rundy', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const titles = lesson.slides.map((s) => ('title' in s ? s.title : undefined));
    expect(titles).toContain('Pasy');
    expect(titles).toContain('Przykład rundy');
  });

  it('rozroznia kolo na lekcji od kola powtorzeniowego', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const text = allText(lesson).toLowerCase();
    expect(text).toContain('koło na lekcji');
    expect(text).toContain('koło powtórzeniowe');
  });

  it('nie wspomina juz wycofanego "kola po lekcji" (dzieci odpowiadaly dwa razy na to samo)', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const text = allText(lesson).toLowerCase();
    expect(text).not.toContain('koło po lekcji');
    expect(text).not.toContain('kole po lekcji');
    expect(text).not.toContain('koła po lekcji');
  });

  it('przyklad rundy dotyczy kola powtorzeniowego i zaznacza, ze na kole na lekcji mozna tylko zyskac', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const slide = lesson.slides.find((s) => 'title' in s && s.title === 'Przykład rundy');
    const body = slide && 'body' in slide ? slide.body : '';
    expect(body).toContain('powtórzeniowe');
    expect(body).toContain('kole na lekcji');
    expect(body).toContain('tylko zyskać');
    // Krotki przyklad kola na lekcji: zadanie zrobione dobrze -> plus, slabo/wcale -> kropka.
    expect(body).toContain('Z1');
    expect(body).not.toContain('kole po lekcji');
  });

  it('slajd "Dwa koła" nazywa kolo na lekcji i kolo powtorzeniowe, oba pogrubione', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const slide = lesson.slides.find((s) => 'title' in s && s.title === 'Dwa koła: na lekcji i powtórzeniowe');
    expect(slide).toBeDefined();
    const body = slide && 'body' in slide ? slide.body : '';
    expect(body).toContain('**Koło na lekcji**');
    expect(body).toContain('**Koło powtórzeniowe**');
    expect(body).toContain('**kole na lekcji**');
    expect(body).toContain('**kole powtórzeniowym**');
  });

  it('po przykladzie rundy tlumaczy przebieg lekcji, a potem rozroznia dwa kola', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const titles = lesson.slides.map((s) => ('title' in s ? s.title : undefined));
    const przyklad = titles.indexOf('Przykład rundy');
    const przebieg = titles.indexOf('Jak wygląda nasza lekcja');
    const dwaKola = titles.findIndex((t) => t?.startsWith('Dwa koła'));
    expect(przyklad).toBeGreaterThan(-1);
    expect(przebieg).toBe(przyklad + 1);
    expect(dwaKola).toBe(przebieg + 1);
  });

  it('slajd o przebiegu lekcji jest dwa razy i ma pogrubione nazwy obu kol', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const przebieg = lesson.slides.filter((s) => 'title' in s && s.title === 'Jak wygląda nasza lekcja');
    expect(przebieg).toHaveLength(2);
    for (const slide of przebieg) {
      const body = 'body' in slide ? slide.body : '';
      expect(body).toContain('**Koło powtórzeniowe**');
      // W kroku 2 kolo na lekcji stoi w srodku zdania, wiec malymi literami.
      expect(body).toContain('**koło na lekcji**');
      expect(body).not.toContain('po lekcji');
    }
  });

  it('rozdzial o zachowaniu: najpierw utrudnienia, potem definicja przeszkadzania, bez pytania o grzecznosc', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const titles = lesson.slides.map((s) => ('title' in s ? s.title : undefined));
    expect(titles).not.toContain('Czy zachowujecie się grzecznie na lekcjach?');
    expect(titles).not.toContain('Za to nigdy nie ma uwagi');
    expect(titles.indexOf('Co to znaczy przeszkadzać')).toBe(
      titles.indexOf('Specjalne utrudnienia za zachowanie') + 1,
    );
  });

  it('zdanie "to NIE jest przeszkadzanie" zostaje w lekcji mimo usunietego slajdu', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const slide = lesson.slides.find((s) => 'title' in s && s.title === 'Co to znaczy przeszkadzać');
    expect(slide && 'body' in slide ? slide.body : '').toContain('NIE jest przeszkadzanie');
  });

  it('konczy rozdzial o zasadach kolejnoscia: przebieg - gdzie siedzimy - wasz glos', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const titles = lesson.slides.map((s) => ('title' in s ? s.title : undefined));
    const gdzie = titles.indexOf('Gdzie siedzimy');
    expect(titles.lastIndexOf('Jak wygląda nasza lekcja')).toBe(gdzie - 1);
    expect(titles.indexOf('Wasz głos')).toBe(gdzie + 1);
  });

  it('wspomina o rozliczeniu plusow/plomb na koniec miesiaca', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(allText(lesson)).toContain('koniec miesiąca');
  });

  it('nie zawiera juz usunietej odpowiedzialnosci zbiorowej za dodatkowe miejsca w kole', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const text = allText(lesson).toLowerCase();
    expect(text).not.toContain('dla całej klasy');
  });

  it('eskalacja ma tylko dwa stopnie: ostrzezenie, a od drugiego razu brak plusow do konca miesiaca', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const slide = lesson.slides.find((s) => 'title' in s && s.title === 'Specjalne utrudnienia za zachowanie');
    const body = (slide && 'body' in slide ? slide.body : '') ?? '';
    expect(body).toContain('Pierwszy raz');
    expect(body).toContain('Drugi raz:');
    expect(body).toContain('nie możesz już dostać plusa');
    // Dawne "drugi raz i kazdy kolejny" rozbite na dwa punkty - kolejne uwagi
    // ida juz do dziennika, a nie mnoza kar w grze.
    expect(body.toLowerCase()).not.toContain('każdy kolejny');
    expect(body).toContain('dziennika');
    expect(body.toLowerCase()).not.toContain('trzeci raz');
    expect(body.toLowerCase()).not.toContain('dodatkowe miejsce');
    expect(body.toLowerCase()).not.toContain('podwójne wejście');
  });

});

describe('RULE_SECTIONS', () => {
  it('nie ma pustych sekcji ani pustych punktow', () => {
    expect(RULE_SECTIONS.length).toBeGreaterThan(0);
    for (const section of RULE_SECTIONS) {
      expect(section.title.trim()).not.toBe('');
      expect(section.items.length).toBeGreaterThan(0);
      for (const item of section.items) {
        expect(item.trim()).not.toBe('');
      }
    }
  });

  it('nie zawiera slowa "minus" - w zasadach obowiazuje "plomba"', () => {
    const all = RULE_SECTIONS.map((s) => `${s.title} ${s.items.join(' ')}`)
      .join(' ')
      .toLowerCase();
    expect(all).not.toContain('minus');
  });

  it('sekcja "Zeszyt i sprawdziany" istnieje i jest ostatnia w tablicy', () => {
    expect(RULE_SECTIONS[RULE_SECTIONS.length - 1].title).toBe('Zeszyt i sprawdziany');
  });

  it('progi procentowe ocen (0-30, 31-50, 51-72, 73-85, 86-96, 97-100) wystepuja w tresci zasad', () => {
    const all = RULE_SECTIONS.map((s) => s.items.join(' ')).join(' ');
    for (const range of ['0-30%', '31-50%', '51-72%', '73-85%', '86-96%', '97-100%']) {
      expect(all, `brak progu ${range} w tresci zasad`).toContain(range);
    }
  });

  it('kolo powtorzeniowe ma tyle pytan, ile bylo zadan (zwykle 3-5), a nie stary limit "10 pytan"', () => {
    const all = RULE_SECTIONS.map((s) => s.items.join(' ')).join(' ');
    expect(all).toContain('tyle pytań, ile było zadań');
    expect(all).toContain('od 3 do 5');
    expect(all.toLowerCase()).not.toContain('10 pytań');
  });

  it('dwa kola: na lekcji (po kazdym zadaniu, tylko plus/kropka) i powtorzeniowe; bez wycofanego "kola po lekcji"', () => {
    const section = RULE_SECTIONS.find((s) => s.title === 'Gramy w koło fortuny');
    expect(section).toBeDefined();
    const items = section?.items ?? [];
    // intro.ts siega po indeksach 1, 2 i 3 - pilnujemy, ze nic sie nie przesunelo.
    expect(items[1]).toContain('losuje koło');
    expect(items[2]).toMatch(/^Koło na lekcji/);
    expect(items[2]).toContain('Plomby na kole na lekcji nie ma');
    expect(items[3]).toMatch(/^Koło powtórzeniowe/);
    expect(items[3]).toContain('innymi niż zadania z lekcji');
    const all = RULE_SECTIONS.map((s) => s.items.join(' ')).join(' ').toLowerCase();
    expect(all).not.toContain('po lekcji');
  });

  it('eskalacja za zachowanie ma tylko dwa stopnie, bez dawnych "dodatkowych miejsc w kole"', () => {
    const section = RULE_SECTIONS.find((s) => s.title === 'Specjalne utrudnienia za zachowanie');
    expect(section).toBeDefined();
    const text = (section?.items ?? []).join(' ').toLowerCase();
    expect(text).not.toContain('trzeci raz');
    expect(text).not.toContain('dodatkowe miejsce');
    expect(text).not.toContain('podwójne wejście');
    expect(text).toContain('do końca miesiąca nie możesz już dostać plusa');
    expect(text).not.toContain('każdy kolejny');
  });

  it('zeszyt: trzy rzeczy do zapisania, kod lekcji bez legendy i kodu w rogu strony', () => {
    const section = RULE_SECTIONS.find((s) => s.title === 'Zeszyt i sprawdziany');
    expect(section).toBeDefined();
    const text = (section?.items ?? []).join(' ');
    expect(text).toContain('temat lekcji');
    expect(text).toContain('nazwę zadania i rozwiązanie');
    expect(text).toContain('notatkę ze slajdu');
    expect(text).toContain('4 - klasa czwarta, 1 - pierwsza lekcja');
    expect(text.toLowerCase()).not.toContain('legenda');
    expect(text.toLowerCase()).not.toContain('spis tematów');
    expect(text.toLowerCase()).not.toContain('w rogu');
  });
});
