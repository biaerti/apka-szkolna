-- Wersja gotowego materialu z kodu, ktora zostala ostatnio wstawiona do lekcji.
-- Apka przy starcie sama odswieza lekcje, gdy kod ma inna wersje
-- (useAutoRefreshMaterials) - bez klikania "Odswiez wstawione materialy".
alter table public.lessons add column if not exists source_version text;
comment on column public.lessons.source_version is 'Wersja gotowego materialu z kodu, ktora zostala ostatnio wstawiona do lekcji - apka odswieza lekcje sama, gdy kod ma inna wersje.';
