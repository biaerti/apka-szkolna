"""Buduje filmik klasy 5 (dzial 3) ze scenariusza: narracje + film1.html + skrypty.

Uzycie:
  python filmiki/kl5d3/zbuduj.py epitet5            # narracja + html (+ skrypty, jesli brak)
  python filmiki/kl5d3/zbuduj.py epitet5 --sprawdz  # czy kazde data-slowo jest w slowach sceny

Scenariusz: filmiki/<nazwa>/scenariusz.py z lista SCENY (klocki z tego pliku:
intro, teoria, zadanie, odp, zapamietaj) oraz TYTUL, EMO, KOLOR, PORT.
Format nowy od dzialu 3 (Bartek 2026-10-17): 3 zadania z pauza 60 s, potem
SPRAWDZAMY na ekranie z tym samym poleceniem i przykladami, na koncu
"Zapamietaj!". Lektor w naturalnym tempie.

Znaczniki w przykladach zadan (jak w kartach "Ćwiczymy razem"):
  [[odp]]      - luka; w zadaniu kreska, przy sprawdzaniu wpisana odpowiedz
  {{a|*b}}     - wybor; przy sprawdzaniu dobra podswietlona, zla skreslona
  ((x))        - fragment do wskazania; przy sprawdzaniu podswietlony
"""

import importlib.util
import json
import re
import shutil
import sys
from pathlib import Path

TU = Path(__file__).resolve().parent
FILMIKI = TU.parent
WZOR = FILMIKI / "sprawozdanie"
DZIAL = "Klasa 5 · Dział 3 · Ideały, autorytety, idole"
PAUZA = 60


# ---------------- klocki scenariusza ----------------

def _at(slowo=None, po=None, t=None):
    if t is not None:
        return f' data-t="{t}"'
    if slowo is None:
        return ' data-t="0"'
    s = f' data-slowo="{slowo}"'
    if po:
        s += f' data-po="{po}"'
    return s


def karta(nazwa, opis="", slowo=None, kolor=None, emo="", anim="pop", po=None, styl=""):
    k = f' style="border-color:{kolor};{styl}"' if kolor else (f' style="{styl}"' if styl else "")
    kn = f' style="color:{kolor}"' if kolor else ""
    e = f'<div class="emo">{emo}</div>' if emo else ""
    o = f'<div class="opis">{opis}</div>' if opis else ""
    return f'<div class="karta {anim}"{_at(slowo, po)}{k}>{e}<div class="nazwa"{kn}>{nazwa}</div>{o}</div>'


def rzad(*elementy):
    return f'<div class="rzad">{"".join(elementy)}</div>'


def linia(html, slowo=None, anim="pop", po=None, styl=""):
    s = f' style="{styl}"' if styl else ""
    return f'<div class="linia {anim}"{_at(slowo, po)}{s}>{html}</div>'


def lista(*linie, szer=1100, kolumny=1):
    if kolumny == 2:
        return f'<div class="siatka" style="width:{szer}px">{"".join(linie)}</div>'
    return f'<div class="lista" style="width:{szer}px">{"".join(linie)}</div>'


def chip(tekst, slowo=None, kolor=None, anim="pop", po=None, rozmiar=None):
    st = []
    if kolor:
        st.append(f"background:{kolor}")
    if rozmiar:
        st.append(f"font-size:{rozmiar}px")
    s = f' style="{";".join(st)}"' if st else ""
    return f'<span class="chip {anim}"{_at(slowo, po)}{s}>{tekst}</span>'


def chipy(*c):
    return f'<div class="chipy">{"".join(c)}</div>'


def tabela(naglowki, wiersze, slowa=None, szer=1000):
    """wiersze: listy komorek (html); slowa[i] = slowo, przy ktorym wchodzi wiersz i."""
    th = "".join(f"<th>{h}</th>" for h in naglowki)
    tr = []
    for i, w in enumerate(wiersze):
        sl = slowa[i] if slowa else None
        at = _at(sl) if sl else ' data-t="0"'
        tr.append(f'<tr class="zjaw"{at}>' + "".join(f"<td>{c}</td>" for c in w) + "</tr>")
    return f'<table class="tab" style="width:{szer}px"><tr>{th}</tr>{"".join(tr)}</table>'


def surowe(html):
    return html


def intro(narr, tytul, chipy_=(), zapowiedz_slowo="zadania", emo=None):
    return {"typ": "intro", "nazwa": "intro", "narr": narr, "tytul": tytul, "chipy": chipy_,
            "zap": zapowiedz_slowo, "emo": emo}


