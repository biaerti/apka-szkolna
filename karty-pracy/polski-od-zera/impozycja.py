"""Uklada strony A5 po dwie na A4 (poziomo) do druku JEDNOSTRONNEGO i przeciecia.

Kartka k: po lewej strona k, po prawej strona S+k (S = liczba kartek).
Po przecieciu stosu na pol lewa kupka to strony 1..S, prawa S+1..2S:
lewa kupka na wierzch, prawa pod spod - i zeszyt jest po kolei.
Na srodku kartki jest przerywana linia ciecia.

Uzycie: python impozycja.py wejscie-A5.pdf wyjscie-A4.pdf
"""
import sys
import pymupdf

A4_W, A4_H = 841.89, 595.28


def main(wej, wyj):
    src = pymupdf.open(wej)
    n = len(src)
    if n % 2:
        raise SystemExit(f"{wej}: {n} stron, a musi byc parzyscie")
    s = n // 2
    out = pymupdf.open()
    for k in range(s):
        page = out.new_page(width=A4_W, height=A4_H)
        page.show_pdf_page(pymupdf.Rect(0, 0, A4_W / 2, A4_H), src, k)
        page.show_pdf_page(pymupdf.Rect(A4_W / 2, 0, A4_W, A4_H), src, s + k)
        x = A4_W / 2
        page.draw_line((x, 0), (x, A4_H), color=(0.6, 0.6, 0.6), width=0.4, dashes="[4 3] 0")
    out.save(wyj, garbage=3, deflate=True)
    print(f"  {n} stron A5 -> {s} kartek A4 (jednostronnie, do przeciecia)")


if __name__ == "__main__":
    main(*sys.argv[1:3])
