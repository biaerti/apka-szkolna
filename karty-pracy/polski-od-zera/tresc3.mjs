// Zeszyt "Mój polski od zera" - część 3 (tematy 11-16). Ten sam układ co części 1-2.
import { head, vocab, task, match, bl, lines, box, say, umiem, sec, picGrid, frame } from './klocki.mjs'
import { okladka, stronaStartu, stronaPolecen, dyplom, ciag } from './tresc.mjs'

const L11 = [
`<section class="page">
  ${head(11, 'Miesiące, pory roku i pogoda', 'Месяцы, времена года и погода')}
  ${vocab([
    ['1', 'styczeń', 'стычэнь', 'январь'],
    ['2', 'luty', 'луты', 'февраль'],
    ['3', 'marzec', 'мажэц', 'март'],
    ['4', 'kwiecień', 'квечень', 'апрель'],
    ['5', 'maj', 'май', 'май'],
    ['6', 'czerwiec', 'чэрвец', 'июнь'],
    ['7', 'lipiec', 'липец', 'июль'],
    ['8', 'sierpień', 'щерпень', 'август'],
    ['9', 'wrzesień', 'вжэщень', 'сентябрь'],
    ['10', 'październik', 'пажджерник', 'октябрь'],
    ['11', 'listopad', 'листопад', 'ноябрь (!)'],
    ['12', 'grudzień', 'груджень', 'декабрь'],
  ])}
  ${box(`<p class="ru">Польские месяцы совсем не похожи на русские! Подсказки: <b>lipiec</b> - когда цветёт липа, <b>listopad</b> - когда падают листья (но это <b>ноябрь</b>, а не октябрь).</p>
    <p class="ru"><b>W którym miesiącu?</b> = В каком месяце? Готовые формы:</p>
    <p class="small">w styczniu · w lutym · w marcu · w kwietniu · w maju · w czerwcu · w lipcu · w sierpniu · we wrześniu · w październiku · w listopadzie · w grudniu</p>`)}
</section>`,
`<section class="page">
  ${sec('Pory roku', 'Времена года')}
  ${vocab([
    ['🌷', 'wiosna', 'весна', 'весна'],
    ['☀️', 'lato', 'лато', 'лето'],
    ['🍂', 'jesień', 'ещень', 'осень'],
    ['❄️', 'zima', 'жима', 'зима'],
  ])}
  ${sec('Jaka jest pogoda?', 'Какая погода?')}
  ${vocab([
    ['☀️', 'Świeci słońce.', 'щвечи сўоньцэ', 'Светит солнце.'],
    ['🌧️', 'Pada deszcz.', 'пада дэшч', 'Идёт дождь.'],
    ['🌨️', 'Pada śnieg.', 'пада щнег', 'Идёт снег.'],
    ['💨', 'Wieje wiatr.', 'вее вятр', 'Дует ветер.'],
    ['☁️', 'Jest pochmurno.', 'ест похмурно', 'Пасмурно.'],
    ['⛈️', 'Jest burza.', 'ест буржа', 'Гроза.'],
    ['🥵', 'Jest ciepło. / Jest gorąco.', 'чепўо / горонцо', 'Тепло. / Жарко.'],
    ['🥶', 'Jest zimno.', 'ест жимно', 'Холодно.'],
  ], 1)}
  ${sec('Urodziny', 'День рождения')}
  ${vocab([
    ['❓', 'Kiedy masz urodziny?', 'кеды маш уроджины', 'Когда у тебя день рождения?'],
    ['🎂', 'Mam urodziny w maju.', 'мам уроджины в маю', 'У меня день рождения в мае.'],
    ['🎉', 'Wszystkiego najlepszego!', 'фшысткего найлепшэго', 'С днём рождения! (Всего наилучшего!)'],
  ], 1)}
</section>`,
`<section class="page">
  ${task(1, 'Wpisz brakujące miesiące.', 'Впиши пропущенные месяцы.',
    `<div class="fillrow">styczeń, ${bl(26)}, marzec, ${bl(26)},</div>
     <div class="fillrow">maj, ${bl(26)}, lipiec, ${bl(26)},</div>
     <div class="fillrow">wrzesień, ${bl(26)}, listopad, ${bl(26)}</div>`)}
  ${task(2, 'Połącz.', 'Соедини.',
    match(['styczeń', 'kwiecień', 'lipiec', 'sierpień', 'październik', 'listopad'],
      ['ноябрь', 'июль', 'январь', 'октябрь', 'апрель', 'август']))}
  ${task(3, 'Jaka to pora roku?', 'Какое это время года?',
    `<div class="fillrow">grudzień, styczeń, luty → ${bl(30)}</div>
     <div class="fillrow">marzec, kwiecień, maj → ${bl(30)}</div>
     <div class="fillrow">czerwiec, lipiec, sierpień → ${bl(30)}</div>
     <div class="fillrow">wrzesień, październik, listopad → ${bl(30)}</div>`)}
  ${task(4, 'Jaka jest pogoda? Napisz.', 'Какая погода? Напиши.',
    `<div class="fill2">${['☀️', '🌧️', '🌨️', '💨'].map(e => `<div><span class="em">${e}</span> ${bl(40)}</div>`).join('')}</div>`)}
  ${task(5, 'Napisz o sobie.', 'Напиши о себе.',
    `<div class="fillrow">Teraz jest ${bl(30)}. <span class="ru">(время года)</span></div>
     <div class="fillrow">Dzisiaj ${bl(50)}. <span class="ru">(погода)</span></div>
     <div class="fillrow">Mam urodziny w ${bl(40)}.</div>`)}
  ${say('Mam urodziny w … . Dzisiaj pada deszcz / świeci słońce.', 'У меня день рождения в … . Сегодня идёт дождь / светит солнце.')}
  ${umiem([
    ['nazwać miesiące i pory roku', 'называть месяцы и времена года'],
    ['powiedzieć, jaka jest pogoda', 'сказать, какая погода'],
    ['powiedzieć, kiedy mam urodziny', 'сказать, когда у меня день рождения'],
  ])}
</section>`,
]

