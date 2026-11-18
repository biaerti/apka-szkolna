// Wspólna nawigacja prezentacji wyrównawczych: strzałki/spacja/PageDown = krok dalej, w lewo = cofnij, F = pełny ekran.
// Element z data-k="n" dostaje klasę "on" od n-tego kroku slajdu. Kafle odsłaniają się też kliknięciem.
(function () {
  var slajdy = [].slice.call(document.querySelectorAll('.slajd'));
  var scena = document.getElementById('scena');
  var nr = 0, krok = 0;

  function maxKrok(s) {
    var m = 0;
    [].forEach.call(s.querySelectorAll('[data-k]'), function (el) { m = Math.max(m, Number(el.getAttribute('data-k'))); });
    return m;
  }

  function pokaz() {
    slajdy.forEach(function (s, i) { s.classList.toggle('akt', i === nr); });
    [].forEach.call(slajdy[nr].querySelectorAll('[data-k]'), function (el) {
      el.classList.toggle('on', Number(el.getAttribute('data-k')) <= krok);
    });
    document.getElementById('licznik').textContent = (nr + 1) + ' / ' + slajdy.length;
    try { history.replaceState(null, '', '#' + (nr + 1)); } catch (e) {}
  }

  function dalej() {
    if (krok < maxKrok(slajdy[nr])) krok++;
    else if (nr < slajdy.length - 1) { nr++; krok = 0; }
    pokaz();
  }
  function wstecz() {
    if (krok > 0) krok--;
    else if (nr > 0) { nr--; krok = maxKrok(slajdy[nr]); }
    pokaz();
  }

  function dopasuj() {
    var s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    scena.style.transform = 'scale(' + s + ')';
    scena.style.left = (window.innerWidth - 1600 * s) / 2 + 'px';
    scena.style.top = (window.innerHeight - 900 * s) / 2 + 'px';
  }

  function pelnyEkran() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter' || k === 'ArrowDown') { e.preventDefault(); dalej(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace' || k === 'ArrowUp') { e.preventDefault(); wstecz(); }
    else if (k === 'Home') { nr = 0; krok = 0; pokaz(); }
    else if (k === 'f' || k === 'F') pelnyEkran();
  });
  document.getElementById('dalej').addEventListener('click', dalej);
  document.getElementById('wstecz').addEventListener('click', wstecz);
  document.getElementById('pelny').addEventListener('click', pelnyEkran);
  // Kafle w "Sprawdź się" odsłaniają się też kliknięciem, w dowolnej kolejności.
  [].forEach.call(document.querySelectorAll('.kafel'), function (b) {
    b.addEventListener('click', function () { b.classList.toggle('on'); b.blur(); });
  });
  window.addEventListener('resize', dopasuj);

  // #3 = trzeci slajd; #3.99 = trzeci slajd ze wszystkimi krokami (do podglądu).
  var zHasha = location.hash.slice(1).split('.');
  var nrHash = parseInt(zHasha[0], 10);
  if (nrHash >= 1 && nrHash <= slajdy.length) nr = nrHash - 1;
  if (zHasha[1]) krok = Math.min(parseInt(zHasha[1], 10) || 0, maxKrok(slajdy[nr]));
  dopasuj();
  pokaz();
})();
