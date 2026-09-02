import { describe, expect, it } from 'vitest';
import { parseQuestionsText } from './parseQuestions';

describe('parseQuestionsText', () => {
  it('parsuje pytanie bez odpowiedzi', () => {
    const result = parseQuestionsText('Jaka jest stolica Polski?');
    expect(result).toEqual([{ text: 'Jaka jest stolica Polski?', answer: undefined }]);
  });

  it('parsuje pytanie z odpowiedzia oddzielona pipe', () => {
    const result = parseQuestionsText('Jaka jest stolica Polski? | Warszawa');
    expect(result).toEqual([{ text: 'Jaka jest stolica Polski?', answer: 'Warszawa' }]);
  });

  it('pomija puste linie', () => {
    const result = parseQuestionsText('Pytanie 1\n\n\nPytanie 2 | Odpowiedz 2\n');
    expect(result).toHaveLength(2);
  });

  it('trymuje biale znaki wokol tekstu i odpowiedzi', () => {
    const result = parseQuestionsText('  Pytanie   |   Odpowiedz  ');
    expect(result).toEqual([{ text: 'Pytanie', answer: 'Odpowiedz' }]);
  });

  it('pomija linie z pustym pytaniem przed separatorem', () => {
    const result = parseQuestionsText(' | Odpowiedz bez pytania');
    expect(result).toHaveLength(0);
  });

  it('traktuje brakujaca odpowiedz po pipe jako undefined', () => {
    const result = parseQuestionsText('Pytanie |   ');
    expect(result).toEqual([{ text: 'Pytanie', answer: undefined }]);
  });
});
