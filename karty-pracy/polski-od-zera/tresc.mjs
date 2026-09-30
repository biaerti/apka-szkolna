// Zeszyt "Mój polski od zera" - tresc. Kazdy element tablicy stron = jedna strona A5.
// Pomocnicze klocki sa w klocki.mjs, tu tylko tekst zadan.
import {
  head, vocab, task, match, bl, lines, box, say, umiem, sec, choice, frame, picGrid, cols,
} from './klocki.mjs'

// ---------- wspolne ----------

export const okladka = (nr, lekcje) => `
<section class="page cover">
  <div class="cover-letters">Ą Ć Ę Ł Ń Ó Ś Ź Ż</div>
  <div class="cover-main">
    <div class="cover-t">Mój polski<br>od zera</div>
    <div class="cover-r">Мой польский с нуля</div>
    <div class="cover-part">Część ${nr} · Часть ${nr}</div>
    <div class="cover-l">${lekcje}</div>
  </div>
  <div class="cover-fields">
    <div>Imię i nazwisko <span class="ru">/ Имя и фамилия</span></div>
    <div class="cover-line"></div>
    <div>Klasa <span class="ru">/ Класс</span></div>
    <div class="cover-line short"></div>
  </div>
</section>`

const postepy = (tematy) => `
<table class="prog">
  <tr><th>Temat <span class="ru">/ Тема</span></th><th>Zrobione ✓<br><span class="ru">Сделано</span></th><th>Podpis nauczyciela<br><span class="ru">Подпись учителя</span></th></tr>
  ${tematy.map(t => `<tr><td>${t}</td><td></td><td></td></tr>`).join('')}
</table>`

const polecenia = [
  ['Przeczytaj', 'Прочитай'], ['Przeczytaj na głos', 'Прочитай вслух'],
  ['Napisz', 'Напиши'], ['Przepisz', 'Перепиши'],
  ['Połącz', 'Соедини'], ['Podkreśl', 'Подчеркни'],
  ['Otocz kółkiem', 'Обведи в кружок'], ['Zaznacz', 'Отметь'],
  ['Uzupełnij', 'Дополни'], ['Wpisz', 'Впиши'],
  ['Podpisz', 'Подпиши'], ['Wykreśl', 'Вычеркни'],
  ['Narysuj', 'Нарисуй'], ['Pokoloruj', 'Раскрась'],
  ['Ułóż', 'Составь, расставь'], ['Policz', 'Посчитай'],
  ['Odpowiedz', 'Ответь'], ['Przetłumacz', 'Переведи'],
  ['Powiedz', 'Скажи'], ['Sprawdź', 'Проверь'],
]

const stronaPolecen = (tytul = 'Polecenia w zeszycie', ru = 'Задания в тетради') => `
<section class="page">
  ${head('!', tytul, ru)}
  <p class="ru">Эти слова будут в каждом задании. Выучи их - и ты поймёшь, что говорит учитель на уроке.</p>
  <div class="cmd">
    ${polecenia.map(([p, r]) => `<div><b>${p}</b><span class="ru">${r}</span></div>`).join('')}
  </div>
  ${box(`<b>Jak czytać ten zeszyt? <span class="ru">Как читать эту тетрадь?</span></b>
    <div class="v demo"><span class="em">📓</span><span class="w"><b>zeszyt</b> <i>[зэшыт]</i><br><span class="ru">тетрадь</span></span></div>
    <div class="ru small">польское слово - <i>[как оно читается]</i> - перевод</div>`)}
</section>`

// ---------- CZESC 1 ----------

const L1 = [
`<section class="page">
  ${head(1, 'Polskie litery', 'Польские буквы и звуки')}
  <p class="ru">Польский язык пишется латиницей. Хорошая новость: польский похож на русский и украинский, много слов ты уже знаешь! Сначала научимся читать буквы.</p>
  ${sec('Alfabet', 'Алфавит')}
  <div class="abc">
    ${[
      ['A a', 'а'], ['Ą ą', 'он'], ['B b', 'б'], ['C c', 'ц'],
      ['Ć ć', 'ч мягк.'], ['D d', 'д'], ['E e', 'э'], ['Ę ę', 'эн'],
      ['F f', 'ф'], ['G g', 'г'], ['H h', 'х'], ['I i', 'и'],
      ['J j', 'й'], ['K k', 'к'], ['L l', 'л'], ['Ł ł', 'ў'],
      ['M m', 'м'], ['N n', 'н'], ['Ń ń', 'нь'], ['O o', 'о'],
      ['Ó ó', 'у'], ['P p', 'п'], ['R r', 'р'], ['S s', 'с'],
      ['Ś ś', 'щ'], ['T t', 'т'], ['U u', 'у'], ['W w', 'в'],
      ['Y y', 'ы'], ['Z z', 'з'], ['Ź ź', 'жь'], ['Ż ż', 'ж'],
    ].map(([l, s]) => `<div><b>${l}</b><span>${s}</span></div>`).join('')}
  </div>
  <p class="ru small">Буквы Q, V, X бывают только в иностранных словах.<br>
  <b>ł</b> читается как короткое <b>у</b> (как английское w). В этой тетради мы пишем его так: <b>ў</b>.</p>
</section>`,
`<section class="page">
  ${sec('Trudne litery i połączenia', 'Трудные буквы и сочетания')}
  <table class="snd">
    <tr><td><b>ch</b>, <b>h</b></td><td>х</td><td>chleb, herbata</td></tr>
    <tr><td><b>cz</b></td><td>ч (твёрдое)</td><td>czekolada</td></tr>
    <tr><td><b>sz</b></td><td>ш</td><td>szkoła</td></tr>
    <tr><td><b>rz</b>, <b>ż</b></td><td>ж</td><td>rzeka, żaba</td></tr>
    <tr><td><b>dz</b> / <b>dż</b></td><td>дз / дж</td><td>dzwonek / dżem</td></tr>
    <tr><td><b>ć</b>, <b>ci</b></td><td>ч (мягкое)</td><td>pięć, ciocia</td></tr>
    <tr><td><b>ś</b>, <b>si</b></td><td>щ</td><td>śnieg, siostra</td></tr>
    <tr><td><b>ź</b>, <b>zi</b></td><td>жь</td><td>źle, zima</td></tr>
    <tr><td><b>dź</b>, <b>dzi</b></td><td>дж (мягкое)</td><td>dziadek</td></tr>
    <tr><td><b>ń</b>, <b>ni</b></td><td>нь</td><td>koń, nie</td></tr>
    <tr><td><b>ą</b></td><td>он (перед b, p - ом)</td><td>mąka, ząb</td></tr>
    <tr><td><b>ę</b></td><td>эн (в конце слова - э)</td><td>ręka, idę</td></tr>
    <tr><td><b>ó</b>, <b>u</b></td><td>у (одинаково!)</td><td>góra, mucha</td></tr>
    <tr><td><b>y</b></td><td>ы</td><td>ryba</td></tr>
  </table>
  ${box(`<b>3 важных правила</b>
    <ol class="ru rules">
      <li><b>o</b> всегда читается как <b>о</b>, никогда как «а»: <b>woda</b> = [вода], не «вада».</li>
      <li><b>e</b> всегда читается как <b>э</b>: <b>mleko</b> = [млэко].</li>
      <li>Ударение почти всегда на <b>предпоследний</b> слог: <b>MA</b>-ma, <b>SZKO</b>-ła, ko-<b>LE</b>-ga.</li>
    </ol>`)}
</section>`,
`<section class="page">
  ${task(1, 'Połącz polską literę z rosyjską.', 'Соедини польскую букву с русской.',
    match(['sz', 'cz', 'ż', 'ch', 'ł', 'y', 'ó', 'c'], ['ы', 'ц', 'ш', 'ў', 'ж', 'у', 'х', 'ч'], true))}
  ${task(2, 'Przeczytaj na głos.', 'Прочитай вслух. Видишь, как похоже на русский?',
    `<div class="words2">${[
      ['szkoła', 'школа'], ['czekolada', 'шоколад'], ['żaba', 'лягушка'], ['rzeka', 'река'],
      ['chleb', 'хлеб'], ['ryba', 'рыба'], ['łyżka', 'ложка'], ['góra', 'гора'],
      ['ciocia', 'тётя'], ['noc', 'ночь'], ['dziecko', 'ребёнок'], ['ręka', 'рука'],
    ].map(([p, r]) => `<div><b>${p}</b> <span class="ru">${r}</span></div>`).join('')}</div>`)}
  ${task(3, 'Otocz kółkiem słowa z literą ł.', 'Обведи в кружок слова с буквой ł (не l!).',
    `<div class="pool big">łyżka · lampa · ławka · las · szkoła · lody · stół · mleko · głowa · lis</div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Przeczytaj i napisz po rosyjsku.', 'Прочитай и напиши по-русски.',
    `<div class="fill2">${['kot', 'dom', 'woda', 'zima', 'noga', 'brat', 'siostra', 'mleko']
      .map(w => `<div><b>${w}</b> = ${bl(22)}</div>`).join('')}</div>`)}
  ${task(5, 'Podkreśl sylabę z akcentem.', 'Подчеркни ударный слог (предпоследний!).',
    `<div class="pool big syl">ma-ma · ko-le-ga · szko-ła · ta-bli-ca · cze-ko-la-da · na-u-czy-ciel</div>`)}
  ${task(6, 'Napisz swoje imię po polsku.', 'Напиши своё имя латиницей.',
    `<div class="translit">${[
      ['ш', 'sz'], ['ч', 'cz'], ['щ', 'szcz'], ['ж', 'ż'], ['х', 'ch'], ['ц', 'c'], ['ы', 'y'],
      ['й', 'j'], ['я', 'ja'], ['ю', 'ju'], ['е', 'je / ie'], ['ё', 'jo'],
    ].map(([r, p]) => `<span><span class="ru">${r}</span> = <b>${p}</b></span>`).join('')}</div>
    <p class="small">Саша → <b>Sasza</b>, Женя → <b>Żenia</b>, Юля → <b>Julia</b>, Ваня → <b>Wania</b></p>
    <div class="fillrow">Imię <span class="ru">(имя)</span>: ${bl(70)}</div>
    <div class="fillrow">Nazwisko <span class="ru">(фамилия)</span>: ${bl(62)}</div>`)}
  ${say('Przeczytaj nauczycielowi 5 słów z zadania 2.', 'Прочитай учителю 5 слов из задания 2.')}
  ${umiem([
    ['czytać polskie litery', 'читать польские буквы'],
    ['czytać sz, cz, rz, ch, ł', 'читать sz, cz, rz, ch, ł'],
    ['napisać swoje imię po polsku', 'написать своё имя по-польски'],
  ])}
