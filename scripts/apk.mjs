// Buduje APK z Capacitora i wgrywa go na telefon po USB: npm run apk
//
// Gradle Capacitora 7 wymaga JDK 21, a na tym komputerze w PATH siedzi tez
// JDK 17 (od innych narzedzi) - polegajac na PATH build wysypuje sie na
// "invalid source release: 21". Dlatego JDK i adb szukamy tu sami, w typowych
// miejscach instalacji, zamiast zakladac, ze srodowisko jest ustawione.
//
// npm run apk -- --bez-instalacji  buduje sam plik, bez podlaczonego telefonu.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

const KATALOG = path.resolve(import.meta.dirname, '..');
const APK = path.join(KATALOG, 'android/app/build/outputs/apk/debug/app-debug.apk');
const bezInstalacji = process.argv.includes('--bez-instalacji');

/** Pierwsza sciezka, ktora istnieje; inaczej undefined. */
function pierwsza(kandydaci) {
  return kandydaci.find((p) => p && existsSync(p));
}

/** JDK 21+ - Gradle bierze go z JAVA_HOME, wiec wystarczy katalog domowy JDK. */
function znajdzJdk() {
  const scoop = path.join(homedir(), 'scoop/apps');
  const zeScoopa = existsSync(scoop)
    ? readdirSync(scoop)
        .filter((nazwa) => /^temurin(2[1-9]|[3-9]\d)-jdk$/.test(nazwa))
        .map((nazwa) => path.join(scoop, nazwa, 'current'))
    : [];
  const jdk = pierwsza([
    ...zeScoopa,
    ...(process.env.JAVA_HOME_21_X64 ? [process.env.JAVA_HOME_21_X64] : []),
    'C:/Program Files/Eclipse Adoptium/jdk-21',
    'C:/Program Files/Java/jdk-21',
    'C:/Program Files/Android/Android Studio/jbr',
  ]);
  if (!jdk) {
    throw new Error('Nie znalazlem JDK 21. Zainstaluj: scoop install temurin21-jdk');
  }
  return jdk;
}

function znajdzAdb() {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? path.join(homedir(), 'AppData/Local/Android/Sdk');
  const adb = pierwsza([path.join(sdk, 'platform-tools/adb.exe'), path.join(sdk, 'platform-tools/adb')]);
  if (!adb) throw new Error(`Nie znalazlem adb w ${sdk}/platform-tools`);
  return adb;
}

function uruchom(plik, argumenty, opcje = {}) {
  execFileSync(plik, argumenty, { cwd: KATALOG, stdio: 'inherit', shell: true, ...opcje });
}

const jdk = znajdzJdk();
console.log(`JDK: ${jdk}`);

uruchom('npm', ['run', 'build']);
uruchom('npx', ['cap', 'sync', 'android']);
uruchom(path.join(KATALOG, 'android/gradlew.bat'), ['assembleDebug'], {
  cwd: path.join(KATALOG, 'android'),
  env: { ...process.env, JAVA_HOME: jdk },
});

if (bezInstalacji) {
  console.log(`\nGotowe: ${APK}`);
} else {
  const adb = znajdzAdb();
  // -r nadpisuje poprzednia wersje i zostawia dane apki (sesja Supabase).
  uruchom(adb, ['install', '-r', APK]);
  console.log('\nWgrane na telefon.');
}
