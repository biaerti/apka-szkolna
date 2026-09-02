// Parser listy uczniow z tekstu wklejonego przez nauczyciela.
//
// Format linii:
//   "1. Nazwisko Imie"
//   "Nazwisko Imie"
//   "1. Nazwisko Imie - uwaga"
//   "Nazwisko-Dwuczlonowe Imie - uwaga"
//
// Numer na poczatku jest opcjonalny. Nazwisko moze byc wieloczlonowe
// (rowniez z myslnikiem), imie to zawsze ostatni wyraz przed uwaga.
// Uwaga (po " - ") jest opcjonalna.

export interface ParsedStudent {
  number?: number;
  lastName: string;
  firstName: string;
  note?: string;
}

const LEADING_NUMBER_RE = /^(\d+)[.)]\s*/;

export function parseStudentsText(input: string): ParsedStudent[] {
  const lines = input.split(/\r?\n/);
  const result: ParsedStudent[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    let rest = line;
    let number: number | undefined;

    const numberMatch = rest.match(LEADING_NUMBER_RE);
    if (numberMatch) {
      number = parseInt(numberMatch[1], 10);
      rest = rest.slice(numberMatch[0].length).trim();
    }

    let note: string | undefined;
    const noteSplitIdx = rest.indexOf(' - ');
    if (noteSplitIdx !== -1) {
      note = rest.slice(noteSplitIdx + 3).trim() || undefined;
      rest = rest.slice(0, noteSplitIdx).trim();
    }

    if (!rest) continue;

    const words = rest.split(/\s+/);
    if (words.length < 2) {
      // Brak wyraznego podzialu na nazwisko/imie - traktujemy cala fraze jako nazwisko.
      result.push({ number, lastName: words[0] ?? '', firstName: '', note });
      continue;
    }

    const firstName = words[words.length - 1];
    const lastName = words.slice(0, -1).join(' ');

    result.push({ number, lastName, firstName, note });
  }

  return result;
}
