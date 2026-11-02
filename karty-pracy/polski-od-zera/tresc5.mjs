// Zeszyt "Mój polski od zera" - część 5 (tematy 23-28), pod klasę 4: rzeczownik, wielka litera,
// przymiotnik i stopniowanie, opis przedmiotu, ó i u, ogłoszenie (rozdziały II-III podręcznika).
import { head, vocab, task, match, bl, lines, box, say, umiem, sec } from './klocki.mjs'
import { okladka, stronaStartu, stronaPolecen, dyplom, ciag } from './tresc.mjs'

const L23 = [
`<section class="page">
  ${head(23, 'Rzeczownik: ten, ta, to', 'Существительное: род и число')}
  <p class="ru"><b>rzeczownik</b> - это существительное, отвечает на вопросы <b>kto? co?</b> Как в русском, у него есть <b>род</b> и <b>число</b>.</p>
  <table class="pm">
    <tr><th>rodzaj <span class="ru">(род)</span></th><th>pytamy</th><th>przykłady</th><th class="ru">окончание</th></tr>
    <tr><td><b>męski</b><br><span class="ru">мужской</span></td><td><b>ten</b> <span class="ru">этот</span></td><td>ten kot, ten stół, ten zeszyt</td><td class="ru">согласная</td></tr>
    <tr><td><b>żeński</b><br><span class="ru">женский</span></td><td><b>ta</b> <span class="ru">эта</span></td><td>ta mama, ta szkoła, ta książka</td><td class="ru">-a</td></tr>
    <tr><td><b>nijaki</b><br><span class="ru">средний</span></td><td><b>to</b> <span class="ru">это</span></td><td>to okno, to dziecko, to jabłko</td><td class="ru">-o, -e, -ę</td></tr>
  </table>
  ${sec('Liczba', 'Число')}
  <p class="ru"><b>liczba pojedyncza</b> - одна вещь, <b>liczba mnoga</b> - много.</p>
  ${vocab([
    ['🐈', 'kot → koty', 'коты', 'кот → коты'],
    ['📓', 'zeszyt → zeszyty', 'зэшыты', 'тетрадь → тетради'],
    ['👩', 'mama → mamy', 'мамы', 'мама → мамы'],
    ['📕', 'książka → książki', 'кщёнжки', 'книга → книги'],
    ['🦵', 'noga → nogi', 'ноги', 'нога → ноги'],
    ['🪟', 'okno → okna', 'окна', 'окно → окна'],
    ['🧒', 'dziecko → dzieci (!)', 'джечи', 'ребёнок → дети'],
    ['🧑', 'człowiek → ludzie (!)', 'людже', 'человек → люди'],
  ])}
  ${box(`<p class="ru">Чаще всего: <b>-y</b> (koty, mamy). После <b>k, g</b> - <b>-i</b> (książki, nogi). Слова на <b>-o</b> → <b>-a</b> (okna).</p>
    <p><b>To jest</b> kot. <span class="ru">Это кот.</span> · <b>To są</b> koty. <span class="ru">Это коты.</span></p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Wpisz: ten, ta czy to?', 'Впиши: ten, ta или to?',
    `<div class="fill2">${['kot', 'książka', 'okno', 'długopis', 'szkoła', 'jabłko', 'plecak', 'mama']
      .map(w => `<div>${bl(14)} ${w}</div>`).join('')}</div>`)}
  ${task(2, 'Napisz liczbę mnogą.', 'Напиши множественное число.',
    `<div class="fill2">
      <div>kot → koty</div><div>zeszyt → ${bl(26)}</div>
      <div>mama → ${bl(26)}</div><div>okno → ${bl(26)}</div>
      <div>książka → ${bl(26)}</div><div>noga → ${bl(26)}</div>
      <div>krzesło → ${bl(26)}</div><div>dziecko → ${bl(26)}</div>
    </div>`)}
  ${task(3, 'Jedna rzecz czy dużo? Wpisz do tabeli.', 'Одна вещь или много? Впиши в таблицу.',
    `<div class="pool">dom · domy · kot · ławki · dziecko · dzieci · szkoła · okna</div>
     <table class="sort"><tr><th>jedna <span class="ru">одна</span></th><th>dużo <span class="ru">много</span></th></tr><tr><td></td><td></td></tr></table>`)}
  ${task(4, 'Co jest w twojej klasie?', 'Что есть в твоём классе? Напиши во множественном числе.',
    `<div class="fillrow">W klasie są: ${bl(30)}, ${bl(30)}</div>
     <div class="fillrow">i ${bl(40)}.</div>`)}
  ${say('To jest książka. To są książki.', 'Это книга. Это книги.')}
  ${umiem([
    ['rozpoznać rodzaj: ten, ta, to', 'узнать род: ten, ta, to'],
    ['zrobić liczbę mnogą: kot → koty', 'образовать множественное число'],
    ['powiedzieć to jest / to są', 'сказать to jest / to są'],
  ])}
