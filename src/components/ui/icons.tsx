// Ikony rysowane w SVG (bez emoji i znakow unicode - jedna kreska, jedna waga).
// Malo ich celowo: uchwyt przeciagania i "wiecej" wystarcza na liscie lekcji.

export function GripIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" className={className} fill="currentColor">
      <circle cx={5.5} cy={3.5} r={1.4} />
      <circle cx={10.5} cy={3.5} r={1.4} />
      <circle cx={5.5} cy={8} r={1.4} />
      <circle cx={10.5} cy={8} r={1.4} />
      <circle cx={5.5} cy={12.5} r={1.4} />
      <circle cx={10.5} cy={12.5} r={1.4} />
    </svg>
  );
}

export function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" className={className} fill="currentColor">
      <circle cx={3} cy={8} r={1.6} />
      <circle cx={8} cy={8} r={1.6} />
      <circle cx={13} cy={8} r={1.6} />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6.5 8 10.5l4-4" />
    </svg>
  );
}
