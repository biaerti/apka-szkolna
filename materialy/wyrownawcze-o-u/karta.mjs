// Karta na zajęcia wyrównawcze: ó czy u? Te same sposoby co lekcja 37 kl. 4
// (textbook4rozdzial3.ts), w wersji od zera. Do prezentacji
// public/materialy/wyrownawcze/o-u-prezentacja.html (przykłady na karcie są inne niż w prezentacji).
// Generator: node materialy/karta.mjs wyrownawcze-o-u

export const KARTA = {
  plik: 'wyrownawcze-o-u-karta',
  klasa: 'Wyrównawcze',
  tytul: 'Ó czy u?',
  podtytul: 'sposoby na pisownię',
  duza: true,
  tematy: [
    {
      tytul: 'Ó zamienia się w o',
      wiedza: [
        'Zmień wyraz: **więcej sztuk** albo **wyraz z rodziny**.',
        'Słyszysz **o**? Piszesz **ó**: st==ó==ł - st==o==ły',
      ],
      zadania: [
        {
          polecenie: 'Wpisz ó. Obok napisz wyraz, w którym słychać o.',
          info: 'Powiedz: dwa..., dużo..., albo poszukaj wyrazu z tej samej rodziny. Jeśli w tym miejscu słychać „o”, piszesz „ó”.',
          przyklad: [
            'w__z',
            'Mówię: dwa ==wozy==',
            'Słychać **o** ➜ piszę ==ó==',
            'w==ó==z',
          ],
          kolumny: 2,
          linie: [
            'l[[ó|6]]d ➜ [[lody|26]]',
            'ogr[[ó|6]]d ➜ [[ogrody|26]]',
            'samoch[[ó|6]]d ➜ [[samochody|26]]',
            'k[[ó|6]]łko ➜ [[koło|26]]',
            'm[[ó|6]]j ➜ [[moja|26]]',
            'zr[[ó|6]]b ➜ [[zrobić|26]]',
            'b[[ó|6]]l ➜ [[boli|26]]',
            'kr[[ó|6]]wka ➜ [[krowa|26]]',
          ],
        },
      ],
    },
    {
      tytul: 'Ó na końcu wyrazu',
      wiedza: [
        'Na końcu **-ów** i **-ówka** piszemy **ó**.',
        'Krak==ó==w, kot==ó==w, żar==ó==wka',
      ],
      zadania: [
        {
          polecenie: 'Wpisz ó w zakończeniu.',
          info: 'Posłuchaj końcówki. Słychać „-ów” albo „-ówka”? Piszesz „ó”.',
          przyklad: [
            'pocztówka',
            'Końcówka: ==-ówka==',
            'Piszę ==ó==: poczt==ó==wka',
          ],
          kolumny: 2,
          linie: [
            'Tarn[[ó|6]]w',
            'Rzesz[[ó|6]]w',
            'dużo balon[[ó|6]]w',
            'pięć kwiatk[[ó|6]]w',
            'złot[[ó|6]]wka',
            'ciężar[[ó|6]]wka',
            'sześć obrazk[[ó|6]]w',
            'wiele samolot[[ó|6]]w',
          ],
        },
        {
          polecenie: 'Ile ich jest? Dokończ.',
          info: 'Po „pięć” wyraz często kończy się na „-ów”. Wtedy piszesz „ó”.',
          przyklad: [
            'jeden kot ➜ pięć ...',
            'pięć ==kotów==',
            'Końcówka -ów ➜ piszę ==ó==',
          ],
          kolumny: 2,
          linie: [
            'jeden ptak ➜ pięć [[ptaków|24]]',
            'jeden pies ➜ pięć [[psów|24]]',
            'jeden lew ➜ pięć [[lwów|24]]',
            'jeden ząb ➜ pięć [[zębów|24]]',
            'jeden but ➜ pięć [[butów|24]]',
            'jeden lis ➜ pięć [[lisów|24]]',
          ],
        },
      ],
    },
    {
      tytul: 'Kiedy piszemy u?',
      wiedza: [
        'Na **początku** i **końcu** wyrazu: ==u==cho, w dom==u==',
        'W **-uje, -unek, -uszek, -utki**: mal==u==je, rys==u==nek',
      ],
      zadania: [
        {
          polecenie: 'Wpisz u.',
          info: 'Sprawdź, gdzie jest luka: na początku, na końcu wyrazu, a może w zakończeniu -uje, -unek, -uszek, -utki? Wszędzie tam piszesz „u”.',
          przyklad: [
            '__lica',
            'Luka na **początku** wyrazu ➜ ==u==',
            '==u==lica',
            'prac__je ➜ zakończenie -uje ➜ prac==u==je',
          ],
          kolumny: 2,
          linie: [
            '[[u|6]]l',
            '[[u|6]]śmiech',
            'do park[[u|6]]',
            'bud[[u|6]]je',
            'got[[u|6]]je',
            'rat[[u|6]]nek',
            'kwiat[[u|6]]szek',
            'cieni[[u|6]]tki',
          ],
        },
        {
          polecenie: 'Zakreśl dobrze napisany wyraz.',
          info: 'Poszukaj zakończenia albo sprawdź, czy litera stoi na początku wyrazu.',
          przyklad: [
            'pracuje czy pracóje?',
            'Zakończenie ==-uje==',
            'Zawsze przez u ➜ ==pracuje==',
          ],
          kolumny: 2,
          linie: [
            '{{*maluje|malóje}}',
            '{{rysónek|*rysunek}}',
            '{{*ucho|ócho}}',
            '{{fartószek|*fartuszek}}',
          ],
        },
      ],
    },
    {
      tytul: 'Wszystko razem',
      wiedza: [
        'Szukam sposobu: **o?** **-ów?** **początek?** **-uje?**',
        'Nie ma sposobu - **zapamiętuję**: góra, król, cukier.',
      ],
      zadania: [
        {
          polecenie: 'Wpisz ó albo u i zakreśl sposób.',
          info: 'Po kolei: czy słychać „o” w innym wyrazie? Czy to zakończenie? Czy litera jest na początku wyrazu? Jeśli nic nie pasuje - wyraz trzeba zapamiętać.',
          przyklad: [
            'n__żka',
            'Wyraz z rodziny: ==noga== - słychać o',
            'Piszę ==ó==: nóżka ➜ sposób: ==ó ➜ o==',
          ],
          linie: [
            'k[[ó|6]]łeczko  {{*ó ➜ o|zakończenie|początek|zapamiętaj}}',
            'rys[[u|6]]je  {{ó ➜ o|*zakończenie|początek|zapamiętaj}}',
            '[[u|6]]cieka  {{ó ➜ o|zakończenie|*początek|zapamiętaj}}',
            'kr[[ó|6]]l  {{ó ➜ o|zakończenie|początek|*zapamiętaj}}',
            'n[[ó|6]]żka  {{*ó ➜ o|zakończenie|początek|zapamiętaj}}',
            'zeszyt[[ó|6]]w  {{ó ➜ o|*zakończenie|początek|zapamiętaj}}',
            'ż[[ó|6]]łw  {{ó ➜ o|zakończenie|początek|*zapamiętaj}}',
            'ogr[[ó|6]]dek  {{*ó ➜ o|zakończenie|początek|zapamiętaj}}',
          ],
        },
        {
          polecenie: 'Napisz zdanie z wyrazem „ogórek” albo „rysunek”.',
          info: 'Zdanie zaczynasz wielką literą i kończysz kropką. Sprawdź, czy dobrze napisałeś ó albo u.',
          przyklad: [
            'Wyraz: **kubek**',
            '==Mam niebieski kubek.==',
          ],
          pisanie: 2,
          wzor: 'Na kanapce mam plasterki ogórka.\nNarysowałam ładny rysunek.',
        },
      ],
    },
  ],
};
