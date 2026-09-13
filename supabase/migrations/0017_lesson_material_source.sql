-- Rozdzielenie listy na gotowe powtorki i lekcje prowadzone z podrecznika.
-- Numery stron sa opcjonalne, bo lekcje wlasne i organizacyjne ich nie maja.
alter table public.lessons add column if not exists material_type text;
alter table public.lessons add column if not exists textbook_page integer;
alter table public.lessons add column if not exists exercise_page integer;

update public.lessons
set material_type = case
  when lower(coalesce(dzial, '')) like 'powtórka%' then 'review'
  else 'textbook'
end
where material_type is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lessons_material_type_check'
  ) then
    alter table public.lessons
      add constraint lessons_material_type_check
      check (material_type is null or material_type in ('review', 'textbook'));
  end if;
end $$;
