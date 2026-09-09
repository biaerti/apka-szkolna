// Ikonka "do zeszytu" - umowa z klasa: widzisz ikonke = zapisujesz do zeszytu,
// nie ma ikonki = sluchasz. Ta sama ikonka pojawia sie w trzech miejscach, zeby
// umowa byla spojna: na ciemnych slajdach text/task jako bursztynowa plakietka
// (ZeszytBadge), a na jasnych kartkach topic/note jako sama ikonka przy stopce
// (ZeszytIcon) - jasna kartka w liniaturze i tak znaczy "przepisz".
//
// Bursztyn celowo ten sam co tlo notatki (amber) - kolor ma sie dzieciom
// skleic w jedno: bursztynowe = zeszyt.

/** Sam zeszyt w liniature z olowkiem - SVG rysowany w kodzie jak reszta ilustracji (dziala offline). */
export function ZeszytIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* kartka */}
      <rect x="7" y="6" width="30" height="38" rx="3" fill="#fef3c7" stroke="currentColor" strokeWidth="2.5" />
      {/* margines i liniatura */}
      <line x1="13" y1="6" x2="13" y2="44" stroke="#f59e0b" strokeWidth="1.5" />
      <line x1="17" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="32" x2="27" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* olowek pod katem */}
      <g transform="rotate(45 38 30)">
        <rect x="35" y="14" width="6" height="26" rx="1" fill="#fbbf24" stroke="currentColor" strokeWidth="2" />
        <path d="M35 40 L38 47 L41 40 Z" fill="#fef3c7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Plakietka na ciemne slajdy (text/task): ikonka + podpis "do zeszytu". */
export function ZeszytBadge() {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-amber-400/80 bg-amber-400/15 px-5 py-2 text-amber-300">
      <ZeszytIcon className="h-12 w-12" />
      <span className="text-3xl font-semibold">do zeszytu</span>
    </div>
  );
}
