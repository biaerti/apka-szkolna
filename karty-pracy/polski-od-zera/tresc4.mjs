// Zeszyt "Mój polski od zera" - część 4 (tematy 17-22). Ten sam układ co części 1-3.
import { head, vocab, task, match, bl, lines, box, say, umiem, sec, picGrid, frame } from './klocki.mjs'
import { okladka, stronaStartu, stronaPolecen, dyplom, ciag } from './tresc.mjs'

// Tarcza zegara; bez godziny = puste wskazówki do dorysowania.
const zegar = (h = null, m = 0) => {
  const kreski = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180
    const r1 = i % 3 ? 26 : 23
    return `<line x1="${30 + r1 * Math.sin(a)}" y1="${30 - r1 * Math.cos(a)}" x2="${30 + 28 * Math.sin(a)}" y2="${30 - 28 * Math.cos(a)}" stroke="#222" stroke-width="${i % 3 ? 0.8 : 1.6}"/>`
  }).join('')
  const cyfry = [[12, 30, 13], [3, 49.5, 32.5], [6, 30, 51.5], [9, 10.5, 32.5]]
    .map(([n, x, y]) => `<text x="${x}" y="${y}" font-size="7" text-anchor="middle" font-family="Segoe UI, Arial">${n}</text>`).join('')
  let wskazowki = ''
  if (h !== null) {
    const ah = (((h % 12) + m / 60) * 30 * Math.PI) / 180
    const am = (m * 6 * Math.PI) / 180
    wskazowki = `<line x1="30" y1="30" x2="${30 + 13 * Math.sin(ah)}" y2="${30 - 13 * Math.cos(ah)}" stroke="#222" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="30" y1="30" x2="${30 + 17 * Math.sin(am)}" y2="${30 - 17 * Math.cos(am)}" stroke="#1f4e8c" stroke-width="1.6" stroke-linecap="round"/>`
  }
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="28.5" fill="#fff" stroke="#222" stroke-width="1.4"/>${kreski}${cyfry}${wskazowki}<circle cx="30" cy="30" r="1.6" fill="#222"/></svg>`
}

const L17 = [
`<section class="page">
  ${head(17, 'Która godzina?', 'Который час?')}
  <div class="nums">${[
    [1, 'pierwsza', 'перфша'], [2, 'druga', 'друга'], [3, 'trzecia', 'тшэча'], [4, 'czwarta', 'чфарта'],
    [5, 'piąta', 'пёнта'], [6, 'szósta', 'шуста'], [7, 'siódma', 'щудма'], [8, 'ósma', 'усма'],
    [9, 'dziewiąta', 'джевёнта'], [10, 'dziesiąta', 'джещёнта'], [11, 'jedenasta', 'едэнаста'], [12, 'dwunasta', 'двунаста'],
  ].map(([n, p, t]) => `<div><span class="nn godz">${n}:00</span><b>${p}</b><i>[${t}]</i></div>`).join('')}</div>
  ${vocab([
    ['❓', 'Która jest godzina?', 'ктура ест годжина', 'Который час?'],
    ['🕗', 'Jest ósma.', 'ест усма', 'Восемь часов.'],
    ['❓', 'O której?', 'о ктурэй', 'Во сколько?'],
    ['🏫', 'Lekcje zaczynam o ósmej.', 'лекцье зачынам о усмэй', 'Уроки начинаются в восемь.'],
    ['🕣', 'wpół do dziewiątej', 'фпуў до джевёнтэй', 'половина девятого (8:30)'],
    ['⏱️', 'minuta / godzina', 'минута / годжина', 'минута / час'],
  ], 1)}
  ${box(`<p class="ru"><b>O której?</b> - готовые формы: o pierwszej · o drugiej · o trzeciej · o czwartej · o piątej · o szóstej · o siódmej · o ósmej · o dziewiątej · o dziesiątej · o jedenastej · o dwunastej</p>
    <p class="ru"><b>wpół do dziewiątej</b> = 8:30 - как в русском «половина <b>девятого</b>»: называем следующий час!</p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Która godzina? Napisz.', 'Который час? Напиши.',
    `<div class="zegary">${[[3, 0], [7, 0], [12, 0], [9, 0]].map(([h, m]) => `<div>${zegar(h, m)}<span>Jest ${bl(20)}</span></div>`).join('')}</div>`)}
  ${task(2, 'Połącz.', 'Соедини.',
    match(['8:00', '8:30', '2:00', '5:00', '10:00', '1:30'],
      ['wpół do drugiej', 'piąta', 'ósma', 'dziesiąta', 'wpół do dziewiątej', 'druga']))}
  ${task(3, 'O której? Uzupełnij.', 'Во сколько? Дополни (o siódmej, o ósmej…).',
    `<div class="fillrow">⏰ Wstaję o ${bl(30)}. <span class="ru">(7:00)</span></div>
     <div class="fillrow">🏫 Lekcje zaczynam o ${bl(30)}. <span class="ru">(8:00)</span></div>
     <div class="fillrow">🍲 Jem obiad o ${bl(30)}. <span class="ru">(2:00)</span></div>
     <div class="fillrow">😴 Idę spać o ${bl(30)}. <span class="ru">(9:00)</span></div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Narysuj wskazówki.', 'Нарисуй стрелки на часах.',
    `<div class="zegary two"><div>${zegar()}<b>czwarta</b></div><div>${zegar()}<b>wpół do siódmej</b></div></div>`)}
  ${task(5, 'Mój dzień. Uzupełnij.', 'Мой день. Дополни.',
    `<div class="fillrow">Wstaję o ${bl(40)}.</div>
     <div class="fillrow">Idę do szkoły o ${bl(40)}.</div>
     <div class="fillrow">Wracam do domu o ${bl(36)}.</div>`)}
  ${say('Wstaję o siódmej. Lekcje zaczynam o ósmej.', 'Я встаю в семь. Уроки начинаю в восемь.')}
  ${umiem([
    ['powiedzieć, która jest godzina', 'сказать, который час'],
    ['powiedzieć, o której coś robię', 'сказать, во сколько я что-то делаю'],
    ['rozumiem „wpół do”', 'понимаю «wpół do» (половина)'],
  ])}
