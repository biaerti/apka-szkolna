// Brama logowania. Gdy Supabase nie jest skonfigurowane - aplikacja dziala w trybie
// lokalnym (localStorage), bez logowania. Gdy jest skonfigurowane - wymaga zalogowania,
// po zalogowaniu uruchamia initialSync() (raz na sesje) i startSync().

import { ReactNode, useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured } from '../../data/supabase';
import { useAuth } from '../../data/auth';
import { Login } from '../../pages/Login';
import { initialSync, startSync, stopSync } from '../../data/remote/sync';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function AuthGate({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }
  return <AuthGateCloud>{children}</AuthGateCloud>;
}

function CenteredMessage({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

function AuthGateCloud({ children }: { children: ReactNode }) {
  const { status, session, signOut } = useAuth();
  const syncedSessionRef = useRef<string | null>(null);
  const [needsUploadConfirm, setNeedsUploadConfirm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status !== 'signed-in' || !session) {
      syncedSessionRef.current = null;
      setReady(false);
      setNeedsUploadConfirm(false);
      stopSync();
      return;
    }

    // initialSync tylko raz per zalogowanego uzytkownika. Klucz to user.id, NIE access_token -
    // token odswieza sie co godzine i wymusilby ponowne pobranie z chmury w trakcie lekcji.
    if (syncedSessionRef.current === session.user.id) {
      return;
    }
    syncedSessionRef.current = session.user.id;

    let cancelled = false;
    setReady(false);

    initialSync().then((result) => {
      if (cancelled) return;
      if (result.needsUpload) {
        setNeedsUploadConfirm(true);
      } else {
        startSync();
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [status, session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => stopSync();
  }, []);

  if (status === 'unknown') {
    return <CenteredMessage text="Łączenie..." />;
  }
  if (status === 'signed-out') {
    return <Login />;
  }

  function confirmUpload() {
    setNeedsUploadConfirm(false);
    // Snapshot jest pusty (ustawiony przez initialSync), wiec startSync() wysle
    // biezacy stan przegladarki do chmury.
    startSync();
    setReady(true);
  }

  function declineUpload() {
    setNeedsUploadConfirm(false);
    void signOut();
  }

  return (
    <>
      {ready ? children : <CenteredMessage text="Synchronizowanie..." />}
      <ConfirmDialog
        open={needsUploadConfirm}
        title="Pusta chmura"
        message="Chmura jest pusta, a w tej przeglądarce są dane (klasy, uczniowie, lekcje). Wysłać je do chmury? Jeśli nie, zostaniesz wylogowany, a dane lokalne pozostaną bez zmian."
        confirmLabel="Wyślij do chmury"
        cancelLabel="Nie, wyloguj"
        danger={false}
        onConfirm={confirmUpload}
        onCancel={declineUpload}
      />
    </>
  );
}
