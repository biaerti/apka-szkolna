// Kahoot - klasa 6B, powtórka tematów z września i października (lekcje [14]-[31] w dzienniku).
// Tylko tematy z wiedzą: części mowy, słownik poprawnej polszczyzny, charakterystyka, pisownia trudnych form,
// środki poetyckie, początek „Świata Zofii”. Teksty, których nie znamy (Baran, Hassenmüller, Ryrych...), pominięte.
// node materialy/kahoot.mjs klasa6b-pazdziernik -> output/kahoot/klasa6b-pazdziernik-kahoot.pdf

export const KAHOOT = {
  plik: 'klasa6b-pazdziernik-kahoot',
  tytul: 'Kahoot - klasa 6, powtórka (wrzesień-październik)',
  opis: 'środki poetyckie, „Świat Zofii”, pisownia trudnych form, części mowy, słownik poprawnej polszczyzny, charakterystyka',
  pytania: [
    // Poetycki obraz jesieni
    { t: 'Epitet to…', o: ['wyraz określający rzeczownik, np. „złote liście”', 'porównanie ze słowem „jak”', 'nadanie rzeczy cech człowieka', 'powtórzenie całego wersu'], ok: 1, czas: 30 },
    { t: '„Liście jak bursztyny” - jaki to środek poetycki?', o: ['Epitet', 'Porównanie', 'Uosobienie', 'Rym'], ok: 2 },
    { t: '„Wiatr płacze za oknem” - jaki to środek poetycki?', o: ['Porównanie', 'Epitet', 'Uosobienie', 'Wyraz dźwiękonaśladowczy'], ok: 3 },
    // Świat Zofii
    { t: 'Jakie pytanie znalazła Zofia w pierwszym tajemniczym liście?', o: ['Gdzie mieszkasz?', 'Kim jesteś?', 'Ile masz lat?', 'Co lubisz robić?'], ok: 2 },
    { t: 'Słowo „filozofia” znaczy dosłownie…', o: ['umiłowanie mądrości', 'nauka o liczbach', 'opis przyrody', 'sztuka pisania listów'], ok: 1 },
    { t: 'Czego według „Świata Zofii” najbardziej potrzeba, żeby być dobrym filozofem?', o: ['Zdolności dziwienia się światu', 'Bardzo dobrej pamięci', 'Grubych książek', 'Umiejętności liczenia'], ok: 1 },
    // Pisownia trudnych form rzeczowników i przymiotników
    { t: 'Nie ma dziś ostatniej … (lekcja). Jak to zapisać?', o: ['lekcii', 'lekcji', 'lekci', 'lekcyi'], ok: 2 },
    { t: 'Kupiłem prezent dla … (Maria). Jak to zapisać?', o: ['Mari', 'Marji', 'Marii', 'Mariji'], ok: 3 },
    { t: 'Szalik wokół … (szyja). Jak to zapisać?', o: ['szyji', 'szyii', 'szyi', 'szji'], ok: 3 },
    { t: 'Końcówkę -ji (np. stacji, Azji) piszemy…', o: ['po spółgłoskach c, s, z', 'po każdej spółgłosce', 'po samogłosce', 'nigdy'], ok: 1 },
    { t: 'Który przymiotnik zapisano BŁĘDNIE?', o: ['kamienny', 'senny', 'drewnianny', 'cenny'], ok: 3 },
    { t: 'Jak zapisać przymiotnik od nazwy miasta Gdańsk?', o: ['gdańskski', 'gdański', 'gdanski', 'gdańsky'], ok: 2 },
    // Odmienne części mowy
    { t: 'Która część mowy odpowiada na pytania: kto? co?', o: ['Przymiotnik', 'Rzeczownik', 'Czasownik', 'Liczebnik'], ok: 2 },
    { t: 'Jaką częścią mowy jest wyraz „mądry”?', o: ['Rzeczownikiem', 'Czasownikiem', 'Przymiotnikiem', 'Zaimkiem'], ok: 3 },
    { t: 'Przez co odmienia się czasownik?', o: ['Tylko przez przypadki', 'Przez osoby, liczby, czasy i tryby', 'Przez stopnie', 'Nie odmienia się'], ok: 2 },
    { t: 'Który wyraz jest zaimkiem?', o: ['piękna', 'biegnie', 'ona', 'pięć'], ok: 3 },
    { t: 'Który przymiotnik jest w stopniu wyższym?', o: ['najszybszy', 'szybszy', 'szybki', 'szybko'], ok: 2 },
    { t: '„Nie mam czasu.” W jakim przypadku jest rzeczownik „czasu”?', o: ['Mianownik', 'Dopełniacz', 'Celownik', 'Biernik'], ok: 2 },
    { t: 'Który wyraz NIE jest odmienną częścią mowy?', o: ['dom', 'wesoły', 'bardzo', 'czytać'], ok: 3 },
    { t: '„Gdybym miał czas, pisałbym list.” W jakim trybie jest „pisałbym”?', o: ['Oznajmującym', 'Rozkazującym', 'Przypuszczającym', 'To bezokolicznik'], ok: 3 },
    { t: 'Który liczebnik jest porządkowy?', o: ['pięć', 'piąty', 'pięcioro', 'dwa'], ok: 2 },
    // Słownik poprawnej polszczyzny
    { t: 'Co sprawdzisz w słowniku poprawnej polszczyzny?', o: ['Tłumaczenie wyrazu na inny język', 'Poprawną odmianę i użycie wyrazu', 'Pochodzenie nazwisk', 'Daty z historii'], ok: 2 },
    { t: 'W którym słowniku najszybciej sprawdzisz, czy piszemy „ó” czy „u”?', o: ['Ortograficznym', 'Wyrazów obcych', 'Frazeologicznym', 'Synonimów'], ok: 1 },
    { t: 'Skrót „pot.” przy wyrazie w słowniku oznacza, że wyraz jest…', o: ['poetycki', 'potoczny', 'przestarzały', 'pospolity'], ok: 2 },
    { t: 'Która forma jest poprawna?', o: ['Wziąłem książkę.', 'Wziełem książkę.', 'Wzięłem książkę.', 'Wziołem książkę.'], ok: 1 },
    { t: 'Która forma jest poprawna?', o: ['Poszłem do kina.', 'Poszedłem do kina.'], ok: 2, czas: 10 },
    // Charakterystyka
    { t: 'Co piszemy we wstępie charakterystyki?', o: ['Ocenę postaci', 'Kim jest postać i skąd ją znamy', 'Wszystkie wydarzenia z książki', 'Morał'], ok: 2 },
    { t: 'Co piszemy w zakończeniu charakterystyki?', o: ['Opis wyglądu', 'Ocenę postaci i nasz stosunek do niej', 'Listę wydarzeń', 'Dialog bohaterów'], ok: 2 },
    { t: 'Każdą cechę charakteru w charakterystyce trzeba…', o: ['tylko wymienić', 'uzasadnić przykładem z zachowania postaci', 'napisać wielką literą', 'powtórzyć dwa razy'], ok: 2 },
    { t: 'Który wyraz nazywa cechę charakteru, a nie wygląd?', o: ['piegowaty', 'wysoki', 'uczynny', 'rudowłosy'], ok: 3 },
    { t: '„Kuba zawsze dzieli się drugim śniadaniem z kolegami.” Jaką cechę to pokazuje?', o: ['Lenistwo', 'Hojność', 'Nieśmiałość', 'Zarozumiałość'], ok: 2 },
  ],
};
