// Podrecznik: wgrywanie plikow PDF z dysku, zapamietywanie ich w przegladarce
// (IndexedDB - localStorage nie pomiesci PDF-a) i podglad wbudowana przegladarka
// PDF Chrome (<object> na blob URL, bez dodatkowych bibliotek).
//
// Po co to jest: przy slajdzie "Praca z tekstem" (kind: 'read') nauczyciel ma
// pod reka strone z podrecznika, zeby sprawdzic numer/tresc bez szukania
// papierowej ksiazki. Ekstrakcja tekstu z PDF to kolejny etap - NIE jest tu
// zaimplementowana, ale ksztalt danych (TextbookFile.id/name) jest gotowy do
// dopisania pola np. `extractedPages` bez zmiany reszty kodu.

import { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  deleteTextbook,
  formatSize,
  listTextbooks,
  newId,
  putTextbook,
  type TextbookRecord,
} from '../lib/textbookStore';


export function Textbook() {
  const [items, setItems] = useState<TextbookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<TextbookRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  async function reload() {
    try {
      const list = await listTextbooks();
      list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      setItems(list);
      setSelectedId((cur) => cur ?? list[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się wczytać listy podręczników.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(() => items.find((i) => i.id === selectedId) ?? null, [items, selectedId]);

  // Blob URL do podgladu tworzymy tylko dla aktualnie wybranego pliku i zwalniamy
  // poprzedni, zeby nie trzymac w pamieci wielu duzych PDF-ow naraz.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (selected) {
      const url = URL.createObjectURL(selected.blob);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [selected]);

  async function handleFileChosen(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('To nie jest plik PDF.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const record: TextbookRecord = {
        id: newId(),
        name: file.name,
        size: file.size,
        addedAt: new Date().toISOString(),
        blob: file,
      };
      await putTextbook(record);
      await reload();
      setSelectedId(record.id);
    } catch (e) {
      const name = e instanceof Error ? e.name : '';
      if (name === 'QuotaExceededError') {
        setError('Brak miejsca w przeglądarce na kolejny plik. Usuń niepotrzebny podręcznik i spróbuj ponownie.');
      } else {
        setError(e instanceof Error ? e.message : 'Nie udało się zapisać pliku.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    await deleteTextbook(toDelete.id);
    if (selectedId === toDelete.id) setSelectedId(null);
    setToDelete(null);
    await reload();
  }

  return (
    <div>
      <PageHeader
        title="Podręcznik"
        description="Wgraj PDF podręcznika, żeby mieć go pod ręką przy slajdzie „Praca z tekstem” - np. sprawdzić numer strony bez sięgania po papierową książkę. Plik zostaje zapisany w tej przeglądarce (IndexedDB)."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileChosen(file);
              }}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Zapisywanie...' : 'Wgraj PDF'}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Wczytywanie...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Brak wgranych podręczników"
          description="Wgraj plik PDF przyciskiem powyżej - zostanie zapamiętany w tej przeglądarce."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`block w-full px-3 py-2.5 text-left text-sm ${
                      item.id === selectedId ? 'bg-accent-50 text-accent-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatSize(item.size)} · {new Date(item.addedAt).toLocaleDateString('pl-PL')}
                    </p>
                  </button>
                  <div className="px-3 pb-2.5">
                    <Button size="sm" variant="danger" onClick={() => setToDelete(item)}>
                      Usuń
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {selected && previewUrl ? (
              <object
                data={previewUrl}
                type="application/pdf"
                className="h-[75vh] w-full rounded-lg border border-gray-200 bg-gray-100"
              >
                <p className="p-4 text-sm text-gray-600">
                  Przeglądarka nie potrafi wyświetlić podglądu PDF. Plik „{selected.name}” jest zapisany -
                  spróbuj go otworzyć w innej aplikacji.
                </p>
              </object>
            ) : (
              <EmptyState title="Wybierz podręcznik z listy" description="Podgląd pojawi się po lewej stronie." />
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Usuń podręcznik"
        message={`Czy na pewno usunąć plik "${toDelete?.name}"? Zostanie trwale skasowany z tej przeglądarki.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
