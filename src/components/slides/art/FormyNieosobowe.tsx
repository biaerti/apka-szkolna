// Schemat trzech nieosobowych form czasownika omawianych w klasie 5.

export function FormyNieosobowe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 420"
      className={className}
      role="img"
      aria-label="Schemat: bezokolicznik, formy na no i to oraz konstrukcje nieosobowe z się nie wskazują wykonawcy"
    >
      <path d="M320 116v48M320 164H105v42M320 164v42M320 164h215v42" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="150" y="24" width="340" height="92" rx="16" fill="#312e81" />
      <text x="320" y="63" textAnchor="middle" fill="#fff" fontSize="25" fontWeight="800">FORMA NIE WSKAZUJE WYKONAWCY</text>
      <text x="320" y="94" textAnchor="middle" fill="#c7d2fe" fontSize="22" fontWeight="700">forma nieosobowa</text>

      <g>
        <rect x="18" y="206" width="174" height="154" rx="16" fill="#fef3c7" />
        <text x="105" y="247" textAnchor="middle" fill="#92400e" fontSize="24" fontWeight="800">BEZOKOLICZNIK</text>
        <text x="105" y="287" textAnchor="middle" fill="#451a03" fontSize="27" fontWeight="800">czytać</text>
        <text x="105" y="323" textAnchor="middle" fill="#451a03" fontSize="27" fontWeight="800">zrobić</text>
      </g>

      <g>
        <rect x="233" y="206" width="174" height="154" rx="16" fill="#dcfce7" />
        <text x="320" y="247" textAnchor="middle" fill="#166534" fontSize="26" fontWeight="800">-NO, -TO</text>
        <text x="320" y="287" textAnchor="middle" fill="#052e16" fontSize="27" fontWeight="800">czytano</text>
        <text x="320" y="323" textAnchor="middle" fill="#052e16" fontSize="27" fontWeight="800">zrobiono</text>
      </g>

      <g>
        <rect x="448" y="206" width="174" height="154" rx="16" fill="#ffe4e6" />
        <text x="535" y="247" textAnchor="middle" fill="#9f1239" fontSize="21" fontWeight="800">NIEOSOBOWE Z „SIĘ”</text>
        <text x="535" y="287" textAnchor="middle" fill="#4c0519" fontSize="25" fontWeight="800">mówi się</text>
        <text x="535" y="323" textAnchor="middle" fill="#4c0519" fontSize="25" fontWeight="800">planuje się</text>
      </g>

      <text x="320" y="402" textAnchor="middle" fill="#e5e7eb" fontSize="23" fontWeight="700">Liczy się czynność, nie jej wykonawca.</text>
    </svg>
  );
}
