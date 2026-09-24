-- Bucket czytanek trzyma teraz tez czasy slow (<id>.json z synchronizuj.py -
-- zawiera caly tekst, wiec tez prywatnie) i skany ramek z podrecznika do slajdow.
update storage.buckets
set allowed_mime_types = array['audio/mpeg', 'application/json', 'image/webp', 'image/png', 'image/jpeg']
where id = 'czytanki';
