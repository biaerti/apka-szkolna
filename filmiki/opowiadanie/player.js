// Wspolny silnik filmikow. Wymaga window.TIMELINE (timeline-filmN.js),
// elementow .scena[data-id] w #stage i window.AUDIO_SRC.
//
// Zasada: caly film to jedna os czasu w ms. __seek(t) pokazuje wlasciwa
// scene i ustawia WSZYSTKIE animacje CSS na czas lokalny sceny, wiec
// kazda klatka jest deterministyczna - to z tego renderujemy mp4.
// Kazda animacja MUSI miec animation-fill-mode: forwards (albo both).

(function () {
  var WYPRZEDZENIE = 0.45; // scena wchodzi chwile przed swoim audio (w przerwie)

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
