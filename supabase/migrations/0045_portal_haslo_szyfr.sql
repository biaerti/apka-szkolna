-- Portal ucznia: kopia hasla z kartki zaszyfrowana w przegladarce kluczem Bartka
-- (ten sam co imiona i nazwiska, src/lib/studentCrypto.ts). Dzieki temu wiadomosc
-- do rodzica z loginem i haslem mozna skopiowac takze dzien po zalozeniu konta.
-- Logowanie dalej sprawdza tylko hash (haslo_hash); tej kolumny nie czyta zadna
-- funkcja dostepna bez logowania, a tabela jest tylko dla authenticated (RLS).
-- Apka zapisuje tu wylacznie zaszyfrowany tekst ("enc1:..."), nigdy jawny.

alter table public.dyktando_uczniowie add column if not exists haslo_szyfr text;
