-- Prywatny bucket na mp3 czytanek (nagrania tekstow z podrecznika - prawa
-- autorskie). Apka odtwarza je przez podpisany URL, wiec slucha tylko
-- zalogowany nauczyciel. Pliki wrzuca audio-czytanki/wyslij.py.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('czytanki', 'czytanki', false, 20971520, array['audio/mpeg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "czytanki: odczyt dla zalogowanych" on storage.objects;
create policy "czytanki: odczyt dla zalogowanych" on storage.objects
  for select to authenticated
  using (bucket_id = 'czytanki');
