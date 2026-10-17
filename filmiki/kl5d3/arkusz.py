"""Arkusz zbiorczy zrzutow z kontrola.mjs: tmp/kontrola-<nazwa>/*.png -> tmp/kontrola-<nazwa>.png (3 kolumny)."""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
nazwa = sys.argv[1]
pliki = sorted((ROOT / "tmp" / f"kontrola-{nazwa}").glob("*.png"))
w, h, kol = 640, 360, 3
rzedy = (len(pliki) + kol - 1) // kol
ark = Image.new("RGB", (kol * w, rzedy * h), "white")
for i, p in enumerate(pliki):
    ark.paste(Image.open(p).convert("RGB").resize((w, h)), ((i % kol) * w, (i // kol) * h))
cel = ROOT / "tmp" / f"kontrola-{nazwa}.png"
ark.save(cel)
print(cel)