</section>`,
]

const L2 = [
`<section class="page">
  ${head(2, 'Cześć! Jak masz na imię?', 'Привет! Как тебя зовут?')}
  ${vocab([
    ['👋', 'Cześć!', 'чещь', 'Привет! / Пока!'],
    ['🙂', 'Dzień dobry!', 'джень добры', 'Здравствуйте!'],
    ['🚶', 'Do widzenia!', 'до видзеня', 'До свидания!'],
    ['🙏', 'Dziękuję.', 'дженкуе', 'Спасибо.'],
    ['🤲', 'Proszę.', 'прошэ', 'Пожалуйста.'],
    ['😬', 'Przepraszam.', 'пшепрашам', 'Извините.'],
    ['👍', 'Tak.', 'так', 'Да.'],
    ['👎', 'Nie.', 'не', 'Нет.'],
    ['🤷', 'Nie rozumiem.', 'не розумем', 'Я не понимаю.'],
    ['🔁', 'Proszę powtórzyć.', 'прошэ повтужыч', 'Повторите, пожалуйста.'],
  ])}
  ${box(`<p class="ru"><b>Cześć</b> говорим друзьям. Учителю и взрослым говорим <b>Dzień dobry</b> и <b>Do widzenia</b>.</p>
    <p class="ru">К учителю обращаемся: <b>proszę pani</b> [прошэ пани] (женщина) или <b>proszę pana</b> [прошэ пана] (мужчина).<br>
    Например: <b>Proszę pana, nie rozumiem.</b></p>`)}
</section>`,
`<section class="page">
  ${sec('Rozmowa', 'Разговор')}
  ${vocab([
    ['❓', 'Jak masz na imię?', 'як маш на имье', 'Как тебя зовут?'],
    ['🙋', 'Mam na imię Ola.', 'мам на имье', 'Меня зовут Оля.'],
    ['❓', 'Ile masz lat?', 'иле маш лят', 'Сколько тебе лет?'],
    ['🔟', 'Mam 10 lat.', 'мам ... лят', 'Мне 10 лет.'],
    ['❓', 'Skąd jesteś?', 'сконт естэщ', 'Откуда ты?'],
    ['🏠', 'Jestem z Ukrainy.', 'естэм з украины', 'Я из Украины.'],
    ['📍', 'Mieszkam w Polsce.', 'мешкам в польсцэ', 'Я живу в Польше.'],
    ['🤝', 'Miło mi.', 'миўо ми', 'Приятно познакомиться.'],
  ], 1)}
  ${task(1, 'Połącz.', 'Соедини.',
    match(['Cześć!', 'Dziękuję.', 'Przepraszam.', 'Do widzenia!', 'Nie rozumiem.', 'Tak.'],
      ['Да.', 'До свидания!', 'Привет!', 'Я не понимаю.', 'Спасибо.', 'Извините.']))}
</section>`,
`<section class="page">
  ${task(2, 'Co powiesz? Zaznacz ✓.', 'Что ты скажешь? Отметь ✓.',
    choice([
      ['Rano wchodzisz do klasy. Tam jest nauczyciel.', 'Утром ты входишь в класс. Там учитель.', ['Cześć!', 'Dzień dobry!']],
      ['Kolega daje ci długopis.', 'Одноклассник даёт тебе ручку.', ['Dziękuję!', 'Do widzenia!']],
      ['Nie rozumiesz nauczyciela.', 'Ты не понимаешь учителя.', ['Nie rozumiem.', 'Tak.']],
      ['Idziesz do domu. Mówisz do nauczyciela:', 'Идёшь домой. Говоришь учителю:', ['Do widzenia!', 'Cześć!']],
    ]))}
  ${task(3, 'Uzupełnij rozmowę.', 'Дополни разговор. Слова: Cześć, imię, Mam, lat, jesteś',
    `<div class="dialog">
      <div><b>Ola:</b> ${bl(20)}! Jak masz na imię?</div>
      <div><b>Artem:</b> Mam na ${bl(18)} Artem. A ty?</div>
      <div><b>Ola:</b> ${bl(16)} na imię Ola. Ile masz ${bl(14)}?</div>
      <div><b>Artem:</b> Mam 11 lat.</div>
      <div><b>Ola:</b> Skąd ${bl(18)}?</div>
      <div><b>Artem:</b> Jestem z Ukrainy.</div>
    </div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Ułóż zdania.', 'Составь предложения из слов.',
    `<div class="scramble">${[
      'imię / na / Mam / Ola.', '10 / lat / Mam.', 'z / Jestem / Ukrainy.', 'rozumiem / Nie.',
    ].map(s => `<div><span class="sw">${s}</span>${bl(52)}</div>`).join('')}</div>`)}
  ${task(5, 'Napisz o sobie.', 'Напиши о себе.',
    `<div class="fillrow">Mam na imię ${bl(60)}.</div>
     <div class="fillrow">Mam ${bl(18)} lat.</div>
     <div class="fillrow">Jestem z ${bl(55)}.</div>
     <div class="fillrow">Mieszkam w Polsce.</div>`)}
  ${say('Dzień dobry! Mam na imię … . Mam … lat. Jestem z … .', 'Здравствуйте! Меня зовут … . Мне … лет. Я из … .')}
  ${umiem([
    ['przywitać się i pożegnać', 'здороваться и прощаться'],
    ['powiedzieć, jak mam na imię i ile mam lat', 'сказать, как меня зовут и сколько мне лет'],
    ['powiedzieć „Nie rozumiem”', 'сказать «Я не понимаю»'],
  ])}
</section>`,
]

const L3 = [
`<section class="page">
  ${head(3, 'Moja klasa', 'Мой класс')}
  ${vocab([
    ['📓', 'zeszyt', 'зэшыт', 'тетрадь'],
    ['📕', 'książka', 'кщёншка', 'книга'],
    ['📘', 'podręcznik', 'подрэнчник', 'учебник'],
    ['🖊️', 'długopis', 'дўугопис', 'ручка'],
    ['✏️', 'ołówek', 'оўувэк', 'карандаш'],
    ['🧽', 'gumka', 'гумка', 'ластик'],
    ['📏', 'linijka', 'линийка', 'линейка'],
    ['👝', 'piórnik', 'пюрник', 'пенал'],
    ['🎒', 'plecak', 'плецак', 'рюкзак'],
    ['🖍️', 'kredki', 'крэтки', 'цветные карандаши'],
    ['✂️', 'nożyczki', 'ножычки', 'ножницы'],
    ['🧴', 'klej', 'клей', 'клей'],
    ['🪑', 'krzesło', 'кшэсўо', 'стул'],
    ['🟫', 'ławka', 'ўавка', 'парта'],
    ['🟩', 'tablica', 'таблица', 'доска'],
    ['🧑‍🏫', 'nauczyciel', 'научычель', 'учитель'],
    ['🧒', 'uczeń / uczennica', 'учэнь / учэнница', 'ученик / ученица'],
    ['🧑‍🤝‍🧑', 'kolega / koleżanka', 'колэга / колэжанка', 'одноклассник / одноклассница'],
  ])}
  ${box(`<b>To jest …</b> <span class="ru">= Это …</span> &nbsp; <b>To jest zeszyt.</b> <span class="ru">Это тетрадь.</span><br>
    <b>Co to jest?</b> <i>[цо то ест]</i> <span class="ru">= Что это?</span>`)}
</section>`,
`<section class="page">
  ${sec('Co mówi nauczyciel?', 'Что говорит учитель?')}
  ${vocab([
    ['🪑', 'Siadajcie.', 'щядайте', 'Садитесь.'],
    ['📋', 'Sprawdzam obecność.', 'справдзам обэцнощч', 'Проверяю, кто есть на уроке.'],
    ['🙋', 'Jestem!', 'естэм', 'Я здесь! (так отвечают)'],
    ['📓', 'Otwórzcie zeszyty.', 'отвужчье зэшыты', 'Откройте тетради.'],
    ['✍️', 'Zapiszcie temat.', 'запищье тэмат', 'Запишите тему.'],
    ['📖', 'Otwórzcie książki na stronie 20.', 'на строне', 'Откройте книги на странице 20.'],
    ['👀', 'Przeczytaj.', 'пшэчытай', 'Прочитай.'],
    ['✏️', 'Napisz.', 'напиш', 'Напиши.'],
    ['🟩', 'Podejdź do tablicy.', 'подэйдж до таблицы', 'Подойди к доске.'],
    ['🤫', 'Cisza! / Proszę o ciszę.', 'чиша / прошэ о чишэ', 'Тишина! / Прошу тишины.'],
    ['✋', 'Podnieś rękę.', 'поднещ рэнкэ', 'Подними руку.'],
    ['❓', 'Kto wie?', 'кто ве', 'Кто знает?'],
    ['🏠', 'Zadanie domowe', 'заданье домовэ', 'Домашнее задание'],
    ['🔔', 'Koniec lekcji. Przerwa!', 'коньец лекцьи. пшэрва', 'Конец урока. Перемена!'],
  ], 1)}
</section>`,
`<section class="page">
  ${task(1, 'Podpisz obrazki.', 'Подпиши картинки.',
    picGrid(['📓', '✏️', '🎒', '✂️', '📏', '🖍️', '🪑', '📕']))}
  ${task(2, 'Połącz polecenie z tłumaczeniem.', 'Соедини команду с переводом.',
    match(['Otwórzcie zeszyty.', 'Zapiszcie temat.', 'Cisza!', 'Podnieś rękę.', 'Siadajcie.', 'Przeczytaj.'],
      ['Подними руку.', 'Прочитай.', 'Откройте тетради.', 'Садитесь.', 'Тишина!', 'Запишите тему.']))}
</section>`,
`<section class="page">
  ${task(3, 'Co to jest? Napisz.', 'Что это? Напиши.',
    `<div class="fillrow"><span class="em">🖊️</span> To jest ${bl(45)}.</div>
     <div class="fillrow"><span class="em">🎒</span> To jest ${bl(45)}.</div>
     <div class="fillrow"><span class="em">📕</span> To jest ${bl(45)}.</div>`)}
  ${task(4, 'Wykreśl słowo, które nie pasuje.', 'Вычеркни лишнее слово.',
    `<div class="odd">
      <div>a) zeszyt · ołówek · mama · gumka</div>
      <div>b) tablica · ławka · krzesło · banan</div>
      <div>c) Dzień dobry · Cześć · Do widzenia · linijka</div>
    </div>`)}
  ${task(5, 'Wpisz brakujące litery.', 'Впиши пропущенные буквы.',
    `<div class="gaps">z<span class="gap"></span>szyt · ołó<span class="gap"></span>ek · pl<span class="gap"></span>cak · kre<span class="gap"></span>ki · ta<span class="gap"></span>lica · no<span class="gap"></span>yczki</div>`)}
  ${task(6, 'Co masz w plecaku? Otocz kółkiem i napisz.', 'Что у тебя в рюкзаке? Обведи и напиши.',
    `<div class="pool">zeszyt · książka · długopis · ołówek · gumka · linijka · kredki · piórnik · nożyczki · klej</div>
     <div class="fillrow">W moim plecaku jest: ${bl(62)}</div>
     ${lines(1)}`)}
</section>`,
`<section class="page">
  ${say('Kiedy nauczyciel sprawdza obecność, powiedz: „Jestem!”<br>Kiedy nie rozumiesz: „Proszę pana, nie rozumiem.”',
    'Когда учитель проверяет, кто есть, скажи: «Jestem!»<br>Когда не понимаешь: «Proszę pana / pani, nie rozumiem.»')}
  ${umiem([
    ['nazwać rzeczy w klasie', 'назвать вещи в классе'],
    ['zrozumieć polecenia nauczyciela', 'понять команды учителя'],
    ['powiedzieć „To jest …”', 'сказать «Это …»'],
  ])}
  ${frame('Narysuj swoją ławkę i to, co na niej leży. Podpisz.', 'Нарисуй свою парту и то, что на ней лежит. Подпиши.', 95)}
</section>`,
]

