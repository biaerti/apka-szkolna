const BOT_ID = 'apka-szkolna-vulcan-bot';
// Wersja w panelu - widac od razu, czy karta VULCANA ma juz nowy kod dodatku.
const BOT_VERSION = (() => { try { return chrome.runtime.getManifest().version; } catch { return ''; } })();
let transfer = null;
let phase = 'start';
// Uwaga z apki (zakładka „Uwagi” w lekcji -> „Dodaj”). Osobna paczka niż
// temat + frekwencja; ten sam panel pomocnika, inne fazy: uwaga-start ->
// uwaga-review (formularz wypełniony, Bartek klika Zapisz sam) -> done.
let uwaga = null;
// Kilka otwartych kart Apki szkolnej może odebrać ten sam wpis z Supabase.
// Jedna uwaga jest obrabiana tylko raz, a kolejne czekają w kolejce zamiast
// uruchamiać drugi formularz w połowie pierwszego.
let activeUwagaEventId = null;
const uwagaQueue = [];

// Karta VULCANA pracuje zwykle W TLE (frekwencja z telefonu w trakcie
// prezentacji), a Chrome dlawi timery ukrytych kart - lancuch setTimeoutow
// potrafi dostac jeden tik na minute. Czekanie odmierza wiec service worker
// dodatku (bez dlawienia), a zwykly setTimeout zostaje jako zapas.
const sleep = (ms) => new Promise((resolve) => {
  let done = false;
  const finish = () => { if (!done) { done = true; resolve(); } };
  try {
    chrome.runtime.sendMessage({ type: 'SLEEP', ms }, () => { void chrome.runtime.lastError; finish(); });
  } catch { /* kontekst dodatku uniewazniony po przeladowaniu */ }
  setTimeout(finish, ms + 1500);
});
const normalized = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pl');
const visible = (element) => Boolean(element && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');

const POLISH_MONTHS = { stycznia: 1, lutego: 2, marca: 3, kwietnia: 4, maja: 5, czerwca: 6, lipca: 7, sierpnia: 8, września: 9, pazdziernika: 10, października: 10, listopada: 11, grudnia: 12 };

function readScheduleFromPage() {
  const entries = [];
  let date = null;
  let lastLessonLine = -2;
  const lines = document.body.innerText.split(/\r?\n/).map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const dateMatch = /(?:poniedziałek|wtorek|środa|czwartek|piątek|sobota|niedziela),?\s+(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(\d{4})/i.exec(line);
    if (dateMatch) {
      const month = POLISH_MONTHS[dateMatch[2].toLocaleLowerCase('pl')];
      if (month) date = `${dateMatch[3]}-${String(month).padStart(2, '0')}-${String(Number(dateMatch[1])).padStart(2, '0')}`;
      lastLessonLine = -2;
      continue;
    }
    if (!date) continue;
    if (/^\(?zastępstwo\b/i.test(line) && entries.length > 0 && lineIndex === lastLessonLine + 1) {
      entries[entries.length - 1].replacement = line.replace(/^\(|\)$/g, '').trim();
      lastLessonLine = -2;
      continue;
    }
    // Dowolny przedmiot, nie tylko polski: zastepstwo bywa z innego przedmiotu,
    // a panel musi wiedziec, ze ta godzina jest zajeta i w jakiej klasie.
    // Dziennik lekcji w apce sam odsiewa polski (Journal.tsx).
    const lesson = /^(\d{1,2})\.\s+([0-9IVX]+\s*[A-Za-z])\s+([A-ZĄĆĘŁŃÓŚŹŻ][^,(]*?)\s*([,(].*)?$/.exec(line);
    if (!lesson) {
      lastLessonLine = -2;
      continue;
    }
    entries.push({
      date,
      period: Number(lesson[1]),
      className: lesson[2].replace(/\s+/g, ''),
      subject: lesson[3].trim(),
      replacement: /zastępstwo/i.test(lesson[4] || '') ? lesson[4].replace(/^[,(\s]+|\)$/g, '').trim() : undefined,
    });
    lastLessonLine = lineIndex;
  }
  return entries.filter((entry, index) => entries.findIndex((candidate) => candidate.date === entry.date && candidate.period === entry.period && candidate.className === entry.className) === index);
}

// Odczyt frekwencji z otwartej tabeli (kierunek VULCAN -> apka). ExtJS trzyma
// naglowki i wiersze w osobnych elementach, wiec laczymy je po polozeniu na
// ekranie, tak samo jak sprawdzony automat wpisujacy frekwencje.
function readAttendanceFromPage(period, className) {
  const root = document.body;
  const rows = frekRows(root);
  if (rows.length === 0) throw new Error('Nie znalazłem uczniów w tabeli frekwencji.');
  const header = periodHeader(root, rows, period);
  if (!header) throw new Error(`Nie znalazłem kolumny ${period}. lekcji w tabeli frekwencji.`);

  if (className) {
    const classHeader = exactVisible(root, 'Oddział')[0];
    if (classHeader) {
      const classX = centerOf(classHeader).x;
      const wantedClass = normalized(className).replace(/\s+/g, '');
      const actualClasses = rows.map((row) => normalized(cellAt(root, classX, centerOf(row.cell).y)?.textContent).replace(/\s+/g, ''));
      if (!actualClasses.some((value) => value === wantedClass)) {
        throw new Error(`Tabela frekwencji pokazuje inną klasę niż ${className}.`);
      }
    }
  }

  return rows.map((row) => ({
    number: row.number,
    name: row.main || row.name,
    symbol: normalized(rowCell(root, row, header)?.textContent),
  }));
}

function candidates(selector = 'button, a, input[type="button"], input[type="submit"], [role="button"], td, span, div') {
  // Panel pomocnika tez zawiera teksty typu "Uwaga" czy tresc uwagi -
  // bot nie moze klikac sam w siebie.
  return [...document.querySelectorAll(selector)].filter((element) => visible(element) && !element.closest(`#${BOT_ID}`));
}

function textOf(element) {
  return element instanceof HTMLInputElement ? element.value : element.textContent;
}

function findText(text, exact = false, selector) {
  const wanted = normalized(text);
  return candidates(selector)
    .filter((element) => exact ? normalized(textOf(element)) === wanted : normalized(textOf(element)).includes(wanted))
    .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
}

async function waitForText(text, timeout = 7000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const element = findText(text);
    if (element) return element;
    await sleep(180);
  }
  throw new Error(`Nie znalazłem kontrolki „${text}”.`);
}

// Odpala kod w SWIECIE STRONY przez background.js (chrome.scripting,
// world: MAIN) - jedyna droga do window.Ext, ktorej CSP VULCANA nie
// zablokuje (wstrzykiwany <script> byl blokowany). Elementy docelowe
// oznaczamy atrybutem data-apka-bot, background siega do nich przez Ext.
function extRun(kind, lastName, payload) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: 'EXT_RUN', kind, lastName, payload }, (response) => {
        if (chrome.runtime.lastError) resolve('ERR: ' + chrome.runtime.lastError.message);
        else resolve(response && response.ok ? response.result : 'ERR: ' + ((response && response.error) || 'brak odpowiedzi'));
      });
    } catch (error) {
      resolve('ERR: ' + error);
    }
  });
}

// PRAWDZIWE klikniecia myszy przez debugger Chrome (background.js:
// realClicks) - w srodki podanych elementow, po kolei, z krotka pauza.
async function realClick(elements) {
  // Wspolrzedne mierzy background PO podpieciu debuggera (pasek debugowania
  // spycha strone w dol) - my tylko znakujemy cele atrybutem z kolejnoscia.
  const targets = elements.filter(Boolean);
  targets.forEach((element, index) => element.setAttribute('data-apka-bot-click', String(index)));
  const result = await new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: 'REAL_CLICKS', count: targets.length }, (response) => {
        if (chrome.runtime.lastError) resolve('ERR: ' + chrome.runtime.lastError.message);
        else resolve(response && response.ok ? 'ok' : 'ERR: ' + ((response && response.error) || 'brak odpowiedzi'));
      });
    } catch (error) {
      resolve('ERR: ' + error);
    }
  });
  targets.forEach((element) => element.removeAttribute('data-apka-bot-click'));
  return result;
}

// Zaznacza rekord ucznia w gridzie (po nazwisku) i odpala handler przycisku
// ">" przez API ExtJS - dziala tam, gdzie syntetyczne klikniecia sa
// ignorowane (przenoszenie ucznia do "Dotyczy" w oknie uwagi).
async function extTransfer(rowElement, arrowElement, lastName) {
  rowElement.setAttribute('data-apka-bot', 'row');
  if (arrowElement) arrowElement.setAttribute('data-apka-bot', 'arrow');
  const result = await extRun('transfer', normalized(lastName || ''));
  rowElement.removeAttribute('data-apka-bot');
  if (arrowElement) arrowElement.removeAttribute('data-apka-bot');
  return result;
}

function clickElement(element) {
  if (!element) throw new Error('Nie znaleziono kontrolki.');
  element.scrollIntoView({ block: 'center', inline: 'center' });
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  element.click();
}

