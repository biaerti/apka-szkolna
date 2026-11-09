// Zeszyt "Mój polski od zera" - część 6 (tematy 29-34), pod klasę 4: przypadki, rodzina wyrazów
// (rozdziały II-III), legendy o Lechu i o Warsie i Sawie, symbole Polski i 11 listopada, ch i h (rozdział IV).
// Teksty legend to własne, proste opowiedzenia (nie z podręcznika).
import { head, vocab, task, match, bl, lines, box, say, umiem, sec, choice } from './klocki.mjs'
import { okladka, stronaStartu, stronaPolecen, dyplom, ciag } from './tresc.mjs'

const L29 = [
`<section class="page">
  ${head(29, 'Przypadki: kto? kogo? komu?', 'Падежи')}
  <p class="ru">Хорошая новость: в русском тоже есть падежи, и вопросы почти те же! В польском их <b>7</b> - седьмой <b>wołacz</b> (звательный), как в украинском: <b>мамо!</b></p>
  <table class="pm">
    <tr><th>przypadek <span class="ru">(падеж)</span></th><th>pytanie</th><th>mama</th><th>kot</th></tr>
    <tr><td><b>mianownik</b><br><span class="ru">именительный</span></td><td>kto? co?</td><td>mama</td><td>kot</td></tr>
    <tr><td><b>dopełniacz</b><br><span class="ru">родительный</span></td><td>kogo? czego?</td><td>mam<b>y</b></td><td>kot<b>a</b></td></tr>
    <tr><td><b>celownik</b><br><span class="ru">дательный</span></td><td>komu? czemu?</td><td>mam<b>ie</b></td><td>kot<b>u</b></td></tr>
    <tr><td><b>biernik</b><br><span class="ru">винительный</span></td><td>kogo? co?</td><td>mam<b>ę</b></td><td>kot<b>a</b></td></tr>
    <tr><td><b>narzędnik</b><br><span class="ru">творительный</span></td><td>z kim? z czym?</td><td>(z) mam<b>ą</b></td><td>(z) kot<b>em</b></td></tr>
    <tr><td><b>miejscownik</b><br><span class="ru">предложный</span></td><td>o kim? o czym?</td><td>o mam<b>ie</b></td><td>o koc<b>ie</b></td></tr>
    <tr><td><b>wołacz</b><br><span class="ru">звательный</span></td><td>o!</td><td>mam<b>o</b>!</td><td>koc<b>ie</b>!</td></tr>
  </table>
  ${box(`<p><b>Nie mam kota.</b> <span class="ru">У меня нет кота. (kogo? czego?)</span></p>
    <p><b>Daję prezent mamie.</b> <span class="ru">Я дарю подарок маме. (komu?)</span></p>
    <p><b>Idę do kina z bratem.</b> <span class="ru">Я иду в кино с братом. (z kim?)</span></p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Połącz pytania.', 'Соедини польские и русские вопросы.',
    match(['kto? co?', 'kogo? czego?', 'komu? czemu?', 'z kim? z czym?', 'o kim? o czym?'],
      ['о ком? о чём?', 'кому? чему?', 'кто? что?', 'с кем? с чем?', 'кого? чего?']))}
  ${task(2, 'Zaznacz dobrą formę.', 'Отметь правильную форму.',
    choice([
      ['Nie mam ____.', 'У меня нет кота.', ['kot', 'kota']],
      ['Daję prezent ____.', 'Я дарю подарок маме.', ['mamie', 'mama']],
      ['Idę do kina z ____.', 'Я иду в кино с братом.', ['brat', 'bratem']],
      ['Kocham ____.', 'Я люблю маму.', ['mamę', 'mamą']],
      ['Mówię o ____.', 'Я говорю о школе.', ['szkoła', 'szkole']],
    ]))}
</section>`,
`<section class="page">
  ${task(3, 'Odmień: brat. Pomoże ci kot.', 'Просклоняй слово brat (брат). Смотри на kot в таблице.',
    `<table class="pm fillt">
      <tr><td>kto? co?</td><td>brat</td></tr>
      <tr><td>kogo? czego?</td><td>${bl(30)}</td></tr>
      <tr><td>komu? czemu?</td><td>${bl(30)}</td></tr>
      <tr><td>z kim? z czym?</td><td>z ${bl(26)}</td></tr>
      <tr><td>o kim? o czym?</td><td>o bracie</td></tr>
    </table>`)}
  ${say('Idę do szkoły z bratem. Nie mam kota.', 'Я иду в школу с братом. У меня нет кота.')}
  ${umiem([
    ['wiem, że w polskim jest 7 przypadków', 'знаю, что в польском 7 падежей'],
    ['znam pytania: kogo? komu? z kim?', 'знаю вопросы падежей'],
    ['powiedzieć: nie mam kota, z bratem', 'сказать: нет кота, с братом'],
  ])}
