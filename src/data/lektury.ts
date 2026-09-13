// Lista lektur z aktualnej podstawy programowej dla klas IV-VI.
// Zrodlo: rozporzadzenie Ministra Edukacji z 28 czerwca 2024 r. (Dz.U. 2024 poz. 996),
// obowiazuje od roku szkolnego 2024/2025.
// Po zmianach 2024: dla klas IV-VI zostalo 5 lektur obowiazkowych czytanych w calosci,
// osobna lista krotkich utworow / fragmentow / poezji oraz JEDNA wspolna lista
// przykladowych lektur uzupelniajacych dla klas IV-VIII (wczesniej osobna dla IV-VI).

export interface Lektura {
  id: string;
  autor?: string;
  tytul: string;
}

type LekturaBezId = Omit<Lektura, 'id'>;

function katalog(prefix: string, pozycje: LekturaBezId[]): Lektura[] {
  return pozycje.map((pozycja, index) => ({ ...pozycja, id: `${prefix}-${index + 1}` }));
}

// Lektury obowiazkowe - pozycje ksiazkowe poznawane w calosci
export const LEKTURY_OBOWIAZKOWE: Lektura[] = katalog('stara-obowiazkowa', [
  { autor: 'Jan Brzechwa', tytul: 'Akademia Pana Kleksa' },
  { autor: 'Janusz Christa', tytul: 'Kajko i Kokosz. Szkoła latania (komiks)' },
  { autor: 'Clive Staples Lewis', tytul: 'Opowieści z Narnii. Lew, czarownica i stara szafa' },
  { autor: 'Ferenc Molnár', tytul: 'Chłopcy z Placu Broni' },
  { autor: 'John Ronald Reuel Tolkien', tytul: 'Hobbit, czyli tam i z powrotem' },
]);

// Krotkie utwory poznawane w calosci, utwory poznawane we fragmentach i utwory poetyckie
export const LEKTURY_KROTKIE: Lektura[] = katalog('stara-krotka', [
  { autor: 'René Goscinny, Jean-Jacques Sempé', tytul: 'Mikołajek (wybór opowiadań)' },
  { autor: 'Ignacy Krasicki', tytul: 'wybrane bajki' },
  { autor: 'Adam Mickiewicz', tytul: 'Pan Tadeusz (wybrane fragmenty)' },
  { autor: 'Józef Wybicki', tytul: 'Mazurek Dąbrowskiego' },
  { tytul: 'wybrane mity greckie, w tym mit o powstaniu świata oraz mity o Prometeuszu, o Syzyfie, o Demeter i Korze, o Dedalu i Ikarze, o Heraklesie, o Tezeuszu i Ariadnie' },
  { tytul: 'Biblia: stworzenie świata i człowieka oraz wybrane przypowieści ewangeliczne, w tym o talentach, o miłosiernym Samarytaninie' },
  { tytul: 'wybrane podania i legendy polskie' },
  { tytul: 'wybrane baśnie polskie i europejskie' },
  { tytul: 'wybrane wiersze: Jana Brzechwy, Konstantego Ildefonsa Gałczyńskiego, Anny Kamieńskiej, Joanny Kulmowej, Adama Mickiewicza, Juliusza Słowackiego, Leopolda Staffa, Juliana Tuwima, Jana Twardowskiego, oraz pieśni patriotyczne (w tym Rota Marii Konopnickiej)' },
]);

export const LEKTURY_KROTKIE_PRZYPIS =
  'Na egzaminie ósmoklasisty nie obowiązuje znajomość treści i problematyki krótkich utworów literackich poznawanych w całości, utworów literackich poznawanych we fragmentach i utworów poetyckich dla klas IV-VI.';