// `root` ogranicza szukanie np. do okna uwagi - bez tego bot potrafil wpisac
// tresc w filtr drzewa POZA oknem (pierwszy zywy test).
function fieldByLabel(labelText, root = document) {
  const label = findTextIn(root, labelText, false, 'label, td, span, div');
  if (!label) return null;
  let node = label;
  for (let depth = 0; depth < 5 && node; depth += 1, node = node.parentElement) {
    const fields = [...node.querySelectorAll('input:not([type="hidden"]), textarea, select')].filter(visible);
    const after = fields.find((field) => field.getBoundingClientRect().left >= label.getBoundingClientRect().right - 8);
    if (after) return after;
  }
  const labelRect = label.getBoundingClientRect();
  return [...root.querySelectorAll('input:not([type="hidden"]), textarea, select')]
    .filter(visible)
    .filter((field) => field.getBoundingClientRect().top >= labelRect.top - 10)
    .sort((a, b) => Math.abs(a.getBoundingClientRect().top - labelRect.top) - Math.abs(b.getBoundingClientRect().top - labelRect.top))[0] || null;
}

function setField(field, value) {
  if (!field) throw new Error('Nie znalazłem pola do uzupełnienia.');
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : field instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  if (setter) setter.call(field, value);
  else field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new Event('blur', { bubbles: true }));
}

function render(message, error = false) {
  let root = document.getElementById(BOT_ID);
  if (!root) {
    root = document.createElement('aside');
    root.id = BOT_ID;
    root.innerHTML = `
      <style>
        #${BOT_ID}{position:fixed;right:18px;bottom:18px;z-index:2147483647;width:350px;box-sizing:border-box;border:1px solid #c7d2fe;border-radius:14px;background:#fff;color:#111827;box-shadow:0 16px 44px rgba(15,23,42,.24);font:14px/1.45 Arial,sans-serif;padding:16px}
        #${BOT_ID} *{box-sizing:border-box} #${BOT_ID} h2{font-size:17px;margin:0 28px 4px 0} #${BOT_ID} p{margin:6px 0;color:#4b5563}
        #${BOT_ID} .summary{margin:12px 0;padding:10px;border-radius:9px;background:#eef2ff;color:#312e81} #${BOT_ID} .error{color:#b91c1c;background:#fef2f2;padding:9px;border-radius:8px}
        #${BOT_ID} button{border:0;border-radius:8px;background:#4f46e5;color:#fff;font-weight:700;padding:9px 12px;cursor:pointer} #${BOT_ID} button.secondary{background:#e5e7eb;color:#374151}
        #${BOT_ID} .buttons{display:flex;gap:8px;justify-content:flex-end;margin-top:12px} #${BOT_ID} .close{position:absolute;right:10px;top:8px;background:transparent;color:#6b7280;padding:5px}
      </style>
      <button class="close" data-action="close" aria-label="Zamknij">×</button>
      <h2>Pomocnik VULCAN <small style="font-weight:400;color:#9ca3af;font-size:12px">v${BOT_VERSION}</small></h2><div data-slot="content"></div><div class="buttons" data-slot="buttons"></div>`;
    document.body.appendChild(root);
    root.addEventListener('click', (event) => {
      const action = event.target?.dataset?.action;
      if (action === 'close') root.remove();
      if (action === 'fill') void fillDescription();
      if (action === 'attendance') void saveAndFillAttendance();
      if (action === 'confirm') void confirmAttendance();
      if (action === 'uwaga-fill') void fillUwaga();
      if (action === 'uwaga-saved') void reportUwagaSaved();
    });
  }
  const content = root.querySelector('[data-slot="content"]');
  const buttons = root.querySelector('[data-slot="buttons"]');
  const absent = transfer?.attendance?.filter((row) => row.status === 'absent').length ?? 0;
  const late = transfer?.attendance?.filter((row) => row.status === 'late').length ?? 0;
  const absentCount = frek?.students?.filter((row) => row.legend === 'nieobecność').length ?? 0;
  const lateCount = frek?.students?.filter((row) => row.legend === 'spóźnienie').length ?? 0;
  const summary = frek?.topicOnly
    ? `<div class="summary"><strong>Temat z apki · ${frek.period}. lekcja · ${escapeHtml(frek.vulcanClassName)}</strong><br>${escapeHtml(frek.topic)}</div>`
    : frek
    ? `<div class="summary"><strong>Frekwencja z telefonu · ${frek.period}. lekcja · ${escapeHtml(frek.vulcanClassName)}</strong><br>Nieobecni: ${absentCount}, spóźnieni: ${lateCount}${frek.topic ? `<br>Temat: ${escapeHtml(frek.topic)}` : ''}</div>`
    : uwaga
    ? `<div class="summary"><strong>Uwaga · ${escapeHtml(uwaga.student.lastName)} ${escapeHtml(uwaga.student.firstName)} (${escapeHtml(uwaga.vulcanClassName)})</strong><br>${escapeHtml(uwaga.category)}<br>${escapeHtml(uwaga.content)}</div>`
    : transfer
      ? `<div class="summary"><strong>${transfer.period}. lekcja · ${transfer.vulcanClassName}</strong><br>${transfer.topic}<br>Nieobecni: ${absent}, spóźnieni: ${late}</div>`
      : '';
  content.innerHTML = `${summary}<p class="${error ? 'error' : ''}">${message}</p>`;
  buttons.innerHTML = phase === 'start' ? '<button data-action="fill">Uzupełnij opis lekcji</button>'
    : phase === 'review-description' ? '<button data-action="attendance">Zapisz opis i ustaw frekwencję</button>'
    : phase === 'review-attendance' ? '<button data-action="confirm">Zatwierdź frekwencję</button>'
    : phase === 'uwaga-start' ? '<button data-action="uwaga-fill">Otwórz formularz uwagi</button>'
    : phase === 'uwaga-review' ? '<button class="secondary" data-action="uwaga-saved">Zapisałem w VULCANIE</button>'
    : '';
}

async function selectScheduledLesson() {
  const day = new Date(`${transfer.date}T12:00:00`).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dayElement = findText(day);
  if (dayElement) clickElement(dayElement);
  await sleep(400);
  const exact = `${transfer.period}. ${transfer.vulcanClassName}`;
  const lessonElement = findText(exact);
  if (!lessonElement) throw new Error(`Nie znalazłem ${transfer.period}. lekcji klasy ${transfer.vulcanClassName} w drzewie po lewej.`);
  clickElement(lessonElement);
  await sleep(650);
}

// Kategoria uwagi: combo ExtJS ze stalym id (podejrzane w zywym VULCANIE),
// opcje to .x-boundlist-item doklejone do <body>. Najpierw dokladny tekst.
async function chooseKategoria(root, text) {
  const input = document.getElementById('cmbKategorieId-inputEl') || fieldByLabel('Kategoria', root);
  if (!input) throw new Error('Nie znalazłem pola „Kategoria”.');
  clickElement(input);
  const wanted = normalized(text);
  // "Uwaga" jest na liscie dwa razy: naglowek grupy u gory i wlasciwa
  // pozycja (ta z data-qtip) - bierzemy pozycje, w razie remisu OSTATNIA.
  const option = await waitFor(() => {
    const items = [...document.querySelectorAll('.x-boundlist-item')].filter(visible);
    const exact = items.filter((el) => normalized(el.textContent) === wanted);
    return (
      exact.find((el) => normalized(el.getAttribute('data-qtip') || '') === wanted) ||
      exact[exact.length - 1] ||
      items.find((el) => normalized(el.textContent).includes(wanted))
    );
  }, 4000);
  if (!option) throw new Error(`Nie znalazłem opcji „${text}” na liście kategorii.`);
  clickElement(option);
  await sleep(250);
}

async function chooseDropdown(label, text, root = document) {
  const field = fieldByLabel(label, root);
  if (!field) throw new Error(`Nie znalazłem pola „${label}”.`);
  if (field instanceof HTMLSelectElement) {
    const option = [...field.options].find((item) => normalized(item.text).includes(normalized(text)));
    if (!option) throw new Error(`W polu „${label}” nie ma opcji „${text}”.`);
    setField(field, option.value);
    return;
  }
  clickElement(field);
  await sleep(300);
  // Lista opcji potrafi doklejac sie do <body>, poza oknem - szukamy w calym
  // dokumencie, ale NAJPIERW dokladnego trafienia ("Uwaga" to tez naglowek
  // grupy i kawalek innych nazw).
  const option = findText(text, true) || findText(text);
  if (!option) throw new Error(`Nie znalazłem opcji „${text}” w polu „${label}”.`);
  clickElement(option);
  await sleep(160);
}

async function fillDescription() {
  try {
    render('Otwieram właściwą godzinę…');
    await selectScheduledLesson();
    const create = await waitForText('Utwórz lekcję');
    clickElement(create);
    await waitForText('Dodawanie lekcji');
    const next = await waitForText('Dalej');
    clickElement(next);
    await waitForText('Dodawanie tematu lekcji');
    const topicField = fieldByLabel('Temat:');
    setField(topicField, transfer.topic);
    await chooseDropdown('Podstawa programowa:', '2026 Język polski - klasy IV-VI - II etap edukacyjny');
    for (const code of transfer.curriculum) {
      try { await chooseDropdown('Elementy podstawy programowej:', code); } catch { /* pozostaw do ręcznej korekty */ }
    }
    phase = 'review-description';
    render('Opis jest uzupełniony. Sprawdź temat i kody w formularzu, potem przejdź dalej.');
  } catch (error) {
    phase = 'start';
    render(`${error.message} Ustaw tę lekcję ręcznie i spróbuj ponownie.`, true);
  }
}

