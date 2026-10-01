// Klasa 4, rozdzial II "Pośród słów i znaczeń" (GWO "Między nami 4", s. 55-92).
// Mapa stron i uzasadnienie wyboru: docs/klasa4-rozdzial2-posrod-slow.md.
//
// Zasady Bartka (2026-10-01): dwa teksty na rozdzial (Olech "Dynastia
// Miziołków", Rusinek i Załazińska "Kurs fotografii"), reszta to jezyk i
// pisanie. Dzien Pisania Listow (temat 5) wyciety w calosci. Do kazdej lekcji
// filmik, po nim kolo z nowymi pytaniami, notatka i zadania z podrecznika po
// kolei jako zapas. Jedno zadanie = jeden screen = jeden slajd.
//
// Screeny leza w prywatnym buckecie "czytanki" jako r2-sNN-*.webp. Wyciete
// skryptem tmp/gwo/wytnij.py z JPG stron multibooka GWO wedlug ramek zadan,
// ktore podaje sam multibook (API action-triggers).

import type { Slide, StudentAction } from './types';
import { plan, recap, slideCzytanka, slideNote, slideRecap, slideTextbookImage, slideTextbookTask, slideTopic, slideVideo, type Topic } from './textbook5slides';

export const ROZDZIAL_2 = 'Rozdział II. Pośród słów i znaczeń';

type Akcja = 'zeszyt' | 'ustnie' | 'dom' | 'cwiczymy' | 'ksiazka';
const AKCJE: Record<Akcja, [StudentAction, string]> = {
  zeszyt: ['write-answer', 'Do zeszytu'],
  ustnie: ['oral', 'Ustnie'],
  dom: ['write-answer', 'Do domu'],
  cwiczymy: ['oral', 'Ćwiczymy razem'],
  ksiazka: ['textbook', 'W podręczniku'],
};