const L12 = [
`<section class="page">
  ${head(12, 'Ubrania', 'Одежда')}
  ${vocab([
    ['👕', 'koszulka', 'кошулька', 'футболка'],
    ['👔', 'koszula', 'кошуля', 'рубашка'],
    ['🧥', 'bluza', 'блюза', 'толстовка'],
    ['🧶', 'sweter', 'свэтэр', 'свитер'],
    ['👖', 'spodnie', 'сподне', 'брюки, штаны'],
    ['👖', 'dżinsy', 'джинсы', 'джинсы'],
    ['👗', 'sukienka', 'сукенка', 'платье'],
    ['🩱', 'spódnica', 'спудница', 'юбка'],
    ['🧥', 'kurtka', 'куртка', 'куртка'],
    ['🧢', 'czapka', 'чапка', 'шапка, кепка'],
    ['🧣', 'szalik', 'шалик', 'шарф'],
    ['🧤', 'rękawiczki', 'рэнкавички', 'перчатки'],
    ['👟', 'buty', 'буты', 'обувь, ботинки'],
    ['🧦', 'skarpetki', 'скарпэтки', 'носки'],
    ['🩴', 'kapcie', 'капче', 'тапочки, сменка'],
    ['👓', 'okulary', 'окуляры', 'очки'],
  ])}
  ${box(`<p class="ru"><b>В польской школе переобуваются!</b> Уличную обувь и куртку оставляешь в раздевалке - <b>szatnia</b> [шатня], а в школе ходишь в <b>kapcie</b> (сменке). Это называется <b>zmiana obuwia</b> [змяна обувя].</p>`)}
</section>`,
`<section class="page">
  ${sec('Przydatne zdania', 'Полезные фразы')}
  ${vocab([
    ['🙋', 'Mam na sobie …', 'мам на собе', 'На мне … (я одет в …)'],
    ['🧥', 'Zakładam kurtkę.', 'закўадам курткэ', 'Я надеваю куртку.'],
    ['🧢', 'Zdejmuję czapkę.', 'здэймуе чапкэ', 'Я снимаю шапку.'],
    ['❓', 'Gdzie jest moja kurtka?', 'гдже ест моя куртка', 'Где моя куртка?'],
    ['🚪', 'Mogę iść do szatni?', 'могэ ищч до шатни', 'Можно в раздевалку?'],
  ], 1)}
  ${box(`<p class="ru">Цвет меняется, как в русском: <b>красный</b> свитер, <b>красная</b> куртка, <b>красные</b> брюки.</p>
    <table class="conj">
      <tr><td><b>on</b> <span class="ru">он</span></td><td>czerwon<b>y</b> sweter</td><td>czarn<b>y</b> szalik</td></tr>
      <tr><td><b>ona</b> <span class="ru">она</span></td><td>czerwon<b>a</b> kurtka</td><td>czarn<b>a</b> czapka</td></tr>
      <tr><td><b>one</b> <span class="ru">они</span></td><td>czerwon<b>e</b> spodnie</td><td>czarn<b>e</b> buty</td></tr>
    </table>
    <p class="ru">После <b>zakładam</b>, <b>mam na sobie</b> слова на <b>-a</b> меняют <b>-a</b> на <b>-ę</b>: kurtka → kurtk<b>ę</b>, czapka → czapk<b>ę</b>.</p>`, 'Gramatyka')}
  ${task(1, 'Podpisz obrazki.', 'Подпиши картинки.',
    picGrid(['👕', '👖', '👗', '🧥', '🧢', '🧣', '🧤', '🧦']))}
</section>`,
`<section class="page">
  ${task(2, 'Wpisz końcówkę: -y, -a czy -e?', 'Впиши окончание: -y, -a или -e?',
    `<div class="gaps">czarn<span class="gap"></span> buty · biał<span class="gap"></span> koszulka · zielon<span class="gap"></span> sweter<br>
     szar<span class="gap"></span> spodnie · żółt<span class="gap"></span> czapka · brązow<span class="gap"></span> szalik</div>`)}
  ${task(3, 'Co zakładasz? Uzupełnij.', 'Что ты надеваешь? Дополни словами: czapkę, kurtkę, koszulkę, rękawiczki',
    `<div class="fillrow"><span class="em">🌨️</span> Kiedy pada śnieg, zakładam ${bl(25)} i ${bl(25)}.</div>
     <div class="fillrow"><span class="em">🌧️</span> Kiedy pada deszcz, zakładam ${bl(35)}.</div>
     <div class="fillrow"><span class="em">🥵</span> Kiedy jest gorąco, zakładam ${bl(35)}.</div>`)}
  ${task(4, 'Wykreśl słowo, które nie pasuje.', 'Вычеркни лишнее слово.',
    `<div class="odd">
      <div>a) czapka · szalik · banan · kurtka</div>
      <div>b) spodnie · sukienka · spódnica · stół</div>
      <div>c) buty · skarpetki · kapcie · okno</div>
    </div>`)}
  ${task(5, 'Co masz dzisiaj na sobie?', 'Что на тебе сегодня? Напиши.',
    `<div class="fillrow">Mam na sobie ${bl(70)}</div>${lines(1)}`)}
  ${say('Mam na sobie … . W szkole noszę kapcie.', 'На мне … . В школе я ношу сменку.')}
  ${umiem([
    ['nazwać ubrania', 'называть одежду'],
    ['powiedzieć: czerwony sweter, czerwona kurtka', 'согласовать цвет с одеждой'],
    ['wiem, co to szatnia i zmiana obuwia', 'знаю, что такое szatnia и сменка'],
  ])}
</section>`,
]

