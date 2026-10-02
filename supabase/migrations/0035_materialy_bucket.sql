-- Prywatny bucket na sprawdziany po dziale (PDF grup A-D + klucz z
-- materialy/sprawdzian.mjs). Repo jest publiczne, wiec sprawdzian nie moze
-- lezec w public/. Apka otwiera go przez podpisany URL (pasek "Po dziale"
-- nad lista lekcji). Pliki wrzuca materialy/wyslij.py.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('materialy', 'materialy', false, 52428800, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "materialy: odczyt dla zalogowanych" on storage.objects;
create policy "materialy: odczyt dla zalogowanych" on storage.objects
  for select to authenticated
  using (bucket_id = 'materialy');
