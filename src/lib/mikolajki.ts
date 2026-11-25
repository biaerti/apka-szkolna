// Losowanie mikolajkowe: kazdy daje prezent jednej osobie i od jednej dostaje.
// Ukladamy wszystkich w jedno losowe kolko (A -> B -> C -> ... -> A), wiec
// nikt nie wylosuje siebie i nie ma par "ja tobie, ty mnie" (od 3 osob).

export interface ParaMikolajkowa {
  kto: string; // id ucznia, ktory przygotowuje prezent
  komu: string; // id ucznia, ktory go dostaje
}

export function losujMikolajki(ids: string[], rng: () => number = Math.random): ParaMikolajkowa[] {
  const kolko = [...new Set(ids)];
  if (kolko.length < 2) return [];
  for (let i = kolko.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [kolko[i], kolko[j]] = [kolko[j], kolko[i]];
  }
  return kolko.map((kto, i) => ({ kto, komu: kolko[(i + 1) % kolko.length] }));
}