const L4 = [
`<section class="page">
  ${head(4, 'Liczby i kolory', 'Числа и цвета')}
  <div class="nums">${[
    [0, 'zero', 'зэро'], [1, 'jeden', 'едэн'], [2, 'dwa', 'два'], [3, 'trzy', 'тшы'],
    [4, 'cztery', 'чтэры'], [5, 'pięć', 'пеньч'], [6, 'sześć', 'шэщч'], [7, 'siedem', 'щедэм'],
    [8, 'osiem', 'ощем'], [9, 'dziewięć', 'джевеньч'], [10, 'dziesięć', 'джещеньч'],
    [11, 'jedenaście', 'едэнащче'], [12, 'dwanaście', 'дванащче'], [13, 'trzynaście', 'тшынащче'],
    [14, 'czternaście', 'чтэрнащче'], [15, 'piętnaście', 'пентнащче'], [16, 'szesnaście', 'шэснащче'],
    [17, 'siedemnaście', 'щедэмнащче'], [18, 'osiemnaście', 'ощемнащче'], [19, 'dziewiętnaście', 'джевентнащче'],
    [20, 'dwadzieścia', 'дваджещча'], [30, 'trzydzieści', 'тшыджещчи'], [50, 'pięćdziesiąt', 'пеньчджещёнт'],
    [100, 'sto', 'сто'],
  ].map(([n, p, t]) => `<div><span class="nn">${n}</span><b>${p}</b><i>[${t}]</i></div>`).join('')}</div>
  <p class="small"><b>plus</b> <span class="ru">плюс</span> · <b>minus</b> <span class="ru">минус</span> · <b>równa się</b> <i>[рувна щэ]</i> <span class="ru">равно</span></p>
  ${box(`<b>Oceny w szkole <span class="ru">/ Оценки в школе</span></b>
    <p class="ru">В Польше оценки от 1 до 6. <b>6 - лучшая!</b> Бывают ещё плюсы и минусы: 4+, 5-.</p>
    <div class="grades">
      <span><b>6</b> celujący</span><span><b>5</b> bardzo dobry</span><span><b>4</b> dobry</span>
      <span><b>3</b> dostateczny</span><span><b>2</b> dopuszczający</span><span><b>1</b> niedostateczny</span>
    </div>`)}
</section>`,
`<section class="page">
  ${sec('Kolory', 'Цвета')}
  ${vocab([
    ['🍅', 'czerwony', 'чэрвоны', 'красный'],
    ['🍊', 'pomarańczowy', 'помараньчовы', 'оранжевый'],
    ['🍋', 'żółty', 'жуўты', 'жёлтый'],
    ['🥒', 'zielony', 'желёны', 'зелёный'],
    ['💧', 'niebieski', 'небески', 'синий, голубой'],
    ['🍇', 'fioletowy', 'фиолетовы', 'фиолетовый'],
    ['🐷', 'różowy', 'ружовы', 'розовый'],
    ['🐻', 'brązowy', 'бронзовы', 'коричневый'],
    ['⚫', 'czarny', 'чарны', 'чёрный'],
    ['☁️', 'biały', 'бяўы', 'белый'],
    ['🐘', 'szary', 'шары', 'серый'],
    ['❓', 'Jaki to kolor?', 'яки то колор', 'Какой это цвет?'],
  ])}
  ${task(1, 'Pokoloruj.', 'Раскрась квадраты нужным цветом.',
    `<div class="swatches">${['czerwony', 'zielony', 'żółty', 'niebieski', 'brązowy', 'różowy', 'pomarańczowy', 'czarny']
      .map(c => `<div><span class="sq"></span>${c}</div>`).join('')}</div>`)}
</section>`,
`<section class="page">
  ${task(2, 'Napisz słowami.', 'Напиши словами.',
    `<div class="fill2">${[3, 5, 8, 10, 12, 20].map(n => `<div><b>${n}</b> = ${bl(34)}</div>`).join('')}</div>`)}
  ${task(3, 'Policz i napisz.', 'Посчитай и напиши словом.',
    `<div class="count">
      <div><span class="em">✏️✏️✏️✏️</span> ${bl(30)}</div>
      <div><span class="em">🍎🍎🍎🍎🍎🍎</span> ${bl(30)}</div>
      <div><span class="em">⭐⭐⭐⭐⭐⭐⭐⭐⭐</span> ${bl(30)}</div>
      <div><span class="em">🐟🐟</span> ${bl(30)}</div>
    </div>`)}
  ${task(4, 'Matematyka po polsku.', 'Математика по-польски. Ответ напиши словом.',
    `<div class="math">
      <div>dwa + trzy = ${bl(30)}</div>
      <div>pięć + pięć = ${bl(30)}</div>
      <div>siedem + jeden = ${bl(30)}</div>
      <div>dziesięć - cztery = ${bl(30)}</div>
      <div>jedenaście + dziewięć = ${bl(30)}</div>
    </div>`)}
</section>`,
`<section class="page">
  ${task(5, 'Jaki to kolor? Uzupełnij.', 'Какого цвета? Дополни.',
    `<div class="fillrow"><span class="em">🍅</span> Pomidor jest ${bl(40)}.</div>
     <div class="fillrow"><span class="em">🐻</span> Miś jest ${bl(40)}.</div>
     <div class="fillrow"><span class="em">❄️</span> Śnieg jest ${bl(40)}.</div>
     <div class="fillrow"><span class="em">🐘</span> Słoń jest ${bl(40)}.</div>
     <div class="fillrow"><span class="em">🌲</span> Las jest ${bl(40)}.</div>
     <p class="ru small">pomidor - помидор, miś - мишка, śnieg - снег, słoń - слон, las - лес</p>`)}
  ${say('Policz od 1 do 20 po polsku.', 'Посчитай вслух от 1 до 20 по-польски.')}
  ${umiem([
    ['liczyć do 20', 'считать до 20'],
    ['nazwać kolory', 'называть цвета'],
    ['wiem, jakie są oceny w Polsce', 'знаю, какие оценки в Польше'],
  ])}
</section>`,
]