const L13 = [
`<section class="page">
  ${head(13, 'Zwierzęta', 'Животные')}
  ${vocab([
    ['🐴', 'koń', 'конь', 'лошадь (!)'],
    ['🐄', 'krowa', 'крова', 'корова'],
    ['🐖', 'świnia', 'щвиня', 'свинья'],
    ['🐔', 'kura', 'кура', 'курица'],
    ['🦆', 'kaczka', 'качка', 'утка'],
    ['🐑', 'owca', 'офца', 'овца'],
    ['🐇', 'królik', 'крулик', 'кролик'],
    ['🐹', 'chomik', 'хомик', 'хомяк'],
    ['🐭', 'mysz', 'мыш', 'мышь'],
    ['🐦', 'ptak', 'птак', 'птица'],
    ['🦁', 'lew', 'леф', 'лев'],
    ['🐘', 'słoń', 'сўонь', 'слон'],
    ['🐒', 'małpa', 'маўпа', 'обезьяна'],
    ['🦒', 'żyrafa', 'жырафа', 'жираф'],
    ['🐻', 'niedźwiedź', 'неджвьедж', 'медведь'],
    ['🐺', 'wilk', 'вильк', 'волк'],
    ['🦊', 'lis', 'лис', 'лиса'],
    ['🐢', 'żółw', 'жуўф', 'черепаха'],
  ])}
</section>`,
`<section class="page">
  ${sec('Jaki jest?', 'Какой он?')}
  ${vocab([
    ['', 'duży - mały', 'дужы - маўы', 'большой - маленький'],
    ['', 'szybki - wolny', 'шыпки - вольны', 'быстрый - медленный'],
    ['', 'wysoki - niski', 'высоки - ниски', 'высокий - низкий'],
    ['', 'gruby - chudy', 'грубы - худы', 'толстый - худой'],
    ['', 'ładny - brzydki', 'ўадны - бжыдки', 'красивый - некрасивый'],
    ['', 'stary - młody', 'стары - мўоды', 'старый - молодой'],
    ['', 'silny - słaby', 'щильны - сўабы', 'сильный - слабый'],
    ['', 'mądry - głupi', 'мондры - гўупи', 'умный - глупый'],
  ])}
  ${box(`<p><b>Jaki? Jaka? Jakie?</b> <span class="ru">= Какой? Какая? Какое / какие?</span></p>
    <table class="conj">
      <tr><td><b>Słoń</b> jest duż<b>y</b>.</td><td class="ru">Слон большой.</td></tr>
      <tr><td><b>Mysz</b> jest mał<b>a</b>.</td><td class="ru">Мышь маленькая.</td></tr>
      <tr><td><b>Żyrafa</b> jest wysok<b>a</b>.</td><td class="ru">Жираф высокий. (żyrafa - она!)</td></tr>
      <tr><td><b>Zwierzęta</b> są szybk<b>ie</b>.</td><td class="ru">Животные быстрые.</td></tr>
    </table>
    <p class="ru"><b>jest</b> = есть (он/она), <b>są</b> [сон] = они есть.</p>`, 'Gramatyka')}
  ${task(1, 'Podpisz obrazki.', 'Подпиши картинки.',
    picGrid(['🐄', '🐴', '🐖', '🐔', '🦁', '🐘', '🐒', '🦊']))}
</section>`,
`<section class="page">
  ${task(2, 'Połącz przeciwieństwa.', 'Соедини противоположности.',
    match(['duży', 'szybki', 'wysoki', 'stary', 'ładny', 'silny'], ['słaby', 'mały', 'brzydki', 'wolny', 'młody', 'niski']))}
  ${task(3, 'Uzupełnij.', 'Дополни словами: duży, mała, wolny, silny, wysoka',
    `<div class="fillrow"><span class="em">🐘</span> Słoń jest ${bl(30)}.</div>
     <div class="fillrow"><span class="em">🐭</span> Mysz jest ${bl(30)}.</div>
     <div class="fillrow"><span class="em">🐢</span> Żółw jest ${bl(30)}.</div>
     <div class="fillrow"><span class="em">🦁</span> Lew jest ${bl(30)}.</div>
     <div class="fillrow"><span class="em">🦒</span> Żyrafa jest ${bl(30)}.</div>`)}
  ${task(4, 'Zagadki. Jakie to zwierzę?', 'Загадки. Какое это животное?',
    `<div class="fillrow">a) Jest duży i szary. Ma długi nos. <span class="ru">(длинный нос)</span> To ${bl(25)}.</div>
     <div class="fillrow">b) Jest mała. Lubi ser. To ${bl(25)}.</div>
     <div class="fillrow">c) Jest rudy <span class="ru">(рыжий)</span> i sprytny <span class="ru">(хитрый)</span>. To ${bl(25)}.</div>
     <div class="fillrow">d) Robi „muuu”. Daje mleko. To ${bl(25)}.</div>`)}
</section>`,
`<section class="page">
  ${task(5, 'Moje ulubione zwierzę.', 'Моё любимое животное. Напиши и нарисуй.',
    `<div class="fillrow">Moje ulubione zwierzę to ${bl(45)}.</div>
     <div class="fillrow">Jest ${bl(30)} i ${bl(30)}.</div>
     <div class="frame" style="height:55mm"></div>`)}
  ${say('Moje ulubione zwierzę to … . Jest … i … .', 'Моё любимое животное - … . Оно … и … .')}
  ${umiem([
    ['nazwać zwierzęta', 'называть животных'],
    ['powiedzieć, jakie coś jest', 'сказать, какое что-то (большое, маленькое…)'],
    ['znam przeciwieństwa: duży - mały', 'знаю противоположности'],
  ])}
</section>`,
]

