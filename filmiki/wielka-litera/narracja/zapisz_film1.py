"""Zapisuje narracje filmu wielka-litera/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś rozwiążemy zagadkę wielkiej i małej litery. Dowiecie się, czym różni się nazwa pospolita od nazwy własnej, poznacie grupy nazw, które piszemy wielką literą, i wpadniecie w kilka pułapek. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-co-to": """Przeczytajcie to zdanie. Mój pies Burek mieszka w Krakowie nad Wisłą. Niektóre słowa zaczynają się wielką literą, a inne małą. Dlaczego? Słowo pies pasuje do każdego psa na świecie. To nazwa pospolita. Ale Burek to imię tylko jednego, konkretnego psa. To nazwa własna. Tak samo jest z miastem Kraków i rzeką Wisłą. Nazwy własne piszemy wielką literą.""",

"03-pary": """Każda nazwa własna ma swoją nazwę pospolitą, czyli grupę, do której należy. Rzeka to nazwa pospolita, a Odra i Warta to nazwy własne. Miasto: Gdańsk, Poznań. Kot: Mruczek. Dziewczynka: Zosia. Góry: Tatry. Jak to sprawdzić? Zapytaj: czy to słowo nazywa całą grupę, czy jedną, konkretną rzecz? Grupa to mała litera. Jedna, konkretna rzecz to wielka.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest pięć nazw pospolitych. Do każdej dopisz jedną nazwę własną. Pamiętaj o wielkiej literze! Start!""",

"05-odpowiedz1": """Sprawdzamy. Góry: na przykład Tatry, Karkonosze albo Bieszczady. Planeta: Mars, Jowisz albo Saturn. Kot: może Filemon albo Puszek. Państwo: Polska, Niemcy, Francja. Święto: Wielkanoc albo Boże Narodzenie. Każda z tych nazw nazywa jedną, konkretną rzecz. Dlatego wszystkie zaczynają się wielką literą. Zobaczcie też: w nazwie Boże Narodzenie oba słowa piszemy wielką literą.""",

"06-ludzie-miejsca": """Jakie nazwy piszemy wielką literą? Zacznijmy od ludzi i zwierząt. Imiona i nazwiska: Anna Nowak, Jan Kowalski. Imiona zwierząt: pies Reksio, kot Filemon, chomik Pysio. Teraz miejsca. Miasta i wsie: Sopot, Lublin. Państwa: Hiszpania, Czechy. Rzeki: Nil, Dunajec. Góry: Alpy, Sudety. Zauważcie, że słowa miasto, pies czy rzeka zostają małą literą.""",

"07-kosmos-swieta": """Wielką literą piszemy też nazwy kontynentów, czyli wielkich części świata: Europa, Afryka, Azja. Nazwy planet: Wenus, Mars, Neptun. I nazwy świąt: Wielkanoc, Nowy Rok, Dzień Dziecka. W nazwach świąt często każde słowo zaczyna się wielką literą. I jeszcze jedno, co już wiecie: pierwsze słowo w zdaniu zawsze piszemy wielką literą.""",

"08-zadanie2+25": """Zadanie drugie. W tekście na ekranie ktoś zapomniał o wielkich literach. Wypisz z niego wszystkie słowa, które powinny zaczynać się wielką literą. Start!""",

"09-odpowiedz2": """Sprawdzamy. Wielką literą piszemy: Ola, Gdańska, Reksia, Wisłę i Wenus. Ola to imię dziewczynki. Gdańsk to nazwa miasta. Reksio to imię psa. Wisła to nazwa rzeki. A Wenus to nazwa planety. A słowa tata, pies, rzeka i planeta? Zostają małą literą, bo to nazwy pospolite. Pasują do każdego taty, każdego psa i każdej rzeki.""",

"10-pulapki": """Teraz pułapka. To samo słowo może być nazwą własną albo pospolitą. Ziemia przez wielką literę to nasza planeta. Ziemia krąży wokół Słońca. Ale ziemia przez małą to gleba, w której rosną rośliny. Posadziłem fasolkę w ziemi. Tak samo jest z imionami. Róża to imię dziewczynki, a róża to kwiat. Pirat to może być imię kota, a pirat to rozbójnik morski. Zawsze sprawdzaj, o co chodzi w zdaniu.""",

"11-zadanie3+20": """Zadanie trzecie. W każdym zdaniu wybierz właściwy zapis: wielką czy małą literą. Zapisz w zeszycie numer zdania i poprawne słowo. Start!""",

"12-odpowiedz3": """Sprawdzamy. Kret kopie korytarze w ziemi. Mała litera, bo chodzi o glebę. Astronauta oglądał Ziemię z kosmosu. Wielka litera, bo to planeta. W ogrodzie zakwitła czerwona róża. Mała, bo to kwiat. Moją najlepszą koleżanką jest Róża. Wielka, bo to imię. Słowo jest to samo, ale znaczy coś innego. Dlatego najpierw myślimy, a potem piszemy.""",

"13-detektyw": """Jak sprawdzać swój tekst? Bądźcie detektywami wielkich liter. Krok pierwszy: znajdź w tekście imiona, nazwy miejsc, planet i świąt. Krok drugi: zapytaj, czy to jedna, konkretna rzecz. Krok trzeci: sprawdź pierwszą literę. A uwaga, błąd może być w dwie strony! Ktoś może napisać nazwę własną małą literą, ale może też napisać zwykłe słowo wielką.""",

"14-zadanie4+25": """Zadanie czwarte, ostatnie. Ola wysłała pocztówkę z wakacji, ale zrobiła w niej pięć błędów. Znajdź je i przepisz zdania poprawnie. Uwaga, błędy są w dwie strony! Start!""",

"15-odpowiedz4": """Sprawdzamy. Po pierwsze: w Sopocie, wielką literą, bo to nazwa miasta. Po drugie: plaża małą literą, bo to nazwa pospolita, takich plaż jest dużo. Po trzecie: z psem Fafikiem, wielką, bo to imię psa. Po czwarte: planeta Saturn, wielką, bo to nazwa planety. I po piąte: do Włoch, wielką, bo to nazwa państwa. Jeśli znaleźliście wszystkie pięć, jesteście prawdziwymi detektywami!""",

"16-podsumowanie": """Zapamiętaj! Nazwa pospolita nazywa całą grupę: pies, miasto, rzeka. Piszemy ją małą literą. Nazwa własna nazywa jedną, konkretną rzecz: Burek, Kraków, Wisła. Piszemy ją wielką literą. Wielką literą piszemy imiona i nazwiska, imiona zwierząt, nazwy miast, państw, rzek, gór, kontynentów, planet i świąt. Uważaj na pułapki: Ziemia to planeta, a ziemia to gleba. Róża to imię, a róża to kwiat. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
