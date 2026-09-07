//! Minimalizacja z paska zadan NIE chowa panelu - zwija go do pigulki.
//!
//! Zasada przeniesiona z panelu notatki lekarza: nie ma stanu "apka dziala, a
//! na ekranie nie ma po niej sladu". Panel to JEDNO okno przelaczane rozmiarem
//! miedzy pigulka a kolem, wiec odpowiednikiem minimalizacji jest tryb pigulki.
//! Przechwytujemy ja subclassem okna i zamiast chowac okno wysylamy do panelu
//! zdarzenie, na ktore ten sam sie zwija.
//!
//! Dlaczego subclass, a nie JS: zeby zareagowac po stronie webowej, trzeba by
//! okno najpierw ODminimalizowac, a `window:default` daje tylko odczyt
//! (`is-minimized`). Poza tym natywna blokada nie mruga - okno nigdy nie
//! zdazy zniknac. Instalowane w `setup()`, wiec nie wymaga zadnego uprawnienia
//! w capabilities.

use std::sync::OnceLock;
use tauri::{AppHandle, Emitter};

/// Zdarzenie do panelu: "zwin sie do pigulki". Nazwa musi zgadzac sie ze stala
/// ZDARZENIE_ZWIN w `src/lib/desktop.ts` w apce webowej.
const ZDARZENIE: &str = "panel://zwin-do-pigulki";

/// Subclass proc nie dostaje zadnego kontekstu, wiec uchwyt aplikacji (jedyne,
/// czego potrzebuje do wyslania zdarzenia) trzymamy obok.
static UCHWYT: OnceLock<AppHandle> = OnceLock::new();

#[cfg(windows)]
const ID_SUBCLASS: usize = 1;

#[cfg(windows)]
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
#[cfg(windows)]
use windows::Win32::UI::Shell::{DefSubclassProc, SetWindowSubclass};
#[cfg(windows)]
use windows::Win32::UI::WindowsAndMessaging::{
    ShowWindow, SC_MINIMIZE, SIZE_MINIMIZED, SW_RESTORE, WM_SIZE, WM_SYSCOMMAND,
};

fn zglos_zwiniecie() {
    if let Some(app) = UCHWYT.get() {
        let _ = app.emit(ZDARZENIE, ());
    }
}

#[cfg(windows)]
unsafe extern "system" fn proc_okna(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
    _id_subclass: usize,
    _dane: usize,
) -> LRESULT {
    match msg {
        // Klik w ikone na pasku zadan (i systemowe "minimalizuj") przychodzi tedy.
        // Cztery mlodsze bity sa zarezerwowane dla systemu - stad maska 0xFFF0.
        WM_SYSCOMMAND if (wparam.0 & 0xFFF0) == SC_MINIMIZE as usize => {
            zglos_zwiniecie();
            // Zdarzenie POCHLONIETE: bez DefSubclassProc okno nie zostaje zminimalizowane.
            return LRESULT(0);
        }
        // Siatka bezpieczenstwa na minimalizacje, ktora omija WM_SYSCOMMAND
        // (Win+D, "Pokaz pulpit", ShowWindow z zewnatrz): okno juz sie schowalo,
        // wiec od razu je przywracamy i zwijamy do pigulki.
        WM_SIZE if wparam.0 == SIZE_MINIMIZED as usize => {
            unsafe {
                let _ = ShowWindow(hwnd, SW_RESTORE);
            }
            zglos_zwiniecie();
            return LRESULT(0);
        }
        _ => {}
    }
    unsafe { DefSubclassProc(hwnd, msg, wparam, lparam) }
}

#[cfg(windows)]
pub fn pilnuj_minimalizacji(app: &AppHandle, window: &tauri::WebviewWindow) {
    let _ = UCHWYT.set(app.clone());
    let raw = match window.hwnd() {
        Ok(h) => h.0,
        Err(_) => return,
    };
    unsafe {
        let _ = SetWindowSubclass(HWND(raw as *mut _), Some(proc_okna), ID_SUBCLASS, 0);
    }
}

#[cfg(not(windows))]
pub fn pilnuj_minimalizacji(app: &AppHandle, _window: &tauri::WebviewWindow) {
    let _ = UCHWYT.set(app.clone());
}
