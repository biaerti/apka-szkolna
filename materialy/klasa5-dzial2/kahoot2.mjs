// Kahoot 2 - klasa 5, dział 2 „Uwaga, uczucia!”: więcej definicji („co to jest…?”) i zadań praktycznych (co powiesz, co napiszesz, popraw).
// node materialy/kahoot.mjs klasa5-dzial2 kahoot2 -> output/kahoot/klasa5-dzial2-kahoot2.pdf
// Inne przykłady niż w kahoot.mjs, filmikach, zeszycie, karcie pracy i puli sprawdzianu.
// Zapis: q(pytanie, dobra, [złe], img, czas?) - dobra odpowiedź trafia na stałe, różne miejsca (pole `ok`).

const MIEJSCA = [2, 1, 3, 4, 1, 3, 2, 4, 3, 1, 4, 2];
let nr = 0;
function q(t, dobra, zle, img, czas) {
  const ok = Math.min(MIEJSCA[nr++ % MIEJSCA.length], zle.length + 1);
  const o = [...zle];
  o.splice(ok - 1, 0, dobra);
  return { t, o, ok, img, ...(czas ? { czas } : {}) };
}

export const KAHOOT = {
  plik: 'klasa5-dzial2-kahoot2',
  tytul: 'Kahoot 2 - klasa 5, dział 2',
  opis: 'definicje i zadania praktyczne: przenośnia, frazeologizmy, zdrobnienia i zgrubienia, złość, rzeczownik i przypadki, nietypowa odmiana, ę i ą, temat i końcówka, ó, sprawozdanie, dwukropek, reklama',
  pytania: [
    // Przenośnia
    q('Czym jest przenośnia (metafora)?', 'Wyrazy, które razem znaczą coś nowego', ['Zestawienie dwóch rzeczy słówkiem „jak”', 'Wyraz o przeciwnym znaczeniu', 'Dwa wyrazy, które się rymują'], 'paint brush', 30),
    q('Czym porównanie różni się od przenośni?', 'Porównanie ma słówko jak, niczym, jakby', ['Porównanie jest zawsze dłuższe', 'Przenośnia zawsze się rymuje', 'Niczym się nie różnią'], 'balance scale', 30),
    q('Kasia opisuje jesień. Które zdanie ma przenośnię?', 'Na ścieżce leży dywan z liści.', ['Liście spadają z drzew.', 'Liście są żółte jak cytryny.', 'Jesienią często pada.'], 'autumn leaves', 30),
    // Frazeologizmy
    q('Co to jest związek frazeologiczny?', 'Stałe połączenie wyrazów o przenośnym znaczeniu', ['Każde zdanie z czasownikiem', 'Wyraz zdrobniały', 'Dwa wyrazy, które się rymują'], 'puzzle', 30),
    q('Mama mówi: „Nie zawracaj mi głowy!”. O co jej chodzi?', 'Nie przeszkadzaj mi.', ['Obróć mi głowę.', 'Uczesz mnie.', 'Idź na spacer.'], 'busy desk'),
    q('„Owinąć kogoś wokół palca” znaczy…', 'łatwo kimś kierować', ['pomóc mu się ubrać', 'zawiązać mu bandaż', 'zmierzyć mu palec'], 'hand'),
    // Zdrobnienia i zgrubienia, siła uczuć
    q('Co to jest zgrubienie?', 'Wyraz, który pokazuje coś dużego, niechęć albo żart', ['Wyraz, który pokazuje coś małego i miłego', 'Wyraz o przeciwnym znaczeniu', 'Wyraz z obcego języka'], 'big dog', 30),
    q('Babcia pisze list. Które słowo okazuje czułość? „Kochany …!”', 'wnuczku', ['wnuczysko', 'wnuku', 'chłopie'], 'letter writing'),
    q('Które słowo jest zdrobnieniem od „góra”?', 'górka', ['górzysko', 'góral', 'górny'], 'mountain'),
    q('Które uczucie jest NAJSŁABSZE?', 'obawa', ['przerażenie', 'strach', 'groza'], 'storm'),
    // Złość, „Lwy”
    q('Kto mówi w wierszu „Lwy”?', 'Chłopiec, który jest zły', ['Lew w zoo', 'Mama chłopca', 'Pani w szkole'], 'child'),
    q('Kolega zabrał ci piłkę bez pytania. Co najlepiej powiedzieć?', '„Jestem zły, bo wziąłeś piłkę bez pytania.”', ['„Ty złodzieju!”', '„Już nigdy się z tobą nie bawię!”', 'Nic, tylko go popchnąć.'], 'football', 30),
    q('Po czym poznasz w ciele, że rośnie w tobie złość?', 'Zaciśnięte pięści i gorąca twarz', ['Ziewanie', 'Burczenie w brzuchu', 'Zimne stopy'], 'fist'),
    // Rzeczownik
    q('Na jakie pytania odpowiada rzeczownik?', 'kto? co?', ['co robi?', 'jaki? jaka?', 'gdzie? kiedy?'], 'books'),
    q('Rzeczownik pospolity to…', 'nazwa ogólna pisana małą literą', ['nazwa jednej, konkretnej rzeczy', 'imię zwierzęcia', 'tytuł książki'], 'city street'),
    q('„w sobotę marek pojechał do torunia.” Ile wyrazów trzeba napisać wielką literą?', '3', ['1', '2', '4'], 'gingerbread'),
    q('„Rozmawiamy o filmie.” W jakim przypadku jest „filmie”?', 'miejscownik', ['celownik', 'narzędnik', 'wołacz'], 'cinema'),
    q('„Kasiu, pomóż mi!” W jakim przypadku jest „Kasiu”?', 'wołacz', ['mianownik', 'celownik', 'biernik'], 'helping hand'),
    q('Daję prezent (siostra). Jaka forma pasuje?', 'siostrze', ['siostrę', 'siostrą', 'siostry'], 'gift'),
    // Nietypowa odmiana
    q('Które zdanie jest poprawne?', 'Zwiedziliśmy dwa muzea.', ['Zwiedziliśmy dwa muzeumy.', 'Zwiedziliśmy dwa muzeów.', 'Zwiedziliśmy dwie muzea.'], 'museum'),
    q('Dokończ: „Szukam moich …” (okulary).', 'okularów', ['okulary', 'okularami', 'okularom'], 'glasses'),
    // Ę i ą
    q('Kiedy na końcu wyrazu piszemy -ę?', 'Gdy pytam: widzę kogo? co?', ['Gdy pytam: z kim? z czym?', 'Zawsze w liczbie mnogiej', 'Po literze „a”'], 'eye'),
    q('„Ola i Ania graj… w siatkówkę.” Jaka końcówka?', '-ą', ['-ę', '-o', '-em'], 'volleyball'),
    q('Które zdanie jest bezbłędne?', 'Rozumiem to zadanie.', ['Rozumię to zadanie.', 'Rozumią to zadanie.', 'Rozumiemę to zadanie.'], 'thinking'),
    // Temat i końcówka, ó
    q('Co to jest końcówka wyrazu?', 'Część, która zmienia się w odmianie', ['Pierwsza litera wyrazu', 'Ostatnie zdanie tekstu', 'Część, która zostaje w każdej formie'], 'finish line', 30),
    q('Co to jest oboczność?', 'Wymiana głosek w temacie, np. ręka - ręce', ['Zmiana końcówki na zerową', 'Dwa wyrazy o tym samym znaczeniu', 'Błąd ortograficzny'], 'hands', 30),
    q('W którym wyrazie ó wymienia się na o?', 'rów', ['wróbel', 'ołówek', 'góra'], 'country road'),
    // Sprawozdanie
    q('Sprawozdanie to…', 'rzeczowa relacja z prawdziwego wydarzenia', ['zmyślona historia z przygodą', 'list do przyjaciela', 'opis wyglądu postaci'], 'notebook'),
    q('Czym najlepiej zastąpić „poszliśmy” w sprawozdaniu?', 'udaliśmy się', ['zwialiśmy', 'polecieliśmy jak strzała', 'poszliśmy znowu'], 'hiking group'),
    q('Który szczegół jest ZBĘDNY w sprawozdaniu z wycieczki?', 'Na śniadanie zjadłem kanapkę z serem.', ['Wyjechaliśmy o 8.00.', 'Zwiedziliśmy zamek.', 'Przewodnik opowiedział o rycerzach.'], 'sandwich', 30),
    // Dwukropek
    q('Kiedy stawiamy dwukropek?', 'Przed wyliczeniem, cytatem lub czyimiś słowami', ['Na końcu każdego zdania', 'Zawsze przed „że”', 'Po każdym imieniu'], 'checklist', 30),
    q('Które zdanie potrzebuje dwukropka?', 'Mam w piórniku trzy rzeczy ołówek, gumkę i linijkę.', ['Idę do szkoły.', 'Lubię lody waniliowe.', 'Za oknem pada deszcz.'], 'pencil case', 30),
    // Reklama
    q('Jaki jest główny cel tekstu reklamowego?', 'Namówić do kupna lub skorzystania z usługi', ['Podać godziny otwarcia', 'Opowiedzieć bajkę', 'Ostrzec przed burzą'], 'billboard'),
    q('Które hasło brzmi jak z reklamy?', 'Sok Malinka - pyszna minka!', ['Sok malinowy, 1 litr.', 'Sok kosztuje 5 zł.', 'Sok stoi na półce.'], 'juice'),
  ],
};