// Przykladowe lektury uzupelniajace - od 2024 r. jedna wspolna lista dla klas IV-VIII
export const LEKTURY_UZUPELNIAJACE: Lektura[] = katalog('stara-uzupelniajaca', [
  { autor: 'Adam Bahdaj', tytul: 'Kapelusz za 100 tysięcy' },
  { autor: 'Miron Białoszewski', tytul: 'Pamiętnik z powstania warszawskiego (fragmenty)' },
  { autor: 'Justyna Bednarek', tytul: 'Dom nr 5' },
  { autor: 'Paweł Beręsewicz', tytul: 'Wszystkie lajki Marczuka' },
  { autor: 'Frances Hodgson Burnett', tytul: 'Tajemniczy ogród lub inna powieść' },
  { autor: 'Lewis Carroll', tytul: 'Alicja w Krainie Czarów' },
  { autor: 'Agatha Christie', tytul: 'wybrana powieść kryminalna' },
  { autor: 'Carlo Collodi', tytul: 'Pinokio' },
  { autor: 'Lloyd Cassel Douglas', tytul: 'Wielki Rybak' },
  { autor: 'Aleksander Dumas', tytul: 'Trzej muszkieterowie' },
  { autor: 'Arkady Fiedler', tytul: 'Dywizjon 303' },
  { autor: 'John Flanagan', tytul: 'Zwiadowcy. Księga 1. Ruiny Gorlanu' },
  { autor: 'Olaf Fritsche', tytul: 'Skarb Troi' },
  { autor: 'Ernest Hemingway', tytul: 'Stary człowiek i morze' },
  { autor: 'Emilia Kiereś', tytul: 'Rzeka' },
  { autor: 'Joseph Rudyard Kipling', tytul: 'Księga dżungli' },
  { autor: 'Janusz Korczak', tytul: 'Król Maciuś Pierwszy, Bankructwo małego Dżeka' },
  { autor: 'Rafał Kosik', tytul: 'Felix, Net i Nika oraz Gang Niewidzialnych Ludzi' },
  { autor: 'Barbara Kosmowska', tytul: 'Pozłacana rybka' },
  { autor: 'Barbara Kosmowska, Paweł Beręsewicz i inni', tytul: 'Gorzka czekolada i inne opowiadania o ważnych sprawach' },
  { autor: 'Zofia Kossak-Szczucka', tytul: 'Bursztyny (wybrane opowiadanie), Topsy i Lupus' },
  { autor: 'Marcin Kozioł', tytul: 'Skrzynia Władcy Piorunów' },
  { autor: 'Selma Lagerlöf', tytul: 'Cudowna podróż' },
  { autor: 'Karolina Lanckorońska', tytul: 'Wspomnienia wojenne 22 IX 1939 - 5 IV 1945 (fragmenty)' },
  { autor: 'Stanisław Lem', tytul: 'Cyberiada (fragmenty)' },
  { autor: 'Bolesław Leśmian', tytul: 'Klechdy sezamowe' },
  { autor: 'Kornel Makuszyński', tytul: 'wybrana powieść' },
  { autor: 'Andrzej Maleszka', tytul: 'Magiczne drzewo' },
  { autor: 'Alan Aleksander Milne', tytul: 'Kubuś Puchatek' },
  { autor: 'Lucy Maud Montgomery', tytul: 'Ania z Zielonego Wzgórza' },
  { autor: 'Małgorzata Musierowicz', tytul: 'wybrana powieść' },
  { autor: 'Ewa Nowak', tytul: 'Pajączek na rowerze' },
  { autor: 'Edmund Niziurski', tytul: 'Sposób na Alcybiadesa' },
  { autor: 'Sat-Okh', tytul: 'Biały Mustang' },
  { autor: 'Longin Jan Okoń', tytul: 'Tecumseh' },
  { autor: 'Raquel Jaramillo Palacio', tytul: 'Cudowny chłopak' },
  { autor: 'Katherine Paterson', tytul: 'Most do Terabithii' },
  { autor: 'Sara Pennypacker', tytul: 'Pax' },
  { autor: 'Jacek Podsiadło', tytul: 'Czerwona kartka dla Sprężyny' },
  { autor: 'Bolesław Prus', tytul: 'Katarynka, Placówka, Zemsta' },
  { autor: 'Rick Riordan', tytul: 'Percy Jackson i bogowie olimpijscy' },
  { autor: 'Henryk Sienkiewicz', tytul: 'Janko Muzykant, Krzyżacy, Sąd Ozyrysa, W pustyni i w puszczy' },
  { autor: 'Eric-Emmanuel Schmitt', tytul: 'Oskar i pani Róża' },
  { autor: 'Nicolas Sparks', tytul: 'Jesienna miłość' },
  { autor: 'Marcin Szczygielski', tytul: 'Teatr Niewidzialnych Dzieci, Arka czasu' },
  { autor: 'Alfred Szklarski', tytul: 'wybrana powieść' },
  { autor: 'Mark Twain', tytul: 'Przygody Tomka Sawyera' },
  { autor: 'Melchior Wańkowicz', tytul: 'Bitwa o Monte Cassino (fragmenty), Ziele na kraterze' },
  { autor: 'Danuta Wawiłow, Natalia Usenko', tytul: 'Wierzbowa 13. Opowieści z Wierzbowej 13' },
  { autor: 'Louis de Wohl', tytul: 'Posłaniec króla' },
  { autor: 'Roksana Jędrzejewska-Wróbel', tytul: 'Stan splątania' },
  { autor: 'Marcus Zusak', tytul: 'Złodziejka książek' },
  { tytul: 'wybrane pozycje z serii Nazywam się... (np. Mikołaj Kopernik, Fryderyk Chopin, Maria Skłodowska-Curie, Jan Paweł II i inni)' },
  { tytul: 'inne utwory literackie i teksty kultury, w tym wiersze poetów współczesnych i reportaże' },
]);

