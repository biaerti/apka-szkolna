// Lista lektur z aktualnej podstawy programowej dla klas IV-VI.
// Zrodlo: rozporzadzenie Ministra Edukacji z 28 czerwca 2024 r. (Dz.U. 2024 poz. 996),
// obowiazuje od roku szkolnego 2024/2025.
// Po zmianach 2024: dla klas IV-VI zostalo 5 lektur obowiazkowych czytanych w calosci,
// osobna lista krotkich utworow / fragmentow / poezji oraz JEDNA wspolna lista
// przykladowych lektur uzupelniajacych dla klas IV-VIII (wczesniej osobna dla IV-VI).

export interface Lektura {
  autor?: string;
  tytul: string;
}

// Lektury obowiazkowe - pozycje ksiazkowe poznawane w calosci
export const LEKTURY_OBOWIAZKOWE: Lektura[] = [
  { autor: 'Jan Brzechwa', tytul: 'Akademia Pana Kleksa' },
  { autor: 'Janusz Christa', tytul: 'Kajko i Kokosz. Szkoła latania (komiks)' },
  { autor: 'Clive Staples Lewis', tytul: 'Opowieści z Narnii. Lew, czarownica i stara szafa' },
  { autor: 'Ferenc Molnár', tytul: 'Chłopcy z Placu Broni' },
  { autor: 'John Ronald Reuel Tolkien', tytul: 'Hobbit, czyli tam i z powrotem' },
];

// Krotkie utwory poznawane w calosci, utwory poznawane we fragmentach i utwory poetyckie
export const LEKTURY_KROTKIE: Lektura[] = [
  { autor: 'René Goscinny, Jean-Jacques Sempé', tytul: 'Mikołajek (wybór opowiadań)' },
  { autor: 'Ignacy Krasicki', tytul: 'wybrane bajki' },
  { autor: 'Adam Mickiewicz', tytul: 'Pan Tadeusz (wybrane fragmenty)' },
  { autor: 'Józef Wybicki', tytul: 'Mazurek Dąbrowskiego' },
  { tytul: 'wybrane mity greckie, w tym mit o powstaniu świata oraz mity o Prometeuszu, o Syzyfie, o Demeter i Korze, o Dedalu i Ikarze, o Heraklesie, o Tezeuszu i Ariadnie' },
  { tytul: 'Biblia: stworzenie świata i człowieka oraz wybrane przypowieści ewangeliczne, w tym o talentach, o miłosiernym Samarytaninie' },
  { tytul: 'wybrane podania i legendy polskie' },
  { tytul: 'wybrane baśnie polskie i europejskie' },
  { tytul: 'wybrane wiersze: Jana Brzechwy, Konstantego Ildefonsa Gałczyńskiego, Anny Kamieńskiej, Joanny Kulmowej, Adama Mickiewicza, Juliusza Słowackiego, Leopolda Staffa, Juliana Tuwima, Jana Twardowskiego, oraz pieśni patriotyczne (w tym Rota Marii Konopnickiej)' },
];

export const LEKTURY_KROTKIE_PRZYPIS =
  'Na egzaminie ósmoklasisty nie obowiązuje znajomość treści i problematyki krótkich utworów literackich poznawanych w całości, utworów literackich poznawanych we fragmentach i utworów poetyckich dla klas IV-VI.';

// Przykladowe lektury uzupelniajace - od 2024 r. jedna wspolna lista dla klas IV-VIII
export const LEKTURY_UZUPELNIAJACE: Lektura[] = [
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
];

export const LEKTURY_UZUPELNIAJACE_ZASADA =
  'W każdym roku szkolnym w klasach IV-VI obowiązkowo poznawane są co najmniej dwie pozycje książkowe z listy przykładowych lektur uzupełniających lub spoza tej listy, wybrane przez nauczyciela lub zaproponowane przez uczniów.';

export const LEKTURY_ZRODLO =
  'Rozporządzenie Ministra Edukacji z dnia 28 czerwca 2024 r. (Dz.U. 2024 poz. 996), obowiązuje od roku szkolnego 2024/2025.';