const mapka = `
<svg class="mapka" viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial" font-size="5.5">
  <rect x="54" y="30" width="12" height="52" fill="#ddd"/>
  <rect x="14" y="30" width="92" height="12" fill="#ddd"/>
  <rect x="54" y="8" width="12" height="24" fill="#ddd"/>
  <path d="M60 80 L60 44" stroke="#1f4e8c" stroke-width="0.8" stroke-dasharray="2 1.5"/>
  <g text-anchor="middle">
    <text x="60" y="90" font-weight="700">🏫 szkoła (START)</text>
    <text x="60" y="6" font-weight="700">🎬 kino</text>
    <text x="8" y="38" font-weight="700">💊</text><text x="8" y="47">apteka</text>
    <text x="113" y="38" font-weight="700">🌳</text><text x="113" y="47">park</text>
  </g>
</svg>`

const L14 = [
`<section class="page">
  ${head(14, 'Moje miasto', 'Мой город')}
  ${vocab([
    ['🏙️', 'miasto', 'място', 'город (!)'],
    ['🛣️', 'ulica', 'улица', 'улица'],
    ['💊', 'apteka', 'аптэка', 'аптека'],
    ['🏥', 'szpital / przychodnia', 'шпиталь / пшыходня', 'больница / поликлиника'],
    ['📮', 'poczta', 'почта', 'почта'],
    ['🌳', 'park', 'парк', 'парк'],
    ['🛝', 'plac zabaw', 'пляц забаф', 'детская площадка'],
    ['🎬', 'kino', 'кино', 'кинотеатр'],
    ['📚', 'biblioteka', 'библиотэка', 'библиотека'],
    ['⛪', 'kościół / cerkiew', 'кощчуў / цэркеф', 'костёл / церковь'],
    ['🚏', 'przystanek', 'пшыстанэк', 'остановка'],
    ['🚉', 'dworzec', 'двожэц', 'вокзал (!)'],
    ['🏊', 'basen', 'басэн', 'бассейн'],
    ['🏪', 'sklep', 'склеп', 'магазин'],
  ])}
  ${sec('Czym jedziesz?', 'На чём ты едешь?')}
  ${vocab([
    ['🚌', 'autobusem', 'аутобусэм', 'на автобусе'],
    ['🚋', 'tramwajem', 'трамваем', 'на трамвае'],
    ['🚗', 'samochodem', 'самоходэм', 'на машине'],
    ['🚲', 'rowerem', 'ровэрэм', 'на велосипеде'],
    ['🚆', 'pociągiem', 'почёнгем', 'на поезде'],
    ['🚶', 'pieszo', 'пешо', 'пешком'],
  ], 3)}
</section>`,
`<section class="page">
  ${sec('Gdzie to jest?', 'Где это?')}
  ${vocab([
    ['⬆️', 'prosto', 'просто', 'прямо'],
    ['➡️', 'w prawo', 'ф право', 'направо'],
    ['⬅️', 'w lewo', 'в лево', 'налево'],
    ['↔️', 'naprzeciwko', 'напшэчифко', 'напротив'],
    ['📏', 'blisko / daleko', 'блиско / далеко', 'близко / далеко'],
    ['🔄', 'potem', 'потэм', 'потом'],
  ])}
  ${vocab([
    ['❓', 'Przepraszam, gdzie jest apteka?', 'гдже ест аптэка', 'Извините, где аптека?'],
    ['🗺️', 'Jak dojść do parku?', 'як дойщч до парку', 'Как дойти до парка?'],
    ['⬆️', 'Idź prosto, potem w prawo.', 'идж просто, потэм ф право', 'Иди прямо, потом направо.'],
    ['🚌', 'Jak jedziesz do szkoły?', 'як едзеш до шкоўы', 'Как ты едешь в школу?'],
    ['🚶', 'Jadę autobusem. / Idę pieszo.', 'ядэ аутобусэм / идэ пешо', 'Еду на автобусе. / Иду пешком.'],
  ], 1)}
  ${task(1, 'Napisz.', 'Напиши.',
    `<div class="fill2"><div><span class="em">⬆️</span> ${bl(35)}</div><div><span class="em">➡️</span> ${bl(35)}</div><div><span class="em">⬅️</span> ${bl(35)}</div></div>`)}
</section>`,
`<section class="page">
  ${task(2, 'Gdzie idziesz? Połącz.', 'Куда ты идёшь? Соедини.',
    match(['Kupuję leki. <span class="ru">(лекарства)</span>', 'Oglądam film.', 'Pożyczam książkę.', 'Czekam na autobus.', 'Pływam.', 'Kupuję chleb.'],
      ['basen', 'sklep', 'apteka', 'przystanek', 'kino', 'biblioteka']))}
  ${task(3, 'Popatrz na mapę i uzupełnij.', 'Посмотри на карту и дополни. Ты стоишь у школы.',
    `<div class="mapwrap">${mapka}
     <div>
      <div class="fillrow">a) Idź prosto, potem w lewo. Tam jest ${bl(22)}.</div>
      <div class="fillrow">b) Idź prosto, potem w prawo. Tam jest ${bl(22)}.</div>
      <div class="fillrow">c) Idź prosto, prosto, prosto. Tam jest ${bl(22)}.</div>
     </div></div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Jak jedziesz do szkoły? Otocz kółkiem i napisz.', 'Как ты добираешься в школу? Обведи и напиши.',
    `<div class="pool big">🚌 autobusem · 🚋 tramwajem · 🚗 samochodem · 🚲 rowerem · 🚶 pieszo</div>
     <div class="fillrow">Do szkoły jadę ${bl(35)} / idę pieszo.</div>`)}
  ${task(5, 'Co jest w twoim mieście?', 'Что есть в твоём городе? Напиши.',
    `<div class="fillrow">W moim mieście jest ${bl(30)}, ${bl(28)}</div>
     <div class="fillrow">i ${bl(40)}.</div>`)}
  ${say('Przepraszam, gdzie jest apteka? Do szkoły jadę autobusem.', 'Извините, где аптека? В школу я еду на автобусе.')}
  ${umiem([
    ['nazwać miejsca w mieście', 'называть места в городе'],
    ['zapytać o drogę: prosto, w prawo, w lewo', 'спросить дорогу'],
    ['powiedzieć, jak jadę do szkoły', 'сказать, как я еду в школу'],
  ])}