function findStudentRow(student) {
  const full = `${student.lastName} ${student.firstName}`;
  const name = findText(full) || findText(student.lastName);
  return name?.closest('tr');
}

function findPeriodHeader(table, period) {
  for (const row of table.rows) {
    for (const cell of row.cells) if (normalized(cell.textContent) === String(period)) return cell;
  }
  return null;
}

async function setGridMark(student, symbol) {
  const row = findStudentRow(student);
  if (!row) throw new Error(`Nie znalazłem ucznia: ${student.lastName} ${student.firstName}.`);
  const table = row.closest('table');
  const header = findPeriodHeader(table, transfer.period);
  if (!header) throw new Error(`Nie znalazłem kolumny ${transfer.period}. lekcji.`);
  const targetX = header.getBoundingClientRect().left + header.getBoundingClientRect().width / 2;
  const cell = [...row.cells].find((candidate) => {
    const rect = candidate.getBoundingClientRect();
    return targetX >= rect.left && targetX <= rect.right;
  });
  if (!cell) throw new Error(`Nie dopasowałem pola ucznia do ${transfer.period}. lekcji.`);
  const legend = candidates('td, span, div').filter((element) => normalized(element.textContent) === symbol && !element.closest('tr')?.textContent?.includes(student.lastName)).sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0];
  if (legend) clickElement(legend);
  clickElement(cell);
  await sleep(80);
}

async function saveAndFillAttendance() {
  try {
    render('Zapisuję opis i otwieram frekwencję…');
    clickElement(await waitForText('Zapisz'));
    await sleep(800);
    clickElement(await waitForText('Frekwencja'));
    await sleep(600);
    clickElement(await waitForText('Zmień frekwencję'));
    await sleep(500);
    // Wpisujemy także kropki. Dzięki temu wynik nie zależy od ustawienia
    // „Ustaw domyślny wpis frekwencji” na koncie nauczyciela.
    for (const student of transfer.attendance) await setGridMark(student, student.symbol);
    phase = 'review-attendance';
    render('Wyjątki są zaznaczone. Sprawdź kolumnę frekwencji. Nic nie zostało jeszcze zatwierdzone.');
  } catch (error) {
    phase = 'review-description';
    render(`${error.message} Możesz dokończyć ten krok ręcznie w otwartym formularzu.`, true);
  }
}

async function confirmAttendance() {
  try {
    const ok = findText('OK', true, 'button, input[type="button"], input[type="submit"], [role="button"]');
    if (!ok) throw new Error('Nie znalazłem przycisku OK.');
    clickElement(ok);
    await chrome.storage.session.remove('pendingVulcanTransfer');
    phase = 'done';
    render('Gotowe. Temat i frekwencja zostały zapisane w VULCANIE.');
  } catch (error) {
    phase = 'review-attendance';
    render(error.message, true);
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
}

// --- uwaga: zakładka „Uwagi” w lekcji -> „Dodaj” -> okno z listą uczniów -----

function modalRoot() {
  // Okno dodawania uwagi ma stabilny atrybut testowy VULCANA.
  const editor = document.querySelector('[uitestid="DodajUwageEditorView"]');
  if (editor && visible(editor)) return editor;
  // Zapas: kontener, w którym są oba nagłówki list.
  const header = findText('Nazwisko i imię', true);
  if (!header) return null;
  let node = header;
  for (let depth = 0; depth < 12 && node; depth += 1, node = node.parentElement) {
    if (findTextIn(node, 'Dotyczy', true) && findTextIn(node, 'Kategoria')) return node;
  }
  return header.closest('[role="dialog"], .x-window, .ui-dialog') || document.body;
}

function findTextIn(root, text, exact = false, selector = 'button, a, input, [role="button"], td, span, div, label') {
  const wanted = normalized(text);
  return [...root.querySelectorAll(selector)].filter(visible)
    .filter((element) => exact ? normalized(textOf(element)) === wanted : normalized(textOf(element)).includes(wanted))
    .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
}

async function waitFor(check, timeout = 7000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const found = check();
    if (found) return found;
    await sleep(180);
  }
  return null;
}

async function pickStudentInModal(root, student) {
  const full = `${student.lastName} ${student.firstName}`;
  const transferred = () => {
    const rightGrid = root.querySelector('[uitestid="vswitchpanel-right-grid"]');
    if (rightGrid) {
      return [...rightGrid.querySelectorAll('.x-grid-cell-inner')]
        .some((el) => normalized(el.textContent).includes(normalized(student.lastName)));
    }
    const dotyczy = findTextIn(root, 'Dotyczy', true);
    const rightEdge = dotyczy ? dotyczy.getBoundingClientRect().left : Infinity;
    return [...root.querySelectorAll('td, div, span')].filter(visible).some((element) => {
      const text = normalized(textOf(element));
      return text.includes(normalized(student.lastName)) && element.getBoundingClientRect().left >= rightEdge - 24;
    });
  };
  // Ponowiona paczka może trafić tu, gdy uczeń został już przeniesiony.
  // Wtedy lewa lista jest pusta i nie wolno zgłaszać fałszywego błędu.
  if (transferred()) return;

  const search = [...root.querySelectorAll('input')].filter(visible)
    .find((input) => normalized(input.placeholder).includes('wyszuk'));
  if (search) {
    setField(search, student.lastName);
    await sleep(900);
  }
  // Nie uzywamy tutaj ogolnego findTextIn(). ExtJS ma jednopikselowe
  // kontenery .x-box-target, ktore zawieraja tekst calej listy. Poniewaz
  // findTextIn wybiera najmniejszy element, taki kontener wygrywal z komorka
  // ucznia i bot klikal gore okna zamiast wiersza. Szukamy tylko komorek
  // lewego gridu i zwracamy prawdziwy <tr>, na ktorym dziala selection model.
  const findRow = () => {
    // Grid jest pobierany za każdym razem, bo filtrowanie listy potrafi
    // podmienić jego DOM i unieważnić wcześniejszą referencję.
    const scope = root.querySelector('[uitestid="vswitchpanel-left-grid"]') || root;
    const wantedFull = normalized(full);
    const wantedLastName = normalized(student.lastName);
    const cells = [...scope.querySelectorAll('.x-grid-cell-inner')].filter(visible);
    const cell = cells.find((element) => normalized(element.textContent).includes(wantedFull))
      || cells.find((element) => normalized(element.textContent).includes(wantedLastName));
    return cell?.closest('tr.x-grid-row') || cell || null;
  };
  const row = await waitFor(() => transferred() || findRow(), 6000);
  if (row === true || transferred()) return;
  if (!row) throw new Error(`Nie znalazłem ucznia ${full} na liście po lewej.`);
  // Syntetyczne klikniecia dzialaja wszedzie POZA przyciskami ">"/">>",
  // wiec od razu idziemy przez API ExtJS: zaznaczenie rekordu w selModel
  // po nazwisku i wywolanie handlera przycisku (extTransfer). Klik i dwuklik
  // zostaja jako zapas.
  clickElement(row);
  await sleep(250);
  const arrow = root.querySelector('a[uitestid=">"]') || findTextIn(root, '>', true, 'a, button, span');
  const api = await extTransfer(row, arrow, student.lastName);
  await waitFor(transferred, 2000);
  let realny = 'nieprobowany';
  if (!transferred()) {
    // Prawdziwe klikniecia przez debugger: wiersz (zaznaczenie), strzalka ">".
    render('Przenoszę ucznia prawdziwym kliknięciem…');
    realny = await realClick([findRow() || row, arrow]);
    await waitFor(transferred, 2500);
  }
  if (!transferred()) {
    throw new Error(`Nie udało się przenieść ucznia ${full} do „Dotyczy”. API ExtJS: ${api}; klik przez debugger: ${realny}.`);
  }
  // Dolna część formularza jest renderowana osobno po zmianie listy uczniów.
  await waitFor(() => visible(document.getElementById('cmbKategorieId-inputEl')) && visible(document.getElementById('idTresc-inputEl')), 5000);
  await sleep(700);
}

// Wsrod pasujacych elementow bierze ten najnizej na ekranie (a przy remisie
// najmniejszy). Potrzebne, bo np. "Pochwały i uwagi" jest i na gornej wstazce,
// i w menu dziennika oddzialu - klikamy to drugie.
function findTextLowest(text, exact = false) {
  const wanted = normalized(text);
  return candidates()
    .filter((element) => (exact ? normalized(textOf(element)) === wanted : normalized(textOf(element)).includes(wanted)))
    .sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return rb.top - ra.top || ra.width * ra.height - rb.width * rb.height;
    })[0];
}

