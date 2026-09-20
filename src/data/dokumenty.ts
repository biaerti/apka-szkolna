// Dokumenty "urzedowe" nauczyciela, ktore apka drukuje na A4 (zakladka
// Dokumenty -> src/pages/DocPrint.tsx): przedmiotowy system oceniania dla
// rodzicow i plan rozwoju w okresie przygotowania do zawodu dla dyrektora.
// Tresc jest tu danymi (sekcje z akapitami, listami i tabelami), a nie JSX -
// zeby dalo sie ja poprawiac bez dotykania ukladu wydruku.
//
// PSO ma sie zmiescic na JEDNEJ stronie A4 - to dokument do wyslania rodzicowi,
// nie regulamin. Liczby (progi %, 2 pasy, 3 plusy = 5) musza sie zgadzac
// z src/data/zasady.ts - tam jest wersja dla dzieci, tu dla doroslych.

export type DocBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head?: string[]; rows: string[][] };

export interface DocSection {
  title: string;
  blocks: DocBlock[];
}

export interface Dokument {
  slug: string;
  /** Nazwa na liscie w zakladce Dokumenty. */
  title: string;
  /** Tytul na wydruku (moze byc dluzszy niz na liscie). */
  printTitle: string;
  subtitle: string;
  /** Jedno zdanie na liscie: dla kogo jest ten dokument. */
  description: string;
  sections: DocSection[];
  /** Miejsca na podpisy pod dokumentem (puste = brak). */
  signatures?: string[];
  footer?: string;
}

const ROK_SZKOLNY = '2026/2027';