</section>`,
]

const L18 = [
`<section class="page">
  ${head(18, 'Wczoraj', 'Вчера - прошедшее время')}
  ${box(`<p class="ru">Как в русском: <b>я был / я была</b> → <b>ja byłem / ja byłam</b>. Мальчик говорит <b>-łem</b>, девочка <b>-łam</b>.</p>
    <table class="conj">
      <tr><td><b>ja byłem / byłam</b></td><td class="ru">я был / была</td></tr>
      <tr><td><b>ty byłeś / byłaś</b></td><td class="ru">ты был / была</td></tr>
      <tr><td><b>on był · ona była</b></td><td class="ru">он был · она была</td></tr>
    </table>
    <p class="ru">Глаголы на <b>-ać</b> - очень просто: czyt<b>ać</b> → czyt<b>ałem</b> (читать → читал).</p>`, 'Gramatyka')}
  ${vocab([
    ['🎮', 'grać → grałem', 'граўэм', 'я играл'],
    ['📚', 'czytać → czytałem', 'чытаўэм', 'я читал'],
    ['📺', 'oglądać → oglądałem', 'оглёндаўэм', 'я смотрел'],
    ['🔧', 'robić → robiłem', 'робиўэм', 'я делал'],
    ['😴', 'spać → spałem', 'спаўэм', 'я спал'],
    ['🍲', 'jeść → jadłem (!)', 'ядўэм', 'я ел'],
    ['🥤', 'pić → piłem', 'пиўэм', 'я пил'],
    ['🚶', 'iść → poszedłem (!)', 'пошэдўэм', 'я пошёл (девочка: poszłam)'],
    ['✍️', 'pisać → pisałem', 'писаўэм', 'я писал'],
    ['🎒', 'mieć → miałem', 'мяўэм', 'у меня был(о)'],
  ])}
  ${vocab([
    ['❓', 'Co robiłeś wczoraj?', 'цо робиўэщ фчорай', 'Что ты делал вчера?'],
    ['🌳', 'Wczoraj byłem w parku.', 'фчорай быўэм ф парку', 'Вчера я был в парке.'],
  ], 1)}
