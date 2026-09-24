"""Generuje narracje filmikow przez ElevenLabs i buduje os czasu.

Uzycie:
  python filmiki/gloski/generuj-audio.py film1        # sceny bez mp3
  python filmiki/gloski/generuj-audio.py film1 --wszystko  # nadpisz wszystkie
  python filmiki/gloski/generuj-audio.py film1 --tylko-timeline  # bez API

Teksty: narracja/filmN/NN-nazwa.txt -> audio/filmN/NN-nazwa.mp3.
Nazwa moze konczyc sie "+P" (np. 05-zadanie1+20.txt): P sekund CISZY na
samodzielna prace uczniow po narracji tej sceny - scena dostaje w timeline
pole "pauza", a sciezka audio odpowiednio dluzsza przerwe przed kolejna scena
(HTML rysuje w tym czasie odliczanie).
Po wygenerowaniu mierzy ffprobe dlugosci, zapisuje timeline-filmN.js/.json
(start i czas trwania kazdej sceny, z przerwami) i skleja pelna sciezke
audio/filmN-sciezka.mp3 (cisza na poczatku + przerwy miedzy scenami).
"""

import json
import subprocess
import uuid
import sys
import urllib.request
from pathlib import Path

VOICE_ID = "8EWWaNTDrqObI22Gvo1q"  # Aleksandra - jak w czytankach
MODEL = "eleven_v3"

CISZA_START = 0.8   # sekundy ciszy przed pierwsza scena
PRZERWA = 0.9       # przerwa miedzy scenami
CISZA_KONIEC = 1.5  # wybrzmienie na koncu

TU = Path(__file__).resolve().parent
ROOT = TU.parent.parent


def klucz() -> str:
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if line.startswith("ELEVEN_LABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Brak ELEVEN_LABS_API_KEY w .env.local")


def tts(tekst: str, cel: Path, api_key: str) -> None:
    body = json.dumps({
        "text": tekst,
        "model_id": MODEL,
        "language_code": "pl",
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


def slowa(mp3: Path, tekst: str, api_key: str | None) -> list:
    """Czasy slow sceny (ElevenLabs forced alignment), cache w audio/filmN/NN.json.

    HTML wiaze animacje ze slowem (data-slowo), wiec nie trzeba recznie
    zgadywac opoznien z tempa lektorki.
    """
    cache = mp3.with_suffix(".json")
    if cache.exists() and cache.stat().st_mtime >= mp3.stat().st_mtime:
        return json.loads(cache.read_text(encoding="utf-8"))
    if not api_key:
        sys.exit(f"Brak {cache.name} - uruchom bez --tylko-timeline")
    granica = uuid.uuid4().hex
    body = b"".join([
        f"--{granica}\r\nContent-Disposition: form-data; name=\"text\"\r\n"
        f"Content-Type: text/plain; charset=utf-8\r\n\r\n".encode("utf-8"),
        tekst.encode("utf-8"),
        f"\r\n--{granica}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{mp3.name}\"\r\n"
        f"Content-Type: audio/mpeg\r\n\r\n".encode("utf-8"),
        mp3.read_bytes(),
        f"\r\n--{granica}--\r\n".encode("utf-8"),
    ])
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/forced-alignment",
        data=body,
        headers={"xi-api-key": api_key, "Content-Type": f"multipart/form-data; boundary={granica}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as res:
            wynik = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode('utf-8', 'replace')}")
    lista = [[w["text"].strip(), round(w["start"], 2)] for w in wynik["words"] if w["text"].strip()]
    cache.write_text(json.dumps(lista, ensure_ascii=False), encoding="utf-8")
    return lista


def dlugosc(mp3: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(mp3)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main() -> None:
    film = sys.argv[1] if len(sys.argv) > 1 else sys.exit("Podaj film, np. film1")
    teksty = sorted((TU / "narracja" / film).glob("*.txt"))
    if not teksty:
        sys.exit(f"Brak tekstow w narracja/{film}")
    audio_dir = TU / "audio" / film
    audio_dir.mkdir(parents=True, exist_ok=True)

    api_key = None
    if "--tylko-timeline" not in sys.argv:
        api_key = klucz()
        for txt in teksty:
            mp3 = audio_dir / f"{txt.stem}.mp3"
            if mp3.exists() and "--wszystko" not in sys.argv:
                continue
            tekst = txt.read_text(encoding="utf-8").strip()
            print(f"{txt.name}: {len(tekst)} znakow...", flush=True)
            tts(tekst, mp3, api_key)
            print(f"  -> {mp3.name} ({dlugosc(mp3):.1f}s)", flush=True)

    # os czasu
    sceny = []
    t = CISZA_START
    for txt in teksty:
        mp3 = audio_dir / f"{txt.stem}.mp3"
        if not mp3.exists():
            sys.exit(f"Brak {mp3} - najpierw wygeneruj audio")
        d = dlugosc(mp3)
        # "+P" w nazwie = P sekund ciszy na prace uczniow po narracji sceny
        pauza = float(txt.stem.rsplit("+", 1)[1]) if "+" in txt.stem else 0.0
        scena = {"id": txt.stem, "start": round(t, 3), "dur": round(d, 3),
                 "slowa": slowa(mp3, txt.read_text(encoding="utf-8").strip(), api_key)}
        if pauza:
            scena["pauza"] = pauza
        sceny.append(scena)
        t += d + pauza + PRZERWA
    total = t - PRZERWA + CISZA_KONIEC

    timeline = {"sceny": sceny, "total": round(total, 3)}
    (TU / f"timeline-{film}.json").write_text(
        json.dumps(timeline, indent=2, ensure_ascii=False), encoding="utf-8")
    (TU / f"timeline-{film}.js").write_text(
        "window.TIMELINE = " + json.dumps(timeline, ensure_ascii=False) + ";\n", encoding="utf-8")

    # pelna sciezka: cisza + sceny z przerwami
    wejscia, filtry = [], []
    for i, s in enumerate(sceny):
        wejscia += ["-i", str(audio_dir / f"{s['id']}.mp3")]
        opoznienie = int(s["start"] * 1000)
        filtry.append(
            f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,"
            f"adelay={opoznienie}|{opoznienie}[a{i}]")
    wszystkie = "".join(f"[a{i}]" for i in range(len(sceny)))
    filtry.append(
        f"{wszystkie}amix=inputs={len(sceny)}:normalize=0,"
        f"apad=whole_dur={total}[out]")
    cel = TU / "audio" / f"{film}-sciezka.mp3"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", *wejscia,
         "-filter_complex", ";".join(filtry), "-map", "[out]",
         "-t", str(total), "-b:a", "160k", str(cel)],
        check=True,
    )
    print(f"Timeline: {len(sceny)} scen, {total:.1f}s -> {cel.name}")


if __name__ == "__main__":
    main()
