// WAZNE INFO - punkty dla rodzicow do wyslania na WhatsAppie.
//
// Sklad pracy: wazny mail (ze szkoly albo z dziennika) nauczyciel przesyla na
// szkola@klippi.pl. "Sprawdź skrzynkę" czyta skrzynke i model wyciaga z maili
// punkty (tytul, tresc, termin, linki). Tu sie one gromadza; raz na kilka dni
// nauczyciel zaznacza kilka, apka sklada z nich jedna wiadomosc, on ja kopiuje
// do WhatsAppa i odhacza jako wyslane. Termin pilnuje, zeby nic nie poszlo po
// czasie (pasek na pulpicie + odznaka w menu, patrz useWazneInfoAlarm).

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import {
  createPaczka,
  deleteWazneInfo,
  insertWazneInfo,
  pullFromMail,
  updateWazneInfo,
  useWazneInfo,
} from '../data/wazneInfo';
import { buildPaczkaText, dniDoTerminu, formatTermin, type WazneInfo, type WazneInfoPunkt } from '../lib/wazneInfoExtract';
import { copyToClipboard } from '../lib/clipboard';
import { isSupabaseConfigured } from '../data/supabase';
import { toDateKey } from '../lib/dates';

export const SKRZYNKA = 'szkola@klippi.pl';

