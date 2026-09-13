/**
 * Spis tresci podrecznika GWO dla klasy IV, wydanie 2026.
 *
 * Zrodlo: cztery zrzuty stron 3-8 przekazane przez nauczyciela 13.09.2026.
 * Dane zapisujemy osobno od gotowych lekcji w textbook4.ts, bo ten katalog
 * jest punktem odniesienia przy budowaniu kolejnych materialow.
 */

export interface Textbook4TocItem {
  lessons: string;
  title: string;
  page: number;
  texts?: string[];
}

export interface Textbook4TocChapter {
  number: number;
  title: string;
  subtitle: string;
  items: Textbook4TocItem[];
}

export const TEXTBOOK4_METADATA = {
  publisher: 'Gdańskie Wydawnictwo Oświatowe',
  year: 2026,
  edition: 'wydanie pierwsze',
  approvalNumber: '1275/1/2026',
  isbn: '978-83-8118-733-6',
  curriculum: 'Moim zdaniem',
} as const;

export const TEXTBOOK4_TOC: Textbook4TocChapter[] = [
  {
    number: 1,
    title: 'Poznajemy siebie i innych',
    subtitle: 'O emocjach, relacjach i uczeniu się',
    items: [
      { lessons: '1-2', title: 'Krok po kroku tworzymy pierwszą wspólną opowieść', page: 12, texts: ['Weronika Kurosz, Moje lato z szablozębnym'] },
      { lessons: '3', title: 'Być sobą, czyli kim?', page: 16, texts: ['Michał Rusinek, Ja'] },
      { lessons: '4', title: 'Notatką kluczem do sukcesu', page: 18 },
      { lessons: '5-6', title: 'Sekrety wyrazów - głoski, litery i sylaby', page: 22 },
      { lessons: '7', title: 'Malujemy pędzlem i słowem', page: 25, texts: ['Wanda Chotomska, Autoportret'] },
      { lessons: '8', title: 'Dlaczego warto być sobą?', page: 29, texts: ['Michel Piquemal, Nauki mędrca'] },
      { lessons: '9-10', title: 'Dzień tematyczny: Międzynarodowy Dzień Kropki', page: 33, texts: ['Peter H. Reynolds, Kropka', 'Serge Bloch, Wielka historia małej kreski', 'Kobi Yamada, Co robisz z pomysłem?'] },
      { lessons: '11', title: 'Czas na czasownik', page: 37 },
      { lessons: '12-13', title: 'Misja odmiana! Tajemnice czasownika', page: 40 },
      { lessons: '14', title: 'Czy każda nasza wypowiedź jest zdaniem?', page: 43 },
      { lessons: '15', title: 'Tworzymy plan ramowy', page: 46, texts: ['Marek Michalak, Historia o akceptacji. Stoję murem za Bartkiem'] },
      { lessons: '16', title: 'Co już wiesz? Co umiesz?', page: 50, texts: ['Álex Rovira, Francesc Miralles, Książę, który chciał być żabą. Najprościej jest być sobą'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 54 },
    ],
  },
  {
    number: 2,
    title: 'Pośród słów i znaczeń',
    subtitle: 'Język jako narzędzie myślenia i komunikacji',
    items: [
      { lessons: '1', title: 'Potocznie - czyli jak? Tworzymy słownik wyrazów potocznych', page: 56, texts: ['Joanna Olech, Dynastia Miziołków'] },
      { lessons: '2', title: 'Słowa są jak...', page: 59, texts: ['Zofia Beszczyńska, wiersze'] },
      { lessons: '3', title: 'Tak samo czy zupełnie inaczej. O synonimach i antonimach', page: 62 },
      { lessons: '4', title: 'Listy do dzieci - kilka słów o budowie listu', page: 65, texts: ['Clive Staples Lewis, Listy do dzieci'] },
      { lessons: '5', title: 'Dzień tematyczny: Międzynarodowy Dzień Pisania Listów', page: 68 },
      { lessons: '6-7', title: 'Rzeczownik i (nie)przypadkowa drużyna', page: 71 },
      { lessons: '8', title: 'Dlaczego warto wyrażać swoje zdanie?', page: 75, texts: ['Michał Rusinek, Aneta Załazińska, Kurs fotografii, czyli o tym, co to jest przekonywanie'] },
      { lessons: '9', title: 'Sztuka odmawiania, czyli czym jest asertywność', page: 80, texts: ['Marek Michalak, Historia o własnym zdaniu. Pani z tramwaju'] },
      { lessons: '10', title: 'Niesforne przypadki - ćwiczymy odmianę rzeczownika', page: 84 },
      { lessons: '11', title: 'Tajniki polskiej ortografii: pisownia rzeczowników wielką i małą literą', page: 85 },
      { lessons: '12', title: 'Tajniki polskiej ortografii: pisownia nie z rzeczownikami', page: 87 },
      { lessons: '13', title: 'Co już wiesz? Co umiesz?', page: 89, texts: ['Justyna Bednarek, Wnuczka antykwariusza'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 92 },
    ],
  },
  {
    number: 3,
    title: 'Od pomysłu do działania',
    subtitle: 'Słowa w służbie przedsiębiorczości',
    items: [
      { lessons: '1', title: 'Dzień tematyczny: Światowy Tydzień Przedsiębiorczości', page: 94, texts: ['Janusz Korczak, Bankructwo małego Dżeka'] },
      { lessons: '2', title: 'Przedsiębiorczy, czyli jaki?', page: 99, texts: ['Karolina Grabarczyk, I ty możesz zmienić świat'] },
      { lessons: '3-4', title: 'Przymiotnik - król opisu', page: 102 },
      { lessons: '5', title: 'Przymiotniki w akcji - od dobrego do najlepszego', page: 106 },
      { lessons: '6', title: 'Jak stworzyć ciekawy opis przedmiotu?', page: 108 },
      { lessons: '7', title: 'Szukam, sprzedam, kupię - jak napisać ogłoszenie?', page: 110 },
      { lessons: '8', title: 'Czy wyrazy mogą mieć rodzinę?', page: 113 },
      { lessons: '9', title: 'Tajniki polskiej ortografii: pisownia ó i u', page: 115 },
      { lessons: '10', title: 'Wyturlajmy opis postaci', page: 117 },
      { lessons: '11', title: 'Co już wiesz? Co umiesz?', page: 120, texts: ['Anne-Catharina Vestly, 8+2 i domek w lesie'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 124 },
    ],
  },
  {
    number: 4,
    title: 'Nasze korzenie',
    subtitle: 'Między przeszłością a teraźniejszością',
    items: [
      { lessons: '1-2', title: 'Legendarne początki naszego państwa', page: 126, texts: ['Wanda Chotomska, Legenda o Lechu, Czechu i Rusie'] },
      { lessons: '3', title: 'Polska gościnność w domu Piasta', page: 132, texts: ['Legenda o Piaście (komiks)'] },
      { lessons: '4', title: 'Jak powstała stolica Polski?', page: 139, texts: ['Wars i Sawa'] },
      { lessons: '5', title: 'Polska - mój dom, moja ojczyzna', page: 142, texts: ['Antoni Słonimski, Polska'] },
      { lessons: '6', title: 'Do hymnu! O czym pisał Józef Wybicki?', page: 145, texts: ['Józef Wybicki, Mazurek Dąbrowskiego'] },
      { lessons: '7', title: 'Czym w dzisiejszych czasach może być patriotyzm?', page: 148, texts: ['Michał Rusinek, Coś się właśnie?'] },
      { lessons: '8', title: 'Dzień tematyczny: Międzynarodowy Dzień Praw Dziecka', page: 150, texts: ['Joanna Olech, Mam prawo i nie zawaham się go użyć!'] },
      { lessons: '9', title: 'Nie ma dzieci, są ludzie', page: 154, texts: ['Anna Czerwińska-Rydel, Po drugiej stronie okna. Opowieść o Januszu Korczaku'] },
      { lessons: '10', title: 'Tajniki polskiej ortografii: pisownia ch i h', page: 157 },
      { lessons: '11', title: 'Co już wiesz? Co umiesz?', page: 159, texts: ['Cecylia Niewiadomska, Podanie o Krakusie'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 162 },
    ],
  },
  {
    number: 5,
    title: 'Od liczby do wynalazku',
    subtitle: 'Jak działa nasz świat?',
    items: [
      { lessons: '1', title: 'Kości rzucone - piszemy własne historie', page: 164 },
      { lessons: '2', title: 'Jak znaleźć czas na to, co ważne?', page: 168, texts: ['Małgorzata Szyszko-Kondej, Gdzie ucieka czas taty? I inne ważne pytania w opowiadaniach'] },
      { lessons: '3', title: 'Jak długo trwa wieczność?', page: 171, texts: ['Julia Knop, Jak długo trwa wieczność?'] },
      { lessons: '4', title: 'I Ty możesz zostać wynalazcą', page: 174, texts: ['Catherine Thimmesh, Dziewczęta myślą o wszystkim. Genialne wynalazki genialnych kobiet', 'Soledad Romero Mariño, Szczęśliwe przypadki', 'Lisa Regan, Szkicownik szalonego wynalazcy'] },
      { lessons: '5', title: 'Dzień tematyczny: Dzień Składanki i Łamigłówki', page: 178, texts: ['Jennifer Chambliss Bertman, Złoty szyfr'] },
      { lessons: '6-7', title: 'Opis chmur, czyli o technikach malowania słowem', page: 183, texts: ['Józef Ratajczak, Obłoki'] },
      { lessons: '8', title: 'Co tu się wydarzyło? Piszemy plan szczegółowy', page: 187, texts: ['Julita Grodek, Mania, dziewczyna inna niż wszystkie. Opowieść o Marii Skłodowskiej-Curie'] },
      { lessons: '9', title: 'Tajniki polskiej ortografii: pisownia rz i ż', page: 191 },
      { lessons: '10', title: 'Przyimek - mały szef przyimków, wyrażenie przyimkowe', page: 194 },
      { lessons: '11', title: 'Co już wiesz? Co umiesz?', page: 196, texts: ['Carlina Louart, Florence Pinaud, Matematyka to wielka rzecz'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 200 },
    ],
  },
  {
    number: 6,
    title: 'Barwy kultury',
    subtitle: 'Twórcze myślenie w praktyce',
    items: [
      { lessons: '1', title: 'Podróż do świata baśni', page: 202 },
      { lessons: '2', title: 'Oznajmiam, pytam, rozkazuję - typy wypowiedzeń', page: 204 },
      { lessons: '3', title: 'Małe, ale ważne. Dlaczego bez przecinka ani rusz?', page: 206, texts: ['Elżbieta Pałasz, Przecinek'] },
      { lessons: '4', title: 'Poznaj opowieść smoka z czekoladowym sercem', page: 210, texts: ['Stephanie Burgis, Smok z czekoladowym sercem'] },
      { lessons: '5', title: 'Dawno, dawno temu... Pomówmy o cechach baśni', page: 215, texts: ['Jacob i Wilhelm Grimm, Królowa pszczół'] },
      { lessons: '6', title: 'Inny nie znaczy gorszy!', page: 219, texts: ['Hans Christian Andersen, Brzydkie kaczątko'] },
      { lessons: '7', title: 'Jak zapisać dialog?', page: 224, texts: ['Charles Perrault, Wróżki'] },
      { lessons: '8', title: 'Roszpunka - dziewczyna zamknięta w wieży', page: 229, texts: ['Jacob i Wilhelm Grimm, Roszpunka'] },
      { lessons: '9', title: 'Dzień tematyczny: Międzynarodowy Dzień Języka Ojczystego', page: 234 },
      { lessons: '10', title: 'Co już wiesz? Co umiesz?', page: 237, texts: ['Mariusz Kozubek, Co z tym smokiem?'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 240 },
    ],
  },
  {
    number: 7,
    title: 'Ścieżki wyobraźni',
    subtitle: 'Czytamy, oglądamy, tworzymy',
    items: [
      { lessons: '1', title: 'Teatralny chaos - humor i magia w utworze poetyckim', page: 242, texts: ['Marcin Brykczyński, Ale teatr!'] },
      { lessons: '2-3', title: 'Dzień tematyczny: Międzynarodowy Dzień Teatru', page: 245, texts: ['Małgorzata Strzałkowska, Suchą szosą susza szła'] },
      { lessons: '4', title: 'Miło mi zaprosić Cię na... - krótki kurs pisania zaproszeń', page: 250 },
      { lessons: '5', title: 'Czy w muzeum musi być nudno?', page: 253, texts: ['Danuta Wawiłow, Na wystawie'] },
      { lessons: '6', title: 'Świat pełen dźwięków', page: 257, texts: ['Joanna Papuzińska, Mowa Piasta'] },
      { lessons: '7-8', title: 'Smok i siódma wizyta u króla Błystka', page: 261, texts: ['Zofia Sosnkowska, Przygody kota Bibelota'] },
      { lessons: '9', title: 'Co już wiesz? Co umiesz?', page: 266, texts: ['Katarzyna Ryrych, Leon zjada późno deser w piekielnie żółtej kawiarni'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 270 },
    ],
  },
  {
    number: 8,
    title: 'W sieci możliwości',
    subtitle: 'Mapa cyfrowego świata',
    items: [
      { lessons: '1', title: 'Dzień tematyczny: Dzień Bez Komputera', page: 272, texts: ['Marc-Uwe Kling, Dzień, w którym babcia popsuła internet'] },
      { lessons: '2', title: 'Czy wszystko w internecie jest prawdą?', page: 278, texts: ['Elise Gravel, Fake newsy. Inwazja morderczych majtek', 'Adam Wierzbicki, Czy wszystko w sieci jest prawdą?'] },
      { lessons: '3', title: 'Siejmy dobro w sieci', page: 283, texts: ['Łukasz Wojtasik, #Poniedziałek'] },
      { lessons: '4', title: 'Skąd się wzięły małpy w Internecie?', page: 285, texts: ['Artur Janicki, Skąd się wzięły małpy w Internecie?'] },
      { lessons: '5', title: 'Jak napisać e-mail?', page: 289, texts: ['Zofia Staniszewska, Klub młodego biegacza, czyli jak napisać maila'] },
      { lessons: '6-7', title: 'Na tropie czasu, sposobu i miejsca, czyli detektyw Przysłówek', page: 294 },
      { lessons: '8', title: 'Dlaczego nie wszystkie znajomości z internetu są bezpieczne?', page: 298, texts: ['Justyna Bednarek, Hip, hip, kura!'] },
      { lessons: '9', title: 'Co już wiesz? Co umiesz?', page: 303, texts: ['Boguś Janiszewski, Max Skorwider, Sztuczna inteligencja. To, o czym dorośli ci nie mówią'] },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 306 },
    ],
  },
  {
    number: 9,
    title: 'Porozumienie w różnorodności',
    subtitle: 'Razem w świecie różnic',
    items: [
      { lessons: '1', title: 'Normalność, czyli co?', page: 308, texts: ['Per Nilsson, Inny niż wszyscy. Opowiadanie o chłopcu, który chce wiedzieć, czy jest normalny'] },
      { lessons: '2', title: 'Wywiad jako sposób poznawania drugiego człowieka', page: 312, texts: ['Tomasz Kwaśniewski, Jedno okno na Maroko'] },
      { lessons: '3', title: 'Słowa mają moc - jak rozpoznać i zatrzymać hejt?', page: 315, texts: ['Zuzanna Piechowicz, Maciej Sopyło, Hejt - co z nim robić?'] },
      { lessons: '4', title: 'Dzień tematyczny: Światowy Dzień Różnorodności Kulturowej', page: 319, texts: ['Izabella Kaluta, Man Zou. Chiny dla dociekliwych', 'Zofia Fabjanowska-Micyk, Banzai. Japonia dla dociekliwych'] },
      { lessons: '5', title: 'Marzenia, pragnienia, tęsknoty', page: 322, texts: ['Katherine Applegate, Drzewo życzeń'] },
      { lessons: '6', title: 'Dlaczego warto się oprzeć rówieśniczej presji?', page: 326, texts: ['Marta Ostrowska, Jak Florek został piratem'] },
      { lessons: '7', title: 'Szary domek z barwnym wnętrzem', page: 330, texts: ['Katarzyna Szestak, Szary domek'] },
      { lessons: '8', title: 'Kiedy litery tańczą przed oczami', page: 335, texts: ['Joanna M. Chmielewska, Czapka, lamy i kotomierz'] },
      { lessons: '9', title: 'Dlaczego warto dostrzegać drobne radości?', page: 340, texts: ['Katarzyna Bandewicz-Kowalczyk, Mucha'] },
      { lessons: '10', title: 'Pozdrowienia z wakacji', page: 344 },
      { lessons: '11', title: 'Co już wiesz? Co umiesz? Podsumowanie pracy w klasie IV', page: 346 },
      { lessons: 'LAB', title: 'Laboratorium projektów i doświadczeń', page: 350 },
    ],
  },
];

export type Textbook4CoverageStatus = 'jest' | 'brak-w-spisie';

export interface Textbook4RequiredTextCoverage {
  requirementId: string;
  status: Textbook4CoverageStatus;
  evidence: string;
}

/**
 * Porownanie wylacznie ze spisem tresci tomu dla klasy IV. Brak w spisie nie
 * przesadza, ze tekstu nie ma w materialach nauczyciela albo w kolejnym tomie.
 */
export const TEXTBOOK4_REQUIRED_TEXT_COVERAGE: Textbook4RequiredTextCoverage[] = [
  { requirementId: 'nowa-stala-1', status: 'brak-w-spisie', evidence: 'Brak osobnego tematu o Biblii w spisie treści tomu IV.' },
  { requirementId: 'nowa-stala-2', status: 'brak-w-spisie', evidence: 'Brak osobnego tematu o mitach greckich w spisie treści tomu IV.' },
  { requirementId: 'nowa-stala-3', status: 'jest', evidence: 'Rozdział IV: legendy polskie, s. 126-159; rozdział VI: baśnie, s. 202-237.' },
  { requirementId: 'nowa-stala-4', status: 'jest', evidence: 'Rozdział IV, temat 6: Mazurek Dąbrowskiego, s. 145.' },
  { requirementId: 'nowa-stala-5', status: 'brak-w-spisie', evidence: 'Brak osobnego tematu o Rocie w spisie treści tomu IV.' },
];