</section>`,
`<section class="page">
  ${task(1, 'Połącz.', 'Соедини.',
    match(['byłem', 'grałem', 'jadłem', 'spałem', 'poszedłem', 'piłem'], ['я спал', 'я пил', 'я был', 'я пошёл', 'я играл', 'я ел']))}
  ${task(2, 'Napisz: ja … (wczoraj).', 'Напиши в прошедшем времени (мальчик: -łem).',
    `<div class="fill2">
      <div>czytać → czytałem</div><div>grać → ${bl(26)}</div>
      <div>oglądać → ${bl(26)}</div><div>pisać → ${bl(26)}</div>
      <div>słuchać → ${bl(26)}</div><div>być → ${bl(26)}</div>
    </div>`)}
  ${task(3, 'Teraz czy wczoraj? Otocz kółkiem.', 'Сейчас или вчера? Обведи правильное слово.',
    `<div class="odd big">
      <div>Wczoraj (gram / grałem) w piłkę.</div>
      <div>Teraz (czytam / czytałem) książkę.</div>
      <div>Wczoraj (jestem / byłem) w kinie.</div>
      <div>Dzisiaj (jem / jadłem) zupę.</div>
    </div>`)}
  ${task(4, 'Co robiłeś wczoraj? Napisz 3 zdania.', 'Что ты делал вчера? Напиши 3 предложения.',
    `<p class="small">Wczoraj byłem … · Grałem … · Oglądałem … · Jadłem …</p>${lines(3)}`)}
  ${say('Wczoraj byłem w szkole. Potem grałem w piłkę.', 'Вчера я был в школе. Потом играл в мяч.')}
  ${umiem([
    ['powiedzieć, co robiłem wczoraj', 'сказать, что я делал вчера'],
    ['zrobić czas przeszły: czytać → czytałem', 'образовать прошедшее время'],
    ['znam byłem, jadłem, poszedłem', 'знаю byłem, jadłem, poszedłem'],
  ])}
</section>`,
]

const L19 = [
`<section class="page">
  ${head(19, 'Jutro', 'Завтра - будущее время')}
  ${box(`<p class="ru">Будущее время - как русское «буду» + инфинитив: <b>Jutro będę grać.</b> = Завтра я буду играть.</p>
    <table class="conj">
      <tr><td><b>ja będę</b></td><td class="ru">я буду</td><td><b>my będziemy</b></td><td class="ru">мы будем</td></tr>
      <tr><td><b>ty będziesz</b></td><td class="ru">ты будешь</td><td><b>wy będziecie</b></td><td class="ru">вы будете</td></tr>
      <tr><td><b>on / ona będzie</b></td><td class="ru">он / она будет</td><td><b>oni będą</b></td><td class="ru">они будут</td></tr>
    </table>`, 'Gramatyka')}
  ${vocab([
    ['➡️', 'jutro / pojutrze', 'ютро / поютшэ', 'завтра / послезавтра'],
    ['📅', 'w sobotę / w weekend', 'ф соботэ / в уикенд', 'в субботу / в выходные'],
    ['🗓️', 'w przyszłym tygodniu', 'ф пшышўым тыгодню', 'на следующей неделе'],
    ['🏖️', 'w wakacje', 'ф вакацье', 'на каникулах'],
    ['❓', 'Co będziesz robić jutro?', 'цо бэнджеш робич ютро', 'Что ты будешь делать завтра?'],
    ['🏫', 'Jutro będę w szkole.', 'ютро бэндэ ф школе', 'Завтра я буду в школе.'],
  ], 1)}
  ${sec('Kim chcesz zostać?', 'Кем ты хочешь стать?')}
  ${vocab([
    ['🩺', 'lekarz → lekarzem', 'лекаж', 'врач'],
    ['🚒', 'strażak → strażakiem', 'стражак', 'пожарный'],
    ['🚌', 'kierowca → kierowcą', 'керофца', 'водитель'],
    ['👨‍🍳', 'kucharz → kucharzem', 'кухаж', 'повар'],
    ['⚽', 'piłkarz → piłkarzem', 'пиўкаж', 'футболист'],
    ['👮', 'policjant → policjantem', 'полицьянт', 'полицейский'],
    ['💻', 'programista → programistą', 'программиста', 'программист'],
    ['🐾', 'weterynarz → weterynarzem', 'вэтэрынаж', 'ветеринар'],
  ])}
  <p class="small"><b>Chcę zostać lekarzem.</b> <span class="ru">Я хочу стать врачом.</span> <span class="ru">(после zostać - форма со стрелкой →)</span></p>
