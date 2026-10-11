"""Zwarte wersje filmow z poprawkami spojnosci (klasa 4 i 5, dzial 2).

Jak skroc-filmy-klasa4.py, ale:
- zrodlem jest pelny timeline sprzed skrocenia (z gita), wiec skrypt mozna
  puszczac wiele razy,
- oprocz calych scen wycina tez pojedyncze zdania albo slowa ze sceny
  ("Zadanie trzecie." po usunieciu zadania drugiego, zdanie w podsumowaniu
  o scenie, ktorej juz nie ma). Ciecie idzie po czasach slow z forced
  alignment: od poczatku pierwszego wycietego slowa do poczatku pierwszego
  zostawionego.

Uzycie: python tools/sklej-filmy.py [film ...]   (bez argumentow - wszystkie)
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RATE = 1.25
TASK_PAUSE = 12.0
START_SILENCE = 0.8
SCENE_GAP = 0.9
MARGIN = 0.04  # ciecie tuz przed slowem, zeby nie uciac jego poczatku

KL4 = "3b1ad0e^"  # pelne timeline'y klasy 4
KL5 = "f4f93b5^"  # pelne timeline'y klasy 5

# film: (rewizja z pelnym timeline'em, wyciete sceny, {scena: [(od frazy, do frazy wlacznie)]})
# Zasada (Bartek, 2026-10-11): poczatkow nie ucinamy, film ma byc spojny, moze miec ponad 5 minut.
# Wycinamy tylko zadania (z ich sprawdzeniem) i slowa z liczbami, ktore by sie nie zgadzaly.
CZTERY = [("cztery", "cztery")]
FILMY: dict[str, tuple[str, set[str], dict[str, list[tuple[str, str]]]]] = {
    "potoczne": (KL4, {"04-zadanie1+20", "05-odpowiedz1"}, {
        "01-intro": CZTERY,
        "07-zadanie2+25": [("Zadanie drugie", "drugie")],
        "10-zadanie3+25": [("Zadanie trzecie", "trzecie")],
        "13-zadanie4+20": [("Zadanie czwarte", "czwarte")],
    }),
    "porownanie": (KL4, {"07-zadanie2+20", "08-odpowiedz2"}, {
        "01-intro": CZTERY,
        "10-zadanie3+25": [("Zadanie trzecie", "trzecie")],
        "13-zadanie4+25": [("Zadanie czwarte", "czwarte")],
    }),
    "synonimy": (KL4, {"14-zadanie4+20", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "list": (KL4, {"14-zadanie4+20", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    # pulapki odwoluja sie do "ci/te" z rodzaju w liczbie mnogiej - wypadaja razem z nim
    "rzeczownik4": (KL4, {"10-rodzaj-mnoga", "13-pulapki", "14-zadanie4+20", "15-odpowiedz4"}, {
        "01-intro": CZTERY,
        "16-podsumowanie": [("W liczbie mnogiej", "mnogą")],
    }),
    "przypadki": (KL4, {"08-zadanie2+20", "09-odpowiedz2"}, {
        "01-intro": CZTERY,
        "11-zadanie3+25": [("Zadanie trzecie", "trzecie")],
        "14-zadanie4+20": [("Zadanie czwarte", "czwarte")],
    }),
    "przypadki-mnoga": (KL4, {"14-zadanie4+25", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "opinia": (KL4, {"13-zadanie4+25", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "asertywnosc": (KL4, {"13-zadanie4+25", "14-odpowiedz4"}, {
        "01-intro": [("Po drodze czekają", "głos")],
    }),
    "wielka-litera": (KL4, {"14-zadanie4+25", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "nie-rzeczownik": (KL4, {"10-zadanie3+20", "11-odpowiedz3"}, {
        "01-intro": CZTERY,
        "13-zadanie4+25": [("Zadanie czwarte", "czwarte")],
    }),
    "podsumowanie4-dzial2": (KL4, {"08-zadanie2+20", "09-odpowiedz2", "16-zadanie4+20", "17-odpowiedz4"}, {
        "01-intro": [("Po drodze czeka", "zadań")],
        "12-zadanie3+20": [("Zadanie trzecie", "trzecie")],
        "20-zadanie5+25": [("Zadanie piąte", "ostatnie")],
        "22-zapamietaj": [("cztery", "pięciu")],
    }),
    "zdrobnienia": (KL5, {"13-zadanie4+20", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "frazeologizmy": (KL5, {"14-zadanie4+25", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "przenosnia": (KL5, {"14-zadanie4+25", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "zlosc": (KL5, {"13-zadanie4+25", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "rzeczownik": (KL5, {"14-zadanie4+25", "15-odpowiedz4"}, {"01-intro": CZTERY}),
    "ogonki": (KL5, set(), {}),
    "dwukropek": (KL5, {"13-zadanie4+20", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "nietypowe": (KL5, {"13-zadanie4+20", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "sprawozdanie": (KL5, {"13-zadanie4+20", "14-odpowiedz4"}, {"01-intro": CZTERY}),
    "reklama": (KL5, set(), {}),
    "podsumowanie5-dzial2": (KL5, {"06-zadanie2+20", "07-odpowiedz2", "12-zadanie4+25", "13-odpowiedz4"}, {
        "01-intro": [("Po drodze czeka", "zadań")],
        "09-zadanie3+20": [("Zadanie trzecie", "trzecie")],
        "15-zadanie5+20": [("Zadanie piąte", "piąte")],
        "17-final": [("cztery", "pięciu")],
    }),
}


def run(*args: str) -> None:
    subprocess.run(args, check=True)


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nokey=1:noprint_wrappers=1", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(out.stdout.strip())


def silence(path: Path, seconds: float) -> None:
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(seconds), "-q:a", "4", str(path))


def norm(word: str) -> str:
    return re.sub(r"[^a-ząćęłńóśźż]", "", word.lower())


def find_range(words: list, start: str, end: str) -> tuple[int, int]:
    """Indeksy [a, b) slow od frazy start do slowa end (wlacznie)."""
    tokens = [norm(w) for w in start.split()]
    names = [norm(w[0]) for w in words]
    for a in range(len(names) - len(tokens) + 1):
        if names[a:a + len(tokens)] == tokens:
            for b in range(a + len(tokens) - 1, len(names)):
                if names[b] == norm(end):
                    return a, b + 1
    raise ValueError(f"nie ma frazy: {start} ... {end}")


def cut_scene(source: Path, target: Path, words: list, cuts: list[tuple[str, str]], temp: Path) -> list:
    """Wycina zdania ze sceny (w oryginalnym tempie), zwraca nowe czasy slow."""
    total = duration(source)
    ranges = sorted(find_range(words, s, e) for s, e in cuts)
    keep: list[tuple[float, float]] = []
    new_words = []
    pos, shift = 0.0, 0.0
    for a, b in ranges:
        t_a = max(0.0, float(words[a][1]) - MARGIN)
        t_b = float(words[b][1]) - MARGIN if b < len(words) else total
        keep.append((pos, t_a))
        pos = t_b
    keep.append((pos, total))
    removed = set(i for a, b in ranges for i in range(a, b))
    for i, (word, offset) in enumerate(words):
        if i in removed:
            continue
        off = float(offset)
        cut_before = sum((float(words[b][1]) - MARGIN if b < len(words) else total) - max(0.0, float(words[a][1]) - MARGIN)
                         for a, b in ranges if b <= i)
        new_words.append([word, round(off - cut_before, 3)])
    parts = []
    for k, (t0, t1) in enumerate(keep):
        if t1 - t0 < 0.02:
            continue
        part = temp / f"{target.stem}-k{k}.wav"
        run("ffmpeg", "-y", "-loglevel", "error", "-i", str(source), "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}",
            "-af", "afade=t=in:d=0.015,areverse,afade=t=in:d=0.015,areverse", "-ar", "44100", "-ac", "1", str(part))
        parts.append(part)
    lista = temp / f"{target.stem}-lista.txt"
    lista.write_text("\n".join(f"file '{p.as_posix()}'" for p in parts) + "\n", encoding="utf-8")
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lista), "-q:a", "2", str(target))
    return new_words


def compact(name: str) -> None:
    rev, omitted, cuts = FILMY[name]
    folder = ROOT / "filmiki" / name
    full = json.loads(subprocess.run(["git", "show", f"{rev}:filmiki/{name}/timeline-film1.json"],
                                     cwd=ROOT, check=True, capture_output=True).stdout.decode("utf-8"))
    assert not full.get("compact"), name
    scenes = [s for s in full["sceny"] if s["id"] not in omitted]
    temp = ROOT / "tmp" / f"sklej-{name}"
    if temp.exists():
        shutil.rmtree(temp)
    temp.mkdir(parents=True)
    start_silence, gap_silence, task_silence = temp / "cisza-start.mp3", temp / "cisza-przerwa.mp3", temp / "cisza-zadanie.mp3"
    silence(start_silence, START_SILENCE)
    silence(gap_silence, SCENE_GAP)
    silence(task_silence, TASK_PAUSE)

    pieces = [start_silence]
    current = START_SILENCE
    out_scenes = []
    for index, scene in enumerate(scenes):
        source = folder / "audio" / "film1" / f"{scene['id']}.mp3"
        words = scene.get("slowa", [])
        if scene["id"] in cuts:
            cut = temp / f"{index:02d}-{scene['id']}-ciete.mp3"
            words = cut_scene(source, cut, words, cuts[scene["id"]], temp)
            source = cut
        target = temp / f"{index:02d}-{scene['id']}.mp3"
        run("ffmpeg", "-y", "-loglevel", "error", "-i", str(source), "-filter:a", f"atempo={RATE}", "-q:a", "2", str(target))
        scene_duration = duration(target)
        nowa = {
            "id": scene["id"],
            "start": round(current, 3),
            "dur": round(scene_duration, 3),
            "slowa": [[w, round(float(o) / RATE, 3)] for w, o in words],
        }
        if "pauza" in scene:
            nowa["pauza"] = TASK_PAUSE
        out_scenes.append(nowa)
        pieces.append(target)
        current += scene_duration
        if "pauza" in scene:
            pieces.append(task_silence)
            current += TASK_PAUSE
        if index < len(scenes) - 1:
            pieces.append(gap_silence)
            current += SCENE_GAP

    lista = temp / "lista.txt"
    lista.write_text("\n".join(f"file '{p.as_posix()}'" for p in pieces) + "\n", encoding="utf-8")
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lista),
        "-c:a", "libmp3lame", "-q:a", "2", str(folder / "audio" / "film1-sciezka.mp3"))
    result = {"sceny": out_scenes, "total": round(current, 3),
              "compact": {"rate": RATE, "taskPause": TASK_PAUSE, "cuts": {k: v for k, v in cuts.items()}}}
    (folder / "timeline-film1.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (folder / "timeline-film1.js").write_text(
        "window.TIMELINE = " + json.dumps(result, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"{name}: {current:.1f}s ({int(current // 60)}:{int(current % 60):02d}), {len(out_scenes)} scen")


if __name__ == "__main__":
    for film in sys.argv[1:] or list(FILMY):
        compact(film)
