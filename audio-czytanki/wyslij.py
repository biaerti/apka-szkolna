"""Wysyla mp3 czytanek do prywatnego bucketu Supabase Storage "czytanki".

Uzycie:
  python audio-czytanki/wyslij.py              # wszystkie z public/audio/czytanki
  python audio-czytanki/wyslij.py kropka.mp3   # wybrane

Klucz: SUPABASE_SERVICE_ROLE_KEY z .env.local (Supabase -> Project Settings ->
API Keys). Bez niego skrypt uzywa klucza anon - wtedy na czas wysylki trzeba
wlaczyc w bazie tymczasowa polityke zapisu (patrz TYMCZASOWA_POLITYKA nizej)
i skasowac ja zaraz po wysylce.
"""

import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MP3 = ROOT / "public" / "audio" / "czytanki"

TYMCZASOWA_POLITYKA = """
create policy "czytanki: tymczasowy upload" on storage.objects
  for all to anon using (bucket_id = 'czytanki') with check (bucket_id = 'czytanki');
-- po wysylce:
drop policy "czytanki: tymczasowy upload" on storage.objects;
"""


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
    key = e.get("SUPABASE_SERVICE_ROLE_KEY") or e["VITE_SUPABASE_ANON_KEY"]
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
