"""Wysyla PDF-y sprawdzianow (grupy + klucz) do prywatnego bucketu Supabase "materialy".

Uzycie:
  python materialy/wyslij.py klasa4-rozdzial1     # <folder>-sprawdzian.pdf i -klucz.pdf
  python materialy/wyslij.py --zaloz-bucket       # jednorazowo: utworz bucket

Pliki bierze z output/materialy/ (po node materialy/sprawdzian.mjs <folder>).
Apka otwiera je przez podpisany URL (pasek "Po dziale" nad lista lekcji,
src/data/materialyDzialow.ts). Odczyt dla zalogowanych daje polityka z
supabase/migrations/0035_materialy_bucket.sql.
Klucz: SUPABASE_SERVICE_ROLE_KEY z .env.local (jak filmiki/wyslij.py).
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "output" / "materialy"


def env() -> dict[str, str]:
    wynik = {}
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            wynik[k.strip()] = v.strip().strip('"')
    return wynik


def zapytanie(url: str, key: str, data: bytes, content_type: str, extra: dict | None = None) -> str:
    req = urllib.request.Request(url, data=data, method="POST", headers={
        "apikey": key, "Authorization": f"Bearer {key}", "Content-Type": content_type, **(extra or {}),
    })
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            return res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return f"BLAD {e.code}: {e.read().decode('utf-8', 'replace')}"


def main() -> None:
    e = env()
    url = e["VITE_SUPABASE_URL"].rstrip("/")
    key = e.get("SUPABASE_SERVICE_ROLE_KEY") or sys.exit("Brak SUPABASE_SERVICE_ROLE_KEY w .env.local")
    if "--zaloz-bucket" in sys.argv:
        body = json.dumps({"id": "materialy", "name": "materialy", "public": False,
                           "file_size_limit": 52428800, "allowed_mime_types": ["application/pdf"]}).encode()
        print(zapytanie(f"{url}/storage/v1/bucket", key, body, "application/json"))
        return
    for folder in sys.argv[1:]:
        for nazwa in (f"{folder}-sprawdzian.pdf", f"{folder}-sprawdzian-klucz.pdf"):
            plik = PDF / nazwa
            if not plik.exists():
                print(f"brak {plik} - najpierw node materialy/sprawdzian.mjs {folder}")
                continue
            wynik = zapytanie(f"{url}/storage/v1/object/materialy/{nazwa}", key, plik.read_bytes(),
                              "application/pdf", {"x-upsert": "true"})
            print(("ok  " if not wynik.startswith("BLAD") else "") + nazwa + ("" if not wynik.startswith("BLAD") else f" {wynik}"))


if __name__ == "__main__":
    main()
