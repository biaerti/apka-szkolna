"""Zapisuje narracje filmu rzeczownik4/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Rozejrzyjcie się po klasie. Ławka, lampa, kaloryfer, pani przy biurku, kolega z ławki. Wszystko wokół nas ma swoją nazwę. A te nazwy to właśnie rzeczowniki. Dziś dowiecie się, co nazywa rzeczownik, co to jest liczba i co to jest rodzaj. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-co-nazywa": """Rzeczownik odpowiada na pytania: kto? co? Kto? pytamy o ludzi i zwierzęta. Kto gra w piłkę? Sąsiad. Kto miauczy pod drzwiami? Kotka. Co? pytamy o całą resztę. Co leży na stole? Kubek. Rzeczowniki nazywają osoby: dziadek, strażak, ciocia. Zwierzęta: jamnik, wiewiórka. Rzeczy: kubek, parasol, piłka. Rośliny: sosna, mak, paproć. Zjawiska: grad, mgła, wiatr. I miejsca: park, plaża, wieś.""",

"03-pojecia": """Jest jeszcze jedna grupa rzeczowników. To pojęcia. Pojęcia to coś, czego nie można dotknąć ani schować do plecaka. Odwaga, nuda, pomysł, cierpliwość, zdrowie. Czy można wziąć do ręki odwagę? Nie! Ale możemy zapytać: co? Co pomogło strażakowi? Odwaga. Co ci wpadło do głowy? Pomysł. Skoro pytamy: co?, to jest rzeczownik. Nawet jeśli go nie widać.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest siedem rzeczowników. Przy każdym napisz, co nazywa: osobę, zwierzę, rzecz, roślinę, zjawisko, miejsce czy pojęcie. Start!""",

"05-odpowiedz1": """Sprawdzamy. Babcia to osoba. Pytamy: kto? Babcia. Chomik to zwierzę, też pytamy: kto? Hulajnoga to rzecz, można na niej jeździć. Tulipan to roślina, rośnie w ogródku. Śnieżyca to zjawisko, przychodzi zimą razem z wiatrem i śniegiem. Las to miejsce, można do niego pójść na spacer. A tęsknota? To pojęcie. Nie można jej dotknąć, ale można ją poczuć. Pytamy: co? Tęsknota. Czyli to też rzeczownik.""",

"06-liczba": """Część druga: liczba. Rzeczownik mówi nam, ile czegoś jest. Jedna rzecz to liczba pojedyncza. Jeden kubek, jedna gruszka, jeden balon. Więcej rzeczy to liczba mnoga. Dwa kubki, trzy gruszki, cztery balony. Czasem wyraz zmienia się bardzo mocno. Jeden człowiek, ale wielu ludzi. Jedno oko, ale dwoje oczu. Jedna ręka, ale dwie ręce. Sprytny sposób: powiedz przed wyrazem jeden albo dwa. Od razu usłyszysz, jaka to liczba.""",

"07-zadanie2+20": """Zadanie drugie. Zmień liczbę rzeczowników. Jeśli wyraz jest w liczbie pojedynczej, zapisz go w mnogiej. Jeśli jest w mnogiej, zapisz go w pojedynczej. Start!""",

"08-odpowiedz2": """Sprawdzamy. Autobus to jeden autobus, więc w liczbie mnogiej: autobusy. Lusterko: lusterka. Sąsiadka: sąsiadki. Ptaki to już liczba mnoga, bo mówimy: dwa ptaki. W pojedynczej to: ptak. Kanapki to: kanapka. A przyjaciele? Jeden przyjaciel. Tu wyraz zmienił się trochę mocniej, tak jak człowiek i ludzie. Jeśli nie wiesz, powiedz: jeden, dwa. Jeden ptak, dwa ptaki.""",

"09-rodzaj": """Część trzecia: rodzaj. Każdy rzeczownik ma swój rodzaj. Sprawdzamy go małymi słówkami: ten, ta, to. Ten parasol, ten jamnik, ten strażak. To rodzaj męski. Ta gruszka, ta sosna, ta wiewiórka. To rodzaj żeński. To lusterko, to kino, to słońce. To rodzaj nijaki. Nie zgaduj po wyglądzie wyrazu. Po prostu dopowiedz: ten, ta albo to, i posłuchaj, co brzmi dobrze.""",

"10-rodzaj-mnoga": """A w liczbie mnogiej? Tam są tylko dwa rodzaje. Sprawdzamy je słówkami: ci i te. Ci, kiedy mówimy o mężczyznach i chłopcach. Ci strażacy, ci dziadkowie, ci piłkarze. To rodzaj męskoosobowy. Te, kiedy mówimy o wszystkim innym. Te jamniki, te gruszki, te kina, te ciocie. To rodzaj niemęskoosobowy. Zapamiętaj: ci tylko dla panów i chłopców. Cała reszta to te.""",

"11-zadanie3+20": """Zadanie trzecie. Przed każdym rzeczownikiem dopisz słówko: ten, ta albo to. Obok napisz nazwę rodzaju. Uwaga, dwa wyrazy są podchwytliwe! Start!""",

"12-odpowiedz3": """Sprawdzamy. Ten słoń, ten telefon. Rodzaj męski. To jajko, to imię. Rodzaj nijaki. A teraz pułapki. Mysz. Ktoś mógłby pomyśleć: ten mysz. Ale mówimy: ta mysz! Rodzaj żeński. I noc. Nie mówimy: ten noc, tylko ta noc. Też żeński. Widzicie? Wygląd wyrazu może oszukać. Dlatego zawsze sprawdzamy słówkiem: ten, ta, to.""",

"13-pulapki": """Część czwarta: pułapki. Są rzeczowniki, które mają tylko liczbę mnogą. Nożyczki, spodnie, okulary, sanki, skrzypce. Nawet jeśli mamy jedną parę spodni, mówimy: te spodnie. Nie powiemy: jedno nożyczko albo jedna spodnia. Tak samo z dniami, które świętujemy: wakacje, urodziny, imieniny. Jakiego rodzaju są te wyrazy? Mówimy: te, więc to rodzaj niemęskoosobowy.""",

"14-zadanie4+20": """Zadanie czwarte. Przed każdym rzeczownikiem w liczbie mnogiej dopisz: ci albo te. Pamiętaj, ci jest tylko dla panów i chłopców. Start!""",

"15-odpowiedz4": """Sprawdzamy. Ci koledzy i ci policjanci, bo to chłopcy i mężczyźni. Rodzaj męskoosobowy. Te koleżanki. To też osoby, ale dziewczynki, więc te. Te kotki, bo to zwierzęta. Te auta, bo to rzeczy. I te okulary. Ten wyraz ma tylko liczbę mnogą, ale słówko te pasuje bez problemu. Wszystkie wyrazy z te to rodzaj niemęskoosobowy.""",

"16-podsumowanie": """Zapamiętaj! Rzeczownik odpowiada na pytania: kto? co? Nazywa osoby, zwierzęta, rzeczy, rośliny, zjawiska, miejsca i pojęcia. Pojęć nie można dotknąć, ale to też rzeczowniki: odwaga, nuda, pomysł. Rzeczownik ma liczbę. Pojedyncza, kiedy jest jedna rzecz, i mnoga, kiedy jest ich więcej. Pomaga słówko jeden albo dwa. Rzeczownik ma też rodzaj. W liczbie pojedynczej: ten, męski. Ta, żeński. To, nijaki. W liczbie mnogiej: ci dla panów i chłopców, a te dla całej reszty. A nożyczki, spodnie i wakacje mają tylko liczbę mnogą. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