def teoria(nazwa, narr, czesc, naglowek, *bloki):
    return {"typ": "teoria", "nazwa": nazwa, "narr": narr, "czesc": czesc, "naglowek": naglowek, "bloki": bloki}


def zad(tekst, etyk=None, why=None, slowo=None, kolor=None):
    """Przyklad w zadaniu: tekst ze znacznikami + to, co pokaze sprawdzanie."""
    return {"tekst": tekst, "etyk": etyk, "why": why, "slowo": slowo, "kolor": kolor}


def zadanie(nr, narr, czesc, polecenie, przyklady, pokaz, opcje=(), kolumny=1, nazwa=None, szer=1140, numery=True):
    return {"typ": "zadanie", "nazwa": nazwa or f"zadanie{nr}", "nr": nr, "narr": narr, "czesc": czesc,
            "polecenie": polecenie, "przyklady": przyklady, "pokaz": pokaz, "opcje": opcje,
            "kolumny": kolumny, "szer": szer, "numery": numery}


def odp(nr, narr, zadanie_, slowa, extra="", nazwa=None):
    """slowa[i] - slowo narracji, przy ktorym odslania sie odpowiedz przykladu i."""
    return {"typ": "odp", "nazwa": nazwa or f"odpowiedz{nr}", "narr": narr, "zad": zadanie_,
            "slowa": slowa, "extra": extra}


def zapamietaj(narr, linie_, brawo="brawo"):
    return {"typ": "zapamietaj", "nazwa": "podsumowanie", "narr": narr, "linie": linie_, "brawo": brawo}


# ---------------- skladanie HTML ----------------

ZNACZNIK = re.compile(r"\[\[(.+?)\]\]|\{\{(.+?)\}\}|\(\((.+?)\)\)")


def przyklad_html(tekst, sprawdz):
    def zam(m):
        luka, wyb, wsk = m.groups()
        if luka is not None:
            odp_ = luka.split("|")[0]
            if sprawdz:
                return f'<b class="wpis o-wpis o-razem">{odp_}</b>'
            return '<span class="luka mala"></span>' if len(odp_) <= 2 else '<span class="luka"></span>'
        if wyb is not None:
            opcje = wyb.split("|")
            czesci = []
            for o in opcje:
                dobra = o.startswith("*")
                o = o.lstrip("*")
                if not sprawdz:
                    czesci.append(f'<span class="wyb">{o}</span>')
                elif dobra:
                    czesci.append(f'<span class="wyb o-podsw o-razem">{o}</span>')
                else:
                    czesci.append(f'<span class="wyb o-skresl o-razem">{o}</span>')
            return '<span class="sl">/</span>'.join(czesci)
        if sprawdz:
            return f'<span class="o-podsw o-razem">{wsk}</span>'
        return wsk
    return ZNACZNIK.sub(zam, tekst)


def _czesc(c, anim=True):
    if not c:
        return ""
    nr, label = c
    a = ' zjaw" data-t="0' if anim else ""
    return f'<span class="czesc c{nr}{a}">{nr} · {label}</span>'


def _opcje(opcje, anim):
    if not opcje:
        return ""
    cz = []
    for i, o in enumerate(opcje):
        tekst, kolor = (o if isinstance(o, tuple) else (o, None))
        st = f' style="background:{kolor}"' if kolor else ""
        if anim:
            cz.append(f'<span class="chip pop"{_at(anim, round(0.25 * i, 2))}{st}>{tekst}</span>')
        else:
            cz.append(f'<span class="chip"{st}>{tekst}</span>')
    return f'<div class="opcje">{"".join(cz)}</div>'


