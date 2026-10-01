// Wspolny silnik filmikow. Wymaga window.TIMELINE (timeline-filmN.js),
// elementow .scena[data-id] w #stage i window.AUDIO_SRC.
//
// Zasada: caly film to jedna os czasu w ms. __seek(t) pokazuje wlasciwa
// scene i ustawia WSZYSTKIE animacje CSS na czas lokalny sceny, wiec
// kazda klatka jest deterministyczna - to z tego renderujemy mp4.
// Kazda animacja MUSI miec animation-fill-mode: forwards (albo both).
//
// Opoznienia animacji nie sa zgadywane z tempa lektorki: element z
// data-slowo="pszczoła" wchodzi w chwili, gdy lektorka mowi to slowo
// (czasy slow z forced alignment w TIMELINE.sceny[i].slowa). Slowa szukamy
// po kolei w obrebie sceny, wiec powtorzone slowo trafia na kolejne
// wystapienie. data-po="0.3" dodaje przesuniecie w sekundach, data-t="4.2"
// ustawia czas wprost. Pasek .odliczanie-pasek sam startuje po narracji
// i trwa tyle, ile pauza sceny.

(function () {
  var WYPRZEDZENIE = 0.45; // scena wchodzi chwile przed swoim audio (w przerwie)

  function norm(s) {
    return s.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, '');
  }

  function ustawOpoznienia() {
    window.__brakSlow = [];
    TIMELINE.sceny.forEach(function (s) {
      var el = document.querySelector('.scena[data-id="' + s.id + '"]');
      if (!el) return;
      var slowa = (s.slowa || []).map(function (w) { return [norm(w[0]), w[1]]; });
      var kursor = 0;
      el.querySelectorAll('[data-slowo], [data-t]').forEach(function (x) {
        var t;
        if (x.hasAttribute('data-t')) {
          t = parseFloat(x.getAttribute('data-t'));
        } else {
          var szukane = norm(x.getAttribute('data-slowo'));
          var i = -1;
          for (var k = kursor; k < slowa.length; k++) if (slowa[k][0] === szukane) { i = k; break; }
          if (i < 0) for (var k2 = 0; k2 < slowa.length; k2++) if (slowa[k2][0] === szukane) { i = k2; break; }
          if (i < 0) { window.__brakSlow.push(s.id + ': ' + szukane); return; }
          kursor = i + 1;
          t = slowa[i][1];
        }
        t += parseFloat(x.getAttribute('data-po') || '0');
        x.style.animationDelay = (WYPRZEDZENIE + t).toFixed(2) + 's';
      });
      el.querySelectorAll('.odliczanie-pasek').forEach(function (p) {
        p.style.animationDelay = (WYPRZEDZENIE + s.dur).toFixed(2) + 's';
        p.style.animationDuration = (s.pauza || 15) + 's';
      });
    });
    if (window.__brakSlow.length) console.warn('Nie znaleziono slow:', window.__brakSlow);
  }

  window.__seek = function (tMs) {
    var sceny = TIMELINE.sceny;
    var idx = 0;
    for (var i = 0; i < sceny.length; i++) {
      if (tMs / 1000 >= sceny[i].start - WYPRZEDZENIE) idx = i;
    }
    var s = sceny[idx];
    var els = document.querySelectorAll('.scena');
    for (var j = 0; j < els.length; j++) {
      els[j].style.display = els[j].getAttribute('data-id') === s.id ? '' : 'none';
    }
    var tLoc = Math.max(0, tMs - (s.start - WYPRZEDZENIE) * 1000);
    document.getAnimations().forEach(function (a) {
      a.pause();
      a.currentTime = tLoc;
    });
    return s.id;
  };

  // Podglad na zywo: przycisk play, audio + requestAnimationFrame.
  window.addEventListener('DOMContentLoaded', function () {
    ustawOpoznienia();
    window.__seek(0);
    var btn = document.getElementById('playBtn');
    if (!btn) return;
    var audio = new Audio(window.AUDIO_SRC);
    btn.addEventListener('click', function () {
      btn.style.display = 'none';
      audio.currentTime = 0;
      audio.play();
      function tick() {
        window.__seek(audio.currentTime * 1000);
        if (!audio.ended) requestAnimationFrame(tick);
        else btn.style.display = '';
      }
      requestAnimationFrame(tick);
    });
  });
})();