</section>`,
`<section class="page">
  ${task(1, 'Wpisz: wczoraj, dzisiaj czy jutro?', 'Впиши: вчера, сегодня или завтра?',
    `<div class="fillrow">${bl(26)} byłem w parku.</div>
     <div class="fillrow">${bl(26)} będę grać w piłkę.</div>
     <div class="fillrow">${bl(26)} jest środa i mam polski.</div>
     <div class="fillrow">${bl(26)} oglądałem film.</div>`)}
  ${task(2, 'Uzupełnij: będę, będziesz czy będzie?', 'Дополни: będę, będziesz или będzie?',
    `<div class="fillrow">Jutro ja ${bl(26)} w szkole.</div>
     <div class="fillrow">Ty ${bl(26)} grać z nami?</div>
     <div class="fillrow">Mama ${bl(26)} gotować obiad.</div>`)}
  ${task(3, 'Połącz.', 'Соедини.',
    match(['lekarz', 'strażak', 'kierowca', 'kucharz', 'piłkarz', 'policjant'],
      ['повар', 'полицейский', 'врач', 'футболист', 'пожарный', 'водитель']))}
  ${task(4, 'Mój plan.', 'Мой план. Дополни.',
    `<div class="fillrow">W sobotę będę ${bl(55)}.</div>
     <div class="fillrow">W niedzielę będę ${bl(52)}.</div>
     <div class="fillrow">Chcę zostać ${bl(55)}.</div>`)}
  ${say('W weekend będę … . Chcę zostać … .', 'В выходные я буду … . Я хочу стать … .')}
  ${umiem([
    ['powiedzieć, co będę robić', 'сказать, что я буду делать'],
    ['odmienić będę, będziesz, będzie', 'знаю będę, będziesz, będzie'],
    ['powiedzieć, kim chcę zostać', 'сказать, кем я хочу стать'],
  ])}
</section>`,
]

const L20 = [
`<section class="page">
  ${head(20, 'Zakupy i pieniądze', 'Покупки и деньги')}
  <div class="nums">${[
    [20, 'dwadzieścia', 'дваджещча'], [30, 'trzydzieści', 'тшыджещчи'], [40, 'czterdzieści', 'чтэрджещчи'],
    [50, 'pięćdziesiąt', 'пеньчджещёнт'], [60, 'sześćdziesiąt', 'шэщджещёнт'], [70, 'siedemdziesiąt', 'щедэмджещёнт'],
    [80, 'osiemdziesiąt', 'ощемджещёнт'], [90, 'dziewięćdziesiąt', 'джевеньчджещёнт'], [100, 'sto', 'сто'],
  ].map(([n, p, t]) => `<div><span class="nn">${n}</span><b>${p}</b><i>[${t}]</i></div>`).join('')}</div>
  <p class="small"><b>21</b> = dwadzieścia jeden · <b>35</b> = trzydzieści pięć · <b>99</b> = dziewięćdziesiąt dziewięć <span class="ru">- как в русском!</span></p>
  ${box(`<p class="ru"><b>złoty (zł)</b> - польские деньги, <b>1 zł = 100 groszy (gr)</b>. Форма меняется, как «рубль - рубля - рублей»:</p>
    <p><b>1 złoty</b> · <b>2, 3, 4 złote</b> · <b>5, 6, 10, 20 złotych</b> · <b>22, 23, 24 złote</b></p>`)}
  ${vocab([
    ['💰', 'Ile to kosztuje?', 'иле то коштуе', 'Сколько это стоит?'],
    ['🏷️', 'To kosztuje 5 złotych.', 'то коштуе пеньч зўотых', 'Это стоит 5 злотых.'],
    ['💳', 'Czy mogę zapłacić kartą?', 'чы могэ запўачич картон', 'Можно заплатить картой?'],
    ['💵', 'gotówka / reszta', 'готуфка / рэшта', 'наличные / сдача'],
    ['🧾', 'paragon / kasa', 'парагон / каса', 'чек / касса'],
    ['😱', 'drogo / tanio', 'дрого / таньо', 'дорого / дёшево'],
    ['🥖', 'piekarnia', 'пекарня', 'булочная'],
    ['🛒', 'sklep spożywczy', 'склеп спожывчы', 'продуктовый магазин'],
  ], 1)}
