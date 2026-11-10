// Kahoot - klasa 5, dział 2 „Uwaga, uczucia!”: przenośnia, frazeologizmy, zdrobnienia i zgrubienia, siła uczuć, złość („Lwy”),
// rzeczownik (rodzaj, przypadki, pospolity/własny), nietypowa odmiana, ę/ą na końcu, temat i końcówka, ó wymienne,
// sprawozdanie, dwukropek, tekst reklamowy.
// node materialy/kahoot.mjs klasa5-dzial2 -> output/kahoot/klasa5-dzial2-kahoot.pdf
// Przykłady własne: inne niż w filmikach, zeszycie, karcie pracy, kartach lekcji 29a i puli sprawdzianu.
// `ok` = numer poprawnej odpowiedzi (od 1), `czas` domyślnie 20 s, `img` = hasło do zdjęcia z Unsplash w Kahoocie.

export const KAHOOT = {
  plik: 'klasa5-dzial2-kahoot',
  tytul: 'Kahoot - klasa 5, dział 2',
  opis: 'przenośnia, frazeologizmy, zdrobnienia i zgrubienia, uczucia, rzeczownik i przypadki, nietypowa odmiana, ę i ą, temat i końcówka, ó wymienne, sprawozdanie, dwukropek, reklama',
  pytania: [
    // Przenośnia
    { t: 'W którym wyrażeniu jest porównanie?', o: ['srebrny księżyc', 'głodny jak wilk', 'fala śmiechu', 'stalowe nerwy'], ok: 2, img: 'empty plate' },
    { t: 'Które wyrażenie to przenośnia?', o: ['drewniany stół', 'szybki jak rakieta', 'rzeka ludzi', 'czerwone jabłko'], ok: 3, img: 'crowd' },
    { t: '„Ma serce z lodu.” Co to znaczy?', o: ['Jest mu zimno.', 'Jest nieczuły.', 'Lubi zimę.', 'Jest chory.'], ok: 2, img: 'ice' },
    { t: 'Zamień porównanie w przenośnię: „chmury jak wata”.', o: ['wata chmur', 'chmury bez waty', 'chmury niczym wata', 'biała wata'], ok: 1, img: 'clouds' },
    // Frazeologizmy
    { t: '„Mieć głowę w chmurach” znaczy…', o: ['być bardzo wysokim', 'latać samolotem', 'marzyć i nie uważać', 'mieć gorączkę'], ok: 3, img: 'daydream' },
    { t: '„Wziąć nogi za pas” znaczy…', o: ['uciec', 'zawiązać buty', 'zatańczyć', 'zasnąć'], ok: 1, img: 'running' },
    { t: 'Który frazeologizm zapisano poprawnie?', o: ['bułka z dżemem', 'czuć bazylię', 'mieć muchy w uchu', 'rzucać słowa na wiatr'], ok: 4, img: 'wind' },
    { t: '„Serce mu waliło jak młotem, a nogi miał jak z waty.” Jakie to uczucie?', o: ['radość', 'strach', 'nuda', 'złość'], ok: 2, img: 'dark forest' },
    // Zdrobnienia, zgrubienia, siła uczuć
    { t: 'Które słowo jest zdrobnieniem?', o: ['ptaszysko', 'ptak', 'ptaszek', 'ptactwo'], ok: 3, img: 'little bird' },
    { t: 'Które słowo jest zgrubieniem?', o: ['wilczek', 'wilczysko', 'wilk', 'wilczyca'], ok: 2, img: 'wolf howling' },
    { t: '„Po co mi te łapska tu wkładasz?!” Co czuje mówiący?', o: ['czułość', 'niechęć', 'zachwyt', 'smutek'], ok: 2, img: 'angry face' },
    { t: 'Które uczucie jest NAJSILNIEJSZE?', o: ['zadowolenie', 'radość', 'euforia', 'uśmiech'], ok: 3, img: 'celebration' },
    // Złość, „Lwy”
    { t: 'W wierszu „Lwy” lwy to przenośnia…', o: ['strachu', 'złości', 'przyjaźni', 'zabawy'], ok: 2, img: 'lion' },
    { t: 'Który sposób na złość jest dobry?', o: ['rzucić plecakiem', 'nakrzyczeć na kolegę', 'wziąć głęboki oddech', 'nie odzywać się tydzień'], ok: 3, img: 'calm lake' },
    { t: 'Które zdanie to dobre zdanie od „ja”?', o: ['Ty zawsze wszystko psujesz!', 'Jestem smutna, bo nikt mnie nie zaprosił.', 'Jesteś okropny!', 'Nigdy więcej z tobą nie gadam!'], ok: 2, czas: 30, img: 'talking' },
    // Rzeczownik
    { t: 'Jaki rodzaj ma rzeczownik „krzesła”?', o: ['męski', 'żeński', 'nijaki', 'nie ma rodzaju'], ok: 3, img: 'chair' },
    { t: 'Jaki rodzaj ma rzeczownik „gęsi”?', o: ['męski', 'żeński', 'nijaki', 'mnogi'], ok: 2, img: 'goose' },
    { t: '„Przyglądam się kotu.” W jakim przypadku jest „kotu”?', o: ['dopełniacz', 'celownik', 'biernik', 'miejscownik'], ok: 2, img: 'cat' },
    { t: '„Jadę na wycieczkę z dziadkiem.” W jakim przypadku jest „dziadkiem”?', o: ['narzędnik', 'miejscownik', 'mianownik', 'dopełniacz'], ok: 1, img: 'grandfather' },
    { t: 'Na jakie pytania odpowiada dopełniacz?', o: ['kto? co?', 'kogo? czego?', 'komu? czemu?', 'o kim? o czym?'], ok: 2, img: 'question mark' },
    { t: 'Który rzeczownik jest własny i piszemy go wielką literą?', o: ['rzeka', 'pies', 'Odra', 'góry'], ok: 3, img: 'river' },
    // Nietypowa odmiana
    { t: 'Który zapis jest poprawny?', o: ['w akwariumie', 'w akwarium', 'w akwariu', 'w akwariach jednym'], ok: 2, img: 'aquarium' },
    { t: 'Który rzeczownik ma TYLKO liczbę mnogą?', o: ['spodnie', 'powietrze', 'młodzież', 'krzesło'], ok: 1, img: 'jeans' },
    { t: 'Który zapis jest poprawny?', o: ['dwa nożyczki', 'dwoje nożyczek', 'dwie nożyczki', 'dwóch nożyczek'], ok: 2, img: 'scissors' },
    // Ę i ą
    { t: '„Mieszam herbatę łyżeczk…” - jaka końcówka?', o: ['-ą', '-ę', '-om', '-o'], ok: 1, img: 'tea cup' },
    { t: 'Który wyraz jest zapisany BŁĘDNIE?', o: ['kocię', 'piszę', 'wiem', 'jemę'], ok: 4, img: 'kitten' },
    // Temat i końcówka, ó wymienne
    { t: 'Który podział na temat i końcówkę jest poprawny?', o: ['ko|tem', 'kot|em', 'k|otem', 'kote|m'], ok: 2, img: 'black cat' },
    { t: 'Dlaczego „mróz” piszemy przez ó?', o: ['bo mrozy', 'bo mrużyć', 'bo to wyjątek', 'bo jest zima'], ok: 1, img: 'frost' },
    { t: 'Gdzie wpiszemy u, a nie ó?', o: ['kr…l', 'g…ra', 'k…bek', 'w…z'], ok: 3, img: 'mug' },
    // Sprawozdanie
    { t: 'Które zdanie NIE pasuje do sprawozdania?', o: ['W piątek byliśmy w zoo.', 'Najpierw zobaczyliśmy żyrafy.', 'Nagle żyrafa przemówiła do mnie.', 'Wycieczka bardzo mi się podobała.'], ok: 3, czas: 30, img: 'giraffe' },
    { t: 'Na jakie pytania odpowiada wstęp sprawozdania?', o: ['kto? co? kiedy? gdzie?', 'jak się czułem?', 'co było na końcu?', 'czego się nauczyłem?'], ok: 1, img: 'calendar' },
    // Dwukropek
    { t: 'Gdzie postawić dwukropek? „Na stole leżały trzy owoce jabłko, gruszka i śliwka.”', o: ['po „stole”', 'po „leżały”', 'po „owoce”', 'po „gruszka”'], ok: 3, czas: 30, img: 'fruit bowl' },
    { t: 'Który zapis jest poprawny?', o: ['Tata powiedział: „Jestem zmęczony”.', 'Tata powiedział „jestem zmęczony”:', 'Tata: powiedział „Jestem zmęczony”.', 'Tata powiedział, że: „Jestem zmęczony”.'], ok: 1, czas: 30, img: 'tired man' },
    // Reklama
    { t: 'Które zdanie to reklama, a nie informacja?', o: ['Basen jest otwarty od 7.00.', 'Pociąg odjeżdża o 9.15.', 'Najlepsza pizza w mieście! Druga GRATIS!', 'Sklep jest zamknięty w niedzielę.'], ok: 3, czas: 30, img: 'pizza' },
  ],
};
