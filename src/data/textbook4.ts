// Pierwsze piec tematow z podrecznika "Miedzy nami 4" jako pelne prezentacje.
// Podrecznik jest etapem lekcji, a nie zewnetrznym celem przycisku "Pokaz".

import type { Lesson, Question, QuestionSet, Slide, SlideArt } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

interface Topic {
  title: string;
  topic: string;
  textbookPage: number;
  notebookNote: string;
  questions: Array<{ text: string; answer: string }>;
  makeSlides: (previousQuestionSetId?: string) => Slide[];
}

const ROZDZIAL_1 = 'Rozdział I. Poznajemy siebie i innych';

const TOPICS: Topic[] = [
  {
    title: '1-2. Krok po kroku tworzymy pierwszą wspólną opowieść',
    topic: 'Świat przedstawiony i narrator',
    textbookPage: 12,
    notebookNote: [
      '## Świat przedstawiony',
      'To wszystko, co autor umieścił w historii:',
      '- **czas** - kiedy dzieją się wydarzenia,',
      '- **miejsce** - gdzie się dzieją,',
      '- **bohaterowie** - kto bierze w nich udział,',
      '- **wydarzenia** - co się dzieje.', '',
      '## Autor i narrator',
      '**Autor** tworzy tekst. **Narrator** opowiada historię. Nie są tą samą osobą.', '',
      '## Jak rozpoznać narratora?',
      '- **narrator-bohater** uczestniczy w wydarzeniach: „Wszedłem do kopalni”,',
      '- **narrator-obserwator** opowiada o innych: „Antek wszedł do kopalni”.', '',
      '## Przykład',
      '„Wieczorem Lena zbudowała bazę w lesie”.',
      '**Czas:** wieczór. **Miejsce:** las. **Bohaterka:** Lena. **Wydarzenie:** budowa bazy. **Narrator:** obserwator.',
    ].join('\n'),
    questions: [
      { text: 'Wymień pięć elementów świata przedstawionego.', answer: 'Czas, miejsce, bohaterowie, wydarzenia i narrator.' },
      { text: 'Kto opowiada historię w „Moim lecie z szablozębnym”?', answer: 'Antek, starszy brat Ulki.' },
      { text: 'Czy autor i narrator to zawsze ta sama osoba?', answer: 'Nie. Autor tworzy tekst, a narrator jest osobą opowiadającą w utworze.' },
      { text: 'Po czym poznasz narratora-bohatera?', answer: 'Mówi o sobie w pierwszej osobie, np. zrobiłem, widziałam, poszliśmy.' },
      { text: 'Co zmieniło się w nastawieniu Antka i Ulki do cioci Larysy?', answer: 'Najpierw bali się wspólnych wakacji, a później chcieli, żeby ciocia znów się nimi opiekowała.' },
    ],
    makeSlides: () => [
      slideTopic('Świat przedstawiony i narrator'),
      slideRead('Czytamy całą historię', 12, 15, '„Moje lato z szablozębnym” - razem z listem i fragmentem „9 września”. Po czytaniu omawiamy zadania 1-3 z podręcznika. Nie przepisuj poleceń.', 20 * 60),
      slideText('Pięć pytań otwiera każdą historię', '**Kiedy? Gdzie? Kto? Co się wydarzyło? Kto to opowiada?**\n\nOdpowiedzi tworzą **świat przedstawiony**: czas, miejsce, bohaterów, wydarzenia i narratora.\n\n**Autor** wymyśla tekst. **Narrator** opowiada historię.', 'swiatPrzedstawiony'),
      slideTask('Z1', 'Przeczytaj dwa początki historii:\n\n**A.** „O 19.30 Maja weszła na serwer Minecraft. W opuszczonej kopalni znalazła skrzynię.”\n\n**B.** „Kuba uruchomił grę i zobaczył wiadomość.”\n\nW zeszycie wypisz elementy świata przedstawionego w tekście A. Potem napisz, jakich **dwóch informacji** brakuje w tekście B, i uzupełnij go własnym pomysłem.', 6 * 60, 'swiatPrzedstawiony', '**A:** czas - 19.30; miejsce - serwer i opuszczona kopalnia; bohaterka - Maja; wydarzenie - znalezienie skrzyni.\n\n**B:** brakuje czasu i dokładnego miejsca. Np. „Wieczorem Kuba uruchomił grę w swoim pokoju i zobaczył wiadomość.”'),
      slideTask('Z2', 'Kto tu opowiada? Przy każdym fragmencie zapisz: **narrator-bohater** albo **narrator-obserwator**. Podkreśl słowo, które było wskazówką.\n\n1. „Zbudowałam schron, zanim zapadła noc.”\n2. „Olek zobaczył na mapie migający punkt.”\n3. „Nie wiedzieliśmy, kto zostawił znak przy portalu.”\n\nNa koniec przepisz zdanie 2 tak, aby opowiadał je Olek.', 5 * 60, 'narrator', '1. narrator-bohater - „zbudowałam”\n2. narrator-obserwator - „Olek”\n3. narrator-bohater - „wiedzieliśmy”\n\nZmiana: „Zobaczyłem na mapie migający punkt.”'),
      slideTask('Z3', 'Stwórz **mikroopowieść w 4 zdaniach**. Muszą się w niej pojawić:\n\n- dokładny czas i miejsce,\n- bohater z konkretnym celem,\n- niespodziewane wydarzenie,\n- narrator-bohater mówiący „ja”.\n\nMożesz wybrać świat gry, szkoły, komiksu albo własny.', 7 * 60, 'opowiadanie', 'Np. „W sobotę o 18.00 wszedłem do opuszczonej kopalni. Chciałem znaleźć ostatni diament. Nagle za mną zatrzasnęły się kamienne drzwi. Zamiast skarbu zobaczyłem świecący portal.”'),
      slideNote('Zapamiętaj', 'Świat przedstawiony tworzą: **czas, miejsce, bohaterowie, wydarzenia i narrator**.\n\nAutor pisze utwór. Narrator opowiada historię. Narrator-bohater mówi o sobie: „ja”, „zrobiłem”, „widziałam”.'),
    ],
  },
  {
    title: '3. Być sobą, czyli kim?',
    topic: 'Podmiot liryczny - kto mówi w wierszu?',
    textbookPage: 16,
    notebookNote: [
      '## Kto mówi w wierszu?',
      '**Podmiot liryczny** to osoba mówiąca w wierszu. Poznajemy ją po jej słowach, uczuciach i myślach.', '',
      '## Autor to nie osoba mówiąca',
      '**Poeta** jest autorem wiersza, ale nie musi być podmiotem lirycznym.',
      '- w opowiadaniu historię przedstawia **narrator**,',
      '- w wierszu wypowiada się **podmiot liryczny**.', '',
      '## Jak go rozpoznać?',
      'Szukaj słów: **ja, czuję, myślę, marzę, jesteśmy**. Zwróć uwagę na uczucia, opinie i pragnienia.', '',
      '## Przykład',
      '„Stoję w lobby całkiem cicho, lecz mam swój własny styl”. Podmiotem lirycznym może być **gracz**. Wskazówki: **stoję, mam**. Nie wiemy, kto jest poetą.',
      '**Być sobą** to znać swoje mocne strony i nie udawać kogoś dla cudzej aprobaty.',
    ].join('\n'),
    questions: [
      { text: 'Kim jest podmiot liryczny?', answer: 'Osobą mówiącą w wierszu.' },
      { text: 'Czy podmiot liryczny i poeta to zawsze ta sama osoba?', answer: 'Nie. Poeta jest autorem, a podmiot liryczny to osoba mówiąca stworzona w wierszu.' },
      { text: 'Jakie słowa mogą zdradzić podmiot liryczny?', answer: 'Np. ja, czuję, myślę, marzę, jestem, robimy.' },
      { text: 'Kto mówi w prozie, a kto w wierszu?', answer: 'W prozie narrator, w wierszu podmiot liryczny.' },
      { text: 'Co według wiersza „Ja” znaczy być sobą?', answer: 'Nie czekać, aż dopiero kiedyś się kimś zostanie, lecz uznać własną wartość już teraz.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Podmiot liryczny - kto mówi w wierszu?'),
      ...recap(previousSetId),
      slideRead('Czytamy wiersz „Ja”', 16, 17, 'Przeczytaj wiersz Michała Rusinka. Następnie wspólnie wykonujemy zadania 1-3 z podręcznika.', 12 * 60),
      slideText('Autor to nie osoba mówiąca', '**Poeta** napisał wiersz. **Podmiot liryczny** mówi w wierszu.\n\nO osobie mówiącej dowiadujemy się z jej słów, myśli i uczuć. Szukamy form: **ja, czuję, jestem, marzę, robimy**.\n\nW opowiadaniu szukaliśmy narratora. W wierszu szukamy podmiotu lirycznego.', 'narrator'),
      slideTask('Z1', 'Przeczytaj:\n\n„W lobby stoję całkiem cicho,\nchoć w słuchawkach dudni bit.\nNie mam skina jak bohater,\nale mam swój własny styl.”\n\nZapisz: kto może być podmiotem lirycznym? Wypisz **dwie wskazówki** z tekstu. Czy wiemy, kto jest autorem? Uzasadnij.', 5 * 60, 'narrator', 'Podmiotem lirycznym może być gracz lub graczka. Wskazówki: „stoję” i „mam swój własny styl”. Nie znamy autora - osoba mówiąca w wierszu nie musi nim być.'),
      slideTask('Z2', 'Porównaj dwa teksty:\n\n**A.** „Nina zamknęła grę. Była dumna z wyniku.”\n\n**B.** „Zamykam grę. Jestem dumna z wyniku.”\n\nZapisz, kto mówi w każdym tekście: **narrator-obserwator**, **narrator-bohater** czy **podmiot liryczny**. Uwaga: jeden opis nie wystarcza - ważne jest także to, czy tekst jest prozą, czy wierszem.', 5 * 60, 'wiersz', '**A:** narrator-obserwator, bo mówi o Ninie.\n**B:** narrator-bohater, bo mówi o sobie.\n\nOba fragmenty są prozą, więc nie nazywamy osoby mówiącej podmiotem lirycznym.'),
      slideTask('Z3', 'Napisz czterowersowy tekst pod tytułem **„Ja online i ja offline”**.\n\n- mów w pierwszej osobie,\n- pokaż jedną rzecz, którą lubisz, i jedną, która jest dla ciebie ważna,\n- użyj jednego rzeczownika, czasownika i przymiotnika - podkreśl je i podpisz: **R, CZ, P**.', 8 * 60, 'wiersz', 'Np. „W sieci buduję **wysoki** (P) dom,\npo szkole **gram** (CZ), gdy chwilę mam.\nLecz ważny jest dla mnie **przyjaciel** (R),\nz nim nawet zwykły dzień nabiera barw.”'),
      slideNote('Zapamiętaj', '**Podmiot liryczny** to osoba mówiąca w wierszu. **Poeta** jest autorem wiersza - to nie musi być ta sama osoba.\n\nW prozie opowiada narrator, a w wierszu mówi podmiot liryczny. Szukaj słów zdradzających osobę mówiącą: „ja”, „czuję”, „myślę”, „marzę”.'),
    ],
  },
  {
    title: '4. Notatka kluczem do sukcesu',
    topic: 'Jak zrobić notatkę, która naprawdę pomaga?',
    textbookPage: 18,
    notebookNote: [
      '## Dobra notatka',
      'Wybiera **najważniejsze informacje** - nie kopiuje wszystkiego. Stosuje zasadę **3K: krótko, konkretnie, czytelnie**.', '',
      '## Dobierz właściwą formę',
      '- **punkty** - fakty albo kolejne kroki,',
      '- **tabela** - porównanie co najmniej dwóch rzeczy,',
      '- **mapa myśli** - związki i skojarzenia,',
      '- **sketchnotka** - słowa połączone z prostymi symbolami.', '',
      '## Trzy kroki',
      '1. Przeczytaj cały fragment.',
      '2. Wybierz słowa-klucze.',
      '3. Ułóż je w najlepiej dobranej formie.', '',
      '## Przykład',
      'Wiadomość: „Jutro polski na drugiej lekcji. Przynieście podręcznik i zeszyt”.',
      '**POLSKI - JUTRO**',
      '- druga lekcja,',
      '- przynieść podręcznik i zeszyt.',
    ].join('\n'),
    questions: [
      { text: 'Po co robimy notatki?', answer: 'Żeby wybrać i zapamiętać najważniejsze informacje oraz łatwo do nich wrócić.' },
      { text: 'Kiedy warto użyć tabeli?', answer: 'Gdy porównujemy dwie lub więcej rzeczy według tych samych cech.' },
      { text: 'Kiedy przydadzą się punkty?', answer: 'Gdy wyliczamy fakty albo pokazujemy kolejne kroki.' },
      { text: 'Czym różni się mapa myśli od tradycyjnej notatki?', answer: 'Mapa myśli pokazuje związki i skojarzenia od hasła głównego, a tradycyjna notatka jest zapisana pełnymi zdaniami.' },
      { text: 'Co oznacza zasada 3K?', answer: 'Krótko, konkretnie, czytelnie.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Jak zrobić notatkę, która naprawdę pomaga?'),
      ...recap(previousSetId),
      slideRead('Sprawdzamy sposoby notowania', 18, 21, 'Czytamy informacje o notatce, punktach, tabeli, mapie myśli i sketchnotce. Wspólnie wykonujemy zadania 1-3.', 15 * 60),
      slideText('Najpierw cel, potem forma', 'Dobra notatka odpowiada na pytanie: **do czego jej użyję?**\n\n- lista kroków - **punkty**\n- porównanie - **tabela**\n- związki i skojarzenia - **mapa myśli**\n- szybkie zapamiętanie - **sketchnotka**\n\nZasada **3K**: krótko, konkretnie, czytelnie.', 'zeszyt'),
      slideTask('Z1', 'Oto chaotyczna wiadomość z klasowego czatu:\n\n„Ej pamiętajcie że jutro polski na drugiej lekcji, trzeba mieć podręcznik i zeszyt, czytamy strony 22-24, a grupa Oli przynosi też flamastry, prezentacje pokazujemy w piątek.”\n\nZamień ją w czytelną notatkę **punkt po punkcie**. Nadaj jej krótki tytuł i zostaw tylko informacje potrzebne uczniowi.', 6 * 60, 'wiadomosc', '**Polski - jutro**\n- druga lekcja\n- przynieść podręcznik i zeszyt\n- czytamy strony 22-24\n- grupa Oli przynosi flamastry\n- prezentacje w piątek'),
      slideTask('Z2', 'Dwaj twórcy pokazali poradniki do budowania domu w Minecraft:\n\n**Film A:** 45 sekund, 3 kroki, same napisy, łatwy.\n**Film B:** 6 minut, 8 kroków, komentarz głosowy, trudniejszy.\n\nZrób tabelę porównującą oba filmy. Sam wybierz **cztery nagłówki wierszy**. Pod tabelą napisz, który poradnik wybierasz i dlaczego.', 7 * 60, undefined, 'Np. nagłówki: **czas, liczba kroków, sposób objaśnienia, poziom trudności**.\n\n„Wybieram film A, bo chcę szybko poznać podstawy i łatwo powtórzyć trzy kroki.”'),
      slideTask('Z3', 'Zrób małą mapę myśli pod hasłem **„Dobra opowieść”**.\n\nWykorzystaj wiedzę z pierwszej lekcji: czas, miejsce, bohaterowie, wydarzenia, narrator. Do każdej gałęzi dopisz po jednym własnym przykładzie. Jedną informację zastąp prostym symbolem lub rysunkiem.', 7 * 60, 'swiatPrzedstawiony', 'Np. **Dobra opowieść** → czas: noc; miejsce: opuszczony zamek; bohater: odważna Maja; wydarzenie: odkrycie przejścia; narrator: bohater mówiący „ja”.'),
      slideNote('Zapamiętaj', 'Dobra notatka jest **krótka, konkretna i czytelna**.\n\nUżyj punktów do listy lub kolejności, tabeli do porównania, mapy myśli do związków i skojarzeń, a prostych ikon do szybkiego zapamiętania.'),
    ],
  },
  {
    title: '5-6. Sekrety wyrazów - głoski, litery i sylaby',
    topic: 'Głoski, litery i sylaby - kod języka',
    textbookPage: 22,
    notebookNote: [
      '## Głoska, litera, sylaba',
      '- **głoskę** słyszymy i wymawiamy,',
      '- **literę** widzimy i piszemy,',
      '- **sylaba** to część wyrazu wymawiana jednym otwarciem ust.', '',
      '## Samogłoski i dwuznaki',
      'Samogłoski: **a, ą, e, ę, i, o, u (ó), y**. Każda sylaba ma samogłoskę.',
      'Jedną głoskę mogą zapisywać dwie litery: **sz, cz, rz, ch, dz, dż, dź**.', '',
      '## Policzmy',
      '- **mapa** - 4 litery, 4 głoski, 2 sylaby: ma-pa,',
      '- **szafa** - 5 liter, 4 głoski, 2 sylaby: sza-fa,',
      '- **chmura** - 6 liter, 5 głosek, 2 sylaby: chmu-ra,',
      '- **dżem** - 4 litery, 3 głoski, 1 sylaba.', '',
      '## Przenoszenie wyrazów',
      'Wyrazy przenosimy tylko **między sylabami**, np. chmu-ra. Wyrazów jednosylabowych nie dzielimy.',
    ].join('\n'),
    questions: [
      { text: 'Czym różni się głoska od litery?', answer: 'Głoskę słyszymy i wymawiamy, a literę widzimy i piszemy.' },
      { text: 'Ile liter ma polski alfabet?', answer: '32.' },
      { text: 'Podaj trzy przykłady jednej głoski zapisanej dwiema literami.', answer: 'Np. sz, cz, rz, ch, dz, dż, dź.' },
      { text: 'Wymień polskie samogłoski.', answer: 'a, ą, e, ę, i, o, u (ó), y.' },
      { text: 'Ile liter, głosek i sylab ma wyraz „chmura”?', answer: '6 liter, 5 głosek i 2 sylaby.' },
      { text: 'Gdzie wolno przenieść wyraz do następnej linii?', answer: 'Między sylabami.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Głoski, litery i sylaby - kod języka'),
      ...recap(previousSetId),
      slideRead('Odkrywamy sekrety wyrazów', 22, 24, 'Czytamy reguły i wspólnie wykonujemy zadania 5, 7 i 8 z podręcznika.', 16 * 60),
      slideText('Ucho, oko i rytm', '**Głoskę** słyszymy i wymawiamy. **Literę** widzimy i piszemy.\n\nJedna głoska może mieć dwie litery: **sz, cz, rz, ch, dz, dż, dź**.\n\nKażda sylaba ma samogłoskę. Wyraz przenosimy do nowej linii tylko **między sylabami**.', 'dwuznak'),
      slideTask('Z1', 'Posortuj wyrazy do dwóch skrzyń:\n\n**A - tyle samo liter i głosek**\n**B - więcej liter niż głosek**\n\nchata, gracz, mapa, chmura, dom, miecz, rower, dżem\n\nPrzepisz wyrazy w dwóch grupach. W grupie B podkreśl dwuznaki.', 6 * 60, 'dwuznak', '**A:** mapa, dom, rower\n\n**B:** chata, gracz, chmura, miecz, dżem. W tych wyrazach dwie litery zapisują jedną głoskę.'),
      slideTask('Z2', 'Rozszyfruj ekwipunek gracza. Przy każdym wyrazie zapisz liczbę **liter, głosek i sylab**:\n\n1. mapa\n2. szafa\n3. dżem\n4. chmura\n\nWzór: **mapa - 4 litery, 4 głoski, 2 sylaby: ma-pa**.', 7 * 60, 'sylaby', 'mapa - 4 litery, 4 głoski, 2 sylaby: ma-pa\nszafa - 5 liter, 4 głoski, 2 sylaby: sza-fa\ndżem - 4 litery, 3 głoski, 1 sylaba\nchmura - 6 liter, 5 głosek, 2 sylaby: chmu-ra'),
      slideTask('Z3', 'Administrator serwera może użyć tylko nicku, który ma **dokładnie 6 liter i 5 głosek**.\n\nSprawdź nicki: **Chmura, Rzeka, Gracz, Szyfr**. Zapisz ten, który spełnia warunek, i uzasadnij liczbami.\n\nPotem wymyśl własny wyraz z dwuznakiem i podziel go na sylaby.', 6 * 60, 'dwuznak', '**Chmura** spełnia warunek: ma 6 liter i 5 głosek, ponieważ „ch” zapisuje jedną głoskę. Dzielimy: chmu-ra.\n\nWłasny przykład: szafa - sza-fa.'),
      slideNote('Zapamiętaj', '**Głoski** słyszymy i wymawiamy, a **litery** widzimy i piszemy. Jedną głoskę mogą zapisywać dwie litery, np. sz, cz, ch.\n\nKażda sylaba ma samogłoskę. Wyrazy przenosimy między sylabami: chmu-ra, po-chod-nia.'),
    ],
  },
  {
    title: '7. Malujemy pędzlem i słowem',
    topic: 'Epitet - słowo, które uruchamia wyobraźnię',
    textbookPage: 25,
    notebookNote: [
      '## Epitet',
      '**Epitet** to określenie rzeczownika. Najczęściej jest przymiotnikiem. Odpowiada na pytania: **jaki? jaka? jakie? czyj? czyja? czyje?**', '',
      '## Po co go używamy?',
      'Epitet pomaga zobaczyć, usłyszeć albo poczuć opisywany świat i buduje nastrój.',
      '„Las” przekazuje informację. „**Ciemny, wilgotny las**” uruchamia wyobraźnię.', '',
      '## Przykład',
      '„**Samotny** awatar wszedł do **opuszczonego** zamku. Zobaczył **mroczny** korytarz i **żelazne** drzwi”.',
      'Epitety budują **tajemniczy i niebezpieczny nastrój**.', '',
      '## Precyzyjny opis i autoportret',
      'Zamiast „fajny skin” napisz: „**neonowy skin z pękniętą maską**”.',
      '**Autoportret** to portret samego siebie wykonany obrazem, zdjęciem albo słowami. Pokazuje wygląd, charakter i zainteresowania.',
    ].join('\n'),
    questions: [
      { text: 'Co to jest epitet?', answer: 'Określenie rzeczownika, najczęściej przymiotnik.' },
      { text: 'Na jakie pytania odpowiada epitet?', answer: 'Jaki? jaka? jakie? czyj? czyja? czyje?' },
      { text: 'Po co stosujemy epitety?', answer: 'Żeby opis był dokładniejszy, działał na wyobraźnię i budował nastrój.' },
      { text: 'Co to jest autoportret?', answer: 'Portret samego siebie wykonany obrazem, zdjęciem albo słowami.' },
      { text: 'Wskaż epitet w wyrażeniu „opuszczony zamek”.', answer: 'Opuszczony.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Epitet - słowo, które uruchamia wyobraźnię'),
      ...recap(previousSetId),
      slideRead('Czytamy i oglądamy autoportrety', 25, 28, 'Czytamy wiersz „Autoportret” i teksty o opisie. Wspólnie wykonujemy zadania wskazane przez nauczyciela.', 15 * 60),
      slideText('Epitet dodaje obraz i nastrój', '**Epitet** określa rzeczownik i odpowiada na pytania: **jaki? jaka? jakie? czyj?**\n\n„Las” to informacja. **„Ciemny, wilgotny las”** to obraz i nastrój.\n\nNajlepszy epitet jest dokładny. Zamiast „fajny” wybierz słowo, po którym inni zobaczą to samo co ty.', 'opis'),
      slideTask('Z1', 'Dwa opisy tej samej sceny:\n\n**A.** „Awatar wszedł do zamku. Zobaczył korytarz i drzwi.”\n\n**B.** „Samotny awatar wszedł do opuszczonego zamku. Zobaczył mroczny korytarz i żelazne drzwi.”\n\nWypisz epitety z tekstu B. Następnie jednym zdaniem wyjaśnij, jak zmieniły obraz lub nastrój sceny.', 5 * 60, 'opis', 'Epitety: **samotny** awatar, **opuszczony** zamek, **mroczny** korytarz, **żelazne** drzwi. Dzięki nim scena wydaje się niebezpieczna i tajemnicza.'),
      slideTask('Z2', 'Ulepsz opis, ale nie używaj słów **fajny, super, ładny**:\n\n„W Robloxie zobaczyłem parkour. Były tam platformy, światła i tunel.”\n\nPrzepisz tekst, dodając co najmniej **5 trafnych epitetów**. Podkreśl epitety, a rzeczowniki, które określają, otocz kółkiem.', 7 * 60, 'opis', 'Np. „W Robloxie zobaczyłem **podniebny** parkour. Były tam **wąskie, ruchome** platformy, **pulsujące** światła i **ciemny, kręty** tunel.”'),
      slideTask('Z3', 'Zaprojektuj słowny kadr komiksu zatytułowany **„Sekundę przed katastrofą”**.\n\nNapisz 3-4 zdania. Podaj czas, miejsce, bohatera i wydarzenie. Użyj minimum **4 epitetów**, które budują napięcie. Na końcu dopisz, kto jest narratorem.', 8 * 60, 'swiatPrzedstawiony', 'Np. „O północy wszedłem do **pustego** laboratorium. Nad **szklanym** stołem wisiała **czerwona** lampka. Nagle usłyszałem **metaliczny** trzask i podłoga zadrżała. Narrator-bohater: uczestniczę w wydarzeniach i mówię „ja”.”'),
      slideNote('Zapamiętaj', '**Epitet** to określenie rzeczownika, najczęściej przymiotnik. Odpowiada na pytania: jaki? jaka? jakie? czyj?\n\nEpitet wzbogaca opis, działa na wyobraźnię i buduje nastrój, np. „mroczny korytarz”, „żelazne drzwi”.'),
    ],
  },
];

