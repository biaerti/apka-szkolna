import { getSupabase, isSupabaseConfigured } from './supabase';

/** Dawny dzial lekcji z arkuszami - teraz wyrownawcze to osobny tok, nie dzial rocznika. */
export const REMEDIAL_SECTION = 'Wyrównawcze';

/**
 * Arkusze z tools/build_worksheets.py: DOCX (A4, druk dwustronny) i PDF A5 - obie strony
 * arkusza obok siebie na jednej stronie A4 (poziomo), druk jednostronny.
 */
export const REMEDIAL_WORKSHEETS = [
  {
    title: 'Kiermasz dobrych pomysłów',
    description: 'Kolejność wydarzeń, rzeczownik, zdanie i krótka wiadomość.',
    href: '/materialy/wyrownawcze/arkusz-1-kiermasz-dobrych-pomyslow.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-1-kiermasz-dobrych-pomyslow-A5.pdf',
  },
  {
    title: 'Klucz z numerem siedem',
    description: 'Wnioskowanie, części mowy, ortografia i opis przedmiotu.',
    href: '/materialy/wyrownawcze/arkusz-2-klucz-z-numerem-siedem.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-2-klucz-z-numerem-siedem-A5.pdf',
  },
  {
    title: 'Sen pomaga się uczyć',
    description: 'Tekst informacyjny, przyczyna i skutek, fakt i opinia oraz notatka.',
    href: '/materialy/wyrownawcze/arkusz-3-sen-pomaga-sie-uczyc.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-3-sen-pomaga-sie-uczyc-A5.pdf',
  },
  {
    title: 'Droga do starego dębu',
    description: 'Instrukcja, plan działania, kierunki, przymiotnik i opis trasy.',
    href: '/materialy/wyrownawcze/arkusz-4-droga-do-starego-debu.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-4-droga-do-starego-debu-A5.pdf',
  },
  {
    title: 'Drugie miejsce',
    description: 'Uczucia i intencje bohaterów nazwane nie wprost, odmiana rzeczownika, przecinki, dialog.',
    href: '/materialy/wyrownawcze/arkusz-5-drugie-miejsce.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-5-drugie-miejsce-A5.pdf',
    levelUp: true,
  },
  {
    title: 'Dwie drogi do Afryki',
    description: 'Tekst popularnonaukowy, porównanie w tabeli, łączenie informacji z akapitów, przymiotniki.',
    href: '/materialy/wyrownawcze/arkusz-6-dwie-drogi-do-afryki.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-6-dwie-drogi-do-afryki-A5.pdf',
    levelUp: true,
  },
  {
    title: 'Ktoś nowy w domu',
    description: 'Kto opowiada? Wnioskowanie z narracji, osoba i czas czasownika, ę czy ą.',
    href: '/materialy/wyrownawcze/arkusz-7-ktos-nowy-w-domu.docx',
    a5Href: '/materialy/wyrownawcze/arkusz-7-ktos-nowy-w-domu-A5.pdf',
    levelUp: true,
  },
] as const;

export const REMEDIAL_KEY_HREF = '/materialy/wyrownawcze/klucz-odpowiedzi-arkusze-wyrownawcze.docx';

/**
 * Zeszyt "Moj polski od zera" dla uczniow, ktorzy dopiero ucza sie polskiego
 * (polecenia po rosyjsku). Zrodlo: karty-pracy/polski-od-zera/, PDF-y leza w
 * prywatnym buckecie "materialy" (wrzuca je karty-pracy/polski-od-zera/wyslij.py).
 */
export const POLSKI_OD_ZERA = [
  { czesc: 1, tematy: 'Litery, powitania, klasa, liczby i kolory, rodzina' },
  { czesc: 2, tematy: 'Dni tygodnia, jedzenie, ciało, dom, mój dzień' },
  { czesc: 3, tematy: 'Pogoda, ubrania, zwierzęta, miasto, czas wolny, Kto? Co? Jaki?' },
  { czesc: 4, tematy: 'Godziny, wczoraj i jutro, zakupy, opis osoby, uczucia' },
] as const;

export type PolskiOdZeraWersja = 'A4' | 'A5';

/** Podpisany adres jednej czesci zeszytu z prywatnego bucketu. */
export async function polskiOdZeraUrl(czesc: number, wersja: PolskiOdZeraWersja): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Plik jest w chmurze - zaloguj się.');
  const { data, error } = await getSupabase()
    .storage.from('materialy')
    .createSignedUrl(`polski-od-zera-czesc-${czesc}-${wersja}.pdf`, 60 * 60);
  if (error || !data) throw new Error('Brak pliku w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}
