# Pomocnik VULCAN

Dodatek korzysta z już zalogowanej karty VULCANA. Nie zna, nie odczytuje i nie przechowuje hasła.

## Instalacja w Chrome

1. Otwórz `chrome://extensions`.
2. Włącz **Tryb dewelopera**.
3. Kliknij **Załaduj rozpakowane** i wskaż folder `vulcan-extension`.
4. Odśwież kartę `szkola.klippi.pl` oraz kartę VULCANA.

Wersja 0.3 czyta też frekwencję Z VULCANA do apki: sprawdź obecność w VULCANIE,
zostaw tę kartę otwartą na widoku frekwencji, a w apce (koło na lekcji ->
„Obecność” albo Dziennik lekcji) kliknij „Pobierz z VULCANA” - nieobecni i
spóźnieni zaznaczą się sami i od razu wypadną z koła.

Wersja 0.2 potrafi również odczytać widoczne w lewym drzewie godziny VULCANA.
Na ekranie „Dziennik lekcji” użyj „Pobierz z VULCANA”. Rozwiń wcześniej dni,
które chcesz pobrać. Dzięki temu zastępstwa i dwie kolejne lekcje tej samej
klasy są przypisane do właściwego numeru godziny.

## Przebieg

1. Na pulpicie Apki szkolnej kliknij konkretną godzinę.
2. Wybierz materiał lekcji i ustaw `.`, `-` albo `s` przy uczniach.
3. Kliknij **Wyślij do VULCANA**.
4. W karcie VULCANA pomocnik najpierw uzupełni opis bez zapisu.
5. Po sprawdzeniu kliknij w pomocniku zapis opisu, a potem osobno zatwierdzenie frekwencji.

VULCAN zmienia czasem strukturę strony. Jeżeli pomocnik nie rozpozna kontrolki, zatrzyma się i poda nazwę kroku, który trzeba dokończyć ręcznie. Nie klika dalej „na ślepo”.

## Uwagi (wersja 0.4)

1. Uwaga wpisana z telefonu (widok Sala) wyskakuje na komputerze jako popup.
   Kliknij **Wpisz do VULCANA** (to samo jest w zakładce Uwagi: „Do VULCANA”).
2. Pomocnik w karcie VULCANA otwiera lekcję z drzewa (dzień i numer godziny),
   zakładkę „Uwagi”, klika „Dodaj”, wyszukuje ucznia, przenosi go strzałką do
   „Dotyczy”, ustawia kategorię i treść. **Nie klika Zapisz.**
3. Sprawdź formularz i kliknij Zapisz w VULCANIE. Pomocnik zauważy zniknięcie
   okna i odhaczy uwagę w apce jako wpisaną. Gdyby nie zauważył, kliknij w panelu
   „Zapisałem w VULCANIE”.
