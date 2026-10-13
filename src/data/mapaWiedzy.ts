// Mapa wiedzy rocznika - na niej stoi "Tablica dzialu" (Excalidraw).
//
// Kazdy punkt to jedna rzecz, ktora uczniowie umieja po danym dziale: nazwa
// i krotki przyklad "w praktyce". Przyklady pokrywaja sie z notatkami z lekcji,
// zeby uczniowie poznali je w zeszycie. Klasa 4 ma caly rok (spis tresci GWO),
// klasa 5 tylko dzialy, ktore juz sa w apce - kolejne dopisujemy razem z dzialem.

export type KategoriaWiedzy = 'czesci-mowy' | 'ortografia' | 'slowa' | 'zdanie' | 'pisanie' | 'teksty';

export const KATEGORIE_WIEDZY: { id: KategoriaWiedzy; nazwa: string }[] = [
  { id: 'czesci-mowy', nazwa: 'Części mowy' },
  { id: 'ortografia', nazwa: 'Ortografia' },
  { id: 'slowa', nazwa: 'Słowa i znaczenia' },
  { id: 'zdanie', nazwa: 'Zdanie' },
  { id: 'pisanie', nazwa: 'Piszemy' },
  { id: 'teksty', nazwa: 'Teksty' },
];

export interface PunktWiedzy {
  kat: KategoriaWiedzy;
  nazwa: string;
  przyklad: string;
  /** Numer dzialu (rozdzialu) w roczniku. */
  dzial: number;
}

const p = (dzial: number, kat: KategoriaWiedzy, nazwa: string, przyklad: string): PunktWiedzy => ({ kat, nazwa, przyklad, dzial });