export const LEKTURY_UZUPELNIAJACE_ZASADA =
  'W każdym roku szkolnym w klasach IV-VI obowiązkowo poznawane są co najmniej dwie pozycje książkowe z listy przykładowych lektur uzupełniających lub spoza tej listy, wybrane przez nauczyciela lub zaproponowane przez uczniów.';

export const LEKTURY_ZRODLO =
  'Rozporządzenie Ministra Edukacji z dnia 28 czerwca 2024 r. (Dz.U. 2024 poz. 996), obowiązuje od roku szkolnego 2024/2025.';

// Klasa IV od roku szkolnego 2026/2027 realizuje nowa podstawe. Nie ma w niej
// sztywnej listy obowiazkowych tytulow: nauczyciel i uczniowie wybieraja co
// najmniej 4 dluzsze teksty z ponizszej listy przykladowej lub spoza niej.
// To czesc "Teksty narracyjne i dramatyczne" wspolnej listy dla klas IV-VIII.
export const LEKTURY_IV_2026_KATALOG: Lektura[] = katalog('nowa-narracyjna', [
  { autor: 'Adam Bahdaj', tytul: 'Do przerwy 0:1 lub inna powieść' },
  { autor: 'Justyna Bednarek', tytul: 'Dom numer 5' },
  { autor: 'Paweł Beręsewicz', tytul: 'Wszystkie lajki Marczuka, Szeptane lub inna powieść' },
  { autor: 'Miron Białoszewski', tytul: 'Pamiętnik z powstania warszawskiego (fragmenty)' },
  { autor: 'Karol Olgierd Borchardt', tytul: 'Znaczy Kapitan' },
  { autor: 'Frances Hodgson Burnett', tytul: 'Tajemniczy ogród lub inna powieść' },
  { autor: 'Lewis Carroll', tytul: 'Alicja w Krainie Czarów' },
  { autor: 'Marine Carteron', tytul: 'wybrana powieść z serii Podpalacze książek' },
  { autor: 'Joanna Chmielewska', tytul: 'Nawiedzony dom, Zwyczajne życie' },
  { autor: 'Agatha Christie', tytul: 'wybrana powieść kryminalna' },
  { autor: 'Carlo Collodi', tytul: 'Pinokio' },
  { autor: 'Sarah Crossan', tytul: 'Kasieńka, My dwie, my trzy, my cztery, Tippi i ja, Kończy się czas' },
  { autor: 'Charles Dickens', tytul: 'Opowieść wigilijna' },
  { autor: 'Lloyd Cassel Douglas', tytul: 'Wielki Rybak' },
  { autor: 'Jacek Dukaj', tytul: 'Wroniec' },
  { autor: 'Aleksander Dumas', tytul: 'Trzej muszkieterowie' },
  { autor: 'Michael Ende', tytul: 'Momo, Niekończąca się historia' },
  { autor: 'John Flanagan', tytul: 'wybrana powieść z cyklu Zwiadowcy' },
  { autor: 'Aleksander Fredro', tytul: 'Zemsta, Śluby panieńskie' },
  { autor: 'Olaf Fritsche', tytul: 'Skarb Troi' },
  { autor: 'Ernest Hemingway', tytul: 'Stary człowiek i morze' },
  { autor: 'Roksana Jędrzejewska-Wróbel', tytul: 'Stan splątania' },
  { autor: 'Grzegorz Kasdepke', tytul: 'wybrana powieść' },
  { autor: 'Jacqueline Kelly', tytul: 'Ewolucja według Calpurnii Tate' },
  { autor: 'Emilia Kiereś', tytul: 'Rzeka' },
  { autor: 'Joseph Rudyard Kipling', tytul: 'Księga dżungli' },
  { autor: 'Nancy H. Kleinbaum', tytul: 'Stowarzyszenie umarłych poetów' },
  { autor: 'Janusz Korczak', tytul: 'Król Maciuś Pierwszy, Bankructwo małego Dżeka' },
  { autor: 'Rafał Kosik', tytul: 'Felix, Net i Nika oraz Gang Niewidzialnych Ludzi' },
  { autor: 'Barbara Kosmowska', tytul: 'Pozłacana rybka' },
  { autor: 'Zofia Kossak-Szczucka', tytul: 'Topsy i Lupus, wybrane opowiadanie z tomu Bursztyny' },
  { autor: 'Marcin Kozioł', tytul: 'Skrzynia Władcy Piorunów' },
  { autor: 'Alice Kuipers', tytul: 'Najgorsza rzecz, jaką zrobiła, Życie na drzwiach lodówki: powieść w notatkach' },
  { autor: 'Selma Lagerlöf', tytul: 'Cudowna podróż' },
  { autor: 'Ursula K. Le Guin', tytul: 'Czarnoksiężnik z Archipelagu' },
  { autor: 'Stanisław Lem', tytul: 'Cyberiada, Bajki robotów' },
  { autor: 'Bolesław Leśmian', tytul: 'Klechdy sezamowe' },
  { autor: 'Clive Staples Lewis', tytul: 'wybrana powieść z cyklu Opowieści z Narnii' },
  { autor: 'Astrid Lindgren', tytul: 'Bracia Lwie Serce, Ronja, córka zbójnika' },
  { autor: 'Kornel Makuszyński', tytul: 'wybrana powieść' },
  { autor: 'Andrzej Maleszka', tytul: 'wybrana powieść z cyklu Magiczne drzewo' },
  { autor: 'Alan Aleksander Milne', tytul: 'Kubuś Puchatek' },
  { autor: 'Ferenc Molnár', tytul: 'Chłopcy z Placu Broni (Chłopcy z ulicy Pawła)' },
  { autor: 'Lucy Maud Montgomery', tytul: 'Ania z Zielonego Wzgórza (Anne z Zielonych Szczytów)' },
  { autor: 'Brandon Mull', tytul: 'Wojna cukierkowa, Baśniobór' },
  { autor: 'Małgorzata Musierowicz', tytul: 'wybrana powieść z cyklu Jeżycjada' },
  { autor: 'Edmund Niziurski', tytul: 'Sposób na Alcybiadesa' },
  { autor: 'Ewa Nowak', tytul: 'Pajączek na rowerze' },
  { autor: 'Longin Jan Okoń', tytul: 'Tecumseh' },
  { autor: 'George Orwell', tytul: 'Folwark zwierzęcy' },
  { autor: 'Ferdynand Antoni Ossendowski', tytul: 'Słoń Birara' },
  { autor: 'Raquel Jaramillo Palacio', tytul: 'Cudowny chłopak' },
  { autor: 'Katherine Paterson', tytul: 'Most do Terabithii' },
  { autor: 'Sara Pennypacker', tytul: 'Pax' },
  { autor: 'Jacek Podsiadło', tytul: 'Czerwona kartka dla Sprężyny' },
  { autor: 'Rick Riordan', tytul: 'wybrana powieść z cyklu Percy Jackson i bogowie olimpijscy' },
  { autor: 'J.K. Rowling', tytul: 'wybrana powieść o Harrym Potterze' },
  { autor: 'Katarzyna Ryrych', tytul: 'Król, Wyspa mojej siostry, Lato na Rodos' },
  { autor: 'Antoine de Saint-Exupéry', tytul: 'Mały Książę' },
  { autor: 'Éric-Emmanuel Schmitt', tytul: 'Oskar i pani Róża' },
  { autor: 'William Shakespeare', tytul: 'Romeo i Julia, Sen nocy letniej' },
  { autor: 'Henryk Sienkiewicz', tytul: 'Krzyżacy, W pustyni i w puszczy, Quo vadis' },
  { autor: 'Linn Skåber', tytul: 'Młodość. Wyznania nastolatków' },
  { autor: 'Nancy Springer', tytul: 'wybrana powieść z cyklu Enola Holmes' },
  { autor: 'Erin Stewart', tytul: 'Blizny jak skrzydła' },
  { autor: 'Marcin Szczygielski', tytul: 'Teatr Niewidzialnych Dzieci, Arka Czasu' },
  { autor: 'Alfred Szklarski', tytul: 'wybrana powieść o Tomku Wilmowskim' },
  { autor: 'Dorota Terakowska', tytul: 'Tam, gdzie spadają anioły, Córka czarownic' },
  { autor: 'John Ronald Reuel Tolkien', tytul: 'Hobbit, czyli tam i z powrotem' },
  { autor: 'Mark Twain', tytul: 'Przygody Tomka Sawyera' },
  { autor: 'Katarzyna Wasilkowska', tytul: 'Już, już!' },
  { autor: 'Danuta Wawiłow, Natalia Usenko', tytul: 'Wierzbowa 13. Opowieści z Wierzbowej 13' },
  { autor: 'Louis de Wohl', tytul: 'Posłaniec króla' },
  { autor: 'Karol Wojtyła', tytul: 'wybrany utwór' },
  { autor: 'Markus Zusak', tytul: 'Złodziejka książek' },
  { autor: 'Stefan Żeromski', tytul: 'Syzyfowe prace, Siłaczka' },
]);

