// Wydruk dokumentu z src/data/dokumenty.ts - poza AppShell (jak RulesPrint),
// uklad A4. Jeden renderer dla wszystkich dokumentow; PSO ma sie zmiescic na
// jednej stronie, plan rozwoju moze isc na dwie (tabele nie lamia sie w srodku
// wiersza - break-inside-avoid).

import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DocBlock, findDokument } from '../data/dokumenty';

function Block({ block }: { block: DocBlock }) {
  if (block.type === 'p') {
    return <p className="mb-1.5 text-[11.5px] leading-[1.35] text-gray-800">{block.text}</p>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="mb-1.5 space-y-0.5">
        {block.items.map((item) => (
          <li key={item} className="flex gap-1.5 text-[11.5px] leading-[1.35] text-gray-800">
            <span aria-hidden="true">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <table className="mb-2 w-full border-collapse text-[10.5px] leading-[1.3] text-gray-800">
      {block.head && (
        <thead>
          <tr>
            {block.head.map((cell, i) => (
              <th
                key={i}
                className="border border-gray-400 bg-gray-100 px-1.5 py-0.5 text-left font-semibold"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {block.rows.map((row, r) => (
          <tr key={r} className="break-inside-avoid align-top">
            {row.map((cell, c) => (
              <td
                key={c}
                className={
                  'border border-gray-400 px-1.5 py-0.5' +
                  // Pierwsza kolumna to etykieta wiersza - pogrubiona, zeby dalo
                  // sie skanowac tabele wzrokiem bez czytania kazdej komorki.
                  (c === 0 ? ' font-semibold' : '')
                }
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DocPrint() {
  const { slug } = useParams<{ slug: string }>();
  const doc = findDokument(slug);

  if (!doc) {
    return (
      <div className="p-8 text-sm text-gray-600">
        Nie ma takiego dokumentu.{' '}
        <Link to="/dokumenty" className="text-accent-700 underline">
          Wróć do listy
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <Link to="/dokumenty" className="text-sm text-accent-700 hover:underline">
            Dokumenty
          </Link>
          <p className="text-xs text-gray-500">
            Żeby wysłać mailem: Drukuj, a w oknie drukowania „Zapisz jako PDF”.
          </p>
        </div>
        <Button onClick={() => window.print()}>Drukuj</Button>
      </div>

      <article className="mx-auto box-border w-[210mm] bg-white p-[12mm] text-gray-900 shadow-lg print:w-auto print:p-0 print:shadow-none">
        <header className="mb-2.5 border-b border-gray-900 pb-1.5">
          <h1 className="text-[18px] font-bold leading-tight">{doc.printTitle}</h1>
          <p className="mt-0.5 text-[11px] text-gray-600">{doc.subtitle}</p>
        </header>

        {doc.sections.map((section) => (
          <section key={section.title} className="mb-2">
            <h2 className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-700">
              {section.title}
            </h2>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}

        {doc.signatures && (
          <div className="mt-8 flex justify-between gap-6 break-inside-avoid">
            {doc.signatures.map((label) => (
              <div key={label} className="flex-1 border-t border-gray-500 pt-1 text-center text-[9px] text-gray-600">
                {label}
              </div>
            ))}
          </div>
        )}
        {doc.footer && <p className="mt-3 text-[9px] text-gray-500">{doc.footer}</p>}
      </article>
    </div>
  );
}