const L5 = [
`<section class="page">
  ${head(5, 'Moja rodzina', 'Моя семья')}
  ${vocab([
    ['👩', 'mama', 'мама', 'мама'],
    ['👨', 'tata', 'тата', 'папа'],
    ['👫', 'rodzice', 'роджицэ', 'родители'],
    ['👦', 'brat', 'брат', 'брат'],
    ['👧', 'siostra', 'щёстра', 'сестра'],
    ['👵', 'babcia', 'бабча', 'бабушка'],
    ['👴', 'dziadek', 'джядэк', 'дедушка'],
    ['👩', 'ciocia', 'чёча', 'тётя'],
    ['👨', 'wujek', 'вуек', 'дядя'],
    ['🧒', 'kuzyn / kuzynka', 'кузын / кузынка', 'двоюродный брат / сестра'],
    ['👶', 'dziecko', 'джецко', 'ребёнок'],
    ['🐕', 'pies', 'пес', 'собака'],
    ['🐈', 'kot', 'кот', 'кот, кошка'],
    ['👨‍👩‍👧‍👦', 'rodzina', 'роджина', 'семья (!)'],
  ])}
  ${box(`<p class="ru"><b>Осторожно!</b> <b>rodzina</b> = семья, а не родина. Родина по-польски - <b>ojczyzna</b>.</p>`)}
</section>`,
`<section class="page">
  ${box(`<b>mój · moja · moje</b>
    <p class="ru">Как в русском: <b>мой</b> = <b>mój</b>, <b>моя</b> = <b>moja</b>, <b>моё</b> = <b>moje</b>.</p>
    <div class="cols2">
      <div><b>mój</b> tata<br><b>mój</b> brat<br><b>mój</b> pies<br><b>mój</b> zeszyt</div>
      <div><b>moja</b> mama<br><b>moja</b> siostra<br><b>moja</b> babcia<br><b>moja</b> książka</div>
    </div>
    <p class="ru">Слова на <b>-a</b> обычно женского рода - как в русском! Но <b>tata</b> - это мужчина, поэтому <b>mój tata</b>.</p>
    <p><b>on</b> <span class="ru">он</span> · <b>ona</b> <span class="ru">она</span> · <b>Mój brat ma na imię Ivan.</b> <span class="ru">Моего брата зовут Иван.</span></p>`, 'Gramatyka')}
  ${task(1, 'Wpisz: mój czy moja?', 'Впиши: mój или moja?',
    `<div class="fill2">${['mama', 'brat', 'siostra', 'babcia', 'dziadek', 'tata', 'ciocia', 'pies']
      .map(w => `<div>${bl(16)} ${w}</div>`).join('')}</div>`)}
</section>`,
`<section class="page">
  ${task(2, 'Połącz.', 'Соедини.',
    match(['babcia', 'dziadek', 'siostra', 'wujek', 'ciocia', 'rodzice'],
      ['тётя', 'родители', 'бабушка', 'дядя', 'сестра', 'дедушка']))}
  ${task(3, 'Kto to jest? Uzupełnij.', 'Кто это? Дополни. (mamy = мамы, taty = папы)',
    `<div class="fillrow">a) Mama mojej mamy to moja ${bl(30)}.</div>
     <div class="fillrow">b) Tata mojego taty to mój ${bl(30)}.</div>
     <div class="fillrow">c) Brat mojej mamy to mój ${bl(30)}.</div>
     <div class="fillrow">d) Siostra mojego taty to moja ${bl(30)}.</div>`)}
  ${task(4, 'Napisz o swojej rodzinie.', 'Напиши о своей семье. Выбери и перепиши.',
    `<div class="fillrow">Moja mama ma na imię ${bl(40)}.</div>
     <div class="fillrow">Mój tata ma na imię ${bl(42)}.</div>
     <p class="small">Mam brata. <span class="ru">(у меня есть брат)</span> · Mam siostrę. <span class="ru">(сестра)</span> · Nie mam rodzeństwa. <span class="ru">(нет братьев и сестёр)</span> · Mam psa / kota. <span class="ru">(собака / кот)</span></p>
     ${lines(2)}`)}
</section>`,
`<section class="page">
  ${frame('Narysuj swoją rodzinę i podpisz: mama, tata, brat …', 'Нарисуй свою семью и подпиши.', 120)}
  ${say('To jest moja rodzina. Moja mama ma na imię … .', 'Это моя семья. Мою маму зовут … .')}
  ${umiem([
    ['nazwać osoby w rodzinie', 'назвать членов семьи'],
    ['powiedzieć mój i moja', 'говорить mój и moja'],
    ['opowiedzieć o rodzinie', 'рассказать о семье'],
  ])}
</section>`,
]

const powtorka1 = [
`<section class="page">
  ${head('✓', 'Powtórka 1', 'Повторение 1 - темы 1-5')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>

  ${task(1, 'Przetłumacz na polski.', 'Переведи на польский. (8 п.)',
    `<div class="fill2">${['Спасибо', 'Здравствуйте', 'Я не понимаю', 'тетрадь', 'карандаш', 'пять', 'красный', 'бабушка']
      .map(w => `<div><span class="ru">${w}</span> ${bl(30)}</div>`).join('')}</div>`)}
  ${task(2, 'Odpowiedz na pytania.', 'Ответь на вопросы. (4 п.)',
    `<div class="fillrow">Jak masz na imię? ${bl(50)}</div>
     <div class="fillrow">Ile masz lat? ${bl(58)}</div>
     <div class="fillrow">Skąd jesteś? ${bl(58)}</div>
     <div class="fillrow">Co to jest? <span class="em">✏️</span> ${bl(52)}</div>`)}
</section>`,
`<section class="page">
  ${task(3, 'Policz. Napisz słowami.', 'Посчитай. Напиши словом. (2 п.)',
    `<div class="math"><div>siedem + sześć = ${bl(34)}</div><div>dwadzieścia - pięć = ${bl(34)}</div></div>`)}
  ${task(4, 'Wpisz: mój czy moja?', 'Впиши: mój или moja? (4 п.)',
    `<div class="fill2">${['zeszyt', 'książka', 'siostra', 'długopis'].map(w => `<div>${bl(16)} ${w}</div>`).join('')}</div>`)}
  ${task(5, 'Co powiesz nauczycielowi, kiedy nie rozumiesz?', 'Что ты скажешь учителю, если не понимаешь? (2 п.)',
    `${lines(1)}`)}
</section>`,
]

const klucz1 = `
<section class="page key">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 1</h4>
  <p>1: sz-ш, cz-ч, ż-ж, ch-х, ł-ў, y-ы, ó-у, c-ц<br>
  3: łyżka, ławka, szkoła, stół, głowa<br>
  4: кот, дом, вода, зима, нога, брат, сестра, молоко<br>
  5: <u>MA</u>-ma, ko-<u>LE</u>-ga, <u>SZKO</u>-ła, ta-<u>BLI</u>-ca, cze-ko-<u>LA</u>-da, na-u-<u>CZY</u>-ciel</p>
  <h4>Temat 2</h4>
  <p>1: Cześć! - Привет!, Dziękuję. - Спасибо., Przepraszam. - Извините., Do widzenia! - До свидания!, Nie rozumiem. - Я не понимаю., Tak. - Да.<br>
  2: Dzień dobry! · Dziękuję! · Nie rozumiem. · Do widzenia!<br>
  3: Cześć · imię · Mam · lat · jesteś<br>
  4: Mam na imię Ola. · Mam 10 lat. · Jestem z Ukrainy. · Nie rozumiem.</p>
  <h4>Temat 3</h4>
  <p>1: zeszyt, ołówek, plecak, nożyczki, linijka, kredki, krzesło, książka<br>
  2: Otwórzcie zeszyty. - Откройте тетради., Zapiszcie temat. - Запишите тему., Cisza! - Тишина!, Podnieś rękę. - Подними руку., Siadajcie. - Садитесь., Przeczytaj. - Прочитай.<br>
  3: długopis, plecak, książka<br>
  4: a) mama, b) banan, c) linijka<br>
  5: zeszyt, ołówek, plecak, kredki, tablica, nożyczki</p>
</section>
<section class="page key cont">
  <h4>Temat 4</h4>
  <p>2: 3 trzy, 5 pięć, 8 osiem, 10 dziesięć, 12 dwanaście, 20 dwadzieścia<br>
  3: cztery, sześć, dziewięć, dwa<br>
  4: pięć, dziesięć, osiem, sześć, dwadzieścia<br>
  5: czerwony, brązowy, biały, szary, zielony</p>
  <h4>Temat 5</h4>
  <p>1: moja mama, mój brat, moja siostra, moja babcia, mój dziadek, mój tata, moja ciocia, mój pies<br>
  2: babcia - бабушка, dziadek - дедушка, siostra - сестра, wujek - дядя, ciocia - тётя, rodzice - родители<br>
  3: a) babcia, b) dziadek, c) wujek, d) ciocia</p>
</section>`

const notatki = `
<section class="page">
  ${sec('Notatki', 'Заметки')}
  ${lines(21)}
</section>`