</section>`,
]

const L24 = [
`<section class="page">
  ${head(24, 'Wielka czy mała litera?', 'Большая или маленькая буква?')}
  ${sec('Wielką literą', 'С большой буквы')}
  ${vocab([
    ['✏️', 'początek zdania', '', 'начало предложения'],
    ['🙋', 'Ola, Artem, Kowalski', '', 'имена и фамилии'],
    ['🏙️', 'Warszawa, Kraków, Kijów', '', 'города'],
    ['🌍', 'Polska, Ukraina', '', 'страны'],
    ['🌊', 'Wisła, Dniepr', '', 'реки'],
    ['🛣️', 'ulica Kwiatowa', '', 'названия улиц'],
    ['🧑', 'Polak, Polka, Ukrainiec, Ukrainka (!)', '', 'жители стран (!)'],
  ], 1)}
  ${sec('Małą literą', 'С маленькой буквы')}
  ${vocab([
    ['📅', 'poniedziałek, sobota', '', 'дни недели'],
    ['🗓️', 'styczeń, maj', '', 'месяцы'],
    ['💬', 'język polski, po ukraińsku', '', 'языки'],
    ['🐈', 'kot, szkoła, miasto', '', 'обычные слова'],
  ], 1)}
  ${box(`<p class="ru"><b>Почти как в русском!</b> Но одно отличие: жители стран пишутся <b>с большой буквы</b>: <b>Polak, Ukrainiec</b> (по-русски «поляк, украинец» - с маленькой).</p>
    <p class="ru">В классе это называется: <b>nazwy własne</b> (имена собственные) - wielką literą, <b>nazwy pospolite</b> (нарицательные) - małą.</p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Otocz kółkiem dobry zapis.', 'Обведи правильное написание.',
    `<div class="odd big">
      <div>Polska / polska · Warszawa / warszawa</div>
      <div>Poniedziałek / poniedziałek · Polak / polak</div>
      <div>Język polski / język polski · Wisła / wisła</div>
    </div>`)}
  ${task(2, 'Wpisz literę: wielką czy małą?', 'Впиши букву: большую или маленькую?',
    `<div class="gaps"><span class="gap"></span>arszawa · <span class="gap"></span>oniedziałek · <span class="gap"></span>la · <span class="gap"></span>krainka<br>
     <span class="gap"></span>isła · <span class="gap"></span>uty · <span class="gap"></span>ot · <span class="gap"></span>raków</div>
     <p class="ru small">Это слова: Варшава, понедельник, Оля, украинка, Висла, февраль, кот, Краков</p>`)}
  ${task(3, 'Przepisz poprawnie.', 'Перепиши правильно.',
    `<p class="big-read">ola mieszka w krakowie. w sobotę jedzie nad wisłę.</p>${lines(2)}`)}
  ${task(4, 'Napisz o sobie.', 'Напиши о себе. Не забудь большие буквы!',
    `<div class="fillrow">Mam na imię ${bl(40)}.</div>
     <div class="fillrow">Mieszkam w ${bl(42)}. <span class="ru">(город)</span></div>
     <div class="fillrow">Jestem z ${bl(44)}. <span class="ru">(страна)</span></div>`)}
  ${say('Polska, Warszawa, Wisła - wielką literą. Poniedziałek - małą.', 'Объясни учителю, что пишем с большой буквы.')}
  ${umiem([
    ['wiem, co piszemy wielką literą', 'знаю, что пишется с большой буквы'],
    ['Polak, Ukrainiec - wielką literą', 'жителей стран - с большой буквы'],
    ['dni i miesiące - małą literą', 'дни и месяцы - с маленькой'],
  ])}
</section>`,
]

const wzrost = `
<svg class="wzrost" viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial" font-size="6.5" text-anchor="middle">
  <line x1="2" y1="60" x2="118" y2="60" stroke="#999" stroke-width="0.8"/>
  ${[[20, 34, 'Kuba'], [60, 18, 'Artem'], [100, 44, 'Tomek']].map(([x, top, imie]) => `
    <circle cx="${x}" cy="${top + 5}" r="5" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <rect x="${x - 6}" y="${top + 11}" width="12" height="${60 - top - 11}" rx="3" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <text x="${x}" y="68">${imie}</text>`).join('')}
</svg>`

const L25 = [
`<section class="page">
  ${head(25, 'Duży, większy, największy', 'Степени сравнения прилагательных')}
  <p class="ru"><b>przymiotnik</b> (прилагательное) отвечает на вопрос <b>jaki?</b> Его можно сравнивать - как в русском: большой - больше - самый большой.</p>
  <table class="pm stop">
    <tr><th>jaki?</th><th>bardziej <span class="ru">(сравн.)</span></th><th>najbardziej <span class="ru">(самый)</span></th></tr>
    <tr><td>stary</td><td>star<b>szy</b></td><td><b>naj</b>starszy</td></tr>
    <tr><td>młody</td><td>młod<b>szy</b></td><td><b>naj</b>młodszy</td></tr>
    <tr><td>szybki</td><td>szyb<b>szy</b></td><td><b>naj</b>szybszy</td></tr>
    <tr><td>ładny</td><td>ładn<b>iejszy</b></td><td><b>naj</b>ładniejszy</td></tr>
    <tr><td>wysoki</td><td>wyż<b>szy</b></td><td><b>naj</b>wyższy</td></tr>
    <tr><td><b>duży</b> (!)</td><td><b>większy</b></td><td><b>największy</b></td></tr>
    <tr><td><b>mały</b> (!)</td><td><b>mniejszy</b></td><td><b>najmniejszy</b></td></tr>
    <tr><td><b>dobry</b> (!)</td><td><b>lepszy</b></td><td><b>najlepszy</b></td></tr>
    <tr><td><b>zły</b> (!)</td><td><b>gorszy</b></td><td><b>najgorszy</b></td></tr>
  </table>
  ${box(`<p><b>Słoń jest większy niż koń.</b> <span class="ru">Слон больше, чем лошадь. <b>niż</b> [ниж] = чем.</span></p>
    <p class="ru"><b>naj-</b> = самый: <b>najlepszy</b> = самый лучший. Слова с (!) надо выучить - как «хороший - лучше» в русском.</p>
    <p class="ru">Длинные слова: <b>bardziej</b> kolorowy (более цветной), <b>najbardziej</b> kolorowy (самый цветной).</p>`)}
</section>`,
`<section class="page">
  ${task(1, 'Uzupełnij tabelę.', 'Дополни таблицу.',
    `<table class="pm stop fillt">
      <tr><td>młody</td><td>młodszy</td><td>${bl(30)}</td></tr>
      <tr><td>szybki</td><td>${bl(26)}</td><td>najszybszy</td></tr>
      <tr><td>stary</td><td>${bl(26)}</td><td>${bl(30)}</td></tr>
      <tr><td>mały</td><td>${bl(26)}</td><td>${bl(30)}</td></tr>
      <tr><td>dobry</td><td>${bl(26)}</td><td>${bl(30)}</td></tr>
    </table>`)}
  ${task(2, 'Porównaj. Użyj: większy, szybszy, starszy.', 'Сравни.',
    `<div class="fillrow">🐘 🐭 Słoń jest ${bl(28)} niż mysz.</div>
     <div class="fillrow">🐇 🐢 Królik jest ${bl(28)} niż żółw.</div>
     <div class="fillrow">👴 👦 Dziadek jest ${bl(28)} niż wnuk <span class="ru">(внук)</span>.</div>`)}
  ${task(3, 'Kto jest najwyższy, a kto najniższy?', 'Кто самый высокий, а кто самый низкий?',
    `<div class="mapwrap">${wzrost}
      <div>
        <div class="fillrow">Najwyższy jest ${bl(22)}.</div>
        <div class="fillrow">Najniższy jest ${bl(22)}.</div>
        <div class="fillrow">Kuba jest ${bl(18)} niż Tomek.</div>
      </div></div>`)}
</section>`,
`<section class="page">
  ${task(4, 'Napisz o sobie.', 'Напиши о себе.',
    `<div class="fillrow">Najlepszy dzień tygodnia to ${bl(40)}.</div>
     <div class="fillrow">Najsmaczniejsze jedzenie to ${bl(38)}.</div>
     <div class="fillrow">Mój najlepszy kolega to ${bl(42)}.</div>`)}
  ${say('Słoń jest większy niż koń. Wieloryb jest największy.', 'Слон больше лошади. Кит самый большой.')}
  ${umiem([
    ['porównać: większy niż …', 'сравнить: больше, чем …'],
    ['powiedzieć: najlepszy, największy', 'сказать: самый лучший, самый большой'],
    ['znam lepszy, gorszy, większy, mniejszy', 'знаю особые формы'],
  ])}
</section>`,
]

const L26 = [
`<section class="page">
  ${head(26, 'Opis przedmiotu', 'Описание предмета')}
  ${sec('Kształt', 'Форма')}
  ${vocab([
    ['⚪', 'okrągły', 'окронгўы', 'круглый'],
    ['⬜', 'kwadratowy', 'квадратовы', 'квадратный'],
    ['▭', 'prostokątny', 'простоконтны', 'прямоугольный'],
    ['🔺', 'trójkątny', 'труйконтны', 'треугольный'],
  ])}
  ${sec('Z czego jest?', 'Из чего он?')}
  ${vocab([
    ['🪵', 'drewniany = z drewna', 'древняны', 'деревянный'],
    ['🧴', 'plastikowy = z plastiku', 'пластиковы', 'пластиковый'],
    ['🔩', 'metalowy = z metalu', 'металёвы', 'металлический'],
    ['🥛', 'szklany = ze szkła', 'шкляны', 'стеклянный'],
    ['📄', 'papierowy = z papieru', 'папьеровы', 'бумажный'],
    ['🧵', 'z materiału', 'з матэрьяўу', 'из ткани'],
  ])}
  ${sec('Jaki jest?', 'Какой он?')}
  ${vocab([
    ['🪶', 'lekki / ciężki', 'лекки / ченжки', 'лёгкий / тяжёлый'],
    ['🧸', 'miękki / twardy', 'мьенкки / тварды', 'мягкий / твёрдый'],
    ['📏', 'długi / krótki', 'дўуги / крутки', 'длинный / короткий'],
    ['🙂', 'wygodny', 'выгодны', 'удобный'],
  ])}
  <p class="small"><b>Służy do …</b> <span class="ru">= Служит для … (для чего он)</span> · <b>Plecak służy do noszenia książek.</b> <span class="ru">Рюкзак нужен, чтобы носить книги.</span></p>
</section>`,
`<section class="page">
  ${box(`<p class="ru">В 4 классе пишут <b>opis przedmiotu</b>. План:</p>
    <ol class="ru rules"><li><b>Co to jest?</b> - что это</li><li><b>Jak wygląda?</b> - kształt, kolor, wielkość (форма, цвет, размер)</li><li><b>Z czego jest?</b> - из чего</li><li><b>Do czego służy?</b> - для чего</li><li><b>Dlaczego go lubię?</b> - почему он мне нравится</li></ol>`, 'Plan opisu')}
  ${task(1, 'Przeczytaj opis i odpowiedz.', 'Прочитай описание и ответь.',
    `<p class="big-read">To jest mój plecak. Jest duży i niebieski. Jest z materiału. Ma dwie kieszenie <span class="ru">(два кармана)</span>. Służy do noszenia książek. Lubię go, bo jest wygodny.</p>
     <div class="fillrow">Jaki ma kolor? ${bl(50)}</div>
     <div class="fillrow">Z czego jest? ${bl(52)}</div>
     <div class="fillrow">Do czego służy? ${bl(48)}</div>`)}
  ${task(2, 'Połącz.', 'Соедини.',
    match(['drewniany', 'plastikowy', 'metalowy', 'szklany', 'papierowy'], ['стеклянный', 'бумажный', 'деревянный', 'металлический', 'пластиковый']))}
</section>`,
`<section class="page">
  ${task(3, 'Jaki kształt? Uzupełnij.', 'Какая форма? Слова: okrągły, prostokątny, trójkątny',
    `<div class="fillrow">🕐 Zegar jest ${bl(34)}.</div>
     <div class="fillrow">📱 Telefon jest ${bl(34)}.</div>
     <div class="fillrow">⚠️ Ten znak jest ${bl(34)}.</div>`)}
  ${task(4, 'Opisz swój piórnik albo plecak.', 'Опиши свой пенал или рюкзак по плану.',
    `<div class="fillrow">To jest mój ${bl(40)}.</div>
     <div class="fillrow">Jest ${bl(26)} i ${bl(26)}.</div>
     <div class="fillrow">Jest z ${bl(40)}.</div>
     <div class="fillrow">Służy do ${bl(52)}.</div>
     <div class="fillrow">Lubię go, bo ${bl(48)}.</div>`)}
  ${say('To jest mój piórnik. Jest mały i czarny. Jest z plastiku.', 'Опиши свой пенал учителю.')}
  ${umiem([
    ['nazwać kształt i materiał', 'назвать форму и материал'],
    ['powiedzieć, do czego coś służy', 'сказать, для чего это нужно'],
    ['napisać krótki opis przedmiotu', 'написать короткое описание предмета'],
  ])}
</section>`,
]

const L27 = [
`<section class="page">
  ${head(27, 'Ó czy u?', 'Ó или u? Орфография')}
  <p class="ru"><b>ó</b> и <b>u</b> читаются одинаково - [у]. Поляки тоже путают! Вот правила:</p>
  ${box(`<p><b>1. ó</b>, если в другом слове слышно <b>o</b>:</p>
    <p>st<b>ó</b>ł - st<b>o</b>ły · r<b>ó</b>g - r<b>o</b>gi · m<b>ó</b>j - m<b>o</b>ja · l<b>ó</b>d - l<b>o</b>dy · n<b>ó</b>ż - n<b>o</b>że</p>`, 'Ó wymienia się na o')}
  ${box(`<p><b>2. ó</b> в окончании <b>-ów</b> (много кого/чего):</p>
    <p>dom<b>ów</b> · kot<b>ów</b> · zeszyt<b>ów</b> · chłopc<b>ów</b></p>`, 'Końcówka -ów')}
  ${box(`<p><b>3. u</b> в начале слова: <b>u</b>cho, <b>u</b>lica, <b>u</b>czeń</p>
    <p><b>4. u</b> в окончаниях <b>-uje, -unek, -uch, -usz</b>: mal<b>uje</b>, rys<b>unek</b>, mal<b>uch</b>, kapel<b>usz</b></p>`, 'Kiedy u?')}
  <p class="ru small">Если правило не помогает - проверь в словаре (<b>słownik ortograficzny</b>).</p>
</section>`,
`<section class="page">
  ${task(1, 'Wpisz ó albo u.', 'Впиши ó или u.',
    `<div class="gaps">st<span class="gap"></span>ł · r<span class="gap"></span>g · m<span class="gap"></span>j · l<span class="gap"></span>d · n<span class="gap"></span>ż<br>
     <span class="gap"></span>cho · <span class="gap"></span>lica · mal<span class="gap"></span>je · rys<span class="gap"></span>nek · kot<span class="gap"></span>w</div>`)}
  ${task(2, 'Udowodnij: dlaczego ó?', 'Докажи: почему ó? Напиши слово с o.',
    `<div class="fill2">
      <div>stół, bo ${bl(26)}</div><div>nóż, bo ${bl(26)}</div>
      <div>lód, bo ${bl(26)}</div><div>róg, bo ${bl(26)}</div>
    </div>`)}
  ${task(3, 'Otocz kółkiem dobry zapis.', 'Обведи правильное написание.',
    `<div class="odd big">
      <div>stół / stuł · ucho / ócho · rysunek / rysónek</div>
      <div>kotów / kotuw · mój / muj · maluje / malóje</div>
    </div>`)}
  ${say('Stół piszę przez ó, bo stoły.', 'Объясни учителю, почему в слове stół пишем ó.')}
  ${umiem([
    ['ó wymienia się na o: stół - stoły', 'ó чередуется с o'],
    ['-ów na końcu: kotów, domów', 'окончание -ów'],
    ['u na początku i w -uje, -unek', 'u в начале и в -uje, -unek'],
  ])}
</section>`,
]

const L28 = [
`<section class="page">
  ${head(28, 'Ogłoszenie', 'Объявление')}
  ${vocab([
    ['😟', 'Zgubiłem / Zgubiłam', 'згубиўэм', 'Я потерял / потеряла'],
    ['🔍', 'Znalazłem / Znalazłam', 'зналязўэм', 'Я нашёл / нашла'],
    ['💰', 'Sprzedam', 'спшэдам', 'Продам'],
    ['🛒', 'Kupię', 'купе', 'Куплю'],
    ['🔄', 'Zamienię', 'замене', 'Обменяю'],
    ['👀', 'Szukam', 'шукам', 'Ищу'],
    ['🎁', 'nagroda', 'награда', 'награда'],
    ['📞', 'kontakt / telefon', 'контакт / тэлефон', 'контакт / телефон'],
  ])}
  ${box(`<p class="ru">Объявление коротко отвечает на вопросы: <b>Co?</b> (что) · <b>Gdzie?</b> (где) · <b>Kiedy?</b> (когда) · <b>Jaki?</b> (какой) · <b>Kontakt</b> (как связаться).</p>`)}
  <div class="ogl">
    <div class="ogl-t">ZGUBIŁEM PLECAK!</div>
    <p>W piątek na boisku zgubiłem niebieski plecak. W środku są książki i piórnik. Znalazca dostanie nagrodę!</p>
    <p><b>Kontakt:</b> Artem, klasa 4a</p>
  </div>
  <p class="ru small">W środku - внутри · znalazca - тот, кто найдёт · dostanie - получит</p>
  <div class="ogl">
    <div class="ogl-t">SPRZEDAM ROWER</div>
    <p>Czerwony, prawie nowy <span class="ru">(почти новый)</span>. Cena: 200 zł.</p>
    <p><b>Kontakt:</b> Tomek, klasa 5b</p>
  </div>
</section>`,
`<section class="page">
  ${task(1, 'Połącz.', 'Соедини.',
    match(['Zgubiłem', 'Znalazłem', 'Sprzedam', 'Kupię', 'Szukam', 'nagroda'], ['Ищу', 'награда', 'Я потерял', 'Куплю', 'Я нашёл', 'Продам']))}
  ${task(2, 'Przeczytaj pierwsze ogłoszenie i odpowiedz.', 'Прочитай первое объявление и ответь.',
    `<div class="fillrow">Co zgubił Artem? ${bl(48)}</div>
     <div class="fillrow">Kiedy? ${bl(30)} &nbsp; Gdzie? ${bl(30)}</div>
     <div class="fillrow">Jaki jest plecak? ${bl(44)}</div>`)}
  ${task(3, 'Napisz ogłoszenie.', 'Напиши объявление: ты потерял шапку или продаёшь самокат.',
    `<div class="ogl pisz">
      <div class="fillrow"><b>${bl(60)}</b> <span class="ru">(Zgubiłem … / Sprzedam …)</span></div>
      <div class="fillrow">Kiedy? Gdzie? Jaki? ${bl(60)}</div>
      ${lines(2)}
      <div class="fillrow"><b>Kontakt:</b> ${bl(60)}</div>
    </div>`)}
  ${say('Zgubiłem plecak. Jest niebieski.', 'Скажи учителю своё объявление.')}
  ${umiem([
    ['przeczytać krótkie ogłoszenie', 'прочитать короткое объявление'],
    ['znam zgubiłem, sprzedam, szukam', 'знаю zgubiłem, sprzedam, szukam'],
    ['napisać ogłoszenie', 'написать объявление'],
  ])}
</section>`,
]

const powtorka5 = [
`<section class="page">
  ${head('✓', 'Powtórka 5', 'Повторение 5 - темы 23-28')}
  <p class="ru">Сделай сам, без подсказок. Потом покажи учителю - он проверит и поставит баллы.</p>
  <div class="score">
    <div>Punkty <span class="ru">/ Баллы</span>: <span class="scorebox"></span> / 20</div>
    <div>Podpis <span class="ru">/ Подпись</span>: ${bl(30)}</div>
  </div>
  ${task(1, 'Wpisz: ten, ta czy to?', '(4 п.)',
    `<div class="fill2">${['kot', 'okno', 'szkoła', 'długopis'].map(w => `<div>${bl(14)} ${w}</div>`).join('')}</div>`)}
  ${task(2, 'Napisz liczbę mnogą.', 'Множественное число. (4 п.)',
    `<div class="fill2"><div>zeszyt → ${bl(24)}</div><div>mama → ${bl(24)}</div><div>okno → ${bl(24)}</div><div>noga → ${bl(24)}</div></div>`)}
  ${task(3, 'Wielka czy mała litera?', 'Впиши букву. (3 п.)',
    `<div class="gaps"><span class="gap"></span>olska · <span class="gap"></span>oniedziałek · <span class="gap"></span>arszawa</div>`)}
</section>`,
`<section class="page cont">
  ${task(4, 'Napisz: większy, lepszy…', 'Сравнительная степень. (3 п.)',
    `<div class="fill2"><div>duży → ${bl(26)}</div><div>dobry → ${bl(26)}</div><div>mały → ${bl(26)}</div></div>`)}
  ${task(5, 'Wpisz ó albo u.', '(4 п.)',
    `<div class="gaps">st<span class="gap"></span>ł · <span class="gap"></span>cho · r<span class="gap"></span>g · mal<span class="gap"></span>je</div>`)}
  ${task(6, 'Z czego jest?', 'Из чего? (2 п.)',
    `<div class="fillrow">drewniany = z ${bl(30)} &nbsp; szklany = ze ${bl(30)}</div>`)}
</section>`,
]

const klucz5 = `
<section class="page key dense">
  ${head('🔑', 'Klucz odpowiedzi', 'Ответы - проверь себя')}
  <p class="ru small">Проверь и исправь ошибки другим цветом. Задания «напиши о себе» проверяет учитель.</p>
  <h4>Temat 23</h4>
  <p>1: ten kot, ta książka, to okno, ten długopis, ta szkoła, to jabłko, ten plecak, ta mama<br>
  2: zeszyty, mamy, okna, książki, nogi, krzesła, dzieci<br>
  3: jedna: dom, kot, dziecko, szkoła · dużo: domy, ławki, dzieci, okna</p>
  <h4>Temat 24</h4>
  <p>1: Polska, Warszawa, poniedziałek, Polak, język polski, Wisła<br>
  2: Warszawa, poniedziałek, Ola, Ukrainka, Wisła, luty, kot, Kraków<br>
  3: Ola mieszka w Krakowie. W sobotę jedzie nad Wisłę.</p>
  <h4>Temat 25</h4>
  <p>1: najmłodszy · szybszy · starszy, najstarszy · mniejszy, najmniejszy · lepszy, najlepszy<br>
  2: większy, szybszy, starszy<br>
  3: Najwyższy jest Artem. Najniższy jest Tomek. Kuba jest wyższy niż Tomek.</p>
  <h4>Temat 26</h4>
  <p>1: niebieski · z materiału · do noszenia książek<br>
  2: drewniany - деревянный, plastikowy - пластиковый, metalowy - металлический, szklany - стеклянный, papierowy - бумажный<br>
  3: okrągły, prostokątny, trójkątny</p>
  <h4>Temat 27</h4>
  <p>1: stół, róg, mój, lód, nóż, ucho, ulica, maluje, rysunek, kotów<br>
  2: stoły, noże, lody, rogi<br>
  3: stół, ucho, rysunek, kotów, mój, maluje</p>
  <h4>Temat 28</h4>
  <p>1: Zgubiłem - Я потерял, Znalazłem - Я нашёл, Sprzedam - Продам, Kupię - Куплю, Szukam - Ищу, nagroda - награда<br>
  2: plecak · w piątek · na boisku · niebieski</p>
</section>`

const tematy5 = ['23. Rzeczownik: ten, ta, to', '24. Wielka czy mała litera?', '25. Duży, większy, największy', '26. Opis przedmiotu', '27. Ó czy u?', '28. Ogłoszenie', 'Powtórka 5']

const dyplom5 = dyplom
  .replace('ukończył(a) zeszyt<br>', 'ukończył(a) część 5 zeszytu<br>')
  .replace('окончил(а) тетрадь «Мой польский с нуля»', 'окончил(а) часть 5 тетради «Мой польский с нуля»')

export function czesc5() {
  return [
    okladka(5, 'Tematy 23-28 · klasa 4'), stronaStartu(tematy5), stronaPolecen('Przypomnij sobie polecenia', 'Вспомни задания'),
    ...[L23, L24, L25, L26, L27, L28].flatMap(ciag), ...powtorka5, dyplom5, klucz5,
  ]
}
