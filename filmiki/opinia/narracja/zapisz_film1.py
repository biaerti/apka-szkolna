"""Zapisuje narracje filmu opinia/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś nauczymy się mówić, co myślimy, i przekonywać innych. Dowiecie się, czym fakt różni się od opinii, co to jest argument i dlaczego bo tak to żaden argument. Na końcu poznacie kontrargument. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-fakt-opinia": """Posłuchajcie zdania. Pizza jest najlepszym jedzeniem na świecie. Czy to prawda? Jedni powiedzą, że tak. Inni wolą pierogi albo naleśniki. I każdy z nich ma prawo tak myśleć. To jest opinia. Opinia to moje zdanie o czymś. Ktoś inny może mieć inne. A teraz drugie zdanie. Pizza pochodzi z Włoch. To można sprawdzić w książce albo w internecie. To jest fakt. Fakt to coś, co można sprawdzić. Fakt jest taki sam dla wszystkich.""",

"03-zwroty": """Jak pokazać, że mówimy swoją opinię? Używamy specjalnych zwrotów. Moim zdaniem. Uważam, że. Sądzę, że. Myślę, że. Według mnie. Posłuchajcie. Moim zdaniem lato jest lepsze od zimy. Uważam, że w szkole powinno być więcej wycieczek. Sądzę, że koty są sprytniejsze od psów. Takie zwroty mówią słuchaczowi: uwaga, to jest moje zdanie, nie musisz się z nim zgadzać.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest sześć zdań. Przy każdym numerze napisz w zeszycie: fakt albo opinia. Pamiętaj: fakt można sprawdzić. Start!""",

"05-odpowiedz1": """Sprawdzamy. Tydzień ma siedem dni. To fakt, każdy kalendarz to potwierdzi. Matematyka to najnudniejszy przedmiot. To opinia. Niektórzy kochają matematykę! Pająk ma osiem nóg. Fakt, można policzyć. Zima jest piękniejsza od lata. Opinia, bo ktoś woli lato. Wisła płynie przez Kraków. Fakt, wystarczy spojrzeć na mapę. I ostatnie: koty są mądrzejsze od psów. To opinia. Właściciele psów na pewno się nie zgodzą! Zauważcie: w opiniach są słowa najnudniejszy, piękniejsza, mądrzejsze. Takie słowa często zdradzają opinię.""",

"06-argument": """Swoją opinię warto uzasadnić. Do tego służy argument. Argument to powód, dla którego tak myślę. Jest prosty wzór: opinia, potem słówko ponieważ albo bo, a na końcu powód. Posłuchajcie. Uważam, że warto uprawiać sport, ponieważ dzięki temu jesteśmy zdrowsi. Moim zdaniem warto mieć rodzeństwo, bo zawsze jest się z kim bawić. A co z odpowiedzią: bo tak? To nie jest argument! Bo tak niczego nie wyjaśnia. Nikogo nie przekona. Tak samo: bo ja chcę albo bo wszyscy tak mają.""",

"07-zadanie2+20": """Zadanie drugie. Opinia brzmi: warto mieć w klasie akwarium z rybkami. Który z trzech powodów jest prawdziwym argumentem? Zapisz jego numer. Start!""",

"08-odpowiedz2": """Sprawdzamy. Argumentem jest powód trzeci: ponieważ uczymy się dbać o zwierzęta. On naprawdę wyjaśnia, dlaczego akwarium jest dobrym pomysłem. Powód pierwszy, bo tak, niczego nie tłumaczy. Powód drugi, bo w innej klasie też jest akwarium, to żaden powód. To, że ktoś coś ma, nie znaczy, że my też tego potrzebujemy. Dobry argument odpowiada na pytanie: dlaczego?""",

"09-zosia": """Pamiętacie Zosię, która bardzo chciała chodzić na kurs fotografii? Zosia nie płakała i nie tupała nogą. Zamiast tego przygotowała argumenty. Pomyślała, czym martwią się rodzice, i na każdy kłopot miała odpowiedź. Kurs jest w sobotę, więc nie przeszkadza w szkole. Na opłatę odda swoje kieszonkowe, a babcia trochę dołoży. Będzie chodzić z koleżanką, a jej rodzice zawiozą obie dziewczynki. A nauczycielka plastyki mówi, że Zosia ma talent. I rodzice się zgodzili! Płacz nikogo nie przekonuje. Argumenty tak.""",

"10-zadanie3+25": """Zadanie trzecie. Dokończ opinię: warto czytać książki przed snem, ponieważ. Podaj dwa różne argumenty. Start!""",

"11-odpowiedz3": """Posłuchajcie przykładów. Warto czytać książki przed snem, ponieważ łatwiej potem zasnąć. Ponieważ poznajemy nowe słowa i lepiej piszemy. Ponieważ wyobraźnia pracuje i mamy ciekawsze sny. Ponieważ odpoczywamy od telefonu i telewizora. Wasze argumenty mogą być inne. Sprawdźcie tylko, czy każdy odpowiada na pytanie: dlaczego? Jeśli tak, to brawo!""",

"12-kontrargument": """Kiedy przekonujemy, druga strona też ma swoje argumenty. Argument drugiej strony to kontrargument. Posłuchajcie. Uważam, że w czwartej klasie warto mieć telefon, bo można zadzwonić do rodziców. Kontrargument: ale telefon rozprasza na lekcjach. Obie strony mają trochę racji! Co wtedy robimy? Słuchamy spokojnie i odpowiadamy na ten kontrargument. Na przykład: telefon będzie wyłączony w plecaku i wyjmę go dopiero po lekcjach. Tak właśnie zrobiła Zosia.""",

"13-zadanie4+25": """Zadanie czwarte. Bardzo chcesz mieć psa. Mama mówi: nie. Napisz jeden argument, który może mieć mama. A potem napisz, co jej odpowiesz. Start!""",

"14-odpowiedz4": """Posłuchajcie przykładów. Mama mówi: kto będzie wychodził z psem na spacer? Ty odpowiadasz: ja, codziennie rano i po szkole, zrobię grafik spacerów. Albo mama mówi: pies kosztuje dużo pieniędzy. Ty odpowiadasz: dołożę z kieszonkowego na karmę. Albo mama mówi: nikt nie zostanie z psem w czasie wakacji. Ty odpowiadasz: dziadek kocha psy i chętnie się nim zajmie. Dobra odpowiedź nie kłóci się z mamą, tylko rozwiązuje jej kłopot.""",

"15-podsumowanie": """Zapamiętaj! Fakt to coś, co można sprawdzić. Jest taki sam dla wszystkich. Opinia to moje zdanie. Ktoś inny może myśleć inaczej. Opinię zaczynamy od zwrotów: moim zdaniem, uważam, że, sądzę, że. Argument to powód. Wzór: opinia, ponieważ, powód. Bo tak to nie argument, bo niczego nie wyjaśnia. Płacz też nikogo nie przekonuje, argumenty tak. Kontrargument to argument drugiej strony. Słuchamy go spokojnie i odpowiadamy. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