export const MAPA_WIEDZY: Record<string, PunktWiedzy[]> = {
  IV: [
    p(1, 'teksty', 'Narrator i świat przedstawiony', 'kto opowiada? kto, gdzie, kiedy?'),
    p(1, 'teksty', 'Podmiot liryczny', 'ten, kto mówi w wierszu'),
    p(1, 'pisanie', 'Notatka', 'najważniejsze w punktach'),
    p(1, 'slowa', 'Głoski, litery, sylaby', 'chata: 4 głoski, 5 liter, 2 sylaby'),
    p(1, 'slowa', 'Epitet', 'szumiący las, złota jesień'),
    p(1, 'czesci-mowy', 'Czasownik', 'co robi? co się z nim dzieje? - biegnie, śpi'),
    p(1, 'czesci-mowy', 'Odmiana czasownika', 'osoba, liczba, czas: piszę, pisałeś, będą pisać'),
    p(1, 'zdanie', 'Zdanie i równoważnik', 'Pada deszcz. / Cisza!'),
    p(1, 'pisanie', 'Plan ramowy', 'najważniejsze wydarzenia po kolei'),

    p(2, 'slowa', 'Wyrazy potoczne', 'kasa, kumpel - na luzie, nie w wypracowaniu'),
    p(2, 'slowa', 'Porównanie', 'szybki jak gepard'),
    p(2, 'slowa', 'Synonimy i antonimy', 'wesoły - radosny / zimny - gorący'),
    p(2, 'pisanie', 'List', 'miejscowość i data, nagłówek, pozdrowienie, podpis'),
    p(2, 'czesci-mowy', 'Rzeczownik', 'kto? co? - liczba i rodzaj: ten kot, ta szkoła'),
    p(2, 'czesci-mowy', 'Przypadki rzeczownika', 'kot, kota, kotu, kota, kotem, kocie, kocie!'),
    p(2, 'pisanie', 'Opinia i argument', 'Uważam, że... , ponieważ...'),
    p(2, 'ortografia', 'Wielka i mała litera', 'Wisła, Burek / rzeka, pies'),
    p(2, 'ortografia', 'Nie z rzeczownikami', 'razem: niepokój, niepogoda'),

    p(3, 'slowa', 'Przysłowie', 'Bez pracy nie ma kołaczy.'),
    p(3, 'czesci-mowy', 'Przymiotnik', 'jaki? jaka? jakie? - zielony, mądra'),
    p(3, 'czesci-mowy', 'Odmiana przymiotnika', 'ciekawa książka, ciekawej książki, ciekawe książki'),
    p(3, 'czesci-mowy', 'Stopniowanie', 'dobry - lepszy - najlepszy'),
    p(3, 'ortografia', 'Nie z przymiotnikami', 'razem: niemiły, nieduży, niemniejszy'),
    p(3, 'pisanie', 'Opis przedmiotu', 'wygląd, wielkość, kształt, kolor, materiał, ocena'),
    p(3, 'pisanie', 'Ogłoszenie', 'co? gdzie? kiedy? kontakt'),
    p(3, 'slowa', 'Rodzina wyrazów', 'dom, domek, domowy, bezdomny'),
    p(3, 'ortografia', 'Ó i u', 'ó wymienia się na o: stół - stoły'),
    p(3, 'pisanie', 'Opis postaci', 'wygląd, ubiór, charakter, opinia'),

    p(4, 'teksty', 'Legenda', 'opowieść o początkach: Lech, Czech i Rus'),
    p(4, 'ortografia', 'Ch i h', 'ch wymienia się na sz: mucha - musze'),

    p(5, 'pisanie', 'Plan szczegółowy', 'punkty i podpunkty'),
    p(5, 'ortografia', 'Rz i ż', 'rz → r: morze - morski; ż → g: może - mogę'),
    p(5, 'czesci-mowy', 'Przyimek', 'w, na, pod, za - pod stołem, na łące'),

    p(6, 'zdanie', 'Typy wypowiedzeń', 'Pada. / Czy pada? / Chodź tu!'),
    p(6, 'ortografia', 'Przecinek', 'przed że, bo, ale, który'),
    p(6, 'teksty', 'Baśń', 'dawno, dawno temu... czary, dobro wygrywa'),
    p(6, 'pisanie', 'Dialog', 'od nowej linijki i od myślnika'),

    p(7, 'pisanie', 'Zaproszenie', 'kto zaprasza, kogo, na co, gdzie, kiedy'),

    p(8, 'pisanie', 'E-mail', 'temat, powitanie, treść, pozdrowienia'),
    p(8, 'czesci-mowy', 'Przysłówek', 'jak? gdzie? kiedy? - szybko, tutaj, jutro'),

    p(9, 'pisanie', 'Wywiad', 'pytania i odpowiedzi'),
    p(9, 'pisanie', 'Kartka z wakacji', 'skąd piszę, co robię, pozdrowienia'),
  ],
  V: [
    p(1, 'pisanie', 'Zapis dialogu', 'myślnik, nowa linijka, słowa narratora małą literą'),
    p(1, 'pisanie', 'Opowiadanie twórcze', 'wstęp, rozwinięcie ze zwrotem akcji, zakończenie'),
    p(1, 'slowa', 'Głoski miękkie i twarde', 'koń (kreska), koniec („i” przed samogłoską)'),
    p(1, 'czesci-mowy', 'Formy nieosobowe czasownika', 'czytać, czytano, czyta się'),
    p(1, 'czesci-mowy', 'Tryby czasownika', 'czytam, czytaj!, czytałbym'),
    p(1, 'pisanie', 'E-mail i tekst informacyjny', 'fakty bez opinii, drugie źródło'),
    p(1, 'teksty', 'Rym', 'AABB, ABAB, ABBA; koc - noc'),

    p(2, 'slowa', 'Przenośnia', 'kamienne serce, morze łez'),
    p(2, 'slowa', 'Związek frazeologiczny', 'czuć miętę, włosy stanęły dęba'),
    p(2, 'slowa', 'Zdrobnienia i zgrubienia', 'piesek, nosek / psisko, nochal'),
    p(2, 'teksty', 'Recytacja', 'pauzy, ważne słowa głośniej, tempo'),
    p(2, 'czesci-mowy', 'Rzeczownik: przypadki', 'M. kto? co? ... W. o! - własne wielką literą'),
    p(2, 'czesci-mowy', 'Nietypowa odmiana rzeczownika', 'w muzeum; tylko lm.: drzwi, sanie'),
    p(2, 'ortografia', 'Ę i ą na końcu wyrazu', 'widzę mamę, piszę / z mamą, piszą'),
    p(2, 'ortografia', 'Temat i końcówka', 'tablic|a, tablic|y; stół - stoły'),
    p(2, 'pisanie', 'Sprawozdanie', 'kto, co, gdzie, kiedy, przebieg, opinia'),
    p(2, 'ortografia', 'Dwukropek', 'przed wyliczeniem: Wawel, Rynek i Barbakan'),
    p(2, 'pisanie', 'Tekst reklamowy', 'hasło: nowość, promocja, gratis'),
  ],
};

const RZYMSKIE: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };

/** Numer dzialu z Lesson.dzial: "Rozdział III. Od pomysłu..." -> 3, "Dział 2 - Uwaga..." -> 2. */
export function numerDzialu(dzial: string | undefined): number | null {
  if (!dzial) return null;
  const rzymski = /^Rozdział\s+([IVX]+)\b/.exec(dzial);
  if (rzymski) return RZYMSKIE[rzymski[1]] ?? null;
  const arabski = /^Dział\s+(\d+)\b/.exec(dzial);
  return arabski ? Number(arabski[1]) : null;
}

export function mapaWiedzy(grade: string): PunktWiedzy[] {
  return MAPA_WIEDZY[grade.toUpperCase()] ?? [];
}
