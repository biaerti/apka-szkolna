-- Wielkosc liter na ekranach projektora (Settings.slideFontPercent, procent,
-- domyslnie 100). Podbija rozmiary dobierane przez
-- src/components/slides/fitText.ts na slajdach lekcji i w kartkowkach.
-- Patrz src/data/types.ts (Settings), src/data/remote/mappers.ts
-- (settingsToRow/rowToSettings) oraz src/components/slides/useSlideFontScale.ts.
alter table public.settings add column if not exists slide_font_percent integer;
