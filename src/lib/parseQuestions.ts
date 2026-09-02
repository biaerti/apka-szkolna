// Parser listy pytan z tekstu wklejonego przez nauczyciela.
//
// Jedno pytanie na linie, opcjonalnie w formacie "pytanie | odpowiedz".
// Puste linie sa pomijane.

export interface ParsedQuestion {
  text: string;
  answer?: string;
}

export function parseQuestionsText(input: string): ParsedQuestion[] {
  const lines = input.split(/\r?\n/);
  const result: ParsedQuestion[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sepIdx = line.indexOf('|');
    if (sepIdx === -1) {
      result.push({ text: line });
      continue;
    }

    const text = line.slice(0, sepIdx).trim();
    const answer = line.slice(sepIdx + 1).trim() || undefined;
    if (!text) continue;

    result.push({ text, answer });
  }

  return result;
}
