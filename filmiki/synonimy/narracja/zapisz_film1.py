"""Zapisuje narracje filmu synonimy/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś poznacie dwa ważne słowa: synonimy i antonimy. Synonimy to wyrazy, które znaczą prawie to samo. Antonimy to wyrazy o przeciwnym znaczeniu. Dowiecie się, po co nam są i jak je odróżnić. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-problem": """Posłuchajcie krótkiego opowiadania Kasi. W sobotę byłam na ładnej wycieczce. Pogoda była ładna. Pojechaliśmy do ładnego lasu. Zobaczyłam tam ładnego jelenia. Zrobiłam mu ładne zdjęcie. Na obiad zjedliśmy ładną zupę. To był bardzo ładny dzień. Słyszycie, co tu nie gra? Słowo ładny powtarza się aż siedem razy! Tekst jest nudny. A ładna zupa? Zupa raczej jest pyszna. Jak to naprawić? Pomogą nam synonimy.""",

"03-synonimy": """Synonimy to wyrazy bliskoznaczne. Znaczą prawie to samo, więc można je wstawić jeden za drugi. Posłuchajcie. Duży, wielki, ogromny. Iść, maszerować, kroczyć, wędrować. Wesoły, radosny, uśmiechnięty. Dom, budynek, chata. Wszystkie słowa w jednej grupie mówią o tym samym. Synonimy znajdziecie w słowniku wyrazów bliskoznacznych.""",

"04-odcienie": """Uwaga! Synonimy znaczą prawie to samo, ale nie dokładnie to samo. Każdy ma trochę inny odcień. Weźmy słowo patrzeć. Zerkać to patrzeć szybko i ukradkiem. Przyglądać się to patrzeć uważnie i długo. Gapić się to patrzeć z otwartą buzią. Dlatego zanim wstawicie synonim, sprawdźcie, czy pasuje do zdania. Mama przygląda się obrazowi. To brzmi dobrze. Mama gapi się na obraz. To brzmi już zupełnie inaczej!""",

"05-zadanie1+20": """Zadanie pierwsze. Na ekranie są dwie kolumny. Połącz w pary wyrazy, które znaczą prawie to samo. Zapisz w zeszycie numer i literę. Start!""",

"06-odpowiedz1": """Sprawdzamy. Smutny i markotny, bo oba opisują kogoś, kto nie ma humoru. Szybki i prędki, bo oba mówią, że coś dzieje się w krótkim czasie. Bać się i lękać się, bo to dwa słowa na strach. Zmęczony i wyczerpany, bo oba oznaczają, że ktoś nie ma już siły. A auto i samochód to po prostu ta sama rzecz. Jeśli wszystkie pary się zgadzają, brawo!""",

"07-powtorzenia": """Po co nam synonimy? Żeby tekst nie był nudny i żeby nie powtarzać ciągle tego samego słowa. Wróćmy do opowiadania Kasi i zamieńmy słowo ładny. W sobotę byłam na wspaniałej wycieczce. Pogoda była słoneczna. Pojechaliśmy do pięknego lasu. Zobaczyłam tam dostojnego jelenia. Zrobiłam mu udane zdjęcie. Na obiad zjedliśmy pyszną zupę. To był cudowny dzień. Teraz każde słowo mówi coś więcej. Od razu ciekawiej!""",

"08-zadanie2+25": """Zadanie drugie. W tej rozmowie ciągle powtarza się słowo powiedział. Zamień je na lepsze synonimy. Podpowiedź: zobacz, czy ktoś pyta, odpowiada, krzyczy, czy mówi cicho. Start!""",

"09-odpowiedz2": """Sprawdzamy. Gdzie jest mój plecak, zapytał Tomek. Zapytał, bo na końcu jest znak zapytania. Pod ławką, odpowiedziała Ola. Odpowiedziała, bo Ola daje odpowiedź na pytanie. Uwaga, pies, krzyknął tata. Krzyknął, bo tata ostrzega i na końcu jest wykrzyknik. Śpij już, kochanie, szepnęła mama. Szepnęła, bo przy śpiącym dziecku mówimy cicho. Każdy synonim mówi nam coś więcej o tym, jak ktoś mówi.""",

"10-antonimy": """Teraz druga para słów. Antonimy to wyrazy o przeciwnym znaczeniu. Są jak dwa końce huśtawki. Zimny i gorący. Dzień i noc. Wejść i wyjść. Smutny i wesoły. Szybko i wolno. Antonimy przydają się, gdy chcemy coś porównać albo pokazać różnicę. Rano było zimno, a w południe gorąco. Ale uwaga! Nie każdy wyraz ma antonim. Jakie jest przeciwieństwo słowa stół? Albo słowa niebieski? Albo rower? Nie ma takiego słowa. I to jest w porządku.""",

"11-zadanie3+20": """Zadanie trzecie. Do każdego wyrazu z ekranu dopisz antonim, czyli wyraz o przeciwnym znaczeniu. Start!""",

"12-odpowiedz3": """Sprawdzamy. Wysoki i niski. Otwierać i zamykać. Cichy i głośny. Początek i koniec. Pełny i pusty. Jak sprawdzić, czy antonim jest dobry? Wstaw go do zdania. Butelka jest pełna. Butelka jest pusta. Znaczenie odwróciło się całkiem na drugą stronę. Czyli wszystko się zgadza!""",

"13-test": """Jak szybko odróżnić synonim od antonimu? Jest prosty test. Wstaw drugie słowo do tego samego zdania. Jeśli zdanie znaczy prawie to samo, to synonimy. Mój pies jest mądry. Mój pies jest bystry. Prawie to samo, więc to synonimy. Jeśli zdanie znaczy coś odwrotnego, to antonimy. Mój pies jest mądry. Mój pies jest głupi. Całkiem odwrotnie, więc to antonimy. Synonim to kolega, który stoi obok. Antonim to przeciwnik, który stoi naprzeciwko.""",

"14-zadanie4+20": """Zadanie czwarte. Przy każdej parze napisz, czy to synonimy, czy antonimy. Skrót masz na ekranie. Pamiętaj o teście ze zdaniem. Start!""",

"15-odpowiedz4": """Sprawdzamy. Para pierwsza, mądry i inteligentny, to synonimy. Para druga, ciepło i zimno, to antonimy. Para trzecia, biec i pędzić, to synonimy. Para czwarta, kupić i sprzedać, to antonimy, bo jedna osoba płaci, a druga dostaje pieniądze. Para piąta, piękny i śliczny, to synonimy. Para szósta, stary i młody, to antonimy. Ile macie dobrze? Jeśli sześć, jesteście mistrzami słów!""",

"16-podsumowanie": """Zapamiętaj! Synonimy to wyrazy bliskoznaczne. Znaczą prawie to samo, na przykład duży, wielki i ogromny. Każdy synonim ma trochę inny odcień, więc sprawdź, czy pasuje do zdania. Synonimy pomagają, żeby nie powtarzać ciągle tego samego słowa. Antonimy to wyrazy o przeciwnym znaczeniu, na przykład dzień i noc, pełny i pusty. Nie każdy wyraz ma antonim. Żeby je odróżnić, wstaw słowo do zdania. Znaczy to samo, to synonim. Znaczy odwrotnie, to antonim. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
