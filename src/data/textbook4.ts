// Tematy z podrecznika GWO do klasy 4, z ktorego Bartek prowadzi lekcje
// (multipodrecznik 1a5ce8d8..., patrz src/lib/gwo.ts).
//
// Wszystko ponizej jest spisane z prawdziwych stron podrecznika, nie ze spisu
// tresci innego wydania: numery i tytuly tematow, strony, pytania do kola
// i notatki. Pytania sprawdzaja to, czego temat uczy ("Co dzis przed Toba?"
// i "Podsumujmy..." w podreczniku), a pytania o czytanke - tylko to, co
// naprawde jest w jej tekscie. Kazde pytanie ma odpowiedz dla nauczyciela.
//
// Dopisujemy temat dopiero wtedy, gdy strony sa przeczytane. Brakuje lekcji
// 12-14 (s. 38-45) - nie zgadujemy ich z mapy mysli rozdzialu.

import type { Lesson, Question, QuestionSet } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

interface Topic {
  dzial: string;
  title: string;
  textbookPage: number;
  exercisePage?: number;
  note: string;
  questions: Array<{ text: string; answer: string }>;
}

const ROZDZIAL_1 = 'Rozdział I. Poznajemy siebie i innych';

const TOPICS: Topic[] = [
  {
    dzial: ROZDZIAL_1,
    title: '1-2. Krok po kroku tworzymy pierwszą wspólną opowieść',
    textbookPage: 12,
    note: [
      'Świat przedstawiony to świat wymyślony przez autora. Składa się z:',
      '• czasu - kiedy dzieją się wydarzenia,',
      '• miejsca - gdzie się dzieją,',
      '• bohaterów - kto bierze w nich udział,',
      '• wydarzeń - co się dzieje,',
      '• narratora - kto opowiada o wydarzeniach.',
      '',
      'Autor pisze utwór. Narrator to wymyślona przez niego osoba, która opowiada historię.',
      'W „Moim lecie z szablozębnym” W. Kurosz narratorem jest Antek.',
    ].join('\n'),
    questions: [
      { text: 'Wymień elementy świata przedstawionego.', answer: 'Czas, miejsce, bohaterowie, wydarzenia i narrator.' },
      { text: 'Kim jest narrator?', answer: 'Osobą wymyśloną przez autora, która opowiada o wydarzeniach.' },
      { text: 'Czym autor różni się od narratora?', answer: 'Autor (np. Weronika Kurosz) pisze utwór, a narrator jest postacią, która w utworze opowiada historię.' },
      { text: 'Dlaczego w „Moim lecie z szablozębnym” dzieci nie mogły same zostać w domu?', answer: 'Prawo nie pozwala, żeby dziewięciolatek i sześciolatka zostali sami na dwa tygodnie, a rodzice wyjeżdżali na plener.' },
      { text: 'Kto miał się zaopiekować Antkiem i Ulką i czym ta osoba się zajmuje?', answer: 'Ciocia Larysa, ciotka taty - uczy matematyki w szkole.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '3. Być sobą, czyli kim?',
    textbookPage: 16,
    note: [
      'Podmiot liryczny to osoba, która mówi w wierszu.',
      'Podmiot liryczny to nie to samo co poeta (autor wiersza).',
      '',
      'W wierszu „Ja” M. Rusinka podmiot liryczny słyszy pytanie, kim będzie.',
      'Uważa je za błędne, bo on już jest - i zamierza być sobą.',
      '',
      'Być sobą - żyć zgodnie ze swoimi zasadami.',
    ].join('\n'),
    questions: [
      { text: 'Kim jest podmiot liryczny?', answer: 'Osobą mówiącą w wierszu.' },
      { text: 'Czy podmiot liryczny to poeta? Uzasadnij.', answer: 'Nie. Poeta pisze wiersz, a podmiot liryczny to osoba, która w tym wierszu mówi.' },
      { text: 'O co jest pytany podmiot liryczny w wierszu „Ja”?', answer: 'O to, kim będzie.' },
      { text: 'Dlaczego podmiot liryczny uważa to pytanie za błędne?', answer: 'Bo on już jest kimś - jest sobą teraz, a nie dopiero w przyszłości.' },
      { text: 'Co znaczy wyrażenie „być sobą”?', answer: 'Żyć zgodnie ze swoimi zasadami.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '4. Notatka kluczem do sukcesu',
    textbookPage: 18,
    note: [
      'Notujemy, żeby zapamiętać najważniejsze informacje. Z notatek trzeba regularnie korzystać.',
      '',
      'Sposoby notowania:',
      '• tradycyjna notatka - pełne zdania, linijka pod linijką,',
      '• punkt po punkcie - od myślników, punktów lub strzałek; gdy trzeba zapamiętać kolejność albo coś wyliczyć,',
      '• tabela - gdy porównujemy informacje.',
    ].join('\n'),
    questions: [
      { text: 'Po co robimy notatki?', answer: 'Żeby zapamiętać najważniejsze informacje - pamięć jest ulotna, a do notatki można wrócić.' },
      { text: 'Wymień trzy sposoby notowania.', answer: 'Tradycyjna notatka, punkt po punkcie, tabela.' },
      { text: 'Kiedy warto notować punkt po punkcie?', answer: 'Gdy trzeba zapamiętać kolejność działań albo coś uporządkować, wyliczyć.' },
      { text: 'Do czego najlepiej nadaje się tabela?', answer: 'Do porównywania ze sobą informacji.' },
      { text: 'Z czym podręcznik porównuje mózg i czym jest wtedy notowanie?', answer: 'Z komputerem; notowanie jest jak zapisanie dokumentu na twardym dysku.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '5-6. Sekrety wyrazów - głoski, litery i sylaby',
    textbookPage: 22,
    exercisePage: 13,
    note: [
      'Alfabet - zbiór liter do zapisywania słów. Polski alfabet ma 32 litery.',
      '',
      'Głoski słyszymy i wypowiadamy, litery widzimy i piszemy.',
      'Jedną głoskę możemy zapisać kilkoma literami, np. sz, cz, ch, dz, si, zi.',
      '',
      'Samogłoski: a, ą, e, ę, i, o, u (ó), y - powietrze nie napotyka przeszkody.',
      'Spółgłoski - powietrze napotyka przeszkodę (wargi, język, zęby).',
      'Sylaby tworzą samogłoski ze spółgłoskami (tra-wa) lub same samogłoski (o-pis).',
    ].join('\n'),
    questions: [
      { text: 'Czym różni się głoska od litery?', answer: 'Głoskę słyszymy i wypowiadamy, a literę widzimy i piszemy.' },
      { text: 'Ile liter ma polski alfabet?', answer: '32.' },
      { text: 'Wymień polskie samogłoski.', answer: 'a, ą, e, ę, i, o, u (ó), y.' },
      { text: 'Czym różni się samogłoska od spółgłoski?', answer: 'Przy samogłosce powietrze nie napotyka przeszkody, przy spółgłosce napotyka (wargi, język, zęby).' },
      { text: 'Ile głosek, liter i sylab ma wyraz „chmura”?', answer: '5 głosek (ch-m-u-r-a), 6 liter, 2 sylaby (chmu-ra).' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '7. Malujemy pędzlem i słowem',
    textbookPage: 25,
    note: [
      'Autoportret - portret samego siebie: obraz, zdjęcie albo opis.',
      '',
      'Epitet to wyraz, który określa rzeczownik:',
      '• opisuje cechy ludzi, zwierząt, przedmiotów,',
      '• wzbogaca opis, np. o barwę, kształt,',
      '• działa na wyobraźnię.',
      'Przykład: surowa, groźna twarz; długa, gęsta broda.',
      '',
      'W. Chotomska nie umie malować, więc w wierszu „Autoportret” opisuje siebie słowami.',
    ].join('\n'),
    questions: [
      { text: 'Czym jest autoportret?', answer: 'Portretem samego siebie - obrazem, zdjęciem albo opisem.' },
      { text: 'Co to jest epitet?', answer: 'Wyraz określający rzeczownik, np. jego cechę, barwę albo kształt.' },
      { text: 'Podaj dwa epitety, którymi można opisać twarz Jana Matejki z autoportretu.', answer: 'Np. surowa, groźna twarz; bujne włosy; długa, gęsta broda; duży, krzywy nos.' },
      { text: 'Jak osoba mówiąca w wierszu „Autoportret” tworzy swój portret, skoro nie umie malować ani fotografować?', answer: 'Opisuje siebie słowami.' },
      { text: 'Jaki znak szczególny ma osoba mówiąca w „Autoportrecie” wiosną?', answer: 'Rosną jej skrzydła u ramion.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '8. Dlaczego warto być sobą?',
    textbookPage: 29,
    note: [
      '„Nauki mędrca” M. Piquemala',
      'Mędrzec przez pięć dni chodził z synem na bazar - raz ojciec jechał na ośle, raz syn, raz obaj szli pieszo, raz obaj jechali, a raz nieśli osła. Kupcy za każdym razem mieli coś do zarzucenia.',
      '',
      'Nauka: ludzie zawsze znajdą coś do skrytykowania. Nie warto przejmować się ich zdaniem - rób to, co słuszne, i idź swoją drogą.',
      '',
      'wziąć kogoś na języki - obmówić, plotkować',
      'dać upust - okazać, wyrazić coś',
    ].join('\n'),
    questions: [
      { text: 'Dlaczego syn mędrca nie chciał wychodzić z domu?', answer: 'Miał kompleksy na punkcie wyglądu i bał się, że ludzie będą się z niego śmiać.' },
      { text: 'Jak mędrzec pokazał synowi, że nie warto słuchać innych?', answer: 'Pięć dni chodzili na bazar, za każdym razem inaczej z osłem, a kupcy zawsze coś krytykowali.' },
      { text: 'Jaką naukę przekazał synowi mędrzec?', answer: 'Cokolwiek zrobisz, ludzie coś zarzucą - rób to, co słuszne, i idź swoją drogą.' },
      { text: 'Co znaczy „wziąć kogoś na języki”?', answer: 'Obmówić kogoś, plotkować na jego temat.' },
      { text: 'Co znaczy „dać upust” czemuś?', answer: 'Okazać, wyrazić coś, np. oburzenie.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
    textbookPage: 33,
    note: [
      'Międzynarodowy Dzień Kropki - 15 września. Święto kreatywności, odwagi i odkrywania talentów.',
      'Zaczęło się w 2009 roku od książki „Kropka” P.H. Reynoldsa.',
      '',
      'Vashti myślała, że nie umie rysować. Nauczycielka poprosiła o jedną kropkę i jej podpis, a potem oprawiła rysunek w ramkę. Vashti zaczęła malować coraz to nowe kropki i odniosła sukces na wystawie. Na koniec sama dodała odwagi chłopcu.',
      '',
      'Kreatywność - umiejętność wymyślania czegoś nowego. Warto dawać pomysłom szansę.',
    ].join('\n'),
    questions: [
      { text: 'Kiedy obchodzimy Międzynarodowy Dzień Kropki i czego dotyczy to święto?', answer: '15 września; to święto kreatywności, odwagi i odkrywania talentów.' },
      { text: 'Jaki problem miała Vashti na początku lekcji plastyki?', answer: 'Miała pustą kartkę - uważała, że nie umie rysować.' },
      { text: 'Co sprawiło, że Vashti zaczęła malować kolejne kropki?', answer: 'Zobaczyła swoją kropkę oprawioną w złotą ramkę nad biurkiem nauczycielki i chciała namalować ładniejszą.' },
      { text: 'Dlaczego Vashti poprosiła chłopca o podpisanie jego kreski?', answer: 'Chciała dodać mu odwagi - tak jak nauczycielka zrobiła to z nią.' },
      { text: 'Co bohater książki „Co robisz z pomysłem?” zrobił najpierw ze swoim pomysłem?', answer: 'Odszedł od niego i udawał, że pomysł nie należy do niego - ale pomysł zaczął za nim chodzić.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '11. Czas na czasownik',
    textbookPage: 37,
    note: [
      'Czasownik - część mowy, która nazywa czynności i stany.',
      'Odpowiada na pytania: co robi? co się z nim dzieje?',
      '',
      'Czynności - działania, często związane z ruchem, np. biegnie, pływa.',
      'Stany - sytuacje, na które nie mamy wpływu, np. mdleje, boi się.',
      '',
      'Nie z czasownikami piszemy osobno: nie wiem, nie idę.',
    ].join('\n'),
    questions: [
      { text: 'Co nazywa czasownik?', answer: 'Czynności i stany.' },
      { text: 'Na jakie pytania odpowiada czasownik?', answer: 'Co robi? Co się z nim dzieje?' },
      { text: 'Czym różni się czynność od stanu? Podaj po jednym przykładzie.', answer: 'Czynność to działanie, np. biegnie; stan to sytuacja, na którą nie mamy wpływu, np. boi się.' },
      { text: 'Jak piszemy „nie” z czasownikami?', answer: 'Osobno, np. nie wiem, nie idę.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '15. Tworzymy plan ramowy',
    textbookPage: 46,
    note: [
      'Plan ramowy - najważniejsze wydarzenia zapisane w punktach, w kolejności, w jakiej się dzieją.',
      'Punkty zapisujemy zdaniami albo równoważnikami zdań - jednym sposobem w całym planie.',
      '',
      'Zdanie ma czasownik w formie osobowej: Bartek pomylił się.',
      'Równoważnik zdania nie ma czasownika: Pomyłka Bartka.',
      '',
      'zrobić sobie z czegoś kabaret - żartować z czegoś, co powinno być potraktowane serio',
    ].join('\n'),
    questions: [
      { text: 'Co to jest plan ramowy?', answer: 'Najważniejsze wydarzenia zapisane w punktach, w kolejności, w jakiej się dzieją.' },
      { text: 'Czym różni się zdanie od równoważnika zdania?', answer: 'Zdanie ma czasownik w formie osobowej, równoważnik zdania go nie ma.' },
      { text: 'Jak Bartek zrozumiał słowo „akceptować” w „Historii o akceptacji”?', answer: 'Jako wypłacanie pieniędzy z bankomatu.' },
      { text: 'Dlaczego Miłosz wstawił się za Bartkiem u pani Temperówki?', answer: 'Wiedział, że Bartek nie żartował, tylko się pomylił, więc uwaga była niesprawiedliwa.' },
      { text: 'Co znaczy „zrobić sobie z czegoś kabaret”?', answer: 'Żartować z czegoś, co powinno być potraktowane serio.' },
    ],
  },
  {
    dzial: ROZDZIAL_1,
    title: '16. Co już wiesz? Co umiesz?',
    textbookPage: 50,
    note: [
      'Powtórzenie rozdziału I:',
      '• świat przedstawiony: czas, miejsce, bohaterowie, wydarzenia, narrator,',
      '• wiersz i podmiot liryczny, epitet, opis twarzy,',
      '• notowanie, plan ramowy,',
      '• alfabet, głoska, litera, sylaba, samogłoska, spółgłoska,',
      '• czasownik i pisownia nie z czasownikami,',
      '• zdanie i równoważnik zdania.',
      '',
      'tolerancja - poszanowanie cudzych poglądów i upodobań',
      'samoakceptacja - zaakceptowanie samego siebie',
    ].join('\n'),
    questions: [
      { text: 'Dlaczego książę wybiegł z pałacu?', answer: 'Nie chciał się żenić - kandydatki widziały w nim przyszłego króla, a nie jego samego.' },
      { text: 'Gdzie rozgrywają się wydarzenia w opowiadaniu „Książę, który chciał być żabą”?', answer: 'W pałacu i jego okolicy: nad sadzawką, na rynku, w skromnym domku dziewczyny.' },
      { text: 'Co sprawiło, że czar prysł i książę odzyskał swój wygląd?', answer: 'Dobroć dziewczyny, która zaopiekowała się żabą.' },
      { text: 'Które słowo lepiej pasuje do wymowy opowiadania: tolerancja czy samoakceptacja? Dlaczego?', answer: 'Samoakceptacja - dziewczyna radzi księciu, żeby nie udawał kogoś innego i był dobry taki, jaki jest.' },
      { text: 'Czy wypowiedzenie „Tego dnia książę wiele się nauczył” to zdanie czy równoważnik zdania?', answer: 'Zdanie, bo ma czasownik w formie osobowej (nauczył się).' },
    ],
  },
];

export function buildTextbook4(grade: string, classIds: string[]): FreshMaterialsBundle {
  if (grade.toUpperCase() !== 'IV') throw new Error('Podręcznik jest przygotowany dla klasy IV.');
  const questionSets: QuestionSet[] = [];
  const questions: Question[] = [];
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = TOPICS.map((topic) => {
    const setId = newId();
    questionSets.push({ id: setId, name: topic.title, topic: topic.title, classIds, createdAt: new Date().toISOString() });
    topic.questions.forEach((q, order) => questions.push({ id: newId(), setId, text: q.text, answer: q.answer, order }));
    return {
      grade,
      title: topic.title,
      registerTopic: topic.title,
      materialType: 'textbook',
      textbookPage: topic.textbookPage,
      exercisePage: topic.exercisePage,
      notebookNote: topic.note,
      questionSetId: setId,
      reviewQuestionSetId: setId,
      dzial: topic.dzial,
      progress: {},
      slides: [],
    };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK4_TOPIC_COUNT = TOPICS.length;