/** Screen jednego zadania z podrecznika: "Zadanie N", kod "s. 58 zad. 3" (dziala kolo K). */
function zad(plik: string, page: number, nr: string, akcja: Akcja): Slide {
  const [action, text] = AKCJE[akcja];
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} zad. ${nr}`, `Zadanie ${nr}`, action, text);
}
/** "Zacznijmy od..." z podrecznika - na start lekcji, tez z kodem pod kolo. */
function zacznij(plik: string, page: number): Slide {
  const [action, text] = AKCJE.ustnie;
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} zacznijmy`, 'Zacznijmy od...', action, text);
}
/** "Podsumujmy..." z podrecznika - zabawa w kole na koniec, jesli starczy czasu. */
function podsumujmy(plik: string, page: number): Slide {
  const [action, text] = AKCJE.cwiczymy;
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} podsumujmy`, 'Podsumujmy', action, text);
}
/** Ramka teorii z podrecznika - tylko do obejrzenia i przeczytania. */
function ramka(plik: string, page: number, title: string): Slide {
  return slideTextbookImage(`czytanki:${plik}.webp`, page, title);
}

/**
 * Zadania z podrecznika w kolejnosci z ksiazki: strona, potem numer zadania
 * ("Podsumujmy" na koncu strony). Ramka bez numeru zostaje tam, gdzie stoi
 * na liscie - za zadaniem, ktore ja poprzedza.
 */
function poKolei(...slides: Slide[]): Slide[] {
  let poprzedni: [number, number] = [0, 0];
  const klucze = slides.map((s): [number, number] => {
    if (s.kind !== 'image') return poprzedni;
    const code = s.code ?? '';
    const nr = /zad\. (\d+)/.exec(code);
    const page = s.page ?? 0;
    const k: [number, number] = nr ? [page, Number(nr[1])] : code.includes('podsumujmy') ? [page, 99] : [page, page === poprzedni[0] ? poprzedni[1] + 0.5 : 0];
    poprzedni = k;
    return k;
  });
  return slides
    .map((s, i) => ({ s, k: klucze[i] }))
    .sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1])
    .map(({ s }) => s);
}

/** Film, a zaraz po nim kolo z wlasnymi pytaniami lekcji (5 losowan). */
function filmIKolo(videoId: string, ownSetId?: string): Slide[] {
  const kolo: Slide[] = ownSetId ? [{ ...(slideRecap(ownSetId) as Extract<Slide, { kind: 'recap' }>), questionCount: 5 }] : [];
  return [slideVideo(videoId), ...kolo];
}

export const ROZDZIAL2_TOPICS: Topic[] = [
  {
    title: '18. Wyrazy potoczne - kiedy wolno, a kiedy nie?',
    dzial: ROZDZIAL_2,
    topic: 'Wyrazy potoczne',
    textbookPage: 56,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji z tekstem w tym rozdziale. Krótki fragment „Dynastii Miziołków” Joanny Olech (s. 56-57, ok. 1,5 min z lektorem) - pamiętnik chłopca pełen słów „na luzie” (starzy, forsa, kasa). Z tego wychodzimy do wyrazów potocznych i do budowy hasła w słowniku.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, czym są wyrazy potoczne,',
        '- rozróżnia sytuację oficjalną i nieoficjalną,',
        '- zamienia wyraz potoczny na oficjalny odpowiednik,',
        '- wie, jak zbudowane jest hasło w słowniku (skrót pot.), układa wyrazy alfabetycznie.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - pytania z poprzedniej lekcji.',
        '2. **Zacznijmy od... s. 56** (3 min) - pięć słów do kolegów, ale nie do dorosłych (z kulturą!).',
        '3. **Czytanka „Dynastia Miziołków”** (2 min) + **s. 57 zad. 1** ustnie (P/F, 2 min).',
        '4. **Ramka s. 57** (1 min).',
        '5. **Film „Wyrazy potoczne”** (8 min) - Kuba na boisku, poważni bracia słów, słowa jak ubrania, hasło w słowniku. 4 zadania do zeszytu, każde sprawdzone.',
        '6. **Koło z nowymi pytaniami** (5 min).',
        '7. **Notatka** (4 min).',
        '8. Zadania z podręcznika po kolei, na ile starczy czasu: **s. 58 zad. 2** (wyrazy potoczne u Olech), **zad. 3** do zeszytu, **zad. 4**.',
        '9. Zapas: ramka „Budowa hasła słownikowego” s. 58, **zad. 5** - słowniczek w grupach (może być do domu).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Wyrazy potoczne nie są brzydkie ani wulgarne - są swobodne, na luzie.',
        '- Słowa dobieramy jak ubranie: dres na boisko, elegancko na akademię. W wypracowaniu - zakaz.',
        '- Każdy potoczny ma „poważnego brata”: kasa - pieniądze, wcinać - jeść, kimać - spać.',
        '- W słowniku przy takim wyrazie stoi skrót **pot.**',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 57 zad. 1** P (Klakson chciał zwierzątko), P (rodzice niby się zgodzili, ale postawili warunki nie do spełnienia), F (kupili zaskrońca, bo nie starczyło pieniędzy na kobrę i pytona), F (przenieśli go w dużym pudle po telewizorze), F (Napoleon to wąż).',
        '- **s. 58 zad. 2** a) starzy, forsa, kasa (też: byle co, sztuka - o wężu). b) To pamiętnik chłopca - pisze tak, jak mówi do kolegów, swobodnie i zabawnie.',
        '- **s. 58 zad. 3** np. bardzo przyjemnie / wspaniale; nie mów takich bzdur / nieprawdy; muszę iść; bardzo dobra / ciekawa; mam dużo pracy; jestem zmęczony; bardzo duży.',
        '- **s. 58 zad. 4** totalną masakrą - bardzo trudny / zupełną porażką; megatrudnych - bardzo trudnych; strasznie mało - bardzo mało; koszmar - coś bardzo nieprzyjemnego.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Wyraz potoczny czy oficjalny: „ziomal”?', answer: 'Potoczny. Oficjalnie: kolega, przyjaciel.' },
      { text: 'Zamień na oficjalne: „Ale się wkurzyłem!”', answer: 'Bardzo się zdenerwowałem.' },
      { text: 'Czy w wypracowaniu można napisać „Bohater był spoko”?', answer: 'Nie. Lepiej: bohater był miły, sympatyczny.' },
      { text: 'Do kogo pasuje „Cześć, idziesz na rower?” - do kolegi czy do pani dyrektor?', answer: 'Do kolegi - to swobodna rozmowa.' },
      { text: 'Co oznacza w słowniku skrót „pot.” przy wyrazie?', answer: 'Że to wyraz potoczny, do swobodnych rozmów, nie do wypracowań.' },
      { text: 'Ułóż alfabetycznie: spoko, fura, kumpel.', answer: 'fura, kumpel, spoko.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Wyrazy potoczne'),
      ...recap(previousSetId),
      zacznij('r2-s56-zacznij', 56),
      slideCzytanka('dynastia-miziolkow'),
      zad('r2-s57-zad1', 57, '1', 'ustnie'),
      ramka('r2-s57-ramka', 57, 'Wyrazy potoczne'),
      ...filmIKolo('potoczne-film1', ownSetId),
      slideNote('Wyrazy potoczne', '1. **Wyrazy potoczne** to słowa swobodne, „na luzie”, np. kasa, kumpel, spoko.\n2. Używamy ich w rozmowie z kolegami i rodziną. **Nie używamy** w rozmowie z nauczycielem, z obcym dorosłym ani w wypracowaniu.\n3. Każdy ma oficjalny odpowiednik: kasa - pieniądze, wcinać - jeść.\n4. W słowniku słowa stoją **alfabetycznie**, a przy wyrazie potocznym jest skrót **pot.**'),
      ...poKolei(
        zad('r2-s58-zad2', 58, '2', 'ustnie'),
        zad('r2-s58-zad3', 58, '3', 'zeszyt'),
        zad('r2-s58-zad4', 58, '4', 'zeszyt'),
        ramka('r2-s58-haslo', 58, 'Budowa hasła słownikowego'),
        zad('r2-s58-zad5', 58, '5', 'cwiczymy'),
      ),
    ],
  },
  {
    title: '19. Słowa są jak... porównanie',
    dzial: ROZDZIAL_2,
    topic: 'Porównanie',
    textbookPage: 59,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja językowa bez tekstu. Wiersz Zofii Beszczyńskiej (s. 59) pomijamy - porównania ćwiczymy na własnych przykładach z filmu i na zadaniach 2-4, 7-8. Zadania 1, 5, 6 dotyczą wiersza, więc odpadają.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje porównanie po słówkach jak, jakby, niczym, niby,',
        '- wie, że samo „jak” w pytaniu to jeszcze nie porównanie,',
        '- zna kilka utartych porównań ze zwierzętami,',
        '- tworzy własne porównanie i ulepsza nim opis.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - wyrazy potoczne.',
        '2. **Ramka s. 60** (2 min) - czytacie razem.',
        '3. **Film „Porównanie”** (7 min) - gepard, słówka porównania, pułapka z „jak”, znane porównania, opis kota, 3 kroki do własnego porównania. 4 zadania.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (4 min).',
        '6. Zadania z podręcznika po kolei: **s. 60 zad. 2** do zeszytu, **zad. 3** ustnie, **zad. 4** ustnie, **s. 61 zad. 7** do zeszytu.',
        '7. Zapas: **s. 61 zad. 8** (porównanie + „ponieważ”), **Podsumujmy** - „Nasza klasa jest jak...” w kole.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Porównanie zestawia dwie rzeczy i pokazuje, w czym są podobne: szybki jak gepard.',
        '- Trzy części: to, co opisujemy + słówko (jak, jakby, niczym, niby) + to, do czego porównujemy.',
        '- „Jak się masz?” ma „jak”, ale niczego nie porównuje.',
        '- Własne porównanie w 3 krokach: wybierz cechę, pomyśl, co ma ją najbardziej, połącz słówkiem.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 60 zad. 2** odważny jak lew, wolny jak ptak, mądry jak sowa, uparty jak osioł, pracowity jak mrówka (pszczoła), łagodny jak baranek.',
        '- **s. 60 zad. 3** np. głodny jak wilk, dumny jak paw, cichy jak mysz, chytry jak lis, wierny jak pies, zdrowy jak ryba.',
        '- **s. 60 zad. 4** porównania: „szybki jak błyskawica”, „szumiało niczym wodospad”, „błyszczały niby gwiazdy”.',
        '- **s. 61 zad. 7 i 8** odpowiedzi własne - sprawdzamy, czy jest słówko i czy rzecz naprawdę ma tę cechę.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Czy to porównanie: „Jak dojść na dworzec?”', answer: 'Nie. To pytanie - niczego z niczym nie porównujemy.' },
      { text: 'Wskaż słówko porównania: „Wiatr wył niczym wilk”.', answer: 'niczym' },
      { text: 'Dokończ: „biały jak...”', answer: 'np. śnieg, mleko, kreda.' },
      { text: 'Dokończ: „cicho jak...”', answer: 'np. w kościele, jak myszka, jak w bibliotece.' },
      { text: 'Ulepsz zdanie porównaniem: „Zupa była gorąca”.', answer: 'np. Zupa była gorąca jak wulkan.' },
      { text: 'Z jakich trzech części składa się porównanie?', answer: 'To, co opisujemy + słówko (jak, jakby, niczym, niby) + to, do czego porównujemy.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Porównanie'),
      ...recap(previousSetId),
      ramka('r2-s60-ramka', 60, 'Porównanie'),
      ...filmIKolo('porownanie-film1', ownSetId),
      slideNote('Porównanie', '1. **Porównanie** zestawia dwie rzeczy i pokazuje, w czym są podobne.\n2. Słówka porównania: **jak, jakby, niczym, niby**.\n3. Przykład: Mój brat biega szybko **jak** gepard.\n4. Porównania sprawiają, że opis jest ciekawszy i łatwiej go sobie wyobrazić.'),
      ...poKolei(
        zad('r2-s60-zad2', 60, '2', 'zeszyt'),
        zad('r2-s60-zad3', 60, '3', 'ustnie'),
        zad('r2-s60-zad4', 60, '4', 'ustnie'),
        zad('r2-s61-zad7', 61, '7', 'zeszyt'),
        zad('r2-s61-zad8', 61, '8', 'zeszyt'),
        podsumujmy('r2-s61-podsumujmy', 61),
      ),
    ],
  },
  {
    title: '20. Tak samo czy zupełnie inaczej? Synonimy i antonimy',
    dzial: ROZDZIAL_2,
    topic: 'Synonimy i antonimy',
    textbookPage: 62,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja językowa bez tekstu. Synonimy (wyrazy bliskoznaczne) i antonimy (przeciwieństwa). Podręcznik ma dużo dobrych zadań - zapas spokojnie na całą lekcję.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, co to synonim i antonim,',
        '- dobiera synonimy, żeby uniknąć powtórzeń,',
        '- podaje antonimy przymiotników i czasowników,',
        '- wie, że nie każdy wyraz ma antonim.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - porównanie.',
        '2. **Ramka synonimy s. 62** (1 min).',
        '3. **Film „Synonimy i antonimy”** (8 min). 4 zadania.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (4 min).',
        '6. Zadania z podręcznika po kolei: **s. 62 zad. 1, 2** ustnie, **zad. 3** do zeszytu, **s. 63 zad. 4** do zeszytu, **zad. 5** (tekst o babci z „super”) do zeszytu.',
        '7. Zapas: **s. 63 zad. 6, 7**, **s. 64 zad. 8, 9, 10**, ramka antonimy s. 64, **Podsumujmy** - gra w antonimy w kole.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 62 zad. 1** np. ziemniak - kartofel; laptop - komputer, notebook; wieżowiec - drapacz chmur, budynek.',
        '- **s. 62 zad. 2** pasja, zainteresowanie, upodobanie, zamiłowanie.',
        '- **s. 62 zad. 3** głośny - hałaśliwy, donośny, gromki; miły - sympatyczny, uprzejmy, życzliwy; mówić - opowiadać, rozmawiać, wypowiadać się; jeść - spożywać, zajadać, posilać się.',
        '- **s. 63 zad. 4** szczęśliwy - radosny/zadowolony; ciekawą - interesującą; pyszny - smaczny; wędrowałem - chodziłem/maszerowałem.',
        '- **s. 63 zad. 5** „super” zamieniamy np. na: świetnie, wyjątkowy prezent, bardzo kolorowe, cudownie, wspaniała, przepyszne, przyjemnie.',
        '- **s. 63 zad. 6** siema - cześć, hej; kumać - rozumieć; czadowo - świetnie, wspaniale; lecieć - spieszyć się, iść, biec.',
        '- **s. 64 zad. 8** „fajny” pasuje w rozmowie czwartoklasistów i grupy uczniów; nauczycielowi: „ciekawa, interesująca”; w wypracowaniu: „było wspaniale / przyjemnie”.',
        '- **s. 64 zad. 9** np. pełny - pusty, gorący - zimny, twardy - miękki (mały - duży), wysoki - niski.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Podaj synonim słowa „smutny”.', answer: 'np. przygnębiony, markotny, zmartwiony.' },
      { text: 'Podaj antonim słowa „otwarty”.', answer: 'zamknięty' },
      { text: 'Synonimy czy antonimy: „szybki - prędki”?', answer: 'Synonimy - znaczą prawie to samo.' },
      { text: 'Synonimy czy antonimy: „wejście - wyjście”?', answer: 'Antonimy - znaczą coś przeciwnego.' },
      { text: 'Po co nam synonimy w wypracowaniu?', answer: 'Żeby unikać powtórzeń i wzbogacić tekst.' },
      { text: 'Podaj antonim do „krzesło”. Da się?', answer: 'Nie da się - nie każdy wyraz ma antonim.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Synonimy i antonimy'),
      ...recap(previousSetId),
      ramka('r2-s62-ramka', 62, 'Synonimy'),
      ...filmIKolo('synonimy-film1', ownSetId),
      slideNote('Synonimy i antonimy', '1. **Synonimy** to wyrazy o podobnym znaczeniu (bliskoznaczne): wesoły - radosny, iść - maszerować.\n2. Synonimy pomagają **unikać powtórzeń**.\n3. **Antonimy** to wyrazy o przeciwnym znaczeniu: zimny - gorący, wejść - wyjść.\n4. Nie każdy wyraz ma antonim, np. dom, niebieski.'),
      ...poKolei(
        zad('r2-s62-zad1', 62, '1', 'ustnie'),
        zad('r2-s62-zad2', 62, '2', 'ustnie'),
        zad('r2-s62-zad3', 62, '3', 'zeszyt'),
        zad('r2-s63-zad4', 63, '4', 'zeszyt'),
        zad('r2-s63-zad5', 63, '5', 'zeszyt'),
        zad('r2-s63-zad6', 63, '6', 'ustnie'),
        zad('r2-s63-zad7', 63, '7', 'ustnie'),
        ramka('r2-s64-ramka', 64, 'Antonimy'),
        zad('r2-s64-zad8', 64, '8', 'ustnie'),
        zad('r2-s64-zad9', 64, '9', 'ustnie'),
        zad('r2-s64-zad10', 64, '10', 'zeszyt'),
        podsumujmy('r2-s64-podsumujmy', 64),
      ),
    ],
  },
  {
    title: '21. Jak się pisze list?',
    dzial: ROZDZIAL_2,
    topic: 'Budowa listu',
    textbookPage: 65,
    teacherPlan: plan(
      ['Co dziś', 'Budowa listu (jest w podstawie). List C.S. Lewisa (s. 66-67) i Dzień Pisania Listów (s. 68-70, z kapsułą czasu i kopertą) pomijamy. Części listu ćwiczymy na wzorze od autorek (s. 65) i na liście do babci (s. 69 zad. 1).'],
      ['Po lekcji uczeń', [
        '- wymienia części listu po kolei,',
        '- zapisuje poprawnie nagłówek (z wykrzyknikiem albo przecinkiem),',
        '- pisze Ty, Ciebie, Twój wielką literą,',
        '- dzieli tekst na akapity.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - synonimy i antonimy.',
        '2. **Wzór listu s. 65** (3 min) - pokazujemy części.',
        '3. **Film „Budowa listu”** (8 min). 4 zadania.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (4 min).',
        '6. **s. 69 zad. 1** - dopasuj części listu do babci (5 min).',
        '7. Zapas: ramki s. 66 (układ, akapit) i s. 67 (Ty wielką literą), **s. 68 zad. 5** - wspólny list klasy (może być na kolejną lekcję albo dla chętnych).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 69 zad. 1** 1 - E (Warszawa, 26 września), 2 - B (Kochana Babciu!), 3 - F, 4 - G, 5 - C, 6 - H, 7 - D (Mateusz), 8 - A (PS).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co piszemy w prawym górnym rogu listu?', answer: 'Miejscowość i datę.' },
      { text: 'Nagłówek „Droga Olu,” kończy się przecinkiem. Jaką literą zaczniesz wstęp?', answer: 'Małą.' },
      { text: 'Jak zapiszesz w liście: (ty), (twój), (ciebie)?', answer: 'Ty, Twój, Ciebie - wielką literą, z szacunku.' },
      { text: 'Co oznacza PS na końcu listu?', answer: 'Postscriptum - dopisek, gdy coś nam się jeszcze przypomniało.' },
      { text: 'Jak podpisujemy list?', answer: 'Ręcznie.' },
      { text: 'Co to jest akapit?', answer: 'Część tekstu o jednej myśli, zaczynana od wcięcia.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Jak się pisze list?'),
      ...recap(previousSetId),
      ramka('r2-s65-wzor', 65, 'Jak jest zbudowany list?'),
      ...filmIKolo('list-film1', ownSetId),
      slideNote('Jak się pisze list?', '1. Części listu: **miejscowość i data** (w prawym górnym rogu), **nagłówek** (zwrot do adresata), **wstęp, rozwinięcie, zakończenie**, **pozdrowienie**, **podpis** (ręcznie), czasem **PS**.\n2. Nagłówek z **!** - wstęp wielką literą. Nagłówek z **,** - wstęp małą literą.\n3. **Ty, Ciebie, Tobie, Twój** - wielką literą. **ja, mnie, mój** - małą.\n4. Jedna myśl = jeden **akapit** (zaczynamy od wcięcia).'),
      ...poKolei(
        ramka('r2-s66-uklad', 66, 'Układ listu i akapit'),
        ramka('r2-s67-ramka', 67, 'Ty, Ciebie, Twój - wielką literą'),
        zad('r2-s68-zad5', 68, '5', 'cwiczymy'),
        zad('r2-s69-zad1', 69, '1', 'ustnie'),
      ),
    ],
  },
  {
    title: '22. Rzeczownik - co nazywa, liczba i rodzaj',
    dzial: ROZDZIAL_2,
    topic: 'Rzeczownik',
    textbookPage: 71,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji o rzeczowniku (temat 6-7 w podręczniku). Dziś: co nazywa, na jakie pytania odpowiada, liczba i rodzaj. Przypadki na następnej lekcji.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje rzeczownik po pytaniach kto? co?,',
        '- wie, co nazywa rzeczownik (także pojęcia: przyjaźń, strach),',
        '- zmienia liczbę rzeczownika,',
        '- określa rodzaj (ten, ta, to; ci, te).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - list.',
        '2. **Zacznijmy od... s. 71** (2 min) - co pamiętasz o rzeczowniku?',
        '3. **Ramka s. 72** (1 min).',
        '4. **Film „Rzeczownik”** (8 min). 4 zadania.',
        '5. **Koło z nowymi pytaniami** (5 min).',
        '6. **Notatka** (4 min).',
        '7. Zadania z podręcznika po kolei: **s. 71 zad. 1, 2** ustnie, **s. 72 zad. 3** ustnie, **zad. 4** do zeszytu, **zad. 5** ustnie, **s. 73 zad. 6** do zeszytu.',
        '8. Zapas: ramki „liczba” i „rodzaj” s. 72.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 71 zad. 1** a) kobieta - kto?, reszta - co? b) rzeczy, osoby, rośliny, zjawiska, miejsca, pojęcia.',
        '- **s. 71 zad. 2** odpowiada na pytania kto? co?; nazywa rzeczy, osoby, rośliny, zjawiska, miejsca, pojęcia.',
        '- **s. 72 zad. 4** liczba pojedyncza: tablica, piórnik, plecak; liczba mnoga: kredki, ołówki, krzesła.',
        '- **s. 72 zad. 5** Nie da się - rzeczownik ma stały rodzaj (ta książka - żeński).',
        '- **s. 73 zad. 6** fotel - męski, okno - nijaki, drzwi - niemęskoosobowy (tylko liczba mnoga), chłopcy - męskoosobowy, kwiat - męski, sukienka - żeński.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Czy „radość” to rzeczownik? Dlaczego?', answer: 'Tak - odpowiada na pytanie co? i nazywa pojęcie (uczucie).' },
      { text: 'Na jakie pytania odpowiada rzeczownik?', answer: 'kto? co?' },
      { text: 'Zmień liczbę: „ołówek”.', answer: 'ołówki' },
      { text: 'Jaki rodzaj: „ten kubek, ta lampa, to krzesło”?', answer: 'męski, żeński, nijaki' },
      { text: 'Ci czy te: „nauczyciele”?', answer: 'ci nauczyciele - rodzaj męskoosobowy.' },
      { text: 'Co nazywa rzeczownik „burza”?', answer: 'Zjawisko.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Rzeczownik - co nazywa, liczba i rodzaj'),
      ...recap(previousSetId),
      zacznij('r2-s71-zacznij', 71),
      ramka('r2-s72-ramka', 72, 'Rzeczownik'),
      ...filmIKolo('rzeczownik4-film1', ownSetId),
      slideNote('Rzeczownik - co nazywa, liczba i rodzaj', '1. **Rzeczownik** odpowiada na pytania **kto? co?**\n2. Nazywa osoby, zwierzęta, rzeczy, rośliny, zjawiska, miejsca i pojęcia (np. przyjaźń).\n3. **Liczba**: pojedyncza (kot) i mnoga (koty).\n4. **Rodzaj**: ten - męski, ta - żeński, to - nijaki; w liczbie mnogiej: ci - męskoosobowy, te - niemęskoosobowy.'),
      ...poKolei(
        zad('r2-s71-zad1', 71, '1', 'ustnie'),
        zad('r2-s71-zad2', 71, '2', 'ustnie'),
        zad('r2-s72-zad3', 72, '3', 'ustnie'),
        zad('r2-s72-zad4', 72, '4', 'zeszyt'),
        ramka('r2-s72-liczba', 72, 'Liczba rzeczownika'),
        zad('r2-s72-zad5', 72, '5', 'ustnie'),
        ramka('r2-s72-rodzaj', 72, 'Rodzaj rzeczownika'),
        zad('r2-s73-zad6', 73, '6', 'zeszyt'),
      ),
    ],
  },
  {
    title: '23. Przypadki - drużyna siedmiu pomocników',
    dzial: ROZDZIAL_2,
    topic: 'Przypadki rzeczownika',
    textbookPage: 73,
    teacherPlan: plan(
      ['Co dziś', 'Druga lekcja o rzeczowniku: siedem przypadków w liczbie pojedynczej. Nazwy, pytania i kolejność trzeba umieć na pamięć - na kolejnej lekcji gramy w odmianę.'],
      ['Po lekcji uczeń', [
        '- wymienia przypadki po kolei z pytaniami,',
        '- odmienia rzeczownik w liczbie pojedynczej,',
        '- rozpoznaje przypadek w zdaniu, pytając od czasownika,',
        '- poprawnie tworzy wołacz (Kasiu!, Tomku!).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - rzeczownik.',
        '2. **s. 73 zad. 7** (3 min) - kot w zdaniach, od tego zaczyna podręcznik.',
        '3. **Ramka „Przypadki rzeczownika” s. 73** (2 min).',
        '4. **Film „Przypadki”** (8 min). 4 zadania.',
        '5. **Koło z nowymi pytaniami** (5 min).',
        '6. **Notatka** (5 min) - tabela przypadków do zeszytu.',
        '7. Zadania z podręcznika: **s. 74 zad. 8** (sposoby zapamiętania - wybierz jeden), **zad. 9** do zeszytu.',
        '8. Zapas: **s. 74 zad. 10** - opis ilustracji z krasnalami (do domu).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 73 zad. 7** kot, kota, kotu, kota, kotem, kocie, kocie.',
        '- Kolejność przypadków: mianownik, dopełniacz, celownik, biernik, narzędnik, miejscownik, wołacz.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Na jakie pytania odpowiada dopełniacz?', answer: 'kogo? czego? (nie ma)' },
      { text: 'Który przypadek odpowiada na pytania z kim? z czym?', answer: 'Narzędnik.' },
      { text: 'Wymień przypadki po kolei.', answer: 'mianownik, dopełniacz, celownik, biernik, narzędnik, miejscownik, wołacz' },
      { text: 'Odmień w celowniku: „pies” (komu? czemu? się przyglądam).', answer: 'psu' },
      { text: 'Zawołaj poprawnie: Zosia!', answer: 'Zosiu!' },
      { text: 'W jakim przypadku jest „o rowerze” w zdaniu „Marzę o rowerze”?', answer: 'W miejscowniku (o czym?).' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Przypadki rzeczownika'),
      ...recap(previousSetId),
      zad('r2-s73-zad7', 73, '7', 'ustnie'),
      ramka('r2-s73-przypadki', 73, 'Przypadki rzeczownika'),
      ...filmIKolo('przypadki-film1', ownSetId),
      slideNote('Przypadki rzeczownika', '1. **Mianownik** - kto? co? (jest)\n2. **Dopełniacz** - kogo? czego? (nie ma)\n3. **Celownik** - komu? czemu? (się przyglądam)\n4. **Biernik** - kogo? co? (widzę)\n5. **Narzędnik** - z kim? z czym? (idę)\n6. **Miejscownik** - o kim? o czym? (mówię)\n7. **Wołacz** - o! (wołam)'),
      ...poKolei(
        zad('r2-s74-zad8', 74, '8', 'cwiczymy'),
        zad('r2-s74-zad9', 74, '9', 'zeszyt'),
        zad('r2-s74-zad10', 74, '10', 'dom'),
      ),
    ],
  },
  {
    title: '24. Niesforne przypadki - liczba mnoga i gry',
    dzial: ROZDZIAL_2,
    topic: 'Odmiana rzeczownika przez przypadki',
    textbookPage: 84,
    teacherPlan: plan(
      ['Co dziś', 'Temat 10 z podręcznika (s. 84) przeniesiony zaraz po przypadkach, żeby odmiana się nie rozjechała. Film dokłada liczbę mnogą, a resztę lekcji gracie: odmiana w kole, zeszyty po okręgu, KRASNOLUDEK.'],
      ['Po lekcji uczeń', [
        '- odmienia rzeczownik przez przypadki w obu liczbach,',
        '- odróżnia mianownik od biernika pytaniem,',
        '- poprawia typowe błędy w odmianie.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - przypadki.',
        '2. **Zacznijmy od... s. 84** (2 min) - przypomnienie przypadków.',
        '3. **Film „Przypadki w liczbie mnogiej”** (8 min). 4 zadania.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (3 min).',
        '6. **s. 84 zad. 1** - odmiana w kole (10 min), **zad. 2** - zeszyty po okręgu.',
        '7. **s. 84 zad. 3** - KRASNOLUDEK do zeszytu albo do domu.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 84 zad. 3** np. las, kula, osa, sok, nos, rak, kura.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Odmień „dom” w dopełniaczu liczby mnogiej (nie ma...).', answer: 'domów' },
      { text: 'Narzędnik liczby mnogiej: „idę z (koleżanki)”.', answer: 'z koleżankami' },
      { text: 'Popraw: „Nie mam butach”.', answer: 'Nie mam butów.' },
      { text: 'Miejscownik liczby mnogiej: „mówię o (dzieci)”.', answer: 'o dzieciach' },
      { text: 'Mianownik czy biernik: „Widzę samochody”?', answer: 'Biernik - widzę kogo? co? samochody.' },
      { text: 'Celownik liczby mnogiej: „przyglądam się (ptaki)”.', answer: 'ptakom' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Odmiana rzeczownika przez przypadki'),
      ...recap(previousSetId),
      zacznij('r2-s84-zacznij', 84),
      ...filmIKolo('przypadki-mnoga-film1', ownSetId),
      slideNote('Odmiana rzeczownika przez przypadki', '1. Rzeczownik odmieniamy przez **przypadki** i **liczby**.\n2. Liczba mnoga: koty, kotów, kotom, koty, kotami, kotach, koty!\n3. Mianownik i biernik często wyglądają tak samo - rozróżniamy je **pytaniem**: kto? co? jest / kogo? co? widzę.'),
      ...poKolei(
        zad('r2-s84-zad1', 84, '1', 'cwiczymy'),
        zad('r2-s84-zad2', 84, '2', 'cwiczymy'),
        zad('r2-s84-zad3', 84, '3', 'zeszyt'),
      ),
    ],
  },
  {
    title: '25. Dlaczego warto wyrażać swoje zdanie? Opinia i argument',
    dzial: ROZDZIAL_2,
    topic: 'Opinia i argument',
    textbookPage: 75,
    teacherPlan: plan(
      ['Co dziś', 'Druga z dwóch lekcji z tekstem. „Kurs fotografii” Rusinka i Załazińskiej (s. 76-78, ok. 4,5 min z lektorem): Zosia zamiast płakać przygotowuje argumenty i rodzice się zgadzają. Z tego wychodzimy do opinii i argumentu.'],
      ['Po lekcji uczeń', [
        '- odróżnia fakt od opinii,',
        '- wyraża opinię zwrotami: moim zdaniem, uważam, że...,',
        '- uzasadnia opinię argumentem (ponieważ...),',
        '- wie, że „bo tak” to nie argument.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - odmiana rzeczownika.',
        '2. **Zacznijmy od... s. 75** (2 min) - pizza czy spaghetti?',
        '3. **Czytanka „Kurs fotografii”** (5 min) + **s. 78 zad. 3** ustnie (2 min).',
        '4. **Film „Opinia i argument”** (8 min). 4 zadania.',
        '5. **Koło z nowymi pytaniami** (5 min).',
        '6. **Notatka** (4 min).',
        '7. Zadania z podręcznika po kolei, na ile starczy: **s. 75 zad. 1**, **s. 79 zad. 5** ustnie, **zad. 6** do zeszytu.',
        '8. Zapas: ramki s. 75 (zwroty) i s. 79 (argument), **s. 76 zad. 2** w parach, **s. 78 zad. 4** (schemat zysk/strata), **s. 79 zad. 7** - debata w dwóch grupach.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 75 zad. 1** opinie: trampki wygodniejsze niż sandały, zima przyjemniejsza niż lato, matematyka najtrudniejsza, lody czekoladowe najsmaczniejsze. Fakty: temperatura ciała, imiona wielką literą, lód topi się w cieple.',
        '- **s. 78 zad. 3** Zosia zrezygnowała z płaczu i scen. Przygotowała argumenty: zrobi rodzinie piękne zdjęcia, kurs jest w sobotę (nic nie koliduje), nie jest drogi, odda kieszonkowe, babcia dołoży, trzeba podpisać zobowiązanie obecności, chodzi z Martą, rodzice Marty zawiozą, pani od plastyki mówi, że ma talent.',
        '- **s. 79 zad. 5** np. brak czasu, koszty, słomiany zapał (rzuca zajęcia po dwóch miesiącach), zmęczenie, nauka.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Fakt czy opinia: „Kraków leży nad Wisłą”?', answer: 'Fakt - można to sprawdzić.' },
      { text: 'Fakt czy opinia: „Kraków to najpiękniejsze miasto”?', answer: 'Opinia - czyjeś zdanie.' },
      { text: 'Podaj zwrot, którym zaczniesz swoją opinię.', answer: 'np. Moim zdaniem..., Uważam, że..., Sądzę, że...' },
      { text: 'Czy „bo tak” to argument?', answer: 'Nie. Argument to prawdziwy powód, który wyjaśnia zdanie.' },
      { text: 'Podaj argument: „Warto jeść warzywa, ponieważ...”', answer: 'np. mają witaminy i dzięki nim jesteśmy zdrowsi.' },
      { text: 'Jak Zosia przekonała rodziców do kursu?', answer: 'Argumentami, a nie płaczem: kurs w sobotę, odda kieszonkowe, pojedzie z Martą.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Opinia i argument'),
      ...recap(previousSetId),
      zacznij('r2-s75-zacznij', 75),
      slideCzytanka('kurs-fotografii'),
      zad('r2-s78-zad3', 78, '3', 'ustnie'),
      ...filmIKolo('opinia-film1', ownSetId),
      slideNote('Opinia i argument', '1. **Fakt** można sprawdzić. **Opinia** to moje zdanie.\n2. Zwroty: moim zdaniem, uważam, że, sądzę, że, według mnie.\n3. **Argument** to powód, który uzasadnia opinię: Warto czytać, **ponieważ** poznaję ciekawe historie.\n4. „Bo tak” i „bo nie” to **nie są** argumenty.'),
      ...poKolei(
        ramka('r2-s75-opinia', 75, 'Opinia - zwroty'),
        zad('r2-s75-zad1', 75, '1', 'ustnie'),
        zad('r2-s76-zad2', 76, '2', 'cwiczymy'),
        zad('r2-s78-zad4', 78, '4', 'zeszyt'),
        ramka('r2-s79-argument', 79, 'Argument'),
        zad('r2-s79-zad5', 79, '5', 'ustnie'),
        zad('r2-s79-zad6', 79, '6', 'zeszyt'),
        zad('r2-s79-zad7', 79, '7', 'cwiczymy'),
      ),
    ],
  },
  {
    title: '26. Sztuka odmawiania, czyli czym jest asertywność',
    dzial: ROZDZIAL_2,
    topic: 'Asertywność',
    textbookPage: 80,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja bez tekstu. Opowiadanie Michalaka „Pani z tramwaju” (s. 80-82) pomijamy - asertywność pokazuje film na scenkach z życia czwartoklasisty, a w klasie robicie własne scenki (s. 83 zad. 6). Zadania 2-3 dotyczą tekstu, więc odpadają.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, czym jest asertywność,',
        '- odróżnia reakcję uległą, agresywną i asertywną,',
        '- odmawia spokojnie i z szacunkiem („Nie, bo... Ale mogę...”),',
        '- wie, że w niebezpiecznej sytuacji mówi „nie” i idzie do zaufanego dorosłego.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - opinia i argument.',
        '2. **Zacznijmy od... s. 80** (2 min) - czy łatwo ci powiedzieć „nie”?',
        '3. **Film „Asertywność”** (8 min). 4 zadania, ostatnie na głos w parach.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Ramka s. 83 + notatka** (5 min).',
        '6. Zadania z podręcznika po kolei: **s. 80 zad. 1** (trzy reakcje na prośbę koleżanki), **s. 83 zad. 5** - jak odmówić (horror, muffinka, kino przed sprawdzianem).',
        '7. Zapas: **s. 83 zad. 4** (gdy ktoś namówił nas wbrew nam - tylko chętni), **zad. 6** - scenki w grupach.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 80 zad. 1** np. zgoda wbrew sobie (koleżanka zadowolona, ja zły na siebie), odmowa niegrzeczna (koleżanka obrażona), odmowa asertywna: „Nie zrobię za ciebie zadania, ale mogę ci wytłumaczyć, jak je zrobić” (obie strony szanowane).',
        '- **s. 83 zad. 5** np. „Dziękuję, nie oglądam horrorów, wolę komedię”; „Dziękuję, nie jem słodyczy, chętnie zjem owoc”; „Nie dziś, jutro mam sprawdzian. Chodźmy w sobotę”.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest asertywność?', answer: 'Umiejętność mówienia „nie” spokojnie i z szacunkiem, bez krzyku i bez ulegania.' },
      { text: 'Kolega krzyczy: „Spadaj, nie dam ci!”. Jaka to reakcja?', answer: 'Agresywna.' },
      { text: 'Robisz coś, czego nie chcesz, żeby kolega się nie obraził. Jaka to reakcja?', answer: 'Uległa.' },
      { text: 'Odmów asertywnie: kolega prosi, żebyś skłamał za niego przed panią.', answer: 'np. Nie skłamię, bo to nieuczciwe. Ale mogę pójść z tobą, jak będziesz mówić prawdę.' },
      { text: 'Obcy dorosły proponuje podwiezienie do domu. Co robisz?', answer: 'Mówię „nie”, nie wsiadam i idę do zaufanego dorosłego.' },
      { text: 'Dokończ wzór asertywnej odmowy: „Nie, bo..., ale...”.', answer: 'np. Nie, bo muszę się uczyć, ale możemy pograć jutro.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Asertywność'),
      ...recap(previousSetId),
      zacznij('r2-s80-zacznij', 80),
      ...filmIKolo('asertywnosc-film1', ownSetId),
      ramka('r2-s83-ramka', 83, 'Asertywność'),
      slideNote('Asertywność', '1. **Asertywność** to mówienie „nie” spokojnie i z szacunkiem.\n2. Trzy reakcje: **uległa** (robię, choć nie chcę), **agresywna** (krzyczę, obrażam), **asertywna** (spokojnie odmawiam i mówię dlaczego).\n3. Wzór: **Nie, bo... Ale mogę...**\n4. Gdy coś jest niebezpieczne: mówię „nie” i idę do zaufanego dorosłego.'),
      ...poKolei(
        zad('r2-s80-zad1', 80, '1', 'ustnie'),
        zad('r2-s83-zad4', 83, '4', 'ustnie'),
        zad('r2-s83-zad5', 83, '5', 'ustnie'),
        zad('r2-s83-zad6', 83, '6', 'cwiczymy'),
      ),
    ],
  },
  {
    title: '27. Wielka czy mała litera? Nazwy własne i pospolite',
    dzial: ROZDZIAL_2,
    topic: 'Pisownia rzeczowników wielką i małą literą',
    textbookPage: 85,
    teacherPlan: plan(
      ['Co dziś', 'Ortografia: nazwy własne wielką literą, nazwy pospolite małą. Zadanie 5 ze s. 86 (historia o Ryśku do ilustracji) pomijamy - ilustracja nie mieści się na jednym screenie z poleceniem.'],
      ['Po lekcji uczeń', [
        '- odróżnia nazwę własną od pospolitej,',
        '- pisze wielką literą imiona, nazwy zwierząt, miast, państw, rzek, gór, kontynentów, planet i świąt,',
        '- dobiera nazwę własną do pospolitej (rzeka - Wisła).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - asertywność.',
        '2. **Ramka s. 85** (2 min).',
        '3. **Film „Wielka czy mała litera?”** (8 min). 4 zadania.',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (4 min).',
        '6. Zadania z podręcznika po kolei: **s. 85 zad. 1** ustnie, **zad. 2** do zeszytu (tabela), **s. 86 zad. 3** - zagadki do tej samej tabeli.',
        '7. Zapas: **s. 86 zad. 4** - drużyny (rzeka - Wisła, Odra...), **zad. 6** - nazwy dla nowego miasta, superbohatera, planety.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 85 zad. 1** wielką literą, bo to nazwy własne: Wisła (rzeka), Boże Narodzenie (święto), Adaś (imię), Warszawa (miasto), Azor, Mruczek (imiona zwierząt), Mars (planeta), Beskidy (góry), Czechy (państwo), Europa (kontynent).',
        '- **s. 85 zad. 2** własne: Wenus, Paryż, Nil, Łukasz, Sudety, Rysy, Azja; pospolite: woda, koszulka, krzesło, truskawka.',
        '- **s. 86 zad. 3** róża, Tatry, gwiazdy, (Mikołaj) Kopernik, Zakopane, Bałtyk.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Wielką czy małą: (k/K)raków?', answer: 'Kraków - nazwa miasta.' },
      { text: 'Wielką czy małą: (m/M)iasto?', answer: 'miasto - nazwa pospolita.' },
      { text: 'Podaj nazwę własną do nazwy pospolitej „góry”.', answer: 'np. Tatry, Karpaty, Bieszczady.' },
      { text: 'Dlaczego „Burek” piszemy wielką literą?', answer: 'To imię konkretnego psa - nazwa własna.' },
      { text: 'Wielką czy małą: (w/W)ielkanoc?', answer: 'Wielkanoc - nazwa święta.' },
      { text: 'Ziemia czy ziemia: „Posadziłem kwiatek w (z/Z)iemi”?', answer: 'ziemi - chodzi o glebę, nie o planetę.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Pisownia rzeczowników wielką i małą literą'),
      ...recap(previousSetId),
      ramka('r2-s85-ramka', 85, 'Nazwy własne i pospolite'),
      ...filmIKolo('wielka-litera-film1', ownSetId),
      slideNote('Pisownia rzeczowników wielką i małą literą', '1. **Nazwy własne** - jedna konkretna osoba, zwierzę, miejsce: piszemy **wielką literą**.\n2. Wielką literą: imiona i nazwiska, imiona zwierząt, miasta, państwa, rzeki, góry, kontynenty, planety, święta.\n3. **Nazwy pospolite** - cała grupa (pies, rzeka, miasto): piszemy **małą literą**.\n4. Przykład: rzeka - Wisła, pies - Burek, planeta - Ziemia.'),
      ...poKolei(
        zad('r2-s85-zad1', 85, '1', 'ustnie'),
        zad('r2-s85-zad2', 85, '2', 'zeszyt'),
        zad('r2-s86-zad3', 86, '3', 'zeszyt'),
        zad('r2-s86-zad4', 86, '4', 'cwiczymy'),
        zad('r2-s86-zad6', 86, '6', 'cwiczymy'),
      ),
    ],
  },
  {
    title: '28. Pisownia „nie” z rzeczownikami',
    dzial: ROZDZIAL_2,
    topic: 'Pisownia nie z rzeczownikami',
    textbookPage: 87,
    teacherPlan: plan(
      ['Co dziś', 'Ortografia: „nie” z rzeczownikami piszemy łącznie. Przypominamy, że z czasownikami osobno (rozdział I) - i uczymy odróżniać jedno od drugiego pytaniem.'],
      ['Po lekcji uczeń', [
        '- pisze „nie” z rzeczownikami łącznie (niepokój, nieporządek),',
        '- odróżnia rzeczownik od czasownika pytaniem (kto? co? / co robi?),',
        '- tworzy rzeczowniki z „nie” i używa ich w zdaniach.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - wielka i mała litera.',
        '2. **s. 87 zad. 1** (2 min) - nieporozumienie.',
        '3. **Ramka s. 87** (1 min).',
        '4. **Film „Nie z rzeczownikami”** (8 min). 4 zadania.',
        '5. **Koło z nowymi pytaniami** (5 min).',
        '6. **Notatka** (3 min).',
        '7. Zadania z podręcznika po kolei: **s. 87 zad. 2** do zeszytu, **s. 88 zad. 4** - rebusy.',
        '8. Zapas: **s. 88 zad. 3** - idealna kraina w parach, **zad. 5** - Skwer Niezadowolenia.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 87 zad. 1** nieporozumienie - łącznie (niesłusznie to nie rzeczownik, „nie zrobiłem” - czasownik, osobno).',
        '- **s. 87 zad. 2** niemoc, nieporządek, niewdzięczność, niewiedza.',
        '- **s. 88 zad. 4** niepamięć, niepogoda, nieprzyjaciel.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Razem czy osobno: (nie)szczęście?', answer: 'nieszczęście - razem, to rzeczownik.' },
      { text: 'Razem czy osobno: (nie)rozumiem?', answer: 'nie rozumiem - osobno, to czasownik.' },
      { text: 'Dodaj „nie” do rzeczownika „uwaga”.', answer: 'nieuwaga' },
      { text: 'Jak sprawdzisz, czy wyraz to rzeczownik?', answer: 'Zadaję pytanie kto? co? - jeśli pasuje, to rzeczownik.' },
      { text: 'Popraw błąd: „Na boisku był straszny nie porządek”.', answer: 'nieporządek - razem.' },
      { text: 'Ułóż zdanie z rzeczownikiem „niepogoda”.', answer: 'np. Przez niepogodę wycieczka się nie odbyła.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Pisownia nie z rzeczownikami'),
      ...recap(previousSetId),
      zad('r2-s87-zad1', 87, '1', 'ustnie'),
      ramka('r2-s87-ramka', 87, 'Nie z rzeczownikami'),
      ...filmIKolo('nie-rzeczownik-film1', ownSetId),
      slideNote('Pisownia nie z rzeczownikami', '1. **Nie** z rzeczownikami piszemy **łącznie**: niepokój, nieporządek, niepogoda.\n2. **Nie** z czasownikami piszemy **osobno**: nie wiem, nie lubię.\n3. Jak sprawdzić? Pytam: **kto? co?** - rzeczownik (razem). **Co robi?** - czasownik (osobno).'),
      ...poKolei(
        zad('r2-s87-zad2', 87, '2', 'zeszyt'),
        zad('r2-s88-zad3', 88, '3', 'cwiczymy'),
        zad('r2-s88-zad4', 88, '4', 'zeszyt'),
        zad('r2-s88-zad5', 88, '5', 'cwiczymy'),
      ),
    ],
  },
  {
    title: '29. Co już wiesz? Co umiesz? Podsumowanie rozdziału II',
    dzial: ROZDZIAL_2,
    topic: 'Pośród słów i znaczeń - podsumowanie',
    textbookPage: 89,
    teacherPlan: plan(
      ['Co dziś', 'Podsumowanie rozdziału przed sprawdzianem. Mapa ze s. 89 pokazuje wszystkie pojęcia, film powtarza każde z nich. Tekst Justyny Bednarek „Wnuczka antykwariusza” (s. 89-90) pomijamy - zostają zadania, które działają bez niego (s. 91 zad. 5, 6, 7, 9, 10).'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - nie z rzeczownikami.',
        '2. **Mapa s. 89** (2 min) - co już znamy?',
        '3. **Film „Podsumowanie rozdziału II”** (10 min).',
        '4. **Koło z nowymi pytaniami** (5 min).',
        '5. **Notatka** (5 min).',
        '6. Zadania z podręcznika po kolei: **s. 91 zad. 5, 6, 7, 9, 10**.',
        '7. Do domu: zeszyt powtórzeniowy PDF (link w VULCANIE) przed sprawdzianem.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 91 zad. 5** z prawej strony w górnym rogu; ręcznie; wielką; małą; postscriptum; przyczynę napisania listu.',
        '- **s. 91 zad. 7** radosna - smutna; starsza - młodsza; wspaniale - okropnie (fatalnie); krótki - długi.',
        '- **s. 91 zad. 9** P, F, P, P, F.',
        '- **s. 91 zad. 10** list, listu, listowi, list, listem, liście, liście; listy, listów, listom, listy, listami, listach, listy. Rodzaj męski.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Zamień wyraz potoczny na oficjalny: „kumpel”.', answer: 'kolega' },
      { text: 'Wskaż porównanie: „Jej śmiech dzwonił jak dzwoneczek”.', answer: 'jak dzwoneczek' },
      { text: 'Podaj synonim i antonim słowa „wesoły”.', answer: 'np. radosny; smutny.' },
      { text: 'Gdzie w liście piszemy miejscowość i datę?', answer: 'W prawym górnym rogu.' },
      { text: 'Odmień „kot” w narzędniku liczby pojedynczej.', answer: '(z) kotem' },
      { text: 'Razem czy osobno: (nie)prawda?', answer: 'nieprawda - razem, rzeczownik.' },
      { text: 'Wielką czy małą: (o/O)dra?', answer: 'Odra - nazwa rzeki, wielką literą.' },
      { text: 'Fakt czy opinia: „Najlepsza pora roku to lato”?', answer: 'Opinia.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Pośród słów i znaczeń - podsumowanie'),
      ...recap(previousSetId),
      ramka('r2-s89-mapa', 89, 'Pośród słów i znaczeń - mapa rozdziału'),
      ...filmIKolo('podsumowanie4-dzial2-film1', ownSetId),
      slideNote('Pośród słów i znaczeń - podsumowanie', '**SŁOWA:** wyrazy potoczne tylko na luzie (nie w wypracowaniu). Porównanie: jak, jakby, niczym, niby. Synonimy - podobne znaczenie, antonimy - przeciwne.\n**LIST:** miejscowość i data, nagłówek, wstęp, rozwinięcie, zakończenie, pozdrowienie, podpis, PS. Ty, Ciebie, Twój - wielką literą.\n**RZECZOWNIK:** kto? co?; liczba i rodzaj; 7 przypadków: M, D, C, B, N, Ms, W. Nazwy własne wielką literą. **Nie** z rzeczownikami razem.\n**ROZMOWA:** opinia + argument (ponieważ...). Asertywność: „Nie, bo... Ale mogę...”.'),
      ...poKolei(
        zad('r2-s91-zad5', 91, '5', 'ustnie'),
        zad('r2-s91-zad6', 91, '6', 'zeszyt'),
        zad('r2-s91-zad7', 91, '7', 'zeszyt'),
        zad('r2-s91-zad9', 91, '9', 'ustnie'),
        zad('r2-s91-zad10', 91, '10', 'zeszyt'),
      ),
    ],
  },
];
