// Klucz porownawczy tytulu lekcji/zestawu: male litery, bez polskich znakow,
// slowa posortowane alfabetycznie - dzieki temu ani brak diakrytykow, ani
// przestawiona kolejnosc slow nie psuja dopasowania starej wersji do nowej.
// Uzywane przez "Odswiez gotowe materialy" i migracje store'u (sklejanie lekcji).

const DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

function stripDiacritics(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => DIACRITICS[ch] ?? ch)
    .join('');
}

export function titleMatchKey(title: string): string {
  return stripDiacritics(title)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}
