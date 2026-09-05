import { ReactNode } from 'react';

export function Table({ children, fixed = false }: { children: ReactNode; fixed?: boolean }) {
  // `fixed` = kolumny biora szerokosc z naglowkow (w-*), a nie z tresci - dzieki
  // temu dlugi tekst w komorce da sie uciac (truncate) zamiast rozpychac tabele.
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className={`min-w-full divide-y divide-gray-200 text-sm ${fixed ? 'w-full table-fixed' : ''}`}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
}

export function TR({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

export function TH({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${className ?? ''}`}>
      {children}
    </th>
  );
}

export function TD({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 text-gray-800 ${className ?? ''}`}>{children}</td>;
}
