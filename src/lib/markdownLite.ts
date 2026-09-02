// Bardzo prosty parser markdown -> AST, uzywany przez slajdy tekstowe.
// Wspierane skladniki: akapity, listy "- " (nieuporzadkowane) i "1. " (uporzadkowane),
// **pogrubienie** wewnatrz tekstu. Puste linie rozdzielaja bloki.
// Celowo bez dangerouslySetInnerHTML - wynik renderuje komponent RichText.

export interface MdTextNode {
  type: 'text';
  text: string;
}

export interface MdBoldNode {
  type: 'bold';
  text: string;
}

export type MdInline = MdTextNode | MdBoldNode;

export interface MdParagraphBlock {
  type: 'paragraph';
  inline: MdInline[];
}

export interface MdListBlock {
  type: 'list';
  ordered: boolean;
  items: MdInline[][];
}

export type MdBlock = MdParagraphBlock | MdListBlock;

const UNORDERED_RE = /^-\s+(.*)$/;
const ORDERED_RE = /^\d+\.\s+(.*)$/;

/** Rozbija tekst na fragmenty tekstowe i pogrubione wg **...**. */
export function parseInline(text: string): MdInline[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const result: MdInline[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      result.push({ type: 'bold', text: part.slice(2, -2) });
    } else {
      result.push({ type: 'text', text: part });
    }
  }
  return result;
}

function splitIntoBlocks(input: string): string[][] {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }
  if (current.length > 0) blocks.push(current);

  return blocks;
}

/** Parsuje tekst markdown-lite na drzewo blokow (akapity / listy). */
export function parseMarkdownLite(input: string): MdBlock[] {
  const blocks = splitIntoBlocks(input);
  const result: MdBlock[] = [];

  for (const blockLines of blocks) {
    const trimmedLines = blockLines.map((l) => l.trim());
    const allUnordered = trimmedLines.every((l) => UNORDERED_RE.test(l));
    const allOrdered = trimmedLines.every((l) => ORDERED_RE.test(l));

    if (allUnordered) {
      result.push({
        type: 'list',
        ordered: false,
        items: trimmedLines.map((l) => parseInline(l.replace(UNORDERED_RE, '$1'))),
      });
    } else if (allOrdered) {
      result.push({
        type: 'list',
        ordered: true,
        items: trimmedLines.map((l) => parseInline(l.replace(ORDERED_RE, '$1'))),
      });
    } else {
      result.push({
        type: 'paragraph',
        inline: parseInline(trimmedLines.join(' ')),
      });
    }
  }

  return result;
}
