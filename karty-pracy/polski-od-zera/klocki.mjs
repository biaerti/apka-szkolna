// Klocki stron zeszytu. Kazdy zwraca kawalek HTML-a.

export const head = (n, pl, ru) => `
<header class="lh"><div class="lnum">${n}</div><div><div class="lt">${pl}</div><div class="lr">${ru}</div></div></header>`

export const sec = (pl, ru) => `<div class="sec">${pl} <span class="ru">/ ${ru}</span></div>`

// items: [emoji, polskie, wymowa, rosyjskie]
export const vocab = (items, cols = 2) => `
<div class="vocab c${cols}">${items.map(([e, pl, tr, ru]) => `
  <div class="v">${e ? `<span class="em">${e}</span>` : ''}<span class="w"><b>${pl}</b>${tr ? ` <i>[${tr}]</i>` : ''}<br><span class="ru">${ru}</span></span></div>`).join('')}
</div>`

export const task = (n, pl, ru, body) => `
<div class="task"><div class="th"><span class="n">${n}</span><span><b>${pl}</b> <span class="ru">${ru}</span></span></div>${body}</div>`

export const match = (L, R, big = false) => `
<div class="match${big ? ' big' : ''}">${L.map((l, i) => `<div class="ml">${l}</div><div class="dot"></div><div></div><div class="dot"></div><div class="mr">${R[i]}</div>`).join('')}</div>`

export const bl = (mm = 25) => `<span class="bl" style="width:${mm}mm"></span>`

export const lines = (n) => `<div class="lines">${'<div></div>'.repeat(n)}</div>`

export const box = (html, title = '') => `<div class="box">${title ? `<div class="bt">${title}</div>` : ''}${html}</div>`

export const say = (pl, ru) => `
<div class="say"><div class="st">🗣️ Powiedz nauczycielowi <span class="ru">/ Скажи учителю</span></div><div class="sp">${pl}</div><div class="ru">${ru}</div></div>`

export const umiem = (list) => `
<div class="umiem"><div class="st">Umiem! <span class="ru">/ Я умею!</span> <span class="ru small">Отметь ✓</span></div>
${list.map(([pl, ru]) => `<div class="u"><span class="cb"></span><span>${pl} <span class="ru">- ${ru}</span></span></div>`).join('')}</div>`

// rows: [sytuacja PL, sytuacja RU, [opcja, opcja]]
export const choice = (rows) => `
<div class="choice">${rows.map(([pl, ru, opts], i) => `
  <div class="ch"><div>${String.fromCharCode(97 + i)}) ${pl}<br><span class="ru">${ru}</span></div>
  <div class="opts">${opts.map(o => `<span><span class="cb"></span>${o}</span>`).join('')}</div></div>`).join('')}
</div>`

export const frame = (pl, ru, hmm) => `
<div class="task"><div class="th"><span class="n">✎</span><span><b>${pl}</b> <span class="ru">${ru}</span></span></div>
<div class="frame" style="height:${hmm}mm"></div></div>`

export const picGrid = (emojis) => `
<div class="pics">${emojis.map(e => `<div><span class="em big">${e}</span><span class="bl" style="width:26mm"></span></div>`).join('')}</div>`

export const cols = (a, b) => `<div class="cols2"><div>${a}</div><div>${b}</div></div>`
