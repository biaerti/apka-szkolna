import type { CapacitorConfig } from '@capacitor/cli';

// Apka na telefon to ta sama apka webowa zapakowana Capacitorem - dist/ leci
// do srodka APK, wiec start nie wymaga internetu (Supabase dalej z sieci).
// Zadnych wtyczek natywnych: telefon ma byc pilotem do widoku Sala.
const config: CapacitorConfig = {
  appId: 'pl.kuninski.apkaszkolna',
  appName: 'Apka szkolna',
  webDir: 'dist',
  android: {
    // Ciemny pasek nawigacji gestow i brak "pull to refresh" - odswiezenie
    // gestem gubiloby niezsynchronizowane zdarzenia z Sali.
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
