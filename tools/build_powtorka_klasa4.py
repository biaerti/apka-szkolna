"""Powtorka rozdzialu I (kl. 4) w szacie arkuszy wyrownawczych: czytanie ze zrozumieniem + jezyk.

Dla calej klasy przed sprawdzianem z rozdzialu II. Uklad i druk jak w tools/build_worksheets.py:
DOCX (A4 dwustronnie), PDF 2xA5 (obie strony obok siebie, druk jednostronny) i strona na projektor
z odpowiedziami do odsloniecia.

Uzycie: python tools/build_powtorka_klasa4.py
Wynik: public/materialy/powtorki/ (DOCX, -A5.pdf, projektor/*.html).
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_worksheets import ROOT, build_worksheet, impose_a5  # noqa: E402

PFQ = "Zaznacz P (prawda) albo F (fałsz)."

POWTORKA = {
    "number": "P1",
    "label": "Powtórka z rozdziału I",
    "stem": "klasa4-powtorka-rozdzial1-chlopak-z-latawcem",
    "title": "Chłopak z latawcem",
    "focus": "Narrator  świat przedstawiony  plan ramowy  czasownik  epitet  zdanie i równoważnik  sylaby",
    "text": [
        "We wrześniu do naszej klasy przyszedł nowy uczeń. Nazywał się Szymon i przeprowadził się z małej wsi nad morzem. Pierwszego dnia usiadł w ostatniej ławce i przez całą lekcję patrzył w okno. Na przerwie stał sam pod ścianą. Pomyślałam, że jest zarozumiały, i nawet się do niego nie odezwałam.",
        "W piątek mieliśmy lekcję przyrody w parku. Wiał tak silny wiatr, że pani chciała wracać do szkoły. Wtedy Szymon wyjął z plecaka coś zwiniętego w rulon. Był to latawiec z kolorowej folii, z długim ogonem z kokardek. Chłopak rozwinął sznurek, zrobił kilka kroków pod wiatr i latawiec poszybował wysoko nad drzewami. Cała klasa patrzyła w niebo.",
        "- Nad morzem wieje prawie codziennie - powiedział cicho Szymon. - Z tatą puszczaliśmy latawce na plaży. Tutaj nie mam jeszcze z kim.",
        "Zrobiło mi się głupio. Szymon wcale nie był zarozumiały. Był po prostu nieśmiały i tęsknił za domem.",
        "Następnego dnia przyniosłam do szkoły stare kolorowe torby i taśmę. Na długiej przerwie razem z Szymonem i Kubą zrobiliśmy drugi latawiec. Szymon pokazał nam, jak przymocować patyki, żeby latawiec był lekki i mocny. W sobotę oba latawce latały nad boiskiem. Od tamtej pory Szymon nie stoi sam na przerwie, a ja już wiem, że nie warto oceniać kogoś po pierwszym dniu.",
    ],
    "reading": [
        ("1", "Kto opowiada tę historię?", 0, ["Szymon", "dziewczynka z klasy Szymona", "pani nauczycielka"]),
        ("2", "Uzupełnij świat przedstawiony.\nKiedy Szymon przyszedł do klasy? ......................................................................................\nGdzie była lekcja przyrody? ...............................................................................................\nKto zrobił drugi latawiec? .................................................................................................", 0, None),
        ("3", "Dlaczego dziewczynka na początku nie odezwała się do Szymona?", 0, [
            "Pomyślała, że Szymon jest zarozumiały.",
            "Pani zabroniła rozmawiać na przerwie.",
            "Szymon siedział w innej sali.",
        ]),
        ("4", PFQ, 0, None),
        ("", "Szymon przeprowadził się z gór.  P / F\nLatawiec Szymona miał ogon z kokardek.  P / F\nW sobotę nad boiskiem latały dwa latawce.  P / F", 0, None),
        ("5", "Dokończ zdanie: Na początku dziewczynka myślała, że Szymon jest ..............., a naprawdę był ...............", 1, None),
        ("6", "Czego nauczyła się dziewczynka? Napisz jednym zdaniem.", 1, None),
    ],
    "language": [
        ("7", "Tę historię opowiada narrator-bohater. Wypisz z pierwszego akapitu dwa czasowniki, po których to widać.", 1, None),
        ("8", "Określ osobę, liczbę, czas i rodzaj czasownika.\npomyślałam - .............................................................................................\nzrobiliśmy - ..............................................................................................\nlatały - ......................................................................................................", 0, None),
        ("9", "Podkreśl epitety (są trzy): Szymon wyjął lekki, kolorowy latawiec z długim ogonem.\nDopisz po jednym epitecie:  .................... wiatr     .................... chłopiec", 0, None),
        ("10", "Wpisz Z (zdanie) albo R (równoważnik zdania).\n.......  Lekcja w parku.     .......  Wiał silny wiatr.     .......  Nowy uczeń w klasie.     .......  Szymon tęsknił.", 0, None),
        ("11", "Podziel wyrazy na sylaby: latawiec - ....................   chłopak - ....................   kolorowy - ....................\nWyraz szkoła ma .......... liter i .......... głosek.", 0, None),
    ],
    "writing": "Uzupełnij plan ramowy historii. Brakujące punkty zapisz równoważnikami zdań (bez czasownika).\n1. Nowy uczeń w klasie.\n2. ..........................................................................................\n3. Rozmowa z Szymonem o morzu.\n4. ..........................................................................................\nA teraz napisz 2-3 zdania: jak przywitał(a)byś nową osobę w klasie?",
    "writing_lines": 4,
    "luzno": True,
}

ANSWERS = {
    "1": "dziewczynka z klasy Szymona",
    "2": "Kiedy: we wrześniu. Gdzie: w parku. Kto: dziewczynka (narratorka), Szymon i Kuba.",
    "3": "Pomyślała, że Szymon jest zarozumiały.",
    "4": "F (Szymon przeprowadził się znad morza), P, P.",
    "5": "Na początku myślała, że jest zarozumiały, a naprawdę był nieśmiały i tęsknił za domem.",
    "6": "Na przykład: Nie warto oceniać kogoś po pierwszym dniu.",
    "7": "Na przykład: pomyślałam, odezwałam (się) - narratorka mówi o sobie w 1. osobie.",
    "8": "pomyślałam - 1. os., lp, czas przeszły, rodzaj żeński; zrobiliśmy - 1. os., lm, czas przeszły, rodzaj męskoosobowy; latały - 3. os., lm, czas przeszły, rodzaj niemęskoosobowy.",
    "9": "lekki, kolorowy, długim. Dopisane epitety, np. silny wiatr, nieśmiały chłopiec.",
    "10": "R, Z, R, Z.",
    "11": "la-ta-wiec, chło-pak, ko-lo-ro-wy. Szkoła: 6 liter, 5 głosek (sz to jedna głoska).",
    "12": "Plan: 2. Lekcja w parku i latawiec Szymona (np. Puszczanie latawca w parku). 4. Wspólne robienie drugiego latawca. Punkty bez czasownika. Powitanie: 2-3 zdania, uczeń mówi o sobie (ja).",
}

OUT = ROOT / "output" / "documents" / "powtorki"
PUBLIC = ROOT / "public" / "materialy" / "powtorki"


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    (PUBLIC / "projektor").mkdir(parents=True, exist_ok=True)
    docx = build_worksheet(POWTORKA)  # zapisuje do folderu arkuszy wyrownawczych - przenosimy
    stem = POWTORKA["stem"]
    shutil.move(docx, PUBLIC / f"{stem}.docx")
    (OUT / "arkusze.json").write_text(
        json.dumps([{**POWTORKA, "answers": ANSWERS}], ensure_ascii=False), encoding="utf-8")
    subprocess.run(["node", str(ROOT / "tools" / "arkusze-pdf.mjs"), str(OUT)], check=True)
    subprocess.run(["node", str(ROOT / "tools" / "arkusze-projektor.mjs"), str(OUT), str(PUBLIC / "projektor")], check=True)
    impose_a5(OUT / "pdf" / f"{stem}.pdf", PUBLIC / f"{stem}-A5.pdf")
    print(PUBLIC / f"{stem}.docx")
    print(PUBLIC / f"{stem}-A5.pdf")
