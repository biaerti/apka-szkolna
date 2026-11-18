// Klasa 4, lekcje wychowawcze: seria „Badacze klasy” o dokuczaniu - osobna
// zakladka na liscie lekcji, jak lektura. Research i plan calej serii:
// docs/research/lekcje-wychowawcze-dokuczanie.md.
//
// Bartek (2026-11-17): dzieci maja 10 lat, ale sa ogarniete - bez cringe'u i bez
// filmikow. Dlatego seria traktuje klase jak badaczy: prawdziwe eksperymenty
// psychologiczne, prawdziwe liczby z badan, mapa szkoly, wlasne zasady.
// Bez kola i bez notatki do zeszytu (to nie jest lekcja polskiego), slajdy to
// rozmowa. Nigdy nie pada imie ucznia z klasy - sytuacje sa wymyslone.

import { newId } from './id';
import type { Slide } from './types';
import { plan, type Topic } from './textbook5slides';

export const WYCHOWAWCZE = 'Wychowawcze - Badacze klasy';

function tytul(title: string, subtitle: string): Slide {
  return { id: newId(), kind: 'title', title, subtitle };
}

/** Rozmowa na projektorze (bez notatki, bez oceny). */
function rozmowa(title: string, body: string): Slide {
  return { id: newId(), kind: 'text', title, body, studentAction: 'oral' };
}

/** Slajd do obejrzenia (wyniki, wyjasnienie) - nikt nic nie zapisuje. */
function pokaz(title: string, body: string): Slide {
  return { id: newId(), kind: 'text', title, body, studentAction: 'look' };
}