// Droga do formularza uwagi przez DZIENNIK ODDZIALU (pomysl Bartka z
// pierwszego zywego testu): uwagi w VULCANIE nie sa przypiete do lekcji,
// tylko wisza luzem przy klasie i miesiacu, wiec nie trzeba otwierac zadnej
// lekcji. Wstazka "Dziennik oddziału" -> klasa w drzewie ("4C (Sp 97)") ->
// menu "Pochwały i uwagi" -> zakladka "Uwagi". Dalej to samo "Dodaj".
async function openUwagiOddzialu() {
  render('Otwieram dziennik oddziału…');
  // Stale id ze zrzutu strony: rbbnDziennkiBtn to "Dziennik oddziału".
  const ribbon = document.getElementById('rbbnDziennkiBtn') || (await waitFor(() => findText('Dziennik oddziału', true), 5000));
  if (!ribbon) throw new Error('Nie znalazłem przycisku „Dziennik oddziału” na górnej wstążce.');
  clickElement(ribbon);
  await sleep(900);
  render(`Otwieram klasę ${uwaga.vulcanClassName} w drzewie…`);
  const wanted = normalized(uwaga.vulcanClassName);
  const klasa = await waitFor(() => {
    const nodes = [...document.querySelectorAll('.x-tree-node-text')].filter(visible);
    return (
      nodes.find((el) => normalized(el.textContent).startsWith(`${wanted} (`)) ||
      candidates('td, span, div, a, li')
        .map((element) => ({ element, text: normalized(textOf(element)) }))
        .filter(({ text }) => text.startsWith(`${wanted} (`))
        .sort((a, b) => {
          const ra = a.element.getBoundingClientRect();
          const rb = b.element.getBoundingClientRect();
          return ra.width * ra.height - rb.width * rb.height;
        })[0]?.element
    );
  }, 8000);
  if (!klasa) throw new Error(`Nie znalazłem klasy ${uwaga.vulcanClassName} w drzewie dzienników po lewej.`);
  clickElement(klasa);
  await sleep(900);
  render('Otwieram „Pochwały i uwagi”…');
  // Pozycja menu ma staly atrybut testowy; zapasem tekst najnizej na ekranie
  // (na wstazce tez jest przycisk "Pochwaly i uwagi").
  const menu = await waitFor(
    () => document.querySelector('[uitestid="Dane dziennika-Pochwały i uwagi"]') || findTextLowest('Pochwały i uwagi', true),
    8000,
  );
  if (!menu) throw new Error('Nie znalazłem pozycji „Pochwały i uwagi” w menu dziennika oddziału.');
  clickElement(menu);
  await sleep(700);
}

async function fillUwaga() {
  try {
    phase = 'uwaga-filling';
    await openUwagiOddzialu();
    render('Otwieram zakładkę „Uwagi”…');
    const tab = await waitFor(() => findText('Uwagi', true), 8000);
    if (!tab) throw new Error('Nie znalazłem zakładki „Uwagi” obok „Pochwały”.');
    clickElement(tab);
    // Panel zakladki dogrywa sie chwile po klikniecu (miesiac + lista uwag);
    // za wczesny klik w "Dodaj" nie otwiera okna. Odczekujemy i probujemy
    // do trzech razy, za kazdym razem swiezo znalezionym przyciskiem.
    await sleep(800);
    await waitForText('Dodaj', 8000);
    let root = null;
    for (let attempt = 0; attempt < 3 && !root; attempt += 1) {
      const add = findText('Dodaj', true) || findText('Dodaj');
      if (add) clickElement(add);
      root = await waitFor(modalRoot, 3000);
    }
    if (!root) throw new Error('Nie otworzyło się okno dodawania uwagi.');
    await pickStudentInModal(root, uwaga.student);
    // VULCAN trzyma wartości formularza we własnych komponentach ExtJS.
    // Samo ustawienie tekstu w <input>/<textarea> wygląda poprawnie, ale przy
    // zapisie Ext potrafi wysłać puste wartości. Ustawiamy więc kategorię i
    // treść przez API komponentów w świecie strony, a zwykły DOM zostaje jako
    // zapas dla innych wersji VULCANA.
    const model = await extRun('uwaga-fields', '', { category: uwaga.category, content: uwaga.content });
    root = modalRoot() || root;
    let category = document.getElementById('cmbKategorieId-inputEl') || fieldByLabel('Kategoria', root);
    let content = document.getElementById('idTresc-inputEl') || fieldByLabel('Treść', root);
    if (!category?.value?.trim()) {
      await chooseKategoria(root, uwaga.category);
      category = document.getElementById('cmbKategorieId-inputEl') || fieldByLabel('Kategoria', root);
    }
    if (!(content instanceof HTMLTextAreaElement) && !(content instanceof HTMLInputElement)) throw new Error('Nie znalazłem pola „Treść”.');
    if (!content.value.trim()) setField(content, uwaga.content);
    await sleep(300);
    // Pobieramy kontrolki ponownie po zmianach, bo ExtJS potrafi przebudować
    // fragment okna i unieważnić wcześniejsze referencje DOM.
    root = modalRoot() || root;
    category = document.getElementById('cmbKategorieId-inputEl') || fieldByLabel('Kategoria', root);
    content = document.getElementById('idTresc-inputEl') || fieldByLabel('Treść', root);
    // AUTO-ZAPIS (decyzja Bartka 2026-09-21): zatwierdzeniem uwagi jest samo
    // jej danie w apce/na telefonie, wiec bot klika Zapisz sam - ale TYLKO
    // gdy formularz jest kompletny. Czegos brakuje -> stop i czlowiek.
    const kategoriaValue = category?.value?.trim() ?? '';
    const brakuje = [];
    if (!kategoriaValue || (model && typeof model === 'object' && !model.categoryModel)) brakuje.push('kategorii');
    if (!content?.value?.trim() || (model && typeof model === 'object' && !model.contentModel)) brakuje.push('treści');
    // Stopka z przyciskiem bywa rodzeństwem DodajUwageEditorView, a nie jego
    // dzieckiem. Szukamy najpierw w całym oknie ExtJS, potem globalnie wśród
    // widocznych przycisków o stabilnym uitestid.
    const windowRoot = root.closest('.x-window') || root;
    const zapisz = [...windowRoot.querySelectorAll('a[uitestid="Zapisz"]')].find(visible)
      || [...document.querySelectorAll('a[uitestid="Zapisz"]')].find(visible)
      || findTextIn(windowRoot, 'Zapisz', true)
      || findTextIn(document.body, 'Zapisz', true);
    if (!zapisz) brakuje.push('przycisku „Zapisz”');
    if (brakuje.length > 0) {
      phase = 'uwaga-review';
      render(`Formularz prawie gotowy, ale nie zapisuję sam - brakuje: ${brakuje.join(', ')}. Uzupełnij i kliknij <strong>Zapisz</strong>.`, true);
      watchUwagaSave(root);
      return;
    }
    phase = 'uwaga-review';
    render('Formularz kompletny - klikam Zapisz…');
    const formCleared = () => {
      const currentCategory = document.getElementById('cmbKategorieId-inputEl');
      const currentContent = document.getElementById('idTresc-inputEl');
      return Boolean(currentCategory && currentContent && !currentCategory.value.trim() && !currentContent.value.trim());
    };
    const saved = () => !document.contains(root) || !visible(root) || formCleared();
    clickElement(zapisz);
    let completed = await waitFor(saved, 6000);
    if (!completed) {
      // Syntetyczny klik zignorowany (jak przy ">") - handler przez API ExtJS.
      zapisz.setAttribute('data-apka-bot', 'button');
      await extRun('button');
      zapisz.removeAttribute('data-apka-bot');
      completed = await waitFor(saved, 6000);
    }
    if (!completed) {
      // Ostatecznosc: prawdziwe klikniecie przez debugger.
      await realClick([zapisz]);
      completed = await waitFor(saved, 8000);
    }
    if (completed) {
      // Po udanym zapisie VULCAN często czyści formularz, ale pozostawia go
      // otwartego do dodania następnego wpisu. Zamykamy pusty formularz, aby
      // kolejna uwaga z kolejki zaczęła od przewidywalnego stanu.
      if (document.contains(root) && visible(root) && formCleared()) {
        const anuluj = [...document.querySelectorAll('a[uitestid="Anuluj"]')].find(visible)
          || findTextIn(document.body, 'Anuluj', true);
        if (anuluj) {
          clickElement(anuluj);
          await waitFor(() => !document.contains(root) || !visible(root), 3000);
        }
      }
      await reportUwagaSaved();
    } else {
      render('Kliknąłem Zapisz, ale okno nie zniknęło - sprawdź komunikat VULCANA i dokończ ręcznie.', true);
      watchUwagaSave(root);
    }
  } catch (error) {
    phase = 'uwaga-start';
    render(`${error.message} Dokończ ten krok ręcznie - treść jest wyżej do skopiowania.`, true);
  }
}

