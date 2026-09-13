"""Wysyla mp3 czytanek do prywatnego bucketu Supabase Storage "czytanki".

Uzycie:
  python audio-czytanki/wyslij.py              # wszystkie z public/audio/czytanki
  python audio-czytanki/wyslij.py kropka.mp3   # wybrane

Klucz: SUPABASE_SERVICE_ROLE_KEY z .env.local (Supabase -> Project Settings ->
API Keys -> service_role / secret). Nie trafia do repo (*.local w .gitignore).
"""

import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MP3 = ROOT / "public" / "audio" / "czytanki"


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
    nazwy = sys.argv[1:] or sorted(p.name for p in MP3.glob("*.mp3"))
    for nazwa in nazwy:
        plik = MP3 / nazwa
        req = urllib.request.Request(
            f"{url}/storage/v1/object/czytanki/{nazwa}",
            data=plik.read_bytes(),
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "audio/mpeg",
                "x-upsert": "true",
                "Cache-Control": "max-age=86400",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=120):
                print(f"ok  {nazwa} ({plik.stat().st_size // 1024} KB)", flush=True)
        except urllib.error.HTTPError as err:
            sys.exit(f"BLAD {nazwa}: {err.code} {err.read().decode('utf-8', 'replace')}\n"
                     f"Bez service role key potrzebna polityka:{TYMCZASOWA_POLITYKA}")


if __name__ == "__main__":
    main()
