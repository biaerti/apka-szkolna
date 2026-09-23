-- Szyfrowanie danych uczniow po stronie przegladarki. Imie, nazwisko i notatka
-- ucznia trafiaja do public.students zaszyfrowane (AES-GCM, prefiks "enc1:"),
-- klucz powstaje z hasla nauczyciela (PBKDF2) i nigdy nie opuszcza urzadzenia.
-- Tu trzymamy tylko sol i probke (zaszyfrowany znany tekst), zeby sprawdzic,
-- czy wpisane haslo jest poprawne. Brak wiersza = szyfrowanie wylaczone.
-- Patrz src/lib/studentCrypto.ts.

create table if not exists public.student_crypto (
  id text primary key default 'default',
  salt text not null,
  check_value text not null,
  created_at timestamptz not null default now()
);

alter table public.student_crypto enable row level security;
drop policy if exists "authenticated full access" on public.student_crypto;
create policy "authenticated full access" on public.student_crypto
  for all to authenticated using (true) with check (true);
