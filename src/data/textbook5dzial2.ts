// Klasa 5, dzial 2 "Uwaga, uczucia!" (NEON, Nowa Era, s. 59-98). Mapa stron i
// uzasadnienie wyboru: docs/klasa5-dzial2-uwaga-uczucia.md.
//
// Zasady Bartka (2026-09-29): podrecznik to pomoc, nie rama. Czytamy tylko dwa
// teksty na dzial (Pisarski "Przenosnie", Januszewska "Lwy") plus krotkie
// rozgrzewki (Kulmowa, Kasdepke). Reszta to jezyk i pisanie wg mapy
// "To wiem! To potrafie!" z s. 96. Zadania z podrecznika tylko sensowne, jedno
// zadanie = jeden screen = jeden slajd, z numerem strony. Lepiej miec zapas na
// prezentacji niz go nie miec - Bartek sam decyduje, co zrobi na lekcji.
//
// Filmiki do lekcji jezykowych dopiero powstana (lekcja po lekcji). Screeny
// zadan leza w prywatnym buckecie "czytanki" jako d2-sNN-*.webp
// (wyciete skryptem tmp/dzial2/wytnij.py z rozkladowek od Bartka).

import type { Slide, StudentAction } from './types';
import { plan, recap, slideCzytanka, slideNote, slideRecap, slideText, slideTextbookImage, slideTextbookTask, slideTopic, slideVideo, type Topic } from './textbook5slides';

const DZIAL = 'Dział 2 - Uwaga, uczucia!';

type Akcja = 'zeszyt' | 'ustnie' | 'dom' | 'cwiczymy' | 'ksiazka';
const AKCJE: Record<Akcja, [StudentAction, string]> = {
  zeszyt: ['write-answer', 'Do zeszytu'],
  ustnie: ['oral', 'Ustnie'],
  dom: ['write-answer', 'Do domu'],
  cwiczymy: ['oral', 'Ćwiczymy razem'],
  ksiazka: ['textbook', 'W podręczniku'],
};

/** Screen jednego zadania z podrecznika: "Zadanie N", kod "s. 63 zad. 5" (dziala kolo K). */
function zad(plik: string, page: number, nr: string, akcja: Akcja): Slide {
  const [action, text] = AKCJE[akcja];
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} zad. ${nr}`, `Zadanie ${nr}`, action, text);
}
/** "Na rozgrzewke" z podrecznika - tez z kodem, zeby dalo sie losowac kolem. */
function rozgrzewka(plik: string, page: number, akcja: Akcja): Slide {
  const [action, text] = AKCJE[akcja];
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} rozgrzewka`, 'Na rozgrzewkę', action, text);
}
/** Ramka teorii albo tekst z podrecznika - tylko do obejrzenia i przeczytania. */
function ramka(plik: string, page: number, title: string): Slide {
  return slideTextbookImage(`czytanki:${plik}.webp`, page, title);
}

/** Zadania z podrecznika zawsze w kolejnosci z ksiazki: strona, potem numer zadania. */
function poKolei(...slides: Slide[]): Slide[] {
  const klucz = (s: Slide): [number, number] => {
    if (s.kind !== 'image') return [0, 0];
    const nr = /zad\. (\d+)/.exec(s.code ?? '');
    return [s.page ?? 0, nr ? Number(nr[1]) : 0];
  };
  return [...slides].sort((a, b) => {
    const [pa, na] = klucz(a);
    const [pb, nb] = klucz(b);
    return pa - pb || na - nb;
  });
}

const FILM_POZNIEJ = 'Film do tej lekcji jeszcze nie powstał - dopóki go nie ma, uczysz z ramki na ekranie i tablicy.';

