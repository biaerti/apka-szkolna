"""Wysyla mp4 filmikow do prywatnego bucketu Supabase Storage "filmiki".

Uzycie:
  python filmiki/wyslij.py                       # wszystkie z output/filmiki
  python filmiki/wyslij.py czasownik-film1.mp4   # wybrane

Klucz: SUPABASE_SERVICE_ROLE_KEY z .env.local (jak audio-czytanki/wyslij.py).
Nowy film trzeba tez dopisac do src/data/filmiki.ts.
"""

import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MP4 = ROOT / "output" / "filmiki"


def env() -> dict[str, str]:
    wynik = {}
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            wynik[k.strip()] = v.strip().strip('"')
    return wynik


def main() -> None:
    e = env()
    url = e["VITE_SUPABASE_URL"].rstrip("/")
    key = e.get("SUPABASE_SERVICE_ROLE_KEY")
    if not key:
        sys.exit("Dopisz SUPABASE_SERVICE_ROLE_KEY=... do .env.local (Supabase -> Project Settings -> API Keys).")
    nazwy = sys.argv[1:] or sorted(p.name for p in MP4.glob("*.mp4"))
    for nazwa in nazwy:
        plik = MP4 / nazwa
        req = urllib.request.Request(
            f"{url}/storage/v1/object/filmiki/{nazwa}",
            data=plik.read_bytes(),
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "video/mp4",
                "x-upsert": "true",
                "Cache-Control": "max-age=86400",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=300):
                print(f"ok  {nazwa} ({plik.stat().st_size // 1024} KB)", flush=True)
        except urllib.error.HTTPError as err:
            sys.exit(f"BLAD {nazwa}: {err.code} {err.read().decode('utf-8', 'replace')}")


if __name__ == "__main__":
    main()
