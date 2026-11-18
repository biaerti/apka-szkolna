// Klasa 4, lekcje wychowawcze: seria „Badacze klasy” o dokuczaniu - osobna
// zakladka na liscie lekcji, jak lektura. Research i plan calej serii:
// docs/research/lekcje-wychowawcze-dokuczanie.md.
//
// Bartek (2026-11-17): dzieci maja 10 lat, ale sa ogarniete - bez cringe'u i bez
// filmikow. Bez kola i bez notatki do zeszytu (to nie jest lekcja polskiego),
// slajdy to rozmowa. Nigdy nie pada imie ucznia z klasy - sytuacje sa wymyslone.
//
// Bartek (2026-11-18): lekcja 1 z eksperymentem Ascha mu nie siadla (za duzo
// zamieszania) - zamiast niej gra „Zart czy dokuczanie?”. Stara lekcja w bazie
// przechodzi na nowa w miejscu (alias tytulu w refreshMaterials.ts).

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

/** Slajd do obejrzenia (zasady, wyjasnienie) - nikt nic nie zapisuje. */
function pokaz(title: string, body: string): Slide {
  return { id: newId(), kind: 'text', title, body, studentAction: 'look' };
}

/** Runda gry z public/prezentacje/zart-czy-dokuczanie.html (5 sytuacji, glosowanie kciukiem). */
function runda(nr: 1 | 2): Slide {
  return { id: newId(), kind: 'embed', url: `/prezentacje/zart-czy-dokuczanie.html?runda=${nr}`, title: `Żart czy dokuczanie? Runda ${nr}` };
}

export const WYCHOWAWCZE4_TOPICS: Topic[] = [
  {
    title: '1. Żart czy dokuczanie?',
    dzial: WYCHOWAWCZE,
    topic: 'Żart czy dokuczanie - gdzie jest granica',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Gra bez przygotowań. Na ekranie pojawiają się krótkie sytuacje z życia szkoły, a klasa głosuje kciukiem: **w górę - żart, w dół - dokuczanie, w bok - zależy**. Po każdej sytuacji pytasz 2-3 osoby „dlaczego?”, a dopiero potem strzałką odkrywasz werdykt. Między rundami dzieci dostają trzy pytania, po których poznać dokuczanie. Na koniec ćwiczymy, jak powiedzieć „stop”. Pomysł z australijskiego programu NSW „Bystander to Upstander”, sytuacje własne.'],
      ['Po lekcji uczeń', [
        '- odróżnia żart od dokuczania po trzech pytaniach: czy śmieją się obie strony, czy to się powtarza, czy ktoś jest silniejszy,',
        '- wie, że po słowie „przestań” żart się kończy,',
        '- umie powiedzieć „stop” jako ten, komu dokuczają, ten, kto żartował, i świadek.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Zasady gry** (2 min) - kciuk w górę, w dół, w bok. Wszyscy głosują naraz, na „3, 2, 1, teraz!”.',
        '2. **Runda 1** (12 min) - 5 sytuacji na czuja. Po głosowaniu: „Kto dał w bok? Dlaczego?”. Potem strzałka - werdykt i co o nim decyduje.',
        '3. **Trzy pytania** (5 min) - slajd z testem. Wróć do sytuacji z rundy 1, które budziły spór.',
        '4. **Runda 2** (12 min) - 5 sytuacji, teraz z trzema pytaniami. Niech dzieci uzasadniają pytaniami („nie śmieją się obie strony, więc...”).',
        '5. **Powiedz: stop!** (10 min) - trzy role. Klasa podaje zdania, Ty dopisujesz na tablicy najlepsze. Chętni mówią je na głos (bez scenek, jeśli klasa jest rozbrykana).',
        '6. **Zapamiętaj** (2 min).',
      ].join('\n')],
      ['Na co uważać', [
        '- Sytuacje „zależy” (zdjęcie w grupie klasowej, urodziny) są celowo sporne - spór to dobry znak, nie trzeba go rozstrzygać na siłę.',
        '- Jeśli ktoś mówi „u nas tak jest z X”, przerwij życzliwie: „to ważne, pogadajmy po lekcji”. Nie omawiamy prawdziwych osób z klasy na forum.',
        '- Głosowanie kciukiem jest szybkie i wszyscy biorą udział - nie trzeba nikogo wywoływać do odpowiedzi na każdą sytuację.',
      ].join('\n')],
      ['Przykładowe zdania na „stop”', [
        '- **Komu dokuczają:** „Dla mnie to już nie jest śmieszne.” „Przestań, serio.” Spokojnie i krótko, bez tłumaczenia się.',
        '- **Kto żartował:** „Sorry, nie wiedziałem, że cię to wkurza.” I przestać, nawet jeśli inni się śmieją.',
        '- **Świadek:** „Dobra, wystarczy.” „Chodź, idziemy grać.” Albo nie śmiać się - to też działa.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Po jakich trzech pytaniach poznasz, że to już dokuczanie, a nie żart?', answer: 'Czy śmieją się obie strony? Czy to się powtarza? Czy ktoś jest silniejszy (starszy, jest ich więcej)?' },
      { text: 'Ktoś mówi „przestań”, a druga osoba robi dalej, bo „to tylko żart”. Czy to jeszcze żart?', answer: 'Nie - po słowie „przestań” żart się kończy, dalej to dokuczanie.' },
      { text: 'Co może powiedzieć osoba, której dokuczają?', answer: 'Krótko i spokojnie, np. „Dla mnie to już nie jest śmieszne”, „Przestań, serio”.' },
      { text: 'Co może zrobić świadek, gdy grupa się z kogoś śmieje?', answer: 'Nie śmiać się, powiedzieć „dobra, wystarczy”, zabrać tę osobę („chodź, idziemy grać”) albo powiedzieć dorosłemu.' },
    ],
    makeSlides: () => [
      tytul('Żart czy dokuczanie?', 'Badacze klasy, lekcja 1'),
      pokaz('Zasady gry', [
        'Na ekranie pojawi się sytuacja. Na „3, 2, 1, teraz!” wszyscy naraz pokazują:',
        '',
        '- **kciuk w górę** - to żart,',
        '- **kciuk w dół** - to dokuczanie,',
        '- **kciuk w bok** - zależy.',
        '',
        'Potem kilka osób mówi, dlaczego tak myśli.',
      ].join('\n')),
      runda(1),
      pokaz('Trzy pytania', [
        'Po tym poznasz, że to już nie żart:',
        '',
        '1. Czy **śmieją się obie strony**?',
        '2. Czy to się **powtarza**?',
        '3. Czy ktoś jest **silniejszy** - starszy, popularniejszy albo jest ich więcej?',
        '',
        'I jeszcze jedno: po słowie **„przestań”** żart się kończy.',
      ].join('\n')),
      runda(2),
      rozmowa('Powiedz: stop!', [
        'Co można powiedzieć albo zrobić, gdy jesteś:',
        '',
        '- osobą, której **dokuczają**?',
        '- osobą, która **żartowała** i właśnie widzi, że przesadziła?',
        '- **świadkiem**, który stoi obok?',
      ].join('\n')),
      pokaz('Zapamiętaj', [
        'Żart jest wtedy, gdy **śmieją się wszyscy** - także ten, z kogo się śmiejemy.',
        '',
        'Gdy ktoś mówi **„przestań”**, a ty robisz dalej, to już nie żart.',
      ].join('\n')),
    ],
  },
];
