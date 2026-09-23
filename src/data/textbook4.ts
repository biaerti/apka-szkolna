// Pierwsze dziesiec tematow z podrecznika "Miedzy nami 4" jako pelne prezentacje.
// Podrecznik jest etapem lekcji, a nie zewnetrznym celem przycisku "Pokaz".

import type { Lesson, Question, QuestionSet, Slide, SlideArt } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

interface Topic {
  title: string;
  topic: string;
  textbookPage: number;
  notebookNote?: string;
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
      slideRead('Otwieramy podręcznik', 12, 15, 'Czytamy „Moje lato z szablozębnym” razem z listem i fragmentem „9 września”. Potem rozmawiamy o tekście i wykonujemy zadania 1-3. Nie przepisuj poleceń.', 20 * 60),
      slideText('Pięć pytań otwiera każdą historię', '**Kiedy? Gdzie? Kto? Co się wydarzyło? Kto to opowiada?**\n\nOdpowiedzi tworzą **świat przedstawiony**: czas, miejsce, bohaterów, wydarzenia i narratora.\n\n**Autor** wymyśla tekst. **Narrator** opowiada historię.', 'swiatPrzedstawiony'),
      slideTask('Z1', 'Przeczytaj dwa początki historii:\n\n**A.** „O 19.30 Maja weszła na serwer Minecraft. W opuszczonej kopalni znalazła skrzynię.”\n\n**B.** „Kuba uruchomił grę i zobaczył wiadomość.”\n\nW zeszycie wypisz elementy świata przedstawionego w tekście A. Potem napisz, jakich **dwóch informacji** brakuje w tekście B, i uzupełnij go własnym pomysłem.', 6 * 60, 'swiatPrzedstawiony', '**A:** czas - 19.30; miejsce - serwer i opuszczona kopalnia; bohaterka - Maja; wydarzenie - znalezienie skrzyni.\n\n**B:** brakuje czasu i dokładnego miejsca. Np. „Wieczorem Kuba uruchomił grę w swoim pokoju i zobaczył wiadomość.”'),
      slideTask('Z2', 'Kto tu opowiada? Przy każdym fragmencie zapisz: **narrator-bohater** albo **narrator-obserwator**. Podkreśl słowo, które było wskazówką.\n\n1. „Zbudowałam schron, zanim zapadła noc.”\n2. „Olek zobaczył na mapie migający punkt.”\n3. „Nie wiedzieliśmy, kto zostawił znak przy portalu.”\n\nNa koniec przepisz zdanie 2 tak, aby opowiadał je Olek.', 5 * 60, 'narrator', '1. narrator-bohater - „zbudowałam”\n2. narrator-obserwator - „Olek”\n3. narrator-bohater - „wiedzieliśmy”\n\nZmiana: „Zobaczyłem na mapie migający punkt.”'),
      slideTask('Z3', 'Stwórz **mikroopowieść w 4 zdaniach**. Muszą się w niej pojawić:\n\n- dokładny czas i miejsce,\n- bohater z konkretnym celem,\n- niespodziewane wydarzenie,\n- narrator-bohater mówiący „ja”.\n\nMożesz wybrać świat gry, szkoły, komiksu albo własny.', 7 * 60, 'opowiadanie', 'Np. „W sobotę o 18.00 wszedłem do opuszczonej kopalni. Chciałem znaleźć ostatni diament. Nagle za mną zatrzasnęły się kamienne drzwi. Zamiast skarbu zobaczyłem świecący portal.”'),
      slideNote('Świat przedstawiony i narrator', '- Świat przedstawiony: czas, miejsce, bohaterowie, wydarzenia.\n- Autor tworzy tekst, a narrator opowiada historię.\n- Narrator-bohater mówi „ja”, narrator-obserwator opowiada o innych.'),
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
      slideRead('Otwieramy podręcznik', 16, 17, 'Czytamy wiersz „Ja”, rozmawiamy o osobie mówiącej i wspólnie wykonujemy zadania 1-3.', 15 * 60),
      slideText('Autor to nie osoba mówiąca', '**Poeta** napisał wiersz. **Podmiot liryczny** mówi w wierszu.\n\nO osobie mówiącej dowiadujemy się z jej słów, myśli i uczuć. Szukamy form: **ja, czuję, jestem, marzę, robimy**.\n\nW opowiadaniu szukaliśmy narratora. W wierszu szukamy podmiotu lirycznego.', 'narrator'),
      slideTask('Z1', 'Przeczytaj:\n\n„W lobby stoję całkiem cicho,\nchoć w słuchawkach dudni bit.\nNie mam skina jak bohater,\nale mam swój własny styl.”\n\nZapisz: kto może być podmiotem lirycznym? Wypisz **dwie wskazówki** z tekstu. Czy wiemy, kto jest autorem? Uzasadnij.', 5 * 60, 'narrator', 'Podmiotem lirycznym może być gracz lub graczka. Wskazówki: „stoję” i „mam swój własny styl”. Nie znamy autora - osoba mówiąca w wierszu nie musi nim być.'),
      slideTask('Z2', 'Porównaj dwa teksty:\n\n**A.** „Nina zamknęła grę. Była dumna z wyniku.”\n\n**B.** „Zamykam grę. Jestem dumna z wyniku.”\n\nZapisz, kto mówi w każdym tekście: **narrator-obserwator**, **narrator-bohater** czy **podmiot liryczny**. Uwaga: jeden opis nie wystarcza - ważne jest także to, czy tekst jest prozą, czy wierszem.', 5 * 60, 'wiersz', '**A:** narrator-obserwator, bo mówi o Ninie.\n**B:** narrator-bohater, bo mówi o sobie.\n\nOba fragmenty są prozą, więc nie nazywamy osoby mówiącej podmiotem lirycznym.'),
      slideTask('Z3', 'Napisz czterowersowy tekst pod tytułem **„Ja online i ja offline”**.\n\n- mów w pierwszej osobie,\n- pokaż jedną rzecz, którą lubisz, i jedną, która jest dla ciebie ważna,\n- użyj jednego rzeczownika, czasownika i przymiotnika - podkreśl je i podpisz: **R, CZ, P**.', 8 * 60, 'wiersz', 'Np. „W sieci buduję **wysoki** (P) dom,\npo szkole **gram** (CZ), gdy chwilę mam.\nLecz ważny jest dla mnie **przyjaciel** (R),\nz nim nawet zwykły dzień nabiera barw.”'),
      slideNote('Podmiot liryczny', '- Podmiot liryczny to osoba mówiąca w wierszu.\n- Poeta jest autorem, ale nie musi być podmiotem lirycznym.\n- W prozie opowiada narrator, w wierszu mówi podmiot liryczny.'),
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
      slideRead('Otwieramy podręcznik', 18, 21, 'Poznajemy sposoby notowania, porównujemy przykłady i wspólnie wykonujemy zadania 1-3.', 18 * 60),
      slideText('Najpierw cel, potem forma', 'Dobra notatka odpowiada na pytanie: **do czego jej użyję?**\n\n- lista kroków - **punkty**\n- porównanie - **tabela**\n- związki i skojarzenia - **mapa myśli**\n- szybkie zapamiętanie - **sketchnotka**\n\nZasada **3K**: krótko, konkretnie, czytelnie.', 'zeszyt'),
      slideTask('Z1', 'Oto chaotyczna wiadomość z klasowego czatu:\n\n„Ej pamiętajcie że jutro polski na drugiej lekcji, trzeba mieć podręcznik i zeszyt, czytamy strony 22-24, a grupa Oli przynosi też flamastry, prezentacje pokazujemy w piątek.”\n\nZamień ją w czytelną notatkę **punkt po punkcie**. Nadaj jej krótki tytuł i zostaw tylko informacje potrzebne uczniowi.', 6 * 60, 'wiadomosc', '**Polski - jutro**\n- druga lekcja\n- przynieść podręcznik i zeszyt\n- czytamy strony 22-24\n- grupa Oli przynosi flamastry\n- prezentacje w piątek'),
      slideTask('Z2', 'Dwaj twórcy pokazali poradniki do budowania domu w Minecraft:\n\n**Film A:** 45 sekund, 3 kroki, same napisy, łatwy.\n**Film B:** 6 minut, 8 kroków, komentarz głosowy, trudniejszy.\n\nZrób tabelę porównującą oba filmy. Sam wybierz **cztery nagłówki wierszy**. Pod tabelą napisz, który poradnik wybierasz i dlaczego.', 7 * 60, undefined, 'Np. nagłówki: **czas, liczba kroków, sposób objaśnienia, poziom trudności**.\n\n„Wybieram film A, bo chcę szybko poznać podstawy i łatwo powtórzyć trzy kroki.”'),
      slideTask('Z3', 'Dwie osoby zrobiły notatki z tego samego tematu przyrody:\n\n**Notatka A:** pół strony, 5 krótkich punktów, same słowa-klucze, bez rysunków.\n**Notatka B:** cała strona, mapa myśli z 5 gałęziami, słowa-klucze i proste symbole.\n\nZrób tabelę porównującą obie notatki. Sam wybierz **cztery nagłówki wierszy**. Pod tabelą napisz, z której notatki wolisz się uczyć i dlaczego.', 7 * 60, undefined, 'Np. nagłówki: **długość, forma, sposób zapisu, ilustracje**.\n\n„Wybieram notatkę B, bo symbole i gałęzie mapy myśli pomagają mi zapamiętać związki między informacjami.”'),
      slideTask('Z4', 'Zrób małą mapę myśli pod hasłem **„Dobra opowieść”**.\n\nWykorzystaj wiedzę z pierwszej lekcji: czas, miejsce, bohaterowie, wydarzenia, narrator. Do każdej gałęzi dopisz po jednym własnym przykładzie. Jedną informację zastąp prostym symbolem lub rysunkiem.', 7 * 60, 'swiatPrzedstawiony', 'Np. **Dobra opowieść** → czas: noc; miejsce: opuszczony zamek; bohater: odważna Maja; wydarzenie: odkrycie przejścia; narrator: bohater mówiący „ja”.'),
      slideNote('Dobra notatka', '- Notatka wybiera najważniejsze informacje.\n- Formy: punkty, tabela, mapa myśli, sketchnotka.\n- Zasada 3K: krótko, konkretnie, czytelnie.'),
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
      slideRead('Otwieramy podręcznik', 22, 24, 'Czytamy reguły, wspólnie sprawdzamy przykłady i wykonujemy zadania 5, 7 i 8.', 18 * 60),
      slideText('Ucho, oko i rytm', '**Głoskę** słyszymy i wymawiamy. **Literę** widzimy i piszemy.\n\nJedna głoska może mieć dwie litery: **sz, cz, rz, ch, dz, dż, dź**.\n\nKażda sylaba ma samogłoskę. Wyraz przenosimy do nowej linii tylko **między sylabami**.', 'dwuznak'),
      slideTask('Z1', 'Posortuj wyrazy do dwóch skrzyń:\n\n**A - tyle samo liter i głosek**\n**B - więcej liter niż głosek**\n\nchata, gracz, mapa, chmura, dom, miecz, rower, dżem\n\nPrzepisz wyrazy w dwóch grupach. W grupie B podkreśl dwuznaki.', 6 * 60, 'dwuznak', '**A:** mapa, dom, rower\n\n**B:** chata, gracz, chmura, miecz, dżem. W tych wyrazach dwie litery zapisują jedną głoskę.'),
      slideTask('Z2', 'Rozszyfruj ekwipunek gracza. Przy każdym wyrazie zapisz liczbę **liter, głosek i sylab**:\n\n1. mapa\n2. szafa\n3. dżem\n4. chmura\n\nWzór: **mapa - 4 litery, 4 głoski, 2 sylaby: ma-pa**.', 7 * 60, 'sylaby', 'mapa - 4 litery, 4 głoski, 2 sylaby: ma-pa\nszafa - 5 liter, 4 głoski, 2 sylaby: sza-fa\ndżem - 4 litery, 3 głoski, 1 sylaba\nchmura - 6 liter, 5 głosek, 2 sylaby: chmu-ra'),
      slideTask('Z3', 'Administrator serwera może użyć tylko nicku, który ma **dokładnie 6 liter i 5 głosek**.\n\nSprawdź nicki: **Chmura, Rzeka, Gracz, Szyfr**. Zapisz ten, który spełnia warunek, i uzasadnij liczbami.\n\nPotem wymyśl własny wyraz z dwuznakiem i podziel go na sylaby.', 6 * 60, 'dwuznak', '**Chmura** spełnia warunek: ma 6 liter i 5 głosek, ponieważ „ch” zapisuje jedną głoskę. Dzielimy: chmu-ra.\n\nWłasny przykład: szafa - sza-fa.'),
      slideNote('Głoski, litery i sylaby', '- Głoskę słyszymy, literę widzimy i piszemy.\n- Dwuznaki: sz, cz, rz, ch, dz, dż, dź - dwie litery, jedna głoska.\n- Każda sylaba ma samogłoskę. Wyrazy przenosimy między sylabami.'),
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
      slideRead('Otwieramy podręcznik', 25, 28, 'Czytamy wiersz „Autoportret”, oglądamy przykłady opisu i wykonujemy zadania wskazane przez nauczyciela.', 18 * 60),
      slideText('Epitet dodaje obraz i nastrój', '**Epitet** określa rzeczownik i odpowiada na pytania: **jaki? jaka? jakie? czyj?**\n\n„Las” to informacja. **„Ciemny, wilgotny las”** to obraz i nastrój.\n\nNajlepszy epitet jest dokładny. Zamiast „fajny” wybierz słowo, po którym inni zobaczą to samo co ty.', 'opis'),
      slideTask('Z1', 'Dwa opisy tej samej sceny:\n\n**A.** „Awatar wszedł do zamku. Zobaczył korytarz i drzwi.”\n\n**B.** „Samotny awatar wszedł do opuszczonego zamku. Zobaczył mroczny korytarz i żelazne drzwi.”\n\nWypisz epitety z tekstu B. Następnie jednym zdaniem wyjaśnij, jak zmieniły obraz lub nastrój sceny.', 5 * 60, 'opis', 'Epitety: **samotny** awatar, **opuszczony** zamek, **mroczny** korytarz, **żelazne** drzwi. Dzięki nim scena wydaje się niebezpieczna i tajemnicza.'),
      slideTask('Z2', 'Ulepsz opis, ale nie używaj słów **fajny, super, ładny**:\n\n„W Robloxie zobaczyłem parkour. Były tam platformy, światła i tunel.”\n\nPrzepisz tekst, dodając co najmniej **5 trafnych epitetów**. Podkreśl epitety, a rzeczowniki, które określają, otocz kółkiem.', 7 * 60, 'opis', 'Np. „W Robloxie zobaczyłem **podniebny** parkour. Były tam **wąskie, ruchome** platformy, **pulsujące** światła i **ciemny, kręty** tunel.”'),
      slideTask('Z3', 'Zaprojektuj słowny kadr komiksu zatytułowany **„Sekundę przed katastrofą”**.\n\nNapisz 3-4 zdania. Podaj czas, miejsce, bohatera i wydarzenie. Użyj minimum **4 epitetów**, które budują napięcie. Na końcu dopisz, kto jest narratorem.', 8 * 60, 'swiatPrzedstawiony', 'Np. „O północy wszedłem do **pustego** laboratorium. Nad **szklanym** stołem wisiała **czerwona** lampka. Nagle usłyszałem **metaliczny** trzask i podłoga zadrżała. Narrator-bohater: uczestniczę w wydarzeniach i mówię „ja”.”'),
      slideNote('Epitet', '- Epitet to określenie rzeczownika, najczęściej przymiotnik.\n- Odpowiada na pytania: jaki? jaka? jakie? czyj?\n- Epitety tworzą obraz i budują nastrój.'),
    ],
  },
  {
    title: '8. Dlaczego warto być sobą?',
    topic: 'Być sobą mimo opinii innych',
    textbookPage: 29,
    notebookNote: [
      '## Najważniejsze',
      '- Nie da się zadowolić wszystkich - każdy ma inne zdanie.',
      '- **Fakt** można sprawdzić, **opinia** to czyjeś zdanie.',
      '- Pomocna uwaga jest konkretna i życzliwa.', '',
      '## Morał „Nauk mędrca”',
      'Mędrzec i syn po każdej krytyce zmieniali sposób podróży - i zawsze ktoś ich wyśmiał. **Rób to, co uważasz za słuszne, i idź własną drogą.**',
    ].join('\n'),
    questions: [
      { text: 'Dlaczego mędrzec kilka razy zmieniał sposób podróży na bazar?', answer: 'Ponieważ za każdym razem słuchał krytycznych opinii napotkanych ludzi.' },
      { text: 'Co wydarzyło się, gdy mędrzec i syn próbowali zadowolić wszystkich?', answer: 'Każda kolejna grupa i tak ich krytykowała, choć postępowali inaczej.' },
      { text: 'Jaką naukę ojciec przekazał synowi?', answer: 'Nie da się zadowolić wszystkich, więc trzeba rozważać rady i postępować zgodnie z własnym rozsądkiem.' },
      { text: 'Czym różni się opinia od faktu?', answer: 'Fakt można sprawdzić, a opinia jest czyimś zdaniem lub oceną.' },
      { text: 'Co warto zrobić przed przyjęciem cudzej oceny?', answer: 'Sprawdzić, czy jest konkretna, oparta na faktach i wypowiedziana z dobrą intencją.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Dlaczego warto być sobą?'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 29, 32, 'Czytamy „Nauki mędrca”, uzupełniamy tabelę wydarzeń i rozmawiamy o tym, dlaczego nie da się spełnić wszystkich cudzych oczekiwań.', 20 * 60),
      slideText('Przypomnienie: fakt, opinia i bohater', 'Z tekstu potrafisz już wydobyć **fakty** i oddzielić je od **opinii**. Bohatera poznajesz po jego czynach, słowach i decyzjach.\n\nW „Naukach mędrca” sprawdź: **co się wydarzyło**, **co oceniali przechodnie** i **jak ich słowa wpływały na bohaterów**.', 'cechyBohatera'),
      slideTask('Z1', 'Na klasowym czacie pojawiły się trzy komentarze o prezentacji Mai:\n\n1. „Słabo”.\n2. „Za szybko mówiłaś, dlatego nie usłyszałem dwóch przykładów”.\n3. „Zmień temat, bo ja go nie lubię”.\n\nPodziel komentarze na **pomocne** i **niepomocne**. Przy każdym zapisz krótki powód. Potem przeredaguj jeden niepomocny komentarz tak, aby naprawdę pomagał.', 7 * 60, undefined, '**Pomocny:** 2, bo wskazuje konkretny problem i jego skutek.\n**Niepomocne:** 1, bo nie podaje powodu; 3, bo opiera się wyłącznie na upodobaniu autora.\n\nNp. „Temat jest ciekawy, ale dodaj przykład, który wyjaśni najtrudniejsze pojęcie”.'),
      slideTask('Z2', 'Dopisz do opowiadania krótkie zakończenie z punktu widzenia **syna**, czyli narratora-bohatera. Napisz **3 zdania**.\n\nUżyj dwóch epitetów opisujących bazar albo przechodniów oraz zdania zaczynającego się od **„Zrozumiałem, że...”**.', 7 * 60, 'narrator', 'Np. „Patrzyłem na gwarny bazar i surowe twarze przechodniów. Zrozumiałem, że nie zadowolimy wszystkich. Od tej pory chciałem słuchać rad, ale decyzje podejmować po namyśle.”'),
      slideNote('Warto być sobą', '- Nie da się zadowolić wszystkich - każdy ma inne zdanie.\n- Fakt można sprawdzić, opinia to czyjeś zdanie.\n- Pomocna uwaga jest konkretna i życzliwa.'),
    ],
  },
  {
    title: '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
    topic: 'Kreatywność rośnie od pierwszej próby',
    textbookPage: 33,
    notebookNote: [
      '## Najważniejsze',
      '- Międzynarodowy Dzień Kropki obchodzimy **15 września**.',
      '- **Kreatywność** to tworzenie nowych pomysłów.', '',
      '## O czym były teksty',
      'Vashti zaczęła od jednej kropki, uwierzyła w siebie, a potem tak samo zachęciła chłopca. **Wielkie rzeczy zaczynają się od małej próby.**',
    ].join('\n'),
    questions: [
      { text: 'Kiedy obchodzimy Międzynarodowy Dzień Kropki?', answer: '15 września.' },
      { text: 'Dlaczego Vashti narysowała pierwszą kropkę?', answer: 'Nie wierzyła, że potrafi rysować, a nauczycielka zachęciła ją, by postawiła znak i sprawdziła, co się stanie.' },
      { text: 'Co zmieniło nastawienie Vashti?', answer: 'Nauczycielka oprawiła i powiesiła jej podpisaną pracę, dzięki czemu Vashti poczuła, że warto próbować dalej.' },
      { text: 'Jak Vashti pomogła chłopcu na wystawie?', answer: 'Poprosiła go, by narysował kreskę, a potem podpisał swoją pracę.' },
      { text: 'Co to jest kreatywność?', answer: 'Tworzenie nowych pomysłów albo nowych sposobów wykorzystania znanych rzeczy.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Międzynarodowy Dzień Kropki'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 33, 36, 'Czytamy teksty o Dniu Kropki, historię Vashti oraz krótkie utwory o kresce i pomyśle. Zwracamy uwagę na moment, w którym bohaterowie zaczynają wierzyć we własne możliwości.', 24 * 60),
      slideText('Przypomnienie: pomysł potrzebuje kolejnej próby', 'Z wcześniejszych lekcji pamiętasz **świat przedstawiony**, **narratora** i **epitet**. Teraz użyjesz ich, by rozwinąć prosty znak w krótki tekst.\n\nPodczas czytania sprawdź, co uruchomiło zmianę u Vashti i jak dziewczynka przekazała tę samą zachętę dalej.', 'opowiadanie'),
      slideTask('Z1', 'Jedna kropka staje się początkiem historii. Napisz **4 zdania** jako narrator-bohater.\n\nW tekście muszą pojawić się: miejsce, niespodziewane wydarzenie i dwa epitety. Ostatnie zdanie ma pokazać, w co zmieniła się kropka.', 8 * 60, 'opowiadanie', 'Np. „Na ciemnym ekranie zobaczyłem małą czerwoną kropkę. Dotknąłem jej i usłyszałem trzask. Nagle cały pokój zniknął. Kropka zmieniła się w planetę, na której właśnie wylądowałem.”'),
      slideTask('Z2', 'Dwie osoby komentują rysunek kolegi:\n\n**A.** „Ładne”.\n**B.** „Podoba mi się, jak z jednej kreski zrobiłeś ruch smoka. Co narysujesz w następnej scenie?”\n\nNapisz, który komentarz lepiej rozwija kreatywność i dlaczego. Potem ułóż własny komentarz, który zawiera **konkretne spostrzeżenie** i **pytanie otwierające następny krok**.', 6 * 60, undefined, 'Komentarz B pomaga bardziej, bo wskazuje konkretny element pracy i zachęca do dalszego tworzenia. Np. „Ciekawie połączyłaś dwa kolory w tle. Jak zmieni się obraz, jeśli dodasz trzeci?”'),
      slideNote('Dzień Kropki', '- Międzynarodowy Dzień Kropki obchodzimy 15 września.\n- Kreatywność to tworzenie nowych pomysłów.\n- Zaczynamy od małego znaku i próbujemy dalej.'),
    ],
  },
  {
    title: '11. Czas na czasownik',
    topic: 'Czasownik - czynności, stany i pisownia z „nie”',
    textbookPage: 37,
    notebookNote: [
      '## Najważniejsze',
      '- **Czasownik** nazywa czynności i stany.',
      '- Odpowiada na pytania: **co robi? co się z nim dzieje?**',
      '- **„Nie”** z czasownikami piszemy **oddzielnie**: nie piszę.', '',
      '## Przykład',
      '**gra** - czynność, **marzy** - stan, **nie gram** - osobno.',
    ].join('\n'),
    questions: [
      { text: 'Co nazywa czasownik?', answer: 'Czynności i stany.' },
      { text: 'Na jakie dwa pytania odpowiada czasownik?', answer: 'Co robi? Co się z nim dzieje?' },
      { text: 'Czy wyraz „marzy” oznacza czynność czy stan?', answer: 'Stan.' },
      { text: 'Jak zapisujemy „nie” z czasownikami?', answer: 'Oddzielnie, np. nie piszę.' },
      { text: 'Podaj czasownik w trzech czasach.', answer: 'Np. grał, gra, będzie grał.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Czas na czasownik'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 37, 39, 'Przypominamy, czym jest czasownik, rozróżniamy czynności i stany oraz ćwiczymy zapis czasowników z przeczeniem „nie”.', 18 * 60),
      slideText('Przypomnienie: czasownik', 'Czasownik odpowiada na pytanie **co robi?** albo **co się z nim dzieje?**. Rozpoznajesz go też po zmianie czasu: **grał - gra - będzie grał**.\n\nPodczas pracy z podręcznikiem przypomnij sobie jeszcze jedną zasadę: **nie** z czasownikami zapisujemy oddzielnie.', 'czasownik'),
      slideVideo('czasownik-film1'),
      slideTask('Z1', 'Wyszukaj czasowniki w tekście:\n\n„Olek uruchomił grę, ale nie wszedł od razu na serwer. Czytał wiadomości, martwił się wynikiem, a potem dołączył do drużyny.”\n\nPodziel je na **czynności** i **stany**. Przy formie z **nie** zapisz regułę pisowni.', 7 * 60, 'czasownik', '**Czynności:** uruchomił, nie wszedł, czytał, dołączył.\n**Stany:** martwił się.\n„Nie” z czasownikami zapisujemy oddzielnie.'),
      slideTask('Z2', 'Napisz **3 zdania** o jednym bohaterze: pierwsze w czasie przeszłym, drugie w teraźniejszym, trzecie w przyszłym.\n\nPisz jako narrator-bohater. Użyj jednego epitetu oraz jednego czasownika z przeczeniem **nie**. Podkreśl czasowniki.', 7 * 60, 'narrator', 'Np. „Wczoraj wszedłem do ciemnej jaskini. Dziś nie boję się już echa. Jutro odnajdę ukryte wyjście.”'),
      slideNote('Czasownik', '- Czasownik nazywa czynności i stany.\n- Odpowiada na pytania: co robi? co się z nim dzieje?\n- „Nie” z czasownikami piszemy oddzielnie: nie piszę.'),
    ],
  },
  {
    title: '12-13. Misja odmiana! Tajemnice czasownika',
    topic: 'Osoba, liczba, rodzaj i czas czasownika',
    textbookPage: 40,
    notebookNote: [
      '## Najważniejsze',
      '- Czasownik odmienia się przez **osoby, liczby i czasy**.',
      '- W czasie przeszłym także przez **rodzaje**: zrobił, zrobiła, zrobiło.',
      '- Formy **nieosobowe**: bezokolicznik (robić) i formy na **-no, -to**.', '',
      '## Przykład',
      '**zbudowałyście** - 2. os., liczba mnoga, czas przeszły, rodzaj niemęskoosobowy.',
    ].join('\n'),
    questions: [
      { text: 'Przez jakie kategorie odmienia się czasownik?', answer: 'Przez osoby, liczby, czasy, a w części form także przez rodzaje.' },
      { text: 'Jaka to osoba i liczba: „robimy”?', answer: 'Pierwsza osoba liczby mnogiej.' },
      { text: 'Jaki to czas: „będę czytać”?', answer: 'Czas przyszły.' },
      { text: 'Kiedy można określić rodzaj czasownika?', answer: 'Między innymi w czasie przeszłym, np. zrobił, zrobiła, zrobiło.' },
      { text: 'Podaj dwa rodzaje form nieosobowych.', answer: 'Bezokolicznik oraz formy zakończone na -no, -to.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Misja odmiana! Tajemnice czasownika'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 40, 42, 'Poznajemy kategorie gramatyczne czasownika: osobę, liczbę, czas i rodzaj. Odróżniamy formy osobowe od nieosobowych.', 20 * 60),
      slideText('Przypomnienie: forma czasownika', 'Przy czasowniku sprawdzasz: **kto? ilu? kiedy?** W czasie przeszłym często rozpoznajesz także rodzaj.\n\nPamiętaj o formach, które nie wskazują wykonawcy: bezokoliczniku **robić** oraz formach **zrobiono, umyto**.', 'czasownikOdmiana'),
      slideVideo('czasownik-film2'),
      slideTask('Z1', 'Dla każdej formy podaj **osobę, liczbę i czas**. Jeśli można, dopisz rodzaj:\n\n- zbudowałyście\n- gram\n- napiszą\n- czytaliśmy\n\nNa końcu wskaż formę, przy której nie da się określić rodzaju.', 8 * 60, 'czasownikOdmiana', '**zbudowałyście:** 2. os., lm., przeszły, niemęskoosobowy\n**gram:** 1. os., lp., teraźniejszy\n**napiszą:** 3. os., lm., przyszły\n**czytaliśmy:** 1. os., lm., przeszły, męskoosobowy\nRodzaju nie określimy przy „gram” i „napiszą”.'),
      slideTask('Z2', 'Przekształć zdanie **„Buduję bezpieczną bazę”** zgodnie z poleceniami:\n\n1. 1. osoba liczby mnogiej, czas przeszły\n2. 3. osoba liczby pojedynczej, czas przyszły\n3. bezokolicznik\n4. forma zakończona na **-no**\n\nDo jednej formy osobowej dodaj przeczenie **nie** i zapisz je poprawnie.', 8 * 60, 'czasownikOdmiana', '1. Budowaliśmy bezpieczną bazę.\n2. Zbuduje bezpieczną bazę.\n3. Budować bezpieczną bazę.\n4. Zbudowano bezpieczną bazę.\nNp. Nie budowaliśmy bezpiecznej bazy.'),
      slideNote('Odmiana czasownika', '- Czasownik odmienia się przez osoby, liczby i czasy.\n- W czasie przeszłym także przez rodzaje: zrobił, zrobiła, zrobiło.\n- Formy nieosobowe: bezokolicznik (robić) i formy na -no, -to.'),
    ],
  },
  {
    title: '14. Czy każda nasza wypowiedź jest zdaniem?',
    topic: 'Zdanie i równoważnik zdania',
    textbookPage: 43,
    notebookNote: [
      '## Najważniejsze',
      '- **Zdanie** zawiera czasownik w formie osobowej.',
      '- **Równoważnik zdania** go nie ma.',
      '- Równoważniki przydają się w planach i ogłoszeniach.', '',
      '## Przykład',
      '„**Pracujemy** w ogrodzie” - zdanie. „Praca w ogrodzie” - równoważnik zdania.',
    ].join('\n'),
    questions: [
      { text: 'Co to jest wypowiedzenie?', answer: 'Słowo lub grupa słów, za pomocą których przekazujemy informację, pytanie, polecenie albo uczucie.' },
      { text: 'Po czym rozpoznasz zdanie?', answer: 'Zawiera czasownik w formie osobowej.' },
      { text: 'Czym różni się równoważnik zdania od zdania?', answer: 'Nie zawiera czasownika w formie osobowej.' },
      { text: 'Czy wypowiedzenie „Nie wychylać się” jest zdaniem?', answer: 'Nie. Zawiera bezokolicznik, więc jest równoważnikiem zdania.' },
      { text: 'Gdzie przydają się równoważniki zdań?', answer: 'Np. w planach, ogłoszeniach, nagłówkach i krótkich instrukcjach.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Czy każda nasza wypowiedź jest zdaniem?'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 43, 45, 'Odróżniamy zdania od równoważników zdań, szukamy osobowych form czasownika i przekształcamy jedne wypowiedzenia w drugie.', 18 * 60),
      slideText('Przypomnienie: osobowa forma czasownika', 'Zdanie rozpoznajesz po **czasowniku w formie osobowej**. W równoważniku takiej formy nie ma.\n\nWykorzystaj wiedzę z poprzedniego tematu: jeśli przy czasowniku możesz określić osobę, wypowiedzenie jest zdaniem. Bezokolicznik tego warunku nie spełnia.', 'rodzajeZdan'),
      slideTask('Z1', 'Oznacz wypowiedzenia literą **Z** - zdanie albo **R** - równoważnik zdania. W zdaniach określ osobę czasownika:\n\n1. Spokój w ogrodzie.\n2. Poczekasz na mnie?\n3. Zrobiłem to!\n4. Gramatyka opanowana.\n5. Koniecznie to zapisz.\n6. Bałagan na biurku.', 7 * 60, 'rodzajeZdan', '1. R\n2. Z - poczekasz, 2. os.\n3. Z - zrobiłem, 1. os.\n4. R\n5. Z - zapisz, 2. os.\n6. R'),
      slideTask('Z2', 'Napisz **czteropunktowy plan popołudnia** za pomocą równoważników zdań. Następnie wybierz dwa punkty i przekształć je w zdania: jedno w czasie przeszłym, drugie w przyszłym.\n\nW zdaniach podkreśl czasowniki i określ ich osobę.', 8 * 60, 'rodzajeZdan', 'Np. R: „Powrót ze szkoły”. Z: „Wróciłem ze szkoły o czternastej” - 1. os., czas przeszły. R: „Trening piłki nożnej”. Z: „Pójdę na trening o szesnastej” - 1. os., czas przyszły.'),
      slideNote('Zdanie i równoważnik zdania', '- Zdanie ma czasownik w formie osobowej: Pracujemy w ogrodzie.\n- Równoważnik zdania go nie ma: Praca w ogrodzie.\n- Równoważniki przydają się w planach i ogłoszeniach.'),
    ],
  },
  {
    title: '15. Tworzymy plan ramowy',
    topic: 'Plan ramowy - najważniejsze wydarzenia po kolei',
    textbookPage: 46,
    notebookNote: [
      '## Najważniejsze',
      '- **Plan ramowy** to najważniejsze wydarzenia w punktach, bez szczegółów.',
      '- Punkty układamy w **kolejności chronologicznej**.',
      '- Zapis **jednolity**: same zdania albo same równoważniki zdań.', '',
      '## Morał „Historii o akceptacji”',
      'Każdy może się pomylić - nawet dorosły. Gdy zwracamy komuś uwagę, **liczy się forma i życzliwość**. Warto rozmawiać i tłumaczyć.',
    ].join('\n'),
    questions: [
      { text: 'Co to jest plan ramowy?', answer: 'Spisane w punktach najważniejsze wydarzenia opowieści, bez podawania szczegółów.' },
      { text: 'W jakiej kolejności zapisujemy punkty planu ramowego?', answer: 'W kolejności chronologicznej - od pierwszego do ostatniego wydarzenia.' },
      { text: 'Co znaczy, że plan ramowy ma być jednolity?', answer: 'Wszystkie punkty zapisujemy tak samo: albo zdaniami, albo równoważnikami zdań.' },
      { text: 'Jak przekształcić równoważnik zdania w zdanie?', answer: 'Dodać czasownik w formie osobowej, np. „Odpowiedź Bartka” - „Bartek odpowiedział na pytanie”.' },
      { text: 'Gdzie na co dzień przydaje się plan ramowy?', answer: 'Np. przy planie dnia albo liście rzeczy do zrobienia.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Tworzymy plan ramowy'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 46, 49, 'Czytamy „Historię o akceptacji. Stoję murem za Bartkiem”, porządkujemy wydarzenia z lekcji pani Temperówki i uczymy się zapisywać je jako plan ramowy.', 22 * 60),
      slideText('Przypomnienie: plan ramowy', 'Plan ramowy to spisane po kolei **najważniejsze wydarzenia** - bez szczegółów.\n\nDwie zasady: punkty układamy w **kolejności chronologicznej** i zapisujemy **jednolicie** - wszystkie jako zdania albo wszystkie jako równoważniki zdań, które znasz z poprzedniej lekcji.', 'kolejnoscZdarzen'),
      slideTask('Z1', 'Ktoś pomieszał plan ramowy „Historii o akceptacji”. Zapisz punkty we właściwej kolejności:\n\n- Śmiech klasy.\n- Uwaga dla Bartka.\n- Pytanie pani o znaczenie słowa „akceptować”.\n- Obrona Bartka przez Miłosza.\n- Wyjaśnienie Bartka, czym jest akceptacja.\n- Wsparcie mamy i taty dla Miłosza.', 7 * 60, undefined, '1. Pytanie pani o znaczenie słowa „akceptować”.\n2. Wyjaśnienie Bartka, czym jest akceptacja.\n3. Śmiech klasy.\n4. Uwaga dla Bartka.\n5. Obrona Bartka przez Miłosza.\n6. Wsparcie mamy i taty dla Miłosza.'),
      slideTask('Z2', 'Zapisz **plan ramowy** wyprawy w grze (np. Minecraft albo Roblox) w **5 punktach**. Użyj samych równoważników zdań.\n\nPotem przekształć dwa punkty w zdania: jedno w czasie przeszłym, drugie w przyszłym. Podkreśl czasowniki.', 8 * 60, 'kolejnoscZdarzen', 'Np. „1. Zbiórka ekwipunku. 2. Wyprawa do jaskini. 3. Walka ze szkieletem. 4. Powrót do bazy. 5. Budowa wieży.”\n\n„Zebrałem ekwipunek” - czas przeszły. „Zbuduję wieżę” - czas przyszły.'),
      slideNote('Plan ramowy', '- Plan ramowy to najważniejsze wydarzenia w punktach, bez szczegółów.\n- Punkty układamy w kolejności chronologicznej.\n- Zapis jednolity: same zdania albo same równoważniki zdań.'),
    ],
  },
  {
    title: '16. Co już wiesz? Co umiesz?',
    topic: 'Powtórzenie działu I - o emocjach, relacjach i uczeniu się',
    textbookPage: 50,
    notebookNote: [
      '## Najważniejsze',
      '- **Świat przedstawiony**: czas, miejsce, bohaterowie, wydarzenia.',
      '- **Epitet** określa: jedwabna chusteczka.',
      '- **Zdanie** ma czasownik w formie osobowej, **równoważnik** - nie.', '',
      '## Morał baśni o księciu',
      'Książę jako żaba poznał osobę, która polubiła go za to, jaki jest. **Nie udawaj innych i nie wstydź się tego, kim jesteś.**',
    ].join('\n'),
    questions: [
      { text: 'Co składa się na świat przedstawiony utworu?', answer: 'Czas i miejsce wydarzeń, bohaterowie oraz wydarzenia.' },
      { text: 'Po czym poznasz, że wypowiedzenie jest zdaniem?', answer: 'Zawiera czasownik w formie osobowej.' },
      { text: 'Co to jest epitet? Podaj przykład.', answer: 'Wyraz określający, np. „jedwabna chusteczka”.' },
      { text: 'Dlaczego książę chciał być żabą?', answer: 'Chciał znaczyć tak mało jak ona - sprawdzić, czy ktoś doceni go za to, kim jest, a nie za tytuł i majątek.' },
      { text: 'Jaką radę dała księciu dziewczyna?', answer: 'Nie udawać kogoś innego i nie uważać się za lepszego, ale też nie wstydzić się tego, kim się jest.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Co już wiesz? Co umiesz?'),
      ...recap(previousSetId),
      slideRead('Otwieramy podręcznik', 50, 53, 'Czytamy baśń „Książę, który chciał być żabą” i powtarzamy wiadomości z całego działu: świat przedstawiony, epitety, czasownik oraz zdania i równoważniki zdań.', 24 * 60),
      slideText('Powtórka działu: mapa pojęć', 'Za Tobą cały dział. Sprawdź, czy pamiętasz: **świat przedstawiony** i **narratora**, **epitet**, **głoski, litery i sylaby**, **czasownik** i jego formy oraz **zdanie i równoważnik zdania**.\n\nJeśli któreś pojęcie ucieka, zajrzyj do mapy na s. 50 - to ściąga z całego rozdziału.', 'swiatPrzedstawiony'),
      slideTask('Z1', 'Przeczytaj wypowiedzenia z baśni i spoza niej:\n\n1. „Dość tego!”\n2. „Nie zamierzam się żenić!”\n3. „Twoje życzenie jest dla mnie rozkazem!”\n4. „Spokój w stawie.”\n\nOznacz je literami **Z** - zdanie albo **R** - równoważnik. W zdaniach wskaż czasownik w formie osobowej i określ jego osobę, liczbę i czas.', 8 * 60, undefined, '1. R\n2. Z - nie zamierzam: 1. os., lp., czas teraźniejszy\n3. Z - jest: 3. os., lp., czas teraźniejszy\n4. R'),
      slideTask('Z2', 'Czarownik zamienił Cię w zwierzę (albo w moba z gry). Napisz **4 zdania** jako narrator-bohater o tym, czego się nauczyłeś w nowej postaci.\n\nUżyj dwóch epitetów i jednego czasownika z przeczeniem **nie**. Ostatnie zdanie zacznij od **„Zrozumiałem, że...”**.', 8 * 60, 'narrator', 'Np. „Czarownik zamienił mnie w małego, szarego wilka. Biegałem po ciemnym lesie i nikt mnie nie poznawał. Nauczyłem się patrzeć na świat z dołu. Zrozumiałem, że jestem wart tyle samo w każdej postaci.”'),
      slideNote('Powtórzenie działu I', '- Świat przedstawiony: czas, miejsce, bohaterowie, wydarzenia.\n- Epitet określa: jedwabna chusteczka.\n- Zdanie ma czasownik w formie osobowej, równoważnik - nie.\n- Nie udawaj innych i nie wstydź się tego, kim jesteś.'),
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

/**
 * Tematy z dawnego, zbyt szerokiego pakietu usuwane przy jego odswiezeniu.
 * Dawniej siedzialy tu tematy 15-16 - dzis sa pelnoprawnymi pozycjami TOPICS,
 * wiec refresh dopasowuje je po tytule zamiast kasowac.
 */
export const RETIRED_TEXTBOOK4_TITLES = new Set<string>([]);

function slideTopic(topic: string): Slide {
  return { id: newId(), kind: 'topic', topic, variant: 'write' };
}

function slideRead(title: string, page: number, pageTo: number, body: string, timerSec: number): Slide { return { id: newId(), kind: 'read', title, source: 'Podręcznik', page, pageTo, body, timerSec }; }
function slideText(title: string, body: string, art?: SlideArt): Slide { return { id: newId(), kind: 'text', title, body, art }; }
function slideTask(code: string, body: string, timerSec: number, art?: SlideArt, answerExample?: string): Slide {
  return { id: newId(), kind: 'task', code, body, timerSec, art, answerExample, studentAction: 'write-answer' };
}
function slideRecap(questionSetId: string): Slide { return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' }; }
/** Notatka zamykajaca lekcje: "Temat: <krotka nazwa>" + kilka linijek do przepisania. */
function slideVideo(videoId: string): Slide { return { id: newId(), kind: 'video', videoId }; }
function slideNote(temat: string, body: string): Slide {
  return { id: newId(), kind: 'note', title: 'Notatka do zeszytu', body: `**Temat:** ${temat}\n${body}` };
}
function recap(questionSetId?: string): Slide[] { return questionSetId ? [slideRecap(questionSetId)] : []; }