def scena_html(s, sid, tytul, emo):
    t = s["typ"]
    if t == "intro":
        ch = "".join(chip(tx, sl) for tx, sl in s["chipy"])
        return (f'<section class="scena intro" data-id="{sid}">'
                f'<div class="male zjaw" data-t="0">{DZIAL}</div>'
                f'<div class="emo pop" data-t="0.3">{s["emo"] or emo}</div>'
                f'<div class="tytul pop" data-t="0.6">{tytul}</div>'
                f'<div class="grupy">{ch}</div>'
                f'<div class="zapowiedz pop"{_at(s["zap"])}>✏️ 3 zadania · 📓 zeszyt w gotowości!</div>'
                f'</section>')
    if t == "teoria":
        nag = f'<h2 class="naglowek wjazd-dol" data-t="0">{s["naglowek"]}</h2>' if s["naglowek"] else ""
        return (f'<section class="scena" data-id="{sid}">{_czesc(s["czesc"])}{nag}'
                + "".join(s["bloki"]) + "</section>")
    if t in ("zadanie", "odp"):
        z = s if t == "zadanie" else s["zad"]
        spr = t == "odp"
        badge = "SPRAWDZAMY ✅" if spr else f'ZADANIE {z["nr"]} ✏️'
        linie_ = []
        for i, p in enumerate(z["przyklady"]):
            nr = f'<span class="nr">{i + 1}</span>' if z["numery"] else ""
            body = przyklad_html(p["tekst"], spr)
            if spr:
                if p["etyk"]:
                    kol = f' style="background:{p["kolor"]}"' if p["kolor"] else ""
                    body += f'<span class="etyk o-znak o-razem"{kol}>{p["etyk"]}</span>'
                if p["why"]:
                    body += f'<span class="dlaczego o-wpis o-razem">{p["why"]}</span>'
                sl = s["slowa"][i]
                at = _at(sl) if sl else ""
                linie_.append(f'<div class="linia"{at}>{nr}{body}</div>')
            else:
                linie_.append(f'<div class="linia pop"{_at(z["pokaz"], round(0.2 * i, 2))}>{nr}{body}</div>')
        lst = lista(*linie_, szer=z["szer"], kolumny=z["kolumny"])
        pol_anim = "" if spr else ' wjazd-dol" data-t="0.4'
        html = (f'<section class="scena {"odp" if spr else "zadanie"}" data-id="{sid}">'
                f'{_czesc(z["czesc"], anim=False)}'
                f'<div><span class="badge pop" data-t="0">{badge}</span></div>'
                f'<div class="polecenie{pol_anim}">{z["polecenie"]}</div>'
                f'{_opcje(z["opcje"], None if spr else z["pokaz"])}{lst}')
        if spr:
            html += s["extra"]
        else:
            html += ('<div class="odliczanie"><div class="odliczanie-pasek"></div></div>'
                     '<div class="minuta">⏸ Masz minutę. Potrzebujesz więcej? Zatrzymaj film.</div>')
        return html + "</section>"
    if t == "zapamietaj":
        ln = "".join(linia(h, sl) for h, sl in s["linie"])
        return (f'<section class="scena zapamietaj" data-id="{sid}">'
                f'<h2 class="naglowek pop" data-t="0">Zapamiętaj! 🧠</h2>'
                f'<div class="lista">{ln}</div>'
                f'<div><span class="chip brawo pop"{_at(s["brawo"])}>Brawo! 🎉</span></div></section>')
    raise ValueError(t)


