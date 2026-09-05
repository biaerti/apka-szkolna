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
import { Procenty } from './Procenty';
import { Samogloski } from './Samogloski';
import { Sylaby } from './Sylaby';
import { Dwuznak } from './Dwuznak';
import { WymianaOu } from './WymianaOu';
import { WymianaRzCh } from './WymianaRzCh';
import { Rzeczownik } from './Rzeczownik';
import { Czasownik } from './Czasownik';
import { Przymiotnik } from './Przymiotnik';
import { RodzajeZdan } from './RodzajeZdan';
import { WielkaLitera } from './WielkaLitera';
import { Przecinek } from './Przecinek';
import { Wiersz } from './Wiersz';
import { Basn } from './Basn';
import { Opowiadanie } from './Opowiadanie';
import { Opis } from './Opis';
import { Zaproszenie } from './Zaproszenie';
import { Alfabet } from './Alfabet';
import { Slownik } from './Slownik';
import { Bliskoznaczne } from './Bliskoznaczne';
import { RodzinaWyrazow } from './RodzinaWyrazow';
import { Zmiekczenia } from './Zmiekczenia';
import { Nosowki } from './Nosowki';
import { ZnakiInterpunkcyjne } from './ZnakiInterpunkcyjne';
import { Dialog } from './Dialog';
import { Zyczenia } from './Zyczenia';
import { KolejnoscZdarzen } from './KolejnoscZdarzen';
import { Przypadki } from './Przypadki';
import { CzasownikOdmiana } from './CzasownikOdmiana';
import { Stopniowanie } from './Stopniowanie';
import { Liczebnik } from './Liczebnik';
import { PodmiotOrzeczenie } from './PodmiotOrzeczenie';
import { ZdanieZlozone } from './ZdanieZlozone';
import { Nieodmienne } from './Nieodmienne';
import { NieZCzesciami } from './NieZCzesciami';
import { SrodkiPoetyckie } from './SrodkiPoetyckie';
import { Strofa } from './Strofa';
import { Narrator } from './Narrator';
import { List } from './List';
import { Ogloszenie } from './Ogloszenie';
import { Wieloznaczne } from './Wieloznaczne';
import { Frazeologizm } from './Frazeologizm';
import { ZdrobnienieZgrubienie } from './ZdrobnienieZgrubienie';
import { NazwyWlasne } from './NazwyWlasne';
import { Skroty } from './Skroty';
import { SwiatPrzedstawiony } from './SwiatPrzedstawiony';
import { Gatunki } from './Gatunki';
import { TeatrFilm } from './TeatrFilm';

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
  procenty: Procenty,
  // Ilustracje przedmiotowe do powtorki 1-3.
  samogloski: Samogloski,
  sylaby: Sylaby,
  dwuznak: Dwuznak,
  wymianaOu: WymianaOu,
  wymianaRzCh: WymianaRzCh,
  rzeczownik: Rzeczownik,
  czasownik: Czasownik,
  przymiotnik: Przymiotnik,
  rodzajeZdan: RodzajeZdan,
  wielkaLitera: WielkaLitera,
  przecinek: Przecinek,
  wiersz: Wiersz,
  basn: Basn,
  opowiadanie: Opowiadanie,
  opis: Opis,
  zaproszenie: Zaproszenie,
  alfabet: Alfabet,
  slownik: Slownik,
  bliskoznaczne: Bliskoznaczne,
  rodzinaWyrazow: RodzinaWyrazow,
  zmiekczenia: Zmiekczenia,
  nosowki: Nosowki,
  znakiInterpunkcyjne: ZnakiInterpunkcyjne,
  dialog: Dialog,
  zyczenia: Zyczenia,
  kolejnoscZdarzen: KolejnoscZdarzen,
  // Ilustracje przedmiotowe do powtorki klasy 4.
  przypadki: Przypadki,
  czasownikOdmiana: CzasownikOdmiana,
  stopniowanie: Stopniowanie,
  liczebnik: Liczebnik,
  podmiotOrzeczenie: PodmiotOrzeczenie,
  zdanieZlozone: ZdanieZlozone,
  nieodmienne: Nieodmienne,
  nieZCzesciami: NieZCzesciami,
  srodkiPoetyckie: SrodkiPoetyckie,
  strofa: Strofa,
  narrator: Narrator,
  list: List,
  ogloszenie: Ogloszenie,
  wieloznaczne: Wieloznaczne,
  frazeologizm: Frazeologizm,
  zdrobnienieZgrubienie: ZdrobnienieZgrubienie,
  nazwyWlasne: NazwyWlasne,
  skroty: Skroty,
  swiatPrzedstawiony: SwiatPrzedstawiony,
  gatunki: Gatunki,
  teatrFilm: TeatrFilm,
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
