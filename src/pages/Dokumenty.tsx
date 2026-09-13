// Zakladka Dokumenty - lista rzeczy do wydruku albo wyslania jako PDF:
// zasady lekcji dla dzieci (osobny uklad z kolem, src/pages/RulesPrint.tsx)
// i dokumenty "urzedowe" z src/data/dokumenty.ts (PSO, plan rozwoju).
// Celowo sama lista bez podgladu - klik otwiera gotowy uklad A4.

import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DOKUMENTY } from '../data/dokumenty';

interface DocLink {
  to: string;
  title: string;
  description: string;
}

const LINKS: DocLink[] = [
  {
    to: '/zasady/druk',
    title: 'Zasady naszych lekcji',
    description: 'Dla uczniów: dwie kopie na kartce A4 do przecięcia i osobna strona z rysunkiem koła.',
  },
  ...DOKUMENTY.map((d) => ({ to: `/dokumenty/${d.slug}`, title: d.title, description: d.description })),
];

export function Dokumenty() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Dokumenty"
        description="Gotowe do druku. Żeby wysłać mailem, w oknie drukowania wybierz „Zapisz jako PDF”."
      />
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {LINKS.map((doc) => (
          <li key={doc.to}>
            <Link to={doc.to} className="block px-5 py-4 hover:bg-gray-50">
              <p className="text-base font-medium text-gray-900">{doc.title}</p>
              <p className="mt-0.5 text-sm text-gray-500">{doc.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
