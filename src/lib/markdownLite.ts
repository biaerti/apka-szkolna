// Bardzo prosty parser markdown -> AST, uzywany przez slajdy tekstowe i skrypt
// zebrania. Wspierane skladniki: naglowki "## " / "### ", akapity, listy "- "
// (nieuporzadkowane) i "1. " (uporzadkowane), **pogrubienie** wewnatrz tekstu.
// Puste linie rozdzielaja bloki, naglowek jest zawsze osobnym blokiem.
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

export interface MdHeadingBlock {
  type: 'heading';
  level: 2 | 3;
  inline: MdInline[];
}

export interface MdListBlock {
  type: 'list';
  ordered: boolean;
  items: MdInline[][];
}

export type MdBlock = MdHeadingBlock | MdParagraphBlock | MdListBlock;

const HEADING_RE = /^(#{2,3})\s+(.*)$/;
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
    // Naglowek nie sklei sie z sasiednimi liniami - konczy poprzedni blok
    // i sam jest calym blokiem, nawet bez pustej linii dookola.
    if (HEADING_RE.test(line.trim())) {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
      blocks.push([line]);
      continue;
    }
    current.push(line);
  }
  if (current.length > 0) blocks.push(current);

  return blocks;
}

/**
 * Dzieli blok (bez pustych linii) na kawalki: kolejne pozycje listy tego samego
 * rodzaju tworza liste, a zwykle linie miedzy nimi - akapit (sasiednie zwykle
 * linie sklejaja sie spacja). Dzieki temu notatka "Temat / 1. 2. / tytul /
 * - a - b" nie zlewa sie w jeden akapit, gdy po liscie idzie dalszy tekst.
 */
function segmentBlock(lines: string[]): MdBlock[] {
  const result: MdBlock[] = [];
  let plain: string[] = [];
  let list: MdListBlock | undefined;
  const flushPlain = () => {
    if (plain.length > 0) result.push({ type: 'paragraph', inline: parseInline(plain.join(' ')) });
    plain = [];
  };
  const flushList = () => {
    if (list) result.push(list);
    list = undefined;
  };
  for (const line of lines) {
    const unordered = UNORDERED_RE.exec(line);
    const ordered = unordered ? null : ORDERED_RE.exec(line);
    const item = unordered ?? ordered;
    if (!item) {
      flushList();
      plain.push(line);
      continue;
    }
    flushPlain();
    const isOrdered = !unordered;
    if (list && list.ordered !== isOrdered) flushList();
    if (!list) list = { type: 'list', ordered: isOrdered, items: [] };
    list.items.push(parseInline(item[1]));
  }
  flushPlain();
  flushList();
  return result;
}

/** Parsuje tekst markdown-lite na drzewo blokow (akapity / listy). */
export function parseMarkdownLite(input: string): MdBlock[] {
  const blocks = splitIntoBlocks(input);
  const result: MdBlock[] = [];

  for (const blockLines of blocks) {
    const trimmedLines = blockLines.map((l) => l.trim());

    const heading = trimmedLines.length === 1 ? HEADING_RE.exec(trimmedLines[0]) : null;
    if (heading) {
      result.push({
        type: 'heading',
        level: heading[1].length === 2 ? 2 : 3,
        inline: parseInline(heading[2]),
      });
      continue;
    }

    result.push(...segmentBlock(trimmedLines));
  }

  return result;
}
