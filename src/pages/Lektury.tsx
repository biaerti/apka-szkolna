import { PageHeader } from '../components/ui/PageHeader';
import {
  LEKTURY_OBOWIAZKOWE,
  LEKTURY_KROTKIE,
  LEKTURY_KROTKIE_PRZYPIS,
  LEKTURY_UZUPELNIAJACE,
  LEKTURY_UZUPELNIAJACE_ZASADA,
  LEKTURY_ZRODLO,
  Lektura,
} from '../data/lektury';

function LekturaLista({ lektury }: { lektury: Lektura[] }) {
  return (
    <ul className="space-y-1.5">
      {lektury.map((l, i) => (
        <li key={i} className="text-sm text-gray-700">
          {l.autor && <span className="text-gray-500">{l.autor}, </span>}
          <span className="font-medium">{l.tytul}</span>
        </li>
      ))}
    </ul>
  );
}

export function Lektury() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Lektury"
        description="Klasy IV-VI - lista z podstawy programowej po zmianach z 2024 r."
      />

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Lektury obowiązkowe</h2>
        <p className="mb-3 text-sm text-gray-500">Pozycje książkowe poznawane w całości.</p>
        <LekturaLista lektury={LEKTURY_OBOWIAZKOWE} />
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">
          Krótkie utwory, fragmenty i poezja
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Krótkie utwory literackie poznawane w całości, utwory poznawane we fragmentach i utwory
          poetyckie.
        </p>
        <LekturaLista lektury={LEKTURY_KROTKIE} />
        <p className="mt-3 text-xs text-gray-400">{LEKTURY_KROTKIE_PRZYPIS}</p>
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Lektury uzupełniające</h2>
        <p className="mb-3 text-sm text-gray-500">
          Od 2024 r. jedna wspólna lista przykładowa dla klas IV-VIII. {LEKTURY_UZUPELNIAJACE_ZASADA}
        </p>
        <LekturaLista lektury={LEKTURY_UZUPELNIAJACE} />
      </section>

      <p className="text-xs text-gray-400">Źródło: {LEKTURY_ZRODLO}</p>
    </div>
  );
}
