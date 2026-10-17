// Krzywa z ponumerowanymi punktami (uczucia Gereba - film4, napiecie - film5).
// Wstawiana podczas parsowania, jak mapa.js:
//   <script>wstawKrzywa({ punkty: [...], os: 'tekst osi', ... })</script>
// punkt: { x, y, emo, tekst ('linia 1|linia 2'), nad (podpis nad punktem), dx (przesuniecie podpisu), slowo }
// opcje: plaska - wszystkie punkty na jednej wysokosci (do zadania, zanim
// pokazemy wysokosci), wyroznij: { nr, slowo, napis } - pierscien przy punkcie.

(function () {
  function delay(slowo, po) {
    if (!slowo) return '';
    return ' data-slowo="' + slowo + '"' + (po ? ' data-po="' + po + '"' : '');
  }

  window.krzywaSVG = function (o) {
    var Y = o.plaska ? 300 : null;
    var p = o.punkty.map(function (q) { return { x: q.x, y: Y || q.y, q: q }; });
    var s = '<svg class="krzywa" viewBox="0 0 1140 470" xmlns="http://www.w3.org/2000/svg">';
    // os
    s += '<line x1="40" y1="440" x2="1110" y2="440" stroke="#d9c9b2" stroke-width="4"/>' +
      '<line x1="40" y1="440" x2="40" y2="30" stroke="#d9c9b2" stroke-width="4"/>' +
      '<text x="56" y="40" class="k-os" text-anchor="start">' + (o.os || '') + '</text>' +
      '<text x="1108" y="466" class="k-os" text-anchor="end">' + (o.osX || 'czas ➜') + '</text>';
    // odcinki
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i];
      s += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (o.kolor || '#F58220') +
        '" stroke-width="8" stroke-linecap="round" pathLength="1"' +
        (b.q.slowo && !o.statyczna ? ' class="rysuj"' + delay(b.q.slowo) : '') + '/>';
    }
    // punkty
    p.forEach(function (pt, i) {
      var q = pt.q, nad = q.nad;
      var ty = nad ? pt.y - 44 : pt.y + 62;
      var tx = pt.x + (q.dx || 0);
      var anim = q.slowo && !o.statyczna ? ' class="m-pop"' + delay(q.slowo) : '';
      s += '<g' + anim + '>' +
        '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="24" fill="#fff" stroke="' + (o.kolor || '#F58220') + '" stroke-width="6"/>' +
        '<text x="' + pt.x + '" y="' + (pt.y + 10) + '" class="k-nr">' + (i + 1) + '</text>' +
        '<text x="' + tx + '" y="' + ty + '" class="k-pod">' + (q.emo || '') + ' ' + q.tekst.split('|')[0] + '</text>' +
        (q.tekst.indexOf('|') > 0 ? '<text x="' + tx + '" y="' + (ty + 26) + '" class="k-pod">' + q.tekst.split('|')[1] + '</text>' : '') +
        '</g>';
    });
    if (o.wyroznij) {
      var w = p[o.wyroznij.nr - 1];
      s += '<g class="m-pop"' + delay(o.wyroznij.slowo) + '>' +
        '<circle cx="' + w.x + '" cy="' + w.y + '" r="40" fill="none" stroke="#2E9E5B" stroke-width="7"/>' +
        '<rect x="' + (w.x - 90) + '" y="' + (w.y + (o.wyroznij.nad ? -142 : 96)) + '" width="180" height="44" rx="22" fill="#2E9E5B"/>' +
        '<text x="' + w.x + '" y="' + (w.y + (o.wyroznij.nad ? -111 : 127)) + '" class="k-znak">' + o.wyroznij.napis + '</text></g>';
    }
    return s + '</svg>';
  };

  window.wstawKrzywa = function (o) {
    document.currentScript.insertAdjacentHTML('beforebegin', window.krzywaSVG(o));
  };
})();