</section>`,
]

const L30 = [
`<section class="page">
  ${head(30, 'Rodzina wyrazów', 'Однокоренные слова')}
  <p class="ru"><b>wyrazy pokrewne</b> - однокоренные слова. У них общая часть - <b>rdzeń</b> (корень). Как в русском: лес - лесной - лесник.</p>
  ${box(`<p class="big-read"><b>las</b> → <b>las</b>ek · <b>leś</b>ny · <b>leś</b>niczy</p>
    <p class="ru">лес → лесок · лесной · лесник. Это одна «семья» слов!</p>`, 'Rodzina wyrazu las')}
  ${vocab([
    ['🏫', 'szkoła → szkolny, przedszkole', 'шкоўа, школьны, пшэтшколе', 'школа → школьный, детский сад'],
    ['🏠', 'dom → domek, domowy', 'домэк, домовы', 'дом → домик, домашний'],
    ['🐟', 'ryba → rybka, rybak', 'рыбка, рыбак', 'рыба → рыбка, рыбак'],
    ['🌷', 'kwiat → kwiatek, kwiaciarnia', 'квятэк, квячарня', 'цветок → цветочек, цветочный магазин'],
  ], 1)}
  ${box(`<p class="ru">Зачем это нужно? Родственное слово помогает писать правильно: <b>stół</b> через <b>ó</b>, потому что <b>stolik</b>, <b>stoły</b>.</p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Skreśl wyraz, który nie pasuje.', 'Зачеркни лишнее слово (оно не из этой семьи).',
    `<div class="odd big">
      <div>las · lasek · leśny · lato</div>
      <div>dom · domek · dym · domowy</div>
      <div>ryba · rower · rybak · rybka</div>
      <div>kot · kotek · koc · kotka</div>
    </div>
    <p class="ru small">lato - лето · dym - дым · rower - велосипед · koc - одеяло</p>`)}
  ${task(2, 'Wpisz wyrazy do rodzin.', 'Впиши слова в нужную семью.',
    `<div class="pool">szkolny · domek · rybak · przedszkole · domowy · rybka</div>
     <table class="sort sort3"><tr><th>szkoła</th><th>dom</th><th>ryba</th></tr><tr><td></td><td></td><td></td></tr></table>`)}
</section>`,
`<section class="page">
  ${task(3, 'Mały, mała … Uzupełnij.', 'Маленький … Дополни.',
    `<div class="fillrow">Mały kot to ${bl(30)}.</div>
     <div class="fillrow">Mały dom to ${bl(30)}.</div>
     <div class="fillrow">Mała ryba to ${bl(30)}.</div>
     <div class="fillrow">Mały las to ${bl(30)}.</div>`)}
  ${task(4, 'Podkreśl wspólną część.', 'Подчеркни общую часть (корень).',
    `<div class="odd big"><div>ryba · rybak · rybka · rybny</div><div>kwiat · kwiatek · kwiatowy</div></div>`)}
  ${say('Las, lasek, leśny - to jedna rodzina.', 'Лес, лесок, лесной - это одна семья слов.')}
  ${umiem([
    ['wiem, co to są wyrazy pokrewne', 'знаю, что такое однокоренные слова'],
    ['znaleźć wyraz, który nie pasuje', 'найти лишнее слово'],
    ['powiedzieć: mały kot to kotek', 'сказать: маленький кот - котик'],
  ])}
</section>`,
]

const L31 = [
`<section class="page">
  ${head(31, 'Legenda o Lechu, Czechu i Rusie', 'Легенда о Лехе, Чехе и Русе')}
  ${vocab([
    ['📜', 'legenda', 'легенда', 'легенда'],
    ['👬', 'brat / bracia', 'брат / брачя', 'брат / братья'],
    ['🦅', 'orzeł', 'ожэў', 'орёл'],
    ['🪺', 'gniazdo', 'гнязд(о)', 'гнездо'],
    ['🌳', 'drzewo', 'джэво', 'дерево'],
    ['🌅', 'niebo', 'небо', 'небо'],
  ])}
  <p class="big-read">Dawno temu żyli trzej bracia: Lech, Czech i Rus. Razem ze swoimi ludźmi szukali nowego domu. Czech poszedł na zachód, Rus na wschód, a Lech na północ. Pewnego wieczoru Lech zobaczył wielkie drzewo. Na drzewie było gniazdo, a w gnieździe siedział biały orzeł. Niebo było czerwone, bo zachodziło słońce. Lech powiedział: „Tu zostaniemy!”. Tak powstał gród Gniezno - od słowa <b>gniazdo</b>. A biały orzeł na czerwonym tle jest dziś w godle Polski.</p>
  <p class="ru small">dawno temu - давным-давно · na zachód / na wschód / na północ - на запад / на восток / на север · zachodziło słońce - садилось солнце · gród - древний город · godło - герб</p>
</section>`,
`<section class="page">
  ${task(1, 'Prawda czy fałsz?', 'Правда или неправда? Отметь.',
    choice([
      ['Bracia mieli na imię Lech, Czech i Rus.', 'Братьев звали Лех, Чех и Рус.', ['prawda', 'fałsz']],
      ['Lech poszedł na wschód.', 'Лех пошёл на восток.', ['prawda', 'fałsz']],
      ['W gnieździe siedział czarny orzeł.', 'В гнезде сидел чёрный орёл.', ['prawda', 'fałsz']],
      ['Niebo było czerwone.', 'Небо было красное.', ['prawda', 'fałsz']],
      ['Gniezno to nazwa od słowa gniazdo.', 'Гнезно - от слова «гнездо».', ['prawda', 'fałsz']],
    ]))}
  ${task(2, 'Ułóż w kolejności: 1, 2, 3 …', 'Расставь по порядку: 1, 2, 3 …',
    `<div class="order">${['Lech zobaczył drzewo z gniazdem.', 'Bracia szukali nowego domu.', 'Powstało miasto Gniezno.', 'Bracia poszli w różne strony.', 'Lech powiedział: „Tu zostaniemy!”']
      .map(s => `<div><span class="gap"></span> ${s}</div>`).join('')}</div>`)}
</section>`,
`<section class="page">
  ${task(3, 'Odpowiedz.', 'Ответь полным предложением.',
    `<div class="fillrow">Jaki był orzeł? Orzeł był ${bl(40)}.</div>
     <div class="fillrow">Jakie było niebo? Niebo było ${bl(36)}.</div>
     <div class="fillrow">Gdzie było gniazdo? Na ${bl(46)}.</div>`)}
  ${say('Lech zobaczył białego orła w gnieździe.', 'Лех увидел белого орла в гнезде.')}
  ${umiem([
    ['przeczytać krótką legendę', 'прочитать короткую легенду'],
    ['powiedzieć, skąd jest biały orzeł', 'рассказать, откуда белый орёл'],
    ['ułożyć wydarzenia po kolei', 'расставить события по порядку'],
  ])}
</section>`,
]

const L32 = [
`<section class="page">
  ${head(32, 'Wars i Sawa. Warszawa', 'Варс и Сава. Варшава')}
  ${vocab([
    ['🏛️', 'stolica', 'столица', 'столица'],
    ['🌊', 'rzeka', 'жэка', 'река'],
    ['🎣', 'rybak', 'рыбак', 'рыбак'],
    ['🏡', 'wieś', 'вещ', 'деревня'],
    ['🏙️', 'miasto', 'място', 'город'],
    ['🧜', 'syrenka', 'сыренка', 'русалка'],
  ])}
  <p class="big-read">Dawno temu nad Wisłą mieszkał młody rybak Wars. Każdego dnia łowił ryby w rzece. Pewnego dnia zobaczył w wodzie piękną dziewczynę. Miała na imię Sawa. Wars i Sawa pokochali się i zbudowali nad rzeką mały dom. Potem przyszli inni ludzie i zbudowali więcej domów. Najpierw była wieś, a potem duże miasto. Ludzie nazwali je <b>Warszawa</b>: Wars + Sawa. Dziś Warszawa to stolica Polski. Jej symbol to syrenka z mieczem i tarczą.</p>
  <p class="ru small">łowił ryby - ловил рыбу · pokochali się - полюбили друг друга · zbudowali - построили · najpierw - сначала · miecz - меч · tarcza - щит</p>
</section>`,
`<section class="page">
  ${task(1, 'Odpowiedz.', 'Ответь на вопросы.',
    `<div class="fillrow">Kim był Wars? Wars był ${bl(40)}.</div>
     <div class="fillrow">Gdzie mieszkał? Nad ${bl(40)}.</div>
     <div class="fillrow">Jak miała na imię dziewczyna? ${bl(32)}</div>
     <div class="fillrow">Co zbudowali? ${bl(48)}</div>`)}
  ${task(2, 'Uzupełnij.', 'Дополни.',
    `<div class="fillrow big-read">Wars + ${bl(26)} = Warszawa</div>`)}
  ${task(3, 'Połącz.', 'Соедини.',
    match(['Warszawa', 'Kijów', 'Wisła', 'Dniepr', 'syrenka'],
      ['rzeka w Ukrainie', 'symbol Warszawy', 'stolica Polski', 'rzeka w Polsce', 'stolica Ukrainy']))}
</section>`,
`<section class="page">
  ${task(4, 'Napisz.', 'Напиши.',
    `<div class="fillrow">Stolica Polski to ${bl(40)}.</div>
     <div class="fillrow">Stolica Ukrainy to ${bl(40)}.</div>
     <div class="fillrow">Teraz mieszkam w ${bl(42)}.</div>`)}
  ${say('Warszawa to stolica Polski. Kijów to stolica Ukrainy.', 'Варшава - столица Польши. Киев - столица Украины.')}
  ${umiem([
    ['opowiedzieć, skąd jest nazwa Warszawa', 'рассказать, откуда название Варшава'],
    ['znam słowa: stolica, rzeka, wieś, miasto', 'знаю слова: столица, река, деревня, город'],
    ['wiem, że symbol Warszawy to syrenka', 'знаю, что символ Варшавы - русалка'],
  ])}
</section>`,
]

const flaga = (podpis) => `
<div style="text-align:center">
  <svg viewBox="0 0 80 52" style="width:32mm" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="78" height="50" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <line x1="1" y1="26" x2="79" y2="26" stroke="#222" stroke-width="1"/>
  </svg>
  <div><b>${podpis}</b></div>
</div>`

const L33 = [
`<section class="page">
  ${head(33, 'Polska - symbole i 11 listopada', 'Символы Польши и 11 ноября')}
  ${vocab([
    ['🏠', 'ojczyzna', 'ойчызна', 'родина'],
    ['🇵🇱', 'flaga biało-czerwona', 'фляга бяўо-чэрвона', 'бело-красный флаг'],
    ['🦅', 'godło - biały orzeł w koronie', 'годўо', 'герб - белый орёл в короне'],
    ['🎵', 'hymn - Mazurek Dąbrowskiego', 'хымн', 'гимн'],
    ['🎉', 'święto', 'щвенто', 'праздник'],
    ['🕊️', 'niepodległość', 'неподлеглощч', 'независимость'],
  ], 1)}
  ${box(`<p><b>11 listopada</b> - Narodowe Święto Niepodległości.</p>
    <p class="ru">В 1918 году Польша снова стала свободной страной. В школе бывает <b>akademia</b> (праздничный концерт), все поют гимн.</p>
    <p class="ru">Когда звучит гимн, <b>stoimy prosto</b> (стоим ровно) и не разговариваем.</p>`, 'Święto Niepodległości')}
</section>`,
`<section class="page">
  ${task(1, 'Pokoloruj flagi i uzupełnij.', 'Раскрась флаги и дополни.',
    `<div class="fill2">${flaga('Polska')}${flaga('Ukraina')}</div>
     <div class="fillrow">Flaga Polski jest biało-${bl(30)}.</div>
     <div class="fillrow">Flaga Ukrainy jest niebiesko-${bl(30)}.</div>`)}
  ${task(2, 'Połącz.', 'Соедини.',
    match(['flaga', 'godło', 'hymn', 'ojczyzna', 'święto', 'stolica'], ['праздник', 'гимн', 'столица', 'флаг', 'родина', 'герб']))}
</section>`,
`<section class="page">
  ${task(3, 'Zaznacz dobrą odpowiedź.', 'Отметь правильный ответ.',
    choice([
      ['Kiedy jest Święto Niepodległości?', 'Когда День независимости?', ['11 listopada', '1 września']],
      ['Co jest w godle Polski?', 'Что на гербе Польши?', ['biały orzeł', 'czarny kot']],
      ['Jak nazywa się hymn Polski?', 'Как называется гимн Польши?', ['Mazurek Dąbrowskiego', 'Sto lat']],
      ['Co robimy, gdy gra hymn?', 'Что мы делаем, когда звучит гимн?', ['stoimy prosto', 'jemy kanapki']],
    ]))}
  ${say('11 listopada jest Święto Niepodległości. Flaga Polski jest biało-czerwona.', 'Расскажи учителю о польском празднике.')}
  ${umiem([
    ['nazwać symbole Polski: flaga, godło, hymn', 'назвать символы Польши'],
    ['wiem, co jest 11 listopada', 'знаю, что празднуют 11 ноября'],
    ['wiem, jak się zachować, gdy gra hymn', 'знаю, как вести себя во время гимна'],
  ])}
</section>`,
]

const L34 = [
`<section class="page">
  ${head(34, 'Ch czy h?', 'Ch или h? Орфография')}
  <p class="ru"><b>ch</b> и <b>h</b> звучат одинаково - [х]. Вот правила:</p>
  ${box(`<p><b>1. ch</b> на конце слова: da<b>ch</b>, stra<b>ch</b>, ru<b>ch</b>, brzu<b>ch</b> <span class="ru">(крыша, страх, движение, живот)</span></p>
    <p><b>2. ch</b> после <b>s</b>: s<b>ch</b>ody, s<b>ch</b>ować <span class="ru">(лестница, спрятать)</span></p>
    <p><b>3. ch</b>, если в другом слове <b>sz</b>: mu<b>ch</b>a - mu<b>sz</b>e · u<b>ch</b>o - u<b>sz</b>y · su<b>ch</b>y - su<b>sz</b>yć</p>`, 'Kiedy ch?')}
  ${box(`<p class="ru">В словах, которые похожи на русские с <b>х</b>, почти всегда пишем <b>ch</b>: хлеб - <b>ch</b>leb, муха - mu<b>ch</b>a, ухо - u<b>ch</b>o, хор - <b>ch</b>ór, сухой - su<b>ch</b>y.</p>
    <p class="ru"><b>h</b> чаще в иностранных словах - их надо запомнить: <b>h</b>erbata (чай), <b>h</b>istoria, <b>h</b>otel, <b>h</b>umor, <b>h</b>ulajnoga (самокат), <b>h</b>okej (!).</p>`, 'Podpowiedź dla ciebie')}
</section>`,
`<section class="page">
  ${task(1, 'Wpisz ch albo h.', 'Впиши ch или h.',
    `<div class="gaps">da<span class="gap"></span> · mu<span class="gap"></span>a · <span class="gap"></span>erbata · <span class="gap"></span>leb · <span class="gap"></span>otel<br>
     u<span class="gap"></span>o · <span class="gap"></span>ulajnoga · s<span class="gap"></span>ody · stra<span class="gap"></span> · <span class="gap"></span>istoria</div>`)}
  ${task(2, 'Udowodnij: dlaczego ch?', 'Докажи: почему ch? Напиши слово с sz.',
    `<div class="fill2">
      <div>mucha, bo musze</div><div>ucho, bo ${bl(26)}</div>
      <div>suchy, bo ${bl(26)}</div><div>ruch, bo ${bl(26)}</div>
    </div>
    <p class="ru small">Подсказки: uszy, suszyć, ruszać</p>`)}
  ${task(3, 'Otocz kółkiem dobry zapis.', 'Обведи правильное написание.',
    `<div class="odd big">
      <div>chleb / hleb · herbata / cherbata · dach / dah</div>
      <div>hotel / chotel · schody / shody · ucho / uho</div>
    </div>`)}
  ${say('Dach piszę przez ch, bo ch jest na końcu.', 'Объясни учителю, почему dach пишется через ch.')}
  ${umiem([
    ['ch na końcu i po s: dach, schody', 'ch на конце и после s'],
    ['ch, gdy wymienia się na sz: mucha - musze', 'ch чередуется с sz'],
    ['pamiętam: herbata, hotel, hulajnoga', 'помню слова с h'],
  ])}
</section>`,
]

const powtorka6 = [
`<section class="page">
  ${head('✓', 'Powtórka 6', 'Повторение 6 - темы 29-34')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>
  ${task(1, 'Otocz dobrą formę.', 'Обведи правильную форму. (4 п.)',
    `<div class="odd big">
      <div>Nie mam (kot / kota). · Idę z (brat / bratem).</div>
      <div>Daję prezent (mamie / mama). · Mówię o (szkoła / szkole).</div>
    </div>`)}
  ${task(2, 'Skreśl wyraz, który nie pasuje.', 'Зачеркни лишнее. (2 п.)',
    `<div class="odd big"><div>las · lasek · leśny · lato &nbsp;&nbsp;|&nbsp;&nbsp; dom · domek · dym · domowy</div></div>`)}
  ${task(3, 'Prawda czy fałsz? Napisz P albo F.', 'Правда (P) или нет (F)? (3 п.)',
    `<div class="order">
      <div><span class="gap"></span> W godle Polski jest biały orzeł.</div>
      <div><span class="gap"></span> Warszawa to stolica Polski.</div>
      <div><span class="gap"></span> Lech zbudował Kijów.</div>
    </div>`)}
</section>`,
`<section class="page cont">
  ${task(4, 'Uzupełnij.', 'Дополни. (3 п.)',
    `<div class="fillrow">Wars + ${bl(24)} = Warszawa</div>
     <div class="fillrow">Flaga Polski jest biało-${bl(26)}.</div>
     <div class="fillrow">Święto Niepodległości jest ${bl(12)} listopada.</div>`)}
  ${task(5, 'Wpisz ch albo h.', '(4 п.)',
    `<div class="gaps">da<span class="gap"></span> · <span class="gap"></span>erbata · mu<span class="gap"></span>a · <span class="gap"></span>otel</div>`)}
  ${task(6, 'Co to znaczy? Napisz po rosyjsku.', 'Переведи на русский. (4 п.)',
    `<div class="fill2"><div>flaga → ${bl(24)}</div><div>hymn → ${bl(24)}</div><div>ojczyzna → ${bl(24)}</div><div>stolica → ${bl(24)}</div></div>`)}
</section>`,
]

const klucz6 = `
<section class="page key dense">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 29</h4>
  <p>1: kto? co? - кто? что?, kogo? czego? - кого? чего?, komu? czemu? - кому? чему?, z kim? z czym? - с кем? с чем?, o kim? o czym? - о ком? о чём?<br>
  2: kota, mamie, bratem, mamę, szkole<br>
  3: brata, bratu, z bratem</p>
  <h4>Temat 30</h4>
  <p>1: lato, dym, rower, koc<br>
  2: szkoła: szkolny, przedszkole · dom: domek, domowy · ryba: rybak, rybka<br>
  3: kotek, domek, rybka, lasek<br>
  4: <u>ryb</u>a, <u>ryb</u>ak, <u>ryb</u>ka, <u>ryb</u>ny · <u>kwiat</u>, <u>kwiat</u>ek, <u>kwiat</u>owy</p>
  <h4>Temat 31</h4>
  <p>1: prawda, fałsz, fałsz, prawda, prawda<br>
  2: 3, 1, 5, 2, 4<br>
  3: biały · czerwone · na drzewie</p>
  <h4>Temat 32</h4>
  <p>1: rybakiem · nad Wisłą (nad rzeką) · Sawa · dom<br>
  2: Sawa<br>
  3: Warszawa - stolica Polski, Kijów - stolica Ukrainy, Wisła - rzeka w Polsce, Dniepr - rzeka w Ukrainie, syrenka - symbol Warszawy</p>
  <h4>Temat 33</h4>
  <p>1: biało-czerwona · niebiesko-żółta<br>
  2: flaga - флаг, godło - герб, hymn - гимн, ojczyzna - родина, święto - праздник, stolica - столица<br>
  3: 11 listopada · biały orzeł · Mazurek Dąbrowskiego · stoimy prosto</p>
  <h4>Temat 34</h4>
  <p>1: dach, mucha, herbata, chleb, hotel, ucho, hulajnoga, schody, strach, historia<br>
  2: uszy, suszyć, ruszać<br>
  3: chleb, herbata, dach, hotel, schody, ucho</p>
</section>`

const tematy6 = ['29. Przypadki: kto? kogo? komu?', '30. Rodzina wyrazów', '31. Legenda o Lechu, Czechu i Rusie', '32. Wars i Sawa. Warszawa', '33. Polska - symbole i 11 listopada', '34. Ch czy h?', 'Powtórka 6']

const dyplom6 = dyplom
  .replace('ukończył(a) zeszyt<br>', 'ukończył(a) część 6 zeszytu<br>')
  .replace('окончил(а) тетрадь «Мой польский с нуля»', 'окончил(а) часть 6 тетради «Мой польский с нуля»')

export function czesc6() {
  return [
    okladka(6, 'Tematy 29-34 · klasa 4'), stronaStartu(tematy6), stronaPolecen('Przypomnij sobie polecenia', 'Вспомни задания'),
    ...[L29, L30, L31, L32, L33, L34].flatMap(ciag), ...powtorka6, dyplom6, klucz6,
  ]
}
