import { DownloadIcon } from '../ui/icons';
import { REMEDIAL_KEY_HREF, REMEDIAL_WORKSHEETS } from '../../data/remedial';

function DownloadLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      aria-label={label}
    >
      <DownloadIcon />
      Pobierz DOCX
    </a>
  );
}

export function RemedialMaterials() {
  return (
    <section aria-labelledby="remedial-heading" className="max-w-4xl">
      <div className="mb-5 max-w-3xl">
        <h2 id="remedial-heading" className="text-lg font-semibold text-gray-900">
          Arkusze na zajęcia wyrównawcze
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Cztery kolejne spotkania wspólne dla wszystkich klas. Każdy arkusz zajmuje jedną kartkę A4 drukowaną dwustronnie i zawiera czytanie ze zrozumieniem, ćwiczenia językowe oraz krótką wypowiedź.
        </p>
      </div>

      <ol className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {REMEDIAL_WORKSHEETS.map((worksheet, index) => (
          <li
            key={worksheet.href}
            className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex min-w-0 gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-sm font-semibold tabular-nums text-accent-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">{worksheet.title}</h3>
                <p className="mt-0.5 text-sm leading-5 text-gray-600">{worksheet.description}</p>
              </div>
            </div>
            <DownloadLink href={worksheet.href} label={`Pobierz arkusz ${index + 1}: ${worksheet.title}`} />
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Klucz odpowiedzi dla nauczyciela</h3>
          <p className="mt-0.5 text-sm leading-5 text-gray-600">
            Odpowiedzi, kryteria do wypowiedzi otwartych i krótka wskazówka do wspólnego omówienia.
          </p>
        </div>
        <DownloadLink href={REMEDIAL_KEY_HREF} label="Pobierz klucz odpowiedzi do arkuszy wyrównawczych" />
      </div>
    </section>
  );
}