</section>`,
`<section class="page">
  ${task(1, 'Napisz słowami.', 'Напиши словами.',
    `<div class="fill2">${[30, 45, 60, 99].map(n => `<div><b>${n}</b> = ${bl(40)}</div>`).join('')}</div>`)}
  ${task(2, 'Wpisz: złoty, złote czy złotych?', 'Впиши: złoty, złote или złotych?',
    `<div class="fill2">${[1, 3, 5, 10, 22, 100].map(n => `<div><b>${n}</b> ${bl(26)}</div>`).join('')}</div>`)}
  ${task(3, 'Policz.', 'Посчитай. razem = вместе',
    `<div class="fillrow">🍞 chleb 4 zł + 🥛 mleko 3 zł = razem ${bl(32)}</div>
     <div class="fillrow">🍌 banan 2 zł + 🧃 sok 5 zł + 🍪 ciastko 3 zł = razem ${bl(24)}</div>`)}
  ${task(4, 'W sklepie. Uzupełnij.', 'В магазине. Дополни: Poproszę, Ile, kartą, Dziękuję',
    `<div class="dialog">
      <div><b>Ty:</b> Dzień dobry! ${bl(26)} chleb i mleko.</div>
      <div><b>Pani:</b> Proszę. Coś jeszcze? <span class="ru">(Что-нибудь ещё?)</span></div>
      <div><b>Ty:</b> Nie, dziękuję. ${bl(18)} to kosztuje?</div>
      <div><b>Pani:</b> Siedem złotych.</div>
      <div><b>Ty:</b> Czy mogę zapłacić ${bl(22)}?</div>
      <div><b>Pani:</b> Tak, oczywiście. <span class="ru">(Да, конечно.)</span></div>
      <div><b>Ty:</b> ${bl(26)}! Do widzenia.</div>
    </div>`)}
  ${say('Poproszę chleb. Ile to kosztuje?', 'Дайте, пожалуйста, хлеб. Сколько это стоит?')}
  ${umiem([
    ['liczyć do 100', 'считать до 100'],
    ['powiedzieć cenę: 1 złoty, 3 złote, 5 złotych', 'назвать цену'],
    ['zrobić zakupy w sklepie', 'сделать покупки в магазине'],
  ])}
