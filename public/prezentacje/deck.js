// Prosty silnik prezentacji na projektor (Chrome 109+).
// Slajdy: <section class="s">. Elementy .krok pokazują się po kolei (strzałka w prawo / spacja / klik),
// .krok.skresl zostaje widoczny i się przekreśla. Strzałka w lewo - poprzedni slajd. F - pełny ekran.
// Zdjęcia: <div class="foto" data-src="folder/01" data-prompt="...">: szuka 01.png/.jpg/.jpeg/.webp,
// a jak nie ma pliku, pokazuje numer i prompt do ChatGPT.
(function () {
  var stage = document.querySelector('.stage');
  var slajdy = Array.prototype.slice.call(document.querySelectorAll('.s'));
  var nr = Math.max(0, Math.min(slajdy.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  var licznik = document.createElement('div');
  licznik.className = 'licznik';
  document.body.appendChild(licznik);

  function skaluj() {
    var k = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = 'translate(-50%, -50%) scale(' + k + ')';
  }
  function kroki(s) { return Array.prototype.slice.call(s.querySelectorAll('.krok')); }
  function pokaz(i, wszystko) {
    nr = i;
    slajdy.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    kroki(slajdy[i]).forEach(function (k) { k.classList.toggle('on', !!wszystko); });
    licznik.textContent = (i + 1) + ' / ' + slajdy.length;
    history.replaceState(null, '', '#' + (i + 1));
  }
  function dalej() {
    var ukryty = kroki(slajdy[nr]).filter(function (k) { return !k.classList.contains('on'); })[0];
    if (ukryty) ukryty.classList.add('on');
    else if (nr < slajdy.length - 1) pokaz(nr + 1, false);
  }
  function wstecz() { if (nr > 0) pokaz(nr - 1, true); }

  document.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(e.key) >= 0) { e.preventDefault(); dalej(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(e.key) >= 0) { e.preventDefault(); wstecz(); }
    else if (e.key === 'Home') pokaz(0, false);
    else if (e.key === 'End') pokaz(slajdy.length - 1, true);
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
    }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.prompt')) return; // zaznaczanie promptu do skopiowania
    if (e.clientX < window.innerWidth * 0.2) wstecz(); else dalej();
  });

  // Zdjęcia z ChatGPT
  var EXT = ['png', 'jpg', 'jpeg', 'webp'];
  Array.prototype.slice.call(document.querySelectorAll('.foto')).forEach(function (f) {
    var baza = f.getAttribute('data-src');
    var i = 0;
    var img = new Image();
    img.onload = function () { f.innerHTML = ''; f.appendChild(img); f.classList.add('jest'); };
    img.onerror = function () {
      i++;
      if (i < EXT.length) { img.src = baza + '.' + EXT[i]; return; }
      var plik = baza.split('/').pop();
      f.innerHTML = '<div class="brak"><b>Zdjęcie ' + plik + '</b><span>zapisz jako ' + baza + '.png</span>' +
        '<div class="prompt">' + (f.getAttribute('data-prompt') || '') + '</div></div>';
    };
    img.src = baza + '.' + EXT[0];
  });

  window.addEventListener('resize', skaluj);
  skaluj();
  pokaz(nr, false);
})();
