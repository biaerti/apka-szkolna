-- Dzial (grupa) lekcji do naglowka na liscie ("Powtorka 1-3", "Powtorka klasy 4")
-- oraz zestaw pytan POWTORKOWY tej lekcji (lustrzane odbicie zestawu wstepnego,
-- odpytywane na kole na poczatku NASTEPNEJ lekcji). Patrz src/data/types.ts (Lesson).
alter table public.lessons add column if not exists dzial text;
alter table public.lessons add column if not exists review_question_set_id text references public.question_sets(id) on delete set null;
