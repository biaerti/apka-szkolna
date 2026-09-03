// Podstawa programowa - jezyk polski, klasy IV-VI (II etap edukacyjny).
// Kody i skrocone opisy zgodne z lista w dzienniku Vulcan ("Elementy podstawy programowej").

export interface CurriculumItem {
  code: string;
  group: string;
  text: string;
}

const G_ODBIOR = 'Odbiór tekstów kultury';
const G_I1 = 'I. Kształcenie literackie i kulturowe - czytanie utworów';
const G_II1 = 'II. Kształcenie językowe - gramatyka';
const G_II2 = 'II. Kształcenie językowe - zróżnicowanie języka';
const G_II3 = 'II. Kształcenie językowe - komunikacja i kultura języka';
const G_II4 = 'II. Kształcenie językowe - ortografia i interpunkcja';
const G_III1 = 'III. Tworzenie wypowiedzi - elementy retoryki';
const G_III2 = 'III. Tworzenie wypowiedzi - mówienie i pisanie';
const G_IV = 'IV. Samokształcenie';

export const CURRICULUM: CurriculumItem[] = [
  { code: '2.1', group: G_ODBIOR, text: 'identyfikuje wypowiedź jako tekst informacyjny, publicystyczny lub reklamowy' },
  { code: '2.2', group: G_ODBIOR, text: 'wyszukuje w tekście informacje wyrażone wprost i pośrednio' },
  { code: '2.3', group: G_ODBIOR, text: 'określa temat i główną myśl tekstu' },
  { code: '2.4', group: G_ODBIOR, text: 'dostrzega relacje między częściami wypowiedzi (tytuł, wstęp, rozwinięcie, zakończenie)' },
  { code: '2.5', group: G_ODBIOR, text: 'odróżnia informacje ważne od drugorzędnych' },
  { code: '2.6', group: G_ODBIOR, text: 'odróżnia informacje o faktach od opinii' },
  { code: '2.7', group: G_ODBIOR, text: 'charakteryzuje komiks jako tekst kultury' },
  { code: '2.8', group: G_ODBIOR, text: 'rozumie swoistość tekstów kultury: literatura, teatr, film, muzyka, sztuki plastyczne' },
  { code: '2.9', group: G_ODBIOR, text: 'wyodrębnia elementy spektaklu teatralnego i dzieła filmowego' },
  { code: '2.10', group: G_ODBIOR, text: 'rozumie, czym jest adaptacja utworu literackiego' },
  { code: '2.11', group: G_ODBIOR, text: 'odnosi treści tekstów kultury do własnego doświadczenia' },
  { code: '2.12', group: G_ODBIOR, text: 'odczytuje teksty poprzez przekład intersemiotyczny (rysunek, drama, spektakl)' },
  { code: '2.13', group: G_ODBIOR, text: 'świadomie odbiera filmy, koncerty, spektakle, programy radiowe i telewizyjne' },
  { code: 'I.1.1', group: G_I1, text: 'omawia elementy świata przedstawionego, wyodrębnia obrazy poetyckie' },
  { code: 'I.1.2', group: G_I1, text: 'rozpoznaje fikcję literacką; elementy realistyczne i fantastyczne' },
  { code: 'I.1.3', group: G_I1, text: 'rozpoznaje gatunek: baśń, legenda, bajka, hymn, przypowieść, mit, opowiadanie, nowela, dziennik, pamiętnik, powieść' },
  { code: 'I.1.4', group: G_I1, text: 'rozpoznaje epitet, porównanie, przenośnię, onomatopeję, zdrobnienie, zgrubienie, uosobienie, ożywienie, apostrofę, anaforę, pytanie retoryczne, powtórzenie' },
  { code: 'I.1.5', group: G_I1, text: 'omawia funkcje tytułu, podtytułu, motta, puenty, punktu kulminacyjnego' },
  { code: 'I.1.6', group: G_I1, text: 'rozpoznaje wers, rym, strofę, refren, liczbę sylab w wersie' },
  { code: 'I.1.7', group: G_I1, text: 'opowiada o wydarzeniach fabuły, ustala kolejność zdarzeń' },
  { code: 'I.1.8', group: G_I1, text: 'odróżnia dialog od monologu' },
  { code: 'I.1.9', group: G_I1, text: 'charakteryzuje podmiot liryczny, narratora i bohaterów' },
  { code: 'I.1.10', group: G_I1, text: 'rozróżnia narrację pierwszoosobową i trzecioosobową' },
  { code: 'I.1.11', group: G_I1, text: 'wskazuje bohaterów głównych i drugoplanowych, określa ich cechy' },
  { code: 'I.1.12', group: G_I1, text: 'określa tematykę i problematykę utworu' },
  { code: 'I.1.13', group: G_I1, text: 'wskazuje i omawia wątek główny i wątki poboczne' },
  { code: 'I.1.14', group: G_I1, text: 'nazywa wrażenia, jakie wzbudza czytany tekst' },
  { code: 'I.1.15', group: G_I1, text: 'objaśnia znaczenia dosłowne i przenośne' },
  { code: 'I.1.16', group: G_I1, text: 'określa doświadczenia bohaterów i porównuje je z własnymi' },
  { code: 'I.1.17', group: G_I1, text: 'przedstawia własne rozumienie utworu i je uzasadnia' },
  { code: 'I.1.18', group: G_I1, text: 'wykorzystuje w interpretacji doświadczenia własne i wiedzę o kulturze' },
  { code: 'I.1.19', group: G_I1, text: 'wyraża własny sąd o postaciach i zdarzeniach' },
  { code: 'I.1.20', group: G_I1, text: 'wskazuje wartości w utworze i wartości ważne dla bohatera' },
  { code: 'II.1.1', group: G_II1, text: 'rozpoznaje części mowy i określa ich funkcje w tekście' },
  { code: 'II.1.2', group: G_II1, text: 'odróżnia części mowy odmienne od nieodmiennych' },
  { code: 'II.1.3', group: G_II1, text: 'rola czasownika; dokonane / niedokonane; formy bezosobowe (-no, -to, się)' },
  { code: 'II.1.4', group: G_II1, text: 'rozpoznaje przypadek, liczbę, osobę, czas, tryb, rodzaj; oddziela temat od końcówki' },
  { code: 'II.1.5', group: G_II1, text: 'strona czynna i bierna czasownika' },
  { code: 'II.1.6', group: G_II1, text: 'stosuje poprawne formy gramatyczne wyrazów odmiennych' },
  { code: 'II.1.7', group: G_II1, text: 'stopniuje przymiotniki i przysłówki' },
  { code: 'II.1.8', group: G_II1, text: 'części zdania: podmiot, orzeczenie, dopełnienie, przydawka, okolicznik' },
  { code: 'II.1.9', group: G_II1, text: 'wyrazy poza zdaniem' },
  { code: 'II.1.10', group: G_II1, text: 'związki wyrazów w zdaniu, człon nadrzędny i podrzędny' },
  { code: 'II.1.11', group: G_II1, text: 'wypowiedzenia oznajmujące, pytające, rozkazujące' },
  { code: 'II.1.12', group: G_II1, text: 'zdanie pojedyncze, złożone, równoważniki zdań' },
  { code: 'II.1.13', group: G_II1, text: 'przekształca konstrukcje składniowe' },
  { code: 'II.2.1', group: G_II2, text: 'cechy języka mówionego i pisanego' },
  { code: 'II.2.2', group: G_II2, text: 'oficjalna i nieoficjalna odmiana polszczyzny' },
  { code: 'II.2.3', group: G_II2, text: 'styl stosowny do sytuacji komunikacyjnej' },
  { code: 'II.2.4', group: G_II2, text: 'znaczenie dosłowne i przenośne; wyrazy wieloznaczne' },
  { code: 'II.2.5', group: G_II2, text: 'związki frazeologiczne' },
  { code: 'II.2.6', group: G_II2, text: 'słownictwo neutralne i wartościujące' },
  { code: 'II.2.7', group: G_II2, text: 'dostosowuje sposób wyrażania się do celu wypowiedzi' },
  { code: 'II.2.8', group: G_II2, text: 'synonimy i antonimy' },
  { code: 'II.2.9', group: G_II2, text: 'spójność formalna i semantyczna tekstu' },
  { code: 'II.3.1', group: G_II3, text: 'tekst jako komunikat: informacyjny, literacki, reklamowy, ikoniczny' },
  { code: 'II.3.2', group: G_II3, text: 'nadawca i odbiorca wypowiedzi' },
  { code: 'II.3.3', group: G_II3, text: 'sytuacja komunikacyjna i jej wpływ na wypowiedź' },
  { code: 'II.3.4', group: G_II3, text: 'niewerbalne środki komunikacji' },
  { code: 'II.3.5', group: G_II3, text: 'głoska, litera, sylaba, akcent; reguły akcentowania' },
  { code: 'II.3.6', group: G_II3, text: 'intonacja poprawna ze względu na cel wypowiedzi' },
  { code: 'II.3.7', group: G_II3, text: 'etykieta językowa' },
  { code: 'II.4.1', group: G_II4, text: 'pisze poprawnie ortograficznie, stosuje reguły pisowni' },
  { code: 'II.4.2', group: G_II4, text: 'poprawnie używa znaków interpunkcyjnych' },
  { code: 'III.1.1', group: G_III1, text: 'uczestniczy w rozmowie na zadany temat' },
  { code: 'III.1.2', group: G_III1, text: 'argumenty odnoszące się do faktów i logiki oraz do emocji' },
  { code: 'III.1.3', group: G_III1, text: 'tworzy logiczną, uporządkowaną wypowiedź; rola akapitów' },
  { code: 'III.1.4', group: G_III1, text: 'dokonuje selekcji informacji' },
  { code: 'III.1.5', group: G_III1, text: 'zasady budowania akapitów' },
  { code: 'III.1.6', group: G_III1, text: 'środki perswazji' },
  { code: 'III.2.1', group: G_III2, text: 'formy: dialog, opowiadanie, opis, list, sprawozdanie, dedykacja, zaproszenie, podziękowanie, ogłoszenie, życzenia, charakterystyka, tekst argumentacyjny' },
  { code: 'III.2.2', group: G_III2, text: 'wygłasza z pamięci tekst z odpowiednią intonacją i dykcją' },
  { code: 'III.2.3', group: G_III2, text: 'tworzy plan odtwórczy i twórczy tekstu' },
  { code: 'III.2.4', group: G_III2, text: 'redaguje notatki' },
  { code: 'III.2.5', group: G_III2, text: 'opowiada o przeczytanym tekście' },
  { code: 'III.2.6', group: G_III2, text: 'współczesne formy komunikatów (e-mail, SMS) i etykieta' },
  { code: 'III.2.7', group: G_III2, text: 'tworzy opowiadania związane z treścią utworu' },
  { code: 'III.2.8', group: G_III2, text: 'redaguje scenariusz filmowy' },
  { code: 'III.2.9', group: G_III2, text: 'wykorzystuje wiedzę o języku w wypowiedziach' },
  { code: 'IV.1', group: G_IV, text: 'doskonali ciche i głośne czytanie' },
  { code: 'IV.2', group: G_IV, text: 'różne formy zapisywania informacji' },
  { code: 'IV.3', group: G_IV, text: 'korzysta z informacji z różnych źródeł, selekcjonuje' },
  { code: 'IV.4', group: G_IV, text: 'zasady korzystania z zasobów bibliotecznych' },
  { code: 'IV.5', group: G_IV, text: 'korzysta ze słowników' },
  { code: 'IV.6', group: G_IV, text: 'typy definicji słownikowych' },
  { code: 'IV.7', group: G_IV, text: 'krytyczna ocena informacji' },
  { code: 'IV.8', group: G_IV, text: 'życie kulturalne regionu' },
  { code: 'IV.9', group: G_IV, text: 'technologia informacyjna i zasoby internetowe' },
];

export function curriculumByCode(code: string): CurriculumItem | undefined {
  return CURRICULUM.find((c) => c.code === code);
}
