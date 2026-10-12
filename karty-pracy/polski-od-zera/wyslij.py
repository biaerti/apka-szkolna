"""Wysyla PDF-y zeszytu "Moj polski od zera" do prywatnego bucketu Supabase "materialy".

Uzycie (po node karty-pracy/polski-od-zera/buduj.mjs):
  python karty-pracy/polski-od-zera/wyslij.py

Apka otwiera je z zakladki Lekcje -> Wyrownawcze (src/data/remedial.ts).
"""

import sys
from pathlib import Path

DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(DIR.parent.parent / "materialy"))
from wyslij import env, zapytanie  # noqa: E402

CZESCI = (1, 2, 3)
WERSJE = ("broszura-A4", "do-ciecia-A4", "A5")


def main() -> None:
    e = env()
    url = e["VITE_SUPABASE_URL"].rstrip("/")
    key = e.get("SUPABASE_SERVICE_ROLE_KEY") or sys.exit("Brak SUPABASE_SERVICE_ROLE_KEY w .env.local")
    for czesc in CZESCI:
        for wersja in WERSJE:
            plik = DIR / "pdf" / f"czesc-{czesc}-{wersja}.pdf"
            if not plik.exists():
                print(f"brak {plik} - najpierw node karty-pracy/polski-od-zera/buduj.mjs")
                continue
            nazwa = f"polski-od-zera-czesc-{czesc}-{wersja}.pdf"
            wynik = zapytanie(f"{url}/storage/v1/object/materialy/{nazwa}", key, plik.read_bytes(),
                              "application/pdf", {"x-upsert": "true"})
            print(f"BLAD {nazwa} {wynik}" if wynik.startswith("BLAD") else f"ok  {nazwa}")


if __name__ == "__main__":
    main()
