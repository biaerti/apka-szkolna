# Klasa 5, lekcja 31: Autorytet czy idol? Dedykacja (NEON s. 107, 113, 123). Przyklady wlasne.
from zbuduj import *

TYTUL = 'Autorytet czy idol?'
EMO = '🧭⭐💌'
KOLOR = '#1B8A8F'
PORT = 9421

SCENY = [
    intro(
        'Cześć! Kogo podziwiacie? Może piłkarza, piosenkarkę albo youtubera? A kogo pytacie o radę, kiedy macie trudny '
        'wybór? Często to zupełnie inne osoby. Dziś wyjaśnimy, czym różni się autorytet od idola. Poznacie też '
        'dedykację, czyli kilka słów, które autor pisze dla kogoś wyjątkowego. Czekają na was trzy zadania. '
        'Przygotujcie zeszyty!',
        'Autorytet czy idol?',
        [('🧭 autorytet', 'autorytet'), ('⭐ idol', 'idola'), ('💌 dedykacja', 'dedykację')],
    ),
    teoria(
        'autorytet',
        'Autorytet to osoba, którą szanujemy i której ufamy. Szanujemy ją za wiedzę, mądrość, uczciwość albo za to, '
        'jak traktuje innych. Chcemy postępować tak jak ona. Autorytet nie musi być sławny. Może nim być babcia, '
        'trener, lekarka, pani od muzyki albo starszy brat. To wzór na co dzień. Pomaga nam wybrać, co jest dobre.',
        (1, 'AUTORYTET'), 'Kto to jest autorytet? 🧭',
        karta('AUTORYTET', 'osoba, którą szanujemy i której ufamy - chcemy postępować tak jak ona', 'szanujemy', 'var(--ak)'),
        chipy(chip('📚 wiedza', 'wiedzę', 'var(--fiolet)'), chip('🦉 mądrość', 'mądrość', 'var(--fiolet)'),
              chip('🤝 uczciwość', 'uczciwość', 'var(--fiolet)')),
        rzad(
            karta('babcia', '', 'babcia', emo='👵'),
            karta('trener', '', 'trener', emo='⚽'),
            karta('lekarka', '', 'lekarka', emo='🩺'),
            karta('pani od muzyki', '', 'muzyki', emo='🎻'),
        ),
        chipy(chip('🧭 nie musi być sławny · wzór na co dzień', 'wzór', 'var(--ak)')),
    ),
    teoria(
        'idol',
        'Idol to ktoś, kogo podziwiamy, często bardzo sławny. Gwiazda muzyki, aktor, sportowiec, influencer. Fani '
        'zbierają jego zdjęcia, noszą takie same ubrania, czeszą się podobnie. Idola zwykle znamy tylko z ekranu. '
        'Podziwiamy go za talent, sukces, wygląd albo popularność. Czy idol może być też autorytetem? Tak, jeśli '
        'szanujemy go nie tylko za sławę, ale za to, jak postępuje. Na przykład sportowiec, który ciężko trenuje, '
        'gra uczciwie i pomaga innym.',
        (2, 'IDOL'), 'Kto to jest idol? ⭐',
        karta('IDOL', 'ktoś, kogo podziwiamy - często za sławę, talent, wygląd', 'podziwiamy', 'var(--fiolet)'),
        chipy(chip('🎤 gwiazda muzyki', 'muzyki', 'var(--fiolet)'), chip('🎬 aktor', 'aktor', 'var(--fiolet)'),
              chip('🏅 sportowiec', 'sportowiec', 'var(--fiolet)'), chip('📱 influencer', 'influencer', 'var(--fiolet)')),
        lista(
            linia('👕 takie same ubrania, podobna fryzura', 'ubrania'),
            linia('📺 znamy go zwykle tylko z ekranu', 'ekranu'),
            linia('⭐ + 🧭 idol bywa autorytetem, gdy dobrze <b class="ak">postępuje</b>', 'postępuje'),
            szer=900,
        ),
    ),
]

