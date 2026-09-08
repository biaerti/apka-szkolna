// Czytanki z lektorem - odtwarzanie mp3 czytanek z podrecznika "Jezyk polski 4. Moim zdaniem".
//
// Mp3 nie leza w repo (repo jest publiczne, a teksty/nagrania sa objete prawami
// autorskimi) - w produkcji sa serwowane z Supabase Storage (bucket "czytanki"),
// a w dev z public/audio/czytanki/, jesli plik istnieje lokalnie.

export type Czytanka = {
  id: string
  title: string
  author?: string
  pages: string // np. "12-13" - strony w podreczniku "Jezyk polski 4. Moim zdaniem"
  audio: string // pelny URL albo sciezka lokalna do mp3
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined

function audioUrl(file: string): string {
  if (import.meta.env.DEV) return `/audio/czytanki/${file}`
  if (supabaseUrl) return `${supabaseUrl}/storage/v1/object/public/czytanki/${file}`
  return `/audio/czytanki/${file}`
}

export const CZYTANKI: Czytanka[] = [
  {
    id: 'moje-lato-z-szablozebnym',
    title: 'Moje lato z szablozębnym',
    author: 'Weronika Kurosz',
    pages: '12-13',
    audio: audioUrl('moje-lato-z-szablozebnym.mp3'),
  },
]
