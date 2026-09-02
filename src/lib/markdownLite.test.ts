import { describe, expect, it } from 'vitest';
import { parseInline, parseMarkdownLite } from './markdownLite';

describe('parseInline', () => {
  it('zwraca pojedynczy fragment tekstowy bez formatowania', () => {
    expect(parseInline('zwykly tekst')).toEqual([{ type: 'text', text: 'zwykly tekst' }]);
  });

  it('rozpoznaje pogrubienie', () => {
    expect(parseInline('to jest **wazne** slowo')).toEqual([
      { type: 'text', text: 'to jest ' },
      { type: 'bold', text: 'wazne' },
      { type: 'text', text: ' slowo' },
    ]);
  });

  it('obsluguje kilka pogrubien w jednej linii', () => {
    expect(parseInline('**a** i **b**')).toEqual([
      { type: 'bold', text: 'a' },
      { type: 'text', text: ' i ' },
      { type: 'bold', text: 'b' },
    ]);
  });
});

describe('parseMarkdownLite', () => {
  it('parsuje pojedynczy akapit', () => {
    expect(parseMarkdownLite('To jest akapit.')).toEqual([
      { type: 'paragraph', inline: [{ type: 'text', text: 'To jest akapit.' }] },
    ]);
  });

  it('rozdziela akapity pusta linia', () => {
    const result = parseMarkdownLite('Pierwszy akapit.\n\nDrugi akapit.');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'paragraph', inline: [{ type: 'text', text: 'Pierwszy akapit.' }] });
    expect(result[1]).toEqual({ type: 'paragraph', inline: [{ type: 'text', text: 'Drugi akapit.' }] });
  });

  it('laczy linie akapitu w jedna z odstepem', () => {
    const result = parseMarkdownLite('Linia jeden\nLinia dwa');
    expect(result).toEqual([
      { type: 'paragraph', inline: [{ type: 'text', text: 'Linia jeden Linia dwa' }] },
    ]);
  });

  it('rozpoznaje liste nieuporzadkowana', () => {
    const result = parseMarkdownLite('- pierwszy\n- drugi\n- trzeci');
    expect(result).toEqual([
      {
        type: 'list',
        ordered: false,
        items: [
          [{ type: 'text', text: 'pierwszy' }],
          [{ type: 'text', text: 'drugi' }],
          [{ type: 'text', text: 'trzeci' }],
        ],
      },
    ]);
  });

  it('rozpoznaje liste uporzadkowana', () => {
    const result = parseMarkdownLite('1. pierwszy\n2. drugi');
    expect(result).toEqual([
      {
        type: 'list',
        ordered: true,
        items: [[{ type: 'text', text: 'pierwszy' }], [{ type: 'text', text: 'drugi' }]],
      },
    ]);
  });

  it('obsluguje pogrubienie wewnatrz elementu listy', () => {
    const result = parseMarkdownLite('- to jest **wazne**');
    expect(result).toEqual([
      {
        type: 'list',
        ordered: false,
        items: [[{ type: 'text', text: 'to jest ' }, { type: 'bold', text: 'wazne' }]],
      },
    ]);
  });

  it('rozdziela akapit i liste na osobne bloki', () => {
    const result = parseMarkdownLite('Wstep.\n\n- a\n- b\n\nPodsumowanie.');
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe('paragraph');
    expect(result[1].type).toBe('list');
    expect(result[2].type).toBe('paragraph');
  });

  it('ignoruje wielokrotne puste linie', () => {
    const result = parseMarkdownLite('A.\n\n\n\nB.');
    expect(result).toHaveLength(2);
  });

  it('zwraca pusta tablice dla pustego tekstu', () => {
    expect(parseMarkdownLite('')).toEqual([]);
    expect(parseMarkdownLite('   \n\n  ')).toEqual([]);
  });
});