AUT, IDOL = ('🧭 autorytet', 'var(--ak)'), ('⭐ idol', 'var(--fiolet)')
Z1 = zadanie(
    1,
    'Zadanie pierwsze. Przeczytaj pięć sytuacji. Przy każdym numerze zapisz w zeszycie: autorytet albo idol. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'IDOL'), 'Autorytet czy idol?',
    [
        zad('Kuba ściął włosy tak jak jego ulubiony raper.', 'idol', kolor='var(--fiolet)'),
        zad('Ola pyta babcię o radę, bo babcia zawsze mówi prawdę.', 'autorytet', kolor='var(--ak)'),
        zad('Tłum fanów czeka pod hotelem na piosenkarkę.', 'idol', kolor='var(--fiolet)'),
        zad('Trener uczy, jak przegrywać z klasą, i sam tak robi.', 'autorytet', kolor='var(--ak)'),
        zad('Maja kupiła taką samą bluzę jak jej ulubiona youtuberka.', 'idol', kolor='var(--fiolet)'),
    ],
    pokaz='sytuacji', opcje=[AUT, IDOL],
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Pierwsze to idol, bo Kuba naśladuje wygląd rapera. Drugie to autorytet, bo Ola ufa mądrości '
        'babci. Trzecie to idol, bo fani podziwiają sławę piosenkarki. Czwarte to autorytet, bo trener sam daje dobry '
        'przykład. Piąte to idol, bo Maja kopiuje ubranie youtuberki.',
        Z1, ['idol', 'autorytet', 'idol', 'autorytet', 'idol']),
    teoria(
        'test',
        'Jak sprawdzić, czy ktoś może być dla was autorytetem? Zadajcie sobie cztery pytania. Czy ta osoba mówi prawdę? '
        'Czy szanuje innych ludzi? Czy robi to, co mówi? I czy przy niej staję się lepszy? Jeśli na wszystkie '
        'odpowiadacie tak, to dobry wzór. Sława nie ma tu znaczenia. Liczy się to, jak człowiek postępuje.',
        (2, 'IDOL'), 'Test na autorytet ✅',
        lista(
            linia('✅ Czy mówi prawdę?', 'prawdę'),
            linia('✅ Czy szanuje innych ludzi?', 'szanuje'),
            linia('✅ Czy robi to, co mówi?', 'robi'),
            linia('✅ Czy przy niej staję się lepszy?', 'lepszy'),
            szer=760,
        ),
        chipy(chip('⭐ sława nie ma znaczenia', 'sława', 'var(--roz)'), chip('🧭 liczy się, jak postępuje', 'liczy', 'var(--ak)')),
    ),
]

