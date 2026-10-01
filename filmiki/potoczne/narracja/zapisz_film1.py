"""Zapisuje narracje filmu potoczne/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś porozmawiamy o słowach, których używacie codziennie: na przerwie, na boisku i w wiadomościach do kolegów. To wyrazy potoczne. Dowiecie się, co to jest, kiedy wolno ich używać, a kiedy lepiej nie. Zajrzymy też do słownika. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-dwie-sytuacje": """Posłuchajcie. Kuba spotyka na korytarzu kolegę i mówi: Siema! Idziesz na boisko? Będzie czadowo! Pięć minut później Kuba spotyka panią dyrektor i mówi: Dzień dobry! Czy możemy wyjść na boisko? Kuba chce tego samego. Ale do kolegi mówi inaczej, a do pani dyrektor inaczej. I bardzo dobrze! Z kolegą rozmawia swobodnie, na luzie. Z panią dyrektor rozmawia grzecznie, oficjalnie.""",

"03-co-to": """Słowa, których używamy na luzie, nazywamy wyrazami potocznymi. Mówimy nimi do kolegów, do rodzeństwa, do przyjaciół. Piszemy je w wiadomościach na telefonie. Na przykład: siema, nara, kasa, ziomek, ściema, ogarniać, czadowo. Wyrazy potoczne nie są brzydkie ani zakazane. Są po prostu swobodne. Pasują do rozmowy z bliskimi, ale nie pasują do rozmowy oficjalnej.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest pięć zdań. Przy każdym napisz, do kogo ktoś to powiedział: do kolegi czy do pani dyrektor. Start!""",

"05-odpowiedz1": """Sprawdzamy. Nara, widzimy się jutro! To do kolegi, bo nara to wyraz potoczny. Do widzenia, do zobaczenia jutro. To do pani dyrektor, wszystko grzecznie i oficjalnie. Przepraszam, nie zrozumiałem polecenia. Też do pani. Sorki, nie ogarniam tego zadania. Do kolegi: sorki i ogarniam to wyrazy potoczne. Ale ściema! Do kolegi. Ściema to potoczne słowo, które znaczy: kłamstwo, oszustwo.""",

"06-bracia": """Każdy wyraz potoczny ma swojego starszego, poważnego brata. To słowo, którego używamy w sytuacji oficjalnej. Kasa to pieniądze. Wcinać to jeść. Kimać to spać. Ziomek to kolega. Wkurzony to zdenerwowany. Czadowo to wspaniale albo świetnie. A ogarniać ma nawet dwóch braci: rozumieć albo sprzątać. Nie ogarniam zadania, czyli nie rozumiem zadania. Ogarnij pokój, czyli posprzątaj pokój.""",

"07-zadanie2+25": """Zadanie drugie. Przepisz do zeszytu cztery zdania. Wyrazy potoczne zamień na ich poważnych braci. Start!""",

"08-odpowiedz2": """Sprawdzamy. Zgubiłem całą kasę. Lepiej: zgubiłem wszystkie pieniądze. Mój brat wcina już trzecią kanapkę. Lepiej: mój brat je już trzecią kanapkę. Nie ogarniam tej mapy. Lepiej: nie rozumiem tej mapy. Babcia była wkurzona na kota. Lepiej: babcia była zdenerwowana na kota. Zobaczcie: sens zdania się nie zmienił. Zmienił się tylko styl. Z luźnego na oficjalny.""",

"09-kiedy": """Kiedy wolno używać wyrazów potocznych? Pomyślcie o ubraniach. Dres jest świetny na boisko. Ale na szkolną akademię zakładamy coś eleganckiego. Ze słowami jest tak samo. Wyrazy potoczne są dobre w rozmowie z kolegami, z rodzeństwem, na przerwie i w wiadomości do przyjaciela. Ale unikamy ich, kiedy odpowiadamy przy tablicy, rozmawiamy z nauczycielem, z dyrektorem albo z obcą dorosłą osobą, na przykład w sklepie czy w bibliotece. I uwaga: w wypracowaniu wyrazy potoczne są zakazane!""",

"10-zadanie3+25": """Zadanie trzecie. Ola napisała wypracowanie o wycieczce. Niestety, wkradły się do niego wyrazy potoczne. Znajdź je. Jest ich cztery. Potem zapisz, jak je poprawić. Start!""",

"11-odpowiedz3": """Sprawdzamy. Pierwszy wyraz to mega. Było mega! Lepiej napisać: było wspaniale albo było bardzo ciekawie. Drugi to wcinaliśmy. Lepiej: jedliśmy lody. Trzeci to kasa. Lepiej: tata wydał na nie wszystkie pieniądze. Czwarty to kimali. Lepiej: w autobusie wszyscy spali. Teraz wypracowanie Oli brzmi poważnie i może dostać dobrą ocenę.""",

"12-slownik": """A skąd wiadomo, czy słowo jest potoczne? Można sprawdzić w słowniku. W słowniku wszystkie słowa stoją w kolejności alfabetycznej, czyli tak jak litery w alfabecie. Każde słowo ze swoim opisem to hasło. Zobaczcie hasło kimać. Najpierw jest samo słowo. Potem krótki skrót, który znaczy: wyraz potoczny. Potem wyjaśnienie: spać, drzemać. Na końcu przykład: dziadek kima przed telewizorem. Jeśli w słowniku zobaczysz ten skrót, wiesz, że to słowo na luz, a nie do wypracowania.""",

"13-zadanie4+20": """Zadanie czwarte. Ułóż pięć wyrazów potocznych w kolejności alfabetycznej, tak jak w słowniku. Uwaga, dwa wyrazy zaczynają się tą samą literą. Wtedy patrzymy na drugą literę. Start!""",

"14-odpowiedz4": """Sprawdzamy. Kolejność jest taka: kasa, kimać, ogarniać, ściema, wcinać. Kasa i kimać zaczynają się tą samą literą. Patrzymy więc na drugą literę. Druga litera słowa kasa jest w alfabecie wcześniej niż druga litera słowa kimać. Dlatego kasa stoi pierwsza. A ściema stoi przed wcinać, bo jej pierwsza litera jest w alfabecie wcześniej.""",

"15-podsumowanie": """Zapamiętaj! Wyrazy potoczne to słowa swobodne, na luzie. Na przykład: kasa, ziomek, ściema, ogarniać, czadowo. Używamy ich w rozmowie z kolegami, z rodziną i w wiadomościach do przyjaciół. Nie używamy ich w rozmowie z nauczycielem, z dyrektorem, z obcym dorosłym i nigdy w wypracowaniu. Każdy wyraz potoczny ma poważnego brata: kasa to pieniądze, wcinać to jeść, kimać to spać. W słowniku wyraz potoczny ma przy sobie krótki skrót. A słowa w słowniku stoją w kolejności alfabetycznej. Dobierajcie słowa tak, jak dobieracie ubranie: do sytuacji. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
