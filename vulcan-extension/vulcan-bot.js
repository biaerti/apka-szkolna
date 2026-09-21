const BOT_ID = 'apka-szkolna-vulcan-bot';
let transfer = null;
let phase = 'start';
// Uwaga z apki (zakładka „Uwagi” w lekcji -> „Dodaj”). Osobna paczka niż
// temat + frekwencja; ten sam panel pomocnika, inne fazy: uwaga-start ->
// uwaga-review (formularz wypełniony, Bartek klika Zapisz sam) -> done.
let uwaga = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
    const lesson = /^(\d{1,2})\.\s+([0-9IVX]+\s*[A-Z])\s+(Język polski)(.*)$/i.exec(line);
    if (!lesson) {
      lastLessonLine = -2;
      continue;
    }
    entries.push({
      date,
      period: Number(lesson[1]),
      className: lesson[2].replace(/\s+/g, ''),
      subject: lesson[3],
      replacement: /zastępstwo/i.test(lesson[4]) ? lesson[4].replace(/^[,\s]+/, '').trim() : undefined,
    });
    lastLessonLine = lineIndex;
  }
  return entries.filter((entry, index) => entries.findIndex((candidate) => candidate.date === entry.date && candidate.period === entry.period && candidate.className === entry.className) === index);
}

