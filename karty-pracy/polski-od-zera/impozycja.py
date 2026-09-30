"""Ukladanie stron A5 po dwie na A4 (poziomo).

broszura: kartki skladane na pol i zszywane w grzbiecie (druk dwustronny, obracanie po krotszej krawedzi)
do ciecia: kartki ciete na pol; stos lewych polowek kladzie sie na stos prawych

Uzycie: python impozycja.py wejscie-A5.pdf broszura.pdf do-ciecia.pdf
"""
import sys
from pypdf import PdfReader, PdfWriter, Transformation, PageObject

A4_W, A4_H = 841.89, 595.28


def arkusz(writer, src, lewa, prawa):
    strona = PageObject.create_blank_page(width=A4_W, height=A4_H)
    for nr, dx in ((lewa, 0), (prawa, A4_W / 2)):
        if nr is None:
            continue
        p = src.pages[nr - 1]
        w, h = float(p.mediabox.width), float(p.mediabox.height)
        s = min((A4_W / 2) / w, A4_H / h)
        strona.merge_transformed_page(p, Transformation().scale(s).translate(dx + (A4_W / 2 - w * s) / 2, (A4_H - h * s) / 2))
    writer.add_page(strona)


def main(wej, broszura, ciecie):
    src = PdfReader(wej)
    n = len(src.pages)
    if n % 4:
        raise SystemExit(f"{wej}: {n} stron, a musi byc wielokrotnosc 4")
    s = n // 4

    w = PdfWriter()
    for k in range(s):
        arkusz(w, src, n - 2 * k, 2 * k + 1)          # przod
        arkusz(w, src, 2 * k + 2, n - 2 * k - 1)      # tyl
    w.write(broszura)

    w = PdfWriter()
    for k in range(s):
        arkusz(w, src, 2 * k + 1, 2 * s + 2 * k + 1)  # przod
        arkusz(w, src, 2 * s + 2 * k + 2, 2 * k + 2)  # tyl
    w.write(ciecie)
    print(f"  {n} stron A5 -> {s} kartek A4 (broszura i do ciecia)")


if __name__ == "__main__":
    main(*sys.argv[1:4])
