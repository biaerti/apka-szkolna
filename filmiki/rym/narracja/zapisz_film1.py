"""Zapisuje narracje filmu o rymie (klasa 5, dzial 1) do narracja/film1/NN-nazwa.txt.

Uzycie: python filmiki/rym/narracja/zapisz_film1.py
"""

from pathlib import Path

DIR = Path(__file__).resolve().parent / "film1"

SCENY = {
    "01-intro": (
        "Cześć! Dziś zajmiemy się rymem. Rymy słyszycie codziennie: w piosenkach, w wierszach, w wyliczankach, "
        "a nawet w reklamach. Najpierw przypomnimy sobie, z czego zbudowany jest wiersz. Potem nauczymy się słyszeć rymy, "
        "rozpoznawać, jak są ułożone w wierszu, i wymyślać własne. Po drodze czekają cztery zadania. Przygotujcie zeszyty!"
    ),
    "02-wers-zwrotka": (
        "Zacznijmy od budowy wiersza. Posłuchajcie. Rano kotek wstał z kanapy, umył pyszczek, umył łapy. "
        "Potem wypił pół miski mleka i na myszkę cierpliwie czeka. "
        "Każda linijka wiersza to wers. Ten wierszyk ma cztery wersy. "
        "Kilka wersów, które tworzą razem jedną całość, to zwrotka. Zwrotki oddziela się w wierszu pustą linijką, "
        "tak jak akapity w opowiadaniu. A teraz najważniejsze. Spójrzcie na ostatnie słowa wersów: kanapy i łapy, mleka i czeka. "
        "Brzmią podobnie, prawda? To właśnie są rymy."
    ),
    "03-rym": (
        "Rym to podobne brzmienie zakończeń wyrazów, najczęściej tych na końcu wersów. "
        "Posłuchajcie par. Sowa i głowa. Ławka i trawka. Miś i dziś. Rak i mak. "
        "W każdej parze końcówka brzmi tak samo. Sowa, głowa. Słyszycie? Na ekranie zaznaczyłam, która część się powtarza. "
        "Zwykle zgadza się wszystko od przedostatniej samogłoski do końca wyrazu, a w krótkich wyrazach od ostatniej. "
        "Ważne: rym usłyszymy uchem, a nie zobaczymy okiem. Góry i chmury piszemy inaczej, "
        "ale słyszymy to samo zakończenie, więc to jest rym. "
        "Za to kot i but to jeszcze nie rym. Zgadza się tylko ostatnia litera, a reszta końcówki brzmi inaczej."
    ),
    "04-zadanie1+20": (
        "Zadanie pierwsze. Na ekranie jest sześć par wyrazów. Przepisz numery do zeszytu i przy każdym napisz: rym albo nie rym. "
        "Przeczytaj każdą parę na głos, szeptem, i posłuchaj końcówek. Start!"
    ),
    "05-odpowiedz1": (
        "Sprawdzamy. Szafa i żyrafa: rym, bo obie kończą się tak samo. Kot i kos: nie rym, "
        "bo zgadza się początek, a nie koniec. Noc i moc: rym. Słońce i łąka: nie rym, końcówki brzmią zupełnie inaczej. "
        "Lody i wody: rym. Zima i lato: nie rym. To dwie pory roku, pasują do siebie znaczeniem, ale nie brzmieniem. "
        "Zapamiętajcie: przy rymie liczy się dźwięk końcówki, a nie to, co wyrazy znaczą."
    ),
    "06-uklad": (
        "Rymy mogą być w wierszu ułożone na różne sposoby. Wróćmy do kotka. Kanapy rymuje się z łapy, "
        "a mleka z czeka. Pierwszy wers rymuje się z drugim, a trzeci z czwartym. Rymujące się wersy stoją obok siebie, "
        "parami. Takie rymy nazywamy parzystymi. "
        "Teraz drugi wierszyk. Pada deszcz i stuka w dachy, w kałużach pływają liście. A ja z bratem gram w szachy "
        "i wygrywam, oczywiście! Dachy rymuje się z szachy, a liście z oczywiście. Pierwszy wers z trzecim, drugi z czwartym. "
        "Rymy przeplatają się jak nitki w warkoczu. To rymy przeplatane. "
        "Żeby je łatwo znaleźć, zaznaczajcie każdą parę rymów innym kolorem."
    ),
    "07-zadanie2+25": (
        "Zadanie drugie. Przeczytaj wiersz z ekranu. Wypisz do zeszytu dwie pary rymów i napisz, "
        "czy to rymy parzyste, czy przeplatane. Start!"
    ),
    "08-odpowiedz2": (
        "Sprawdzamy. Pierwsza para to wieje i grzeje. Druga para to drzewa i śpiewa. "
        "Wieje jest w pierwszym wersie, a grzeje w trzecim. Drzewa w drugim, a śpiewa w czwartym. "
        "Rymy się przeplatają, więc to rymy przeplatane. Gdyby wieje i grzeje stały obok siebie, byłyby to rymy parzyste."
    ),
    "09-po-co": (
        "Po co w ogóle są rymy? Rymy sprawiają, że tekst ma melodię i łatwo wpada w ucho. "
        "Dlatego rymują się przysłowia, które ludzie powtarzają od setek lat. Gość w dom, Bóg w dom. "
        "Kto rano wstaje, temu Pan Bóg daje. Co nagle, to po diable. "
        "Rymują się wyliczanki na podwórku, piosenki i hasła reklamowe. Tekst z rymem zapamiętujemy dużo szybciej niż zwykłe zdanie. "
        "Spróbujcie sami: przysłowie o rannym wstawaniu pamiętacie już po jednym usłyszeniu."
    ),
    "10-jak-zrobic": (
        "A teraz najfajniejsze: jak samemu wymyślić rym? Są trzy kroki. Najpierw weź wyraz i powiedz go głośno, na przykład kwiatek. "
        "Potem odetnij zakończenie, to, co brzmi na końcu. Na ekranie widzicie, która to część. "
        "Na koniec doklejaj do niego różne początki i sprawdzaj, czy wychodzi prawdziwe słowo. Bratek. Płatek. Statek. Kwadratek. "
        "Wszystkie rymują się z kwiatkiem. Spróbujmy jeszcze raz z wyrazem kura. Góra, dziura, chmura, skóra. "
        "Uwaga: jeśli wychodzi wyraz, którego nie ma w słowniku, szukaj dalej. Rym musi być prawdziwym słowem."
    ),
    "11-zadanie3+25": (
        "Zadanie trzecie. Do każdego z trzech wyrazów dopisz po dwa rymy. Pamiętaj o trzech krokach: powiedz głośno, "
        "odetnij zakończenie, doklejaj początki. Start!"
    ),
    "12-odpowiedz3": (
        "Sprawdzamy. Dom: na przykład tom, grom, prom albo złom. Noga: droga, podłoga, trwoga, sroga. "
        "Ryba: szyba, chyba. Jeśli wymyśliliście inne rymy, sprawdźcie dwie rzeczy. Czy końcówka brzmi tak samo? "
        "I czy to prawdziwe słowo? Jeśli tak, wasz rym też jest dobry."
    ),
    "13-zadanie4+30": (
        "Zadanie czwarte. Teraz jesteście poetami. Na ekranie są dwa początki wierszyków. Do każdego dopisz drugi wers, "
        "który rymuje się z pierwszym. Rym musi mieć sens. Start!"
    ),
    "14-odpowiedz4": (
        "Sprawdzamy. Jesienią w parku liście spadają. Drugi wers musi kończyć się podobnym dźwiękiem, na przykład: "
        "a wiewiórki orzechy zbierają. Albo: a dzieci kasztany do kieszeni chowają. "
        "Mój młodszy brat ma tylko pięć lat. Na przykład: a już rysuje piękny kwiat. Albo: i chce zwiedzić cały świat. "
        "Uważajcie na częsty błąd. Mój młodszy brat ma tylko pięć lat i bardzo lubi chodzić do przedszkola. "
        "Zdanie ma sens, ale nie ma rymu, bo lat i przedszkola brzmią zupełnie inaczej. "
        "Sprawdzajcie zawsze uchem ostatnie słowa wersów. Jeśli brzmią podobnie i zdanie ma sens, jest dobrze."
    ),
    "15-podsumowanie": (
        "Na koniec zbierzmy wszystko jeszcze raz. Wiersz składa się z wersów, czyli linijek. Kilka wersów tworzy zwrotkę. "
        "Rym to podobne brzmienie zakończeń wyrazów, zwykle na końcu wersów. Sowa i głowa. Góry i chmury. "
        "Rym słyszymy uchem, więc liczy się dźwięk, a nie pisownia. "
        "Gdy rymują się wersy obok siebie, pierwszy z drugim i trzeci z czwartym, to rymy parzyste. "
        "Gdy pierwszy z trzecim, a drugi z czwartym, to rymy przeplatane. "
        "A żeby wymyślić rym, powiedz wyraz głośno, odetnij zakończenie i doklejaj nowe początki. Brawo! Teraz rymujecie jak poeci."
    ),
}


def main() -> None:
    DIR.mkdir(parents=True, exist_ok=True)
    for stary in DIR.glob("*.txt"):
        stary.unlink()
    for nazwa, tekst in SCENY.items():
        (DIR / f"{nazwa}.txt").write_text(tekst, encoding="utf-8")
    znaki = sum(len(t) for t in SCENY.values())
    print(f"{len(SCENY)} scen, {znaki} znaków")


if __name__ == "__main__":
    main()
