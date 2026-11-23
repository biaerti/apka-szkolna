"""Generuje mp3 do dyktand (strona /dyktando) przez ElevenLabs.

Uzycie:
  python tools/dyktanda-audio.py            # brakujace pliki ze wszystkich lekcji
  python tools/dyktanda-audio.py --policz   # tylko liczba znakow, bez API

Teksty: src/data/dyktanda/*.json (slowa, zdania, przyklady we wstepie).
Wynik: public/audio/dyktanda/<slug>.mp3 - wlasne zdania, wiec ida do repo.
Slug musi byc taki sam jak slugAudio() w src/data/dyktanda.ts.

Glos Aleksandra (jak czytanki), model turbo v2.5 z language_code "pl" - przy
pojedynczych slowach multilingual v2 i v3 przekrecaly wymowe ("Uko", "Miesz")
i mruczaly na koncu. Zdania maja druga wersje <slug>-wolno.mp3: slowo po slowie
po dwa slowa z pauzami, jak dyktuje nauczyciel.

  python tools/dyktanda-audio.py --sprawdz  # rozpoznaje mowe w mp3 (ElevenLabs STT)
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

VOICE_ID = "8EWWaNTDrqObI22Gvo1q"  # Aleksandra
MODEL = "eleven_turbo_v2_5"
PRZYIMKI = {"w", "z", "na", "do", "o", "i", "u", "od", "po", "ze", "we", "za", "nad", "pod", "bez", "dla"}

ROOT = Path(__file__).resolve().parent.parent
LEKCJE = ROOT / "src" / "data" / "dyktanda"
WYNIK = ROOT / "public" / "audio" / "dyktanda"

BEZ_OGONKOW = str.maketrans("ąćęłńóśźż", "acelnoszz")


def slug(tekst: str) -> str:
    s = tekst.lower().translate(BEZ_OGONKOW)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def klucz() -> str:
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if line.startswith("ELEVEN_LABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Brak ELEVEN_LABS_API_KEY w .env.local")


def wolno(zdanie: str) -> str:
    """Zdanie po kawalku (po dwa slowa, przyimek razem z nastepnym) z pauzami.
    Pojedyncze krotkie slowa miedzy pauzami turbo potrafi zgubic ("To ... szkola")."""
    grupy: list[list[str]] = [[]]
    for w in zdanie.split():
        ostatnia = grupy[-1]
        if len(ostatnia) >= 2 and ostatnia[-1].lower() not in PRZYIMKI:
            grupy.append([w])
        else:
            ostatnia.append(w)
    return ' <break time="1.2s" /> '.join(" ".join(g) for g in grupy)


def teksty() -> dict[str, str]:
    wynik: dict[str, str] = {}
    for plik in sorted(LEKCJE.glob("*.json")):
        lekcja = json.loads(plik.read_text(encoding="utf-8"))
        wszystkie = [p["pl"] for r in lekcja["wstep"] for p in r["przyklady"]]
        wszystkie += [s["pl"] for s in lekcja["slowa"]] + [z["pl"] for z in lekcja["zdania"]]
        for t in wszystkie:
            s = slug(t)
            if s in wynik and wynik[s] != t:
                sys.exit(f"Ten sam plik dla dwoch tekstow: {wynik[s]!r} i {t!r}")
            wynik[s] = t
        for z in lekcja["zdania"]:
            wynik[f"{slug(z['pl'])}-wolno"] = wolno(z["pl"])
    return wynik


def tts(tekst: str, cel: Path, api_key: str) -> None:
    # Pojedyncze slowo z kropka - lektorka konczy je spokojnie, jak w dyktandzie.
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


def sprawdz(api_key: str) -> None:
    """Rozpoznaje mowe w kazdym pliku i pokazuje roznice z tekstem."""
    import subprocess
    for s, t in teksty().items():
        plik = WYNIK / f"{s}.mp3"
        if not plik.exists():
            continue
        wynik = subprocess.run(
            ["curl", "-s", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text",
             "-H", f"xi-api-key: {api_key}", "-F", "model_id=scribe_v1", "-F", "language_code=pol",
             "-F", f"file=@{plik}"],
            capture_output=True, text=True, encoding="utf-8",
        )
        slyszy = json.loads(wynik.stdout).get("text", "")
        czysty = re.sub(r"<[^>]+>", "", t)
        norm = lambda x: re.sub(r"[^\w ]", "", x.lower()).split()
        znak = "OK " if norm(slyszy) == norm(czysty) else "?? "
        print(f"{znak}{s}: {slyszy}", flush=True)


def main() -> None:
    WYNIK.mkdir(parents=True, exist_ok=True)
    if "--sprawdz" in sys.argv:
        sprawdz(klucz())
        return
    brakujace = {s: t for s, t in teksty().items() if not (WYNIK / f"{s}.mp3").exists()}
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