const stronaStartu = (tematy) => `
<section class="page">
  ${head('★', 'Jak pracować z zeszytem?', 'Как работать с тетрадью?')}
  <p class="ru">Привет! Это твоя тетрадь по польскому. Ты работаешь с ней на уроках польского - сам, в своём темпе.</p>
  <ol class="ru steps">
    <li>На каждом уроке польского открой тетрадь там, где закончил в прошлый раз.</li>
    <li>Читай новые слова вслух, тихо, шёпотом.</li>
    <li>Делай задания по порядку. Пиши прямо в тетради.</li>
    <li>Проверь себя по ключу в конце тетради (стр. <span class="kluczstr"></span>). Ошибки исправь другим цветом.</li>
    <li>В конце темы подойди к учителю и скажи фразу из рамки <b>🗣️ Powiedz nauczycielowi</b>.</li>
    <li>Не понимаешь? Подними руку и скажи: <b>Proszę pana / pani, nie rozumiem.</b></li>
  </ol>
  ${sec('Moje postępy', 'Мои успехи')}
  ${postepy(tematy)}
</section>`

// ---------- CZESC 2 ----------

const L6 = [
`<section class="page">
  ${head(6, 'Dni tygodnia i plan lekcji', 'Дни недели и расписание')}
  ${vocab([
    ['1', 'poniedziałek', 'понеджяўэк', 'понедельник'],
    ['2', 'wtorek', 'фторэк', 'вторник'],
    ['3', 'środa', 'щрода', 'среда'],
    ['4', 'czwartek', 'чфартэк', 'четверг'],
    ['5', 'piątek', 'пёнтэк', 'пятница'],
    ['6', 'sobota', 'собота', 'суббота'],
    ['7', 'niedziela', 'неджеля', 'воскресенье (!)'],
  ], 1)}
  ${vocab([
    ['📅', 'dzisiaj / dziś', 'джищяй / джищ', 'сегодня'],
    ['➡️', 'jutro', 'ютро', 'завтра (!)'],
    ['⬅️', 'wczoraj', 'фчорай', 'вчера'],
    ['🗓️', 'tydzień', 'тыджень', 'неделя'],
  ])}
  ${box(`<p class="ru"><b>Осторожно!</b> <b>niedziela</b> = воскресенье, а неделя = <b>tydzień</b>.<br>
    <b>jutro</b> = завтра, а утро = <b>rano</b>.</p>
    <p><b>Dzisiaj jest środa.</b> <span class="ru">Сегодня среда.</span> <b>Jutro jest czwartek.</b> <span class="ru">Завтра четверг.</span></p>`)}
</section>`,
`<section class="page">
  ${sec('Przedmioty w szkole', 'Школьные предметы')}
  ${vocab([
    ['📖', 'język polski', 'енызык польски', 'польский язык'],
    ['➗', 'matematyka', 'матэматыка', 'математика'],
    ['💬', 'język angielski', 'ангельски', 'английский язык'],
    ['🏛️', 'historia', 'хисторья', 'история'],
    ['🌿', 'przyroda', 'пшырода', 'природоведение (4 кл.)'],
    ['🧬', 'biologia', 'биёлёгья', 'биология (5 кл.)'],
    ['🌍', 'geografia', 'гэографья', 'география (5 кл.)'],
    ['🎨', 'plastyka', 'пластыка', 'ИЗО, рисование'],
    ['🎵', 'muzyka', 'музыка', 'музыка'],
    ['⚽', 'WF', 'вуэф', 'физкультура'],
    ['💻', 'informatyka', 'информатыка', 'информатика'],
    ['🔧', 'technika', 'тэхника', 'технология, труд'],
    ['🗣️', 'godzina wychowawcza', 'годжина выховафча', 'классный час'],
  ])}
  ${sec('W szkole', 'В школе')}
  ${vocab([
    ['📚', 'lekcja', 'лекцья', 'урок'],
    ['🔔', 'przerwa / dzwonek', 'пшэрва / дзвонэк', 'перемена / звонок'],
    ['🍽️', 'stołówka', 'стоўуфка', 'столовая'],
    ['🚻', 'toaleta', 'тоалета', 'туалет'],
    ['🧸', 'świetlica', 'щвьетлица', 'продлёнка'],
    ['🏀', 'sala gimnastyczna', 'саля гимнастычна', 'спортзал'],
  ])}
</section>`,
`<section class="page">
  ${task(1, 'Wpisz brakujące dni.', 'Впиши пропущенные дни.',
    `<div class="fillrow">poniedziałek, ${bl(28)}, środa, ${bl(28)},</div>
     <div class="fillrow">piątek, ${bl(28)}, niedziela</div>`)}
  ${task(2, 'Połącz.', 'Соедини.',
    match(['niedziela', 'jutro', 'dzisiaj', 'wczoraj', 'tydzień', 'przerwa'],
      ['неделя', 'вчера', 'воскресенье', 'перемена', 'завтра', 'сегодня']))}
  ${task(3, 'Uzupełnij.', 'Дополни.',
    `<div class="fillrow">Dzisiaj jest ${bl(45)}.</div>
     <div class="fillrow">Jutro jest ${bl(47)}.</div>`)}
  ${task(4, 'Jaki to przedmiot?', 'Какой это предмет?',
    `<div class="fill2">${['🎨', '➗', '🎵', '⚽', '🌍', '🏛️'].map(e => `<div><span class="em">${e}</span> ${bl(36)}</div>`).join('')}</div>`)}
</section>`,
`<section class="page">
  ${task(5, 'Co lubisz?', 'Что ты любишь? После lubię слова на -a меняют -a на -ę.',
    `<p class="small">matematyka → Lubię <b>matematykę</b>. · muzyka → Lubię <b>muzykę</b>. · WF → Lubię <b>WF</b>.</p>
     <div class="fillrow">Lubię ${bl(60)}.</div>
     <div class="fillrow">Nie lubię ${bl(55)}.</div>`)}
  ${task(6, 'Mój plan lekcji.', 'Моё расписание. Перепиши его по-польски (спроси у учителя или одноклассника).',
    `<table class="plan">
      <tr><th></th><th>pon.</th><th>wt.</th><th>śr.</th><th>czw.</th><th>pt.</th></tr>
      ${[1, 2, 3, 4, 5, 6, 7].map(n => `<tr><td>${n}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
    </table>`)}
  ${say('Dzisiaj jest … . Teraz mamy język polski.', 'Сегодня … . Сейчас у нас польский язык.')}
  ${umiem([
    ['nazwać dni tygodnia', 'называть дни недели'],
    ['nazwać przedmioty w szkole', 'называть школьные предметы'],
    ['powiedzieć, co lubię', 'сказать, что я люблю'],
  ])}
</section>`,
]

const L7 = [
`<section class="page">
  ${head(7, 'Jedzenie', 'Еда')}
  ${vocab([
    ['🍞', 'chleb', 'хлеб', 'хлеб'],
    ['🧈', 'masło', 'масўо', 'масло'],
    ['🧀', 'ser', 'сэр', 'сыр'],
    ['🥓', 'szynka', 'шынка', 'ветчина'],
    ['🥚', 'jajko', 'яйко', 'яйцо'],
    ['🥪', 'kanapka', 'канапка', 'бутерброд'],
    ['🥛', 'mleko', 'млэко', 'молоко'],
    ['💧', 'woda', 'вода', 'вода'],
    ['🧃', 'sok', 'сок', 'сок'],
    ['🍵', 'herbata', 'хэрбата', 'чай'],
    ['🍲', 'zupa', 'зупа', 'суп'],
    ['🥔', 'ziemniaki', 'жемняки', 'картошка'],
    ['🍗', 'kurczak', 'курчак', 'курица'],
    ['🐟', 'ryba', 'рыба', 'рыба'],
    ['🍝', 'makaron', 'макарон', 'макароны'],
    ['🍎', 'jabłko', 'япко', 'яблоко'],
    ['🍌', 'banan', 'банан', 'банан'],
    ['🍪', 'ciastko', 'чястко', 'печенье'],
    ['🍦', 'lody', 'лоды', 'мороженое'],
    ['🍬', 'cukierek', 'цукерэк', 'конфета'],
  ])}
  ${vocab([
    ['🌅', 'śniadanie', 'щнядане', 'завтрак'],
    ['🕐', 'obiad', 'обят', 'обед'],
    ['🌙', 'kolacja', 'колацья', 'ужин'],
  ], 3)}
</section>`,
`<section class="page">
  ${sec('Przydatne zdania', 'Полезные фразы')}
  ${vocab([
    ['😋', 'Jestem głodny / głodna.', 'естэм гўодны / гўодна', 'Я голоден / голодна.'],
    ['🥤', 'Chce mi się pić.', 'хцэ ми щэ пич', 'Я хочу пить.'],
    ['❤️', 'Lubię …', 'любе', 'Я люблю …'],
    ['💔', 'Nie lubię …', 'не любе', 'Я не люблю …'],
    ['🙏', 'Poproszę …', 'попрошэ', 'Дайте, пожалуйста …'],
    ['🍽️', 'Smacznego!', 'смачнэго', 'Приятного аппетита!'],
    ['😍', 'Pyszne!', 'пышнэ', 'Вкусно!'],
    ['💰', 'Ile to kosztuje?', 'иле то коштуе', 'Сколько это стоит?'],
    ['🏪', 'sklep / sklepik', 'склеп / склепик', 'магазин / магазинчик (!)'],
  ], 1)}
  ${box(`<p class="ru">После <b>lubię</b> и <b>poproszę</b> слова на <b>-a</b> меняют <b>-a</b> на <b>-ę</b>:</p>
    <p>woda → Lubię <b>wodę</b>. · zupa → <b>zupę</b> · herbata → <b>herbatę</b> · kanapka → Poproszę <b>kanapkę</b>.</p>
    <p class="ru">Остальные слова не меняются: Lubię <b>chleb</b>, <b>ser</b>, <b>mleko</b>, <b>sok</b>, <b>lody</b>.</p>
    <p class="ru"><b>złoty (zł)</b> - польские деньги. <b>sklep</b> = магазин, а не склеп!</p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Podpisz obrazki.', 'Подпиши картинки.',
    picGrid(['🍞', '🧀', '🥛', '🍎', '🍌', '🥚', '🍲', '🍕']))}
  ${task(2, 'Jem czy piję? Wpisz do tabeli.', 'Ем или пью? Впиши в таблицу.',
    `<div class="pool">mleko · chleb · sok · ser · woda · zupa · herbata · banan</div>
     <table class="sort"><tr><th>Jem 🍴 <span class="ru">я ем</span></th><th>Piję 🥤 <span class="ru">я пью</span></th></tr>
     <tr><td></td><td></td></tr></table>`)}
</section>`,
`<section class="page">
  ${task(3, 'W sklepiku szkolnym. Uzupełnij.', 'В школьном магазинчике. Дополни: Dzień dobry, Poproszę, Dziękuję',
    `<div class="dialog">
      <div><b>Ty:</b> ${bl(35)}!</div>
      <div><b>Pani:</b> Dzień dobry. Co podać? <span class="ru">(Что вам дать?)</span></div>
      <div><b>Ty:</b> ${bl(30)} kanapkę i sok.</div>
      <div><b>Pani:</b> Proszę. Pięć złotych.</div>
      <div><b>Ty:</b> ${bl(30)}!</div>
    </div>`)}
  ${task(4, 'Moje śniadanie.', 'Мой завтрак.',
    `<div class="fillrow">Na śniadanie jem ${bl(48)}</div>
     <div class="fillrow">i piję ${bl(62)}.</div>`)}
  ${say('Lubię … . Nie lubię … . Smacznego!', 'Я люблю … . Я не люблю … . Приятного аппетита!')}
  ${umiem([
    ['nazwać jedzenie i picie', 'называть еду и напитки'],
    ['powiedzieć, co lubię', 'сказать, что я люблю'],
    ['kupić coś w sklepiku', 'купить что-то в магазинчике'],
  ])}
</section>`,
]

const postac = `
<svg class="body" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial" font-size="9">
  <g fill="none" stroke="#222" stroke-width="2" stroke-linecap="round">
    <circle cx="85" cy="30" r="18" fill="#fff"/>
    <ellipse cx="65" cy="31" rx="3" ry="5" fill="#fff"/><ellipse cx="105" cy="31" rx="3" ry="5" fill="#fff"/>
    <path d="M85 30 L85 36"/><path d="M78 41 Q85 46 92 41"/>
    <rect x="67" y="52" width="36" height="52" rx="8" fill="#fff"/>
    <path d="M69 58 L45 100" stroke-width="7"/><path d="M101 58 L125 100" stroke-width="7"/>
    <path d="M77 104 L73 150" stroke-width="8"/><path d="M93 104 L97 150" stroke-width="8"/>
  </g>
  <circle cx="78" cy="27" r="2" fill="#222"/><circle cx="92" cy="27" r="2" fill="#222"/>
  <circle cx="43" cy="104" r="5" fill="#fff" stroke="#222" stroke-width="2"/><circle cx="127" cy="104" r="5" fill="#fff" stroke="#222" stroke-width="2"/>
  <ellipse cx="69" cy="154" rx="8" ry="4" fill="#222"/><ellipse cx="101" cy="154" rx="8" ry="4" fill="#222"/>
  <g stroke="#1f4e8c" stroke-width="0.8">
    <line x1="146" y1="12" x2="98" y2="18"/><line x1="24" y1="18" x2="76" y2="27"/>
    <line x1="146" y1="38" x2="86" y2="34"/><line x1="24" y1="58" x2="79" y2="42"/>
    <line x1="152" y1="112" x2="131" y2="106"/><line x1="146" y1="78" x2="95" y2="80"/>
    <line x1="18" y1="130" x2="74" y2="130"/><line x1="24" y1="38" x2="62" y2="31"/>
  </g>
  <g fill="#fff" stroke="#1f4e8c" stroke-width="1">
    ${[[152, 12], [18, 18], [152, 38], [18, 58], [158, 112], [152, 78], [12, 130], [18, 38]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join('')}
  </g>
  <g fill="#1f4e8c" font-weight="700" text-anchor="middle">
    ${[[152, 12, 1], [18, 18, 2], [152, 38, 3], [18, 58, 4], [158, 112, 5], [152, 78, 6], [12, 130, 7], [18, 38, 8]].map(([x, y, n]) => `<text x="${x}" y="${y + 3.2}">${n}</text>`).join('')}
  </g>
</svg>`

const L8 = [
`<section class="page">
  ${head(8, 'Ciało i samopoczucie', 'Тело и самочувствие')}
  ${vocab([
    ['🙂', 'głowa', 'гўова', 'голова'],
    ['💇', 'włosy', 'вўосы', 'волосы'],
    ['👁️', 'oko / oczy', 'око / очы', 'глаз / глаза'],
    ['👂', 'ucho / uszy', 'ухо / ушы', 'ухо / уши'],
    ['👃', 'nos', 'нос', 'нос'],
    ['👄', 'usta', 'уста', 'рот'],
    ['🦷', 'ząb / zęby', 'зомп / зэмбы', 'зуб / зубы'],
    ['🧣', 'szyja / gardło', 'шыя / гардўо', 'шея / горло'],
    ['✋', 'ręka / ręce', 'рэнка / рэнцэ', 'рука / руки'],
    ['🫃', 'brzuch', 'бжух', 'живот'],
    ['🧍', 'plecy', 'плецы', 'спина (!)'],
    ['🦵', 'noga / nogi', 'нога / ноги', 'нога / ноги'],
    ['🦶', 'stopa', 'стопа', 'стопа'],
  ])}
  ${box(`<p class="ru"><b>Осторожно!</b> <b>plecy</b> = спина, а плечи = <b>ramiona</b>.</p>`)}
</section>`,
`<section class="page">
  ${sec('Jak się czujesz?', 'Как ты себя чувствуешь?')}
  ${vocab([
    ['🤕', 'Boli mnie głowa.', 'боли мне гўова', 'У меня болит голова.'],
    ['😣', 'Boli mnie brzuch / ząb / gardło.', 'бжух / зомп / гардўо', 'Болит живот / зуб / горло.'],
    ['🤢', 'Źle się czuję.', 'жьле щэ чуе', 'Мне плохо.'],
    ['🤒', 'Jestem chory / chora.', 'естэм хоры / хора', 'Я болен / больна.'],
    ['🚻', 'Mogę iść do toalety?', 'могэ ищч до тоалеты', 'Можно выйти в туалет?'],
    ['💧', 'Mogę się napić wody?', 'могэ щэ напич воды', 'Можно попить воды?'],
    ['👩‍⚕️', 'Mogę iść do pielęgniarki?', 'до пелэнгнярки', 'Можно к медсестре?'],
    ['🥶', 'Zimno mi. / Gorąco mi.', 'жимно ми / горонцо ми', 'Мне холодно. / Мне жарко.'],
    ['😴', 'Jestem zmęczony / zmęczona.', 'змэнчоны / змэнчона', 'Я устал / устала.'],
    ['😀', 'Jestem wesoły / smutny / zły.', 'вэсоўы / смутны / зўы', 'Мне весело / грустно / я злой.'],
  ], 1)}
  ${box(`<p class="ru">Всегда начинай вежливо: <b>Proszę pana, …</b> или <b>Proszę pani, …</b><br>
    Например: <b>Proszę pana, mogę iść do toalety?</b></p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Podpisz części ciała.', 'Подпиши части тела.',
    `<div class="bodywrap">${postac}
      <div class="bodylist">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<div>${n}. ${bl(28)}</div>`).join('')}</div>
    </div>`)}
  ${task(2, 'Co cię boli? Uzupełnij.', 'Что у тебя болит? Дополни.',
    `<div class="fillrow">Boli mnie ${bl(35)}. <span class="ru">(голова)</span></div>
     <div class="fillrow">Boli mnie ${bl(35)}. <span class="ru">(зуб)</span></div>
     <div class="fillrow">Boli mnie ${bl(35)}. <span class="ru">(живот)</span></div>
     <div class="fillrow">Boli mnie ${bl(35)}. <span class="ru">(горло)</span></div>`)}
</section>`,
`<section class="page">
  ${task(3, 'Połącz.', 'Соедини.',
    match(['Mogę iść do toalety?', 'Mogę się napić wody?', 'Źle się czuję.', 'Zimno mi.', 'Jestem zmęczony.'],
      ['Мне холодно.', 'Можно выйти в туалет?', 'Я устал.', 'Мне плохо.', 'Можно попить воды?']))}
  ${task(4, 'Jak się dzisiaj czujesz? Otocz kółkiem i napisz.', 'Как ты сегодня? Обведи и напиши.',
    `<div class="pool big">😀 wesoły · 😢 smutny · 😴 zmęczony · 😠 zły · 🤒 chory</div>
     <div class="fillrow">Dzisiaj jestem ${bl(50)}.</div>`)}
  ${task(5, 'Uzupełnij.', 'Дополни.',
    `<div class="fillrow">Proszę pana, mogę iść do ${bl(30)}?</div>
     <div class="fillrow">Proszę pani, mogę się napić ${bl(28)}?</div>`)}
  ${say('Proszę pana, mogę iść do toalety?', 'Попроси учителя выйти в туалет - по-польски!')}
  ${umiem([
    ['nazwać części ciała', 'называть части тела'],
    ['powiedzieć, co mnie boli', 'сказать, что у меня болит'],
    ['grzecznie o coś poprosić', 'вежливо о чём-то попросить'],
  ])}
</section>`,
]

