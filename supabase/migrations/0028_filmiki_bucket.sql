-- Prywatny bucket na filmiki lekcyjne (mp4 z filmiki/*/renderuj.mjs). Apka
-- odtwarza je na slajdzie `video` przez podpisany URL, jak czytanki.
-- Pliki wrzuca filmiki/wyslij.py.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('filmiki', 'filmiki', false, 104857600, array['video/mp4'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "filmiki: odczyt dla zalogowanych" on storage.objects;
create policy "filmiki: odczyt dla zalogowanych" on storage.objects
  for select to authenticated
  using (bucket_id = 'filmiki');
