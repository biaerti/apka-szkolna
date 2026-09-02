// Renderuje AST z markdownLite bez dangerouslySetInnerHTML.

import type { MdBlock, MdInline } from '../../lib/markdownLite';
import { parseMarkdownLite } from '../../lib/markdownLite';

function InlineNodes({ nodes }: { nodes: MdInline[] }) {
  return (
    <>
      {nodes.map((node, i) =>
        node.type === 'bold' ? <strong key={i}>{node.text}</strong> : <span key={i}>{node.text}</span>,
      )}
    </>
  );
}

function Block({ block }: { block: MdBlock }) {
  if (block.type === 'paragraph') {
    return (
      <p>
        <InlineNodes nodes={block.inline} />
      </p>
    );
  }

  const ListTag = block.ordered ? 'ol' : 'ul';
  return (
    <ListTag className={block.ordered ? 'list-decimal pl-8' : 'list-disc pl-8'}>
      {block.items.map((item, i) => (
        <li key={i}>
          <InlineNodes nodes={item} />
        </li>
      ))}
    </ListTag>
  );
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = parseMarkdownLite(text);
  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
