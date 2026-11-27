// Ekran startowy kursu: seria, XP i poziom na gorze, karta "Teraz" (nastepna
// lekcja albo kiedy sie otworzy), powtorka slow i mapa dzialow jako sciezka lekcji.

import clsx from 'clsx';
import { useContext } from 'react';
import { DZIALY, LEKCJE, type LekcjaOZ } from '../../data/odzera';
import { PLAN_DZIALOW } from '../../data/odzera/plan';
import { gwiazdki, najlepszyWynik, poziom, type StanLekcji, type WynikOZ } from '../../lib/odzera';
import type { StanKursu } from './api';
import {
  DNI,
  DNI_PL,
  IkBlyskawica,
  IkDzwonek,
  IkGwiazda,
  IkKlodka,
  IkPlomien,
  IkPowtorka,
  IkPtaszek,
  JezykCtx,
  btnCichy,
  ciemniej,
  dzienTygodnia,
  godzina,
  jasniej,
  useT,
} from './ui';

interface Props {
  stan: StanKursu;
  login: string;
  stany: Map<number, StanLekcji>;
  xp: number;
  seriaDni: number;
  doPowtorki: number;
  teraz: number;
  onLekcja: (l: LekcjaOZ) => void;
  onPowtorka: () => void;
  onCwicz: () => void;
  onWyloguj: () => void;
}