// Po kliknięciu „Zapisz” w oknie uwagi (nie „Anuluj”) i zniknięciu okna
// zgłaszamy zapis do apki. Bez klikania na ślepo: to Bartek klika Zapisz.
function watchUwagaSave(root) {
  const windowRoot = root.closest('.x-window') || root;
  const formCleared = () => {
    const category = document.getElementById('cmbKategorieId-inputEl');
    const content = document.getElementById('idTresc-inputEl');
    return Boolean(category && content && !category.value.trim() && !content.value.trim());
  };
  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target.closest('button, a, [role="button"], td, span, div') : null;
    if (!target || !windowRoot.contains(target)) return;
    if (normalized(textOf(target)) !== 'zapisz') return;
    document.removeEventListener('click', onClick, true);
    void (async () => {
      // VULCAN po zapisie nie zawsze zamyka okno. Czasem zostawia pusty
      // formularz do dodania kolejnej uwagi - to również jest sukces.
      const saved = await waitFor(() => !document.contains(root) || !visible(root) || formCleared(), 8000);
      if (saved) await reportUwagaSaved();
    })();
  };
  document.addEventListener('click', onClick, true);
}

// Gdy Bartek zapisze frekwencję normalnie w VULCANIE, informujemy kartę
// aplikacji. Aplikacja sama odczyta bieżącą kolumnę i zapisze obecnych,
// nieobecnych oraz spóźnionych dla tej godziny.
let lastAttendanceSaveSignal = 0;
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element
    ? event.target.closest('button, a, input[type="button"], input[type="submit"], [role="button"], td, span')
    : null;
  if (!target || target.closest(`#${BOT_ID}`)) return;
  const label = normalized(textOf(target));
  if (label !== 'zapisz' && label !== 'ok') return;
  const context = target.closest('.x-window') || target.closest('form');
  if (!context || !normalized(context.textContent).includes('frekwenc')) return;
  // Zdarzenie capture pojawia się przed faktycznym zapisem. Dajemy ExtJS
  // czas na odpowiedź serwera i przebudowanie tabeli.
  const now = Date.now();
  if (now - lastAttendanceSaveSignal < 2500) return;
  lastAttendanceSaveSignal = now;
  window.setTimeout(() => {
    void chrome.runtime.sendMessage({ type: 'VULCAN_ATTENDANCE_CHANGED' });
  }, 1600);
}, true);

async function reportUwagaSaved() {
  if (!uwaga) return;
  const eventId = uwaga.eventId;
  try {
    await chrome.runtime.sendMessage({ type: 'VULCAN_UWAGA_SAVED', eventId });
  } catch { /* apka może być zamknięta - uwagę odhaczysz ręcznie w zakładce Uwagi */ }
  phase = 'done';
  render('Gotowe. Uwaga jest zapisana w VULCANIE i odhaczona w apce.');
  uwaga = null;
  activeUwagaEventId = null;
  const next = uwagaQueue.shift();
  if (next) setTimeout(() => beginUwaga(next, 'Wpisuję kolejną uwagę z telefonu…'), 900);
  else if (frekQueue.length > 0) setTimeout(() => beginFrekwencja(frekQueue.shift()), 900);
}

function beginUwaga(payload, message = 'Uwaga z apki - wpisuję do dziennika…') {
  if (!payload?.eventId) return;
  if (payload.eventId === activeUwagaEventId || uwagaQueue.some((item) => item.eventId === payload.eventId)) return;
  if (activeUwagaEventId || activeFrekJobId) {
    uwagaQueue.push(payload);
    return;
  }
  activeUwagaEventId = payload.eventId;
  uwaga = payload;
  phase = 'uwaga-filling';
  render(message);
  void fillUwaga();
}

// --- frekwencja z telefonu: pelny automat az po Zapisz --------------------
//
// Paczka (src/lib/vulcanFrekwencja.ts) przychodzi z komputera, ktory odebral
// zlecenie z telefonu. Kroki: wstazka "Lekcja" -> dzien i godzina w drzewie
// -> (gdy lekcji nie ma) "Utwórz lekcję" z tematem z telefonu -> zakladka
// "Frekwencja" -> "Zmień frekwencję" -> symbol z legendy + klik w komorke
// ucznia -> sprawdzenie calej kolumny -> Zapisz. Cokolwiek sie nie zgadza,
// bot staje PRZED zapisem i zglasza, na ktorym kroku.
//
// Siatka frekwencji ma kolumny ucznia (Nr, Uczeń) i kolumny godzin w dwoch
// osobnych czesciach, wiec komorke znajdujemy geometrycznie: wysokosc
// wiersza z nazwiskiem x srodek naglowka godziny.

let frek = null;
let activeFrekJobId = null;
const frekQueue = [];

function frekStudentLabel(student) {
  return `nr ${student.number}`;
}

// Nazwiska porownujemy bez ogonkow (Pokładenko = Pokladenko) - apka i
// VULCAN potrafia je zapisac roznie.
const fold = (value) => normalized(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');

function startsWithName(text, student) {
  const row = fold(text);
  const wanted = fold(`${student.lastName} ${student.firstName}`);
  return row === wanted || row.startsWith(`${wanted} `) || row.startsWith(`${wanted}…`);
}

function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return prev[b.length];
}

// Literowka w nazwisku (apka vs dziennik): poczatek wiersza rozni sie
// najwyzej o 2 znaki. Uzywane tylko, gdy pasuje jeden jedyny wiersz.
function nearName(text, student) {
  const wanted = fold(`${student.lastName} ${student.firstName}`);
  const row = fold(text);
  return [row.slice(0, wanted.length), row.slice(0, wanted.length + 1), row.slice(0, wanted.length - 1)]
    .some((prefix) => editDistance(prefix.trim(), wanted) <= 2);
}

// Uczen dopisany w apce recznie bywa odwrotnie: "Zofia Niewiadomska".
const swapped = (student) => ({ lastName: student.firstName, firstName: student.lastName });
const exactName = (text, student) => startsWithName(text, student) || startsWithName(text, swapped(student));
const roughName = (text, student) => nearName(text, student) || nearName(text, swapped(student));

// Numer z apki to ostatnia deska - tylko gdy cala reszta klasy zgadza sie po
// nazwiskach (inaczej lista innej klasy dopasowalaby sie po numerach).
let frekNumberFallback = false;

// Wiersz ucznia: dokladnie po nazwisku i imieniu (takze odwrotnie), potem
// jedyny wiersz z literowka, a na koniec niczyj wiersz z tym samym numerem.
// Wiersze dopasowane dokladnie do innych uczniow z paczki sa zajete.
function frekStudentRow(rows, student) {
  const exact = rows.find((row) => startsWithName(row.name, student)) || rows.find((row) => startsWithName(row.name, swapped(student)));
  if (exact) return exact;
  const others = frek.students.filter((other) => other !== student);
  const free = rows.filter((row) => !others.some((other) => exactName(row.name, other)));
  const near = free.filter((row) => roughName(row.name, student));
  if (near.length > 0) return near.length === 1 ? near[0] : null;
  if (!frekNumberFallback) return null;
  const same = free.filter((row) => row.number === student.number && !others.some((other) => roughName(row.name, other)));
  return same.length === 1 ? same[0] : null;
}

function exactVisible(root, text, selector = 'td, span, div, a, label, button') {
  const wanted = normalized(text);
  return [...root.querySelectorAll(selector)]
    .filter((element) => visible(element) && !element.closest(`#${BOT_ID}`) && normalized(textOf(element)) === wanted)
    .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
}

async function openLekcjaView() {
  let ribbon = exactVisible(document, 'Lekcja', 'a, span, div, button')
    .filter((element) => element.getBoundingClientRect().top < 260)[0];
  if (!ribbon) {
    const dziennikTab = exactVisible(document, 'Dziennik', 'a, span, div, button')
      .filter((element) => element.getBoundingClientRect().top < 160)[0];
    if (dziennikTab) {
      clickElement(dziennikTab);
      await sleep(600);
    }
    ribbon = exactVisible(document, 'Lekcja', 'a, span, div, button').filter((element) => element.getBoundingClientRect().top < 260)[0];
  }
  if (!ribbon) throw new Error('Nie znalazłem przycisku „Lekcja” na wstążce VULCANA.');
  clickElement(ribbon);
  await sleep(900);
}

function findLessonNode(period, className, day) {
  const pattern = new RegExp(`^${period}\\.\\s*${className.replace(/\s+/g, '\\s*')}(\\s|$)`, 'i');
  const nodes = [...document.querySelectorAll('.x-tree-node-text')].filter(visible);
  if (day && nodes.length > 0) {
    const wantedDay = normalized(day);
    const dayPattern = /^(poniedziałek|wtorek|środa|czwartek|piątek|sobota|niedziela),?\s+\d{1,2}\s+/;
    let insideDay = false;
    for (const element of nodes) {
      const text = normalized(textOf(element));
      if (text === wantedDay) {
        insideDay = true;
        continue;
      }
      if (!insideDay) continue;
      if (dayPattern.test(text)) break;
      if (pattern.test(text)) return element;
    }
    return null;
  }
  const pool = nodes.length > 0 ? nodes : candidates('span, div, td, a');
  return pool
    .filter((element) => pattern.test(normalized(textOf(element))))
    .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0] || null;
}