export const PSO: Dokument = {
  slug: 'pso',
  title: 'Przedmiotowy system oceniania',
  printTitle: 'Przedmiotowy system oceniania z języka polskiego',
  subtitle: `Klasy IV-V, Szkoła Podstawowa nr 97 we Wrocławiu, rok szkolny ${ROK_SZKOLNY}. Nauczyciel: Bartosz Kuniński`,
  description: 'Jedna strona dla rodziców i wychowawców: jak wyglądają lekcje i za co są oceny.',
  sections: [
    {
      title: 'Jak wyglądają lekcje',
      blocks: [
        {
          type: 'ul',
          items: [
            'Lekcje prowadzę multimedialnie - temat i zadania są na projektorze, zadania robimy wspólnie i na czas. W zeszycie zapisujemy tylko temat, rozwiązania zadań i krótką notatkę na koniec. Mniej przepisywania to więcej czasu na rozmowę o tekście i dyskusję.',
            'Każda lekcja zaczyna się kołem powtórzeniowym: koło fortuny losuje kilkoro uczniów, którzy odpowiadają na pytania z poprzedniego tematu. Nikt się nie zgłasza - losuje koło, każdy ma równe szanse.',
            'Po każdym zadaniu koło losuje jedną osobę, która pokazuje swoje rozwiązanie. Tu można tylko zyskać.',
            'Przed sprawdzianem każdy uczeń dostaje na kartce podsumowanie całego działu.',
          ],
        },
      ],
    },
    {
      title: 'Za co są oceny',
      blocks: [
        {
          type: 'table',
          head: ['Forma', 'Kiedy', 'Jak oceniam'],
          rows: [
            [
              'Sprawdzian po dziale',
              'po każdym dziale, zapowiedziany z tygodniowym wyprzedzeniem',
              'w procentach, według skali niżej',
            ],
            [
              'Odpowiedzi ustne (koło powtórzeniowe)',
              'na każdej lekcji',
              'plus za bardzo dobrą odpowiedź, kropka za częściową, plomba za złą albo brak. Rozliczenie na koniec miesiąca: 3 plusy = piątka, 3 plomby = jedynka',
            ],
            [
              'Aktywność na lekcji (koło po zadaniu)',
              'na każdej lekcji',
              'tylko plusy i kropki - za rozwiązanie zadania nie można nic stracić',
            ],
            [
              'Dyktanda, recytacja, projekty',
              'kilka razy w półroczu',
              'ocena na bieżąco, kryteria podaję przed zadaniem',
            ],
            [
              'Kartkówka z hałaśliwej lekcji',
              'po hałaśliwej lekcji - sprawdzenie wiedzy z tej lekcji',
              'krótka, na ocenę, z materiału tej lekcji',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Prace domowe nie są oceniane stopniem (zgodnie z rozporządzeniem MEN z 2024 r.) - sprawdzam je i omawiam na lekcji.',
        },
      ],
    },
    {
      title: 'Skala procentowa sprawdzianów (zgodna z WZO szkoły)',
      blocks: [
        {
          type: 'table',
          head: ['0-30%', '31-50%', '51-72%', '73-85%', '86-96%', '97-100%'],
          rows: [['niedostateczny', 'dopuszczający', 'dostateczny', 'dobry', 'bardzo dobry', 'celujący']],
        },
      ],
    },
    {
      title: 'Pasy i plomby',
      blocks: [
        {
          type: 'ul',
          items: [
            'Każdy uczeń ma 2 pasy w miesiącu. Pas znaczy "dzisiaj nie odpowiadam" - bez żadnych konsekwencji. Limit odnawia się co miesiąc.',
            'Plombę można dostać za złą odpowiedź, brak odpowiedzi i za podpowiadanie. Zła odpowiedź na kole po zadaniu nie daje plomby.',
          ],
        },
      ],
    },
    {
      title: 'Hałas i kartkówka',
      blocks: [
        {
          type: 'p',
          text: 'Gdy cała klasa jest za głośno, stawiam kreskę na tablicy. Gdy klasa się wycisza, kreski ścieram. Trzy kreski naraz oznaczają, że klasa pisze krótką kartkówkę sprawdzającą wiedzę z tej hałaśliwej lekcji. Kartkówka nie jest karą za zachowanie - sprawdza, ile z lekcji zostało w głowach. Zachowanie oceniam osobno: uwagą w dzienniku, wpisywaną od razu, bez ostrzeżeń. Uwaga nie ma wpływu na oceny z przedmiotu.',
        },
      ],
    },
    {
      title: 'Poprawa, nieobecności, dostosowania',
      blocks: [
        {
          type: 'ul',
          items: [
            'Sprawdzian można poprawić raz, w ciągu dwóch tygodni od oddania. Uczeń nieobecny pisze go w terminie uzgodnionym ze mną.',
            'Ocena śródroczna i roczna nie jest średnią arytmetyczną - najważniejsze są sprawdziany, potem dyktanda i prace, na końcu odpowiedzi ustne.',
            'Uczniowie z opinią lub orzeczeniem poradni mają dostosowania zgodnie z zaleceniami (np. wydłużony czas, mniej przykładów, inna forma sprawdzenia).',
            'Kontakt ze mną: dziennik elektroniczny albo konsultacje w szkole.',
          ],
        },
      ],
    },
  ],
};

export const PLAN_ROZWOJU: Dokument = {
  slug: 'plan-rozwoju',
  title: 'Plan rozwoju zawodowego',
  printTitle: 'Plan rozwoju zawodowego nauczyciela początkującego w okresie przygotowania do zawodu',
  subtitle:
    'Bartosz Kuniński, nauczyciel języka polskiego, wychowawca klasy IV A. Szkoła Podstawowa nr 97 we Wrocławiu',
  description:
    'Dla dyrektora: cele, harmonogram przygotowania do zawodu i współpraca z mentorem. Dokument dobrowolny - Karta Nauczyciela go nie wymaga.',
  sections: [
    {
      title: 'Informacje formalne',
      blocks: [
        {
          type: 'table',
          rows: [
            ['Stopień', 'nauczyciel początkujący'],
            ['Przygotowanie do zawodu', 'od 1 września 2026 r., wymiar 3 lata i 9 miesięcy - planowany koniec 31 maja 2030 r.'],
            ['Mentor', 'nauczyciel mianowany lub dyplomowany wyznaczony przez dyrektora: ........................................'],
            [
              'Podstawa prawna',
              'art. 9ca i 9fa ustawy Karta Nauczyciela (w brzmieniu od 1 września 2025 r.); rozporządzenie MEN z 29 października 2025 r. w sprawie oceny pracy nauczycieli; rozporządzenie MEiN z 6 września 2022 r. w sprawie uzyskiwania stopni awansu zawodowego',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Przepisy nie wymagają od nauczyciela początkującego planu rozwoju zawodowego. Ten plan spisuję dobrowolnie, żeby uporządkować współpracę z mentorem, przygotowanie do oceny pracy i własne doskonalenie - i żeby dyrektor wiedział, na czym mi zależy.',
        },
      ],
    },
    {
      title: 'Cele na okres przygotowania do zawodu',
      blocks: [
        {
          type: 'ul',
          items: [
            'Wypracować własny, powtarzalny model lekcji języka polskiego w klasach IV-V: krótkie omówienie, zadania na czas, losowanie do odpowiedzi, dyskusja o tekście, notatka - i doskonalić go na podstawie obserwacji mentora oraz wyników uczniów.',
            'Nauczyć się pracy z uczniami ze specjalnymi potrzebami (w IV A troje uczniów z orzeczeniem) i dostosowywać wymagania bez obniżania poziomu lekcji.',
            'Dobrze poprowadzić pierwsze wychowawstwo: klasa IV A, współpraca z rodzicami, zespołem klasowym i pedagogiem szkolnym.',
            'Uzyskać ocenę pracy co najmniej bardzo dobrą, przeprowadzić zajęcia w obecności komisji i zdać egzamin na stopień nauczyciela mianowanego.',
          ],
        },
      ],
    },
    {
      title: 'Harmonogram wynikający z przepisów',
      blocks: [
        {
          type: 'table',
          head: ['Rok', 'Co się dzieje', 'Termin'],
          rows: [
            [
              'Rok 1 (2026/27)',
              'Wyznaczenie mentora. Obserwacja zajęć mentora i prowadzenie zajęć w jego obecności z omówieniem - co najmniej 1 godzina w miesiącu. Pierwsza ocena pracy dokonywana przez dyrektora.',
              'mentor: wrzesień 2026; ocena pracy: między 8. a 11. miesiącem, czyli maj-lipiec 2027',
            ],
            [
              'Rok 2 i 3 (2027/28, 2028/29)',
              'Obserwacje i zajęcia w obecności mentora - co najmniej 4 godziny w roku. Realizacja zadań z części "Obszary rozwoju".',
              'cały rok szkolny',
            ],
            [
              'Rok 4 (2029/30)',
              'Zajęcia w obecności komisji (dyrektor, mentor i pozostali członkowie) - co najmniej 1 godzina. Druga ocena pracy. Wniosek o postępowanie egzaminacyjne i egzamin na nauczyciela mianowanego.',
              'zajęcia i ocena: do maja 2030; wniosek: do 30 czerwca 2030',
            ],
          ],
        },
      ],
    },
    {
      title: 'Obszary rozwoju i zadania',
      blocks: [
        {
          type: 'p',
          text: 'Obszary odpowiadają kryteriom oceny pracy nauczyciela z rozporządzenia z 2025 r. (numery w nawiasach). W kolumnie "Dowód" jest to, co pokażę przy ocenie pracy.',
        },
        {
          type: 'table',
          head: ['Obszar', 'Zadania', 'Termin', 'Dowód'],
          rows: [
            [
              'Warsztat dydaktyczny, metody aktywizujące i TIK (1, 12)',
              'Prowadzę lekcje na projektorze z własną aplikacją: koło fortuny do odpowiedzi, zadania ze stoperem, notatki, kartkówki. Rozbudowuję bank lekcji dla klas IV-V do podręcznika GWO. Wprowadzam elementy oceniania kształtującego (kryteria przed zadaniem, informacja zwrotna). Obserwuję lekcje mentora i innych polonistów.',
              'na bieżąco; bank lekcji dla klasy IV do czerwca 2027, dla klasy V do czerwca 2028',
              'scenariusze i prezentacje lekcji, arkusze obserwacji, konspekty lekcji obserwowanych',
            ],
            [
              'Analiza własnej pracy (2)',
              'Co miesiąc podsumowuję odpowiedzi ustne uczniów (statystyki z aplikacji: kto odpowiada, jakie pytania sprawiają trudność) i wyciągam wnioski do kolejnych lekcji. Po każdej obserwacji notuję ustalenia z mentorem. Po każdym półroczu krótka ankieta wśród uczniów o lekcjach.',
              'co miesiąc; ankieta: styczeń i czerwiec',
              'zestawienia miesięczne, notatki z omówień, wyniki ankiet i wnioski',
            ],
            [
              'Uczniowie ze specjalnymi potrzebami, indywidualizacja (5, 12)',
              'Zapoznaję się z orzeczeniami i opiniami uczniów, ustalam dostosowania z pedagogiem i zespołem. Różnicuję zadania i formy sprawdzania. Szkolenie z pracy z uczniem z SPE.',
              'wrzesień-październik 2026, potem na bieżąco; szkolenie w roku 1 lub 2',
              'dostosowania wymagań, notatki ze spotkań zespołu, zaświadczenie ze szkolenia',
            ],
            [
              'Wychowawstwo i współpraca z rodzicami (10, 6, 4)',
              'Zebrania z rodzicami według przygotowanego scenariusza, przedmiotowy system oceniania przekazany rodzicom na początku roku, stały kontakt przez dziennik. Godziny wychowawcze o zasadach współpracy w klasie, prawach dziecka i szacunku dla innych. Zasady lekcji omówione i rozdane uczniom.',
              'zebrania: wg kalendarza szkoły; PSO: wrzesień 2026',
              'protokoły zebrań, PSO, tematy godzin wychowawczych',
            ],
            [
              'Współpraca z nauczycielami (7)',
              'Praca w zespole humanistycznym i zespole wychowawców klas IV. Dzielę się materiałami i narzędziami do lekcji (prezentacje, koło fortuny, kartkówki) z innymi polonistami.',
              'cały okres',
              'protokoły zespołów, udostępnione materiały',
            ],
            [
              'Doskonalenie zawodowe (9)',
              'Szkolenia wewnątrzszkolne. Co najmniej jedno szkolenie zewnętrzne rocznie (np. WCDN Wrocław, ODN): ocenianie kształtujące, praca z uczniem z SPE, metodyka języka polskiego w klasach IV-VI. Lektura metodyczna.',
              'co najmniej 1 szkolenie zewnętrzne w roku',
              'zaświadczenia, notatki',
            ],
            [
              'Przepisy, dokumentacja, bezpieczeństwo (8, 3)',
              'Znajomość statutu, WZO, procedur szkolnych, RODO, zasad BHP i dyżurów. Rzetelne prowadzenie dziennika elektronicznego i dokumentacji wychowawcy.',
              'wrzesień-październik 2026, potem na bieżąco',
              'dokumentacja klasy, dziennik',
            ],
            [
              'Zajęcia dodatkowe (11)',
              'Przygotowanie uczniów do konkursu recytatorskiego, szkolny turniej słowa (slam poetycki dla klas IV-V), pomoc uczniom słabszym w ramach konsultacji.',
              'konkurs: rok 1; turniej: od roku 2',
              'regulamin i dokumentacja imprezy, lista uczestników konkursów',
            ],
          ],
        },
      ],
    },
    {
      title: 'Współpraca z mentorem',
      blocks: [
        {
          type: 'ul',
          items: [
            'Stałe spotkanie raz w miesiącu: omówienie obserwowanej lekcji (mojej albo mentora) i planu na kolejny miesiąc.',
            'Na co szczególnie proszę zwrócić uwagę: tempo lekcji i ilość materiału, dyscyplina i hałas w klasie, dobór zadań do możliwości uczniów, dokumentacja wychowawcy.',
            'W ostatnim roku: wspólne przygotowanie zajęć w obecności komisji i przygotowanie do egzaminu.',
          ],
        },
      ],
    },
    {
      title: 'Dokumentacja',
      blocks: [
        {
          type: 'p',
          text: 'Prowadzę segregator z: arkuszami obserwacji zajęć, notatkami z omówień z mentorem, konspektami lekcji obserwowanych, zaświadczeniami ze szkoleń i miesięcznymi zestawieniami wyników uczniów. Plan może być aktualizowany po każdej ocenie pracy i w porozumieniu z mentorem.',
        },
      ],
    },
  ],
  signatures: ['nauczyciel', 'mentor', 'dyrektor szkoły'],
  footer: 'Wrocław, wrzesień 2026',
};

export const DOKUMENTY: Dokument[] = [PSO, PLAN_ROZWOJU];

export function findDokument(slug: string | undefined): Dokument | undefined {
  return DOKUMENTY.find((d) => d.slug === slug);
}
