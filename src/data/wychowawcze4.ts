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
      ['Co dziś', 'Pierwsza lekcja serii „Badacze klasy”. Zamiast mówić o dokuczaniu, robimy **prawdziwy eksperyment psychologiczny** Solomona Ascha (USA, 1951). Kilku ochotników bierze udział w „teście spostrzegawczości”, a cała reszta klasy jest w zmowie i w niektórych próbach mówi złą odpowiedź. Sprawdzamy, czy badany pójdzie za grupą. Potem odkrywamy karty i rozmawiamy, jak ta sama siła działa, kiedy ktoś się z kogoś śmieje.'],
      ['Po lekcji uczeń', [
        '- wie, że grupa potrafi przekonać nawet do oczywistej nieprawdy (i że to normalne, nie głupota),',
        '- podaje dwa powody, dla których idziemy za grupą,',
        '- wie, że **wystarczy jedna osoba**, która powie inaczej, żeby siła grupy mocno spadła,',
        '- widzi, jak to działa przy śmianiu się z kogoś i w grupie klasowej.',
      ].join('\n')],
      ['Przed lekcją', [
        '- Wybierz **4 ochotników na badanych**. Najlepiej osoby pewne siebie, **nie** te, z których klasa się śmieje. Powiedz im tylko, że to test spostrzegawczości.',
        '- Napisz na kartce dla siebie ściągę (badani nie mogą jej zobaczyć): **3 → B, 5 → C, 6 → A**. W próbach 1, 2 i 4 wszyscy mówią prawdę.',
        '- Ustaw jedno krzesło przodem do ekranu, tyłem do klasy - tu siada badany.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Start** (2 min) - slajd tytułowy. Ochotnicy wychodzą na korytarz (drzwi uchylone, ktoś pilnuje, żeby nie podsłuchiwali).',
        '2. **Tajny plan** (4 min) - slajd z instrukcją dla klasy. Wybierz **5 osób, które będą odpowiadać na głos przed badanym**, i jedną z nich na **sojusznika** dla ostatniego badanego (mówi wtedy zawsze prawdę). Przećwicz z klasą poważne miny.',
        '3. **Eksperyment** (ok. 15 min) - strona z liniami. Wpuszczasz badanych po jednym. Na każdej próbie pytasz 5 osób po kolei, na końcu badanego. Po 6 próbach badany siada i milczy, a Ty klikasz „od nowa” (albo R) dla następnego. Na tablicy zapisujesz, w ilu z 3 prób krytycznych badany poszedł za grupą. **Badany 4 ma sojusznika.**',
        '4. **Odkrywamy karty** (5 min) - brawa dla badanych. Wyniki z tablicy, potem wyniki Ascha.',
        '5. **Wystarczy jeden** (5 min) - porównaj badanego 4 z resztą.',
        '6. **Czemu ulegamy?** i **Dobrze czy źle?** (6 min) - rozmowa.',
        '7. **Trzy sytuacje** (6 min) - co tu robi grupa i jak wyglądałby tu jeden sojusznik.',
        '8. **Na koniec** (2 min) - jedno zdanie do zapamiętania i zapowiedź następnej lekcji.',
      ].join('\n')],
      ['Na co uważać', [
        '- **Nikt nie śmieje się z badanych** - ani w trakcie, ani po. Ustal to z klasą na slajdzie „Tajny plan”: kto się śmieje, psuje eksperyment.',
        '- Po odkryciu kart powiedz głośno: **w oryginalnym badaniu byli dorośli studenci i większość też choć raz poszła za grupą**. Pójście za grupą to nie głupota, a nieuleganie to nie powód do przechwałek.',
        '- Jeśli badany nie dał się ani razu - super, to też wynik (u Ascha co czwarta osoba). Zapytaj, jak się czuł, mówiąc inaczej niż wszyscy.',
        '- Jeśli ktoś zacznie opowiadać o prawdziwej sytuacji z klasy, przerwij życzliwie: „to ważne, pogadajmy po lekcji”.',
        '- Badanego, który się zorientował w trakcie, nie wyrzucamy - jego wynik też jest ciekawy („po czym poznałeś?”).',
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
      tytul('Badacze klasy', 'Lekcja 1: test spostrzegawczości'),
      pokaz('Tajny plan', [
        'Badani czekają na korytarzu. Wchodzą po jednym i zobaczą 6 rysunków z liniami.',
        '',
        '- W próbach **1, 2 i 4** mówimy **prawdę**.',
        '- W próbach **3, 5 i 6** wszyscy mówimy **złą odpowiedź**: **3 → B · 5 → C · 6 → A**',
        '- Odpowiada na głos 5 wybranych osób, potem badany. Reszta milczy.',
        '- **Poważne miny.** Nie śmiejemy się, nie podpowiadamy, nie patrzymy na siebie porozumiewawczo.',
        '- Przy ostatnim badanym jedna osoba z piątki mówi **zawsze prawdę**.',
      ].join('\n')),
      { id: newId(), kind: 'embed', url: '/prezentacje/linie-asch.html', title: 'Test spostrzegawczości' },
      pokaz('To był eksperyment!', [
        'Klasa była w zmowie. W próbach 3, 5 i 6 wszyscy celowo mówili złą odpowiedź.',
        '',
        'To prawdziwe badanie psychologa **Solomona Ascha** z 1951 roku (USA). Robił je z dorosłymi studentami - z tymi samymi prostymi liniami.',
        '',
        '**Brawa dla badanych!** Pomogli nam coś sprawdzić.',
      ].join('\n')),
      rozmowa('Co wyszło u nas?', [
        '- Ile razy badani poszli za grupą? (wyniki z tablicy)',
        '- Badani: jak się czuliście, kiedy wszyscy mówili coś innego niż wy?',
        '- Klasa: jak to było mówić coś, o czym wiedzieliście, że to nieprawda?',
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
        'Jak poszło u nas badanemu, który miał sojusznika?',
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
