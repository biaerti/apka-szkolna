"""ZASTAPIONY przez tools/sklej-filmy.py (intra i wyjasnienia wracaja, numery zadan sie zgadzaja).
Zwarte wersje filmow dzialu 2 klasy 5 (NEON) - te same zasady co w klasie 4.

Uzywa compact() z skroc-filmy-klasa4.py: lektor przyspieszony o 25 procent,
12 sekund na zadanie, wyciete intro i najmniej potrzebne zadanie. Cel: 4-5 minut.
Recytacja zostaje bez zmian - ma 4 minuty i tylko dwa zadania.
"""

from __future__ import annotations

import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location("skroc4", Path(__file__).with_name("skroc-filmy-klasa4.py"))
skroc4 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skroc4)

OMIT: dict[str, set[str]] = {
    "temat": set(),
    "zdrobnienia": {"01-intro", "13-zadanie4+20", "14-odpowiedz4"},
    "frazeologizmy": {"01-intro", "13-doslownie", "14-zadanie4+25", "15-odpowiedz4"},
    "przenosnia": {"01-intro", "02-porownanie", "13-tworzymy", "14-zadanie4+25", "15-odpowiedz4"},
    "zlosc": {"01-intro", "13-zadanie4+25", "14-odpowiedz4"},
    "rzeczownik": {"01-intro", "13-wlasne", "14-zadanie4+25", "15-odpowiedz4"},
    "ogonki": {"01-intro"},
    "dwukropek": {"01-intro", "13-zadanie4+20", "14-odpowiedz4"},
    "nietypowe": {"01-intro", "13-zadanie4+20", "14-odpowiedz4"},
    "sprawozdanie": {"01-intro", "13-zadanie4+20", "14-odpowiedz4"},
    # cztery zadania zostaja - bez czwartego film mialby 3:45
    "reklama": {"01-intro"},
    "podsumowanie5-dzial2": {"01-intro", "06-zadanie2+20", "07-odpowiedz2", "12-zadanie4+25", "13-odpowiedz4"},
}

if __name__ == "__main__":
    for film_name, omitted_ids in OMIT.items():
        skroc4.compact(film_name, omitted_ids)
