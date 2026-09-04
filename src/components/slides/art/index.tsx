// Rejestr ilustracji SVG dla slajdow: klucz SlideArt -> komponent.
// SlideArtView renderuje wybrana ilustracje albo nic - nieznany/brakujacy
// klucz nie moze wywalic prezentacji (patrz uwaga w src/data/types.ts).

import type { ComponentType } from 'react';
import type { SlideArt } from '../../../data/types';
import { Gra } from './Gra';
import { Kolo } from './Kolo';
import { Oceny } from './Oceny';
import { Stopnie } from './Stopnie';
import { Eskalacja } from './Eskalacja';
import { Pas } from './Pas';
import { Zadania } from './Zadania';
import { Lawki } from './Lawki';
import { Przebieg } from './Przebieg';
import { Zeszyt } from './Zeszyt';

type ArtComponent = ComponentType<{ className?: string }>;

const ART_REGISTRY: Record<SlideArt, ArtComponent> = {
  gra: Gra,
  kolo: Kolo,
  oceny: Oceny,
  stopnie: Stopnie,
  eskalacja: Eskalacja,
  pas: Pas,
  zadania: Zadania,
  lawki: Lawki,
  przebieg: Przebieg,
  zeszyt: Zeszyt,
};

/** Ilustracje o bardzo szerokim ukladzie - lepiej wygladaja pod tekstem na cala szerokosc niz obok. */
export const WIDE_ART: ReadonlySet<SlideArt> = new Set(['przebieg']);

export function SlideArtView({ art, className }: { art?: SlideArt; className?: string }) {
  if (!art) return null;
  // Rzutowanie na czesciowy rekord, bo dane moglyby (teoretycznie) zawierac
  // klucz spoza aktualnego typu SlideArt - wtedy po prostu nic nie renderujemy,
  // zamiast wywalac cala prezentacje.
  const ArtComponent = (ART_REGISTRY as Partial<Record<string, ArtComponent>>)[art];
  if (!ArtComponent) return null;
  return <ArtComponent className={className} />;
}
