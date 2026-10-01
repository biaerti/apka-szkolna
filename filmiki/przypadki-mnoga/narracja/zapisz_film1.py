"""Zapisuje narracje filmu przypadki-mnoga/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Znacie już drużynę siedmiu przypadków. Dziś zobaczymy, co się dzieje, gdy rzeczy jest dużo, czyli w liczbie mnogiej. Najpierw krótka powtórka. Potem odmienimy kilka wyrazów, poznamy przypadki, które wyglądają jak bliźniaki, i poprawimy częste błędy. Czekają na was cztery zadania. Przygotujcie zeszyty!""",

"02-powtorka": """Pamiętacie wierszyk? Mama daje cukierki, Basia najpierw mamie wręcza. Każde słowo zaczyna się tak samo jak kolejny przypadek. Mianownik: kto? co? Dopełniacz: kogo? czego? Celownik: komu? czemu? Biernik: kogo? co? Narzędnik: z kim? z czym? Miejscownik: o kim? o czym? I wołacz, gdy kogoś wołamy: o!""",

"03-koty": """W liczbie pojedynczej odmienialiśmy jednego kota. A co, jeśli kotów jest dużo? Pytania zostają te same! Kto? Koty. Nie ma kogo? Nie ma kotów. Daję mleko komu? Kotom. Widzę kogo? Koty. Bawię się z kim? Z kotami. Opowiadam o kim? O kotach. A na koniec wołam: koty, chodźcie tu! Wyraz zmienia się tak samo jak w liczbie pojedynczej, tylko inaczej się kończy.""",

"04-drzewa": """Weźmy drugi przykład: drzewa. Drzewa rosną. Nie ma drzew. Przyglądam się drzewom. Widzę drzewa. Spaceruję między drzewami. Myślę o drzewach. Drzewa, szumcie! Popatrzcie teraz na końcówki na ekranie. W celowniku słychać to samo zakończenie: kotom, drzewom. W narzędniku też: kotami, drzewami. I w miejscowniku: kotach, drzewach. To bardzo pomaga.""",

"05-zadanie1+25": """Zadanie pierwsze. Odmień przez przypadki wyraz książki. Zadawaj pytania i korzystaj ze słówek pomocniczych z ekranu. Start!""",

"06-odpowiedz1": """Sprawdzamy. Mianownik: książki. Dopełniacz: nie ma książek. Celownik: przyglądam się książkom. Biernik: widzę książki. Narzędnik: z książkami. Miejscownik: o książkach. Wołacz: książki! Zobaczcie, że w dopełniaczu wyraz się skrócił: książek. Tak bywa w liczbie mnogiej. Dlatego zawsze warto powiedzieć całe zdanie na głos: nie ma książek. Ucho podpowie, co brzmi dobrze.""",

"07-blizniaki": """A teraz coś ciekawego. Spójrzcie na mianownik, biernik i wołacz kotów: koty, koty, koty! Wyglądają jak trojaczki. Jak je odróżnić? Po pytaniu! Koty śpią na kanapie. Kto śpi? Koty. To mianownik. Karmię koty. Kogo karmię? Koty. To biernik. Koty, chodźcie jeść! Tu nikogo nie pytamy, tylko wołamy. To wołacz. Słowo jest takie samo, ale robi w zdaniu coś innego.""",

"08-zadanie2+20": """Zadanie drugie. W każdym zdaniu wyróżniony wyraz to mianownik, biernik albo wołacz. Zadaj pytanie i zapisz nazwę przypadku. Start!""",

"09-odpowiedz2": """Sprawdzamy. Samochody stoją na parkingu. Co stoi? Samochody. To mianownik. Mama kupiła jabłka. Co kupiła? Jabłka. To biernik. Ptaki, lećcie do ciepłych krajów! Wołamy ptaki, więc to wołacz. Lubię zimowe wieczory. Co lubię? Wieczory. Biernik. Lekcje kończą się wcześnie. Co się kończy? Lekcje. Mianownik. Pamiętajcie: kto, co, to mianownik. Kogo, co po czasowniku, to biernik.""",

"10-bledy": """W liczbie mnogiej łatwo o błąd. Posłuchajcie. Ktoś mówi: bawię się z dzieciami. Poprawnie jest: z dziećmi. Ktoś mówi: rozmawiam z ludziami. Poprawnie: z ludźmi. Ktoś mówi: nie mam pieniądzów. Poprawnie: nie mam pieniędzy. Te wyrazy odmieniają się po swojemu i trzeba je po prostu zapamiętać. A gdy nie jesteście pewni, zajrzyjcie do słownika.""",

"11-zadanie3+20": """Zadanie trzecie. W czterech zdaniach jest po jednym błędzie. Znajdź źle odmieniony wyraz i zapisz go poprawnie. Start!""",

"12-odpowiedz3": """Sprawdzamy. Zgubiłem dwie pary skarpetek, a nie skarpetków. Nie mogę znaleźć moich spodni, a nie spodniów. Na wycieczce byliśmy z innymi dziećmi. W sklepie nie było już bułek. Zobaczcie: aż trzy błędy były w dopełniaczu, czyli po słowach nie ma albo nie było. To najbardziej podstępny przypadek. Gdy coś brzmi dziwnie, powiedz: nie ma czego? I sprawdź w słowniku.""",

"13-tabela": """Na koniec połączmy obie liczby w jednej tabeli. Po lewej jeden kot, po prawej wiele kotów. Mianownik: kot i koty. Dopełniacz: kota i kotów. Celownik: kotu i kotom. Biernik: kota i koty. Narzędnik: kotem i kotami. Miejscownik: o kocie i o kotach. Wołacz: kocie! i koty! Pytania są te same w obu kolumnach. Zmienia się tylko końcówka.""",

"14-zadanie4+25": """Zadanie czwarte, ostatnie. Narysuj w zeszycie tabelę z dwiema kolumnami. Odmień wyraz okno przez wszystkie przypadki w liczbie pojedynczej i mnogiej. Start!""",

"15-odpowiedz4": """Sprawdzamy. Liczba pojedyncza: okno, okna, oknu, okno, oknem, o oknie, okno! Liczba mnoga: okna, okien, oknom, okna, oknami, o oknach, okna! Najtrudniejszy był dopełniacz liczby mnogiej: nie ma okien. Wyraz trochę się zmienia w środku. Zauważcie też, że w liczbie mnogiej słowo okna pojawia się aż trzy razy. To nasze trojaczki: mianownik, biernik i wołacz.""",

"16-podsumowanie": """Zapamiętaj! W liczbie mnogiej jest tyle samo przypadków co w pojedynczej i zadajemy te same pytania. Kotom, kotami, kotach: w celowniku, narzędniku i miejscowniku końcówki są prawie zawsze takie same. Mianownik, biernik i wołacz w liczbie mnogiej często wyglądają tak samo. Rozróżniasz je pytaniem: kto, co, czy kogo, co, a wołacz poznasz po wołaniu. Uważaj na dopełniacz: nie ma skarpetek, spodni, bułek. Zapamiętaj też: z dziećmi i z ludźmi. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
