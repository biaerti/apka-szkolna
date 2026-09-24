"""Czasy slow czytanki (ElevenLabs forced alignment) - do podswietlania tekstu
na slajdzie czytanki, w rytm lektorki.

Uzycie:
  python audio-czytanki/synchronizuj.py historia-o-akceptacji   # wybrane id
  python audio-czytanki/synchronizuj.py                         # wszystkie mp3 bez json

Wejscie: public/audio/czytanki/<id>.mp3 + audio-czytanki/teksty/NN-<id>.txt.
Wynik:   public/audio/czytanki/<id>.json (poza repo - zawiera caly tekst),
         potem wyslij.py <id>.json.

Format: {"akapity": [{"slowa": [[tekst, start_s, koniec_s], ...], "odstep": bool}]}
Akapit = jedna linia pliku tekstowego (kwestie dialogu sa osobnymi liniami),
"odstep" = przed linia byla pusta linia. Pierwsza linia to autor i tytul.
"""

import json
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEKSTY = ROOT / "audio-czytanki" / "teksty"
MP3 = ROOT / "public" / "audio" / "czytanki"


def klucz() -> str:
    for line in (ROOT / ".env.local").read_text(encoding="utf-8").splitlines():
        if line.startswith("ELEVEN_LABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Brak ELEVEN_LABS_API_KEY w .env.local")


def tekst_dla(czytanka_id: str) -> Path:
    for p in TEKSTY.glob(f"*-{czytanka_id}.txt"):
        if p.stem.split("-", 1)[1] == czytanka_id:
            return p
    sys.exit(f"Brak tekstu audio-czytanki/teksty/NN-{czytanka_id}.txt")


def alignment(mp3: Path, tekst: str, api_key: str) -> list[dict]:
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
    print(f"  loss {wynik.get('loss', 0):.2f}", flush=True)
    return [w for w in wynik["words"] if w["text"].strip()]


def synchronizuj(czytanka_id: str, api_key: str) -> None:
    plik = tekst_dla(czytanka_id)
    mp3 = MP3 / f"{czytanka_id}.mp3"
    tekst = plik.read_text(encoding="utf-8").strip()
    print(f"{czytanka_id}: {len(tekst)} znakow", flush=True)
    slowa_api = alignment(mp3, tekst, api_key)

    akapity, odstep, i = [], False, 0
    for linia in tekst.splitlines():
        if not linia.strip():
            odstep = True
            continue
        slowa = []
        for token in linia.split():
            if i >= len(slowa_api) or slowa_api[i]["text"].strip() != token:
                found = slowa_api[i]["text"] if i < len(slowa_api) else "koniec"
                sys.exit(f"Rozjazd na slowie {i}: tekst '{token}', alignment '{found}'")
            w = slowa_api[i]
            slowa.append([token, round(w["start"], 2), round(w["end"], 2)])
            i += 1
        akapity.append({"slowa": slowa, "odstep": odstep})
        odstep = False

    cel = MP3 / f"{czytanka_id}.json"
    cel.write_text(json.dumps({"akapity": akapity}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"  -> {cel.relative_to(ROOT)} ({i} slow, {len(akapity)} akapitow)", flush=True)


def main() -> None:
    ids = sys.argv[1:] or [p.stem for p in sorted(MP3.glob("*.mp3")) if not p.with_suffix(".json").exists()]
    api_key = klucz()
    for czytanka_id in ids:
        synchronizuj(czytanka_id, api_key)


if __name__ == "__main__":
    main()
