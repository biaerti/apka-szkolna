// Pelny tekst podstawy programowej jezyka polskiego dla klas IV-VI
// (II etap edukacyjny), w brzmieniu po "uszczupleniu" z 2024 r.
// Zrodlo: rozporzadzenie Ministra Edukacji z 28 czerwca 2024 r. (Dz.U. 2024 poz. 996),
// obowiazuje od roku szkolnego 2024/2025.
// UWAGA: to osobny plik od podstawa.ts (tam sa skrocone opisy kodow do dziennika Vulcan).

export interface PodstawaPunkt {
  kod: string;
  tekst: string;
}

export interface PodstawaDzial {
  id: string;
  tytul: string;
  // Fraza otwierajaca liste punktow, np. "Uczen:"
  wstep?: string;
  punkty: PodstawaPunkt[];
}

export interface PodstawaSekcja {
  id: string;
  tytul: string;
  opis?: string;
  dzialy: PodstawaDzial[];
}

export const PODSTAWA_SEKCJE: PodstawaSekcja[] = [
  {
    id: 'cele',
    tytul: 'Cele kształcenia - wymagania ogólne',
    dzialy: [
      {
        id: 'cele-I',
        tytul: 'I. Kształcenie literackie i kulturowe',
        punkty: [
          { kod: 'I.1', tekst: 'Wyrabianie i rozwijanie zdolności rozumienia utworów literackich oraz innych tekstów kultury.' },
          { kod: 'I.2', tekst: 'Znajomość wybranych utworów z literatury polskiej i światowej oraz umiejętność mówienia o nich z wykorzystaniem potrzebnej terminologii.' },
          { kod: 'I.3', tekst: 'Kształtowanie umiejętności uczestniczenia w kulturze polskiej i europejskiej, szczególnie w jej wymiarze symbolicznym i aksjologicznym.' },
          { kod: 'I.4', tekst: 'Rozwijanie zdolności dostrzegania wartości: prawdy, dobra, piękna, szacunku dla człowieka i otaczającej go przyrody oraz kierowania się tymi wartościami.' },
          { kod: 'I.5', tekst: 'Kształcenie postawy szacunku dla przeszłości i tradycji kulturowej jako podstawy tożsamości narodowej.' },
          { kod: 'I.6', tekst: 'Rozwijanie zainteresowania kulturą w środowisku lokalnym i potrzeby uczestnictwa w wydarzeniach kulturalnych.' },
        ],
      },
      {
        id: 'cele-II',
        tytul: 'II. Kształcenie językowe',
        punkty: [
          { kod: 'II.1', tekst: 'Rozwijanie rozumienia wartości języka ojczystego oraz jego funkcji w budowaniu tożsamości osobowej ucznia oraz wspólnot: rodzinnej, narodowej i kulturowej.' },
          { kod: 'II.2', tekst: 'Rozwijanie rozumienia twórczego i sprawczego charakteru działań językowych oraz formowanie odpowiedzialności za własne zachowania językowe.' },
          { kod: 'II.3', tekst: 'Poznawanie podstawowych pojęć oraz terminów służących do opisywania języka i językowego komunikowania się ludzi.' },
          { kod: 'II.4', tekst: 'Kształcenie umiejętności porozumiewania się (słuchania, czytania, mówienia i pisania) w różnych sytuacjach oficjalnych i nieoficjalnych, w tym także z osobami doświadczającymi trudności w komunikowaniu się.' },
          { kod: 'II.5', tekst: 'Kształcenie umiejętności poprawnego mówienia oraz pisania zgodnego z zasadami ortofonii oraz pisowni polskiej.' },
          { kod: 'II.6', tekst: 'Rozwijanie wiedzy o elementach składowych wypowiedzi ustnych i pisemnych oraz ich funkcjach w strukturze tekstów i w komunikowaniu się.' },
        ],
      },
      {
        id: 'cele-III',
        tytul: 'III. Tworzenie wypowiedzi',
        punkty: [
          { kod: 'III.1', tekst: 'Rozwijanie umiejętności wypowiadania się w określonych formach wypowiedzi ustnych i pisemnych.' },
          { kod: 'III.2', tekst: 'Kształcenie umiejętności wygłaszania, recytacji i interpretacji głosowej tekstów mówionych, doskonalenie dykcji i operowania głosem.' },
          { kod: 'III.3', tekst: 'Rozpoznawanie intencji rozmówcy oraz wyrażanie intencji własnych.' },
          { kod: 'III.4', tekst: 'Rozwijanie umiejętności stosowania środków stylistycznych i dbałości o estetykę tekstu oraz umiejętności organizacji tekstu.' },
          { kod: 'III.5', tekst: 'Poznawanie podstawowych zasad retoryki, w szczególności argumentowania, oraz rozpoznawanie manipulacji językowej.' },
          { kod: 'III.6', tekst: 'Rozbudzanie potrzeby podejmowania samodzielnych prób literackich.' },
        ],
      },
      {
        id: 'cele-IV',
        tytul: 'IV. Samokształcenie',
        punkty: [
          { kod: 'IV.1', tekst: 'Rozwijanie szacunku dla wiedzy, wyrabianie pasji poznawania świata i zachęcanie do praktycznego zastosowania zdobytych wiadomości.' },
          { kod: 'IV.2', tekst: 'Rozwijanie umiejętności samodzielnego docierania do informacji, dokonywania ich selekcji, syntezy oraz wartościowania.' },
          { kod: 'IV.3', tekst: 'Rozwijanie umiejętności rzetelnego korzystania ze źródeł wiedzy, w tym stosowania cudzysłowu, przypisów i odsyłaczy, oraz szacunku dla cudzej własności intelektualnej.' },
          { kod: 'IV.4', tekst: 'Kształcenie nawyków systematycznego uczenia się oraz porządkowania zdobytej wiedzy i jej pogłębiania.' },
          { kod: 'IV.5', tekst: 'Zachęcanie do rozwijania swoich uzdolnień przez udział w różnych formach poszerzania wiedzy, np. w konkursach, olimpiadach przedmiotowych, oraz rozwijanie umiejętności samodzielnej prezentacji wyników swojej pracy.' },
          { kod: 'IV.6', tekst: 'Rozwijanie umiejętności efektywnego posługiwania się nowymi technologiami w poszukiwaniu, porządkowaniu i wykorzystywaniu pozyskanych informacji.' },
        ],
      },
    ],
  },
  {
    id: 'tresci',
    tytul: 'Treści nauczania - wymagania szczegółowe (klasy IV-VI)',
    dzialy: [
      {
        id: 'I.1',
        tytul: 'I.1. Kształcenie literackie i kulturowe - czytanie utworów literackich',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'I.1.1', tekst: 'omawia elementy świata przedstawionego, wyodrębnia obrazy poetyckie w poezji;' },
          { kod: 'I.1.2', tekst: 'rozpoznaje fikcję literacką; rozróżnia elementy realistyczne i fantastyczne w utworach;' },
          { kod: 'I.1.3', tekst: 'rozpoznaje czytany utwór jako baśń, legendę, bajkę, hymn, przypowieść, mit, opowiadanie, nowelę i powieść oraz wskazuje jego cechy gatunkowe; rozpoznaje odmiany powieści i opowiadania np. obyczajowe, przygodowe, detektywistyczne, fantastycznonaukowe, fantasy;' },
          { kod: 'I.1.4', tekst: 'zna i rozpoznaje w tekście literackim: epitet, porównanie, przenośnię, uosobienie, ożywienie, wyrazy dźwiękonaśladowcze, zdrobnienie, zgrubienie, apostrofę, pytanie retoryczne, powtórzenie oraz określa ich funkcje;' },
          { kod: 'I.1.5', tekst: 'omawia funkcje elementów konstrukcyjnych utworu, w tym tytułu, podtytułu, motta, puenty, punktu kulminacyjnego;' },
          { kod: 'I.1.6', tekst: 'rozpoznaje elementy rytmizujące wypowiedź, w tym wers, rym, strofę i refren;' },
          { kod: 'I.1.7', tekst: 'opowiada o wydarzeniach fabuły oraz ustala kolejność zdarzeń i rozumie ich wzajemną zależność;' },
          { kod: 'I.1.8', tekst: 'odróżnia dialog od monologu, rozumie ich funkcje w utworze;' },
          { kod: 'I.1.9', tekst: 'charakteryzuje podmiot liryczny, narratora i bohaterów w czytanych utworach;' },
          { kod: 'I.1.10', tekst: 'rozróżnia narrację pierwszoosobową i trzecioosobową oraz wskazuje ich funkcje w utworze;' },
          { kod: 'I.1.11', tekst: 'wskazuje w utworze bohaterów głównych i drugoplanowych oraz określa ich cechy;' },
          { kod: 'I.1.12', tekst: 'określa tematykę oraz problematykę utworu;' },
          { kod: 'I.1.13', tekst: 'wskazuje i omawia wątek główny oraz wątki poboczne;' },
          { kod: 'I.1.14', tekst: 'nazywa wrażenia, jakie wzbudza w nim czytany tekst;' },
          { kod: 'I.1.15', tekst: 'objaśnia znaczenia dosłowne i przenośne w tekstach;' },
          { kod: 'I.1.16', tekst: 'przedstawia własne rozumienie utworu i je uzasadnia;' },
          { kod: 'I.1.17', tekst: 'wykorzystuje w interpretacji tekstów doświadczenia własne oraz elementy wiedzy o kulturze;' },
          { kod: 'I.1.18', tekst: 'wyraża własny sąd o postaciach i zdarzeniach oraz określa wartości ważne dla bohatera.' },
        ],
      },
      {
        id: 'I.2',
        tytul: 'I.2. Kształcenie literackie i kulturowe - odbiór tekstów kultury',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'I.2.1', tekst: 'identyfikuje wypowiedź jako tekst informacyjny, publicystyczny lub reklamowy;' },
          { kod: 'I.2.2', tekst: 'wyszukuje w tekście informacje wyrażone wprost i pośrednio;' },
          { kod: 'I.2.3', tekst: 'określa temat i główną myśl tekstu;' },
          { kod: 'I.2.4', tekst: 'dostrzega relacje między częściami wypowiedzi (np. tytuł, wstęp, rozwinięcie, zakończenie);' },
          { kod: 'I.2.5', tekst: 'odróżnia zawarte w tekście informacje ważne od drugorzędnych;' },
          { kod: 'I.2.6', tekst: 'odróżnia informacje o faktach od opinii;' },
          { kod: 'I.2.7', tekst: 'charakteryzuje komiks jako tekst kultury; wskazuje charakterystyczne dla niego cechy;' },
          { kod: 'I.2.8', tekst: 'rozumie swoistość tekstów kultury przynależnych do: literatury, teatru, filmu, muzyki, sztuk plastycznych i audiowizualnych;' },
          { kod: 'I.2.9', tekst: 'wyodrębnia elementy składające się na spektakl teatralny i film (reżyseria, gra aktorska, dekoracja, charakteryzacja, kostiumy, rekwizyty, muzyka); wskazuje cechy charakterystyczne przekazów audiowizualnych (filmu, programu informacyjnego, programu rozrywkowego);' },
          { kod: 'I.2.10', tekst: 'rozumie, czym jest adaptacja utworu literackiego oraz wskazuje różnice między tekstem literackim a jego adaptacją;' },
          { kod: 'I.2.11', tekst: 'odnosi treści tekstów kultury do własnego doświadczenia;' },
          { kod: 'I.2.12', tekst: 'dokonuje odczytania tekstów poprzez przekład intersemiotyczny (np. rysunek, drama, spektakl teatralny);' },
          { kod: 'I.2.13', tekst: 'świadomie i z uwagą odbiera filmy oraz spektakle, zwłaszcza adresowane do dzieci i młodzieży.' },
        ],
      },
      {
        id: 'II.1',
        tytul: 'II.1. Kształcenie językowe - gramatyka języka polskiego',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'II.1.1', tekst: 'rozpoznaje w wypowiedziach części mowy (czasownik, rzeczownik, przymiotnik, przysłówek, liczebnik, zaimek, przyimek, spójnik, partykuła, wykrzyknik) i określa ich funkcje w tekście;' },
          { kod: 'II.1.2', tekst: 'odróżnia części mowy odmienne od nieodmiennych;' },
          { kod: 'II.1.3', tekst: 'dostrzega rolę czasownika w wypowiedzi, odróżnia czasowniki dokonane od niedokonanych, rozpoznaje bezosobowe formy czasownika: formy zakończone na -no, -to, konstrukcje z się; rozumie ich znaczenie w wypowiedzeniu oraz funkcje w tekście;' },
          { kod: 'II.1.4', tekst: 'rozpoznaje formy przypadków, liczby, osoby, czasu, trybu i rodzaju gramatycznego odpowiednio: rzeczownika, przymiotnika, liczebnika, czasownika i zaimka oraz określa ich funkcje w wypowiedzi;' },
          { kod: 'II.1.5', tekst: 'rozumie konstrukcję strony biernej i czynnej czasownika, przekształca konstrukcję strony biernej i czynnej i odwrotnie, odpowiednio do celu i intencji wypowiedzi;' },
          { kod: 'II.1.6', tekst: 'stosuje poprawne formy gramatyczne wyrazów odmiennych;' },
          { kod: 'II.1.7', tekst: 'poprawnie stopniuje przymiotniki i przysłówki oraz używa ich we właściwych kontekstach;' },
          { kod: 'II.1.8', tekst: 'nazywa części zdania i rozpoznaje ich funkcje składniowe w wypowiedzeniach (podmiot, orzeczenie, dopełnienie, przydawka, okolicznik);' },
          { kod: 'II.1.9', tekst: 'określa funkcję wyrazów poza zdaniem, rozumie ich znaczenie i poprawnie stosuje w swoich wypowiedziach;' },
          { kod: 'II.1.10', tekst: 'rozpoznaje związki wyrazów w zdaniu;' },
          { kod: 'II.1.11', tekst: 'rozpoznaje wypowiedzenia oznajmujące, pytające i rozkazujące oraz stosuje je, uwzględniając cel wypowiedzi;' },
          { kod: 'II.1.12', tekst: 'rozpoznaje w tekście typy wypowiedzeń: zdanie pojedyncze, zdania złożone (podrzędnie i współrzędnie), równoważniki zdań; rozumie ich funkcje i stosuje w praktyce językowej;' },
          { kod: 'II.1.13', tekst: 'przekształca konstrukcje składniowe, np. zdania złożone w pojedyncze i odwrotnie, zdania w równoważniki zdań i odwrotnie.' },
        ],
      },
      {
        id: 'II.2',
        tytul: 'II.2. Kształcenie językowe - zróżnicowanie języka',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'II.2.1', tekst: 'wskazuje główne cechy języka mówionego i języka pisanego;' },
          { kod: 'II.2.2', tekst: 'posługuje się oficjalną i nieoficjalną odmianą polszczyzny;' },
          { kod: 'II.2.3', tekst: 'używa stylu stosownego do sytuacji komunikacyjnej;' },
          { kod: 'II.2.4', tekst: 'rozumie dosłowne i przenośne znaczenie wyrazów w wypowiedzi; rozpoznaje wyrazy wieloznaczne, rozumie ich znaczenie w tekście oraz świadomie wykorzystuje do tworzenia własnych wypowiedzi;' },
          { kod: 'II.2.5', tekst: 'rozpoznaje w wypowiedziach związki frazeologiczne, rozumie ich znaczenie oraz poprawnie stosuje w wypowiedziach;' },
          { kod: 'II.2.6', tekst: 'rozpoznaje słownictwo neutralne i wartościujące, rozumie jego funkcje w tekście;' },
          { kod: 'II.2.7', tekst: 'dostosowuje sposób wyrażania się do zamierzonego celu wypowiedzi;' },
          { kod: 'II.2.8', tekst: 'rozróżnia synonimy, antonimy, rozumie ich funkcje w tekście i stosuje we własnych wypowiedziach;' },
          { kod: 'II.2.9', tekst: 'zna i stosuje zasady spójności formalnej i semantycznej tekstu.' },
        ],
      },
      {
        id: 'II.3',
        tytul: 'II.3. Kształcenie językowe - komunikacja językowa i kultura języka',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'II.3.1', tekst: 'identyfikuje tekst jako komunikat;' },
          { kod: 'II.3.2', tekst: 'identyfikuje nadawcę i odbiorcę wypowiedzi;' },
          { kod: 'II.3.3', tekst: 'określa sytuację komunikacyjną i rozumie jej wpływ na kształt wypowiedzi;' },
          { kod: 'II.3.4', tekst: 'rozpoznaje znaczenie niewerbalnych środków komunikacji (np. gest, mimika, postawa ciała);' },
          { kod: 'II.3.5', tekst: 'rozumie pojęcie głoska, litera, sylaba, akcent; zna i stosuje reguły akcentowania wyrazów;' },
          { kod: 'II.3.6', tekst: 'stosuje intonację poprawną ze względu na cel wypowiedzi;' },
          { kod: 'II.3.7', tekst: 'rozumie, na czym polega etykieta językowa i stosuje jej zasady.' },
        ],
      },
      {
        id: 'II.4',
        tytul: 'II.4. Kształcenie językowe - ortografia i interpunkcja',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'II.4.1', tekst: 'pisze poprawnie pod względem ortograficznym oraz stosuje reguły pisowni;' },
          { kod: 'II.4.2', tekst: 'poprawnie używa znaków interpunkcyjnych: kropki, przecinka, znaku zapytania, znaku wykrzyknika, cudzysłowu, dwukropka, średnika, nawiasu.' },
        ],
      },
      {
        id: 'III.1',
        tytul: 'III.1. Tworzenie wypowiedzi - elementy retoryki',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'III.1.1', tekst: 'uczestniczy w rozmowie na zadany temat;' },
          { kod: 'III.1.2', tekst: 'rozróżnia argumenty odnoszące się do faktów i logiki oraz odwołujące się do emocji;' },
          { kod: 'III.1.3', tekst: 'tworzy logiczną, semantycznie pełną i uporządkowaną wypowiedź, stosując odpowiednią do danej formy gatunkowej kompozycję i układ graficzny;' },
          { kod: 'III.1.4', tekst: 'zna zasady budowania akapitów i rozumie ich rolę w tworzeniu całości myślowej wypowiedzi;' },
          { kod: 'III.1.5', tekst: 'dokonuje selekcji informacji;' },
          { kod: 'III.1.6', tekst: 'rozróżnia i wskazuje środki perswazji, rozumie ich funkcję.' },
        ],
      },
      {
        id: 'III.2',
        tytul: 'III.2. Tworzenie wypowiedzi - mówienie i pisanie',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'III.2.1', tekst: 'tworzy spójne wypowiedzi w formach gatunkowych: dialog, opowiadanie (twórcze, odtwórcze), opis (w tym opis przeżyć wewnętrznych), list, sprawozdanie, dedykacja, zaproszenie, podziękowanie, ogłoszenie, życzenia, charakterystyka, tekst o charakterze argumentacyjnym;' },
          { kod: 'III.2.2', tekst: 'wygłasza z pamięci tekst, ze zrozumieniem oraz odpowiednią intonacją, dykcją, właściwym akcentowaniem, z odpowiednim napięciem emocjonalnym i z następstwem pauz;' },
          { kod: 'III.2.3', tekst: 'tworzy plan odtwórczy i twórczy tekstu;' },
          { kod: 'III.2.4', tekst: 'redaguje notatki;' },
          { kod: 'III.2.5', tekst: 'opowiada o przeczytanym tekście;' },
          { kod: 'III.2.6', tekst: 'tworzy opowiadania związane z treścią utworu, np. dalsze losy bohatera, komponowanie początku i zakończenia na podstawie fragmentu tekstu lub na podstawie ilustracji;' },
          { kod: 'III.2.7', tekst: 'rozróżnia współczesne formy komunikatów i odpowiednio się nimi posługuje, zachowując zasady etykiety językowej;' },
          { kod: 'III.2.8', tekst: 'wykorzystuje wiedzę o języku w tworzonych wypowiedziach.' },
        ],
      },
      {
        id: 'IV',
        tytul: 'IV. Samokształcenie',
        wstep: 'Uczeń:',
        punkty: [
          { kod: 'IV.1', tekst: 'doskonali ciche i głośne czytanie;' },
          { kod: 'IV.2', tekst: 'doskonali różne formy zapisywania pozyskanych informacji;' },
          { kod: 'IV.3', tekst: 'korzysta z informacji zawartych w różnych źródłach, gromadzi wiadomości, selekcjonuje informacje;' },
          { kod: 'IV.4', tekst: 'zna i stosuje zasady korzystania z zasobów bibliotecznych (np. w bibliotekach szkolnych oraz on-line);' },
          { kod: 'IV.5', tekst: 'korzysta ze słowników ogólnych języka polskiego, także specjalnych, oraz słownika terminów literackich;' },
          { kod: 'IV.6', tekst: 'rozwija umiejętność krytycznej oceny pozyskanych informacji;' },
          { kod: 'IV.7', tekst: 'rozwija umiejętności efektywnego posługiwania się nowymi technologiami oraz zasobami internetowymi;' },
          { kod: 'IV.8', tekst: 'poznaje życie kulturalne swojego regionu.' },
        ],
      },
    ],
  },
  {
    id: 'warunki',
    tytul: 'Warunki i sposób realizacji (fragment dotyczący zadań nauczyciela)',
    opis:
      'Klasy IV-VIII szkoły podstawowej to okres kształtowania sposobów poznawania świata i postaw wobec niego, poznawania kultury i jej wytworów, rozwijania umiejętności komunikowania się z innymi ludźmi, doskonalenia myślenia konkretnego oraz abstrakcyjnego. To również czas formowania indywidualnej osobowości i charakteru młodego człowieka oraz internalizacji systemu wartości, w tym szczególnie prawdy, dobra i piękna.',
    dzialy: [
      {
        id: 'warunki-zadania',
        tytul: 'Zadania nauczyciela języka polskiego na II etapie edukacyjnym',
        wstep: 'Zadaniem nauczyciela języka polskiego na II etapie edukacyjnym jest przede wszystkim:',
        punkty: [
          { kod: 'W.1', tekst: 'wychowywanie świadomego odbiorcy i uczestnika kultury, szczególnie dzieł literackich;' },
          { kod: 'W.2', tekst: 'rozwijanie poczucia tożsamości narodowej oraz szacunku dla tradycji;' },
          { kod: 'W.3', tekst: 'rozwijanie w uczniu ciekawości świata, motywacji do poznawania kultury własnego regionu oraz dziedzictwa narodowego;' },
          { kod: 'W.4', tekst: 'kształtowanie postawy otwartości wobec innych kultur i szacunku dla ich dorobku;' },
          { kod: 'W.5', tekst: 'rozwijanie umiejętności komunikowania się w różnych sytuacjach oraz sprawnego posługiwania się językiem polskim w zależności od celu wypowiedzi;' },
          { kod: 'W.6', tekst: 'rozwijanie umiejętności formułowania myśli, operowania bogatym słownictwem oraz wykorzystywania go do opisywania świata, oceniania postaw i zachowań ludzkich z zachowaniem zasad etyki i kultury języka;' },
          { kod: 'W.7', tekst: 'kształcenie umiejętności posługiwania się różnymi gatunkami wypowiedzi ustnej i pisemnej, potrzebnymi w dalszej edukacji oraz różnych sytuacjach życiowych;' },
          { kod: 'W.8', tekst: 'kształtowanie samodzielności w docieraniu do informacji, rozwijanie umiejętności ich selekcjonowania, krytycznej oceny oraz wykorzystania we własnym rozwoju;' },
          { kod: 'W.9', tekst: 'wychowanie do przyjmowania aktywnych postaw w życiu i brania odpowiedzialności za własne czyny.' },
        ],
      },
    ],
  },
];

export const PODSTAWA_ZRODLO =
  'Rozporządzenie Ministra Edukacji z dnia 28 czerwca 2024 r. (Dz.U. 2024 poz. 996), obowiązuje od roku szkolnego 2024/2025.';