function Statystyka({ ikona, wartosc, opis, kolor }: { ikona: React.ReactNode; wartosc: React.ReactNode; opis: string; kolor: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-white px-2.5 py-2 shadow-[0_2px_0_#e6e5df]" aria-label={opis}>
      <span style={{ color: kolor }}>{ikona}</span>
      <span className="text-[1.25rem] font-bold leading-none">{wartosc}</span>
    </div>
  );
}

export function Start({ stan, login, stany, xp, seriaDni, doPowtorki, teraz, onLekcja, onPowtorka, onCwicz, onWyloguj }: Props) {
  const t = useT();
  const j = useContext(JezykCtx);
  const p = poziom(xp);
  const nastepna = LEKCJE.find((l) => stany.get(l.nr) === 'teraz') ?? null;
  const zrobione = LEKCJE.filter((l) => stany.get(l.nr) === 'zrobiona').length;
  const dzialTeraz = nastepna ? DZIALY.find((d) => d.lekcje.some((l) => l.nr === nastepna.nr)) : null;
  const lekcjaDo = stan.lekcja_do ? new Date(stan.lekcja_do).getTime() : null;
  const trwaLekcja = stan.tryb === 'lekcja' && lekcjaDo !== null && lekcjaDo > teraz;
  const minutDoDzwonka = trwaLekcja ? Math.ceil((lekcjaDo! - teraz) / 60000) : null;
  const ostatniaZrobiona = [...LEKCJE].reverse().find((l) => stany.get(l.nr) === 'zrobiona') ?? null;

  const kiedyNastepna = (() => {
    if (!stan.nastepna) return null;
    const d = new Date(stan.nastepna);
    const dow = dzienTygodnia(d);
    const dzisDow = dzienTygodnia(new Date(teraz));
    const jutro = (dzisDow + 1) % 7 === dow && d.getTime() - teraz < 2 * 86400000;
    const dzis = dzisDow === dow && d.getTime() - teraz < 86400000;
    const pl = dzis ? `dziś o ${godzina(d)}` : jutro ? `jutro o ${godzina(d)}` : `${DNI_PL[dow]}, ${godzina(d)}`;
    const tl = dzis
      ? { ru: `сегодня в ${godzina(d)}`, ua: `сьогодні о ${godzina(d)}` }
      : jutro
        ? { ru: `завтра в ${godzina(d)}`, ua: `завтра о ${godzina(d)}` }
        : { ru: `${DNI.ru[dow]}, ${godzina(d)}`, ua: `${DNI.ua[dow]}, ${godzina(d)}` };
    return { pl, tl: t(tl) };
  })();

  return (
    <div>
      {/* Naglowek */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="whitespace-nowrap text-[1.45rem] font-bold leading-none">Polski od zera</p>
          <p className="mt-1 text-[0.95rem] text-[#6b6a65]">{j === 'ru' ? 'Польский с нуля' : 'Польська з нуля'}</p>
        </div>
        <div className="flex gap-2">
          <Statystyka ikona={<IkPlomien className="h-6 w-6" />} wartosc={seriaDni} opis={`Seria: ${seriaDni}`} kolor="#f2683c" />
          <Statystyka ikona={<IkBlyskawica className="h-6 w-6" />} wartosc={xp} opis={`${xp} XP`} kolor="#e0a400" />
        </div>
      </header>

      {/* Poziom */}
      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0 rounded-xl bg-[#8b5cf6] px-2.5 py-1 text-[0.95rem] font-bold text-white shadow-[0_3px_0_#6a3fd1]">Poziom {p.poziom}</span>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e6e5df]" role="progressbar" aria-label="Do następnego poziomu" aria-valuenow={xp - p.od} aria-valuemin={0} aria-valuemax={p.do - p.od}>
          <div className="h-full rounded-full bg-[#8b5cf6] transition-[width] duration-700" style={{ width: `${((xp - p.od) / (p.do - p.od)) * 100}%` }} />
        </div>
        <span className="shrink-0 text-sm font-bold text-[#8a8a85]">
          {zrobione}/{LEKCJE.length}
        </span>
      </div>

      {/* Teraz */}
      <section className="mt-6" aria-label="Teraz">
        {nastepna && dzialTeraz ? (
          <button
            type="button"
            onClick={() => onLekcja(nastepna)}
            className="group relative block w-full overflow-hidden rounded-[2rem] px-6 pb-6 pt-5 text-left text-white transition-transform active:translate-y-[5px]"
            style={{ background: dzialTeraz.kolor, boxShadow: `0 7px 0 ${ciemniej(dzialTeraz.kolor, 0.28)}` }}
          >
            <span className="pointer-events-none absolute -bottom-3 -right-3 select-none text-[6.5rem] leading-none" aria-hidden="true">
              {nastepna.test ? '🏆' : (nastepna.slowa[0]?.e ?? dzialTeraz.e)}
            </span>
            <span className="relative block pr-2">
              <span className="block text-[1.02rem] font-bold text-white/85">
                {nastepna.test ? 'Sprawdź się' : `Lekcja ${nastepna.nr}`} · Dział {dzialTeraz.nr}
              </span>
              <span className="mt-1 block text-[1.85rem] font-bold leading-[1.1]" lang="pl">
                {nastepna.tytul.pl}
              </span>
              <span className="mt-1 block text-[1.02rem] text-white/90">{t(nastepna.tytul)}</span>
            </span>
            <span className="relative mt-5 flex items-center gap-3 pr-24">
              <span
                className="inline-flex min-h-[3.25rem] items-center rounded-2xl bg-white px-6 text-lg font-bold"
                style={{ color: ciemniej(dzialTeraz.kolor, 0.25), boxShadow: `0 4px 0 ${ciemniej(dzialTeraz.kolor, 0.4)}` }}
              >
                Start
              </span>
              {minutDoDzwonka !== null && (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/15 px-3 py-1.5 text-[0.95rem] font-bold">
                  <IkDzwonek className="h-5 w-5" />
                  {minutDoDzwonka} min
                </span>
              )}
            </span>
          </button>
        ) : (
          <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_-16px_rgba(0,0,0,0.2)]">
            {LEKCJE.every((l) => stany.get(l.nr) === 'zrobiona') ? (
              <>
                <p className="text-[1.6rem] font-bold leading-tight">Wszystko zrobione!</p>
                <p className="mt-1 text-[#5b5b57]">{j === 'ru' ? 'Новые уроки скоро. Повторяй слова!' : 'Нові уроки скоро. Повторюй слова!'}</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-[1.05rem] font-bold text-[#8a8a85]">
                  <IkKlodka className="h-5 w-5" /> {j === 'ru' ? 'Следующий урок' : 'Наступний урок'}
                </p>
                <p className="mt-1 text-[1.7rem] font-bold leading-tight" lang="pl">
                  {kiedyNastepna ? kiedyNastepna.pl : 'Wkrótce'}
                </p>
                {kiedyNastepna && <p className="text-[1.02rem] text-[#5b5b57]">{kiedyNastepna.tl}</p>}
                <p className="mt-3 text-[0.98rem] leading-snug text-[#5b5b57]">
                  {j === 'ru' ? 'Новый урок открывается на уроке польского. А сейчас можно повторить слова.' : 'Новий урок відкривається на уроці польської. А зараз можна повторити слова.'}
                </p>
              </>
            )}
          </div>
        )}
      </section>

      {/* Powtorka i cwiczenia */}
      {(doPowtorki > 0 || ostatniaZrobiona) && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={doPowtorki === 0}
            onClick={onPowtorka}
            className="flex flex-col items-start rounded-3xl bg-white p-4 text-left shadow-[0_4px_0_#e3e2dc] transition-transform active:translate-y-[3px] disabled:opacity-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f3fd] text-[#1f8fe0]">
              <IkPowtorka />
            </span>
            <span className="mt-2 text-[1.15rem] font-bold">Powtórka</span>
            <span className="text-sm text-[#6b6a65]">
              {doPowtorki > 0 ? (j === 'ru' ? `${doPowtorki} слов на сегодня` : `${doPowtorki} слів на сьогодні`) : j === 'ru' ? 'на сегодня всё' : 'на сьогодні все'}
            </span>
          </button>
          <button
            type="button"
            disabled={!ostatniaZrobiona}
            onClick={onCwicz}
            className="flex flex-col items-start rounded-3xl bg-white p-4 text-left shadow-[0_4px_0_#e3e2dc] transition-transform active:translate-y-[3px] disabled:opacity-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4d6] text-[#c78a00]">
              <IkBlyskawica />
            </span>
            <span className="mt-2 text-[1.15rem] font-bold">Ćwicz</span>
            <span className="text-sm text-[#6b6a65]">{trwaLekcja ? (j === 'ru' ? 'до звонка' : 'до дзвінка') : j === 'ru' ? 'быстрые задания' : 'швидкі завдання'}</span>
          </button>
        </div>
      )}

      {/* Mapa */}
      <div className="mt-10 space-y-10">
        {PLAN_DZIALOW.map((pd) => {
          const d = DZIALY.find((x) => x.nr === pd.nr);
          return (
            <section key={pd.nr} aria-label={`Dział ${pd.nr}`}>
              <div
                className="flex items-center gap-3 rounded-3xl px-4 py-3"
                style={d ? { background: jasniej(pd.kolor, 0.85), color: ciemniej(pd.kolor, 0.45) } : { background: '#ecebe5', color: '#8a8a85' }}
              >
                <span className={clsx('text-[2.2rem] leading-none', !d && 'opacity-50 grayscale')} aria-hidden="true">
                  {pd.e}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold opacity-80">Dział {pd.nr}</span>
                  <span className="block text-[1.2rem] font-bold leading-tight" lang="pl">
                    {pd.pl}
                  </span>
                  <span className="block text-sm opacity-85">{t(pd)}</span>
                </span>
                {!d && <span className="shrink-0 text-sm font-bold">wkrótce</span>}
              </div>
              {d && <Sciezka lekcje={d.lekcje} kolor={d.kolor} stany={stany} wyniki={stan.wyniki} onLekcja={onLekcja} />}
            </section>
          );
        })}
      </div>

      <footer className="mt-12 flex items-center justify-between border-t border-[#e6e5df] pt-4 text-sm text-[#6b6a65]">
        <span>
          Login: <b className="font-bold text-[#3a3a37]">{login}</b>
        </span>
        <button type="button" className={btnCichy} onClick={onWyloguj}>
          Wyloguj
        </button>
      </footer>
    </div>
  );
}

/** Lekcje dzialu jako kreta sciezka kolek. */
function Sciezka({
  lekcje,
  kolor,
  stany,
  wyniki,
  onLekcja,
}: {
  lekcje: LekcjaOZ[];
  kolor: string;
  stany: Map<number, StanLekcji>;
  wyniki: WynikOZ[];
  onLekcja: (l: LekcjaOZ) => void;
}) {
  const przesuniecia = [0, 34, 52, 34, 0, -34, -52, -34];
  return (
    <ol className="mt-5 flex flex-col items-center gap-4">
      {lekcje.map((l, i) => {
        const s = stany.get(l.nr) ?? 'zamknieta';
        const w = najlepszyWynik(l.nr, wyniki);
        const g = w ? gwiazdki(w.punkty, w.maks) : 0;
        const dostepna = s !== 'zamknieta' && s !== 'wkrotce';
        return (
          <li key={l.nr} className="flex flex-col items-center" style={{ transform: `translateX(${przesuniecia[i % przesuniecia.length]}%)` }}>
            <button
              type="button"
              disabled={!dostepna}
              onClick={() => onLekcja(l)}
              aria-label={`Lekcja ${l.nr}: ${l.tytul.pl}${s === 'zrobiona' ? ', zrobiona' : s === 'zamknieta' ? ', zamknięta' : ''}`}
              className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-[1.6rem] font-bold transition-transform active:translate-y-[4px]"
              style={
                s === 'zrobiona'
                  ? { background: kolor, color: '#fff', boxShadow: `0 6px 0 ${ciemniej(kolor, 0.3)}` }
                  : s === 'teraz'
                    ? { background: '#fff', color: kolor, border: `5px solid ${kolor}`, boxShadow: `0 6px 0 ${ciemniej(kolor, 0.25)}`, animation: 'ozPuls 1.6s ease-in-out infinite' }
                    : s === 'otwarta'
                      ? { background: '#fff', color: kolor, border: `4px solid ${jasniej(kolor, 0.4)}`, boxShadow: '0 6px 0 #e3e2dc' }
                      : { background: '#e6e5df', color: '#a9a8a2', boxShadow: '0 6px 0 #d6d5cf' }
              }
            >
              {s === 'zrobiona' ? <IkPtaszek className="h-9 w-9" /> : s === 'zamknieta' ? <IkKlodka className="h-7 w-7" /> : l.test ? <IkGwiazda className="h-8 w-8" /> : l.nr}
            </button>
            {s === 'zrobiona' && (
              <span className="mt-2 flex gap-0.5" aria-label={`${g} gwiazdki`}>
                {[1, 2, 3].map((n) => (
                  <IkGwiazda key={n} className={clsx('h-4 w-4', n <= g ? 'text-[#f5b400]' : 'text-[#d6d5cf]')} />
                ))}
              </span>
            )}
            <span className={clsx('mt-1 max-w-[9.5rem] text-center text-[0.92rem] font-bold leading-tight', dostepna ? 'text-[#3a3a37]' : 'text-[#a9a8a2]')} lang="pl">
              {l.tytul.pl}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
