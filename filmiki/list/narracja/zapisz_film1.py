"""Zapisuje narracje filmu list/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś nauczymy się, jak zbudowany jest list. Poznacie wszystkie części listu, dowiecie się, jak zacząć list, kiedy pisać wielką literą i co to jest akapit. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-zagadka": """Wyobraźcie sobie, że w skrzynce leży kartka. Jest na niej napisane tylko tak: Mam się dobrze. Przyjedź w wakacje. I nic więcej. Nie ma daty. Nie ma, do kogo jest kartka. Nie ma podpisu. Od kogo to jest? Kiedy przyszło? Do kogo? Nie wiadomo! Dlatego list ma swoje stałe części. Dzięki nim od razu wiemy, kto pisze, do kogo i kiedy.""",

"03-gora": """Spójrzcie na list, który Zosia napisała do dziadka. Zaczynamy od góry. W prawym górnym rogu jest miejscowość i data. Zosia pisze z Gdańska, piątego października. Niżej, po lewej stronie, jest nagłówek, czyli zwrot do osoby, do której piszemy. Kochany Dziadku! Potem jest wstęp. To jedno albo dwa zdania na powitanie. Zosia dziękuje dziadkowi za paczkę.""",

"04-dol": """Dalej jest rozwinięcie, czyli najważniejsza część listu. Tu piszemy, co się u nas dzieje. Zosia opowiada o nowej szkole i o koleżance Hani. Potem jest zakończenie. Zosia pyta, kiedy dziadek przyjedzie. Na dole są pozdrowienia, na przykład ściskam Cię mocno. I podpis: Twoja wnuczka Zosia. A na samym końcu może być postscriptum, czyli dopisek o czymś, o czym zapomnieliśmy. Zosia dopisała, że kot Mruczek też tęskni.""",

"05-zadanie1+20": """Zadanie pierwsze. Ola napisała list do cioci, ale się spieszyła. Przeczytaj list i wypisz trzy części, których w nim brakuje. Start!""",

"06-odpowiedz1": """Sprawdzamy. Brakuje miejscowości i daty w prawym górnym rogu. Ciocia nie wie, kiedy Ola napisała list. Brakuje nagłówka, czyli zwrotu do cioci, na przykład Droga Ciociu! List zaczyna się od razu od środka. I brakuje podpisu. Ciocia może się tylko domyślać, kto napisał. Pozdrowienia są, wstęp, rozwinięcie i zakończenie też. Ale bez daty, nagłówka i podpisu list jest niekompletny.""",

"07-naglowek": """Teraz nagłówek. Zapamiętajcie, że po nagłówku stawiamy wykrzyknik albo przecinek. To ważne, bo od tego zależy następne słowo. Jeśli po nagłówku jest wykrzyknik, to następne zdanie zaczynamy wielką literą. Droga Babciu, wykrzyknik. A w nowej linijce: Dziękuję za sweter, wielką literą. Jeśli po nagłówku jest przecinek, to piszemy dalej małą literą, bo zdanie jeszcze trwa. Droga Babciu, przecinek. A w nowej linijce: dziękuję za sweter, małą literą. Oba sposoby są dobre. Sam nagłówek zawsze zaczynamy wielką literą.""",

"08-zadanie2+20": """Zadanie drugie. Te trzy początki listów mają błędy. Przepisz je poprawnie do zeszytu. Patrz uważnie na znaki po nagłówku. Start!""",

"09-odpowiedz2": """Sprawdzamy. Pierwszy: Kochana Ciociu, przecinek, a dalej dziękuję małą literą. Po przecinku zdanie trwa, więc wielka litera była błędem. Drugi: Drogi Wujku, wykrzyknik, a dalej Dawno wielką literą. Po wykrzykniku zaczyna się nowe zdanie. Trzeci: Drogi Marku musi zaczynać się wielką literą, bo nagłówek zawsze zaczynamy wielką literą. A po wykrzykniku dalej wielką literą.""",

"10-ty-ciebie": """W liście jest jeszcze jedna ważna zasada. Kiedy zwracamy się do osoby, do której piszemy, piszemy wielką literą. Ty, Ciebie, Tobie, Twój, Twoja. Do kilku osób: Wy, Was, Wam, Wasz. To znak szacunku. Pokazujemy, że ta osoba jest dla nas ważna. Ale kiedy piszemy o sobie, to małą literą: ja, mnie, mój, moja. Przykład: Dziękuję Ci za Twój list. Ci i Twój wielką literą. Bardzo mnie ucieszył. Mnie małą literą. Jedna pułapka: na początku zdania zawsze jest wielka litera, nawet przy słowie mój.""",

"11-zadanie3+20": """Zadanie trzecie. Przepisz zdania z listu i wstaw słowa z nawiasów w dobrej formie. Uważaj, kiedy wielką, a kiedy małą literą. Start!""",

"12-odpowiedz3": """Sprawdzamy. Dziękuję Ci za list. Ci wielką literą, bo zwracamy się do adresata. Bardzo mnie ucieszył. Mnie małą literą, bo chodzi o nas. Czy Twój pies już wyzdrowiał? Twój wielką literą, bo to pies adresata. Często o Tobie myślę. Tobie wielką literą. Mój kot przesyła Ci buziaki. Mój jest wielką literą tylko dlatego, że stoi na początku zdania. A Ci znowu wielką, bo to adresat.""",

"13-akapit": """Ostatnia rzecz to akapit. Akapit to kawałek tekstu o jednej sprawie. Jedna myśl, jeden akapit. Nowy akapit zaczynamy od nowej linijki i trochę odsuwamy pierwsze słowo od brzegu. To odsunięcie to wcięcie. Spójrzcie na dwa listy. W pierwszym wszystko jest zlepione w jeden blok. Trudno się czyta i łatwo się zgubić. W drugim każda sprawa ma swój akapit: podziękowanie, opowieść o wycieczce, pytania na koniec. Od razu widać, gdzie zaczyna się nowa myśl.""",

"14-zadanie4+20": """Zadanie czwarte. Ten list jest napisany bez akapitów. Zdania mają numery. Wypisz numery zdań, od których powinien zaczynać się nowy akapit. Pierwszego zdania nie licz. Start!""",

"15-odpowiedz4": """Sprawdzamy. Nowy akapit zaczyna się od zdania trzeciego i od zdania piątego. Dlaczego? Zdania pierwsze i drugie to wstęp, podziękowanie za list. Od zdania trzeciego zmienia się sprawa: teraz Kuba opowiada o rybach. Zdanie czwarte nadal mówi o rybach, więc zostaje w tym samym akapicie. Od zdania piątego znowu nowa sprawa: Kuba pyta i żegna się. To jest zakończenie. Trzy sprawy, trzy akapity.""",

"16-podsumowanie": """Zapamiętaj! List ma stałe części. Na górze po prawej miejscowość i data. Potem nagłówek, czyli zwrot do adresata. Potem wstęp, rozwinięcie i zakończenie. Na dole pozdrowienia i podpis. Czasem jest jeszcze postscriptum, czyli dopisek. Po nagłówku stawiamy wykrzyknik i piszemy dalej wielką literą, albo przecinek i piszemy dalej małą literą. Ty, Ciebie, Twój piszemy wielką literą, a ja, mnie, mój małą. A każda nowa sprawa to nowy akapit, od nowej linijki, z wcięciem. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
