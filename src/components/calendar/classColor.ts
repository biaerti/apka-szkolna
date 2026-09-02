// Deterministyczny kolor odznaki klasy na podstawie jej `order` - dzieki temu
// kolor jest stabilny niezaleznie od kolejnosci renderowania.

const PALETTE = [
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-lime-100 text-lime-800 border-lime-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
];

export function classBadgeClasses(order: number): string {
  const idx = ((order % PALETTE.length) + PALETTE.length) % PALETTE.length;
  return PALETTE[idx];
}
