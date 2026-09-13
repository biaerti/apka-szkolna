// Tematy z podrecznika GWO do klasy 4, z ktorego Bartek prowadzi lekcje
// (multipodrecznik 1a5ce8d8..., patrz src/lib/gwo.ts).
//
// Wszystko ponizej jest spisane z prawdziwych stron podrecznika, nie ze spisu
// tresci innego wydania: numery i tytuly tematow, strony, pytania do kola
// i notatki. Pytania sprawdzaja to, czego temat uczy ("Co dzis przed Toba?"
// i "Podsumujmy..." w podreczniku), ale wiekszosc pyta prosto o to, co
// dzieje sie w czytankach - tylko o to, co naprawde jest w ich tekscie.
// Kazde pytanie ma odpowiedz dla nauczyciela.
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
      { text: 'Kto opowiada historię w „Moim lecie z szablozębnym”?', answer: 'Antek, starszy brat Ulki.' },
      { text: 'Czym zajmują się rodzice Antka i Ulki?', answer: 'Są artystami rzeźbiarzami.' },
      { text: 'Dlaczego dzieci nie mogły same zostać w domu na wakacje?', answer: 'Prawo nie pozwala, żeby dziewięciolatek i sześciolatka zostali sami na dwa tygodnie.' },
      { text: 'Kto miał się zaopiekować dziećmi i jaka była ta osoba według Antka?', answer: 'Ciocia Larysa, nauczycielka matematyki - nigdy się nie uśmiechała i ciągle narzekała na uczniów.' },
      { text: 'Czy wakacje z ciocią Larysą były w końcu złe? Skąd to wiemy?', answer: 'Nie - w liście dzieci pytają, czy za rok ciocia znów się nimi zaopiekuje.' },
      { text: 'Wymień elementy świata przedstawionego.', answer: 'Czas, miejsce, bohaterowie, wydarzenia i narrator.' },
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
      { text: 'Kim jest podmiot liryczny?', answer: 'Osobą, która mówi w wierszu.' },
      { text: 'Jakie pytanie ciągle słyszy osoba mówiąca w wierszu „Ja”?', answer: '„Kim będziesz?”' },
      { text: 'Dlaczego uważa, że to pytanie jest z błędem?', answer: 'Bo ona już jest - jest sobą teraz, a nie dopiero w przyszłości.' },
      { text: 'Komu radzi zadawać to pytanie?', answer: 'Tym, którzy martwią się przyszłością.' },
      { text: 'Co postanawia na końcu wiersza?', answer: 'Że będzie sobą: „Ja zamiar mam być - mną”.' },
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
      { text: 'Z czym autorzy podręcznika porównują mózg?', answer: 'Z komputerem najwyższej klasy.' },
      { text: 'Co może się stać z usłyszaną informacją, jeśli jej nie zapiszemy?', answer: 'Możemy ją zapomnieć, np. po nocy - pamięć jest ulotna.' },
      { text: 'Co w nauce działa jak zapisanie dokumentu na twardym dysku?', answer: 'Notowanie.' },
      { text: 'Wymień trzy sposoby notowania.', answer: 'Tradycyjna notatka, punkt po punkcie, tabela.' },
      { text: 'Kiedy najlepiej zrobić notatkę w tabeli?', answer: 'Gdy porównujemy ze sobą informacje.' },
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
      { text: 'Ile liter ma polski alfabet?', answer: '32.' },
      { text: 'Od jakiego alfabetu pochodzi nasz alfabet?', answer: 'Od łacińskiego, używanego w starożytnym Rzymie.' },
      { text: 'Kiedy i razem z czym alfabet łaciński trafił do Polski?', answer: 'W 966 roku, razem z chrześcijaństwem.' },
      { text: 'Czym różni się głoska od litery?', answer: 'Głoskę słyszymy i wypowiadamy, a literę widzimy i piszemy.' },
      { text: 'Wymień polskie samogłoski.', answer: 'a, ą, e, ę, i, o, u (ó), y.' },
      { text: 'Ile głosek, liter i sylab ma wyraz „chmura”?', answer: '5 głosek, 6 liter, 2 sylaby (chmu-ra).' },
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
      { text: 'Co to jest autoportret?', answer: 'Portret samego siebie - obraz, zdjęcie albo opis.' },
      { text: 'Dlaczego Wanda Chotomska opisała siebie, zamiast się namalować?', answer: 'Nie umie malować, a zdjęcia jej nie wychodzą.' },
      { text: 'Jakie oczy i ile piegów ma osoba z wiersza „Autoportret”?', answer: 'Piwne oczy i siedem piegów na nosie.' },
      { text: 'Co dzieje się z nią wiosną?', answer: 'Rosną jej skrzydła u ramion.' },
      { text: 'Co to jest epitet? Podaj przykład z opisu twarzy Jana Matejki.', answer: 'Wyraz, który określa rzeczownik, np. surowa twarz, gęsta broda, duży nos.' },
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
      { text: 'Dlaczego syn mędrca nie chciał wychodzić z domu?', answer: 'Wstydził się swojego wyglądu i bał się, że ludzie będą się z niego śmiać.' },
      { text: 'Co mówili kupcy, gdy ojciec jechał na ośle, a syn szedł pieszo?', answer: 'Że ojciec nie ma litości, bo każe synowi iść pieszo.' },
      { text: 'A co mówili, gdy obaj szli pieszo obok osła?', answer: 'Że są głupi, bo nie wiedzą, że na osłach się jeździ.' },
      { text: 'Co zrobili ojciec i syn piątego dnia i jak zareagowali kupcy?', answer: 'Nieśli osła na plecach, a kupcy wybuchnęli śmiechem.' },
      { text: 'Czego mędrzec chciał nauczyć syna?', answer: 'Że ludzie zawsze coś skrytykują, więc trzeba robić to, co słuszne, i iść swoją drogą.' },
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
      { text: 'Kiedy obchodzimy Międzynarodowy Dzień Kropki?', answer: '15 września.' },
      { text: 'Dlaczego Vashti siedziała nad pustą kartką?', answer: 'Myślała, że nie umie rysować.' },
      { text: 'Co nauczycielka zrobiła z kropką Vashti?', answer: 'Oprawiła ją w złotą ramkę i powiesiła nad biurkiem.' },
      { text: 'Jak Vashti pomogła chłopcu, który mówił, że nie umie rysować?', answer: 'Dała mu kartkę, poprosiła o kreskę i o podpis - tak jak nauczycielka zrobiła z nią.' },
      { text: 'Co osoba mówiąca w „Wielkiej historii małej kreski” znalazła na spacerze i co z tym zrobiła?', answer: 'Małą kreskę - włożyła ją do kieszeni i przyniosła do domu.' },
      { text: 'Co zrobił pomysł, gdy bohater „Co robisz z pomysłem?” od niego odszedł?', answer: 'Zaczął za nim chodzić.' },
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
      { text: 'Podaj trzy czasowniki, które mówią, co robi stworek z rysunku w podręczniku.', answer: 'Np. trzyma, oddycha, patrzy, tupie.' },
      { text: 'Czym różni się czynność od stanu? Podaj przykłady.', answer: 'Czynność to działanie, np. biegnie; stan to coś, na co nie mamy wpływu, np. boi się.' },
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
      { text: 'Co według Bartka znaczyło słowo „akceptować”?', answer: 'Wypłacać pieniądze z bankomatu.' },
      { text: 'Kto w klasie się nie śmiał?', answer: 'Pani Temperówka i Miłosz.' },
      { text: 'Co zrobił Miłosz po lekcji?', answer: 'Został w klasie i powiedział pani, że Bartek nie żartował, więc uwaga jest niesprawiedliwa.' },
      { text: 'Co powiedział Miłoszowi tata?', answer: 'Że jest z niego dumny, bo stanął po słusznej stronie.' },
      { text: 'Co to jest plan ramowy?', answer: 'Najważniejsze wydarzenia zapisane w punktach, po kolei.' },
      { text: 'Czym różni się zdanie od równoważnika zdania?', answer: 'Zdanie ma czasownik w formie osobowej, równoważnik go nie ma.' },
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
      { text: 'Dlaczego książę nie chciał się żenić?', answer: 'Kandydatki chciały zostać królowymi, a nie poznać jego samego.' },
      { text: 'Jakie życzenie wypowiedział książę przy czarowniku?', answer: 'Że chciałby być jak żaba i znaczyć tak mało jak ona.' },
      { text: 'Co przydarzyło się księciu-żabie w drodze do pałacu?', answer: 'Goniły go dzieci z igłą, wiedźma chciała go wrzucić do kotła, a szlachcic go kopnął.' },
      { text: 'Dzięki czemu czar prysł?', answer: 'Dzięki dobroci dziewczyny, która zaopiekowała się żabą.' },
      { text: 'Jaką radę dała księciu dziewczyna?', answer: 'Żeby nie udawał kogoś innego, nie uważał się za lepszego i był sobą - jest dobry taki, jaki jest.' },
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