const kotek = (typ) => {
  const pud = `<rect x="18" y="38" width="44" height="30" fill="#fff" stroke="#222" stroke-width="2"/>`
  const stol = `<rect x="10" y="30" width="60" height="6" fill="#fff" stroke="#222" stroke-width="2"/><path d="M16 36 L16 70 M64 36 L64 70" stroke="#222" stroke-width="3"/>`
  const kot = (x, y, s = 22) => `<text x="${x}" y="${y}" font-size="${s}" font-family="Segoe UI Emoji" text-anchor="middle">🐈</text>`
  const inner = {
    na: pud + kot(40, 38),
    w: kot(40, 50, 24) + `<rect x="18" y="46" width="44" height="22" fill="#fff" stroke="#222" stroke-width="2"/><path d="M18 46 L10 38 M62 46 L70 38" stroke="#222" stroke-width="2"/>`,
    pod: stol + kot(40, 68),
    obok: `<rect x="6" y="38" width="36" height="30" fill="#fff" stroke="#222" stroke-width="2"/>` + kot(60, 68),
  }[typ]
  return `<svg viewBox="0 0 80 74" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="70" x2="78" y2="70" stroke="#999" stroke-width="1"/>${inner}</svg>`
}

const L9 = [
`<section class="page">
  ${head(9, 'Mój dom i mój pokój', 'Мой дом и моя комната')}
  ${vocab([
    ['🏠', 'dom', 'дом', 'дом'],
    ['🏢', 'mieszkanie', 'мешканье', 'квартира'],
    ['🚪', 'pokój', 'покуй', 'комната (!)'],
    ['🍳', 'kuchnia', 'кухня', 'кухня'],
    ['🚿', 'łazienka', 'ўаженка', 'ванная комната'],
    ['🛁', 'wanna', 'ванна', 'ванна'],
    ['🪟', 'okno', 'окно', 'окно'],
    ['🚪', 'drzwi', 'джви', 'дверь'],
    ['🛏️', 'łóżko', 'ўушко', 'кровать'],
    ['🍽️', 'stół', 'стуў', 'стол'],
    ['🪑', 'krzesło', 'кшэсўо', 'стул'],
    ['✍️', 'biurko', 'бюрко', 'письменный стол'],
    ['🚪', 'szafa', 'шафа', 'шкаф'],
    ['📚', 'półka', 'пуўка', 'полка'],
    ['💡', 'lampa', 'лампа', 'лампа'],
    ['🛋️', 'kanapa', 'канапа', 'диван (!)'],
    ['🟥', 'dywan', 'дыван', 'ковёр (!)'],
    ['📺', 'telewizor', 'тэлевизор', 'телевизор'],
    ['🧊', 'lodówka', 'лодуфка', 'холодильник'],
  ])}
  ${box(`<p class="ru"><b>Осторожно!</b> <b>dywan</b> = ковёр, а диван = <b>kanapa</b>. <b>pokój</b> = комната (а ещё «мир»).</p>`)}
</section>`,
`<section class="page">
  ${sec('Gdzie?', 'Где?')}
  ${vocab([
    ['', 'w', 'в', 'в'], ['', 'na', 'на', 'на'], ['', 'pod', 'под', 'под'],
    ['', 'obok', 'обок', 'рядом'], ['', 'za', 'за', 'за'], ['', 'przed', 'пшэт', 'перед'],
  ], 3)}
  <div class="cats">
    <div>${kotek('na')}<b>Kot jest na pudełku.</b><span class="ru">Кот на коробке.</span></div>
    <div>${kotek('w')}<b>Kot jest w pudełku.</b><span class="ru">Кот в коробке.</span></div>
    <div>${kotek('pod')}<b>Kot jest pod stołem.</b><span class="ru">Кот под столом.</span></div>
    <div>${kotek('obok')}<b>Kot jest obok pudełka.</b><span class="ru">Кот рядом с коробкой.</span></div>
  </div>
  ${box(`<p class="ru">Как и в русском, после <b>w, na, pod</b> слово меняет окончание: <b>stół</b> → pod <b>stołem</b>. Пока просто запомни готовые фразы.</p>
    <p><b>Gdzie jest …?</b> <i>[гдже ест]</i> <span class="ru">Где …?</span> · <b>Mieszkam w domu / w mieszkaniu.</b> <span class="ru">Я живу в доме / в квартире.</span></p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Podpisz obrazki.', 'Подпиши картинки.',
    picGrid(['🛏️', '🪑', '🪟', '🛋️', '💡', '📺', '🛁', '📚']))}
  ${task(2, 'Gdzie jest kot? Wpisz literę.', 'Где кот? Впиши букву.',
    `<div class="cats small">
      ${['obok', 'na', 'pod', 'w'].map((t, i) => `<div>${kotek(t)}<b>${i + 1}.</b> <span class="gap"></span></div>`).join('')}
    </div>
    <div class="odd">
      <div>a) Kot jest na pudełku. &nbsp; b) Kot jest w pudełku.</div>
      <div>c) Kot jest pod stołem. &nbsp; d) Kot jest obok pudełka.</div>
    </div>`)}
