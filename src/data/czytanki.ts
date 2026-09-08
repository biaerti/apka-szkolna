// Czytanki z lektorem - odtwarzanie mp3 czytanek z podrecznika "Jezyk polski 4. Moim zdaniem".

export type Czytanka = {
  id: string
  title: string
  author?: string
  pages: string // np. "12-13" - strony w podreczniku "Jezyk polski 4. Moim zdaniem"
  audio: string // sciezka do mp3 w public/
}

export const CZYTANKI: Czytanka[] = [
  {
    id: 'moje-lato-z-szablozebnym',
    title: 'Moje lato z szablozębnym',
    author: 'Weronika Kurosz',
    pages: '12-13',
    audio: '/audio/czytanki/moje-lato-z-szablozebnym.mp3',
  },
]
