-- Lekcje naleza do rocznika ("IV", "V" - pierwszy wyraz nazwy klasy), nie do
-- pojedynczej klasy. Postep kazdej klasy trzymamy w jsonb `progress`:
--   { "<class_id>": { "status": "done", "doneDate": "2026-09-05" }, ... }
-- Brak wpisu = 'planned'. Idempotentne.

alter table public.lessons
  add column if not exists grade text,
  add column if not exists progress jsonb not null default '{}'::jsonb;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lessons' and column_name = 'class_id'
  ) then
    update public.lessons l
    set grade = split_part(btrim(c.name), ' ', 1)
    from public.classes c
    where c.id = l.class_id and (l.grade is null or l.grade = '');

    update public.lessons
    set progress = jsonb_build_object(
      class_id,
      jsonb_strip_nulls(jsonb_build_object('status', status, 'doneDate', done_date))
    )
    where progress = '{}'::jsonb;

    drop index if exists public.lessons_class_id_idx;
    alter table public.lessons
      drop column class_id,
      drop column status,
      drop column done_date;
  end if;
end $$;

update public.lessons set grade = 'IV' where grade is null or grade = '';
alter table public.lessons alter column grade set not null;
create index if not exists lessons_grade_idx on public.lessons(grade);