// Wiersz drzewa (ExtJS 4: tr/table .x-grid-row, ExtJS 5+: .x-grid-item).
function treeRow(element) {
  return element?.closest('.x-grid-item, .x-grid-row, tr') || null;
}

function isRowSelected(element) {
  for (let node = element, depth = 0; node && depth < 8; node = node.parentElement, depth += 1) {
    if (/\bx-grid-(item|row)-selected\b/.test(node.className || '')) return true;
    if (node.getAttribute?.('aria-selected') === 'true') return true;
  }
  return false;
}

function isDayExpanded(dayElement) {
  for (let node = dayElement, depth = 0; node && depth < 8; node = node.parentElement, depth += 1) {
    if (/\bx-grid-tree-node-expanded\b/.test(node.className || '')) return true;
    if (node.getAttribute?.('aria-expanded') === 'true') return true;
  }
  return false;
}

async function expandDay(day, period = frek?.period, className = frek?.vulcanClassName) {
  const dayElement = await waitFor(() => findText(day), 6000);
  if (!dayElement) throw new Error(`Nie ma dnia „${day}” w drzewie lekcji (inny tydzień?).`);
  const found = () => findLessonNode(period, className, day);
  dayElement.setAttribute('data-apka-bot', 'day');
  await extRun('expand-day', '', { day });
  dayElement.removeAttribute('data-apka-bot');
  // Godziny dnia VULCAN dociaga z serwera - w karcie w tle potrafi to trwac.
  let node = await waitFor(found, 6000);
  if (node) return node;
  // Zapas: klik w plusik. NIE dwuklik - na rozwinietym dniu zwijal go z powrotem.
  if (!isDayExpanded(dayElement)) {
    const row = treeRow(dayElement);
    const expander = row?.querySelector('.x-tree-expander');
    if (expander) clickElement(expander);
    else clickElement(dayElement);
    node = await waitFor(found, 6000);
  }
  return node;
}

// Klik w godzine w drzewie musi ja naprawde ZAZNACZYC - inaczej panel po
// prawej zostaje przy poprzedniej godzinie i "Utwórz lekcję" tworzy lekcje
// nie tam (pusty formularz bez klasy i przedmiotu, test 2026-10-05).
async function selectLessonNode(node, period = frek?.period, className = frek?.vulcanClassName, day) {
  clickElement(node);
  if (await waitFor(() => isRowSelected(findLessonNode(period, className, day)), 2500)) return;
  const fresh = findLessonNode(period, className, day) || node;
  const result = await realClick([fresh]);
  if (result !== 'ok') throw new Error(`Nie udało się kliknąć ${period}. lekcji w drzewie (${result}).`);
  if (await waitFor(() => isRowSelected(findLessonNode(period, className, day)), 3500)) return;
  throw new Error(`Kliknąłem ${period}. lekcję klasy ${className}, ale VULCAN jej nie zaznaczył.`);
}

async function readAttendanceStatus(targets) {
  if (activeFrekJobId || (activeUwagaEventId && phase === 'uwaga-filling')) {
    throw new Error('VULCAN zapisuje teraz inne dane. Spróbuj ponownie po zakończeniu zapisu.');
  }
  const unique = (Array.isArray(targets) ? targets : [])
    .filter((target) => /^\d{4}-\d{2}-\d{2}$/.test(target?.date || '') && Number.isInteger(target?.period) && target?.className)
    .filter((target, index, all) => all.findIndex((item) => `${item.date}-${item.period}-${normalized(item.className).replace(/\s+/g, '')}` === `${target.date}-${target.period}-${normalized(target.className).replace(/\s+/g, '')}`) === index);
  if (unique.length === 0) return [];

  await openLekcjaView();
  const groups = new Map();
  for (const target of unique) {
    const key = `${target.date}-${normalized(target.className).replace(/\s+/g, '')}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(target);
  }

  const checks = [];
  for (const group of groups.values()) {
    const first = group[0];
    const day = new Date(`${first.date}T12:00:00`).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    let node = group.map((target) => findLessonNode(target.period, target.className, day)).find(Boolean);
    if (!node) node = await expandDay(day, first.period, first.className);
    if (!node) {
      node = group.map((target) => findLessonNode(target.period, target.className, day)).find(Boolean);
    }
    if (!node) throw new Error(`Nie znalazłem lekcji klasy ${first.className} w dniu ${day}.`);

    const nodeText = normalized(textOf(node));
    const selectedTarget = group.find((target) => new RegExp(`^${target.period}\\.`).test(nodeText)) || first;
    await selectLessonNode(node, selectedTarget.period, selectedTarget.className, day);
    await sleep(1400);

    const attendanceTab = exactVisible(document, 'Frekwencja', 'a, span, div, button')
      .filter((element) => element.getBoundingClientRect().top < 420)[0];
    if (!attendanceTab) throw new Error('Nie znalazłem zakładki „Frekwencja” w VULCANIE.');
    clickElement(attendanceTab);
    await sleep(900);

    for (const target of group) {
      const rows = await waitFor(() => {
        try { return readAttendanceFromPage(target.period, target.className); } catch { return null; }
      }, 6000);
      if (!rows) throw new Error(`Nie udało się odczytać ${target.period}. lekcji klasy ${target.className}.`);
      const checked = rows.length > 0 && rows.every((row) => {
        const symbol = normalized(row.symbol);
        return symbol !== '?';
      });
      checks.push({ ...target, checked });
    }
  }
  return checks;
}

async function openFrekLesson() {
  render('Otwieram lekcję w drzewie…');
  const day = new Date(`${frek.date}T12:00:00`).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  let node = findLessonNode(frek.period, frek.vulcanClassName, day);
  if (!node) node = await expandDay(day);
  if (!node) throw new Error(`Nie znalazłem ${frek.period}. lekcji klasy ${frek.vulcanClassName} w drzewie (${day}).`);
  await selectLessonNode(node, frek.period, frek.vulcanClassName, day);
  // Panel po prawej przeladowuje sie po zaznaczeniu - bez tej chwili bot
  // czytal jeszcze stan poprzedniej godziny.
  await sleep(1800);
  const opis = exactVisible(document, 'Opis lekcji')[0];
  if (opis) {
    clickElement(opis);
    await sleep(700);
  }
  const state = await waitFor(() => (findText('Utwórz lekcję') ? 'new' : findText('Cechy ogólne lekcji') ? 'exists' : null), 8000);
  if (!state) throw new Error('Po kliknięciu lekcji nie pojawił się jej opis.');
  return state;
}

async function createFrekLesson() {
  if (!frek.topic) {
    throw new Error('Tej lekcji nie ma jeszcze w VULCANIE, a do utworzenia potrzebny jest temat - wpisz go na telefonie i wyślij jeszcze raz.');
  }
  render(frek.topicOnly ? 'Tworzę lekcję z tematem z apki…' : 'Tworzę lekcję z tematem z telefonu…');
  clickElement(await waitForText('Utwórz lekcję'));
  const addTitle = await waitForText('Dodawanie lekcji');
  await sleep(700);
  // Formularz dla godziny z planu ma klase i przedmiot juz wpisane. Pusty
  // przedmiot = VULCAN otworzyl tworzenie dla innej (pustej) godziny - stop.
  const addWin = addTitle.closest('.x-window') || document.body;
  const subject = fieldByLabel('Przedmiot:', addWin);
  if (subject && !String(subject.value || '').trim()) {
    const cancel = findTextIn(addWin, 'Anuluj', true);
    if (cancel) clickElement(cancel);
    throw new Error(`Okno „Dodawanie lekcji” otworzyło się bez przedmiotu - to nie ta godzina. Nic nie zapisałem.`);
  }
  clickElement(exactVisible(addWin, 'Dalej')[0] || exactVisible(document, 'Dalej')[0] || (await waitForText('Dalej')));
  const title = await waitForText('Dodawanie tematu lekcji', 8000);
  await sleep(600);
  const win = title.closest('.x-window') || document.body;
  const topicField = fieldByLabel('Temat:', win);
  if (!topicField) throw new Error('Nie znalazłem pola „Temat” w oknie tworzenia lekcji.');
  setField(topicField, frek.topic);
  topicField.setAttribute('data-apka-bot', 'field');
  await extRun('set-field', '', { value: frek.topic });
  topicField.removeAttribute('data-apka-bot');
  await sleep(300);
  if (normalized(topicField.value) !== normalized(frek.topic)) throw new Error('Temat nie wpisał się w pole „Temat”.');
  const zapisz = [...win.querySelectorAll('a[uitestid="Zapisz"]')].find(visible) || findTextIn(win, 'Zapisz', true);
  if (!zapisz) throw new Error('Nie znalazłem „Zapisz” w oknie tematu.');
  const closed = () => !document.contains(win) || !visible(win) || !findText('Dodawanie tematu lekcji');
  clickElement(zapisz);
  let ok = await waitFor(closed, 6000);
  if (!ok) {
    zapisz.setAttribute('data-apka-bot', 'button');
    await extRun('button');
    zapisz.removeAttribute('data-apka-bot');
    ok = await waitFor(closed, 6000);
  }
  if (!ok) throw new Error('Okno tematu nie zamknęło się po „Zapisz” - sprawdź komunikat VULCANA.');
  if (!(await waitFor(() => findText('Cechy ogólne lekcji'), 8000))) throw new Error('Lekcja nie pokazała się po utworzeniu.');
}

async function openFrekEditor() {
  render('Otwieram frekwencję…');
  const tab = await waitFor(() => exactVisible(document, 'Frekwencja')[0], 6000);
  if (!tab) throw new Error('Nie znalazłem zakładki „Frekwencja”.');
  clickElement(tab);
  const change = await waitFor(() => exactVisible(document, 'Zmień frekwencję')[0] || findText('Zmień frekwencję'), 8000);
  if (!change) throw new Error('Nie znalazłem przycisku „Zmień frekwencję”.');
  await sleep(500);
  clickElement(change);
  const legend = await waitFor(() => exactVisible(document, 'nieobecność', 'td, div, span')[0], 8000);
  if (!legend) throw new Error('Nie otworzyło się okno zmiany frekwencji (brak legendy symboli).');
  await sleep(700);
  return legend.closest('.x-window') || document.body;
}

function centerOf(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
}

// Wiersze uczniow w oknie frekwencji: komorki pod naglowkiem "Uczeń".
function frekRows(root) {
  const header = exactVisible(root, 'Uczeń')[0];
  if (!header) throw new Error('Nie znalazłem kolumny „Uczeń” w oknie frekwencji.');
  const h = centerOf(header);
  const nrHeader = exactVisible(root, 'Nr')[0];
  const nrX = nrHeader ? centerOf(nrHeader).x : null;
  const cells = [...root.querySelectorAll('td')].filter((cell) => {
    if (!visible(cell)) return false;
    const rect = cell.getBoundingClientRect();
    return rect.left <= h.x && rect.right >= h.x && rect.top > h.rect.bottom - 2 && /\p{Lu}/u.test(cell.textContent || '');
  });
  const tds = [...root.querySelectorAll('td')].filter(visible);
  return cells
    .filter((cell) => !/^(obecnych|nieobecnych)$/.test(normalized(cell.textContent)))
    .map((cell) => {
      const c = centerOf(cell);
      const numberCell = nrX === null ? null : tds.find((td) => {
        const r = td.getBoundingClientRect();
        return r.left <= nrX && r.right >= nrX && Math.abs(r.top + r.height / 2 - c.y) < 5;
      });
      const number = numberCell ? Number(normalized(numberCell.textContent)) : NaN;
      return { cell, name: (cell.textContent || '').replace(/\s+/g, ' ').trim(), main: mainName(cell), number: Number.isFinite(number) ? number : undefined };
    });
}

// "Adamek Jan Ignacy": drugie imie VULCAN pisze szarym - bez niego zostaje
// nazwisko i imie, ktore apka moze przepisac do siebie.
function mainName(cell) {
  let base = null;
  let text = '';
  const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    const color = getComputedStyle(node.parentElement).color;
    if (base === null) base = color;
    if (color === base) text += ` ${node.textContent}`;
  }
  return text.replace(/\s+/g, ' ').replace(/…$/, '').trim();
}

// Naglowek kolumny godziny: dokladny numer, NAD wierszami uczniow (w wierszach
// tez sa liczby - kolumna Nr) i najnizej z takich (wyzej jest data dnia).
function periodHeader(root, rows, period = frek?.period) {
  const firstTop = Math.min(...rows.map((row) => row.cell.getBoundingClientRect().top));
  const uczen = exactVisible(root, 'Uczeń')[0];
  const minX = uczen ? uczen.getBoundingClientRect().right - 2 : 0;
  return exactVisible(root, String(period), 'td, div, span')
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom <= firstTop + 2 && rect.left >= minX;
    })
    .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0] || null;
}

// Komorka pod punktem liczona z prostokatow, nie elementsFromPoint - ten
// widzi tylko to, co akurat jest w oknie przegladarki.
function cellAt(root, x, y) {
  const hits = [...root.querySelectorAll('td')].filter((td) => {
    if (!visible(td) || td.closest(`#${BOT_ID}`)) return false;
    const rect = td.getBoundingClientRect();
    return rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y;
  });
  // Zagniezdzone tabele ExtJS: najmniejsza komorka to ta wlasciwa.
  return hits.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0] || null;
}

