import defaultColors from 'tailwindcss/colors.js';

// Tryb ciemny bez przepisywania setek klas w komponentach: szarosci i kolory
// statusow ida przez zmienne CSS, a klasa "dark" na <html> (wlacza ja
// src/lib/theme.ts, tylko w AppShell - prezentacja i wydruki zostaja jasne)
// podmienia ich wartosci. Szarosci odwracaja sie w calosci, kolorowe palety
// tylko na krancach (jasne tla ciemnieja, ciemne napisy jasnieja), a 400-600
// zostaja - dzieki temu bg-accent-600 + text-white dalej ma kontrast.

const accent = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
};

const darkGray = {
  50: '#0b0e14',
  100: '#1a1f29',
  200: '#2a303c',
  300: '#3b4252',
  400: '#7d8595',
  500: '#9aa2b1',
  600: '#b4bbc7',
  700: '#d1d5dc',
  800: '#e5e7eb',
  900: '#f3f4f6',
  950: '#fafafa',
};

const PALETTES = {
  gray: defaultColors.gray,
  accent,
  red: defaultColors.red,
  amber: defaultColors.amber,
  yellow: defaultColors.yellow,
  orange: defaultColors.orange,
  green: defaultColors.green,
  emerald: defaultColors.emerald,
  lime: defaultColors.lime,
  blue: defaultColors.blue,
  sky: defaultColors.sky,
  cyan: defaultColors.cyan,
  indigo: defaultColors.indigo,
  violet: defaultColors.violet,
  rose: defaultColors.rose,
};

const MIRROR = { 50: 950, 100: 900, 200: 800, 300: 700, 700: 300, 800: 200, 900: 100, 950: 50 };

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function themeVars() {
  const light = {};
  const dark = {};
  for (const [name, scale] of Object.entries(PALETTES)) {
    for (const [shade, hex] of Object.entries(scale)) {
      light[`--c-${name}-${shade}`] = rgb(hex);
      const darkHex = name === 'gray' ? darkGray[shade] : scale[MIRROR[shade] ?? shade];
      dark[`--c-${name}-${shade}`] = rgb(darkHex);
    }
  }
  return { light, dark };
}

const colors = Object.fromEntries(
  Object.entries(PALETTES).map(([name, scale]) => [
    name,
    Object.fromEntries(Object.keys(scale).map((shade) => [shade, `rgb(var(--c-${name}-${shade}) / <alpha-value>)`])),
  ]),
);

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [
    function ({ addBase }) {
      const { light, dark } = themeVars();
      const lightGray = Object.fromEntries(Object.entries(light).filter(([k]) => k.startsWith('--c-gray-')));
      const inverseSurfaces = ['700', '800', '800/60', '900', '900/70', '900/80', '900/95', '950', '950/80', '950/90', '950/95']
        .map((c) => `html.dark .bg-gray-${c.replace('/', '\\/')}`)
        .join(', ');
      addBase({
        ':root': light,
        'html.dark': { ...dark, colorScheme: 'dark' },
        // bg-white to karty i panele - text-white (napisy na kolorowych
        // przyciskach) musi zostac bialy, wiec podmieniamy tylko tla.
        'html.dark .bg-white': { backgroundColor: '#131720' },
        'html.dark .bg-white\\/80': { backgroundColor: 'rgb(19 23 32 / 0.8)' },
        'html.dark .bg-white\\/95': { backgroundColor: 'rgb(19 23 32 / 0.95)' },
        'html.dark .hover\\:bg-white:hover': { backgroundColor: '#131720' },
        // Ciemne "odwrocone" elementy (bg-gray-900 + text-white: przycisk czytanki,
        // toast uwagi) zostaja ciemne - wewnatrz nich wracaja jasne szarosci.
        [inverseSurfaces]: lightGray,
      });
    },
  ],
};