export function WazneInfoPage() {
  const { punkty, paczki, loading, error, reload } = useWazneInfo();
  const [zaznaczone, setZaznaczone] = useState<Set<string>>(new Set());
  const [sprawdzam, setSprawdzam] = useState(false);
  const [komunikat, setKomunikat] = useState<string | null>(null);
  const [blad, setBlad] = useState<string | null>(null);
  const [edytowany, setEdytowany] = useState<WazneInfo | 'nowy' | null>(null);
  const [pokazWyslane, setPokazWyslane] = useState(false);
  const [pokazPominiete, setPokazPominiete] = useState(false);

  const dzisiaj = toDateKey(new Date());
  const nowe = useMemo(() => punkty.filter((p) => p.status === 'nowe'), [punkty]);
  const wyslane = useMemo(() => punkty.filter((p) => p.status === 'wyslane'), [punkty]);
  const pominiete = useMemo(() => punkty.filter((p) => p.status === 'pominiete'), [punkty]);

  // Zaznaczenie znika, gdy punkt przestal byc "nowy" (ktos wyslal go z telefonu).
  useEffect(() => {
    setZaznaczone((prev) => {
      const ids = new Set(nowe.map((p) => p.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [nowe]);

  async function wykonaj(akcja: () => Promise<void>) {
    setBlad(null);
    try {
      await akcja();
      await reload();
    } catch (err) {
      setBlad(err instanceof Error ? err.message : 'Nieznany błąd');
    }
  }

  async function sprawdzSkrzynke() {
    setSprawdzam(true);
    setKomunikat(null);
    await wykonaj(async () => {
      const w = await pullFromMail();
      setKomunikat(
        w.przerobione === 0
          ? `Nic nowego (w skrzynce: ${w.wSkrzynce}).`
          : `Nowe maile: ${w.przerobione}, dodane punkty: ${w.punkty}.`,
      );
    });
    setSprawdzam(false);
  }

  // Wejscie do zakladki samo sprawdza skrzynke - Bartek nie ma pamietac o
  // przycisku, ma tylko przeslac mail. Przycisk zostaje do ponowienia.
  useEffect(() => {
    if (isSupabaseConfigured()) void sprawdzSkrzynke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function przelacz(id: string) {
    setZaznaczone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="pb-64">
      <PageHeader
        title="Ważne info"
        description={`Prześlij ważny mail na ${SKRZYNKA} - punkty pojawią się tutaj. Zaznacz kilka, skopiuj paczkę na WhatsAppa i odhacz.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setEdytowany('nowy')}>
              Dodaj punkt
            </Button>
            <Button onClick={() => void sprawdzSkrzynke()} disabled={sprawdzam}>
              {sprawdzam ? 'Sprawdzam...' : 'Sprawdź skrzynkę'}
            </Button>
          </>
        }
      />

      {(komunikat || blad || error) && (
        <p className={clsx('mb-4 text-sm', blad || error ? 'text-red-600' : 'text-gray-600')}>{blad ?? error ?? komunikat}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Wczytywanie...</p>
      ) : nowe.length === 0 ? (
        <EmptyState
          title="Nic do wysłania"
          description={`Prześlij mail na ${SKRZYNKA} i kliknij "Sprawdź skrzynkę" albo dodaj punkt ręcznie.`}
        />
      ) : (
        <div className="space-y-2">
          {nowe.map((p) => (
            <PunktCard
              key={p.id}
              punkt={p}
              dzisiaj={dzisiaj}
              checked={zaznaczone.has(p.id)}
              onToggle={() => przelacz(p.id)}
              onEdit={() => setEdytowany(p)}
              onSkip={() => void wykonaj(() => updateWazneInfo(p.id, { status: 'pominiete' }))}
            />
          ))}
        </div>
      )}

      {wyslane.length > 0 && (
        <section className="mt-8">
          <button type="button" className="text-sm font-medium text-gray-700 hover:underline" onClick={() => setPokazWyslane((v) => !v)}>
            {pokazWyslane ? '▾' : '▸'} Wysłane ({wyslane.length})
          </button>
          {pokazWyslane && (
            <div className="mt-2 space-y-3">
              {paczki
                .filter((k) => wyslane.some((p) => p.paczkaId === k.id))
                .map((k) => (
                  <div key={k.id} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Wysłane {new Date(k.wyslano).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => void copyToClipboard(k.tekst)}>
                        Kopiuj
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600">{k.tekst}</pre>
                  </div>
                ))}
              {wyslane
                .filter((p) => !p.paczkaId)
                .map((p) => (
                  <p key={p.id} className="text-sm text-gray-500">
                    {p.tytul}
                  </p>
                ))}
            </div>
          )}
        </section>
      )}

      {pominiete.length > 0 && (
        <section className="mt-6">
          <button type="button" className="text-sm font-medium text-gray-700 hover:underline" onClick={() => setPokazPominiete((v) => !v)}>
            {pokazPominiete ? '▾' : '▸'} Pominięte ({pominiete.length})
          </button>
          {pokazPominiete && (
            <ul className="mt-2 space-y-1">
              {pominiete.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
                  <span className="truncate">{p.tytul}</span>
                  <span className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" onClick={() => void wykonaj(() => updateWazneInfo(p.id, { status: 'nowe' }))}>
                      Przywróć
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => void wykonaj(() => deleteWazneInfo(p.id))}>
                      Usuń
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {zaznaczone.size > 0 && (
        <PaczkaPanel
          punkty={nowe.filter((p) => zaznaczone.has(p.id))}
          onClear={() => setZaznaczone(new Set())}
          onSent={(ids, tekst) =>
            wykonaj(async () => {
              await createPaczka(ids, tekst);
              setZaznaczone(new Set());
              setKomunikat('Paczka skopiowana i odhaczona jako wysłana.');
            })
          }
        />
      )}

      <PunktEditor
        punkt={edytowany}
        onClose={() => setEdytowany(null)}
        onSave={(dane) =>
          wykonaj(async () => {
            if (edytowany === 'nowy') await insertWazneInfo(dane);
            else if (edytowany) await updateWazneInfo(edytowany.id, dane);
            setEdytowany(null);
          })
        }
        onDelete={
          edytowany && edytowany !== 'nowy'
            ? () =>
                wykonaj(async () => {
                  await deleteWazneInfo(edytowany.id);
                  setEdytowany(null);
                })
            : undefined
        }
      />
    </div>
  );
}

// --- karta punktu ---------------------------------------------------------

function TerminBadge({ termin, dzisiaj }: { termin: string; dzisiaj: string }) {
  const dni = dniDoTerminu(termin, dzisiaj);
  let klasa = 'bg-gray-100 text-gray-700';
  let opis = `do ${formatTermin(termin)}`;
  if (dni < 0) {
    klasa = 'bg-gray-200 text-gray-500 line-through';
  } else if (dni === 0) {
    klasa = 'bg-red-100 text-red-800';
    opis = `dziś, ${formatTermin(termin)}`;
  } else if (dni === 1) {
    klasa = 'bg-red-100 text-red-800';
    opis = `jutro, ${formatTermin(termin)}`;
  } else if (dni <= 3) {
    klasa = 'bg-amber-100 text-amber-800';
    opis = `za ${dni} dni, ${formatTermin(termin)}`;
  }
  return <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium', klasa)}>{opis}</span>;
}

function PunktCard({
  punkt,
  dzisiaj,
  checked,
  onToggle,
  onEdit,
  onSkip,
}: {
  punkt: WazneInfo;
  dzisiaj: string;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onSkip: () => void;
}) {
  const poTerminie = punkt.termin !== null && dniDoTerminu(punkt.termin, dzisiaj) < 0;
  return (
    <div
      className={clsx(
        'flex gap-3 rounded-lg border bg-white p-3 sm:p-4',
        checked ? 'border-accent-400 bg-accent-50/40' : 'border-gray-200',
        poTerminie && 'opacity-60',
      )}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} className="mt-1 h-5 w-5 shrink-0 accent-accent-600" aria-label={`Zaznacz: ${punkt.tytul}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onToggle} className="text-left text-base font-semibold text-gray-900">
            {punkt.tytul}
          </button>
          {punkt.termin && <TerminBadge termin={punkt.termin} dzisiaj={dzisiaj} />}
        </div>
        {punkt.tresc && <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{punkt.tresc}</p>}
        {punkt.linki.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {punkt.linki.map((l) => (
              <li key={l}>
                <a href={l} target="_blank" rel="noreferrer" className="break-all text-sm text-accent-700 hover:underline">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-gray-400">
          {punkt.nadawca ? `${punkt.nadawca} - ${punkt.temat ?? ''}` : 'dodane ręcznie'}
          {punkt.otrzymano ? `, ${new Date(punkt.otrzymano).toLocaleDateString('pl-PL')}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edytuj
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Pomiń
        </Button>
      </div>
    </div>
  );
}

// --- paczka (pasek na dole) -----------------------------------------------

function PaczkaPanel({
  punkty,
  onClear,
  onSent,
}: {
  punkty: WazneInfo[];
  onClear: () => void;
  onSent: (ids: string[], tekst: string) => Promise<void>;
}) {
  const wygenerowany = useMemo(() => buildPaczkaText(punkty), [punkty]);
  const [tekst, setTekst] = useState(wygenerowany);
  const [reczny, setReczny] = useState(false);
  const [skopiowano, setSkopiowano] = useState(false);
  const [zapisuje, setZapisuje] = useState(false);

  // Zmiana zaznaczenia przebudowuje tekst, chyba ze nauczyciel juz go poprawil.
  useEffect(() => {
    if (!reczny) setTekst(wygenerowany);
  }, [wygenerowany, reczny]);

  async function kopiuj() {
    const ok = await copyToClipboard(tekst);
    setSkopiowano(ok);
    return ok;
  }

  async function kopiujIWyslij() {
    setZapisuje(true);
    await kopiuj();
    await onSent(
      punkty.map((p) => p.id),
      tekst,
    );
    setZapisuje(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:left-56">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            Paczka: {punkty.length} {punkty.length === 1 ? 'punkt' : punkty.length < 5 ? 'punkty' : 'punktów'}
          </p>
          <div className="flex items-center gap-2">
            {reczny && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReczny(false);
                  setTekst(wygenerowany);
                }}
              >
                Przywróć tekst
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClear}>
              Odznacz
            </Button>
          </div>
        </div>
        <Textarea
          value={tekst}
          onChange={(e) => {
            setTekst(e.target.value);
            setReczny(true);
            setSkopiowano(false);
          }}
          rows={7}
          className="font-sans"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button onClick={() => void kopiujIWyslij()} disabled={zapisuje}>
            Kopiuj i oznacz jako wysłane
          </Button>
          <Button variant="secondary" onClick={() => void kopiuj()}>
            Tylko kopiuj
          </Button>
          {skopiowano && <span className="text-sm text-gray-500">Skopiowane - wklej na WhatsAppie.</span>}
        </div>
      </div>
    </div>
  );
}

// --- edycja / dodawanie punktu ----------------------------------------------

function PunktEditor({
  punkt,
  onClose,
  onSave,
  onDelete,
}: {
  punkt: WazneInfo | 'nowy' | null;
  onClose: () => void;
  onSave: (dane: WazneInfoPunkt) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [tytul, setTytul] = useState('');
  const [tresc, setTresc] = useState('');
  const [termin, setTermin] = useState('');
  const [linki, setLinki] = useState('');

  useEffect(() => {
    if (!punkt) return;
    const p = punkt === 'nowy' ? null : punkt;
    setTytul(p?.tytul ?? '');
    setTresc(p?.tresc ?? '');
    setTermin(p?.termin ?? '');
    setLinki(p?.linki.join('\n') ?? '');
  }, [punkt]);

  const open = punkt !== null;
  const gotowe = tytul.trim().length > 0;

  function zapisz() {
    void onSave({
      tytul: tytul.trim(),
      tresc: tresc.trim(),
      termin: termin || null,
      linki: linki
        .split(/\s+/)
        .map((l) => l.trim())
        .filter((l) => /^https?:\/\//.test(l)),
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={punkt === 'nowy' ? 'Nowy punkt' : 'Edytuj punkt'}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => void onDelete()}>
                Usuń
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Anuluj
            </Button>
            <Button onClick={zapisz} disabled={!gotowe}>
              Zapisz
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Tytuł</span>
          <Input value={tytul} onChange={(e) => setTytul(e.target.value)} autoFocus placeholder="np. Konkurs Zdolny Ślązak - karty zgłoszenia" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Treść dla rodziców</span>
          <Textarea value={tresc} onChange={(e) => setTresc(e.target.value)} rows={4} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Termin (opcjonalnie)</span>
          <Input type="date" value={termin} onChange={(e) => setTermin(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Linki (każdy w osobnej linii)</span>
          <Textarea value={linki} onChange={(e) => setLinki(e.target.value)} rows={2} placeholder="https://..." />
        </label>
      </div>
    </Modal>
  );
}