</section>`,
]

const L21 = [
`<section class="page">
  ${head(21, 'Opisuję osobę', 'Описываю человека')}
  ${sec('Wygląd', 'Внешность')}
  ${vocab([
    ['📏', 'wysoki / niski', 'высоки / ниски', 'высокий / низкий'],
    ['💇', 'krótkie / długie włosy', 'круткэ / дўугэ вўосы', 'короткие / длинные волосы'],
    ['🎨', 'ciemne / jasne / rude włosy', 'чемнэ / яснэ / рудэ', 'тёмные / светлые / рыжие волосы'],
    ['〰️', 'kręcone / proste włosy', 'крэнцонэ / простэ', 'кудрявые / прямые волосы'],
    ['👁️', 'niebieskie / brązowe oczy', 'небескэ / бронзовэ очы', 'голубые / карие глаза'],
    ['👓', 'nosi okulary', 'ноши окуляры', 'носит очки'],
  ], 1)}
  ${sec('Charakter', 'Характер')}
  ${vocab([
    ['😊', 'miły', 'миўы', 'приятный, добрый'],
    ['😄', 'wesoły / zabawny', 'вэсоўы / забавны', 'весёлый / смешной'],
    ['🦁', 'odważny', 'одважны', 'смелый'],
    ['🙈', 'nieśmiały', 'нещмяўы', 'застенчивый'],
    ['💪', 'pracowity', 'працовиты', 'трудолюбивый'],
    ['🛋️', 'leniwy', 'ленивы', 'ленивый'],
    ['🤝', 'pomocny / koleżeński', 'помоцны / колежэньски', 'готов помочь / дружелюбный'],
    ['🧠', 'mądry', 'мондры', 'умный'],
  ])}
  ${box(`<p class="ru"><b>Ma krótkie włosy.</b> = У него короткие волосы. По-польски не «у него есть», а <b>on ma / ona ma</b> (он имеет).</p>`)}
</section>`,
`<section class="page">
  ${box(`<p class="ru">В школе пишут <b>opis postaci</b> - описание человека. План:</p>
    <ol class="ru rules"><li><b>Kto to jest?</b> - кто это</li><li><b>Wygląd</b> - внешность</li><li><b>Charakter</b> - характер</li><li><b>Co w nim lubię?</b> - что мне в нём нравится</li></ol>`, 'Opis postaci')}
  ${task(1, 'Połącz przeciwieństwa.', 'Соедини противоположности.',
    match(['krótkie', 'ciemne', 'pracowity', 'wysoki', 'wesoły'], ['niski', 'smutny', 'długie', 'leniwy', 'jasne']))}
  ${task(2, 'Wygląd czy charakter? Wpisz do tabeli.', 'Внешность или характер? Впиши в таблицу.',
    `<div class="pool">wysoki · miły · długie włosy · odważny · niebieskie oczy · leniwy · nosi okulary · zabawny</div>
     <table class="sort"><tr><th>wygląd <span class="ru">внешность</span></th><th>charakter <span class="ru">характер</span></th></tr><tr><td></td><td></td></tr></table>`)}
</section>`,
`<section class="page">
  ${task(3, 'Przeczytaj i narysuj.', 'Прочитай и нарисуй.',
    `<p class="big-read">To jest Tomek. Jest wysoki. Ma krótkie, jasne włosy i niebieskie oczy. Nosi okulary. Tomek jest wesoły i pomocny.</p>
     <div class="frame" style="height:48mm"></div>`)}
  ${task(4, 'Opisz kolegę albo koleżankę z klasy.', 'Опиши одноклассника или одноклассницу.',
    `<div class="fillrow">To jest ${bl(40)}.</div>
     <div class="fillrow">Jest ${bl(30)}. Ma ${bl(28)} włosy</div>
     <div class="fillrow">i ${bl(28)} oczy. Jest ${bl(26)} i ${bl(24)}.</div>`)}
  ${say('To jest … . Jest wysoki. Ma krótkie włosy. Jest miły.', 'Опиши устно одноклассника.')}
  ${umiem([
    ['opisać wygląd', 'описать внешность'],
    ['opisać charakter', 'описать характер'],
    ['wiem, co to opis postaci', 'знаю, что такое opis postaci'],
  ])}
