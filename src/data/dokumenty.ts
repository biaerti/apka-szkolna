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

// Bartek 2026-11-20: dyrektor byl na lekcji (bitwa z modelem 3D placu) i prosil
// o konspekt pracy. Opis systemu + przyklad lekcji o Gerebie (lekturaChlopcy.ts).
// Wielokanalowosc opisana jako kodowanie podwojne / uczenie multimedialne, NIE
// jako "style uczenia sie" (te badania podwazaja) - zeby dyrektor nie mial
// czego podwazyc.
export const KONSPEKT_PRACY: Dokument = {
  slug: 'konspekt-pracy',
  title: 'Konspekt pracy',
  printTitle: 'Konspekt pracy - język polski w klasach IV-V',
  subtitle: `Szkoła Podstawowa nr 97 we Wrocławiu, rok szkolny ${ROK_SZKOLNY}. Nauczyciel: Bartosz Kuniński, klasy IV A, IV B, IV C i V A`,
  description: 'Dla dyrektora: jak wyglądają moje lekcje i sprawdziany, dlaczego tak, plus przykład lekcji o Gerebie.',
  sections: [
    {
      title: 'Założenia',
      blocks: [
        {
          type: 'p',
          text: 'Każda lekcja ma tę samą, przewidywalną strukturę: uczniowie wiedzą, co nastąpi po dzwonku, kiedy odpowiadają i co zapisują. Zmienia się treść, rama zostaje.',
        },
        {
          type: 'ul',
          items: [
            'Wielokanałowość. Ta sama wiedza dociera do ucznia kilka razy i różnymi drogami: słuchem (czytanka z lektorem, rozmowa, narracja filmu), wzrokiem (tekst podświetlany na ekranie, schemat, przykłady w filmie) i działaniem (zadania robione wspólnie, notatka pisana ręką).',
            'Najpierw konkret, potem porządek. Pojęcie najpierw pojawia się w tekście albo w rozmowie, a potem jeszcze raz, w uporządkowany sposób, w krótkim filmie. Film zatrzymuję, dopowiadam i rozmawiamy.',
            'Przykłady z życia. Omawiane motywy odnoszę do świata uczniów: szkoły, podwórka, rodziny, sklepu. Zadania mają własne, codzienne przykłady („Ola skłamała mamie, bo bała się kary”), a nie oderwane zdania.',
            'Myśli każdy, nie tylko zgłaszający się. Do odpowiedzi losuje koło fortuny, więc każdy musi być gotowy, a każdy ma równe szanse.',
            'Podręcznik to pomoc, nie rama. Z działu wybieram najwyżej dwa teksty do czytania, pozostałe lekcje to nauka o języku i pisanie.',
          ],
        },
      ],
    },
    {
      title: 'Przebieg lekcji (45 minut)',
      blocks: [
        {
          type: 'table',
          head: ['Etap', 'Czas', 'Co się dzieje', 'Po co'],
          rows: [
            [
              'Temat i koło powtórzeniowe',
              '5-8 min',
              'Krótki temat na ekranie, uczniowie zapisują go w zeszycie. Koło fortuny losuje 3-5 osób, każda odpowiada na pytanie z poprzedniej lekcji. Odpowiedź jest oceniana (plus, kropka, plomba).',
              'Przypominanie z pamięci utrwala wiedzę. Uczniowie wiedzą, że z każdej lekcji trzeba coś wynieść.',
            ],
            [
              'Czytanka albo pogadanka',
              '5-10 min',
              'Fragment tekstu czyta lektor, a tekst podświetla się na ekranie. Potem 3-5 pytań do klasy, ustnie, odkrywanych po kolei: o bohaterach i sytuacji, prowadzących do pojęcia z lekcji. Na lekcji bez tekstu: rozmowa wprowadzająca, kluczowe kwestie na tablicy.',
              'Uczniowie sami dochodzą do pojęcia na konkretnym tekście albo sytuacji.',
            ],
            [
              'Film podsumowujący',
              '5-9 min',
              'Krótki film z głosem lektora, przygotowany przeze mnie z pomocą narzędzi AI i sprawdzony w całości przed lekcją: wyjaśnienie, zwykle 3 zadania z pauzą na odpowiedź, sprawdzenie z uzasadnieniem „dlaczego”, na końcu „Zapamiętaj!”. Zadania z filmu robimy ustnie.',
              'To samo pojęcie drugi raz, uporządkowane: słowo i obraz razem, małymi porcjami, z przerwami na myślenie.',
            ],
            [
              'Ćwiczymy razem',
              '10-15 min',
              '2-3 karty z zadaniami na projektorze, z własnymi przykładami z życia uczniów. Po każdym przykładzie koło losuje osobę, która odpowiada i uzasadnia.',
              'Praktyka prowadzona: od razu widzę, kto rozumie, i poprawiam błędy na bieżąco.',
            ],
            [
              'Notatka do zeszytu',
              '5 min',
              'Na koniec 2-4 krótkie zdania z wiedzy (reguła, pojęcie, sposób), każdy pisze sam. Z treści omawianego tekstu notatki nie robimy.',
              'Pisanie ręką domyka lekcję, a notatka służy potem do powtórki.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Pytania z lekcji wracają na kole na początku kolejnej lekcji. Zestaw pytań do koła jest inny niż zadania z filmu i z kart: ta sama umiejętność, inny materiał.',
        },
      ],
    },
    {
      title: 'Dlaczego tak - co mówią badania',
      blocks: [
        {
          type: 'ul',
          items: [
            'Słowo połączone z obrazem zapamiętuje się lepiej niż samo słowo (teoria podwójnego kodowania Paivia; R. Mayer, „Multimedia Learning”). Nie chodzi tu o „style uczenia się” (wzrokowiec, słuchowiec), których badania nie potwierdzają (Pashler i in., 2008), tylko o to, żeby każdy uczeń dostał tę samą treść kilkoma drogami.',
            'Przypominanie z pamięci (koło, pytania po czytance, zadania w filmie) utrwala wiedzę silniej niż ponowne czytanie, a powtórka rozłożona w czasie silniej niż jednorazowa (metaanaliza Rowland, 2014; Dunlosky i in., 2013).',
            'Film podzielony na części z pauzami uczy lepiej niż ciągły (metaanaliza Rey i in., 2019). Dlatego po każdej części filmu jest zadanie, a ja zatrzymuję film i dopytuję.',
            'Jawne nauczanie: najpierw wyjaśnienie i przykład, potem praktyka wspólna z informacją zwrotną, na końcu zapis (AERO, „Explicit instruction”). Stała struktura lekcji i przewidywalne zasady ułatwiają też utrzymanie porządku w klasie (Oliver, Wehby i Reschly, 2011).',
          ],
        },
      ],
    },
    {
      title: 'Ile bodźców na ekranie',
      blocks: [
        {
          type: 'p',
          text: 'Model 3D Placu Broni z obserwowanej lekcji to wyjątek: ta lekcja dotyczyła planu bitwy i przestrzeni, a tego nie da się zrozumieć bez mapy. Zwykle ekran jest spokojny - ciemne tło, jeden tekst albo jedno zadanie naraz, bez ozdobników. Analizę tekstu prowadzimy przede wszystkim słownie, a kluczowe kwestie zapisuję na tablicy. Obraz pojawia się tylko wtedy, gdy wyjaśnia treść (schemat, mapa, przykład w filmie), bo zbędne elementy na ekranie przeszkadzają w nauce (Mayer, zasada spójności).',
        },
      ],
    },
    {
      title: 'Sprawdzanie wiedzy i ocenianie',
      blocks: [
        {
          type: 'ul',
          items: [
            'Sprawdzian po każdym dziale, zapowiedziany tydzień wcześniej. Cztery grupy: A i B dla klasy, C dla nieobecnych (piszą w innym terminie), D dla uczniów z orzeczeniem - krótsza, z większymi literami i podpowiedziami.',
            'Przed sprawdzianem tydzień powtórki: zeszyt powtórzeniowy w dzienniku VULCAN (każdy temat działu w punktach i te same zadania co w filmach, z rozwiązaniem i uzasadnieniem), karta pracy na lekcji i quiz w Kahoocie.',
            'Co najmniej jedna praca pisemna w półroczu, zwykle związana z lekturą.',
            'Odpowiedzi ustne na kole powtórzeniowym: plusy, kropki i plomby, rozliczane co miesiąc (3 plusy = piątka, 3 plomby = jedynka). Każdy uczeń ma 2 „pasy” w miesiącu, czyli prawo powiedzieć „dziś nie odpowiadam”.',
            'Bieżących kartkówek nie robię. Wyjątek: krótkie sprawdzenie wiedzy po lekcji, na której klasa nie pracowała przez hałas (opisane w PSO).',
            'Pełne zasady i skala procentowa: przedmiotowy system oceniania przekazany rodzicom.',
          ],
        },
      ],
    },
    {
      title: 'Rytm roku: działy i lektury',
      blocks: [
        {
          type: 'p',
          text: 'Pracuję działami podręcznika (klasa IV: GWO „Między nami”, klasa V: Nowa Era „NEON”). Po dwóch działach przychodzi lektura: dział, dział, lektura, dział, dział, lektura. Każdy dział kończy się tygodniem powtórki i sprawdzianem. Lekturę omawiamy po przeczytaniu całej książki, w 5-6 lekcjach - każda lekcja to jeden problem i jedno pojęcie (np. czyn i motyw, sympatia i zaufanie). Pierwsza lektura w klasie IV: „Chłopcy z Placu Broni”.',
        },
        {
          type: 'p',
          text: 'Lekcje prowadzę z własnej aplikacji (szkola.klippi.pl): slajdy na projektor, koło fortuny, czytanki z lektorem, filmy i karty zadań. Odpowiedzi z koła zapisują się na bieżąco, więc co miesiąc widzę, kto odpowiada i które pytania sprawiają trudność.',
        },
      ],
    },
    {
      title: 'Przykład: lekcja z lektury „Chłopcy z Placu Broni” (klasa IV)',
      blocks: [
        {
          type: 'table',
          rows: [
            ['Temat', 'Gereb - czy zdradę można wybaczyć? (lekcja 4 z 6)'],
            ['Pojęcia', 'czyn i motyw, sympatia i zaufanie'],
            [
              'Po lekcji uczeń',
              'odróżnia czyn od motywu; odróżnia sympatię od zaufania i rozpoznaje je w sytuacjach z życia; wyjaśnia, dlaczego Boka przebacza Gerebowi, ale nie przyjmuje go od razu z powrotem; wie, że zaufanie odbudowują czyny, a nie same słowa',
            ],
            ['Metody', 'pogadanka, praca z tekstem, film z pauzami, ćwiczenia wspólne z losowaniem odpowiadających'],
            ['Środki', 'projektor i aplikacja (koło fortuny, czytanka z lektorem, schemat, film, karty zadań), tablica, zeszyt'],
          ],
        },
        {
          type: 'table',
          head: ['Etap', 'Czas', 'Przebieg'],
          rows: [
            [
              '1. Temat i koło',
              '8 min',
              'Temat na ekranie, uczniowie zapisują go w zeszycie. Koło losuje 3 osoby, pytania z poprzedniej lekcji (np. „Dlaczego koledzy wpisali nazwisko Nemeczka małymi literami?”).',
            ],
            [
              '2. Czytanka',
              '4 min',
              'Fragment z rozdz. VI: Gereb przy furtce prosi Bokę o przebaczenie. Lektor czyta, tekst podświetla się na ekranie. Przed czytaniem jedno zadanie dla uwagi: „Boka zgaduje, dlaczego Gereb przyszedł. Gereb mówi, że powód był inny. Uważajcie”.',
            ],
            [
              '3. Pytania po czytance',
              '5 min',
              'Ustnie, pytania wchodzą po kolei: Dlaczego Gereb zdradził? Czy Boka go lubi - po czym to widać? A czy mu ufa? Czy można kogoś lubić, ale mu nie ufać? Co sprawiło, że Gereb został w końcu przyjęty z powrotem?',
            ],
            [
              '4. Schemat „Co psuje zdrada?”',
              '3 min',
              'Rysunek w trzech krokach: chłopcy i Gereb na wspólnym fundamencie zaufania, nad nimi łuk sympatii; po zdradzie fundament pęka, a sympatia zostaje; motyw (zazdrość o Bokę) prowadzi do czynu (zdrada).',
            ],
            [
              '5. Film',
              '9 min',
              '„Gereb - czyn i motyw, sympatia i zaufanie”: wyjaśnienie i 3 zadania ustne z minutą na każde (motywy Gereba; cztery sytuacje: sympatia czy zaufanie; czym odbudować zaufanie), sprawdzenie z uzasadnieniem, „Zapamiętaj!”.',
            ],
            [
              '6. Ćwiczymy razem',
              '10 min',
              'Trzy karty z przykładami z życia: „Czyn czy motyw?” (Kuba wziął rower brata bez pytania, bo spóźniał się na trening), „Sympatia czy zaufanie?” (sąsiad, z którym rzadko rozmawiacie, podlewa wasze kwiaty), „Czym odbudować zaufanie?” (czyn, same słowa czy przekupstwo). Po każdym przykładzie koło losuje osobę.',
            ],
            [
              '7. Notatka',
              '5 min',
              'Trzy zdania do zeszytu: Oceniając bohatera, patrzymy, co zrobił (czyn) i dlaczego (motyw). Motyw pomaga zrozumieć, ale nie usprawiedliwia złego czynu. Sympatia to: lubię cię. Zaufanie to: mogę na tobie polegać. Przyjaźń potrzebuje obu. Zdrada niszczy zaufanie, a odbudowują je czyny, nie same słowa.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Na tej lekcji to samo pojęcie pojawia się pięć razy i za każdym razem inaczej: w pytaniach do tekstu, na schemacie, w filmie, w zadaniach z życia i w notatce. Pytania z tej lekcji (np. „Czym różni się sympatia od zaufania?”) wracają na kole na początku następnej.',
        },
      ],
    },
  ],
  footer: 'Wrocław, listopad 2026',
};

export const DOKUMENTY: Dokument[] = [PSO, PLAN_ROZWOJU, KONSPEKT_PRACY];

export function findDokument(slug: string | undefined): Dokument | undefined {
  return DOKUMENTY.find((d) => d.slug === slug);
}
