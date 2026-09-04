import { useRef, useState } from 'react';
import { useStore } from '../data/store';
import { downloadBackup, importBackupFromFile } from '../data/backup';
import { isSupabaseConfigured } from '../data/supabase';
import { useAuth } from '../data/auth';
import { pullAllFromRemote, pushAllToRemote, useSyncStatus } from '../data/remote/sync';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function CloudSection() {
  const { session } = useAuth();
  const status = useSyncStatus();
  const [pullOpen, setPullOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  let statusText: string;
  if (status.state === 'syncing') {
    statusText = 'Zapisywanie...';
  } else if (status.state === 'offline') {
    statusText = `Offline, zmiany czekają (${status.pending})`;
  } else if (status.state === 'error') {
    statusText = `Błąd - ${status.error ?? 'nieznany błąd'}`;
  } else {
    statusText = status.lastSyncedAt ? `Zapisano ${formatTime(status.lastSyncedAt)}` : 'Gotowa';
  }

  async function handlePull() {
    setPullOpen(false);
    setBusy(true);
    setActionError(null);
    try {
      await pullAllFromRemote();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Nie udało się pobrać danych z chmury.');
    } finally {
      setBusy(false);
    }
  }

  async function handlePush() {
    setPushOpen(false);
    setBusy(true);
    setActionError(null);
    try {
      await pushAllToRemote();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Nie udało się wysłać danych do chmury.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-1 text-base font-semibold text-gray-900">Chmura</h2>
      <p className="mb-1 text-sm text-gray-500">
        Konto: {session?.user?.email ?? '-'}. Status: {statusText}.
      </p>
      <p className="mb-4 text-sm text-gray-500">
        Dane synchronizują się automatycznie. Poniższe przyciski wymuszają pełne pobranie lub wysłanie danych.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={busy} onClick={() => setPullOpen(true)}>
          Pobierz ponownie z chmury
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => setPushOpen(true)}>
          Wyślij wszystko do chmury
        </Button>
      </div>
      {actionError && <p className="mt-2 text-sm text-red-600">{actionError}</p>}

      <ConfirmDialog
        open={pullOpen}
        title="Pobierz z chmury"
        message="Czy na pewno pobrać dane z chmury? Nadpisze to lokalne dane w tej przeglądarce. Tej operacji nie można cofnąć."
        confirmLabel="Pobierz"
        onCancel={() => setPullOpen(false)}
        onConfirm={handlePull}
      />
      <ConfirmDialog
        open={pushOpen}
        title="Wyślij do chmury"
        message="Czy na pewno wysłać wszystkie lokalne dane do chmury? Nadpisze to dane w chmurze danymi z tej przeglądarki."
        confirmLabel="Wyślij"
        onCancel={() => setPushOpen(false)}
        onConfirm={handlePush}
      />
    </section>
  );
}

export function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetToSeed = useStore((s) => s.resetToSeed);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImportError(null);
      setPendingFile(file);
    }
    e.target.value = '';
  }

  async function confirmImport() {
    if (!pendingFile) return;
    try {
      await importBackupFromFile(pendingFile);
      setPendingFile(null);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Nie udało się zaimportować pliku.');
      setPendingFile(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Ustawienia" description="Parametry powtórek oraz zarządzanie danymi aplikacji." />

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Parametry powtórek</h2>
        <p className="mb-4 text-sm text-gray-500">
          Pasy, uwagi i statystyki liczą się pełnymi miesiącami kalendarzowymi i zerują się 1. dnia miesiąca.
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Liczba pasów na miesiąc</label>
            <Input
              type="number"
              min={0}
              value={settings.passesPerMonth}
              onChange={(e) => updateSettings({ passesPerMonth: parseInt(e.target.value, 10) || 0 })}
              className="max-w-[10rem]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Czas kręcenia koła (sekundy)</label>
            <Input
              type="number"
              min={1}
              value={settings.wheelSpinSec}
              onChange={(e) => updateSettings({ wheelSpinSec: parseInt(e.target.value, 10) || 1 })}
              className="max-w-[10rem]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Ile plusów daje piątkę</label>
            <Input
              type="number"
              min={1}
              value={settings.plusesForFive}
              onChange={(e) => updateSettings({ plusesForFive: parseInt(e.target.value, 10) || 1 })}
              className="max-w-[10rem]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Ile plomb daje jedynkę</label>
            <Input
              type="number"
              min={1}
              value={settings.plombyForOne}
              onChange={(e) => updateSettings({ plombyForOne: parseInt(e.target.value, 10) || 1 })}
              className="max-w-[10rem]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              checked={settings.hintGivesMinus}
              onChange={(e) => updateSettings({ hintGivesMinus: e.target.checked })}
            />
            Podpowiadanie = plomba dla podpowiadającego
          </label>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSavedMsg(true);
              setTimeout(() => setSavedMsg(false), 1500);
            }}
          >
            {savedMsg ? 'Zapisano' : 'Zapisz'}
          </Button>
        </div>
      </section>

      {isSupabaseConfigured() && <CloudSection />}

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Kopia zapasowa</h2>
        <p className="mb-4 text-sm text-gray-500">Eksportuj całą bazę danych do pliku JSON lub przywróć z pliku.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={downloadBackup}>
            Eksportuj JSON
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Importuj JSON
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChosen} />
        </div>
        {importError && <p className="mt-2 text-sm text-red-600">{importError}</p>}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Reset danych</h2>
        <p className="mb-4 text-sm text-gray-500">
          Usuwa wszystkie dane i przywraca stan początkowy (klasa IV A z uczniami oraz puste klasy IV B, IV C, V A).
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>
          Wyczyść dane i załaduj seed
        </Button>
      </section>

      <ConfirmDialog
        open={!!pendingFile}
        title="Importuj dane"
        message={`Czy na pewno nadpisać bieżące dane zawartością pliku "${pendingFile?.name}"? Tej operacji nie można cofnąć.`}
        confirmLabel="Nadpisz"
        onCancel={() => setPendingFile(null)}
        onConfirm={confirmImport}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Wyczyść dane"
        message="Czy na pewno usunąć wszystkie dane i załadować dane startowe? Tej operacji nie można cofnąć."
        confirmLabel="Wyczyść"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetToSeed();
          setResetOpen(false);
        }}
      />
    </div>
  );
}
