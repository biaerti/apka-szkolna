-- Roczne spisy lektur dla rocznikow IV i V. Dane sa czescia ustawien,
-- bo to jedna niewielka konfiguracja nauczyciela, a nie osobny rejestr zdarzen.
alter table public.settings add column if not exists reading_plans jsonb;
