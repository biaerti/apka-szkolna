const BOT_ID = 'apka-szkolna-vulcan-bot';
let transfer = null;
let phase = 'start';

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
  return [...document.querySelectorAll(selector)].filter(visible);
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

function fieldByLabel(labelText) {
  const label = findText(labelText, false, 'label, td, span, div');
  if (!label) return null;
  let node = label;
  for (let depth = 0; depth < 5 && node; depth += 1, node = node.parentElement) {
    const fields = [...node.querySelectorAll('input:not([type="hidden"]), textarea, select')].filter(visible);
    const after = fields.find((field) => field.getBoundingClientRect().left >= label.getBoundingClientRect().right - 8);
    if (after) return after;
  }
  const labelRect = label.getBoundingClientRect();
  return candidates('input:not([type="hidden"]), textarea, select')
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
    });
  }
  const content = root.querySelector('[data-slot="content"]');
  const buttons = root.querySelector('[data-slot="buttons"]');
  const absent = transfer?.attendance?.filter((row) => row.status === 'absent').length ?? 0;
  const late = transfer?.attendance?.filter((row) => row.status === 'late').length ?? 0;
  content.innerHTML = `${transfer ? `<div class="summary"><strong>${transfer.period}. lekcja · ${transfer.vulcanClassName}</strong><br>${transfer.topic}<br>Nieobecni: ${absent}, spóźnieni: ${late}</div>` : ''}<p class="${error ? 'error' : ''}">${message}</p>`;
  buttons.innerHTML = phase === 'start' ? '<button data-action="fill">Uzupełnij opis lekcji</button>' : phase === 'review-description' ? '<button data-action="attendance">Zapisz opis i ustaw frekwencję</button>' : phase === 'review-attendance' ? '<button data-action="confirm">Zatwierdź frekwencję</button>' : '';
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

async function chooseDropdown(label, text) {
  const field = fieldByLabel(label);
  if (!field) throw new Error(`Nie znalazłem pola „${label}”.`);
  if (field instanceof HTMLSelectElement) {
    const option = [...field.options].find((item) => normalized(item.text).includes(normalized(text)));
    if (!option) throw new Error(`W polu „${label}” nie ma opcji „${text}”.`);
    setField(field, option.value);
    return;
  }
  clickElement(field);
  await sleep(220);
  const option = findText(text);
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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

chrome.storage.session.get('pendingVulcanTransfer').then(({ pendingVulcanTransfer }) => {
  if (!pendingVulcanTransfer) return;
  transfer = pendingVulcanTransfer;
  render('Paczka czekała na załadowanie VULCANA. Możesz rozpocząć uzupełnianie.');
});
