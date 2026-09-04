// Rysunek kola fortuny do wydruku (druga strona /zasady/druk) - czysty inline
// SVG, bez plikow graficznych i bez bibliotek (offline, Chrome 109 / Win7).
// Sektory rozne nie tylko kolorem, ale tez jasnoscia i kreskowaniem (kratka),
// zeby dalo sie je odroznic po wydruku w skali szarosci na drukarce czarno-bialej.
//
// Klasa "print-color" na wrapperze wylacza globalny reset kolorow z
// @media print w src/index.css (patrz tamtejszy komentarz) - dzieki temu
// rysunek zostaje kolorowy (i czytelny) na wydruku.

interface SectorSpec {
  label: string;
  shade: 'jasny' | 'ciemny' | 'wylosowany';
}

// 14 sektorow - przykladowe imiona, nie prawdziwi uczniowie. "Bartek"
// wystepuje dwa razy - to przyklad ucznia z trzema uwagami (podwojne wejscie).
const SECTORS: SectorSpec[] = [
  { label: 'Zosia', shade: 'jasny' },
  { label: 'Tomek', shade: 'ciemny' },
  { label: 'Kasia', shade: 'wylosowany' },
  { label: 'Igor', shade: 'jasny' },
  { label: 'Bartek', shade: 'ciemny' },
  { label: 'Uczeń', shade: 'jasny' },
  { label: 'Ola', shade: 'ciemny' },
  { label: 'Uczeń', shade: 'jasny' },
  { label: 'Bartek', shade: 'ciemny' },
  { label: 'Uczeń', shade: 'jasny' },
  { label: 'Julia', shade: 'ciemny' },
  { label: 'Uczeń', shade: 'jasny' },
  { label: 'Marcel', shade: 'ciemny' },
  { label: 'Uczeń', shade: 'jasny' },
];

const FILL: Record<SectorSpec['shade'], string> = {
  jasny: '#fde68a',
  ciemny: '#93c5fd',
  wylosowany: '#f97316',
};

const CX = 320;
const CY = 350;
const R = 235;

/** Zamienia kat (0 stopni = gora, zgodnie z ruchem wskazowek zegara) na wspolrzedne. */
function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

/** Sciezka wycinka kola (jednego sektora) od kata start do end. */
function sectorPath(startDeg: number, endDeg: number, radius: number): string {
  const start = polar(startDeg, radius);
  const end = polar(endDeg, radius);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${CX},${CY} L ${start.x.toFixed(2)},${start.y.toFixed(2)} A ${radius},${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)},${end.y.toFixed(2)} Z`;
}

/** Maly znacznik z numerem (odsylacz do legendy pod rysunkiem). */
function Badge({ angle, radius, n }: { angle: number; radius: number; n: number }) {
  const p = polar(angle, radius);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="15" fill="#111827" stroke="#ffffff" strokeWidth="2" />
      <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="16" fontWeight={700} fill="#ffffff">
        {n}
      </text>
    </g>
  );
}

export function WheelDiagram() {
  const n = SECTORS.length;
  const step = 360 / n;
  const bartekIndexes = SECTORS.map((s, i) => (s.label === 'Bartek' ? i : -1)).filter((i) => i >= 0);

  return (
    <div className="print-color mx-auto w-full max-w-[175mm]">
      <svg viewBox="0 0 640 700" className="h-auto w-full" role="img" aria-label="Schemat kola fortuny z zaznaczonym wskaznikiem i wylosowanym sektorem">
        <defs>
          <pattern id="wheelHatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#1e3a5f" strokeWidth="1.6" />
          </pattern>
        </defs>

        {/* wskaznik u gory kola */}
        <line x1={CX} y1="18" x2={CX} y2="60" stroke="#111827" strokeWidth="4" />
        <polygon points={`${CX - 18},58 ${CX + 18},58 ${CX},94`} fill="#111827" />

        {/* sektory */}
        {SECTORS.map((sector, i) => {
          const startDeg = i * step;
          const endDeg = startDeg + step;
          const midDeg = startDeg + step / 2;
          const labelPos = polar(midDeg, R * 0.66);
          const isWinner = sector.shade === 'wylosowany';
          return (
            <g key={i}>
              <path d={sectorPath(startDeg, endDeg, R)} fill={FILL[sector.shade]} stroke="#111827" strokeWidth={isWinner ? 5 : 1.3} />
              {sector.shade === 'ciemny' && <path d={sectorPath(startDeg, endDeg, R)} fill="url(#wheelHatch)" opacity={0.55} />}
              <text
                x={labelPos.x}
                y={labelPos.y}
                fontSize="15"
                fontWeight={isWinner ? 700 : 500}
                fill="#111827"
                textAnchor="middle"
                transform={`rotate(${midDeg}, ${labelPos.x}, ${labelPos.y})`}
              >
                {sector.label}
              </text>
            </g>
          );
        })}

        {/* obrys i piasta kola */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#111827" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="13" fill="#111827" />

        {/* znaczniki do legendy - "1" przesuniety w bok, zeby nie zaslaniac wskaznika */}
        <Badge angle={-20} radius={R + 40} n={1} />
        <Badge angle={(SECTORS.findIndex((s) => s.shade === 'wylosowany') + 0.5) * step} radius={R + 24} n={2} />
        {bartekIndexes.map((i) => (
          <Badge key={i} angle={(i + 0.5) * step} radius={R + 24} n={3} />
        ))}
      </svg>

      <ol className="mt-3 space-y-1.5 text-[13px] leading-snug text-gray-800">
        <li className="flex gap-2">
          <span className="font-bold">1.</span>
          <span>Wskaźnik u góry pokazuje, przy kim koło się zatrzyma.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold">2.</span>
          <span>Pomarańczowy, wyróżniony sektor to przykład wyniku losowania - tu koło się zatrzymało, ta osoba odpowiada.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold">3.</span>
          <span>Uczeń z trzema uwagami ma na kole dwa sektory ze swoim imieniem (tu: Bartek) - większa szansa na wylosowanie.</span>
        </li>
      </ol>
    </div>
  );
}
