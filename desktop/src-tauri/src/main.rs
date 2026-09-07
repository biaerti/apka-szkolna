// Apka szkolna Desktop - cienki shell Tauri wokol trasy /panel z apki webowej.
//
// Po co osobna aplikacja, skoro panel to zwykla strona: przegladarka nie umie
// trzymac okna NAD multipodrecznikiem GWO puszczonym na pelnym ekranie. Cala
// logika kola (losowanie, plus, kropka, synchronizacja z Supabase) zostaje w
// webie - tu jest tylko okno: zawsze na wierzchu, bez ramki, przezroczyste.
//
// Natywnego kodu jest wiec tyle, ile web NIE umie: przechwycenie minimalizacji
// z paska zadan (pasek_zadan.rs). Reszta (rozmiar, pozycja, przeciaganie,
// zamkniecie) idzie przez core:window z JS - patrz src/lib/desktop.ts w apce.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod pasek_zadan;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                pasek_zadan::pilnuj_minimalizacji(app.handle(), &window);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("blad uruchomienia aplikacji Tauri");
}