CSS = """
:root { --niebieski: #3C7DD9; --zielony: #2E9E5B; --szary: #7a6a5c; --ramka: #d9c9b2; --fiolet: #8A4FD0; --morski: #1B8A8F; }
.scena { padding: 46px 70px 30px; text-align: center; }
h2.naglowek { font-family: 'Baloo 2'; font-size: 52px; line-height: 1.05; color: var(--ak); }
.karta { background: var(--bialy); border: 5px solid var(--ramka); border-radius: 26px; padding: 12px 18px; }
.karta .nazwa { font-family: 'Baloo 2'; font-size: 34px; font-weight: 800; line-height: 1.15; }
.karta .opis { font-size: 27px; font-weight: 800; color: var(--szary); margin-top: 6px; line-height: 1.3; }
.karta .emo { font-size: 54px; line-height: 1.1; }
.chip { display: inline-block; font-family: 'Baloo 2'; font-weight: 800; color: #fff; border-radius: 999px; padding: 5px 26px; background: var(--ciemny); font-size: 28px; }
.chipy { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 18px; }
.rzad { display: flex; gap: 18px; justify-content: center; margin-top: 22px; align-items: stretch; }
.rzad > * { flex: 1; }
.czesc { position: absolute; top: 12px; left: 20px; font-family: 'Baloo 2'; font-size: 22px; font-weight: 800; color: #fff; border-radius: 999px; padding: 2px 18px; }
.c1 { background: var(--ak); } .c2 { background: var(--fiolet); } .c3 { background: var(--niebieski); } .c4 { background: var(--zielony); }
.hl { background: #ffe066; border-radius: 8px; padding: 0 4px; }
.ak { color: var(--ak); } .ok { color: var(--zielony); } .zle { color: var(--roz); }
.skr { color: var(--szary); text-decoration: line-through; text-decoration-color: var(--roz); text-decoration-thickness: 4px; }
.zadanie .badge, .odp .badge { display: inline-block; font-family: 'Baloo 2'; font-size: 40px; font-weight: 800; color: #fff; background: var(--roz); border-radius: 999px; padding: 4px 38px; }
.odp .badge { background: var(--zielony); }
.polecenie { margin-top: 8px; font-size: 33px; font-weight: 800; line-height: 1.25; }
.opcje { display: flex; gap: 12px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
.opcje .chip { font-size: 26px; background: var(--fiolet); }
.odliczanie { margin: 12px auto 0; width: 860px; }
.minuta { margin-top: 6px; font-size: 21px; font-weight: 800; color: var(--szary); }
.lista { display: flex; flex-direction: column; gap: 8px; margin: 12px auto 0; }
.siatka { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin: 12px auto 0; }
.linia { font-size: 30px; font-weight: 800; background: var(--bialy); border-radius: 18px; border: 4px solid var(--ramka); padding: 6px 20px; text-align: left; line-height: 1.3; }
.odp .linia { padding: 4px 18px; }
.nr { display: inline-block; font-family: 'Baloo 2'; color: #fff; background: var(--ak); border-radius: 10px; padding: 0 12px; margin-right: 10px; }
.dlaczego { color: var(--szary); font-size: 22px; margin-left: 10px; }
.etyk { display: inline-block; font-family: 'Baloo 2'; font-size: 23px; font-weight: 800; color: #fff; background: var(--zielony); border-radius: 999px; padding: 0 16px; margin-left: 10px; vertical-align: 3px; }
.luka { display: inline-block; min-width: 130px; border-bottom: 4px dashed var(--roz); }
.luka.mala { min-width: 30px; margin: 0 2px; }
.wpis { color: var(--zielony); font-family: 'Baloo 2'; }
.wyb { display: inline-block; border-radius: 8px; padding: 0 6px; }
.zadanie .wyb { background: #EFE7FB; }
.sl { color: var(--szary); margin: 0 4px; }
.tab { margin: 18px auto 0; border-collapse: separate; border-spacing: 0; background: var(--bialy); border: 4px solid var(--ramka); border-radius: 18px; overflow: hidden; font-size: 28px; font-weight: 800; }
.tab th { font-family: 'Baloo 2'; background: var(--ak); color: #fff; padding: 6px 14px; font-size: 26px; }
.tab td { padding: 6px 14px; border-top: 2px solid var(--ramka); }
.intro { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.intro .male { font-size: 30px; font-weight: 800; color: var(--szary); }
.intro .emo { font-size: 80px; line-height: 1.1; margin-top: 6px; }
.intro .tytul { font-family: 'Baloo 2'; font-size: 88px; font-weight: 800; line-height: 1.02; color: var(--ak); }
.intro .grupy { margin-top: 20px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.intro .grupy .chip:nth-child(1) { background: var(--ak); }
.intro .grupy .chip:nth-child(2) { background: var(--fiolet); }
.intro .grupy .chip:nth-child(3) { background: var(--zielony); }
.intro .grupy .chip:nth-child(4) { background: var(--niebieski); }
.intro .zapowiedz { margin-top: 22px; font-size: 38px; font-weight: 800; }
.zapamietaj .lista { margin-top: 16px; gap: 9px; width: 1120px; }
.zapamietaj .linia { font-size: 30px; padding: 6px 22px; }
.brawo { margin-top: 12px; font-size: 40px; background: var(--roz); padding: 4px 44px; }
"""


def wczytaj(nazwa):
    plik = FILMIKI / nazwa / "scenariusz.py"
    sys.path.insert(0, str(TU))
    spec = importlib.util.spec_from_file_location(f"scen_{nazwa}", plik)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def ids(sceny):
    wynik = []
    for i, s in enumerate(sceny, 1):
        sid = f"{i:02d}-{s['nazwa']}"
        if s["typ"] == "zadanie":
            sid += f"+{PAUZA}"
        wynik.append(sid)
    return wynik


def skrypty(nazwa, port):
    cel = FILMIKI / nazwa
    for plik in ("generuj-audio.py", "player.js", "podejrzyj.mjs", "renderuj.mjs", "wspolne.css"):
        tekst = (WZOR / plik).read_text(encoding="utf-8")
        if plik in ("generuj-audio.py", "podejrzyj.mjs", "renderuj.mjs"):
            tekst = tekst.replace("sprawozdanie", nazwa)
            tekst = re.sub(r"const PORT = \d+;", f"const PORT = {port};", tekst)
        (cel / plik).write_text(tekst, encoding="utf-8")


