"""Zapisuje narracje filmu podsumowanie4-dzial2/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Kończymy drugi rozdział: Pośród słów i znaczeń. Sprawdźmy, co już wiemy i co potrafimy. Przypomnimy słowa, list, rzeczownik, przekonywanie i pisownię. Po drodze czeka pięć zadań. Przygotujcie zeszyty!""",

"02-potoczne": """Część pierwsza: słowa. Wyrazy potoczne to słowa na luzie. Używamy ich z kolegami, z rodziną i w wiadomościach do przyjaciół. Na przykład: luzik, dzieciak, gapić się. Ale w wypracowaniu i w rozmowie z dorosłym wybieramy ich poważnych braci. Luzik to spokojnie. Dzieciak to dziecko. Gapić się to patrzeć.""",

"03-porownanie": """Porównanie zestawia dwie rzeczy, które są do siebie w czymś podobne. Rozpoznajemy je po słówkach: jak, jakby, niczym, niby. Twardy niczym skała. Słodki jak miód. Patrzył, jakby zobaczył ducha. Pamiętajcie: samo słówko jak to jeszcze za mało. Muszą być dwie podobne rzeczy.""",

"04-synonimy": """Synonimy to wyrazy, które znaczą prawie to samo. Mały, malutki, drobny. Synonimy pomagają uniknąć powtórzeń. Antonimy to przeciwieństwa. Mały i duży. Dzień i noc. Wejść i wyjść. Uwaga: nie każdy wyraz ma antonim. Jakie przeciwieństwo ma krzesło? Żadne!""",

"05-zadanie1+20": """Zadanie pierwsze. Są cztery polecenia. Zamień wyraz potoczny na oficjalny, dokończ porównanie, podaj synonim i podaj antonim. Start!""",

"06-odpowiedz1": """Sprawdzamy. Kuba ciągle gada na lekcji. Gada to wyraz potoczny. Oficjalnie: Kuba ciągle rozmawia na lekcji. Dalej: lekki jak piórko, bo piórko prawie nic nie waży. Synonim do smutny to przygnębiony, markotny albo zasmucony. Znaczą prawie to samo. A antonim do odważny to tchórzliwy albo bojaźliwy, czyli jego przeciwieństwo.""",

"07-list": """Część druga: list. List ma swoje części i swoją kolejność. Na górze, po prawej stronie, miejsce i data. Potem nagłówek, na przykład: Droga Babciu! Dalej wstęp, rozwinięcie i zakończenie. Na końcu pozdrowienie i podpis. A jeśli o czymś zapomnieliśmy, dopisujemy postscriptum. I jeszcze jedno. Wyrazy Ty, Ciebie, Tobie i Twój piszemy w liście wielką literą. Tak okazujemy szacunek.""",

"08-zadanie2+20": """Zadanie drugie. Ola napisała list do Wojtka. Zrobiła w nim cztery błędy. Znajdź je i zapisz, jak je poprawić. Start!""",

"09-odpowiedz2": """Sprawdzamy. Pierwszy błąd jest w nagłówku. Drogi Wojtku piszemy wielką literą, bo nagłówkiem zaczynamy list. Drugi i trzeci błąd: twój i ciebie. To zwroty do adresata, więc w liście piszemy je wielką literą: Twój, Ciebie. A wyraz mnie zostaje małą literą, bo to słowo o nadawcy, czyli o Oli. Czwarty błąd: brakuje podpisu. Bez niego Wojtek nie wie, od kogo jest list. Pod pozdrowieniem powinno stać: Ola.""",

"10-rzeczownik": """Część trzecia: rzeczownik. Rzeczownik odpowiada na pytania kto? co? Nazywa osoby, zwierzęta, rzeczy, miejsca, a nawet uczucia, na przykład radość. Rzeczownik ma liczbę: jeden ołówek, dwa ołówki. I ma rodzaj, który poznamy po słówkach ten, ta, to. Ten ołówek, ta gumka, to pióro.""",

"11-przypadki": """Rzeczownik odmienia się przez przypadki. Jest ich siedem i każdy ma swoje pytania. Mianownik: kto? co? Dopełniacz: kogo? czego? Celownik: komu? czemu? Biernik: kogo? co? Narzędnik: z kim? z czym? Miejscownik: o kim? o czym? I wołacz: o! Kolejność łatwo zapamiętać z wierszyka: Mama Daje Cukierki, Basia Najpierw Mamie Wręcza. Każde słowo zaczyna się tak samo jak kolejny przypadek.""",