</section>`,
]

const L22 = [
`<section class="page">
  ${head(22, 'Uczucia', 'Чувства')}
  <p class="ru">В 5 классе сейчас тема <b>«Uwaga, uczucia»</b>. <b>uczucie</b> [учуче] = чувство.</p>
  ${vocab([
    ['😊', 'radość → szczęśliwy', 'радощч → шчэнщливы', 'радость → счастливый'],
    ['😢', 'smutek → smutny', 'смутэк → смутны', 'грусть → грустный'],
    ['😠', 'złość → zły', 'зўощч → зўы', 'злость → злой'],
    ['😨', 'strach → przestraszony', 'страх → пшэстрашоны', 'страх → испуганный'],
    ['😳', 'wstyd → zawstydzony', 'фстыт → зафстыдзоны', 'стыд → смущённый'],
    ['😲', 'zdziwienie → zdziwiony', 'здживене → здживёны', 'удивление → удивлённый'],
    ['😌', 'spokój → spokojny', 'спокуй → спокойны', 'спокойствие → спокойный'],
    ['🥱', 'nuda → znudzony', 'нуда → знудзоны', 'скука → скучающий'],
    ['😎', 'duma → dumny', 'дума → думны', 'гордость (!) → гордый'],
    ['😒', 'zazdrość', 'заздрощч', 'зависть, ревность'],
  ], 1)}
  ${sec('Przydatne zdania', 'Полезные фразы')}
  ${vocab([
    ['❓', 'Jak się czujesz?', 'як щэ чуеш', 'Как ты себя чувствуешь?'],
    ['🙂', 'Czuję się dobrze / źle.', 'чуе щэ добжэ / жьле', 'Я чувствую себя хорошо / плохо.'],
    ['😃', 'Cieszę się.', 'чешэ щэ', 'Я рад.'],
    ['😰', 'Boję się …', 'боё щэ', 'Я боюсь …'],
    ['🏠', 'Tęsknię za domem.', 'тэнскне за домэм', 'Я скучаю по дому.'],
  ], 1)}
  <p class="ru small"><b>Осторожно!</b> <b>duma</b> = гордость, а дума = <b>myśl</b>.</p>