def zbuduj(nazwa):
    m = wczytaj(nazwa)
    cel = FILMIKI / nazwa
    skrypty(nazwa, m.PORT)
    sceny = m.SCENY
    sid = ids(sceny)
    nar = cel / "narracja" / "film1"
    nar.mkdir(parents=True, exist_ok=True)
    stare = {p.name for p in nar.glob("*.txt")}
    nowe = set()
    for s, i in zip(sceny, sid):
        p = nar / f"{i}.txt"
        tekst = " ".join(s["narr"].split())
        if not p.exists() or p.read_text(encoding="utf-8").strip() != tekst:
            p.write_text(tekst + "\n", encoding="utf-8")
        nowe.add(p.name)
    for zbedny in stare - nowe:
        (nar / zbedny).unlink()
    body = "\n".join(scena_html(s, i, m.TYTUL, m.EMO) for s, i in zip(sceny, sid))
    html = f"""<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>{m.TYTUL} - klasa 5</title>
<link rel="stylesheet" href="wspolne.css">
<style>
/* Wygenerowane przez filmiki/kl5d3/zbuduj.py ze scenariusz.py - poprawki rob w scenariuszu. */
:root {{ --ak: {m.KOLOR}; }}
{CSS}
{getattr(m, 'CSS', '')}
</style>
</head>
<body>
<div id="stage">
{body}
<button id="playBtn">▶ Odtwórz</button>
</div>
<script>window.AUDIO_SRC = 'audio/film1-sciezka.mp3';</script>
<script src="timeline-film1.js"></script>
<script src="player.js"></script>
</body>
</html>
"""
    (cel / "film1.html").write_text(html, encoding="utf-8")
    znaki = sum(len(" ".join(s["narr"].split())) for s in sceny)
    print(f"{nazwa}: {len(sceny)} scen, {znaki} znakow narracji (~{znaki / 13.5 / 60:.1f} min mowy + {3 * PAUZA // 60} min pauz)")


def norm(s):
    return re.sub(r"[^a-ząćęłńóśźż]", "", s.lower())


def sprawdz(nazwa):
    """Bez API: czy kazde data-slowo wystepuje w tekscie narracji sceny (a jesli jest timeline - w slowach)."""
    m = wczytaj(nazwa)
    cel = FILMIKI / nazwa
    html = (cel / "film1.html").read_text(encoding="utf-8")
    tl = cel / "timeline-film1.json"
    slowa_tl = {}
    if tl.exists():
        for s in json.loads(tl.read_text(encoding="utf-8"))["sceny"]:
            slowa_tl[s["id"]] = {norm(w[0]) for w in s["slowa"]}
    bledy = 0
    for s, i in zip(m.SCENY, ids(m.SCENY)):
        blok = re.search(rf'data-id="{re.escape(i)}"(.*?)</section>', html, re.S).group(1)
        narr = {norm(w) for w in s["narr"].split()}
        for sl in re.findall(r'data-slowo="([^"]+)"', blok):
            zbior = slowa_tl.get(i, narr)
            if norm(sl) not in zbior:
                print(f"  BRAK {i}: {sl}")
                bledy += 1
    print(f"{nazwa}: {'OK' if not bledy else str(bledy) + ' brakow'}")
    return bledy


def szkic(nazwa):
    """Szacowana os czasu (13.5 znaku/s, slowa rowno) - do podgladu ukladu przed generacja audio."""
    m = wczytaj(nazwa)
    sceny, t = [], 0.8
    for s, i in zip(m.SCENY, ids(m.SCENY)):
        slowa_, czas = [], 0.0
        for w in " ".join(s["narr"].split()).split():
            slowa_.append([w, round(czas, 2)])
            czas += (len(w) + 1) / 13.5
        sc = {"id": i, "start": round(t, 3), "dur": round(czas, 3), "slowa": slowa_}
        if "+" in i:
            sc["pauza"] = PAUZA
        sceny.append(sc)
        t += czas + sc.get("pauza", 0) + 0.9
    tl = {"sceny": sceny, "total": round(t + 0.6, 3), "szkic": True}
    (FILMIKI / nazwa / "timeline-film1.js").write_text(
        "window.TIMELINE = " + json.dumps(tl, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"{nazwa}: szkic osi czasu {tl['total']:.0f} s")


if __name__ == "__main__":
    nazwy = [a for a in sys.argv[1:] if not a.startswith("--")]
    for n in nazwy:
        if "--szkic" in sys.argv:
            szkic(n)
        elif "--sprawdz" in sys.argv:
            sprawdz(n)
        else:
            zbuduj(n)
            sprawdz(n)