</section>`,
`<section class="page">
  ${task(3, 'Kuchnia czy łazienka? Wpisz do tabeli.', 'Кухня или ванная? Впиши в таблицу.',
    `<div class="pool">lodówka <span class="ru">(холодильник)</span> · wanna <span class="ru">(ванна)</span> · talerz <span class="ru">(тарелка)</span> · mydło <span class="ru">(мыло)</span> · garnek <span class="ru">(кастрюля)</span> · ręcznik <span class="ru">(полотенце)</span></div>
     <table class="sort"><tr><th>kuchnia 🍳</th><th>łazienka 🚿</th></tr><tr><td></td><td></td></tr></table>`)}
  ${task(4, 'Napisz o swoim pokoju.', 'Напиши о своей комнате.',
    `<div class="fillrow">Mieszkam w ${bl(55)}. <span class="ru">(domu / mieszkaniu)</span></div>
     <div class="fillrow">W moim pokoju jest ${bl(28)}, ${bl(28)}</div>
     <div class="fillrow">i ${bl(40)}.</div>`)}
  ${say('Mieszkam w mieszkaniu / w domu. W moim pokoju jest łóżko.', 'Я живу в квартире / в доме. В моей комнате есть кровать.')}
  ${umiem([
    ['nazwać pokoje i meble', 'называть комнаты и мебель'],
    ['powiedzieć, gdzie coś jest', 'сказать, где что находится'],
    ['opisać swój pokój', 'описать свою комнату'],
  ])}
</section>`,
]

const L10 = [
`<section class="page">
  ${head(10, 'Mój dzień', 'Мой день')}
  ${vocab([
    ['⏰', 'wstaję', 'фстае', 'встаю'],
    ['🪥', 'myję zęby', 'мые зэмбы', 'чищу зубы'],
    ['👕', 'ubieram się', 'убьерам щэ', 'одеваюсь'],
    ['🥣', 'jem śniadanie', 'ем щнядане', 'завтракаю'],
    ['🎒', 'idę do szkoły', 'идэ до шкоўы', 'иду в школу'],
    ['🏫', 'mam lekcje', 'мам лекцье', 'у меня уроки'],
    ['🍲', 'jem obiad', 'ем обят', 'обедаю'],
    ['🏠', 'wracam do domu', 'врацам до дому', 'возвращаюсь домой'],
    ['📝', 'odrabiam lekcje', 'одрабям лекцье', 'делаю уроки'],
    ['⚽', 'gram w piłkę', 'грам ф пиўкэ', 'играю в мяч'],
    ['📱', 'gram na telefonie', 'грам на тэлефоне', 'играю в телефоне'],
    ['📺', 'oglądam telewizję', 'оглёндам тэлевизье', 'смотрю телевизор'],
    ['📚', 'czytam', 'чытам', 'читаю'],
    ['😴', 'idę spać / śpię', 'идэ спач / щпе', 'иду спать / сплю'],
  ])}
  ${vocab([
    ['🌅', 'rano', 'рано', 'утром'],
    ['☀️', 'po południu', 'по поўудню', 'днём, после обеда'],
    ['🌆', 'wieczorem', 'вечорэм', 'вечером'],
    ['➡️', 'potem', 'потэм', 'потом'],
  ])}