</section>`,
`<section class="page">
  ${task(1, 'Podpisz uczucia.', 'Подпиши чувства.',
    `<div class="pics three">${['😊', '😢', '😠', '😨', '😲', '🥱'].map(e => `<div><span class="em big">${e}</span><span class="bl" style="width:36mm"></span></div>`).join('')}</div>`)}
  ${task(2, 'Połącz.', 'Соедини чувство и слово «какой я».',
    match(['smutek', 'złość', 'strach', 'duma', 'nuda', 'spokój'], ['dumny', 'spokojny', 'smutny', 'znudzony', 'zły', 'przestraszony']))}
  ${task(3, 'Jak się czujesz, kiedy…? Uzupełnij.', 'Как ты себя чувствуешь, когда…? Слова: szczęśliwy, dumny, znudzony, boję się',
    `<div class="fillrow">Kiedy mam urodziny, jestem ${bl(30)}.</div>
     <div class="fillrow">Kiedy dostaję szóstkę <span class="ru">(получаю 6)</span>, jestem ${bl(26)}.</div>
     <div class="fillrow">Kiedy nic nie robię, jestem ${bl(30)}.</div>
     <div class="fillrow">Kiedy w nocy jest burza, ${bl(32)}.</div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Napisz o sobie.', 'Напиши о себе.',
    `<div class="fillrow">Dzisiaj czuję się ${bl(50)}.</div>
     <div class="fillrow">Cieszę się, kiedy ${bl(52)}.</div>
     <div class="fillrow">Boję się ${bl(62)}.</div>`)}
  ${say('Dzisiaj czuję się … . Cieszę się, kiedy … .', 'Сегодня я чувствую себя … . Я рад, когда … .')}
  ${umiem([
    ['nazwać uczucia', 'называть чувства'],
    ['powiedzieć, jak się czuję', 'сказать, как я себя чувствую'],
    ['powiedzieć, czego się boję i z czego się cieszę', 'сказать, чего боюсь и чему радуюсь'],
  ])}
</section>`,
]

const powtorka4 = [
`<section class="page">
  ${head('✓', 'Powtórka 4', 'Повторение 4 - темы 17-22')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>
  ${task(1, 'Przetłumacz na polski.', 'Переведи на польский. (8 п.)',
    `<div class="fill2">${['Который час?', 'я был', 'завтра', 'сто', 'Сколько стоит?', 'длинные волосы', 'грусть', 'я боюсь']
      .map(w => `<div><span class="ru">${w}</span> ${bl(28)}</div>`).join('')}</div>`)}
  ${task(2, 'Która godzina?', 'Который час? (2 п.)',
    `<div class="zegary two">${[[8, 0], [3, 0]].map(([h, m]) => `<div>${zegar(h, m)}<span>Jest ${bl(22)}</span></div>`).join('')}</div>`)}
</section>`,
`<section class="page cont">
  ${task(3, 'Napisz: ja … (wczoraj).', 'Прошедшее время. (3 п.)',
    `<div class="fill2"><div>czytać → ${bl(26)}</div><div>grać → ${bl(26)}</div><div>być → ${bl(26)}</div></div>`)}
  ${task(4, 'Uzupełnij: będę, będziesz, będzie.', 'Дополни. (3 п.)',
    `<div class="fillrow">Jutro ja ${bl(22)} grać. Ty ${bl(22)} w szkole?</div>
     <div class="fillrow">Ona ${bl(22)} czytać.</div>`)}
  ${task(5, 'Opisz kolegę: 2 zdania.', 'Опиши одноклассника: 2 предложения. (4 п.)', lines(2))}
</section>`,
]

const klucz4 = `
<section class="page key dense">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 17</h4>
  <p>1: trzecia, siódma, dwunasta, dziewiąta<br>
  2: 8:00 - ósma, 8:30 - wpół do dziewiątej, 2:00 - druga, 5:00 - piąta, 10:00 - dziesiąta, 1:30 - wpół do drugiej<br>
  3: o siódmej, o ósmej, o drugiej, o dziewiątej<br>
  4: czwarta - маленькая стрелка на 4, большая на 12; wpół do siódmej - маленькая между 6 и 7, большая на 6</p>
  <h4>Temat 18</h4>
  <p>1: byłem - я был, grałem - я играл, jadłem - я ел, spałem - я спал, poszedłem - я пошёл, piłem - я пил<br>
  2: grałem, oglądałem, pisałem, słuchałem, byłem<br>
  3: grałem, czytam, byłem, jem</p>
  <h4>Temat 19</h4>
  <p>1: Wczoraj, Jutro, Dzisiaj, Wczoraj<br>
  2: będę, będziesz, będzie<br>
  3: lekarz - врач, strażak - пожарный, kierowca - водитель, kucharz - повар, piłkarz - футболист, policjant - полицейский</p>
  <h4>Temat 20</h4>
  <p>1: trzydzieści, czterdzieści pięć, sześćdziesiąt, dziewięćdziesiąt dziewięć<br>
  2: 1 złoty, 3 złote, 5 złotych, 10 złotych, 22 złote, 100 złotych<br>
  3: siedem złotych (7 zł), dziesięć złotych (10 zł)<br>
  4: Poproszę · Ile · kartą · Dziękuję</p>
  <h4>Temat 21</h4>
  <p>1: krótkie - długie, ciemne - jasne, pracowity - leniwy, wysoki - niski, wesoły - smutny<br>
  2: wygląd: wysoki, długie włosy, niebieskie oczy, nosi okulary · charakter: miły, odważny, leniwy, zabawny</p>
  <h4>Temat 22</h4>
  <p>1: radość, smutek, złość, strach, zdziwienie, nuda<br>
  2: smutek - smutny, złość - zły, strach - przestraszony, duma - dumny, nuda - znudzony, spokój - spokojny<br>
  3: szczęśliwy, dumny, znudzony, boję się</p>
</section>`

const tematy4 = ['17. Która godzina?', '18. Wczoraj', '19. Jutro', '20. Zakupy i pieniądze', '21. Opisuję osobę', '22. Uczucia', 'Powtórka 4']

const dyplom4 = dyplom
  .replace('ukończył(a) zeszyt<br>', 'ukończył(a) część 4 zeszytu<br>')
  .replace('окончил(а) тетрадь «Мой польский с нуля»', 'окончил(а) часть 4 тетради «Мой польский с нуля»')

export function czesc4() {
  return [
    okladka(4, 'Tematy 17-22 · Темы 17-22'), stronaStartu(tematy4), stronaPolecen('Przypomnij sobie polecenia', 'Вспомни задания'),
    ...[L17, L18, L19, L20, L21, L22].flatMap(ciag), ...powtorka4, dyplom4, klucz4,
  ]
}
