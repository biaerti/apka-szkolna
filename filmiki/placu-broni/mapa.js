// Mapa okolicy Placu Broni (schemat, nie w skali) - wspolna dla filmow 1, 3 i 5.
// Wstawiana podczas parsowania strony, zanim player.js policzy opoznienia:
//   <script>wstawMape({ plac: 'plac', ... }, '<g>...nakladka...</g>')</script>
// Klucze w `slowa` to czesci mapy, wartosci to slowo narracji (data-slowo),
// przy ktorym czesc ma sie pojawic. Czesc bez klucza widac od poczatku.
// Wartosc moze byc tez obiektem { slowo, po } albo { t } (data-po, data-t).
// bezNapisu: true - maly napis PLAC BRONI u gory, zeby zmiescic plan bitwy.

(function () {
  function atr(slowa, klucz) {
    var v = slowa && slowa[klucz];
    if (v === undefined) return '';
    if (typeof v === 'string') v = { slowo: v };
    var a = ' class="m-zjaw"';
    if (v.slowo) a += ' data-slowo="' + v.slowo + '"';
    if (v.po) a += ' data-po="' + v.po + '"';
    if (v.t !== undefined) a += ' data-t="' + v.t + '"';
    return a;
  }

  function sagi() {
    var s = '';
    for (var i = 0; i < 4; i++) {
      var y = 114 + i * 54;
      s += '<rect x="660" y="' + y + '" width="110" height="40" rx="6" fill="#B7834A" stroke="#7A5530" stroke-width="3"/>' +
        '<line x1="660" y1="' + (y + 13) + '" x2="770" y2="' + (y + 13) + '" stroke="#7A5530" stroke-width="2"/>' +
        '<line x1="660" y1="' + (y + 27) + '" x2="770" y2="' + (y + 27) + '" stroke="#7A5530" stroke-width="2"/>';
    }
    return s;
  }

  function kamienice(y) {
    var s = '';
    for (var x = 10; x < 1130; x += 94) {
      s += '<rect x="' + x + '" y="' + y + '" width="84" height="34" rx="4" fill="#D8CFC2" stroke="#B9AD9C" stroke-width="2"/>';
    }
    return s;
  }

  window.mapaSVG = function (slowa, nakladka) {
    return '<svg class="mapa" viewBox="0 0 1140 520" xmlns="http://www.w3.org/2000/svg">' +
      // kamienice i ulice
      '<g>' + kamienice(2) + kamienice(484) + '</g>' +
      '<g' + atr(slowa, 'ulice') + '>' +
        '<rect x="0" y="40" width="1140" height="42" fill="#A99E90"/>' +
        '<rect x="0" y="440" width="1140" height="42" fill="#A99E90"/>' +
        '<text x="455" y="70" class="m-ulica">ulica Pawła</text>' +
        '<text x="455" y="470" class="m-ulica">ulica Marii</text>' +
      '</g>' +
      // ogrod przy Muzeum + dom Nemeczka
      '<g' + atr(slowa, 'muzeum') + '>' +
        '<rect x="20" y="100" width="230" height="200" rx="26" fill="#9FD18B" stroke="#5E9E4B" stroke-width="4"/>' +
        '<text x="135" y="170" class="m-emo">🏛️</text>' +
        '<text x="135" y="222" class="m-pod">ogród</text>' +
        '<text x="135" y="256" class="m-pod">przy Muzeum</text>' +
      '</g>' +
      '<g' + atr(slowa, 'dom') + '>' +
        '<text x="135" y="372" class="m-emo">🏠</text>' +
        '<text x="135" y="418" class="m-pod m-male">dom Nemeczka</text>' +
      '</g>' +
      // plac
      '<g' + atr(slowa, 'plac') + '>' +
        '<rect x="290" y="100" width="340" height="320" rx="10" fill="#F2DFAA" stroke="#8B6A3E" stroke-width="6" stroke-dasharray="18 8"/>' +
        '<rect x="425" y="94" width="50" height="12" fill="#F2DFAA"/>' +
        '<rect x="425" y="414" width="50" height="12" fill="#F2DFAA"/>' +
        (slowa && slowa.bezNapisu
          ? '<text x="460" y="134" class="m-pod" fill="#8B6A3E">PLAC BRONI</text>'
          : '<text x="460" y="250" class="m-nazwa">PLAC</text><text x="460" y="300" class="m-nazwa">BRONI</text>') +
      '</g>' +
      // sklad drewna z fortecami i budka Janosza
      '<g' + atr(slowa, 'drewno') + '>' +
        '<rect x="640" y="100" width="150" height="320" rx="10" fill="#E9D2B0" stroke="#8B6A3E" stroke-width="4"/>' +
        sagi() +
        '<text x="720" y="408" class="m-pod m-male">skład drewna</text>' +
      '</g>' +
      '<g' + atr(slowa, 'fortece') + '>' +
        '<text x="672" y="170" class="m-flaga">🚩</text><text x="756" y="224" class="m-flaga">🚩</text><text x="672" y="278" class="m-flaga">🚩</text>' +
        '<text x="720" y="98" class="m-pod m-male">fortece</text>' +
      '</g>' +
      '<g' + atr(slowa, 'budka') + '>' +
        '<rect x="652" y="326" width="56" height="48" rx="6" fill="#C9A06A" stroke="#7A5530" stroke-width="3"/>' +
        '<text x="680" y="362" class="m-emo m-male-emo">🐕</text>' +
        '<text x="752" y="346" class="m-pod m-male">budka</text><text x="752" y="370" class="m-pod m-male">Janosza</text>' +
      '</g>' +
      // Ogrod Botaniczny: staw, wyspa, szklarnia
      '<g' + atr(slowa, 'botaniczny') + '>' +
        '<rect x="830" y="100" width="295" height="320" rx="26" fill="#9FD18B" stroke="#5E9E4B" stroke-width="4"/>' +
        '<text x="977" y="140" class="m-pod">Ogród Botaniczny</text>' +
        '<rect x="860" y="160" width="100" height="56" rx="8" fill="#D6F0FA" stroke="#5BA3C7" stroke-width="3"/>' +
        '<text x="910" y="198" class="m-pod m-male">szklarnia</text>' +
        '<ellipse cx="990" cy="302" rx="118" ry="70" fill="#7EC3E6" stroke="#4A93B9" stroke-width="4"/>' +
      '</g>' +
      '<g' + atr(slowa, 'wyspa') + '>' +
        '<ellipse cx="1000" cy="302" rx="52" ry="32" fill="#C7B27A" stroke="#8E7B45" stroke-width="3"/>' +
        '<text x="1000" y="316" class="m-emo m-male-emo">🏚️</text>' +
        '<text x="1000" y="264" class="m-pod m-male m-cz">wyspa</text>' +
      '</g>' +
      (nakladka || '') +
    '</svg>';
  };

  window.wstawMape = function (slowa, nakladka) {
    document.currentScript.insertAdjacentHTML('beforebegin', window.mapaSVG(slowa, nakladka));
  };
})();