function markCell(root, student, header) {
  const row = frekStudentRow(frekRows(root), student);
  if (!row) return null;
  row.cell.scrollIntoView({ block: 'nearest' });
  return cellAt(root, centerOf(header).x, centerOf(row.cell).y);
}

function legendRow(root, name) {
  const cell = exactVisible(root, name, 'td, div')[0];
  if (!cell) return null;
  const tr = cell.closest('tr');
  const symbol = tr ? normalized(tr.cells[0]?.textContent || '') : '';
  return { cell, symbol };
}

const symbolMatches = (text, symbol) => {
  const value = normalized(text);
  if (!symbol) return value !== '' && value !== '?';
  const dash = (v) => v.replace(/[—–−-]/g, '-');
  const dot = (v) => v.replace(/[•●∙·.]/g, '.');
  return value === symbol || dash(dot(value)) === dash(dot(symbol));
};

// Symbole wpisane przez szkole, ktorych bot nie rusza: nauczanie
// indywidualne, zwolniony, zdalne, edukacja domowa, oddelegowany.
const KEEP_SYMBOLS = ['ni', 'z', 'zn', 'ed', 'od'];
// Nieobecnosc juz usprawiedliwiona (wychowawca wpisuje "u" z gory na caly
// dzien) - nieobecnemu zostawiamy "u" zamiast myslnika.
const EXCUSED_SYMBOLS = ['u', 'ns'];
const LEGEND_ORDER = ['obecność', 'nieobecność', 'spóźnienie', 'nauczanie indywidualne'];

// Lista klasy odczytana z okna frekwencji - wraca do apki takze przy bledzie,
// zeby apka poprawila swoje listy (numery, pisownia, kto odszedl, kto ma "ni").
let frekRoster = [];

function rowCell(root, row, header) {
  row.cell.scrollIntoView({ block: 'nearest' });
  return cellAt(root, centerOf(header).x, centerOf(row.cell).y);
}

async function markFrekAttendance(root) {
  const rows = await waitFor(() => {
    try {
      const found = frekRows(root);
      return found.length > 0 ? found : null;
    } catch {
      return null;
    }
  }, 6000);
  if (!rows) {
    frekRows(root); // rzuca czytelny blad, gdy nie ma kolumny "Uczeń"
    throw new Error('Nie widzę uczniów w oknie frekwencji.');
  }
  const header = periodHeader(root, rows);
  if (!header) throw new Error(`Nie znalazłem kolumny ${frek.period}. lekcji w oknie frekwencji.`);
  frekRoster = rows
    .filter((row) => row.number !== undefined)
    .map((row) => ({ number: row.number, name: row.name, main: row.main, symbol: normalized(rowCell(root, row, header)?.textContent) }));

  frekNumberFallback = false;
  const byName = frek.students.filter((student) => frekStudentRow(rows, student));
  frekNumberFallback = rows.length >= 5 && frek.students.length - byName.length <= 2;
  const found = frek.students.filter((student) => frekStudentRow(rows, student));
  // Uczen z nauczaniem indywidualnym jest w apce wylaczony - gdy VULCAN go nie
  // ma, nie ma o czym meldowac.
  const missing = frek.students.filter((student) => !found.includes(student) && student.legend !== 'nauczanie indywidualne');
  const expected = frek.students.filter((student) => student.legend !== 'nauczanie indywidualne');
  const foundExpected = expected.filter((student) => byName.includes(student));
  if (expected.length >= 4 && foundExpected.length < expected.length / 2) {
    throw new Error(`W oknie frekwencji jest inna lista (znalazłem ${foundExpected.length} z ${expected.length} uczniów ${frek.vulcanClassName}) - nic nie zaznaczam.`);
  }

  const legends = {};
  for (const name of LEGEND_ORDER) {
    if (!found.some((student) => student.legend === name)) continue;
    legends[name] = legendRow(root, name);
    if (!legends[name]) throw new Error(`Nie ma symbolu „${name}” w legendzie.`);
  }
  const cellText = (student) => normalized(markCell(root, student, header)?.textContent);
  const isRight = (student) => symbolMatches(markCell(root, student, header)?.textContent, legends[student.legend].symbol);

  const initial = new Map(found.map((student) => [student, cellText(student)]));
  const kept = found.filter((student) => {
    const now = initial.get(student);
    return KEEP_SYMBOLS.includes(now) || (student.legend === 'nieobecność' && EXCUSED_SYMBOLS.includes(now));
  });
  const targets = found.filter((student) => !kept.includes(student));

  let useRealClicks = false;
  for (const legendName of LEGEND_ORDER) {
    const group = targets.filter((student) => student.legend === legendName);
    if (group.length === 0) continue;
    const legend = legends[legendName];
    render(`Zaznaczam: ${legendName} (${group.length})…`);
    const todo = group.filter((student) => !isRight(student));
    if (todo.length === 0) continue;
    if (!useRealClicks) {
      clickElement(legend.cell);
      await sleep(250);
      for (const student of todo) {
        const cell = markCell(root, student, header);
        if (!cell) continue;
        clickElement(cell);
        await sleep(120);
        if (!isRight(student)) {
          useRealClicks = true;
          break;
        }
      }
    }
    if (useRealClicks) {
      const still = group.filter((student) => !isRight(student));
      if (still.length > 0) {
        render(`Zaznaczam prawdziwymi kliknięciami: ${legendName} (${still.length})…`);
        const cells = still.map((student) => markCell(root, student, header)).filter(Boolean);
        const result = await realClick([legend.cell, ...cells]);
        if (result !== 'ok') throw new Error(`Kliknięcia przez debugger nie przeszły: ${result}.`);
        await sleep(400);
      }
    }
  }

  // VULCAN odswieza komorki z opoznieniem - chwila na dojscie, potem jedna
  // poprawka prawdziwymi kliknieciami, dopiero wtedy blad.
  const wrongNow = () => targets.filter((student) => !isRight(student));
  await waitFor(() => wrongNow().length === 0, 4000);
  let wrong = wrongNow();
  if (wrong.length > 0) {
    render(`Poprawiam ${wrong.length} komórek…`);
    for (const legendName of LEGEND_ORDER) {
      const cells = wrong.filter((student) => student.legend === legendName).map((student) => markCell(root, student, header)).filter(Boolean);
      if (cells.length === 0) continue;
      const result = await realClick([legends[legendName].cell, ...cells]);
      if (result !== 'ok') throw new Error(`Kliknięcia przez debugger nie przeszły: ${result}.`);
    }
    await waitFor(() => wrongNow().length === 0, 4000);
    wrong = wrongNow();
  }
  // Obecny, ktoremu VULCAN nie dal zmienic "u" z gory - zostaje "u", meldujemy.
  const stuck = wrong.filter((student) => EXCUSED_SYMBOLS.includes(initial.get(student)) && cellText(student) === initial.get(student));
  wrong = wrong.filter((student) => !stuck.includes(student));
  if (wrong.length > 0) {
    const details = wrong.map((student) => `${frekStudentLabel(student)}: jest „${cellText(student) || 'puste'}”, ma być „${legends[student.legend].symbol}”`);
    throw new Error(`Kolumna się nie zgadza (${details.join('; ')}) - nie zapisuję. Sprawdź okno frekwencji.`);
  }
  return { roster: frekRoster, missing, stuck: stuck.map((student) => ({ student, symbol: initial.get(student) })) };
}

