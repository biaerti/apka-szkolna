"""Nagrania do kursu "Polski od zera" (szkola.klippi.pl/od-zera) przez ElevenLabs.

Uzycie:
  python tools/odzera-audio.py               # brakujace pliki
  python tools/odzera-audio.py --policz      # tylko liczba znakow, bez API
  python tools/odzera-audio.py --sprawdz     # rozpoznaje mowe w mp3 (ElevenLabs STT), pokazuje roznice
  python tools/odzera-audio.py --sprawdz --dzial 1
  python tools/odzera-audio.py --znowu szkola,ty   # generuje te pliki od nowa

Teksty: src/data/odzera/dzial-*.json (slowa i zdania: pole lektor albo pl) i polecenia
zadan (POLECENIA w src/lib/odzera.ts - lista ponizej musi sie z nimi zgadzac, pilnuje test).
Wynik: public/audio/odzera/<slug>.mp3 (wlasne zdania, wiec ida do repo).
Slug musi byc taki sam jak slugOZ() w src/lib/odzera.ts.

Glos Aleksandra, model turbo v2.5 z language_code "pl" (jak dyktanda - multilingual
przekrecal pojedyncze slowa). TTS czyta zle krotkie slowa i przymiotniki na -y:
po --sprawdz takie podmieniamy (pole "lektor" w JSON) i generujemy --znowu.
"""

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

VOICE_ID = "8EWWaNTDrqObI22Gvo1q"  # Aleksandra
MODEL = "eleven_turbo_v2_5"

ROOT = Path(__file__).resolve().parent.parent
TRESC = ROOT / "src" / "data" / "odzera"
WYNIK = ROOT / "public" / "audio" / "odzera"

POLECENIA = [
    "Popatrz i posłuchaj.",
    "Posłuchaj i powtórz.",
    "Posłuchaj i wybierz obrazek.",
    "Wybierz słowo.",
    "Przeczytaj i wybierz obrazek.",
    "Co to znaczy?",
    "Połącz w pary.",
    "Ułóż słowo.",
    "Ułóż zdanie.",
    "Napisz, co słyszysz.",
    "Przepisz do zeszytu.",
]

BEZ_OGONKOW = str.maketrans("ąćęłńóśźż", "acelnoszz")


def slug(tekst: str) -> str:
    s = tekst.lower().translate(BEZ_OGONKOW)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def klucz() -> str:
    # worktree nie ma .env.local - szukamy tez w glownym repo
    kandydaci = [ROOT / ".env.local"]
    try:
        wspolny = subprocess.run(["git", "rev-parse", "--git-common-dir"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        if wspolny:
            kandydaci.append((ROOT / wspolny).resolve().parent / ".env.local")
    except OSError:
        pass
    for plik in kandydaci:
        if not plik.exists():
            continue
        for line in plik.read_text(encoding="utf-8").splitlines():
            if line.startswith("ELEVEN_LABS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Brak ELEVEN_LABS_API_KEY w .env.local")


def teksty(dzial: int | None = None) -> dict[str, str]:
    """slug pliku -> tekst do przeczytania."""
    wynik: dict[str, str] = {}

    def dodaj(pl: str, lektor: str | None = None) -> None:
        s = slug(pl)
        t = lektor or pl
        if s in wynik and wynik[s] != t:
            sys.exit(f"Ten sam plik dla dwoch tekstow: {wynik[s]!r} i {t!r}")
        wynik[s] = t

    if dzial is None:
        for p in POLECENIA:
            dodaj(p)
    for plik in sorted(TRESC.glob("dzial-*.json")):
        d = json.loads(plik.read_text(encoding="utf-8"))
        if dzial is not None and d["nr"] != dzial:
            continue
        for lekcja in d["lekcje"]:
            for x in lekcja.get("slowa", []) + lekcja.get("zdania", []):
                dodaj(x["pl"], x.get("lektor"))
    return wynik


def tts(tekst: str, cel: Path, api_key: str) -> None:
    do_czytania = tekst if tekst.rstrip()[-1] in ".!?" else f"{tekst[0].upper()}{tekst[1:]}."
    body = json.dumps({
        "text": do_czytania,
        "model_id": MODEL,
        "language_code": "pl",
        "voice_settings": {"stability": 0.7, "similarity_boost": 0.75, "speed": 0.85},
    }).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_64",
        data=body,
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            cel.write_bytes(res.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode('utf-8', 'replace')}")


def norm(x: str) -> list[str]:
    return re.sub(r"[^\w ]", "", x.lower()).split()


def sprawdz(api_key: str, dzial: int | None) -> None:
    """Rozpoznaje mowe w kazdym pliku i pokazuje roznice z tekstem."""
    zle = 0
    for s, t in teksty(dzial).items():
        plik = WYNIK / f"{s}.mp3"
        if not plik.exists():
            continue
        wynik = subprocess.run(
            ["curl", "-s", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text",
             "-H", f"xi-api-key: {api_key}", "-F", "model_id=scribe_v1", "-F", "language_code=pol",
             "-F", f"file=@{plik}"],
            capture_output=True, text=True, encoding="utf-8",
        )
        slyszy = json.loads(wynik.stdout or "{}").get("text", "")
        ok = norm(slyszy) == norm(t)
        zle += 0 if ok else 1
        print(f"{'OK ' if ok else '?? '}{s}: {slyszy}", flush=True)
    print(f"Do odsluchania: {zle}")


def main() -> None:
    WYNIK.mkdir(parents=True, exist_ok=True)
    dzial = None
    if "--dzial" in sys.argv:
        dzial = int(sys.argv[sys.argv.index("--dzial") + 1])
    if "--sprawdz" in sys.argv:
        sprawdz(klucz(), dzial)
        return
    wszystkie = teksty(dzial)
    if "--znowu" in sys.argv:
        wybrane = sys.argv[sys.argv.index("--znowu") + 1].split(",")
        brakujace = {s: wszystkie[s] for s in wybrane if s in wszystkie}
    else:
        brakujace = {s: t for s, t in wszystkie.items() if not (WYNIK / f"{s}.mp3").exists()}
    znaki = sum(len(t) for t in brakujace.values())
    print(f"Do wygenerowania: {len(brakujace)} plikow, {znaki} znakow")
    if "--policz" in sys.argv or not brakujace:
        return
    api_key = klucz()
    for s, t in brakujace.items():
        tts(t, WYNIK / f"{s}.mp3", api_key)
        print(f"  {s}.mp3  <- {t}", flush=True)


if __name__ == "__main__":
    main()
