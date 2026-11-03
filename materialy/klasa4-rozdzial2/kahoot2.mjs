// Kahoot 2 - klasa 4, rozdział II: te same tematy co kahoot.mjs, nowe przykłady (druga runda gry).
// node materialy/kahoot.mjs klasa4-rozdzial2 kahoot2 -> output/kahoot/klasa4-rozdzial2-kahoot2.pdf
// `ok` = numer poprawnej odpowiedzi (od 1), `img` = hasło do zdjęcia z Unsplash w Kahoocie.

export const KAHOOT = {
  plik: 'klasa4-rozdzial2-kahoot2',
  tytul: 'Kahoot 2 - klasa 4, rozdział II',
  opis: 'wyrazy potoczne, porównanie, synonimy i antonimy, list, rzeczownik, przypadki, trudne formy i wołacz, fakt i opinia, asertywność, wielka litera, „nie” z rzeczownikami',
  pytania: [
    // Wyrazy potoczne
    { t: 'Który wyraz NIE jest potoczny?', o: ['łazić', 'zakuwać', 'chodzić', 'wyluzować'], ok: 3, img: 'walking' },
    { t: '„Brat zakuwa do sprawdzianu.” Co znaczy „zakuwa”?', o: ['uczy się', 'śpi', 'gra', 'je'], ok: 1, img: 'studying' },
    { t: 'Do kogo powiesz „Ale lipa!”?', o: ['do pani dyrektor', 'do lekarza', 'do kolegi z klasy', 'do obcego dorosłego'], ok: 3, img: 'disappointed' },
    // Porównanie
    { t: 'Dokończ porównanie: gadatliwy jak…', o: ['ryba', 'sroka', 'kamień', 'ślimak'], ok: 2, img: 'magpie' },
    { t: 'Dokończ porównanie: płacze jak…', o: ['bóbr', 'lis', 'orzeł', 'kot'], ok: 1, img: 'beaver' },
    { t: 'Które zdanie zawiera porównanie?', o: ['Ile kosztuje bilet?', 'Jak ci minął dzień?', 'Lubię śpiewać.', 'Siostra śpiewa niczym słowik.'], ok: 4, img: 'nightingale' },
    // Synonimy i antonimy
    { t: 'Który wyraz jest synonimem słowa „zmartwiony”?', o: ['wesoły', 'zatroskany', 'głodny', 'zły'], ok: 2, img: 'worried' },
    { t: 'Jaki jest antonim słowa „jasny”?', o: ['ciemny', 'biały', 'świetlisty', 'słoneczny'], ok: 1, img: 'night sky' },
    { t: 'Która para to synonimy?', o: ['czysty - brudny', 'chory - zdrowy', 'rano - wieczór', 'zaczynać - rozpoczynać'], ok: 4, img: 'starting line' },
    // List
    { t: 'Który fragment to nagłówek listu?', o: ['Poznań, 12 maja 2026 r.', 'Droga Marto!', 'Całuję, Julka', 'PS Pozdrów kota!'], ok: 2, img: 'writing letter' },
    { t: 'Co oznacza PS na końcu listu?', o: ['podpis', 'pozdrowienia', 'dopisek, o którym zapomnieliśmy', 'datę'], ok: 3, img: 'sticky note' },
    { t: 'Które słowo w liście do przyjaciela piszemy wielką literą?', o: ['mój', 'ja', 'mnie', 'Twój'], ok: 4, img: 'envelope' },
    // Rzeczownik
    { t: 'Rzeczownik odpowiada na pytania…', o: ['co robi?', 'jaki? jaka?', 'kto? co?', 'gdzie? kiedy?'], ok: 3, img: 'question mark' },
    { t: 'Jaki rodzaj ma rzeczownik „dłoń”?', o: ['męski (ten)', 'żeński (ta)', 'nijaki (to)', 'męskoosobowy'], ok: 2, img: 'hand' },
    { t: 'Jak powiesz o wielu psach i jaki to rodzaj?', o: ['ci psy - męskoosobowy', 'te psy - niemęskoosobowy', 'ten psy - męski', 'to psy - nijaki'], ok: 2, img: 'dogs' },
    { t: 'Który rzeczownik ma tylko liczbę mnogą?', o: ['urodziny', 'balon', 'tort', 'prezent'], ok: 1, img: 'birthday cake' },
    // Przypadki
    { t: 'Który przypadek odpowiada na pytania o kim? o czym?', o: ['narzędnik', 'wołacz', 'biernik', 'miejscownik'], ok: 4, img: 'storytelling' },
    { t: '„Kupiłem prezent mamie.” W jakim przypadku jest wyraz „mamie”?', o: ['celownik', 'dopełniacz', 'miejscownik', 'mianownik'], ok: 1, img: 'gift box' },
    { t: '„Lubię pizzę.” W jakim przypadku jest wyraz „pizzę”?', o: ['mianownik', 'narzędnik', 'biernik', 'dopełniacz'], ok: 3, img: 'pizza' },
    { t: '„Pociąg odjeżdża o ósmej.” W jakim przypadku jest wyraz „pociąg”?', o: ['biernik', 'mianownik', 'celownik', 'wołacz'], ok: 2, img: 'train' },
    // Trudne formy i wołacz
    { t: 'Mama kupiła kilo…', o: ['wiśniów', 'wiśni', 'wiśniami', 'wiśniach'], ok: 2, img: 'cherries' },
    { t: 'W szafie wisi pięć…', o: ['sukienków', 'sukienkami', 'sukienek', 'sukienka'], ok: 3, img: 'dresses' },
    { t: 'Zawołaj Bartka: „…, podaj piłkę!”', o: ['Bartek', 'Bartka', 'Bartkowi', 'Bartku'], ok: 4, img: 'basketball' },
    { t: 'Jak zawołasz Hanię?', o: ['Haniu!', 'Hania!', 'Hanię!', 'Hanią!'], ok: 1, img: 'girl waving' },
    // Fakt, opinia, argument
    { t: 'Które zdanie to opinia?', o: ['Ośmiornica ma osiem ramion.', 'Ośmiornice są obrzydliwe.', 'Ośmiornica żyje w morzu.', 'Ośmiornica umie zmieniać kolor.'], ok: 2, img: 'octopus' },
    { t: '„Warto jeść warzywa, ponieważ…” Co jest argumentem?', o: ['bo tak', 'bo leżą w lodówce', 'bo są zielone', 'mają dużo witamin'], ok: 4, img: 'vegetables' },
    // Asertywność
    { t: 'Nie chcesz, ale mówisz: „No dobra, weź mój rower na cały weekend…”. Jaka to reakcja?', o: ['asertywna', 'agresywna', 'uległa', 'przyjacielska'], ok: 3, img: 'bike' },
    { t: 'Ktoś na czacie każe ci wyśmiać kolegę. Co jest asertywne?', o: ['Piszę obraźliwy komentarz.', 'Piszę: „Nie, nie będę nikogo wyśmiewać.”', 'Robię to, żeby mnie lubili.', 'Wyzywam tę osobę.'], ok: 2, img: 'smartphone chat' },
    // Wielka czy mała litera?
    { t: 'Która nazwa jest zapisana poprawnie?', o: ['wrocław', 'Niemcy', 'afryka', 'merkury'], ok: 2, img: 'world map' },
    { t: 'W którym zdaniu nie ma błędu?', o: ['W środę jadę do lublina.', 'W Środę jadę do Lublina.', 'W środę jadę do Lublina.', 'w środę jadę do Lublina.'], ok: 3, img: 'city street' },
    // „Nie” z rzeczownikami
    { t: 'Która para jest zapisana poprawnie?', o: ['nieśmiałość, nie tańczy', 'nie śmiałość, nie tańczy', 'nieśmiałość, nietańczy', 'nie śmiałość, nietańczy'], ok: 1, img: 'shy child' },
    { t: 'Który wyraz bez „nie” w ogóle nie istnieje?', o: ['niewiedza', 'niezapominajka', 'niepowodzenie', 'nieżyczliwość'], ok: 2, img: 'forget me not' },
    { t: '„(nie)krzycz na brata!” Jak to zapisać?', o: ['niekrzycz', 'Niekrzycz', 'nie-krzycz', 'nie krzycz'], ok: 4, img: 'brothers' },
  ],
};