// Krotka, praktyczna podpowiedz dla czwartej klasy. To nie jest osobny kanon
// ministerialny - tytuly nadal trzeba zatwierdzic z uczniami.
export const LEKTURY_IV_2026_POLECANE_IDS = new Set([
  'nowa-narracyjna-1',
  'nowa-narracyjna-6',
  'nowa-narracyjna-17',
  'nowa-narracyjna-23',
  'nowa-narracyjna-32',
  'nowa-narracyjna-38',
  'nowa-narracyjna-39',
  'nowa-narracyjna-41',
  'nowa-narracyjna-43',
  'nowa-narracyjna-48',
  'nowa-narracyjna-52',
  'nowa-narracyjna-54',
  'nowa-narracyjna-70',
]);

export const LEKTURY_IV_2026_STALE_TEKSTY: Lektura[] = katalog('nowa-stala', [
  { tytul: 'wybrane fragmenty Biblii: stworzenie świata, przypowieść o miłosiernym Samarytaninie i o synu marnotrawnym' },
  { tytul: 'wybrane mity greckie: stworzenie świata, Syzyf, Dedal i Ikar, Demeter i Kora' },
  { tytul: 'baśnie i legendy ważne dla kultury światowej, europejskiej, narodowej i regionalnej' },
  { autor: 'Józef Wybicki', tytul: 'Mazurek Dąbrowskiego' },
  { autor: 'Maria Konopnicka', tytul: 'Rota' },
]);

export const LEKTURY_IV_2026_ZASADA =
  'W każdym roku szkolnym uczeń czyta nie mniej niż 4 dłuższe teksty literackie dla dzieci i młodzieży, wybrane wspólnie przez nauczyciela i uczniów z listy przykładowej lub spoza niej.';

export const LEKTURY_IV_2026_ZRODLO =
  'Rozporządzenie Ministra Edukacji z dnia 11 marca 2026 r. (Dz.U. 2026 poz. 378), obowiązuje klasę IV od roku szkolnego 2026/2027.';