"12-zadanie3+20": """Zadanie trzecie. W każdym zdaniu jeden rzeczownik jest podkreślony. Zadaj pytanie od czasownika i napisz, w jakim przypadku jest ten rzeczownik. Start!""",

"13-odpowiedz3": """Sprawdzamy. Nie mam czego? Parasola. To dopełniacz. Daję kość komu? Psu. To celownik. Widzę co? Tęczę. To biernik. Idę do kina z kim? Z dziadkiem. To narzędnik. Marzę o czym? O wakacjach. To miejscownik. Pytanie od czasownika prowadzi prosto do przypadku.""",

"14-opinia": """Część czwarta: mówimy i przekonujemy. Fakt to coś, co można sprawdzić. Tydzień ma siedem dni. Opinia to moje zdanie. Moim zdaniem piątek to najlepszy dzień tygodnia. Opinię zaczynamy zwrotami: moim zdaniem, uważam, że, sądzę, że. A żeby kogoś przekonać, potrzebny jest argument, czyli powód. Na przykład: bo w piątek zaczyna się weekend. Bo tak to nie jest argument!""",

"15-asertywnosc": """Asertywność to umiejętność spokojnego mówienia nie. Nie dajesz się namówić na coś, czego nie chcesz. Ale też nikogo nie obrażasz i nie krzyczysz. Pomaga prosty wzór: nie, bo, i powód. A czasem jeszcze: ale mogę, i propozycja. Nie pojadę teraz na rower, bo muszę się uczyć. Ale mogę pojechać jutro.""",

"16-zadanie4+20": """Zadanie czwarte. Ma dwie części. Najpierw napisz przy trzech zdaniach, czy to fakt, czy opinia. Potem wybierz odpowiedź asertywną. Start!""",

"17-odpowiedz4": """Sprawdzamy. W styczniu często pada śnieg. To fakt, bo można to sprawdzić. Bałwany są najśmieszniejsze na świecie. To opinia, bo ktoś inny może myśleć inaczej. Moim zdaniem sanki są lepsze od nart. Też opinia, zdradzają ją słowa moim zdaniem. A asertywna jest trzecia odpowiedź. Jest w niej spokojne nie, jest powód i jest propozycja. Pierwsza jest uległa, a druga agresywna.""",

"18-wielka-litera": """Część piąta: pisownia. Nazwy własne piszemy wielką literą. Na przykład: Zosia, kot Mruczek, Poznań, Odra, Karpaty, Mars. Nazwy pospolite, takie jak dziewczynka, kot, miasto czy rzeka, piszemy małą literą. Uwaga, pułapka! Dni tygodnia i miesiące też piszemy małą literą: poniedziałek, maj.""",

"19-nie": """I ostatni temat: słówko nie. Z czasownikami piszemy je osobno: nie wiem, nie płaczę. A z rzeczownikami razem: nieuprzejmość, niesmak, niespodzianka. Jak je odróżnić? Zadaj pytanie. Kto? co? To rzeczownik, piszemy razem. Co robi? To czasownik, piszemy osobno.""",

"20-zadanie5+25": """Zadanie piąte, ostatnie. Przepisz zdania do zeszytu. W nawiasach wybierz wielką albo małą literę. I zdecyduj, czy słówko nie piszemy razem, czy osobno. Start!""",

"21-odpowiedz5": """Sprawdzamy. Niedzielę piszemy małą literą, bo dni tygodnia to nie są nazwy własne. Babcią też małą, bo babcia to nazwa pospolita. Reksem wielką, bo to imię psa. Gdańska wielką, bo to nazwa miasta. Morzem małą, bo nie podaliśmy nazwy morza. Niepogody piszemy razem, bo pogoda to rzeczownik. A nie narzekałyśmy osobno, bo to czasownik. Co robiłyśmy? Narzekałyśmy.""",

"22-zapamietaj": """Zapamiętaj! Wyrazy potoczne są na luzie, nie do wypracowania. Porównanie ma słówko jak, jakby, niczym albo niby. Synonimy znaczą prawie to samo, a antonimy są przeciwieństwami. List ma stałe części i kolejność, a do adresata piszemy wielką literą. Rzeczownik odpowiada na pytania kto? co? Ma liczbę, rodzaj i siedem przypadków. Opinię popieramy argumentem, a odmawiamy spokojnie i z powodem. Nazwy własne piszemy wielką literą, a słówko nie z rzeczownikami piszemy razem. Jeśli dobrze zrobiliście cztery zadania z pięciu, możecie powiedzieć: to wiem, to potrafię! Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