export const WYCHOWAWCZE4_TOPICS: Topic[] = [
  {
    title: '1. Eksperyment: czy pójdziesz za grupą?',
    dzial: WYCHOWAWCZE,
    topic: 'Siła grupy - eksperyment Ascha',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza lekcja serii „Badacze klasy”, bez żadnych przygotowań: nikt nie wychodzi z sali i nikt nie jest w zmowie. Klasa odpowiada chórem na trzy proste rysunki z liniami. Potem ten sam rysunek 3 wraca z dopiskiem „7 osób przed tobą powiedziało B” i pytamy: co byś powiedział? Dopiero wtedy opowiadasz o **prawdziwym eksperymencie Solomona Ascha** (USA, 1951) i pokazujesz, ilu dorosłych poszło za grupą. Na koniec rozmowa, jak ta sama siła działa, kiedy ktoś się z kogoś śmieje.'],
      ['Po lekcji uczeń', [
        '- wie, że grupa potrafi przekonać nawet do oczywistej nieprawdy (i że to normalne, nie głupota),',
        '- podaje dwa powody, dla których idziemy za grupą,',
        '- wie, że **wystarczy jedna osoba**, która powie inaczej, żeby siła grupy mocno spadła,',
        '- widzi, jak to działa przy śmianiu się z kogoś i w grupie klasowej.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Rysunki** (5 min) - strona z liniami. Rysunki 1-3: klasa mówi chórem, która linia pasuje do wzoru (B, A, C). Łatwe - o to chodzi.',
        '2. **Rysunek 3 jeszcze raz** (5 min) - teraz przy rysunku stoi 7 osób, które powiedziały B. „Wyobraź sobie, że siedzisz z nimi i to Twoja kolej. Co powiesz?” Głosowanie rękami: kto powie B jak oni, kto C? Zapytaj, czy byłoby trudno, gdyby to byli prawdziwi koledzy, a nie kropki na ekranie.',
        '3. **Prawdziwe badanie** i **Co wyszło Aschowi?** (7 min) - tak to wyglądało naprawdę: wszyscy poza jedną osobą byli w zmowie. Wyniki.',
        '4. **Wystarczy jeden** (5 min).',
        '5. **Czemu ulegamy?** i **Dobrze czy źle?** (8 min) - rozmowa.',
        '6. **Trzy sytuacje** (10 min) - co tu robi grupa i jak wyglądałby tu jeden sojusznik.',
        '7. **Zapamiętaj** (2 min) - jedno zdanie i zapowiedź następnej lekcji.',
      ].join('\n')],
      ['Na co uważać', [
        '- Dzieci pewnie powiedzą C - przecież widzą. To dobry moment: „A dorośli w prawdziwym badaniu? Zgadnijcie, ilu poszło za grupą.” Niech zgadują przed slajdem z wynikami.',
        '- Powiedz głośno: **w badaniu byli dorośli studenci i większość też choć raz poszła za grupą**. Pójście za grupą to nie głupota.',
        '- Jeśli ktoś zacznie opowiadać o prawdziwej sytuacji z klasy, przerwij życzliwie: „to ważne, pogadajmy po lekcji”.',
      ].join('\n')],
      ['Wyniki Ascha (do slajdu)', [
        '- Ok. **jedna trzecia** odpowiedzi w próbach krytycznych była zła - zgodna z grupą (w monografii z 1956 r. 36,8%).',
        '- Ok. **3 na 4 osoby** choć raz poszły za grupą, ok. **co czwarta** ani razu.',
        '- Gdy **jeden** pomocnik mówił prawdę, błędów było kilka razy mniej (spadek o ok. 3/4).',
        '- Po badaniu ludzie tłumaczyli się dwojako: „myślałem, że to ja źle widzę” albo „widziałem dobrze, ale nie chciałem się wyróżniać”.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Na czym polegał eksperyment Ascha?', answer: 'Grupa w zmowie podawała złą odpowiedź (która linia jest równa wzorowi), a badany odpowiadał po nich. Sprawdzano, czy pójdzie za grupą.' },
      { text: 'Podaj dwa powody, dla których ludzie idą za grupą.', answer: 'Myślą, że grupa wie lepiej („to ja źle widzę”) albo nie chcą się wyróżniać i wyjść na dziwaka.' },
      { text: 'Co się działo, gdy w grupie była jedna osoba, która mówiła prawdę?', answer: 'Badani dużo rzadziej szli za grupą - błędów było kilka razy mniej.' },
      { text: 'Kiedy pójście za grupą jest dobre, a kiedy złe? Podaj przykłady.', answer: 'Dobre: zasady, kolejka, przechodzenie na zielonym. Złe: gdy grupa się z kogoś śmieje, kogoś wyklucza albo robi coś krzywdzącego.' },
    ],
    makeSlides: () => [
      tytul('Badacze klasy', 'Lekcja 1: czy pójdziesz za grupą?'),
      { id: newId(), kind: 'embed', url: '/prezentacje/linie-asch.html', title: 'Która linia?' },
      pokaz('Prawdziwe badanie', [
        'Tak zrobił to psycholog **Solomon Asch** w 1951 roku (USA).',
        '',
        '- Przy stole siedziało 8 dorosłych. Tylko **jedna osoba** była badana.',
        '- Pozostali byli **w zmowie**: przy niektórych rysunkach wszyscy mówili tę samą złą odpowiedź.',
        '- Badany odpowiadał **na końcu**, na głos.',
        '',
        'Zgadnijcie: ilu badanych poszło za grupą?',
      ].join('\n')),
      pokaz('Co wyszło Aschowi?', [
        '- Około **jednej trzeciej** odpowiedzi było złych - takich jak grupy.',
        '- Około **3 na 4 osoby** choć raz poszły za grupą.',
        '- Tylko około **co czwarta** osoba ani razu nie dała się grupie.',
        '',
        'A to byli dorośli, a linie było widać gołym okiem.',
      ].join('\n')),
      pokaz('Wystarczy jeden', [
        'Asch sprawdził też, co się stanie, gdy **jedna osoba** z grupy mówi prawdę.',
        '',
        'Błędów było **kilka razy mniej**. Badany nie był już sam.',
        '',
        'Co by się zmieniło przy rysunku 3, gdyby jedna z 7 osób powiedziała C?',
      ].join('\n')),
      rozmowa('Czemu ulegamy?', [
        'Po badaniu ludzie tłumaczyli się na dwa sposoby:',
        '',
        '1. „Myślałem, że to ja źle widzę.” - **grupa chyba wie lepiej**.',
        '2. „Widziałem dobrze, ale nie chciałem wyjść na dziwaka.” - **nie chcę się wyróżniać**.',
        '',
        'Który powód był u naszych badanych?',
      ].join('\n')),
      rozmowa('Dobrze czy źle?', [
        'Robić to, co inni, to nie zawsze coś złego. Dzięki temu stoimy w kolejce i przechodzimy na zielonym.',
        '',
        '- Podajcie przykład, kiedy dobrze jest iść za grupą.',
        '- A kiedy to szkodzi? Kiedy grupa może kogoś skrzywdzić?',
      ].join('\n')),
      rozmowa('Sytuacja 1', [
        'Na przerwie kilka osób śmieje się z rysunku, który ktoś zrobił na plastyce. Tobie ten rysunek się podoba.',
        '',
        '- Co tu robi grupa?',
        '- Jak wyglądałby tu „jeden sojusznik”? Co mógłby powiedzieć albo zrobić?',
      ].join('\n')),
      rozmowa('Sytuacja 2', [
        'W grupie klasowej ktoś wrzuca zdjęcie kolegi, który przewrócił się na WF-ie. Pod spodem jest już 8 emotek ze śmiechem.',
        '',
        '- Co czujesz, kiedy widzisz te 8 emotek? A co czuje ten kolega?',
        '- Co może zrobić jedna osoba?',
      ].join('\n')),
      rozmowa('Sytuacja 3', [
        'Przy wybieraniu drużyn na WF-ie ta sama osoba zawsze zostaje wybrana na końcu. Wszyscy już się przyzwyczaili.',
        '',
        '- Dlaczego nikt tego nie zmienia?',
        '- Co by się stało, gdyby jeden kapitan wybrał ją wcześniej?',
      ].join('\n')),
      pokaz('Zapamiętaj', [
        'Grupa ma ogromną siłę - przez nią nawet dorośli mówią to, w co nie wierzą.',
        '',
        'Ale **wystarczy jedna osoba**, żeby ta siła mocno spadła.',
        '',
        'Następnym razem sprawdzimy, **kto naprawdę ma władzę w klasie**, kiedy ktoś komuś dokucza.',
      ].join('\n')),
    ],
  },
];
