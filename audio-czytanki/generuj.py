"""Generuje mp3 czytanek przez ElevenLabs TTS.

Uzycie (z dowolnego katalogu):
  python audio-czytanki/generuj.py                 # wszystkie teksty bez mp3
  python audio-czytanki/generuj.py 09-kropka.txt   # wybrane (nadpisuje)
  python audio-czytanki/generuj.py --policz        # tylko liczba znakow, bez API

Teksty: audio-czytanki/teksty/NN-nazwa.txt (poza repo - prawa autorskie).
Wynik: public/audio/czytanki/nazwa.mp3 (tez poza repo), potem wyslij.py.

Eleven v3 przyjmuje max 5000 znakow na zapytanie, wiec dluzsze teksty ida
w kawalkach po akapitach i sa sklejane ffmpegiem bez ponownego kodowania.
"""

import json
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

VOICE_ID = "8EWWaNTDrqObI22Gvo1q"  # Aleksandra - Urgent and Inviting, wybrana przez Bartka
MODEL = "eleven_v3"
LIMIT = 3500  # zapas pod limit 5000 - krotsze kawalki mniej "odplywaja" intonacja

ROOT = Path(__file__).resolve().parent.parent
TEKSTY = ROOT / "audio-czytanki" / "teksty"
WYNIK = ROOT / "public" / "audio" / "czytanki"


def klucz() -> str:
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if line.startswith("ELEVEN_LABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Brak ELEVEN_LABS_API_KEY w .env.local")


def kawalki(tekst: str) -> list[str]:
    akapity = [a.strip() for a in tekst.split("\n\n") if a.strip()]
    wynik, biezacy = [], ""
    for akapit in akapity:
        if biezacy and len(biezacy) + 2 + len(akapit) > LIMIT:
            wynik.append(biezacy)
            biezacy = akapit
        else:
            biezacy = f"{biezacy}\n\n{akapit}" if biezacy else akapit
    if biezacy:
        wynik.append(biezacy)
    return wynik


def tts(tekst: str, cel: Path, api_key: str) -> None:
    body = json.dumps({
        "text": tekst,
        "model_id": MODEL,
        "language_code": "pl",
        # v3 przyjmuje stabilnosc tylko 0.0 / 0.5 / 1.0 - 0.5 = "Natural", jak w panelu
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as res:
            cel.write_bytes(res.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode('utf-8', 'replace')}")


def generuj(plik: Path, api_key: str) -> None:
    nazwa = plik.stem.split("-", 1)[1] if plik.stem[:2].isdigit() else plik.stem
    cel = WYNIK / f"{nazwa}.mp3"
    czesci = kawalki(plik.read_text(encoding="utf-8"))
    print(f"{plik.name}: {sum(map(len, czesci))} znakow, {len(czesci)} kawalk(i)", flush=True)
    with tempfile.TemporaryDirectory() as tmp:
        pliki = []
        for i, czesc in enumerate(czesci):
            p = Path(tmp) / f"{i:02d}.mp3"
            tts(czesc, p, api_key)
            pliki.append(p)
        if len(pliki) == 1:
            cel.write_bytes(pliki[0].read_bytes())
        else:
            lista = Path(tmp) / "lista.txt"
            lista.write_text("".join(f"file '{p.as_posix()}'\n" for p in pliki), encoding="utf-8")
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                 "-i", str(lista), "-c", "copy", str(cel)],
                check=True,
            )
    print(f"  -> {cel.relative_to(ROOT)} ({cel.stat().st_size // 1024} KB)", flush=True)


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    WYNIK.mkdir(parents=True, exist_ok=True)
    if args:
        pliki = [TEKSTY / Path(a).name for a in args]
    else:
        pliki = [
            p for p in sorted(TEKSTY.glob("*.txt"))
            if not (WYNIK / f"{p.stem.split('-', 1)[1]}.mp3").exists()
        ]
    if "--policz" in sys.argv:
        for p in pliki:
            print(f"{len(p.read_text(encoding='utf-8')):6d}  {p.name}")
        print(f"{sum(len(p.read_text(encoding='utf-8')) for p in pliki):6d}  razem")
        return
    api_key = klucz()
    for p in pliki:
        generuj(p, api_key)


if __name__ == "__main__":
    main()
