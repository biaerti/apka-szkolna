"""Zapisuje narracje filmu nie-rzeczownik/film1 do plikow narracja/film1/NN-nazwa.txt."""
from pathlib import Path

SCENY = {
"01-intro": """Cześć! Dziś zajmiemy się małym słówkiem, które sprawia dużo kłopotu. To słówko nie. Kiedy piszemy je razem z innym wyrazem, a kiedy osobno? Dowiecie się, jak to jest z rzeczownikami, jak odróżnić rzeczownik od czasownika i poznacie kilka słów, które bez nie w ogóle nie istnieją. Po drodze czekają cztery zadania. Przygotujcie zeszyty!""",

"02-czasowniki": """Na początek coś, co już znacie. Z czasownikami słówko nie piszemy osobno. Nie lubię. Nie wiem. Nie śpię. Nie biegam. Między nie a czasownikiem zawsze jest odstęp. A jak jest z rzeczownikami? Tutaj jest odwrotnie! Z rzeczownikami słówko nie piszemy razem, w jednym wyrazie.""",

"03-razem": """Posłuchajcie. Pogoda to rzeczownik. Gdy pada deszcz, wieje wiatr i jest zimno, mówimy: niepogoda. Razem! Prawda to rzeczownik. Jej przeciwieństwo to nieprawda. Też razem. Pokój, czyli spokój, i niepokój. Porządek i nieporządek. Zobaczcie, co się dzieje. Słówko nie przykleja się do rzeczownika i razem tworzą nowy wyraz. Ten nowy wyraz to dalej rzeczownik. Niepogoda, nieprawda, niepokój, nieporządek. Wszystkie piszemy razem.""",

"04-zadanie1+20": """Zadanie pierwsze. Na ekranie jest pięć rzeczowników. Dodaj do każdego słówko nie i zapisz nowy wyraz w zeszycie. Pamiętaj, jak go zapisać! Start!""",

"05-odpowiedz1": """Sprawdzamy. Cierpliwość, niecierpliwość. Uwaga, nieuwaga. Posłuszeństwo, nieposłuszeństwo. Ład, nieład. Ostrożność, nieostrożność. Każdy wyraz zapisaliście razem? Brawo! Dlaczego razem? Bo cierpliwość, uwaga, posłuszeństwo, ład i ostrożność to rzeczowniki. A nie z rzeczownikami zawsze piszemy razem.""",

"06-pytania": """Ale jak poznać, czy wyraz jest rzeczownikiem, czy czasownikiem? Trzeba zadać pytanie. Rzeczownik odpowiada na pytanie kto? albo co? Czasownik odpowiada na pytanie co robi? Weźmy zdanie: nie lubię niepogody. Pierwszy wyraz. Co robię? Lubię. To czasownik, więc nie lubię piszemy osobno. Drugi wyraz. Co to jest? Pogoda. To rzeczownik, więc niepogody piszemy razem. Jeszcze jedno: nie mów nieprawdy. Mów to czasownik, osobno. Nieprawda to rzeczownik, razem.""",

"07-zadanie2+20": """Zadanie drugie. Na ekranie jest sześć zdań. W każdym trzeba zdecydować: piszemy razem czy osobno? Najpierw zadaj pytanie. Kto? co? albo co robi? Potem zapisz poprawnie. Start!""",

"08-odpowiedz2": """Sprawdzamy. Ciasne buty to prawdziwa niewygoda. Wygoda, co? To rzeczownik, więc razem. Tomek nie śpi. Co robi? Śpi. To czasownik, więc osobno. Za niegrzeczność Kuba przeprosił. Grzeczność, co? Rzeczownik, razem. Kasia nie lubi szpinaku. Co robi? Lubi. Czasownik, osobno. Pani zauważyła moją nieobecność. Obecność, co? Rzeczownik, razem. Babcia nie pije kawy. Co robi? Pije. Czasownik, osobno. Trzy razy razem, trzy razy osobno. Pytanie zawsze podpowie.""",

"09-ciekawostka": """A teraz ciekawostka. Są słowa, które bez nie w ogóle nie istnieją. Weźmy niedźwiedź. Spróbujcie odciąć nie. Zostaje dźwiedź. Jest takie słowo? Nie ma! Tak samo nienawiść. Bez nie zostaje coś, czego nikt nie mówi. Albo niezdara, czyli ktoś, komu wszystko leci z rąk. Bez nie to słowo też nie istnieje. Takie wyrazy to też rzeczowniki. Dlatego piszemy je razem, tak jak niepogodę i nieprawdę.""",

"10-zadanie3+20": """Zadanie trzecie. Zagadki! Odgadnij rzeczownik, który zaczyna się od nie, i zapisz go w zeszycie. Są cztery zagadki. Start!""",

"11-odpowiedz3": """Sprawdzamy. Maleńkie dziecko, które jeszcze nie chodzi i nie mówi, to niemowlę. Dzień tygodnia po sobocie to niedziela. Ktoś, kto jest twoim wrogiem, a nie przyjacielem, to nieprzyjaciel. A gdy leje, wieje i jest zimno, mamy niepogodę. Wszystkie te wyrazy to rzeczowniki. Odpowiadają na pytanie kto? albo co? Dlatego każdy piszemy razem. Niemowlę i niedziela bez nie w ogóle nie istnieją, tak jak niedźwiedź.""",

"12-sprawdz": """Jak się nie pomylić, kiedy w jednym zdaniu jest i rzeczownik, i czasownik? Sprawdzajcie każdy wyraz po kolei. Posłuchajcie. Nie biegaj po schodach, bo to niebezpieczeństwo. Biegaj. Co robisz? Czasownik, osobno. Niebezpieczeństwo. Co? Rzeczownik, razem. Jeszcze jedno. Nie zostawiaj nieporządku w szatni. Zostawiaj. Co robisz? Osobno. Nieporządek. Co? Razem. Dwa kroki: pytanie i decyzja. To naprawdę działa!""",

"13-zadanie4+25": """Zadanie czwarte. Woźny napisał ogłoszenie, ale zrobił w nim błędy. W trzech miejscach słówko nie jest zapisane źle. Znajdź te błędy i zapisz poprawnie. Uwaga, inne zdania są dobre! Start!""",

"14-odpowiedz4": """Sprawdzamy. Pierwszy błąd: nieporządek w szatni. Porządek, co? To rzeczownik, więc razem. Drugi błąd: niepunktualność. Punktualność, co? Rzeczownik, razem. Trzeci błąd: niebezpieczeństwo na mokrych schodach. Bezpieczeństwo, co? Rzeczownik, razem. A reszta była dobrze. Nie odbędzie się, nie zapomnijcie, nie spóźniajcie się, nie biegajcie. To czasowniki. Co robicie? Odbywa się, zapominacie, spóźniacie się, biegacie. Dlatego osobno.""",

"15-podsumowanie": """Zapamiętaj! Z czasownikami słówko nie piszemy osobno: nie lubię, nie śpię, nie biegaj. Z rzeczownikami słówko nie piszemy razem: niepogoda, nieprawda, niepokój, nieporządek. Jak je odróżnić? Zadaj pytanie. Kto? co? To rzeczownik, piszemy razem. Co robi? To czasownik, piszemy osobno. Są też słowa, które bez nie w ogóle nie istnieją: niedźwiedź, niezdara, niemowlę, niedziela. Je też piszemy razem. Pytanie zawsze podpowie. Brawo!""",
}

cel = Path(__file__).parent / "film1"
cel.mkdir(exist_ok=True)
razem = 0
for nazwa, tekst in SCENY.items():
    (cel / f"{nazwa}.txt").write_text(tekst.strip() + "\n", encoding="utf-8")
    razem += len(tekst.strip())
print("scen:", len(SCENY), "znakow:", razem)
