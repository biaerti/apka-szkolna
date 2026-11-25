// Konto ucznia w portalu (/uczen): login z kartki + haslo, bez imienia i nazwiska.
// Zapamietane w przegladarce, zeby nie logowac sie przy kazdym wejsciu.
// Stare konta z /dyktando (klucz "dyktando-uczen": id + haslo) przechodza same.

import type { Jezyk } from '../../data/dyktanda';

export interface KontoUcznia {
  id: string;
  haslo: string;
  login: string;
  jezyk: Jezyk;
  /** Ma kurs "Polski krok po kroku" (uczniowie z innym jezykiem ojczystym). */
  polski: boolean;
  klasa: string | null;
}

const KLUCZ = 'portal-uczen';
const STARY_KLUCZ = 'dyktando-uczen';

export function wczytajKonto(): KontoUcznia | null {
  try {
    const raw = localStorage.getItem(KLUCZ);
    if (raw) return JSON.parse(raw) as KontoUcznia;
    const stary = localStorage.getItem(STARY_KLUCZ);
    if (stary) {
      const s = JSON.parse(stary) as { id: string; haslo: string; jezyk?: Jezyk };
      return { id: s.id, haslo: s.haslo, login: '', jezyk: s.jezyk ?? 'ua', polski: true, klasa: null };
    }
  } catch {
    // zepsuty wpis - logowanie od nowa
  }
  return null;
}

export function zapiszKonto(k: KontoUcznia): void {
  localStorage.setItem(KLUCZ, JSON.stringify(k));
  localStorage.removeItem(STARY_KLUCZ);
}

export function usunKonto(): void {
  localStorage.removeItem(KLUCZ);
  localStorage.removeItem(STARY_KLUCZ);
}

export interface WynikUcznia {
  lekcja: string;
  punkty: number;
  maks: number;
  created_at: string;
}
