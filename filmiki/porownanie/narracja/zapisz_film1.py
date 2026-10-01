"""Zapisuje narracje filmu porownanie/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś zajmiemy się porównaniem. To sposób, żeby słowami namalować obrazek w głowie. Dowiecie się, jak rozpoznać porównanie, poznacie porównania, które zna każdy, i sami nauczycie się je tworzyć. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-co-to": """Posłuchajcie dwóch zdań. Pierwsze: mój brat biega szybko. Drugie: mój brat biega szybko jak gepard. Które zdanie widzicie w głowie? Oczywiście drugie! Od razu wyobrażamy sobie brata, który pędzi jak dziki kot po sawannie. To jest porównanie. Porównanie zestawia dwie rzeczy i pokazuje, w czym są do siebie podobne. Brat i gepard są podobni, bo obaj są szybcy.""",

"03-slowa": """Jak rozpoznać porównanie? Po małych słówkach, które łączą dwie rzeczy. Najczęściej to słówko jak. Ale są też inne: jakby, niczym i niby. Posłuchajcie. Ręce miał zimne jak lód. Kangurek skakał, jakby miał sprężyny w nogach. Chmura wisiała na niebie niczym wata cukrowa. Każde porównanie ma trzy części. Najpierw to, co opisujemy. Potem słówko. A na końcu to, do czego porównujemy.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest sześć zdań. Wypisz numery tych, w których jest porównanie. Uwaga, jedno zdanie to pułapka! Start!""",

"05-odpowiedz1": """Sprawdzamy. Porównania są w zdaniach: pierwszym, czwartym i szóstym. Plecak był ciężki jak kamień. Plecak i kamień, oba są ciężkie. W klasie było cicho jak w bibliotece. Klasa i biblioteka, w obu jest cisza. Śnieg leżał na polu niby gruba kołdra. Śnieg i kołdra, oba przykrywają. A pułapka? Zdanie drugie: jak się nazywa twój pies? Jest tu słówko jak, ale to pytanie. Niczego z niczym nie porównujemy. Samo słówko jak jeszcze nie robi porównania. Muszą być dwie rzeczy, które są do siebie podobne.""",

"06-utarte": """Niektóre porównania są tak stare, że zna je prawie każdy. Często chodzi w nich o zwierzęta. Głodny jak wilk, bo wilk zawsze szuka jedzenia. Zdrowy jak ryba, bo ryba jest zawsze rześka i pełna ruchu. Wierny jak pies, bo pies nie opuszcza swojego pana. Takich porównań używamy w rozmowie, w opowiadaniach i w bajkach.""",

"07-zadanie2+20": """Zadanie drugie. Dokończ pięć znanych porównań. Wpisz w miejsce kropek zwierzę albo rzecz. Start!""",

"08-odpowiedz2": """Sprawdzamy. Chytry jak lis, bo w bajkach lis zawsze kogoś przechytrzy. Powolny jak żółw albo jak ślimak, bo oba ledwo się ruszają. Czerwony jak burak albo jak rak. Silny jak koń albo jak niedźwiedź. A śpi jak suseł, bo suseł przesypia całą zimę. Jeśli wpisaliście inne słowo, sprawdźcie jedno: czy ta rzecz naprawdę ma tę cechę? Jeśli tak, wasze porównanie też jest dobre.""",

"09-po-co": """Po co nam porównania? Żeby opis był ciekawszy i żeby łatwiej było coś sobie wyobrazić. Posłuchajcie opisu kota bez porównań. Mój kot jest duży. Ma miękkie futro. Jego oczy są zielone. Trochę nudno, prawda? A teraz z porównaniami. Mój kot jest duży jak poduszka na kanapie. Futro ma miękkie niczym puszysty koc. Oczy świecą mu jak dwie zielone latarki. Od razu go widzicie!""",

"10-zadanie3+25": """Zadanie trzecie. Ulepsz opis psa Burka. Do każdego z trzech zdań dopisz porównanie. Start!""",

"11-odpowiedz3": """Posłuchajcie przykładów. Burek jest wielki jak szafa. Szczeka głośno niczym syrena strażacka. Biega szybko jak strzała. Wasze porównania mogą być zupełnie inne. Sprawdźcie tylko dwie rzeczy. Czy jest słówko jak, jakby, niczym albo niby? I czy to, do czego porównujecie, naprawdę ma tę cechę? Szafa jest wielka, syrena jest głośna, strzała jest szybka. Wszystko się zgadza.""",

"12-wlasne": """Jak samemu wymyślić porównanie? Są trzy kroki. Krok pierwszy: wybierz cechę. Na przykład: ciężki. Krok drugi: pomyśl, co jest bardzo, bardzo ciężkie. Słoń? Kamień? Walizka spakowana na wakacje? Krok trzeci: połącz to słówkiem jak. Mój plecak w poniedziałek jest ciężki jak walizka na wakacje. Gotowe! Im bardziej zaskakujące porównanie, tym ciekawszy tekst.""",

"13-zadanie4+25": """Zadanie czwarte. Wymyśl własne porównania do trzech rzeczy z ekranu. Pamiętaj o trzech krokach: cecha, coś, co ma tę cechę, i słówko. Start!""",

"14-odpowiedz4": """Posłuchajcie przykładów. Szkolny korytarz na przerwie jest głośny jak stadion podczas meczu. Moje łóżko w sobotę rano jest ciepłe niczym gniazdko. Deszcz stuka w okno, jakby ktoś bębnił palcami. Każde z tych porównań ma cechę, słówko i rzecz, która tę cechę ma. Jeśli wasze też tak wyglądają, to brawo!""",

"15-podsumowanie": """Zapamiętaj! Porównanie zestawia dwie rzeczy i pokazuje, w czym są podobne. Rozpoznasz je po słówkach: jak, jakby, niczym, niby. Ale uwaga: samo słówko jak to jeszcze nie porównanie, muszą być dwie podobne rzeczy. Porównanie ma trzy części: to, co opisujemy, słówko i to, do czego porównujemy. Niektóre porównania zna każdy: głodny jak wilk, chytry jak lis, śpi jak suseł. Porównania sprawiają, że opis jest ciekawszy i łatwiej go sobie wyobrazić. A żeby wymyślić własne, wybierz cechę, poszukaj czegoś, co ją ma, i połącz słówkiem jak. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