</section>`,
`<section class="page">
  ${box(`<p class="ru">Как в русском, глагол меняется:</p>
    <table class="conj"><tr><td><b>ja czytam</b></td><td class="ru">я читаю</td><td><b>ja gram</b></td><td class="ru">я играю</td></tr>
    <tr><td><b>ty czytasz</b></td><td class="ru">ты читаешь</td><td><b>ty grasz</b></td><td class="ru">ты играешь</td></tr>
    <tr><td><b>on / ona czyta</b></td><td class="ru">он / она читает</td><td><b>on / ona gra</b></td><td class="ru">он / она играет</td></tr></table>
    <p class="ru">«Я» часто кончается на <b>-m</b> или <b>-ę</b>: czyta<b>m</b>, gra<b>m</b>, je<b>m</b> / id<b>ę</b>, myj<b>ę</b>, wstaj<b>ę</b>.<br>
    Слово <b>ja</b> можно не говорить: <b>Czytam.</b> = Я читаю.</p>`, 'Gramatyka')}
  ${task(1, 'Połącz.', 'Соедини.',
    match(['wstaję', 'jem', 'idę', 'czytam', 'gram', 'śpię'], ['читаю', 'сплю', 'встаю', 'играю', 'ем', 'иду']))}
  ${task(2, 'Ułóż w kolejności: 1, 2, 3 …', 'Расставь по порядку: 1, 2, 3 …',
    `<div class="order">${['idę do szkoły', 'wstaję', 'idę spać', 'jem śniadanie', 'wracam do domu', 'odrabiam lekcje']
      .map(s => `<div><span class="gap"></span> ${s}</div>`).join('')}</div>`)}
</section>`,
`<section class="page">
  ${task(3, 'Uzupełnij.', 'Дополни.',
    `<div class="fill2">
      <div>ja czytam</div><div>ja ${bl(26)}</div>
      <div>ty ${bl(26)}</div><div>ty grasz</div>
      <div>on ${bl(26)}</div><div>ona ${bl(26)}</div>
    </div>`)}
  ${task(4, 'Mój dzień. Napisz 5 zdań.', 'Мой день. Напиши 5 предложений.',
    `<p class="small">Rano … · Potem … · Po południu … · Wieczorem …</p>${lines(5)}`)}
  ${say('Rano wstaję. Potem idę do szkoły. Wieczorem … .', 'Утром я встаю. Потом иду в школу. Вечером … .')}
  ${umiem([
    ['opowiedzieć o swoim dniu', 'рассказать о своём дне'],
    ['powiedzieć ja czytam, ty czytasz', 'говорить ja czytam, ty czytasz'],
    ['użyć rano, potem, wieczorem', 'использовать rano, potem, wieczorem'],
  ])}
</section>`,
]

const powtorka2 = [
`<section class="page">
  ${head('✓', 'Powtórka 2', 'Повторение 2 - темы 6-10')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>

  ${task(1, 'Przetłumacz na polski.', 'Переведи на польский. (8 п.)',
    `<div class="fill2">${['воскресенье', 'завтра', 'перемена', 'хлеб', 'вода', 'голова', 'кровать', 'я читаю']
      .map(w => `<div><span class="ru">${w}</span> ${bl(30)}</div>`).join('')}</div>`)}
  ${task(2, 'Wpisz brakujący dzień.', 'Впиши пропущенный день. (2 п.)',
    `<div class="fillrow">wtorek, ${bl(30)}, czwartek</div>
     <div class="fillrow">piątek, ${bl(30)}, niedziela</div>`)}
  ${task(3, 'Odpowiedz.', 'Ответь. (4 п.)',
    `<div class="fillrow">Jaki dzisiaj jest dzień? Dzisiaj jest ${bl(34)}.</div>
     <div class="fillrow">Co lubisz jeść? Lubię ${bl(46)}.</div>
     <div class="fillrow">Co robisz rano? Rano ${bl(46)}.</div>
     <div class="fillrow"><span class="kot-mini">${kotek('na')}</span> Gdzie jest kot? Kot jest ${bl(32)}.</div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Co powiesz?', 'Что ты скажешь? (4 п.)',
    `<p class="ru">a) Ты хочешь выйти в туалет:</p>${lines(1)}
     <p class="ru">b) У тебя болит голова:</p>${lines(1)}`)}
  ${task(5, 'Lubię …', 'Дополни. (2 п.)',
    `<div class="fillrow">woda → Lubię ${bl(40)}.</div>
     <div class="fillrow">matematyka → Lubię ${bl(40)}.</div>`)}
</section>`,
]

const falszywi = `
<section class="page cont">
  ${head('⚠', 'Fałszywi przyjaciele', 'Ложные друзья: похоже, но значит другое!')}
  <table class="fp">
    <tr><th>po polsku</th><th class="ru">это значит</th><th class="ru">а русское слово по-польски</th></tr>
    ${[
      ['dywan', 'ковёр', 'диван = kanapa'],
      ['niedziela', 'воскресенье', 'неделя = tydzień'],
      ['jutro', 'завтра', 'утро = rano'],
      ['czas', 'время', 'час = godzina'],
      ['miasto', 'город', 'место = miejsce'],
      ['list', 'письмо', 'лист = kartka, liść'],
      ['owoce', 'фрукты', 'овощи = warzywa'],
      ['zawód', 'профессия', 'завод = fabryka'],
      ['dworzec', 'вокзал', 'дворец = pałac'],
      ['uroda', 'красота', 'урод = brzydal'],
      ['rodzina', 'семья', 'родина = ojczyzna'],
      ['sklep', 'магазин', 'склеп = krypta'],
      ['plecy', 'спина', 'плечи = ramiona'],
      ['pokój', 'комната', 'покой = spokój'],
      ['zapomnieć', 'забыть', 'запомнить = zapamiętać'],
      ['dziwny', 'странный', 'дивный = cudowny'],
    ].map(([p, r, x]) => `<tr><td><b>${p}</b></td><td class="ru">${r}</td><td class="ru">${x}</td></tr>`).join('')}
  </table>
  <p class="ru small">Знаешь ещё такие слова? Запиши их на странице «Notatki».</p>
</section>`

const dyplom = `
<section class="page diploma">
  <div class="dip-star">★</div>
  <div class="dip-t">Dyplom</div>
  <div class="ru dip-r">Диплом</div>
  <p>Gratulacje! <span class="ru">Поздравляем!</span></p>
  <div class="dip-line"></div>
  <p>ukończył(a) zeszyt<br><b class="dip-b">Mój polski od zera</b></p>
  <p class="ru">окончил(а) тетрадь «Мой польский с нуля»</p>
  <div class="dip-sign">
    <div><div class="dip-line short"></div>data <span class="ru">/ дата</span></div>
    <div><div class="dip-line short"></div>podpis nauczyciela <span class="ru">/ подпись учителя</span></div>
  </div>
</section>`

const klucz2 = `
<section class="page key">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 6</h4>
  <p>1: wtorek, czwartek, sobota<br>
  2: niedziela - воскресенье, jutro - завтра, dzisiaj - сегодня, wczoraj - вчера, tydzień - неделя, przerwa - перемена<br>
  4: plastyka, matematyka, muzyka, WF, geografia, historia</p>
  <h4>Temat 7</h4>
  <p>1: chleb, ser, mleko, jabłko, banan, jajko, zupa, pizza<br>
  2: Jem: chleb, ser, zupa, banan · Piję: mleko, sok, woda, herbata<br>
  3: Dzień dobry · Poproszę · Dziękuję</p>
  <h4>Temat 8</h4>
  <p>1: 1 głowa, 2 oko, 3 nos, 4 usta, 5 ręka, 6 brzuch, 7 noga, 8 ucho<br>
  2: głowa, ząb, brzuch, gardło<br>
  3: Mogę iść do toalety? - Можно выйти в туалет?, Mogę się napić wody? - Можно попить воды?, Źle się czuję. - Мне плохо., Zimno mi. - Мне холодно., Jestem zmęczony. - Я устал.<br>
  5: toalety, wody</p>
  <h4>Temat 9</h4>
  <p>1: łóżko, krzesło, okno, kanapa, lampa, telewizor, wanna, półka<br>
  2: 1 d, 2 a, 3 c, 4 b<br>
  3: kuchnia: lodówka, talerz, garnek · łazienka: wanna, mydło, ręcznik</p>
</section>
<section class="page key cont">
  <h4>Temat 10</h4>
  <p>1: wstaję - встаю, jem - ем, idę - иду, czytam - читаю, gram - играю, śpię - сплю<br>
  2: 1 wstaję, 2 jem śniadanie, 3 idę do szkoły, 4 wracam do domu, 5 odrabiam lekcje, 6 idę spać<br>
  3: ja gram, ty czytasz, on czyta, ona gra</p>
</section>`

// ---------- skladanie czesci ----------

const tematy1 = ['1. Polskie litery', '2. Cześć! Jak masz na imię?', '3. Moja klasa', '4. Liczby i kolory', '5. Moja rodzina', 'Powtórka 1']
const tematy2 = ['6. Dni tygodnia i plan lekcji', '7. Jedzenie', '8. Ciało i samopoczucie', '9. Mój dom i mój pokój', '10. Mój dzień', 'Powtórka 2']

// Kolejne strony tematu dostaja klase "cont" - w przegladarce ich klocki doplywaja
// na wolne miejsce poprzedniej strony (paginacja.js). Temat zawsze zaczyna sie od nowej strony.
const ciag = (strony) => strony.map((s, i) => (i ? s.replace('class="page"', 'class="page cont"') : s))

export const notatkiStrona = notatki

export function czesc1() {
  return [
    okladka(1, 'Tematy 1-5 · Темы 1-5'), stronaStartu(tematy1), stronaPolecen(),
    ...[L1, L2, L3, L4, L5, powtorka1].flatMap(ciag), klucz1,
  ]
}

export function czesc2() {
  return [
    okladka(2, 'Tematy 6-10 · Темы 6-10'), stronaStartu(tematy2), stronaPolecen('Przypomnij sobie polecenia', 'Вспомни задания'),
    ...[L6, L7, L8, L9, L10, powtorka2].flatMap(ciag), falszywi, dyplom, klucz2,
  ]
}
