"""Zapisuje narracje filmu asertywnosc/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś nauczymy się czegoś bardzo przydatnego. Jak grzecznie powiedzieć nie. Poznacie trudne słowo: asertywność. Dowiecie się, jak odmawiać spokojnie i bez kłótni, i kiedy nie chroni nas przed kłopotami. Po drodze czekają cztery zadania, a ostatnie zrobimy na głos!""",

"02-trzy-reakcje": """Wyobraźcie sobie taką scenkę. Dostałeś nową grę. Jeszcze w nią nie grałeś. Kolega mówi: pożycz mi ją na cały tydzień. Ty nie chcesz. Co możesz zrobić? Pierwsza reakcja: no dobra, bierz. Mówisz tak, choć w środku jest ci smutno. To reakcja uległa. Druga reakcja: spadaj, nigdy w życiu! Krzyczysz i obrażasz kolegę. To reakcja agresywna. Trzecia reakcja: nie, sam jeszcze w nią nie grałem. Ale możesz przyjść w sobotę i zagramy razem. To reakcja asertywna.""",

"03-co-to": """Asertywność to umiejętność mówienia nie. Spokojnie i z szacunkiem. Osoba asertywna mówi, czego chce, a czego nie chce. Nie krzyczy. Nie obraża. Ale też nie zgadza się na wszystko, żeby tylko ktoś był zadowolony. Uległy myśli tylko o innych. Agresywny myśli tylko o sobie. A asertywny szanuje i siebie, i innych. Mówi spokojnie, patrzy w oczy i nie musi się złościć.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie są trzy scenki. Przy każdej są trzy odpowiedzi. Która z nich jest asertywna? Zapisz numer scenki i literę odpowiedzi. Start!""",

"05-odpowiedz1": """Sprawdzamy. W scence pierwszej asertywna jest ostatnia odpowiedź. Nie, siedzę tu pierwszy, ale w drodze powrotnej możemy się zamienić. Spokojnie, z powodem i z propozycją. W scence drugiej asertywna jest pierwsza odpowiedź. Nie mam ochoty na to wyzwanie. Nie trzeba robić czegoś głupiego, żeby nie być nudnym. W scence trzeciej asertywna jest środkowa odpowiedź. To moje cukierki, mogę ci dać jednego. Pozostałe odpowiedzi to albo zgoda na wszystko, albo krzyk i wyzwiska.""",

"06-wzor": """Jak odmówić asertywnie? Jest prosty wzór. Nie, bo. Ale mogę. Najpierw mówisz nie. Potem mówisz, dlaczego. A na końcu proponujesz coś innego. Posłuchajcie. Siostra prosi: posprzątaj za mnie pokój. Ty mówisz: nie, bo mam swój pokój do sprzątania. Ale mogę ci pomóc złożyć ubrania. Kolega prosi: daj mi całą swoją kanapkę. Ty mówisz: nie, bo sam jestem głodny. Ale mogę się z tobą podzielić. Widzicie? Jest nie, jest powód i jest propozycja.""",

"07-zadanie2+25": """Zadanie drugie. Odmów asertywnie w dwóch sytuacjach z ekranu. Użyj wzoru: nie, bo. Ale mogę. Start!""",

"08-odpowiedz2": """Posłuchajcie przykładów. Kolega chce grać na twoim telefonie całą przerwę. Ty mówisz: nie, bo kończy mi się bateria, a muszę zadzwonić do mamy. Ale mogę ci pokazać tę grę po lekcjach. Koleżanka namawia, żebyście przeszli przez płot do sąsiada po piłkę. Ty mówisz: nie, bo to cudzy ogród i można spaść. Ale mogę pójść z tobą do sąsiada i poprosić o piłkę. Wasze odpowiedzi mogą być inne. Ważne, żeby było nie, powód i spokojny ton.""",

"09-chroni": """Asertywność czasem chroni przed kłopotami. Posłuchajcie uważnie. Jeśli obcy dorosły proponuje ci podwiezienie, cukierki albo mówi: chodź, pokażę ci pieska, mówisz głośno: nie! Nie wsiadasz. Nie idziesz. Odchodzisz i od razu mówisz o tym zaufanemu dorosłemu: rodzicom albo nauczycielowi. Obcemu nie musisz niczego tłumaczyć. Wystarczy samo nie. Asertywność pomaga też, gdy grupa śmieje się z kogoś. Nie musisz się śmiać razem z innymi.""",

"10-zadanie3+20": """Zadanie trzecie. Do waszej klasy przyszła nowa osoba. Kilku kolegów się z niej śmieje. Napisz, co powiesz kolegom, a co nowej osobie. Start!""",

"11-odpowiedz3": """Posłuchajcie przykładów. Do kolegów możesz powiedzieć: przestańcie, to wcale nie jest śmieszne. Albo: ona jest nowa, lepiej jej pomóżmy. Do nowej osoby możesz powiedzieć: chodź z nami na przerwę. Albo: pokażę ci, gdzie jest stołówka. Mówisz spokojnie, bez krzyku i bez wyzwisk. A jeśli koledzy nie przestaną, idziesz do nauczyciela. To nie jest skarżenie. To jest pomoc.""",

"12-wiecej": """Asertywność to nie tylko odmawianie. Osoba asertywna potrafi też poprosić o swoje. Na przykład: czy możesz oddać mi książkę, którą pożyczyłeś? Potrafi powiedzieć szczerą opinię, bez obrażania. Na przykład: twój rysunek ma piękne kolory, ale konia trudno poznać. Potrafi też pochwalić innych i przyjąć pochwałę. Kiedy ktoś mówi: świetnie ci poszło, mówisz po prostu: dziękuję. Bez wstydu i bez tłumaczenia się.""",

"13-zadanie4+25": """Zadanie czwarte, na głos, w parach. Dobierzcie się z osobą z ławki. Jedna osoba czyta prośbę z ekranu, druga odmawia według wzoru. Potem się zamieniacie. Mówcie spokojnie i patrzcie sobie w oczy. Start!""",

"14-odpowiedz4": """Jak wam poszło? Posłuchajcie przykładów. Daj mi swoją gumkę na zawsze. Nie, bo jest mi potrzebna. Ale mogę ci ją pożyczyć na tę lekcję. Chodź, wyrwiemy kartkę z zeszytu kolegi. Nie, bo to jego zeszyt. Ale mogę ci dać kartkę ze swojego. Oddaj mi swoje miejsce w kolejce. Nie, bo czekam tu od dawna. Ale mogę ci przypilnować miejsca za mną. Jeśli mówiliście spokojnie i bez krzyku, to brawo!""",

"15-podsumowanie": """Zapamiętaj! Na prośbę możesz zareagować na trzy sposoby. Uległy zgadza się na wszystko, choć nie chce. Agresywny krzyczy i obraża. Asertywny mówi nie spokojnie i z szacunkiem. Wzór odmowy: nie, bo. Ale mogę. Obcemu dorosłemu mówisz po prostu nie, odchodzisz i mówisz o tym zaufanemu dorosłemu. Kiedy ktoś się z kogoś śmieje, nie musisz się śmiać razem z innymi. A asertywność to też prośba o swoje, szczera opinia i przyjęcie pochwały. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
