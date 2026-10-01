"""Zapisuje narracje filmu przypadki/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Posłuchajcie. Mam psa. Idę z psem na spacer. Opowiadam o psie. To ciągle ten sam pies, a słowo za każdym razem brzmi trochę inaczej. Zmienia się jego koniec. Te zmiany to właśnie przypadki. Dziś poznacie drużynę siedmiu przypadków, ich pytania i sprytny wierszyk. Nauczycie się też, jak poprawnie kogoś zawołać. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-druzyna1": """Przypadków jest siedem. Tyle, ile dni w tygodniu. To jak drużyna. Każdy zawodnik ma swoje imię i swoje pytania. Do pytań dodamy pomocnika, czyli krótkie słowa przed rzeczownikiem. Pierwszy jest mianownik. Pytania: kto? co? Pomocnik: jest. Jest pies. Drugi to dopełniacz. Pytania: kogo? czego? Pomocnik: nie ma. Nie ma psa. Trzeci to celownik. Pytania: komu? czemu? Pomocnik: przyglądam się. Przyglądam się psu.""",

"03-druzyna2": """Czwarty jest biernik. Pytania: kogo? co? Pomocnik: widzę. Widzę psa. Piąty to narzędnik. Pytania: z kim? z czym? Pomocnik: idę z. Idę z psem. Szósty to miejscownik. Pytania: o kim? o czym? Pomocnik: mówię o. Mówię o psie. I siódmy, wołacz. On nie ma pytania. Ma okrzyk: o! Wołamy: o, psie! Uwaga! Dopełniacz i biernik często wyglądają tak samo. Nie ma psa i widzę psa. Rozróżnia je pomocnik.""",

"04-zaba": """Zobaczmy drugi przykład. Tym razem żaba. Jest żaba. Nie ma żaby. Przyglądam się żabie. Widzę żabę. Idę z żabą. Mówię o żabie. O, żabo! Widzicie? Za każdym razem wyraz kończy się inaczej. A pytania i pomocnicy są zawsze takie same. Dlatego warto je znać na pamięć. To one prowadzą nas do właściwej formy.""",

"05-zadanie1+25": """Zadanie pierwsze. Odmień rzeczownik lis przez wszystkie siedem przypadków. Przy każdym napisz nazwę przypadku i pomocnika, tak jak zrobiliśmy to z żabą. Start!""",

"06-odpowiedz1": """Sprawdzamy. Mianownik: jest lis. Dopełniacz: nie ma lisa. Celownik: przyglądam się lisowi. Biernik: widzę lisa. Narzędnik: idę z lisem. Miejscownik: mówię o lisie. Wołacz: o, lisie! Popatrzcie na celownik. Przyglądam się komu? Lisowi. A przy psie było: psu. Każdy wyraz odmienia się trochę po swojemu. Dlatego zawsze pomaga pytanie. I jeszcze jedno: miejscownik i wołacz brzmią tu tak samo. Mówię o lisie i o, lisie!""",

"07-wierszyk": """Część druga. Kolejność przypadków jest ważna. Jak ją zapamiętać? Wystarczy krótki wierszyk. Mama Daje Cukierki, Basia Najpierw Mamie Wręcza. Każde słowo zaczyna się tak samo jak kolejny przypadek. Mama to mianownik. Daje to dopełniacz. Cukierki to celownik. Basia to biernik. Najpierw to narzędnik. Mamie to miejscownik. I wręcza to wołacz. Powtórzcie na głos razem ze mną. Mama Daje Cukierki, Basia Najpierw Mamie Wręcza.""",

"08-zadanie2+20": """Zadanie drugie. Karteczki z nazwami przypadków się pomieszały. Ułóż je w dobrej kolejności i przy każdym dopisz pytania. Pomoże wam wierszyk. Start!""",

"09-odpowiedz2": """Sprawdzamy. Pierwszy: mianownik, kto? co? Drugi: dopełniacz, kogo? czego? Trzeci: celownik, komu? czemu? Czwarty: biernik, kogo? co? Piąty: narzędnik, z kim? z czym? Szósty: miejscownik, o kim? o czym? Siódmy: wołacz, o! Jeśli się pomyliliście, wróćcie do wierszyka. Mama Daje Cukierki, Basia Najpierw Mamie Wręcza.""",

"10-w-zdaniu": """Część trzecia. Jak rozpoznać przypadek w zdaniu? Znajdź czynność, czyli czasownik, i zadaj od niego pytanie. Kupiłam gruszkę. Kupiłam co? Gruszkę. To biernik. Pomagam bratu. Pomagam komu? Bratu. To celownik. Boję się burzy. Boję się czego? Burzy. Dopełniacz. Rozmawiam z trenerem. Z kim? Z trenerem. Narzędnik. Marzę o wycieczce. O czym? O wycieczce. Miejscownik. Pytanie od czynności zawsze wskaże drogę.""",

"11-zadanie3+25": """Zadanie trzecie. W każdym zdaniu jeden rzeczownik jest wyróżniony. Napisz, w jakim jest przypadku. Zadaj pytanie od czynności. Start!""",

"12-odpowiedz3": """Sprawdzamy. Na niebie świeci księżyc. Co świeci? Księżyc. Mianownik. Szukam klucza. Szukam czego? Klucza. Dopełniacz. Dałem marchewkę królikowi. Komu dałem? Królikowi. Celownik. Dziadek czyta gazetę. Czyta co? Gazetę. Biernik. Jadę na basen z ciocią. Z kim? Z ciocią. Narzędnik. Opowiadam o koncercie. O czym? O koncercie. Miejscownik.""",

"13-wolacz": """Część czwarta: wołacz. Używamy go, kiedy kogoś wołamy albo zwracamy się do niego. Zosia, ale wołamy: Zosiu! Bartek, wołamy: Bartku! Tata, wołamy: tato! Pani Ewa, mówimy: pani Ewo! W rozmowie z kolegą często mówimy po prostu: Bartek, chodź! Ale w liście, w życzeniach i w grzecznej rozmowie używamy wołacza. Brzmi to ładnie i z szacunkiem.""",

"14-zadanie4+20": """Zadanie czwarte. Zawołaj poprawnie te osoby. Zapisz każde imię w wołaczu i dodaj wykrzyknik. Start!""",

"15-odpowiedz4": """Sprawdzamy. Ola, wołamy: Olu! Janek: Janku! Tak samo jak Bartek i Bartku. Babcia: babciu! Pan Adam: panie Adamie! Zmienia się tu i słowo pan, i imię. A Michał? Michale! Ten był najtrudniejszy. Jeśli nie wiecie, jak brzmi wołacz, pomyślcie, jak zaczęlibyście list albo życzenia. Drogi Michale!""",

"16-podsumowanie": """Zapamiętaj! Rzeczownik odmienia się przez przypadki. Jest ich siedem. Mianownik: kto? co? Jest. Dopełniacz: kogo? czego? Nie ma. Celownik: komu? czemu? Przyglądam się. Biernik: kogo? co? Widzę. Narzędnik: z kim? z czym? Idę z. Miejscownik: o kim? o czym? Mówię o. I wołacz: o! Kolejność zapamiętasz z wierszyka: Mama Daje Cukierki, Basia Najpierw Mamie Wręcza. Żeby poznać przypadek w zdaniu, zadaj pytanie od czynności. A kiedy kogoś wołasz, użyj wołacza: Zosiu, tato, babciu! Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
