// Buduje zeszyt "Mój polski od zera": HTML -> PDF A5 (headless Chrome przez CDP) -> broszura A4 (impozycja.py).
// Uruchom: node karty-pracy/polski-od-zera/buduj.mjs
import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs'
import { spawn, execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'
import { czesc1, czesc2, notatkiStrona } from './tresc.mjs'
import { czesc3 } from './tresc3.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const OUT = join(DIR, 'pdf')
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
mkdirSync(OUT, { recursive: true })

const css = readFileSync(join(DIR, 'styl.css'), 'utf8')
const html = (tytul, strony) => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${tytul}</title>
<style>${css}</style></head><body>${strony.join('\n')}</body></html>`

const czesci = [
  { plik: 'czesc-1', tytul: 'Mój polski od zera - część 1', strony: czesc1() },
  { plik: 'czesc-2', tytul: 'Mój polski od zera - część 2', strony: czesc2() },
  { plik: 'czesc-3', tytul: 'Mój polski od zera - część 3', strony: czesc3() },
]

// Uklada klocki stron "cont" na wolnym miejscu poprzedniej strony, dopycha notatkami do
// wielokrotnosci 4 (broszura) i wpisuje numer strony klucza. Dziala w przegladarce.
function paginacja(notatkiHtml) {
  const mm = v => v * 96 / 25.4
  const out = document.createElement('main')
  const src = [...document.querySelectorAll('body > section.page')]
  document.body.appendChild(out)
  let cur = null
  const nowa = cls => { cur = document.createElement('section'); cur.className = cls; out.appendChild(cur) }
  const miesci = () => {
    const limit = cur.getBoundingClientRect().top + mm(210 - 12) + 0.5
    return [...cur.children].every(c => c.getBoundingClientRect().bottom <= limit)
  }
  for (const s of src) {
    const cls = s.className.replace(' cont', '')
    if (!s.classList.contains('cont') || !cur) nowa(cls)
    for (const d of [...s.children]) {
      cur.appendChild(d)
      if (miesci() || cur.children.length === 1) continue
      cur.removeChild(d)
      const prev = cur.lastElementChild
      const zabierz = prev && (prev.classList.contains('sec') || prev.tagName === 'H4' || prev.tagName === 'HEADER') ? [prev] : []
      nowa(cls)
      zabierz.forEach(p => cur.appendChild(p))
      cur.appendChild(d)
    }
    s.remove()
  }
  const kluczPierwsza = out.querySelector('section.key')
  const pad = (4 - (out.children.length % 4)) % 4
  for (let i = 0; i < pad; i++) {
    const t = document.createElement('template')
    t.innerHTML = notatkiHtml.trim()
    out.insertBefore(t.content.firstElementChild, kluczPierwsza)
  }
  const strony = [...out.children]
  const nrKlucza = strony.indexOf(kluczPierwsza) + 1
  document.querySelectorAll('.kluczstr').forEach(el => { el.textContent = nrKlucza })
  const przepelnione = strony.map((p, i) => {
    const limit = p.getBoundingClientRect().top + mm(210 - 12) + 0.5
    return [...p.querySelectorAll('*')].some(el => el.getBoundingClientRect().bottom > limit) ? i + 1 : 0
  }).filter(Boolean)
  return { strony: strony.length, przepelnione }
}

// port 9401 zarezerwowany dla zeszytu (9333-9399 to rendery filmikow); profil osobny na kazde uruchomienie
const PORT = 9401
const profil = join(tmpdir(), `polski-od-zera-chrome-${process.pid}`)
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' })

async function ws() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
      const page = list.find(t => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise(r => setTimeout(r, 200))
  }
  throw new Error('Chrome nie wystartowal')
}

const sock = new WebSocket(await ws())
await new Promise(r => sock.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
const waiters = []
sock.addEventListener('message', ev => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
  if (m.method) waiters.filter(w => w.method === m.method).forEach(w => { w.resolve(m); waiters.splice(waiters.indexOf(w), 1) })
})
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const i = ++id
  pending.set(i, m => m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result))
  sock.send(JSON.stringify({ id: i, method, params }))
})
const once = method => new Promise(resolve => waiters.push({ method, resolve }))

await cdp('Page.enable')
let blad = false
for (const c of czesci) {
  const plikHtml = join(OUT, `${c.plik}.html`)
  writeFileSync(plikHtml, html(c.tytul, c.strony))
  const loaded = once('Page.loadEventFired')
  await cdp('Page.navigate', { url: pathToFileURL(plikHtml).href })
  await loaded
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
  const { result } = await cdp('Runtime.evaluate', {
    returnByValue: true,
    expression: `(${paginacja.toString()})(${JSON.stringify(notatkiStrona)})`,
  })
  const pdf = await cdp('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false })
  const plikPdf = join(OUT, `${c.plik}-A5.pdf`)
  writeFileSync(plikPdf, Buffer.from(pdf.data, 'base64'))
  const { strony, przepelnione } = result.value
  console.log(`${c.plik}: ${strony} stron A5`, przepelnione.length ? `PRZEPELNIONE STRONY: ${przepelnione.join(', ')}` : 'bez przepelnien')
  if (przepelnione.length) blad = true
  execFileSync('python', [join(DIR, 'impozycja.py'), plikPdf, join(OUT, `${c.plik}-broszura-A4.pdf`), join(OUT, `${c.plik}-do-ciecia-A4.pdf`)], { stdio: 'inherit' })
}
sock.close()
chrome.kill()
setTimeout(() => { try { rmSync(profil, { recursive: true, force: true }) } catch {} }, 1500)
if (blad) process.exitCode = 1