export function buildTextbook4(grade: string, classIds: string[]): FreshMaterialsBundle {
  if (grade.toUpperCase() !== 'IV') throw new Error('Podręcznik jest przygotowany dla klasy IV.');
  const questionSets: QuestionSet[] = TOPICS.map((topic) => ({ id: newId(), name: topic.title, topic: topic.title, classIds, createdAt: new Date().toISOString() }));
  const questions: Question[] = [];
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = TOPICS.map((topic, index) => {
    const setId = questionSets[index].id;
    topic.questions.forEach((question, order) => questions.push({ id: newId(), setId, ...question, order }));
    return { grade, title: topic.title, topic: topic.topic, registerTopic: topic.title.replace(/^[\d-]+\.\s*/, ''), materialType: 'textbook', textbookPage: topic.textbookPage, notebookNote: topic.notebookNote, questionSetId: setId, reviewQuestionSetId: setId, dzial: ROZDZIAL_1, progress: {}, slides: topic.makeSlides(questionSets[index - 1]?.id) };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK4_TOPIC_COUNT = TOPICS.length;

/** Tematy z dawnego, zbyt szerokiego pakietu usuwane przy jego odswiezeniu. */
export const RETIRED_TEXTBOOK4_TITLES = new Set([
  '8. Dlaczego warto być sobą?',
  '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
  '11. Czas na czasownik',
  '15. Tworzymy plan ramowy',
  '16. Co już wiesz? Co umiesz?',
]);

function slideTopic(topic: string): Slide { return { id: newId(), kind: 'topic', topic }; }
function slideRead(title: string, page: number, pageTo: number, body: string, timerSec: number): Slide { return { id: newId(), kind: 'read', title, source: 'Podręcznik', page, pageTo, body, timerSec }; }
function slideText(title: string, body: string, art?: SlideArt): Slide { return { id: newId(), kind: 'text', title, body, art }; }
function slideTask(code: string, body: string, timerSec: number, art?: SlideArt, answerExample?: string): Slide {
  return { id: newId(), kind: 'task', code, body, timerSec, art, answerExample, zeszyt: true };
}
function slideRecap(questionSetId: string): Slide { return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' }; }
function recap(questionSetId?: string): Slide[] { return questionSetId ? [slideRecap(questionSetId)] : []; }
function slideNote(title: string, body: string): Slide { return { id: newId(), kind: 'note', title, body }; }