P, F = ('✅ prawda', 'var(--zielony)'), ('❌ fałsz', 'var(--roz)')
Z2 = zadanie(
    2,
    'Zadanie drugie. Przeczytaj pięć zdań o autorytetach i idolach. Przy każdym numerze zapisz: prawda albo fałsz. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'IDOL'), 'Prawda czy fałsz?',
    [
        zad('Autorytet musi być sławny.', 'fałsz', 'może to być babcia', kolor='var(--roz)'),
        zad('Autorytetem może być ktoś z rodziny.', 'prawda'),
        zad('Idola często podziwiamy za sławę i wygląd.', 'prawda'),
        zad('Autorytet zachęca nas, żeby być lepszym.', 'prawda'),
        zad('Idol zawsze jest złym wzorem.', 'fałsz', 'może dobrze postępować', kolor='var(--roz)'),
    ],
    pokaz='zdań', opcje=[P, F],
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Pierwsze to fałsz. Autorytet nie musi być sławny, może nim być na przykład babcia. Drugie to '
        'prawda. Trzecie też prawda, bo idola często podziwiamy za sławę. Czwarte prawda, bo przy autorytecie chcemy '
        'być lepsi. Piąte to fałsz. Idol też może dobrze postępować i wtedy jest dobrym wzorem.',
        Z2, ['fałsz', 'prawda', 'prawda', 'prawda', 'fałsz']),
    teoria(
        'dedykacja',
        'Teraz coś zupełnie innego. Czasem na pierwszych stronach książki, przed samym tekstem, jest krótki napis. Na '
        'przykład: Dla mojej siostry Zosi, która zawsze we mnie wierzyła. To dedykacja. Dedykacja to zapis '
        'poprzedzający tekst utworu. Mówi, komu autor poświęca swoje dzieło. Zwykle są to osoby dla autora ważne, '
        'czasem właśnie jego autorytety. Dedykację możemy też wpisać do książki, którą dajemy komuś w prezencie.',
        (3, 'DEDYKACJA'), 'Dedykacja 💌',
        karta('<i>Dla mojej siostry Zosi,<br>która zawsze we mnie wierzyła</i>', '', 'Zosi', 'var(--fiolet)', emo='📖',
              styl='width:720px;margin:14px auto 0'),
        karta('DEDYKACJA = zapis przed tekstem utworu', 'mówi, komu autor poświęca swoje dzieło', 'poświęca', 'var(--ak)',
              styl='margin-top:16px'),
        chipy(chip('📖 przed tekstem', 'poprzedzający', 'var(--ak)'), chip('💝 dla ważnej osoby', 'ważne', 'var(--fiolet)'),
              chip('🎁 w książce na prezent', 'prezencie', 'var(--zielony)')),
    ),
]

DED = 'var(--ak)'
Z3 = zadanie(
    3,
    'Zadanie trzecie. Oto pięć napisów z różnych stron książki. Które z nich to dedykacje? Zapisz w zeszycie ich '
    'numery. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'DEDYKACJA'), 'Które napisy to dedykacje? Zapisz numery.',
    [
        zad('Rozdział pierwszy. Tajemnicza paczka', 'nie', 'tytuł rozdziału', kolor='var(--szary)'),
        zad('<i>Dla Antka, który nauczył mnie jeździć na rowerze</i>', 'dedykacja', kolor=DED),
        zad('Była zimna, listopadowa noc.', 'nie', 'początek opowieści', kolor='var(--szary)'),
        zad('<i>Mojemu dziadkowi - pierwszemu bohaterowi mojego życia</i>', 'dedykacja', kolor=DED),
        zad('Spis treści', 'nie', kolor='var(--szary)'),
    ],
    pokaz='napisów',
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Dedykacje to numer dwa i numer cztery. Oba napisy mówią, komu autor poświęca książkę: Antkowi '
        'i dziadkowi. Numer jeden to tytuł rozdziału. Numer trzy to pierwsze zdanie opowieści, a numer pięć to spis '
        'treści. Dedykację poznasz po tym, że jest skierowana do konkretnej osoby.',
        Z3, ['jeden', 'dwa', 'trzy', 'cztery', 'pięć']),
    zapamietaj(
        'Zapamiętaj! Autorytet to osoba, którą szanujemy i której ufamy, bo dobrze postępuje. Chcemy brać z niej '
        'przykład. Idol to ktoś, kogo podziwiamy, często za sławę, talent albo wygląd. Idol może być też autorytetem, '
        'jeśli jest dobrym wzorem. Dedykacja to zapis przed tekstem utworu. Mówi, komu autor poświęca swoje dzieło. '
        'Brawo!',
        [
            ('🧭 autorytet - szanujemy go i ufamy mu, bierzemy z niego przykład', 'szanujemy'),
            ('⭐ idol - podziwiamy go, często za sławę, talent, wygląd', 'podziwiamy'),
            ('🤝 idol, który jest dobrym wzorem, bywa autorytetem', 'wzorem'),
            ('💌 dedykacja - zapis przed tekstem: komu autor poświęca dzieło', 'dedykacja'),
        ],
    ),
]
