// Kahoot - klasa 4, rozdział II „Pośród słów i znaczeń”: wyrazy potoczne, porównanie, synonimy i antonimy, list,
// rzeczownik, przypadki, trudne formy i wołacz, fakt/opinia/argument, asertywność, wielka litera, „nie” z rzeczownikami.
// node materialy/kahoot.mjs klasa4-rozdzial2 -> output/kahoot/klasa4-rozdzial2-kahoot.pdf
// Przykłady własne: inne niż w filmikach, zeszycie, karcie pracy, ćwiczeniach do domu, kartach k4-powt2-* i puli sprawdzianu.
// `ok` = numer poprawnej odpowiedzi (od 1), `czas` domyślnie 20 s, `img` = hasło do zdjęcia z Unsplash w Kahoocie.

export const KAHOOT = {
  plik: 'klasa4-rozdzial2-kahoot',
  tytul: 'Kahoot - klasa 4, rozdział II',
  opis: 'wyrazy potoczne, porównanie, synonimy i antonimy, list, rzeczownik, przypadki, trudne formy i wołacz, fakt i opinia, asertywność, wielka litera, „nie” z rzeczownikami',
  pytania: [
    // Wyrazy potoczne
    { t: 'Który wyraz jest potoczny?', o: ['jedzenie', 'szama', 'posiłek', 'obiad'], ok: 2, img: 'lunch' },
    { t: '„Wpadnij do mnie na chatę.” Jak powiedzieć to oficjalnie?', o: ['Wbijaj do mnie na chatę.', 'Wpadnij do mnie na kwadrat.', 'Wpadnij do mnie na chałupę.', 'Odwiedź mnie w domu.'], ok: 4, img: 'house' },
    { t: 'Gdzie wyraz „kumpel” NIE pasuje?', o: ['w wypracowaniu', 'w SMS-ie do brata', 'w rozmowie na przerwie', 'w czacie z przyjacielem'], ok: 1, img: 'friends' },
    // Porównanie
    { t: 'W którym zdaniu jest porównanie?', o: ['Jak się czujesz?', 'Mam nowe trampki.', 'Chleb był twardy jak skała.', 'Jutro idziemy do kina.'], ok: 3, img: 'bread' },
    { t: 'Dokończ porównanie: lekki jak…', o: ['kamień', 'piórko', 'słoń', 'lodówka'], ok: 2, img: 'feather' },
    // Synonimy i antonimy
    { t: 'Który wyraz jest synonimem słowa „ogromny”?', o: ['olbrzymi', 'malutki', 'szybki', 'cichy'], ok: 1, img: 'elephant' },
    { t: 'Jaki jest antonim słowa „mokry”?', o: ['wilgotny', 'zimny', 'suchy', 'czysty'], ok: 3, img: 'umbrella rain' },
    { t: 'Która para to antonimy?', o: ['płakać - szlochać', 'leniwy - pracowity', 'zadowolony - szczęśliwy', 'łatwy - prosty'], ok: 2, img: 'lazy cat' },
    { t: 'Który wyraz NIE ma antonimu?', o: ['dzień', 'twardy', 'gruby', 'stół'], ok: 4, img: 'table' },
    // List
    { t: 'Gdzie w liście piszemy miejscowość i datę?', o: ['na samym dole', 'w prawym górnym rogu', 'na środku kartki', 'po podpisie'], ok: 2, img: 'letter envelope' },
    { t: 'Który zapis w liście jest poprawny?', o: ['Dziękuję ci za rysunek.', 'dziękuję Ci za rysunek.', 'Dziękuję Ci za rysunek.', 'Dziękuję CI za rysunek.'], ok: 3, img: 'drawing' },
    { t: '„Kochany Dziadku, …” Jak napiszesz dalej?', o: ['Piszę do Ciebie z kolonii.', 'piszę do ciebie z kolonii.', 'Piszę do ciebie z kolonii.', 'piszę do Ciebie z kolonii.'], ok: 4, img: 'summer camp' },
    // Rzeczownik
    { t: 'Który wyraz jest rzeczownikiem?', o: ['wesoły', 'skakać', 'przyjaźń', 'szybko'], ok: 3, img: 'friendship' },
    { t: 'Jaki rodzaj ma rzeczownik „liść”?', o: ['męski (ten)', 'żeński (ta)', 'nijaki (to)', 'nie ma rodzaju'], ok: 1, img: 'leaf' },
    { t: 'Jaki rodzaj ma rzeczownik „tata”?', o: ['żeński, bo kończy się na -a', 'nijaki', 'męski (ten tata)', 'niemęskoosobowy'], ok: 3, img: 'father' },
    { t: 'Przed którym rzeczownikiem powiesz „ci” (rodzaj męskoosobowy)?', o: ['psy', 'dziewczynki', 'drzewa', 'piłkarze'], ok: 4, img: 'football players' },
    // Przypadki
    { t: 'Na jakie pytania odpowiada celownik?', o: ['kogo? czego?', 'komu? czemu?', 'z kim? z czym?', 'o kim? o czym?'], ok: 2, img: 'gift' },
    { t: '„Nie widzę tablicy.” W jakim przypadku jest wyraz „tablicy”?', o: ['mianownik', 'celownik', 'miejscownik', 'dopełniacz'], ok: 4, img: 'blackboard' },
    { t: '„Jem zupę łyżką.” W jakim przypadku jest wyraz „łyżką”?', o: ['biernik', 'celownik', 'narzędnik', 'wołacz'], ok: 3, img: 'soup spoon' },
    { t: 'Który przypadek jest czwarty z kolei?', o: ['biernik', 'celownik', 'narzędnik', 'dopełniacz'], ok: 1, img: 'numbers' },
    // Trudne formy i wołacz
    { t: 'W koszyku nie ma już…', o: ['kanapków', 'kanapek', 'kanapkach', 'kanapkami'], ok: 2, img: 'sandwich' },
    { t: 'Zawołaj Magdę: „…, chodź na obiad!”', o: ['Magda', 'Magdu', 'Magdo', 'Magdzie'], ok: 3, img: 'dinner' },
    { t: 'Jak zawołasz pana Tadeusza?', o: ['Panie Tadeuszu!', 'Pan Tadeusz!', 'Panu Tadeuszowi!', 'Pana Tadeusza!'], ok: 1, img: 'grandfather' },
    // Fakt, opinia, argument
    { t: 'Które zdanie to fakt?', o: ['Lato jest nudne.', 'Najładniejsze są tulipany.', 'Biologia to fajny przedmiot.', 'Słońce jest gwiazdą.'], ok: 4, img: 'sun' },
    { t: 'Które zdanie to opinia?', o: ['Warszawa jest stolicą Polski.', 'Rower to najlepszy prezent.', 'Rower ma dwa koła.', 'Woda wrze w 100 stopniach.'], ok: 2, img: 'bicycle' },
    { t: '„Warto uczyć się angielskiego…” Który powód jest argumentem?', o: ['bo tak', 'bo kolega się uczy', 'ponieważ porozmawiam z ludźmi z innych krajów', 'bo mama tak mówi'], ok: 3, img: 'travel' },
    // Asertywność
    { t: 'Starszy kolega namawia cię do ucieczki z lekcji. Która odpowiedź jest asertywna?', o: ['„Dobra, idę z tobą.”', '„Nie, bo chcę być na lekcji. Spotkajmy się po szkole.”', '„Odczep się, frajerze!”', 'Nic nie mówię i idę z nim.'], ok: 2, img: 'school hallway' },
    { t: 'Obca pani w parku chce ci pokazać kotki w swoim domu. Co robisz?', o: ['Idę, jeśli jest miła.', 'Pytam, ile ma kotków.', 'Mówię głośno NIE, odchodzę i mówię rodzicom.', 'Czekam, co powie dalej.'], ok: 3, img: 'kittens' },
    // Wielka czy mała litera?
    { t: 'Który zapis jest poprawny?', o: ['rzeka odra', 'Rzeka Odra', 'Rzeka odra', 'rzeka Odra'], ok: 4, img: 'river' },
    { t: '„Płynęliśmy … po jeziorze.” Jak to napisać?', o: ['łodzią (bo to łódka)', 'Łodzią (bo to miasto)', 'ŁODZIĄ', 'łódzią'], ok: 1, img: 'rowing boat' },
    { t: 'Co piszemy małą literą?', o: ['Karkonosze', 'Europa', 'marzec', 'Mruczek (kot)'], ok: 3, img: 'mountains' },
    // „Nie” z rzeczownikami
    { t: 'Który zapis jest poprawny?', o: ['To nie prawda!', 'To nieprawda!', 'To nie-prawda!', 'To Nie prawda!'], ok: 2, img: 'surprised' },
    { t: 'Dlaczego „niesprawiedliwość” piszemy razem?', o: ['bo to długi wyraz', 'bo to czasownik (co robi?)', 'bo to rzeczownik (co?)', 'bo zaczyna zdanie'], ok: 3, img: 'scales justice' },
  ],
};