async function saveFrekEditor(root) {
  render('Zapisuję frekwencję…');
  const zapisz = [...root.querySelectorAll('a[uitestid="Zapisz"]')].find(visible) || findTextIn(root, 'Zapisz', true);
  if (!zapisz) throw new Error('Nie znalazłem „Zapisz” w oknie frekwencji.');
  const closed = () => !exactVisible(document, 'nieobecność', 'td, div, span')[0];
  clickElement(zapisz);
  let ok = await waitFor(closed, 6000);
  if (!ok) {
    zapisz.setAttribute('data-apka-bot', 'button');
    await extRun('button');
    zapisz.removeAttribute('data-apka-bot');
    ok = await waitFor(closed, 6000);
  }
  if (!ok) {
    await realClick([zapisz]);
    ok = await waitFor(closed, 8000);
  }
  if (!ok) throw new Error('Kliknąłem Zapisz, ale okno frekwencji zostało otwarte - sprawdź komunikat VULCANA.');
}

async function finishFrek(result) {
  try {
    await chrome.runtime.sendMessage({ type: 'VULCAN_FREKWENCJA_DONE', result: { jobId: frek.jobId, ...result } });
  } catch { /* apka zamknieta - zlecenie samo przejdzie w blad po czasie */ }
}

// Okno "Dodawanie lekcji" / "Dodawanie tematu" zostawione po nieudanej
// probie zaslania drzewo (maska ExtJS) - kolejna proba utknelaby za nim.
async function closeLeftoverWindows() {
  for (const title of ['Dodawanie tematu lekcji', 'Dodawanie lekcji']) {
    const header = findText(title);
    const win = header?.closest('.x-window');
    if (!win) continue;
    const cancel = findTextIn(win, 'Anuluj', true);
    if (cancel) {
      clickElement(cancel);
      await waitFor(() => !document.contains(win) || !visible(win), 3000);
    }
  }
}

async function runFrekwencja() {
  frekRoster = [];
  try {
    await closeLeftoverWindows();
    await openLekcjaView();
    const state = await openFrekLesson();
    if (state === 'new') await createFrekLesson();
    if (frek.topicOnly) {
      // "do VULCANA" z pulpitu: sam temat, frekwencji nie ruszamy. Istniejacej
      // lekcji tez nie - jej temat zostaje taki, jaki jest w dzienniku.
      const message = state === 'new' ? 'Lekcja utworzona z tematem.' : 'Ta lekcja już była w VULCANIE - temat bez zmian.';
      phase = 'done';
      render(`Gotowe. ${message}`);
      await finishFrek({ ok: true, existed: state !== 'new', message });
      return;
    }
    const root = await openFrekEditor();
    const marked = await markFrekAttendance(root);
    await saveFrekEditor(root);
    let note = marked.missing.length > 0 ? ` Nie było w VULCANIE: ${marked.missing.map(frekStudentLabel).join(', ')}.` : '';
    if (marked.stuck.length > 0) {
      note += ` Zostawione z dziennika (VULCAN nie dał zmienić): ${marked.stuck.map(({ student, symbol }) => `${frekStudentLabel(student)} „${symbol}”`).join(', ')}.`;
    }
    phase = 'done';
    render(`Gotowe. Frekwencja zapisana.${note}`);
    await finishFrek({ ok: true, message: note.trim(), roster: marked.roster });
  } catch (error) {
    phase = 'done';
    const message = String(error?.message || error);
    render(message, true);
    await finishFrek({ ok: false, message, roster: frekRoster });
  } finally {
    frek = null;
    activeFrekJobId = null;
    const next = frekQueue.shift();
    const nextUwaga = next ? null : uwagaQueue.shift();
    if (next) setTimeout(() => beginFrekwencja(next), 900);
    else if (nextUwaga) setTimeout(() => beginUwaga(nextUwaga, 'Wpisuję uwagę z telefonu…'), 900);
  }
}

function beginFrekwencja(payload) {
  if (!payload?.jobId || payload.kind !== 'frekwencja') return;
  if (payload.jobId === activeFrekJobId || frekQueue.some((item) => item.jobId === payload.jobId)) return;
  // Uwaga, ktora padla na bledzie, nie zwalnia activeUwagaEventId - czekamy
  // tylko na uwage, ktora naprawde jest w trakcie wypelniania.
  if (activeFrekJobId || (activeUwagaEventId && phase === 'uwaga-filling')) {
    frekQueue.push(payload);
    return;
  }
  activeFrekJobId = payload.jobId;
  frek = payload;
  phase = 'frek';
  render('Frekwencja z telefonu - wpisuję do dziennika…');
  void runFrekwencja();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'VULCAN_FREKWENCJA') {
    beginFrekwencja(message.payload);
    return;
  }
  if (message?.type === 'VULCAN_UWAGA') {
    // Zadnego potwierdzania w paneliku (decyzja Bartka): danie uwagi w apce
    // JEST zatwierdzeniem, bot od razu wypelnia i zapisuje.
    beginUwaga(message.payload);
    return;
  }
  if (message?.type === 'READ_VULCAN_SCHEDULE') {
    sendResponse({ entries: readScheduleFromPage() });
    return false;
  }
  if (message?.type === 'READ_VULCAN_ATTENDANCE') {
    try {
      sendResponse({ rows: readAttendanceFromPage(message.period) });
    } catch (error) {
      sendResponse({ error: String(error?.message || error) });
    }
    return false;
  }
  if (message?.type === 'READ_VULCAN_ATTENDANCE_STATUS') {
    void readAttendanceStatus(message.targets)
      .then((checks) => sendResponse({ checks }))
      .catch((error) => sendResponse({ error: String(error?.message || error) }));
    return true;
  }
  if (message?.type !== 'VULCAN_TRANSFER') return;
  transfer = message.payload;
  phase = 'start';
  render('Paczka jest gotowa. Najpierw otworzę wskazaną lekcję i uzupełnię opis bez zapisywania.');
});

chrome.storage.session.get(['pendingVulcanTransfer', 'pendingVulcanUwaga', 'pendingVulcanFrekwencja']).then(({ pendingVulcanTransfer, pendingVulcanUwaga, pendingVulcanFrekwencja }) => {
  if (pendingVulcanFrekwencja) beginFrekwencja(pendingVulcanFrekwencja);
  if (pendingVulcanUwaga) {
    beginUwaga(pendingVulcanUwaga, 'Uwaga z apki czekała na załadowanie VULCANA - wpisuję do dziennika…');
    return;
  }
  if (!pendingVulcanTransfer) return;
  transfer = pendingVulcanTransfer;
  render('Paczka czekała na załadowanie VULCANA. Możesz rozpocząć uzupełnianie.');
});
