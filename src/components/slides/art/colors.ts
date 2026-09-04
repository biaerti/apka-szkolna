// Wspolna paleta kolorow ilustracji slajdow (src/components/slides/art).
// Jasne wypelnienia i grube linie na ciemnym tle prezentacji - spojne z
// kolorami przyciskow oceny na ekranie powtorki (ScoreButtons.tsx):
// plus = emerald, kropka = sky, plomba = red, pas = amber.

export const ART_COLORS = {
  plus: '#34d399', // emerald-400
  plusDark: '#047857', // emerald-700
  kropka: '#38bdf8', // sky-400
  kropkaDark: '#0369a1', // sky-700
  plomba: '#f87171', // red-400
  plombaDark: '#b91c1c', // red-700
  pas: '#fbbf24', // amber-400
  pasDark: '#b45309', // amber-700
  paper: '#f8fafc', // slate-50 - kartka/kostka
  ink: '#0f172a', // slate-900 - kontur na jasnym tle
  line: '#cbd5e1', // slate-300 - linie tekstu na kartce
  panel: '#1e293b', // slate-800 - tlo paneli
  panelLight: '#475569', // slate-600 - elementy drugoplanowe
  muted: '#64748b', // slate-500 - przekreslone/nieaktywne
  white: '#f8fafc',
} as const;

export const ART_FONT = 'system-ui, Arial, sans-serif';