// Odczyt frekwencji z otwartej tabeli (kierunek VULCAN -> apka). Szukamy
// tabeli, ktora w naglowku (pierwsze wiersze) ma numer wskazanej godziny,
// a w wierszach nazwiska - i czytamy symbol z komorki pod ta kolumna.
function readAttendanceFromPage(period) {
  const tables = [...document.querySelectorAll('table')].filter(visible);
  for (const table of tables) {
    let header = null;
    for (let rowIndex = 0; rowIndex < Math.min(3, table.rows.length) && !header; rowIndex += 1) {
      for (const cell of table.rows[rowIndex].cells) {
        if (normalized(cell.textContent) === String(period)) { header = cell; break; }
      }
    }
    if (!header) continue;
    const headerRect = header.getBoundingClientRect();
    const targetX = headerRect.left + headerRect.width / 2;
    const rows = [];
    for (const row of table.rows) {
      const cells = [...row.cells];
      const nameCell = cells.find((cell) => /\p{Lu}[\p{Ll}-]+\s+\p{Lu}[\p{Ll}-]+/u.test((cell.textContent || '').trim()));
      if (!nameCell) continue;
      const mark = cells.find((cell) => {
        const rect = cell.getBoundingClientRect();
        return cell !== nameCell && targetX >= rect.left && targetX <= rect.right;
      });
      if (!mark) continue;
      const numberCell = cells.find((cell) => /^\d{1,2}$/.test(normalized(cell.textContent)));
      rows.push({
        number: numberCell ? Number(normalized(numberCell.textContent)) : undefined,
        name: (nameCell.textContent || '').replace(/\s+/g, ' ').trim(),
        symbol: normalized(mark.textContent),
      });
    }
    if (rows.length > 0) return rows;
  }
  throw new Error(`Nie znalazłem tabeli frekwencji z kolumną ${period}. lekcji. Otwórz w VULCANIE frekwencję tej lekcji.`);
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
      <h2>Pomocnik VULCAN</h2><div data-slot="content"></div><div class="buttons" data-slot="buttons"></div>`;
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
  const summary = uwaga
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
  const option = await waitFor(() => {
    const items = [...document.querySelectorAll('.x-boundlist-item')].filter(visible);
    return items.find((el) => normalized(el.textContent) === wanted) || items.find((el) => normalized(el.textContent).includes(wanted));
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
  // Okno dodawania uwagi: kontener, w którym są oba nagłówki list.
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
  const search = [...root.querySelectorAll('input')].filter(visible)
    .find((input) => normalized(input.placeholder).includes('wyszuk'));
  if (search) {
    setField(search, student.lastName);
    await sleep(600);
  }
  const full = `${student.lastName} ${student.firstName}`;
  const findRow = () => findTextIn(root, full, false, 'td, div, span') || findTextIn(root, student.lastName, false, 'td, div, span');
  const row = await waitFor(findRow, 4000);
  if (!row) throw new Error(`Nie znalazłem ucznia ${full} na liście po lewej.`);
  // Prawa lista pokazuje "Brak danych", dopoki nikt nie przeszedl do
  // "Dotyczy" - to nasz sprawdzian, czy przeniesienie NAPRAWDE zaszlo
  // (w pierwszym zywym tescie klik w ">" nic nie przeniosl).
  const transferred = () => !findTextIn(root, 'Brak danych');
  clickElement(row);
  await sleep(300);
  // Strzalka ">" to przycisk-ikona BEZ tekstu (x-btn-icon-el), wiec szukanie
  // po tresci nie dziala. Bierzemy przyciski lezace poziomo MIEDZY listami
  // (na prawo od lewej listy, na lewo od naglowka "Dotyczy"); pierwszy od
  // gory to ">", drugi ">>" - oba przenosza zaznaczonego ucznia.
  const header = findTextIn(root, 'Nazwisko i imię');
  const dotyczy = findTextIn(root, 'Dotyczy', true);
  const leftEdge = header ? header.getBoundingClientRect().right : row.getBoundingClientRect().right;
  const rightEdge = dotyczy ? dotyczy.getBoundingClientRect().left : Infinity;
  const arrow = [...root.querySelectorAll('.x-btn, button, [role="button"], a')]
    .filter(visible)
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= leftEdge && r.right <= rightEdge && r.width <= 90 && r.height <= 60;
    })
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
  if (arrow) {
    clickElement(arrow);
    await waitFor(transferred, 2500);
  }
  if (!transferred()) {
    // Druga proba: dwuklik na wierszu tez przenosi w oknach VULCANA.
    const again = findRow();
    if (again) {
      clickElement(again);
      again.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await waitFor(transferred, 2500);
    }
  }
  if (!transferred()) throw new Error(`Nie udało się przenieść ucznia ${full} do listy „Dotyczy” (strzałką „>” ani dwuklikiem).`);
  await sleep(250);
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
  const ribbon = await waitFor(() => findText('Dziennik oddziału', true), 5000);
  if (!ribbon) throw new Error('Nie znalazłem przycisku „Dziennik oddziału” na górnej wstążce.');
  clickElement(ribbon);
  await sleep(900);
  render(`Otwieram klasę ${uwaga.vulcanClassName} w drzewie…`);
  const wanted = normalized(uwaga.vulcanClassName);
  const klasa = await waitFor(() => {
    const matches = candidates('td, span, div, a, li')
      .map((element) => ({ element, text: normalized(textOf(element)) }))
      .filter(({ text }) => text.startsWith(`${wanted} (`))
      .sort((a, b) => {
        const ra = a.element.getBoundingClientRect();
        const rb = b.element.getBoundingClientRect();
        return ra.width * ra.height - rb.width * rb.height;
      });
    return matches[0]?.element;
  }, 8000);
  if (!klasa) throw new Error(`Nie znalazłem klasy ${uwaga.vulcanClassName} w drzewie dzienników po lewej.`);
  clickElement(klasa);
  await sleep(900);
  render('Otwieram „Pochwały i uwagi”…');
  const menu = await waitFor(() => findTextLowest('Pochwały i uwagi', true), 8000);
  if (!menu) throw new Error('Nie znalazłem pozycji „Pochwały i uwagi” w menu dziennika oddziału.');
  clickElement(menu);
  await sleep(700);
}

async function fillUwaga() {
  try {
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
    await chooseKategoria(root, uwaga.category);
    const content = fieldByLabel('Treść', root);
    if (!(content instanceof HTMLTextAreaElement) && !(content instanceof HTMLInputElement)) throw new Error('Nie znalazłem pola „Treść”.');
    setField(content, uwaga.content);
    phase = 'uwaga-review';
    render('Formularz jest wypełniony. Sprawdź ucznia w „Dotyczy”, kategorię i treść, potem kliknij <strong>Zapisz</strong> w VULCANIE. Nic nie zostało jeszcze zapisane.');
    watchUwagaSave(root);
  } catch (error) {
    phase = 'uwaga-start';
    render(`${error.message} Dokończ ten krok ręcznie - treść jest wyżej do skopiowania.`, true);
  }
}

// Po kliknięciu „Zapisz” w oknie uwagi (nie „Anuluj”) i zniknięciu okna
// zgłaszamy zapis do apki. Bez klikania na ślepo: to Bartek klika Zapisz.
function watchUwagaSave(root) {
  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target.closest('button, a, [role="button"], td, span, div') : null;
    if (!target || !root.contains(target)) return;
    if (normalized(textOf(target)) !== 'zapisz') return;
    document.removeEventListener('click', onClick, true);
    void (async () => {
      const gone = await waitFor(() => !document.contains(root) || !visible(root), 8000);
      if (gone) await reportUwagaSaved();
    })();
  };
  document.addEventListener('click', onClick, true);
}

async function reportUwagaSaved() {
  if (!uwaga) return;
  const eventId = uwaga.eventId;
  try {
    await chrome.runtime.sendMessage({ type: 'VULCAN_UWAGA_SAVED', eventId });
  } catch { /* apka może być zamknięta - uwagę odhaczysz ręcznie w zakładce Uwagi */ }
  phase = 'done';
  render('Gotowe. Uwaga jest zapisana w VULCANIE i odhaczona w apce.');
  uwaga = null;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'VULCAN_UWAGA') {
    uwaga = message.payload;
    phase = 'uwaga-start';
    if (uwaga.background) {
      // Auto-wpis w tle: wypełniamy formularz od razu, bez czekania na klik.
      // Jak zawsze zatrzymujemy się przed „Zapisz” - to klika Bartek.
      render('Uwaga z telefonu - wypełniam formularz w tle…');
      void fillUwaga();
    } else {
      render('Uwaga z apki jest gotowa. Otworzę zakładkę „Uwagi”, dodam ucznia, kategorię i treść, ale nie zapiszę.');
    }
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
  if (message?.type !== 'VULCAN_TRANSFER') return;
  transfer = message.payload;
  phase = 'start';
  render('Paczka jest gotowa. Najpierw otworzę wskazaną lekcję i uzupełnię opis bez zapisywania.');
});

chrome.storage.session.get(['pendingVulcanTransfer', 'pendingVulcanUwaga']).then(({ pendingVulcanTransfer, pendingVulcanUwaga }) => {
  if (pendingVulcanUwaga) {
    uwaga = pendingVulcanUwaga;
    phase = 'uwaga-start';
    if (uwaga.background) {
      render('Uwaga z telefonu czekała na załadowanie VULCANA - wypełniam formularz w tle…');
      void fillUwaga();
    } else {
      render('Uwaga z apki czekała na załadowanie VULCANA. Możesz otworzyć formularz.');
    }
    return;
  }
  if (!pendingVulcanTransfer) return;
  transfer = pendingVulcanTransfer;
  render('Paczka czekała na załadowanie VULCANA. Możesz rozpocząć uzupełnianie.');
});
