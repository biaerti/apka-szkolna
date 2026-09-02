import { useRef, useState } from 'react';
import { useStore } from '../data/store';
import { downloadBackup, importBackupFromFile } from '../data/backup';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

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
      setImportError(err instanceof Error ? err.message : 'Nie udalo sie zaimportowac pliku.');
      setPendingFile(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Ustawienia" description="Parametry powtorek oraz zarzadzanie danymi aplikacji." />

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Parametry powtorek</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Liczba pasow na tydzien</label>
            <Input
              type="number"
              min={0}
              value={settings.passesPerWeek}
              onChange={(e) => updateSettings({ passesPerWeek: parseInt(e.target.value, 10) || 0 })}
              className="max-w-[10rem]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Czas krecenia kola (sekundy)</label>
            <Input
              type="number"
              min={1}
              value={settings.wheelSpinSec}
              onChange={(e) => updateSettings({ wheelSpinSec: parseInt(e.target.value, 10) || 1 })}
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
            Podpowiadanie liczy sie jako minus
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

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Kopia zapasowa</h2>
        <p className="mb-4 text-sm text-gray-500">Eksportuj cala baze danych do pliku JSON lub przywroc z pliku.</p>
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
          Usuwa wszystkie dane i przywraca stan poczatkowy (klasa IV A z uczniami oraz puste klasy IV B, IV C, V A).
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>
          Wyczysc dane i zaladuj seed
        </Button>
      </section>

      <ConfirmDialog
        open={!!pendingFile}
        title="Importuj dane"
        message={`Czy na pewno nadpisac biezace dane zawartoscia pliku "${pendingFile?.name}"? Tej operacji nie mozna cofnac.`}
        confirmLabel="Nadpisz"
        onCancel={() => setPendingFile(null)}
        onConfirm={confirmImport}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Wyczysc dane"
        message="Czy na pewno usunac wszystkie dane i zaladowac dane startowe? Tej operacji nie mozna cofnac."
        confirmLabel="Wyczysc"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetToSeed();
          setResetOpen(false);
        }}
      />
    </div>
  );
}
