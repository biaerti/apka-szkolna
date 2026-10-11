"""ZASTAPIONY przez tools/sklej-filmy.py (intra i wyjasnienia wracaja, numery zadan sie zgadzaja).
Buduje zwarte wersje filmow rozdzialu II klasy 4 z istniejacych nagran.

Zasady nowej wersji:
- trzy zadania zamiast czterech (w podsumowaniu trzy zamiast pieciu),
- 12 sekund na zapisanie odpowiedzi - nauczyciel moze zatrzymac film,
- spokojne nagranie lektorskie przyspieszone tylko o 25 procent,
- usuniete cale sceny powtorkowe, ale bez wycinania slow w srodku zdania.

Skrypt nie korzysta z API TTS. Sklada ponownie istniejace pliki scen i
aktualizuje timeline, wiec mozna go bez kosztu uruchomic ponownie.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RATE = 1.25
TASK_PAUSE = 12.0
START_SILENCE = 0.8
SCENE_GAP = 0.9

# Usuwamy zadania najbardziej powtarzalne, zbyt rozbudowane lub wykraczajace
# poza rdzen tematu. Razem z nimi znikaja odpowiadajace im ekrany sprawdzania.
OMIT: dict[str, set[str]] = {
    "potoczne": {"01-intro", "04-zadanie1+20", "05-odpowiedz1"},
    "porownanie": {"01-intro", "07-zadanie2+20", "08-odpowiedz2"},
    "synonimy": {"01-intro", "13-test", "14-zadanie4+20", "15-odpowiedz4"},
    "list": {"01-intro", "02-zagadka", "14-zadanie4+20", "15-odpowiedz4"},
    "rzeczownik4": {"01-intro", "03-pojecia", "10-rodzaj-mnoga", "14-zadanie4+20", "15-odpowiedz4"},
    "przypadki": {"01-intro", "04-zaba", "07-wierszyk", "08-zadanie2+20", "09-odpowiedz2"},
    "przypadki-mnoga": {"01-intro", "02-powtorka", "14-zadanie4+25", "15-odpowiedz4"},
    "opinia": {"01-intro", "13-zadanie4+25", "14-odpowiedz4"},
    "asertywnosc": {"01-intro", "13-zadanie4+25", "14-odpowiedz4"},
    "wielka-litera": {"01-intro", "13-detektyw", "14-zadanie4+25", "15-odpowiedz4"},
    "nie-rzeczownik": {"01-intro", "09-ciekawostka", "10-zadanie3+20", "11-odpowiedz3"},
    "podsumowanie4-dzial2": {
        "01-intro", "03-porownanie", "07-list", "08-zadanie2+20", "09-odpowiedz2",
        "15-asertywnosc", "16-zadanie4+20", "17-odpowiedz4", "19-nie",
    },
}


def run(*args: str) -> None:
    subprocess.run(args, check=True)


def duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nokey=1:noprint_wrappers=1", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def silence(path: Path, seconds: float) -> None:
    run(
        "ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
        "anullsrc=r=44100:cl=mono", "-t", str(seconds), "-q:a", "4", str(path),
    )


def compact(name: str, omitted: set[str]) -> None:
    folder = ROOT / "filmiki" / name
    timeline_path = folder / "timeline-film1.json"
    timeline = json.loads(timeline_path.read_text(encoding="utf-8"))
    # Chroni przed ponownym dzieleniem czasow slow. Pelny timeline z generatora
    # ma ponad 7 minut, a wersja zwarta najwyzej 5 minut.
    if timeline.get("compact") or float(timeline["total"]) <= 301:
        print(f"{name}: juz jest wersja zwarta ({timeline['total']:.1f}s), pomijam")
        return
    scenes = [scene for scene in timeline["sceny"] if scene["id"] not in omitted]
    temp = ROOT / "tmp" / f"kompakt-{name}"
    if temp.exists():
        shutil.rmtree(temp)
    temp.mkdir(parents=True)

    start_silence = temp / "cisza-start.mp3"
    gap_silence = temp / "cisza-przerwa.mp3"
    task_silence = temp / "cisza-zadanie.mp3"
    silence(start_silence, START_SILENCE)
    silence(gap_silence, SCENE_GAP)
    silence(task_silence, TASK_PAUSE)

    pieces = [start_silence]
    current = START_SILENCE
    compact_scenes = []
    for index, scene in enumerate(scenes):
        source = folder / "audio" / "film1" / f"{scene['id']}.mp3"
        if not source.exists():
            raise FileNotFoundError(source)
        target = temp / f"{index:02d}-{scene['id']}.mp3"
        run("ffmpeg", "-y", "-loglevel", "error", "-i", str(source), "-filter:a", f"atempo={RATE}", "-q:a", "2", str(target))
        scene_duration = duration(target)
        next_scene = {
            "id": scene["id"],
            "start": round(current, 3),
            "dur": round(scene_duration, 3),
            "slowa": [[word, round(float(offset) / RATE, 3)] for word, offset in scene.get("slowa", [])],
        }
        if "pauza" in scene:
            next_scene["pauza"] = TASK_PAUSE
        compact_scenes.append(next_scene)
        pieces.append(target)
        current += scene_duration
        if "pauza" in scene:
            pieces.append(task_silence)
            current += TASK_PAUSE
        if index < len(scenes) - 1:
            pieces.append(gap_silence)
            current += SCENE_GAP

    concat_file = temp / "lista.txt"
    concat_file.write_text("\n".join(f"file '{path.as_posix()}'" for path in pieces) + "\n", encoding="utf-8")
    output_audio = folder / "audio" / "film1-sciezka.mp3"
    run(
        "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-c:a", "libmp3lame", "-q:a", "2", str(output_audio),
    )

    result = {
        "sceny": compact_scenes,
        "total": round(current, 3),
        "compact": {"rate": RATE, "taskPause": TASK_PAUSE},
    }
    timeline_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (folder / "timeline-film1.js").write_text(
        "window.TIMELINE = " + json.dumps(result, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"{name}: {timeline['total']:.1f}s -> {current:.1f}s ({len(compact_scenes)} scen)")


if __name__ == "__main__":
    for film_name, omitted_ids in OMIT.items():
        compact(film_name, omitted_ids)