export const DZIAL2_TOPICS: Topic[] = [
  {
    title: '17. Przenośnia - słowa nie wprost',
    dzial: DZIAL,
    topic: 'Przenośnia',
    textbookPage: 60,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji z tekstem w tym dziale. Na rozgrzewkę krótki wiersz Kulmowej „Co to jest radość?” (s. 60, 30 s) - przypomina porównanie z działu 1. Potem „Przenośnie” Pisarskiego (s. 61-62). Wiersz sam uczy przenośni: podmiot liryczny dziwi się, czemu spojrzenie bywa lodowate, a serce kamienne. Pomijamy obraz ze s. 59 i pogadanki ze s. 61 (zad. 1-2, 4-7).'],
      ['Po lekcji uczeń', [
        '- odróżnia porównanie (jak, niczym) od przenośni,',
        '- wyjaśnia znaczenie przenośni: kamienne serce, ostry język, lodowate spojrzenie,',
        '- wskazuje, kiedy wyraz jest użyty dosłownie, a kiedy w przenośni,',
        '- sam tworzy przenośnię do zdjęcia.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - pytania z podsumowania działu 1.',
        '2. **Czytanka „Co to jest radość?”** (1 min) + **s. 61 zad. 3** ustnie (3 min): do czego porównano radość? Na tablicy: „mała JAK kropelka” - to porównanie.',
        '3. **Czytanka „Przenośnie”** (2 min).',
        '4. **Ramka s. 63** (2 min) - czytacie razem.',
        '5. **Film „Przenośnia”** (9 min) - porównanie, przenośnia, test rysowania, jak odczytać i jak zrobić przenośnię. 4 zadania do zeszytu, każde od razu sprawdzone.',
        '6. **Koło z nowymi zadaniami** (5 min) - podobne do filmowych, ale inne przykłady.',
        '7. **Notatka** (4 min).',
        '8. Zadania z podręcznika w kolejności z książki - na ile starczy czasu: **s. 62 zad. 1** ustnie, **s. 64 zad. 8** - przenośnie do zdjęć.',
        '9. Zapas: s. 61 zad. 8 (własne porównania), s. 63 zad. 2, 3, 5, 6.',
        '10. **s. 64 zad. 9** - do domu: przygotowanie recytacji (szczegóły i wybór wiersza na lekcji 21).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Porównanie** zestawia dwie rzeczy i mówi to wprost słowem „jak”, „niczym”, „jakby”: oczy jak gwiazdy.',
        '- **Przenośnia** nie ma „jak”. Wyrazy razem dostają nowe znaczenie: kamienne serce to nie serce z kamienia, tylko ktoś nieczuły.',
        '- Test: czy da się to narysować dosłownie? Zielona żaba - tak. Zielono w głowie - wyjdzie bzdura, więc to przenośnia.',
        '- Karta wiersza w notatce ma zawsze ten sam układ (kto mówi, o czym, środek). Będzie wracać przy każdym wierszu, na sprawdzianie też.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 61 zad. 3** Radość mała i wielka to drobne i duże powody do szczęścia. Wielka jak furkotanie mokrych chorągwi, mała jak czerwona kropelka biedronki na tulipanie.',
        '- **s. 62 zad. 1** Lodowate spojrzenie - chłodne, nieprzyjazne. Zielono w głowie - ktoś niepoważny, beztroski. Kamienne serce - nieczuły, bez współczucia. Język ostry - mówi przykre, złośliwe rzeczy.',
        '- **s. 63 zad. 2** zielone: liście, pończoszki, ławka, skrzynka, żaby, groszek, nić, podpinka. Kamienne: skały, mury, zamki, mosty, figury. Ostre: brzytwa, kosa, igła, nóż, ciernie, nożyce, widły.',
        '- **s. 63 zad. 3** Zielona żaba i ostre nożyce - dosłownie (kolor, tnie). Zielono w głowie i ostry język - przenośnie.',
        '- **s. 63 zad. 5** Przenośnie: lawina wspomnień, huragan braw.',
        '- **s. 63 zad. 6** np. Muchomory przypominają kapelusze. Szron wygląda jak kryształy. Śnieg na choinkach jest podobny do cukru. Korzenie kojarzą się z wężami.',
        '- **s. 64 zad. 8** np. owce - wełniane chmurki na trawie; przyprawy - tęcza na straganie; dmuchawiec - puchowe spadochrony.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Porównanie czy przenośnia: „twardy jak skała”?', answer: 'Porównanie - jest słówko „jak”.' },
      { text: 'Porównanie czy przenośnia: „deszcz pytań”?', answer: 'Przenośnia - bardzo dużo pytań, a nie prawdziwy deszcz.' },
      { text: 'Dosłownie czy w przenośni: „słodki cukierek” i „słodki uśmiech”?', answer: 'Cukierek - dosłownie. Uśmiech - w przenośni: miły, uroczy.' },
      { text: 'Co znaczy „stalowe spojrzenie”? Jaka jest stal?', answer: 'Stal jest twarda i zimna - to spojrzenie surowe, nieustępliwe.' },
      { text: 'Zamień porównanie w przenośnię: „Trawa jest jak zielony dywan”.', answer: 'Zielony dywan trawy.' },
      { text: 'Kto to jest podmiot liryczny?', answer: 'Osoba, która mówi w wierszu.' },
    ],
    // Kolo po filmie = nowe, podobne zadania (nie te z filmu - te sa juz sprawdzone).
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Przenośnia'),
      ...recap(previousSetId),
      slideCzytanka('co-to-jest-radosc'),
      zad('d2-s61-zad3', 61, '3', 'ustnie'),
      slideCzytanka('przenosnie'),
      ramka('d2-s63-ramka', 63, 'Przenośnia (metafora)'),
      slideVideo('przenosnia-film1'),
      ...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 5 }] : []),
      slideNote('Przenośnia', '1. Porównanie mówi wprost słowem jak, niczym: radość mała jak kropelka.\n2. Przenośnia (metafora) - wyrazy razem mają nowe znaczenie, nie rozumiemy ich dosłownie: kamienne serce, ostry język.\n**„Przenośnie”, R. Pisarski**\n- Kto mówi? Ktoś, kto dziwi się językowi (podmiot liryczny).\n- O czym? Skąd się biorą przenośnie - bo trafiają w sedno.'),
      ...poKolei(
        zad('d2-s61-zad8', 61, '8', 'zeszyt'),
        zad('d2-s62-zad1', 62, '1', 'ustnie'),
        zad('d2-s63-zad2', 63, '2', 'zeszyt'),
        zad('d2-s63-zad3', 63, '3', 'ustnie'),
        zad('d2-s63-zad5', 63, '5', 'zeszyt'),
        zad('d2-s63-zad6', 63, '6', 'zeszyt'),
        zad('d2-s64-zad8', 64, '8', 'zeszyt'),
        zad('d2-s64-zad9', 64, '9', 'dom'),
      ),
    ],
  },
  {
    title: '18. Czuć miętę - związki frazeologiczne',
    dzial: DZIAL,
    topic: 'Związki frazeologiczne',
    textbookPage: 64,
    teacherPlan: plan(
      ['Co dziś', 'Krótka czytanka z Kasdepkego „Co to znaczy...” (s. 64-65, ok. 1 min): Bartuś bierze „czuć miętę” dosłownie i wącha dłoń Igi. Z tego wychodzimy do związków frazeologicznych - to przenośnie, które na stałe weszły do języka. Frazeologizmów nie ma na mapie działu, ale są w podstawie (II.2.5) i wracają przy pisowni ę/ą.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, czym jest związek frazeologiczny,',
        '- podaje znaczenie kilku frazeologizmów o uczuciach,',
        '- dobiera frazeologizm do nazwy uczucia i używa go w zdaniu.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - przenośnia.',
        '2. **Czytanka** (1 min), potem **s. 65 zad. 3** ustnie (4 min): co znaczy „czuć miętę” i czemu wujek się zdenerwował.',
        '3. **Slajd „Związek frazeologiczny”** (3 min) + **notatka** (5 min).',
        '4. **s. 65 zad. 4** (8 min) - serce: podbić, złamać, wziąć do serca. Słownik w telefonie albo Ty podajesz znaczenia, oni układają zdania.',
        '5. **s. 65 zad. 8** (10 min) - frazeologizm do uczucia + zdanie.',
        '6. Zapas: każdy wymyśla scenkę, w której ktoś rozumie frazeologizm dosłownie jak Bartuś.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Związek frazeologiczny** to stałe połączenie wyrazów. Razem znaczy co innego niż każdy wyraz osobno i nie wolno go zmieniać: „czuć miętę”, a nie „czuć bazylię”.',
        '- To przenośnia, która się utrwaliła - wszyscy ją znają i rozumieją tak samo.',
        '- Humor tekstu bierze się z tego, że Bartuś rozumie frazeologizm dosłownie.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 65 zad. 3** Czuć do kogoś miętę - podkochiwać się. Wujek się zdenerwował, bo Bartuś zdradził przy Idze jego uczucia (i jeszcze wąchał jej dłoń).',
        '- **s. 65 zad. 4** Podbić czyjeś serce - zdobyć czyjąś miłość. Złamać komuś serce - zawieść w miłości, bardzo zranić. Wziąć sobie coś do serca - bardzo się czymś przejąć.',
        '- **s. 65 zad. 8** Chcieć zapaść się pod ziemię - wstyd. Włosy stanęły dęba - strach. Patrzeć przez różowe okulary - szczęście. Wszystko się w nim gotuje - złość.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest związek frazeologiczny?', answer: 'Stałe połączenie wyrazów, które razem znaczy co innego niż każdy wyraz osobno.' },
      { text: 'Co znaczy „zrobić się czerwonym jak burak”?', answer: 'Zarumienić się ze wstydu albo zakłopotania.' },
      { text: 'Co znaczy „mieć zielono w głowie”?', answer: 'Być niepoważnym, beztroskim.' },
      { text: 'Co znaczy „złamać komuś serce”?', answer: 'Zawieść kogoś w miłości, bardzo go zranić.' },
      { text: 'Jakie uczucie opisuje „wszystko się w nim gotuje”?', answer: 'Złość.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Związki frazeologiczne'),
      ...recap(previousSetId),
      slideCzytanka('co-to-znaczy'),
      zad('d2-s65-zad3', 65, '3', 'ustnie'),
      slideText('Związek frazeologiczny', '**Związek frazeologiczny** to stałe połączenie wyrazów. Razem znaczy co innego niż każdy wyraz osobno.\n\n- czuć do kogoś miętę = podkochiwać się,\n- czerwony jak burak = zawstydzony,\n- mieć zielono w głowie = być niepoważnym.\n\nNie zmieniamy w nim wyrazów i nie rozumiemy go dosłownie - inaczej wyjdzie jak u Bartusia.'),
      slideNote('Związki frazeologiczne', '1. Związek frazeologiczny - stałe połączenie wyrazów o przenośnym znaczeniu.\n2. Nie zmieniam w nim wyrazów i nie rozumiem go dosłownie.\n3. Czuć miętę - podkochiwać się. Włosy stanęły dęba - strach. Chcieć zapaść się pod ziemię - wstyd.'),
      zad('d2-s65-zad4', 65, '4', 'zeszyt'),
      zad('d2-s65-zad8', 65, '8', 'zeszyt'),
    ],
  },
  {
    title: '19. Wyrazy nacechowane emocjonalnie',
    dzial: DZIAL,
    topic: 'Zdrobnienia i zgrubienia',
    textbookPage: 74,
    teacherPlan: plan(
      ['Co dziś', `Lekcja językowa bez tekstu (s. 74 + zad. 7 ze s. 65). Wyrazy neutralne i nacechowane, zdrobnienia i zgrubienia, a do tego stopniowanie siły uczuć (niepokój - strach - groza). ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- odróżnia wyraz neutralny od nacechowanego emocjonalnie,',
        '- tworzy zdrobnienie i zgrubienie od podanego wyrazu,',
        '- porządkuje nazwy uczuć od najsłabszego do najsilniejszego.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - frazeologizmy.',
        '2. **s. 74 zad. 1** ustnie (3 min) - mama czy mamusia? Kiedy mówimy które?',
        '3. **Ramka s. 74** (4 min) + **notatka** (5 min).',
        '4. **s. 65 zad. 7** (8 min) - uczucia od najsłabszego do najsilniejszego.',
        '5. **s. 74 zad. 2** (8 min) - tabela brzuch, but, pies. Dopisz jeszcze dom i nos.',
        '6. **s. 74 zad. 3** - do domu: opis lubianej osoby ze zdrobnieniami.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Neutralny** = sama nazwa, bez uczuć: kot, pies, nos.',
        '- **Zdrobnienie** - coś małego albo czule: kotek, piesek, nosek. **Zgrubienie** - coś dużego, żartem albo pogardliwie: kocur, psisko, nochal.',
        '- Ten sam pies: „piesek” mówi, że go lubię, „psisko” - że jest wielki albo mnie denerwuje. Wybór słowa zdradza emocje.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 74 zad. 1** Wyrazy z prawej są czułe - używamy ich w rozmowie z bliskimi, z dziećmi.',
        '- **s. 74 zad. 2** brzuszek - brzuch - brzuchol / brzuszysko; bucik - but - buciór / butas; piesek - pies - psisko.',
        '- **s. 65 zad. 7** niepokój, strach, groza; zadowolenie, radość, euforia; przygnębienie, żal, rozpacz (żal i przygnębienie można zamienić - ważne, że rozpacz na końcu).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Czym różni się wyraz neutralny od nacechowanego emocjonalnie?', answer: 'Neutralny tylko nazywa, nacechowany wyraża też uczucia i stosunek mówiącego.' },
      { text: 'Podaj zdrobnienie od wyrazu „kot”.', answer: 'Np. kotek, koteczek.' },
      { text: 'Podaj zgrubienie od wyrazu „nos”.', answer: 'Np. nochal, nosisko.' },
      { text: 'Które uczucie jest silniejsze: radość czy euforia?', answer: 'Euforia.' },
      { text: 'Kiedy najczęściej używamy zdrobnień?', answer: 'Gdy mówimy czule - do małych dzieci, bliskich, zwierząt.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Zdrobnienia i zgrubienia'),
      ...recap(previousSetId),
      zad('d2-s74-zad1', 74, '1', 'ustnie'),
      ramka('d2-s74-ramka', 74, 'Wyrazy neutralne i nacechowane emocjonalnie'),
      slideNote('Zdrobnienia i zgrubienia', '1. Wyraz neutralny tylko nazywa: pies, nos.\n2. Wyraz nacechowany emocjonalnie wyraża uczucia:\n- zdrobnienie - coś małego albo czule: piesek, nosek,\n- zgrubienie - coś dużego, żartem albo pogardliwie: psisko, nochal.\n3. Uczucia mają siłę: niepokój - strach - groza.'),
      ...poKolei(
        zad('d2-s65-zad7', 65, '7', 'zeszyt'),
        zad('d2-s74-zad2', 74, '2', 'zeszyt'),
        zad('d2-s74-zad3', 74, '3', 'dom'),
      ),
    ],
  },
  {
    title: '20. „Lwy” - co robić ze złością?',
    dzial: DZIAL,
    topic: 'Co robić ze złością?',
    textbookPage: 81,
    teacherPlan: plan(
      ['Co dziś', 'Druga lekcja z tekstem: wiersz Hanny Januszewskiej „Lwy” (s. 81-82). Chłopiec jest zły i w wyobraźni idzie ze lwami, aż złość gaśnie razem ze słońcem. Mama przyznaje, że też czasem chce spotkać lwa. Rozmawiamy krótko o wierszu, a potem o tym, co z tego ma zostać w życiu: ramka „Wśród ludzi” (s. 83) - sposoby na złość. Wiersz będzie też do wyboru na recytację. Pomijamy Onichimowską i Gawryluk (s. 70-81).'],
      ['Po lekcji uczeń', [
        '- wskazuje podmiot liryczny i nastrój wiersza,',
        '- wyjaśnia, co w wierszu znaczą lwy,',
        '- porządkuje nazwy emocji według siły,',
        '- zna kilka sposobów radzenia sobie ze złością.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - zdrobnienia i zgrubienia.',
        '2. **Czytanka „Lwy”** (2 min).',
        '3. **s. 83 zad. 1, 2, 4** ustnie (8 min) - koło losuje, kto odpowiada.',
        '4. **s. 83 zad. 5** (3 min) - złość, zdenerwowanie, wściekłość.',
        '5. **Ramka „Wśród ludzi”** (5 min) - czytają na zmianę. Na koniec pytanie z ramki: jakie są wasze sposoby?',
        '6. **Notatka** - karta wiersza + sposoby na złość (6 min).',
        '7. Zapas: **zad. 6** - przeczytaj zwrotkę tak, żeby było słychać złość, a potem spokój (wstęp do recytacji).',
        '8. **s. 83 zad. 8** ustnie (4 min).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **zad. 1** Zaciska pięści, trzaska drzwiami, wychodzi bez słowa, jest zjeżony, warczy.',
        '- **zad. 2** Lwy są groźne, silne i drapieżne - takie jak jego złość. Przy nich czuje się silny.',
        '- **zad. 4** Mama nie krzyczy ani nie robi wyrzutów. Rozumie syna i przyznaje, że sama bywa zła - rozmawia z nim jak z równym.',
        '- **zad. 5** zdenerwowanie, złość, wściekłość.',
      ].join('\n')],
      ['Jak wyjaśnić', 'Lwy to złość chłopca pokazana jako zwierzęta. Idą z nim, warczą, aż wieczorem odchodzą w niebo - złość mija sama, kiedy da się jej czas i ruch. Karta wiersza w notatce ma ten sam układ co przy „Przenośniach”.'],
    ),
    questions: [
      { text: 'Kto jest podmiotem lirycznym w wierszu „Lwy”?', answer: 'Chłopiec, który jest zły.' },
      { text: 'Co w wierszu znaczą lwy?', answer: 'Złość chłopca - są groźne i drapieżne jak ona.' },
      { text: 'Kiedy chłopcu przechodzi złość?', answer: 'Wieczorem, gdy lwy odchodzą ze słońcem - robi się cisza i spokój.' },
      { text: 'Co mama powiedziała na końcu wiersza?', answer: 'Że ona też czasem jest zła i wtedy chce spotkać lwa.' },
      { text: 'Podaj dwa dobre sposoby radzenia sobie ze złością.', answer: 'Np. powiedzieć, co mnie złości; ruch (bieganie); głęboki oddech i liczenie do dziesięciu; przeprosić, jeśli kogoś zraniłem.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Co robić ze złością?'),
      ...recap(previousSetId),
      slideCzytanka('lwy'),
      zad('d2-s83-zad1', 83, '1', 'ustnie'),
      zad('d2-s83-zad2', 83, '2', 'ustnie'),
      zad('d2-s83-zad4', 83, '4', 'ustnie'),
      zad('d2-s83-zad5', 83, '5', 'zeszyt'),
      ramka('d2-s83-wsrod-ludzi', 83, 'Wśród ludzi - co robić ze złością?'),
      slideNote('Co robić ze złością?', '**„Lwy”, H. Januszewska**\n- Kto mówi? Chłopiec, który jest zły (podmiot liryczny).\n- O czym? W wyobraźni idzie ze lwami, aż złość mija. Mama też bywa zła.\n- Nastrój: od złości do spokoju.\n**Sposoby na złość:** powiedz, co cię złości; rusz się; weź oddech i policz do 10; przeproś, jeśli kogoś zraniłeś.'),
      zad('d2-s83-zad6', 83, '6', 'ustnie'),
      zad('d2-s83-zad8', 83, '8', 'ustnie'),
    ],
  },
  {
    title: '21. Jak recytować wiersz?',
    dzial: DZIAL,
    topic: 'Jak recytować?',
    textbookPage: 90,
    teacherPlan: plan(
      ['Co dziś', `Lekcja praktyczna (s. 90-92). Jak przygotować recytację, wzór z uwagami („W lesie” Gellner), ćwiczenia oddechu, łamańce językowe i jedno zdanie z różnymi emocjami. Na koniec zadajesz recytację na ocenę: „Lwy” albo „Przenośnie” do wyboru. W 5a jest 14 osób - zaliczasz po 3-4 na początku kolejnych lekcji. Ćwiczenia dykcji ze s. 92 zad. 2 (nadymanie policzków, kląskanie) pominięte. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- wie, jak krok po kroku przygotować recytację,',
        '- stosuje pauzę, zmianę tempa i siły głosu,',
        '- wypowiada to samo zdanie z różnymi emocjami.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - „Lwy” i sposoby na złość.',
        '2. **Ramka s. 90** (4 min) i **wzór s. 91** (5 min) - czytasz „W lesie” dwa razy: płasko i według uwag. Pytasz, co się zmieniło.',
        '3. **Notatka** (4 min).',
        '4. **s. 91 zad. 1** - oddech, wszyscy na stojąco (3 min).',
        '5. **s. 92 zad. 3** - łamańce (8 min). Koło losuje, kto czyta; kto się pomyli, próbuje jeszcze raz.',
        '6. **s. 92 zad. 4** - „Czyżyk toczy kuleczkę” z czterema emocjami (6 min).',
        '7. **Recytacja na ocenę** (5 min) - wybór wiersza, termin, zasady oceny.',
      ].join('\n')],
      ['Ocena recytacji', 'Proponowane kryteria (po 1 pkt): znajomość tekstu, wyraźna wymowa, pauzy i tempo, głos oddaje nastrój, postawa i kontakt ze słuchaczami. Ocena trafia do kategorii „dyktanda/projekty/recytacja”.'],
    ),
    questions: [
      { text: 'Co to jest recytacja?', answer: 'Wygłaszanie tekstu z pamięci (albo staranne czytanie) tak, żeby głosem oddać jego sens i nastrój.' },
      { text: 'Gdzie robimy pauzy w recytacji?', answer: 'Przy znakach interpunkcyjnych, na końcu myśli, przed ważnym słowem.' },
      { text: 'Jak głosem pokazać pytanie?', answer: 'Podnieść głos na końcu zdania.' },
      { text: 'Po co ćwiczymy oddech przed recytacją?', answer: 'Żeby starczyło powietrza na cały wers i żeby głos się nie łamał.' },
      { text: 'Gdzie patrzymy, kiedy recytujemy?', answer: 'Na słuchaczy albo nieco ponad ich głowami.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Jak recytować?'),
      ...recap(previousSetId),
      ramka('d2-s90-ramka', 90, 'Jak przygotować się do recytacji?'),
      ramka('d2-s91-wzor', 91, 'Wzór: „W lesie” z uwagami'),
      slideNote('Jak recytować?', '1. Recytacja - wygłaszanie tekstu z pamięci tak, by głosem oddać jego nastrój.\n2. Czytam ze zrozumieniem: kto mówi, jakie są emocje.\n3. Zaznaczam pauzy, ważne słowa (głośniej), tempo.\n4. Ćwiczę na głos, mówię wyraźnie, patrzę na słuchaczy.'),
      zad('d2-s91-zad1', 91, '1', 'cwiczymy'),
      zad('d2-s92-zad3', 92, '3', 'ustnie'),
      zad('d2-s92-zad4', 92, '4', 'ustnie'),
      slideText('Recytacja na ocenę', 'Naucz się na pamięć jednego wiersza:\n\n- **„Lwy”** Hanny Januszewskiej (s. 81-82) albo\n- **„Przenośnie”** Romana Pisarskiego (s. 61-62).\n\nOceniam: znajomość tekstu, wyraźną wymowę, pauzy i tempo, nastrój w głosie, postawę.\n\nZaliczamy na początku lekcji, po kilka osób.'),
    ],
  },
  {
    title: '22. Rzeczownik - przypadki, własne i pospolite',
    dzial: DZIAL,
    topic: 'Co już wiemy o rzeczowniku?',
    textbookPage: 75,
    teacherPlan: plan(
      ['Co dziś', `Powtórka z klasy 4 (s. 75-77): czym jest rzeczownik, liczba, przypadki, rodzaj, rzeczowniki własne i pospolite. Najwięcej czasu na przypadki - bez nich nie ruszy nietypowa odmiana ani pisownia ę/ą. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- zadaje pytania przypadków i odmienia rzeczownik,',
        '- określa rodzaj rzeczownika (także w liczbie mnogiej),',
        '- odróżnia rzeczownik własny od pospolitego i pisze go właściwą literą.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - recytacja.',
        '2. **Na rozgrzewkę s. 75** ustnie (3 min).',
        '3. **Ramka s. 75** (5 min) - tabela przypadków. Każdy przypadek pytaniem i „pomocnikiem”: nie ma, przyglądam się, widzę, idę z, mówię o.',
        '4. **Ramka s. 76** (2 min) - własne i pospolite.',
        '5. **Notatka** (6 min).',
        '6. **s. 76 zad. 1** (10 min) - czat: forma + przypadek + liczba.',
        '7. **s. 77 zad. 1 i 2** (8 min).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **Rozgrzewka** siostra (kto? ż.), kolega (kto? m.), pisklę (kto? co? n.), drzewo (co? n.), smutek (co? m.), przyjaciółka (kto? ż.).',
        '- **s. 76 zad. 1** do kina (D. lp.), od mamy (D. lp.), dwa bilety (B. lm.), Olu (W. lp.), o której godzinie (Ms. lp.), przed zawodami (N. lm.), zajęć (D. lm.), 110 minut (D. lm.), w sobotę (B. lp.), z grami (N. lm.).',
        '- **s. 77 zad. 1** Europie Środkowej, Niemcami, Czechami, Ukrainą, Polska, Bałtyku, Karpat, Sudetów, Wisła, Odra.',
        '- **s. 77 zad. 2** np. Kraków, Bolesław Chrobry, „Hobbit”, Giewont, Wisła, Polska.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Na jakie pytania odpowiada dopełniacz?', answer: 'Kogo? Czego? (nie ma).' },
      { text: 'W jakim przypadku jest „z kotem”?', answer: 'W narzędniku (z kim? z czym?).' },
      { text: 'Jakiego rodzaju jest rzeczownik „koty”? Jak to sprawdzić?', answer: 'Męskiego - zmieniam na lp.: ten kot.' },
      { text: 'Podaj rzeczownik własny do pospolitego „rzeka”.', answer: 'Np. Wisła, Odra, Warta.' },
      { text: 'Dlaczego „Hobbit” piszemy wielką literą?', answer: 'Bo to tytuł - rzeczownik własny.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Co już wiemy o rzeczowniku?'),
      ...recap(previousSetId),
      rozgrzewka('d2-s75-rozgrzewka', 75, 'ustnie'),
      ramka('d2-s75-ramka', 75, 'Rzeczownik - przypomnienie'),
      ramka('d2-s76-ramka', 76, 'Rzeczowniki własne i pospolite'),
      slideNote('Co już wiemy o rzeczowniku?', '1. Rzeczownik: kto? co? - osoby, rzeczy, zwierzęta, rośliny, zjawiska, uczucia.\n2. Odmienia się przez liczby i przypadki: M. kto? co?, D. kogo? czego?, C. komu? czemu?, B. kogo? co?, N. z kim? z czym?, Ms. o kim? o czym?, W. o!\n3. Rodzaj: ten, ta, to. W lm. sprawdzam w lp.: koty - ten kot.\n4. Własne wielką literą (Wisła, Wawel), pospolite małą (rzeka, zamek).'),
      zad('d2-s76-zad1', 76, '1', 'zeszyt'),
      zad('d2-s77-zad1', 77, '1', 'ustnie'),
      zad('d2-s77-zad2', 77, '2', 'zeszyt'),
    ],
  },
  {
    title: '23. Rzeczowniki o nietypowej odmianie',
    dzial: DZIAL,
    topic: 'Nietypowa odmiana rzeczowników',
    textbookPage: 77,
    teacherPlan: plan(
      ['Co dziś', `Trzy grupy „dziwnych” rzeczowników (s. 77-78): na -um (muzeum - w lp. się nie odmienia), tylko liczba pojedyncza (odzież, powietrze) i tylko mnoga (drzwi, nożyczki, okulary). Do tego liczebniki zbiorowe: jedne drzwi, dwoje drzwi. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- poprawnie odmienia rzeczowniki na -um,',
        '- podaje rzeczowniki, które mają tylko jedną liczbę,',
        '- mówi poprawnie: jedne drzwi, dwoje nożyczek, para spodni.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - przypadki, własne i pospolite.',
        '2. **Na rozgrzewkę s. 77** (4 min) - muzeum w każdej luce. Ile różnych form? Jedna!',
        '3. **Ramki s. 77 i 78** (6 min).',
        '4. **Notatka** (5 min).',
        '5. **s. 78 zad. 1** (6 min), **zad. 2** (3 min), **zad. 3** (6 min), **zad. 4** (5 min).',
      ].join('\n')],
      ['Jak wyjaśnić', 'Najczęstszy błąd: „w muzeumie”, „do muzeumu”. W liczbie pojedynczej muzeum się nie zmienia - zmienia się dopiero w mnogiej: muzea, muzeów, w muzeach. Przy rzeczownikach tylko w lm. pytaj: ile sztuk? Jedne drzwi (jedna sztuka), dwoje drzwi, troje nożyczek.'],
      ['Odpowiedzi', [
        '- **Rozgrzewka** o muzeum, muzeum Piernika, do muzeum, Muzeum Podróżników - w lp. jest tylko jedna forma.',
        '- **zad. 1** w jednym z największych oceanariów, mnóstwo akwariów, do dwóch centrów handlowych, planetarium.',
        '- **zad. 2** jedne nożyczki, dwoje nożyczek.',
        '- **zad. 3** grabi, ferii, parę okularów, obcęgów.',
        '- **zad. 4** młodzieży, odzieżą, biżuterię.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Jak poprawnie: „w muzeumie” czy „w muzeum”?', answer: 'W muzeum - w lp. rzeczowniki na -um się nie odmieniają.' },
      { text: 'Podaj dopełniacz liczby mnogiej od „muzeum”.', answer: 'Muzeów.' },
      { text: 'Podaj dwa rzeczowniki, które mają tylko liczbę mnogą.', answer: 'Np. drzwi, sanie, nożyczki, okulary, spodnie, wakacje, imieniny.' },
      { text: 'Podaj dwa rzeczowniki, które mają tylko liczbę pojedynczą.', answer: 'Np. powietrze, zazdrość, ludzkość, odzież, młodzież.' },
      { text: 'Jak powiesz o trzech parach nożyczek?', answer: 'Troje nożyczek.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Nietypowa odmiana rzeczowników'),
      ...recap(previousSetId),
      rozgrzewka('d2-s77-rozgrzewka', 77, 'ustnie'),
      ramka('d2-s77-ramka', 77, 'Rzeczowniki zakończone na -um'),
      ramka('d2-s78-ramka', 78, 'Tylko liczba pojedyncza albo tylko mnoga'),
      slideNote('Nietypowa odmiana rzeczowników', '1. Rzeczowniki nijakie na -um w lp. się nie odmieniają: to muzeum, w muzeum. Odmieniam je w lm.: muzea, muzeów, w muzeach.\n2. Tylko lp.: powietrze, zazdrość, odzież.\n3. Tylko lm.: drzwi, sanie, nożyczki, okulary, wakacje.\n4. Jedne drzwi, dwoje drzwi, para spodni.'),
      zad('d2-s78-zad1', 78, '1', 'ustnie'),
      zad('d2-s78-zad2', 78, '2', 'zeszyt'),
      zad('d2-s78-zad3', 78, '3', 'zeszyt'),
      zad('d2-s78-zad4', 78, '4', 'zeszyt'),
    ],
  },
  {
    title: '24. Ę i ą na końcu wyrazu',
    dzial: DZIAL,
    topic: 'Ę i ą na końcu wyrazu',
    textbookPage: 84,
    teacherPlan: plan(
      ['Co dziś', `Ortografia (s. 84-87) oparta na przypadkach z dwóch poprzednich lekcji: widzę kogo? co? - mamę (ę), idę z kim? z czym? - z mamą (ą). Do tego czasowniki: ja piszę - oni piszą. Plansza ze s. 86-87 ma rymowanki - dobre do zapamiętania, i frazeologizmy - wracają z lekcji 18. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- pisze -ę w bierniku rzeczowników żeńskich, w nazwach małych istot i w 1. osobie czasownika,',
        '- pisze -ą w narzędniku rzeczowników żeńskich i w 3. osobie lm. czasownika,',
        '- pamięta wyjątki: wiem, jem, umiem, rozumiem.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - nietypowa odmiana.',
        '2. **Na rozgrzewkę s. 84** ustnie (3 min).',
        '3. **Ramki s. 84 i 85** (6 min) - każdą regułę sprawdzasz pytaniem przypadku.',
        '4. **Plansza s. 86-87** (3 min) - czytacie rymowanki z ramek po bokach.',
        '5. **Notatka** (5 min).',
        '6. Zadania po kolei z podręcznika: **s. 84 zad. 1** (4 min), zad. 2 (zapas), **s. 85 zad. 3** (4 min), **zad. 4** (3 min), **s. 86 zad. 1** - frazeologizmy z planszy (7 min), s. 86 zad. 2 i s. 87 zad. 3 (zapas).',
      ].join('\n')],
      ['Jak wyjaśnić', 'Nie słychać, więc trzeba zapytać: **widzę kogo? co?** - ę (mamę, tęczę); **z kim? z czym?** - ą (z mamą, łyżką). Czasownik: **ja** - ę (robię), **oni** - ą (robią). Rymowanka z planszy: „Z kim? Z dziewczyną. Czym? Łyżką. W narzędniku stawiam ą”.'],
      ['Odpowiedzi', [
        '- **Rozgrzewka** siatkę, szparę, odwiedzę, przynoszę - wszystkie na ę.',
        '- **s. 84 zad. 1** mamę, listę, pracę, kocię.',
        '- **s. 84 zad. 2** odjadę - przyjadę, leżę - wstanę, zepsuję - naprawię, czyszczę - brudzę.',
        '- **s. 85 zad. 3** z niebieską parasolką, z porcelanową filiżanką, z kwaśną śmietaną (ą); ulubioną kolorową czapkę (ą, ę).',
        '- **s. 85 zad. 4** lubią, przygotowują, dokarmiają.',
        '- **s. 86 zad. 1** kulą u nogi - być ciężarem; kamień w wodę - zaginąć bez śladu; koń pod górę - niepotrzebnie komplikować; mysz pod miotłą - siedzieć cicho; gdzie raki zimują - dać nauczkę; beczkę soli - wiele wspólnie przeżyć.',
        '- **s. 86 zad. 2** kocię, niemowlę, pisklę, szczenię, źrebię.',
        '- **s. 87 zad. 3** rzeczowniki -ę: mamę, tęczę; -ą: dziewczyną, łyżką, panią. Czasowniki -ę: śpię, mówię, słyszę, czuję, pasuję; -ą: krzyczą, milczą, są, mają, chodzą.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Uzupełnij: Widzę (mama). Jaką literą kończy się wyraz?', answer: 'Mamę - na ę (biernik: widzę kogo? co?).' },
      { text: 'Uzupełnij: Idę z (koleżanka).', answer: 'Z koleżanką - na ą (narzędnik: z kim? z czym?).' },
      { text: 'Jak napiszesz: oni (czytać)?', answer: 'Czytają - na ą.' },
      { text: 'Jak nazywa się młody kot? Jak to napiszesz?', answer: 'Kocię - na ę, bo to nazwa małej istoty.' },
      { text: 'Dlaczego piszemy „rozumiem”, a nie „rozumię”?', answer: 'To wyjątek: wiem, jem, umiem, rozumiem - piszemy i mówimy „em”.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Ę i ą na końcu wyrazu'),
      ...recap(previousSetId),
      rozgrzewka('d2-s84-rozgrzewka', 84, 'ustnie'),
      ramka('d2-s84-ramka', 84, 'Kiedy piszemy ę?'),
      ramka('d2-s85-ramka', 85, 'Kiedy piszemy ą?'),
      ramka('d2-s86-87-plansza', 86, 'Plansza - rymowanki i frazeologizmy'),
      slideNote('Ę i ą na końcu wyrazu', '**-ę:** widzę kogo? co? - mamę, tęczę; małe istoty - kocię, źrebię; ja - piszę, zrobię.\n**-ą:** z kim? z czym? - z mamą, łyżką; oni - piszą, zrobią.\n**Wyjątki:** wiem, jem, umiem, rozumiem.'),
      ...poKolei(
        zad('d2-s84-zad1', 84, '1', 'zeszyt'),
        zad('d2-s84-zad2', 84, '2', 'zeszyt'),
        zad('d2-s85-zad3', 85, '3', 'zeszyt'),
        zad('d2-s85-zad4', 85, '4', 'zeszyt'),
        zad('d2-s86-zad1', 86, '1', 'zeszyt'),
        zad('d2-s86-zad2', 86, '2', 'zeszyt'),
        zad('d2-s87-zad3', 87, '3', 'zeszyt'),
      ),
    ],
  },
  {
    title: '25. Temat i końcówka - dlaczego stół przez ó?',
    dzial: DZIAL,
    topic: 'Temat i końcówka',
    textbookPage: 88,
    teacherPlan: plan(
      ['Co dziś', `**Lekcja opcjonalna.** Tematu, końcówki i oboczności nie ma w podstawie programowej z 2024 r. W podręczniku (s. 88-89) są w ramce falistej z ikoną - treść dodatkowa. Warto ją zrobić tylko po to, żeby dzieci rozumiały ó wymienne: stół, bo stołu. Jeśli brakuje czasu - pomiń. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- oddziela temat od końcówki,',
        '- rozpoznaje końcówkę zerową,',
        '- wskazuje oboczność i wykorzystuje ją do pisowni ó (stół - stołu, wóz - wozy).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - ę i ą.',
        '2. **Na rozgrzewkę s. 88** (5 min) - róża w różnych formach. Co się zmienia, co zostaje?',
        '3. **Ramka s. 88** (4 min) - temat i końcówka, końcówka zerowa.',
        '4. **Ramka s. 89** (4 min) - oboczności. Zatrzymaj się na ó : o.',
        '5. **Notatka** (5 min).',
        '6. **s. 88 zad. 1** (5 min), **s. 89 zad. 3** (6 min), **zad. 4** (3 min), **zad. 5** (6 min).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **Rozgrzewka** róża, róży, różą, różę, róży, różo - temat róż- się nie zmienia, zmieniają się końcówki.',
        '- **s. 88 zad. 1** mam|a, mam|y, mam|ę; krzesł|o, krzesł|a, krzesł|u; kwiat|ø, kwiat|u, kwiat|em.',
        '- **s. 89 zad. 3** maluj|ę, maluj|esz, maluj|e, maluj|emy, maluj|ecie, maluj|ą.',
        '- **s. 89 zad. 4** lód - lodu (ó : o), półka - półce (k : c), szafa - szafie (f : miękkie f).',
        '- **s. 89 zad. 5** wóz, wozu, wozowi, Wóz, wozem, wozie. Tematy: wóz-, woz-, woź-. Oboczności: ó : o, z : ź.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest temat wyrazu?', answer: 'Część wyrazu, która zostaje po odcięciu końcówki i nie zmienia się w odmianie.' },
      { text: 'Co to jest końcówka zerowa? Podaj przykład.', answer: 'Brak końcówki - cały wyraz jest tematem, np. brat|ø, stół|ø.' },
      { text: 'Oddziel końcówkę od tematu: kwiatem.', answer: 'kwiat|em.' },
      { text: 'Jaka oboczność jest w parze „noga - nodze”?', answer: 'g : dz.' },
      { text: 'Dlaczego „lód” piszemy przez ó?', answer: 'Bo w innych formach ó wymienia się na o: lodu, lody.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Temat i końcówka'),
      ...recap(previousSetId),
      rozgrzewka('d2-s88-rozgrzewka', 88, 'zeszyt'),
      ramka('d2-s88-ramka', 88, 'Temat i końcówka'),
      ramka('d2-s89-ramka', 89, 'Oboczności'),
      slideNote('Temat i końcówka', '1. Temat - część, która się nie zmienia; końcówka - zmienia się w odmianie: tablic|a, tablic|y.\n2. Końcówka zerowa (ø), gdy jej nie ma: brat|ø, stół|ø.\n3. Oboczność - wymiana głosek w temacie: stół - stołu (ó : o), ręka - ręce (k : c).\n4. Piszę ó, gdy wymienia się na o: stół - stoły, wóz - wozy.'),
      zad('d2-s88-zad1', 88, '1', 'zeszyt'),
      zad('d2-s89-zad3', 89, '3', 'zeszyt'),
      zad('d2-s89-zad4', 89, '4', 'ustnie'),
      zad('d2-s89-zad5', 89, '5', 'zeszyt'),
    ],
  },
  {
    title: '26. Jak napisać sprawozdanie?',
    dzial: DZIAL,
    topic: 'Sprawozdanie',
    textbookPage: 66,
    teacherPlan: plan(
      ['Co dziś', `Nowa forma wypowiedzi (s. 66-68). Czym jest sprawozdanie, z czego się składa, przydatne słowa, wzór z Centrum Nauki Kopernik. Ćwiczymy na tekście o Sandomierzu i planie wycieczki do Krakowa. Pisanie całego sprawozdania - na następnej lekcji. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- wie, czym sprawozdanie różni się od opowiadania,',
        '- zna trzy części sprawozdania i pytania wstępu,',
        '- odrzuca wydarzenia mało ważne,',
        '- układa plan sprawozdania.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min).',
        '2. **Ramka s. 66** (5 min) - definicja, jak pisać, przydatne słowa.',
        '3. **Wzór s. 67** (4 min) - pokazujesz strzałki: kto? co? kiedy? gdzie? dlaczego? jak? opinia.',
        '4. **Notatka** (5 min).',
        '5. **s. 67 zad. 1** (8 min) - czytacie tekst, odpowiedzi ustnie z koła.',
        '6. **s. 68 zad. 3** (4 min) - wyrazy bliskoznaczne do iść, oglądać, opowiadać.',
        '7. **s. 68 zad. 4** (5 min) - co zbędne na wycieczce do Łańcuta.',
        '8. **s. 68 zad. 5** (8 min) - plan wycieczki do Krakowa ze zdjęć.',
      ].join('\n')],
      ['Jak wyjaśnić', 'Sprawozdanie to opowiadanie „na serio”: tylko prawdziwe fakty, po kolei, bez fantazji i bez dialogów. Opinia jest dopiero w zakończeniu - jedno, dwa zdania.'],
      ['Odpowiedzi', [
        '- **s. 67 zad. 1** Uczestnicy: autorka, brat, rodzice. Kiedy i gdzie: 1 czerwca 2018 r., Sandomierz. Przebieg: zamek (Muzeum Okręgowe), bazylika katedralna, Dom Jana Długosza, spacer po rynku, trasa podziemna. Wrażenia: bardzo się podobało, chce wrócić na turniej rycerski.',
        '- **s. 68 zad. 3** iść - maszerować, udać się, kroczyć; oglądać - podziwiać, zwiedzać, przyglądać się; opowiadać - relacjonować, mówić, opisywać.',
        '- **s. 68 zad. 4** opinia o zupie, rozmowa o najpiękniejszych kwiatach, prośba mamy o wyniesienie śmieci.',
        '- **s. 68 zad. 5** np. 1. Wyjazd do Krakowa. 2. Barbakan. 3. Rynek: Sukiennice i kościół Mariacki. 4. Wawel. 5. Smocza Jama. 6. Powrót.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest sprawozdanie?', answer: 'Krótka, rzeczowa relacja z wydarzenia, w którym się uczestniczyło.' },
      { text: 'Na jakie pytania odpowiada wstęp sprawozdania?', answer: 'Kto? Co? Kiedy? Gdzie? Dlaczego?' },
      { text: 'Podaj trzy wyrazy, które pokazują kolejność zdarzeń.', answer: 'Np. najpierw, następnie, potem, później, na koniec.' },
      { text: 'Czym sprawozdanie różni się od opowiadania?', answer: 'Opisuje tylko prawdziwe fakty, rzeczowo, bez fantazji i dialogów.' },
      { text: 'Co piszemy w zakończeniu sprawozdania?', answer: 'Krótką opinię o wydarzeniu.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Sprawozdanie'),
      ...recap(previousSetId),
      ramka('d2-s66-ramka', 66, 'Jak napisać sprawozdanie?'),
      ramka('d2-s67-wzor', 67, 'Wzór sprawozdania'),
      slideNote('Sprawozdanie', '1. Sprawozdanie - krótka, rzeczowa relacja z wydarzenia, w którym brałem udział.\n2. Wstęp: kto? co? kiedy? gdzie? dlaczego?\n3. Rozwinięcie: jak przebiegało - po kolei (najpierw, następnie, na koniec).\n4. Zakończenie: krótka opinia.\n5. Tylko fakty, czas przeszły, tytuł.'),
      ...poKolei(
        zad('d2-s67-zad1', 67, '1', 'ustnie'),
        zad('d2-s68-zad3', 68, '3', 'zeszyt'),
        zad('d2-s68-zad4', 68, '4', 'zeszyt'),
        zad('d2-s68-zad5', 68, '5', 'zeszyt'),
      ),
    ],
  },
  {
    title: '27. Piszemy sprawozdanie. Dwukropek',
    dzial: DZIAL,
    topic: 'Dwukropek. Piszemy sprawozdanie',
    textbookPage: 69,
    teacherPlan: plan(
      ['Co dziś', `Dwie części. Najpierw dwukropek (s. 69): dialog, wyliczenie, cytat - przyda się od razu w sprawozdaniu, bo tam często coś wyliczamy. Potem każdy pisze w klasie sprawozdanie z ostatniego wydarzenia klasowego (s. 68 zad. 6). ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- stawia dwukropek przed dialogiem, wyliczeniem i cytatem,',
        '- zamienia mowę zależną na cytat z dwukropkiem i cudzysłowem,',
        '- pisze sprawozdanie ze wstępem, rozwinięciem i zakończeniem.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - sprawozdanie.',
        '2. **Na rozgrzewkę s. 69** (3 min).',
        '3. **Ramka s. 69** (3 min) + **notatka** (4 min).',
        '4. **s. 69 zad. 1** (5 min) i **zad. 2** (4 min).',
        '5. **s. 68 zad. 6** (20 min) - sprawozdanie. Na tablicy wypisz razem z klasą wydarzenia, z których można pisać (wycieczka, apel, zawody). Kto nie skończy - kończy w domu.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **Rozgrzewka** Ewa wyjaśniła: „Nie mogę się z wami spotkać”. Paweł stwierdził: „Chętnie skorzystam z propozycji”.',
        '- **zad. 1** trzy filmy: „Hugo i jego wynalazek”, „Księga dżungli”, „Merida Waleczna”; powiedział: „Nie można być rozważnym i zakochanym w tym samym czasie”; pisarzami: Andrzejem Maleszką, Pawłem Beręsewiczem, Katarzyną Ryrych.',
        '- **zad. 2** np. brzmi: „na białym tulipanie”; na pytania: kto? co? kiedy? gdzie?; owoców: jabłek, pomarańczy i malin; powtarzam: „Nie poddawaj się”.',
      ].join('\n')],
    ),
    questions: [
      { text: 'W jakich trzech sytuacjach stawiamy dwukropek?', answer: 'Przed dialogiem, przed wyliczeniem i przed cytatem.' },
      { text: 'Gdzie postawisz dwukropek: „Na wycieczkę pojechały trzy klasy 5a, 5b i 5c”?', answer: 'Po „trzy klasy”: pojechały trzy klasy: 5a, 5b i 5c.' },
      { text: 'Przekształć z dwukropkiem: Ola powiedziała, że jest zmęczona.', answer: 'Ola powiedziała: „Jestem zmęczona”.' },
      { text: 'Co zapisujemy w cudzysłowie po dwukropku?', answer: 'Cudze słowa - cytat.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Dwukropek. Sprawozdanie'),
      ...recap(previousSetId),
      rozgrzewka('d2-s69-rozgrzewka', 69, 'ustnie'),
      ramka('d2-s69-ramka', 69, 'Kiedy stawiamy dwukropek?'),
      slideNote('Dwukropek', 'Dwukropek stawiam:\n1. przed dialogiem: Nagle ktoś krzyknął:\n2. przed wyliczeniem: Zwiedziliśmy trzy miejsca: Wawel, Rynek i Barbakan.\n3. przed cytatem: Krasicki powiedział: „Umiej być przyjacielem”.'),
      zad('d2-s69-zad1', 69, '1', 'zeszyt'),
      zad('d2-s69-zad2', 69, '2', 'zeszyt'),
      zad('d2-s68-zad6', 68, '6', 'zeszyt'),
    ],
  },
  {
    title: '28. Tekst reklamowy',
    dzial: DZIAL,
    topic: 'Tekst reklamowy',
    textbookPage: 94,
    teacherPlan: plan(
      ['Co dziś', `Tekst reklamowy (s. 94-95) bez eseju Etinga ze s. 93-94 - jest za trudny, a z lekcji wystarczy ramka i zadania. Jak rozpoznać reklamę, po co jest, jak działa (hasło, kolory, obietnice). Na koniec każdy wymyśla hasło reklamowe. ${FILM_POZNIEJ}`],
      ['Po lekcji uczeń', [
        '- rozpoznaje tekst reklamowy i odróżnia go od informacyjnego,',
        '- wskazuje w reklamie hasło i słowa, które namawiają,',
        '- wyjaśnia, czym reklama przyciąga uwagę,',
        '- układa własne hasło reklamowe.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - dwukropek.',
        '2. **Ramka s. 94** (3 min). Dodaj: reklama z łaciny „reclamo” = wołać, krzyczeć.',
        '3. **Notatka** (5 min).',
        '4. **s. 95 zad. 7** ustnie (5 min) - które zdania to hasła reklamowe.',
        '5. **s. 95 zad. 9** (8 min) - reklama pasty: hasło, kolory, obrazki, wyróżnienia.',
        '6. **s. 95 zad. 5** ustnie (4 min) - świat z reklam a prawdziwy.',
        '7. **s. 95 zad. 10** (12 min) - hasło + szkic plakatu. W parach albo sam. Kilka osób prezentuje.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **zad. 7** Hasła: „Oto superskuteczne tabletki...” i „Wyjątkowa oferta! Kup zmywarkę...”. Poznajemy po zachwalaniu, wykrzyknikach, zwrocie do odbiorcy, obietnicy i słowach typu gratis.',
        '- **zad. 9** Hasło obiecuje szybki efekt (14 dni). Biel i błękit kojarzą się z czystością i świeżością, mięta ze świeżym oddechem, lśniący ząb ze zdrowiem. Duża liczba 14 i napis „extra wybielanie” rzucają się w oczy.',
        '- **zad. 5** W reklamach wszyscy są uśmiechnięci i piękni, domy lśnią, produkt rozwiązuje każdy problem. W życiu tak nie jest - reklama upiększa, żeby sprzedać.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest tekst reklamowy?', answer: 'Tekst, który ma nakłonić do kupienia produktu albo skorzystania z usługi.' },
      { text: 'Podaj trzy słowa, które często pojawiają się w reklamach.', answer: 'Np. nowość, promocja, gratis, taniej, więcej, niższa cena.' },
      { text: 'Czym różni się tekst reklamowy od informacyjnego?', answer: 'Informacyjny podaje fakty, reklamowy namawia i zachwala.' },
      { text: 'Skąd pochodzi słowo „reklama”?', answer: 'Z łaciny: reclamo - wołać, krzyczeć.' },
      { text: 'Dlaczego nie warto wierzyć każdej reklamie?', answer: 'Bo pokazuje świat piękniejszy niż naprawdę - jej celem jest sprzedaż.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Tekst reklamowy'),
      ...recap(previousSetId),
      ramka('d2-s94-ramka', 94, 'Tekst reklamowy'),
      slideNote('Tekst reklamowy', '1. Tekst reklamowy namawia do kupna albo skorzystania z usługi (reclamo = wołać, krzyczeć).\n2. Rozpoznaję go po haśle i słowach: nowość, promocja, gratis, taniej, więcej; po wykrzyknikach i zwrotach do mnie.\n3. Reklama pokazuje świat piękniejszy niż naprawdę - najpierw sprawdzam, potem kupuję.'),
      zad('d2-s95-zad7', 95, '7', 'ustnie'),
      zad('d2-s95-zad9', 95, '9', 'zeszyt'),
      zad('d2-s95-zad5', 95, '5', 'ustnie'),
      zad('d2-s95-zad10', 95, '10', 'zeszyt'),
    ],
  },
  {
    title: '29. Podsumowanie działu 2 - To wiem! To potrafię!',
    dzial: DZIAL,
    topic: 'Uwaga, uczucia! - podsumowanie działu',
    textbookPage: 96,
    teacherPlan: plan(
      ['Co dziś', 'Podsumowanie na mapie ze s. 96 i test ze s. 97-98: wywiad „Zarażeni emocjami” o filmie „W głowie się nie mieści” - dzieci go znają. Zadania z s. 98 sprawdzają prawie cały dział naraz. Film podsumowujący (jak w dziale 1) jeszcze nie powstał - gdy będzie, wchodzi po mapie.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje przenośnię, zdrobnienie i zgrubienie,',
        '- odmienia rzeczowniki, także te o nietypowej odmianie,',
        '- poprawnie pisze ę i ą na końcu wyrazu,',
        '- stawia dwukropek i zna budowę sprawozdania,',
        '- sam ocenia, co już umie z działu.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - tekst reklamowy.',
        '2. **Mapa s. 96** (2 min).',
        '3. **Tekst s. 97-98** (6 min) - czytasz albo czytają na zmianę.',
        '4. **Zadania s. 98** (25 min) - po kolei, koło losuje. Zad. 1, 2, 3, 5, 7 szybko ustnie; 4, 8, 9, 10 w zeszycie.',
        '5. **Notatka** (5 min).',
        '6. **Zad. 11** - sprawozdanie z wyjścia do kina, do domu (albo dla chętnych).',
      ].join('\n')],
      ['Odpowiedzi s. 98', [
        '- **zad. 1** A.',
        '- **zad. 2** przenośnia - P, tekst reklamowy - F.',
        '- **zad. 3** radość, smutek, gniew, strach, odraza - rzeczowniki.',
        '- **zad. 4** czerwona - Gniew, żółta - Radość, zielona - Odraza, fioletowa - Strach, niebieska - Smutek.',
        '- **zad. 5** To imiona bohaterów filmu - nazwy własne.',
        '- **zad. 7** emocje, uczucia, wartości (emocja, uczucie, wartość). Nożyce, imieniny, spodnie - tylko lm.',
        '- **zad. 8** -ę: zdradę, sprawę, fuzję (biernik lp.); -ą: zmienią, współpracują, posługują (3. os. lm.).',
        '- **zad. 9** np. własny: Pixar, „W głowie się nie mieści”; pospolity: emocje, rozum.',
        '- **zad. 10** nie czuję (czuj|ę), czujecie (czuj|ecie), czują (czuj|ą).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest przenośnia? Podaj przykład.', answer: 'Połączenie wyrazów o nowym, niedosłownym znaczeniu, np. kamienne serce.' },
      { text: 'Utwórz zdrobnienie i zgrubienie od „dom”.', answer: 'Domek, domisko.' },
      { text: 'W jakim przypadku jest „o kocie”?', answer: 'W miejscowniku (o kim? o czym?).' },
      { text: 'Uzupełnij: Rozmawiam z (koleżanka).', answer: 'Z koleżanką - na ą.' },
      { text: 'Podaj rzeczownik, który ma tylko liczbę mnogą.', answer: 'Np. drzwi, nożyczki, spodnie, wakacje.' },
      { text: 'Na jakie pytania odpowiada wstęp sprawozdania?', answer: 'Kto? Co? Kiedy? Gdzie? Dlaczego?' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Uwaga, uczucia! - podsumowanie'),
      ...recap(previousSetId),
      ramka('d2-s96-mapa', 96, 'Mapa działu - to wszystko dziś powtórzymy'),
      ramka('d2-s97-tekst', 97, 'Zarażeni emocjami'),
      ramka('d2-s98-tekst', 98, 'Zarażeni emocjami - dokończenie'),
      zad('d2-s98-zad1', 98, '1', 'ustnie'),
      zad('d2-s98-zad2', 98, '2', 'ustnie'),
      zad('d2-s98-zad3', 98, '3', 'ustnie'),
      zad('d2-s98-zad4', 98, '4', 'zeszyt'),
      zad('d2-s98-zad5', 98, '5', 'ustnie'),
      zad('d2-s98-zad7', 98, '7', 'ustnie'),
      zad('d2-s98-zad8', 98, '8', 'zeszyt'),
      zad('d2-s98-zad9', 98, '9', 'zeszyt'),
      zad('d2-s98-zad10', 98, '10', 'zeszyt'),
      slideNote('Uwaga, uczucia! - podsumowanie', '**Słowa i emocje:** przenośnia (kamienne serce), związek frazeologiczny (czuć miętę), zdrobnienie (piesek), zgrubienie (psisko).\n**Rzeczownik:** przypadki; własne wielką literą; muzeum - w muzeum; tylko lp. (odzież), tylko lm. (drzwi).\n**Pisownia:** -ę: widzę mamę, piszę, kocię; -ą: z mamą, piszą. Dwukropek: dialog, wyliczenie, cytat.\n**Formy:** sprawozdanie (kto, co, gdzie, kiedy, przebieg, opinia), tekst reklamowy, recytacja.'),
      zad('d2-s98-zad11', 98, '11', 'dom'),
    ],
  },
];