</section>`,
]

const L15 = [
`<section class="page">
  ${head(15, 'Czas wolny', 'Свободное время')}
  ${vocab([
    ['⚽', 'grać w piłkę', 'грач ф пиўкэ', 'играть в мяч, в футбол'],
    ['💻', 'grać na komputerze', 'грач на компутэжэ', 'играть на компьютере'],
    ['🎸', 'grać na gitarze', 'грач на гитажэ', 'играть на гитаре'],
    ['📚', 'czytać', 'чытач', 'читать'],
    ['🎨', 'rysować', 'рысовач', 'рисовать'],
    ['🏊', 'pływać', 'пўывач', 'плавать'],
    ['🚲', 'jeździć na rowerze', 'еждзич на ровэжэ', 'кататься на велосипеде'],
    ['🛴', 'jeździć na hulajnodze', 'еждзич на хулайнодзэ', 'кататься на самокате'],
    ['💃', 'tańczyć', 'таньчыч', 'танцевать'],
    ['🎤', 'śpiewać', 'щпевач', 'петь'],
    ['🎧', 'słuchać muzyki', 'сўухач музыки', 'слушать музыку'],
    ['🎬', 'oglądać filmy', 'оглёндач фильмы', 'смотреть фильмы'],
    ['🍳', 'gotować', 'готовач', 'готовить'],
    ['🧑‍🤝‍🧑', 'spotykać się z kolegami', 'спотыкач щэ з колегами', 'встречаться с друзьями'],
  ])}
  ${box(`<p class="ru">Неопределённая форма (инфинитив) в польском кончается на <b>-ć</b>, как в русском на <b>-ть</b>: czyta<b>ć</b> = чита<b>ть</b>.</p>
    <p><b>Lubię czytać.</b> <span class="ru">Я люблю читать.</span> · <b>Umiem pływać.</b> <span class="ru">Я умею плавать.</span><br>
    <b>Nie umiem tańczyć.</b> <span class="ru">Я не умею танцевать.</span> · <b>Co lubisz robić?</b> <span class="ru">Что ты любишь делать?</span></p>
    <p><b>często</b> [чэнсто] <span class="ru">часто</span> · <b>czasem</b> [часэм] <span class="ru">иногда</span> · <b>nigdy nie</b> [нигды не] <span class="ru">никогда не</span></p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Połącz.', 'Соедини.',
    match(['czytać', 'pływać', 'rysować', 'śpiewać', 'tańczyć', 'gotować'], ['петь', 'готовить', 'читать', 'танцевать', 'плавать', 'рисовать']))}
  ${task(2, 'Podpisz obrazki.', 'Подпиши картинки.',
    `<div class="pics three">${['⚽', '🎨', '🏊', '🚲', '🎧', '🎤'].map(e => `<div><span class="em big">${e}</span><span class="bl" style="width:36mm"></span></div>`).join('')}</div>`)}
  ${task(3, 'Co umiesz? Zaznacz ✓ albo ✗.', 'Что ты умеешь? Отметь ✓ или ✗.',
    `<table class="sort umiem-tab">
      <tr><th></th><th>Umiem ✓</th><th>Nie umiem ✗</th></tr>
      ${['pływać', 'jeździć na rowerze', 'grać na gitarze', 'tańczyć', 'gotować'].map(w => `<tr><td>${w}</td><td></td><td></td></tr>`).join('')}
    </table>`)}
</section>`,
`<section class="page">
  ${task(4, 'Napisz: ja …', 'Напиши форму «я». Глаголы на -ać: -ać → -am',
    `<p class="small">czyt<b>ać</b> → ja czyt<b>am</b> <span class="ru">(читать → я читаю)</span></p>
     <div class="fill2">
      <div>pływać → ja ${bl(26)}</div><div>słuchać → ja ${bl(26)}</div>
      <div>oglądać → ja ${bl(26)}</div><div>grać → ja ${bl(26)}</div>
     </div>`)}
  ${task(5, 'Mój weekend. Uzupełnij.', 'Мои выходные. Дополни.',
    `<div class="fillrow">W weekend lubię ${bl(55)}.</div>
     <div class="fillrow">Często ${bl(68)}.</div>
     <div class="fillrow">Umiem ${bl(68)}.</div>
     <div class="fillrow">Nie umiem ${bl(62)}.</div>`)}
  ${say('W weekend lubię … . Umiem … .', 'В выходные я люблю … . Я умею … .')}
  ${umiem([
    ['powiedzieć, co lubię robić', 'сказать, что я люблю делать'],
    ['powiedzieć, co umiem, a czego nie umiem', 'сказать, что я умею и не умею'],
    ['użyć często, czasem, nigdy nie', 'использовать часто, иногда, никогда не'],
  ])}
</section>`,
]

const L16 = [
`<section class="page">
  ${head(16, 'Kto? Co? Jaki? Co robi?', 'Части речи - слова с урока польского')}
  <p class="ru">На уроках польского ты слышишь слова <b>rzeczownik, czasownik, przymiotnik</b>. Это части речи - как в русском!</p>
  <table class="pm">
    <tr><th>po polsku</th><th class="ru">по-русски</th><th>pytania <span class="ru">(вопросы)</span></th><th>przykłady</th></tr>
    <tr><td><b>rzeczownik</b><br><i>[жэчовник]</i></td><td class="ru">существительное</td><td><b>kto? co?</b><br><span class="ru">кто? что?</span></td><td>mama, pies, szkoła, zeszyt</td></tr>
    <tr><td><b>czasownik</b><br><i>[часовник]</i></td><td class="ru">глагол</td><td><b>co robi?</b><br><span class="ru">что делает?</span></td><td>czyta, biega, je, śpi</td></tr>
    <tr><td><b>przymiotnik</b><br><i>[пшымётник]</i></td><td class="ru">прилагательное</td><td><b>jaki? jaka? jakie?</b><br><span class="ru">какой? какая? какое?</span></td><td>duży, wesoła, zielone</td></tr>
    <tr><td><b>liczebnik</b><br><i>[личэбник]</i></td><td class="ru">числительное</td><td><b>ile? który?</b><br><span class="ru">сколько? который?</span></td><td>dwa, pięć, pierwszy</td></tr>
  </table>
  ${box(`<p><b>Mały</b> <span class="ru">(jaki?)</span> <b>kot</b> <span class="ru">(kto?)</span> <b>pije</b> <span class="ru">(co robi?)</span> mleko.</p>
    <p class="ru">przymiotnik + rzeczownik + czasownik = Маленький кот пьёт молоко.</p>`)}
  ${sec('Słowa z lekcji polskiego', 'Слова с урока польского')}
  ${vocab([
    ['✏️', 'zdanie', 'здане', 'предложение'],
    ['🔤', 'wyraz / słowo', 'выраз / сўово', 'слово'],
    ['🅰️', 'litera / głoska', 'литэра / гўоска', 'буква / звук'],
    ['📜', 'wiersz', 'вершш', 'стихотворение'],
    ['📝', 'notatka', 'нотатка', 'конспект, запись'],
    ['⏱️', 'kartkówka', 'карткуфка', 'короткая проверочная'],
    ['📋', 'sprawdzian', 'справдзян', 'контрольная работа'],
    ['📖', 'lektura', 'лектура', 'книга для чтения по программе'],
  ])}
</section>`,
`<section class="page">
  ${task(1, 'Wpisz słowa do tabeli.', 'Впиши слова в таблицу.',
    `<div class="pool">kot · biega · duży · szkoła · czyta · wesoła · książka · śpi · zielony</div>
     <table class="sort sort3"><tr><th>rzeczownik<br><span class="ru">kto? co?</span></th><th>czasownik<br><span class="ru">co robi?</span></th><th>przymiotnik<br><span class="ru">jaki? jaka?</span></th></tr>
     <tr><td></td><td></td><td></td></tr></table>`)}
  ${task(2, 'Podkreśl czasowniki.', 'Подчеркни глаголы (co robi?).',
    `<div class="odd big">
      <div>Ola czyta książkę.</div><div>Pies biega w parku.</div>
      <div>Mama gotuje zupę.</div><div>Tata śpi.</div>
    </div>`)}
  ${task(3, 'Połącz słowo z pytaniem.', 'Соедини слово с вопросом.',
    match(['mama', 'zeszyt', 'pisze', 'zielony', 'mała'], ['jaki?', 'co robi?', 'kto?', 'jaka?', 'co?']))}
</section>`,
`<section class="page">
  ${task(4, 'Dopisz przymiotnik.', 'Допиши прилагательное (jaki? jaka?). Слова: duży, mała, czarny, wesoła',
    `<div class="fill2">
      <div>${bl(26)} pies</div><div>${bl(26)} szkoła</div>
      <div>${bl(26)} kot</div><div>${bl(26)} mama</div>
     </div>`)}
  ${task(5, 'Połącz.', 'Соедини.',
    match(['kartkówka', 'sprawdzian', 'zdanie', 'wyraz', 'notatka', 'wiersz'],
      ['стихотворение', 'предложение', 'короткая проверочная', 'конспект', 'контрольная работа', 'слово']))}
  ${say('Mama to rzeczownik. Czyta to czasownik. Duży to przymiotnik.', 'Скажи учителю, какая это часть речи.')}
  ${umiem([
    ['rozpoznać rzeczownik, czasownik, przymiotnik', 'узнать существительное, глагол, прилагательное'],
    ['zadać pytania: kto? co? co robi? jaki?', 'задать вопросы'],
    ['wiem, co to kartkówka i sprawdzian', 'знаю, что такое kartkówka и sprawdzian'],
  ])}
</section>`,
]

const powtorka3 = [
`<section class="page">
  ${head('✓', 'Powtórka 3', 'Повторение 3 - темы 11-16')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>
  ${task(1, 'Przetłumacz na polski.', 'Переведи на польский. (8 п.)',
    `<div class="fill2">${['октябрь', 'зима', 'идёт дождь', 'куртка', 'лошадь', 'большой', 'аптека', 'читать']
      .map(w => `<div><span class="ru">${w}</span> ${bl(30)}</div>`).join('')}</div>`)}
  ${task(2, 'Wpisz końcówkę: -y, -a, -e.', 'Впиши окончание. (3 п.)',
    `<div class="gaps">czarn<span class="gap"></span> kot · biał<span class="gap"></span> czapka · zielon<span class="gap"></span> spodnie</div>`)}
  ${task(3, 'Odpowiedz.', 'Ответь. (4 п.)',
    `<div class="fillrow">Kiedy masz urodziny? ${bl(55)}</div>
     <div class="fillrow">Jaka jest dzisiaj pogoda? ${bl(48)}</div>
     <div class="fillrow">Co lubisz robić? ${bl(60)}</div>
     <div class="fillrow">Jak jedziesz do szkoły? ${bl(50)}</div>`)}
</section>`,
`<section class="page cont">
  ${task(4, 'Rzeczownik, czasownik czy przymiotnik?', 'Существительное, глагол или прилагательное? (3 п.)',
    `<div class="fillrow">pies → ${bl(40)}</div>
     <div class="fillrow">pisze → ${bl(40)}</div>
     <div class="fillrow">wesoły → ${bl(40)}</div>`)}
  ${task(5, 'Napisz przeciwieństwo.', 'Напиши противоположность. (2 п.)',
    `<div class="fillrow">duży ↔ ${bl(35)} &nbsp;&nbsp; szybki ↔ ${bl(35)}</div>`)}
</section>`,
]

const klucz3 = `
<section class="page key dense">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 11</h4>
  <p>1: luty, kwiecień, czerwiec, sierpień, październik, grudzień<br>
  2: styczeń - январь, kwiecień - апрель, lipiec - июль, sierpień - август, październik - октябрь, listopad - ноябрь<br>
  3: zima, wiosna, lato, jesień<br>
  4: Świeci słońce. · Pada deszcz. · Pada śnieg. · Wieje wiatr.</p>
  <h4>Temat 12</h4>
  <p>1: koszulka, spodnie, sukienka, kurtka, czapka, szalik, rękawiczki, skarpetki<br>
  2: czarne buty, biała koszulka, zielony sweter, szare spodnie, żółta czapka, brązowy szalik<br>
  3: czapkę i rękawiczki · kurtkę · koszulkę<br>
  4: a) banan, b) stół, c) okno</p>
  <h4>Temat 13</h4>
  <p>1: krowa, koń, świnia, kura, lew, słoń, małpa, lis<br>
  2: duży - mały, szybki - wolny, wysoki - niski, stary - młody, ładny - brzydki, silny - słaby<br>
  3: duży, mała, wolny, silny, wysoka<br>
  4: a) słoń, b) mysz, c) lis, d) krowa</p>
  <h4>Temat 14</h4>
  <p>1: prosto, w prawo, w lewo<br>
  2: leki - apteka, film - kino, książka - biblioteka, autobus - przystanek, pływam - basen, chleb - sklep<br>
  3: a) apteka, b) park, c) kino</p>
  <h4>Temat 15</h4>
  <p>1: czytać - читать, pływać - плавать, rysować - рисовать, śpiewać - петь, tańczyć - танцевать, gotować - готовить<br>
  2: grać w piłkę, rysować, pływać, jeździć na rowerze, słuchać muzyki, śpiewać<br>
  4: pływam, słucham, oglądam, gram</p>
  <h4>Temat 16</h4>
  <p>1: rzeczownik: kot, szkoła, książka · czasownik: biega, czyta, śpi · przymiotnik: duży, wesoła, zielony<br>
  2: czyta, biega, gotuje, śpi<br>
  3: mama - kto?, zeszyt - co?, pisze - co robi?, zielony - jaki?, mała - jaka?<br>
  4: np. duży pies, mała szkoła, czarny kot, wesoła mama<br>
  5: kartkówka - короткая проверочная, sprawdzian - контрольная работа, zdanie - предложение, wyraz - слово, notatka - конспект, wiersz - стихотворение</p>
</section>`

const tematy3 = ['11. Miesiące, pory roku i pogoda', '12. Ubrania', '13. Zwierzęta', '14. Moje miasto', '15. Czas wolny', '16. Kto? Co? Jaki? Co robi?', 'Powtórka 3']

const dyplom3 = dyplom
  .replace('ukończył(a) zeszyt<br>', 'ukończył(a) część 3 zeszytu<br>')
  .replace('окончил(а) тетрадь «Мой польский с нуля»', 'окончил(а) часть 3 тетради «Мой польский с нуля»')

export function czesc3() {
  return [
    okladka(3, 'Tematy 11-16 · Темы 11-16'), stronaStartu(tematy3), stronaPolecen('Przypomnij sobie polecenia', 'Вспомни задания'),
    ...[L11, L12, L13, L14, L15, L16].flatMap(ciag), ...powtorka3, dyplom3, klucz3,
  ]
}
