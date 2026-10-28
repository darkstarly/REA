# Bolo: speak Hindi from day one

Bolo teaches English speakers to **speak** Hindi through short role-play conversations, in the spirit of Teuida.
Each lesson puts you in a real situation (greeting a neighbour, ordering chai, bargaining at a market, taking an
auto) with one character:

1. **Key phrases.** Each phrase is read aloud; you say it back and get instant feedback.
2. **Conversation.** The character speaks; when it's your turn, you say your line.
3. **Results.** Accuracy, XP, your daily streak, a usage tip, and the phrases you learned.

Every phrase is shown in Devanagari, in English letters and in English. Words you missed are underlined. Where Hindi
changes with the speaker's gender (मैं नया हूँ / मैं नई हूँ), Bolo teaches the forms you choose and tells you if
you used the other one.

It's a web app: it runs in the browser on phones and computers, and on a phone you can add it to the home screen.
Progress is saved in the browser; there are no accounts and no server.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22.12 or newer (the current LTS version is fine).

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in **Chrome or Edge**.

## Put it online

Bolo is a static site, so any static host works. On [Vercel](https://vercel.com): **Add New → Project**, import
this repository, keep the defaults (Vite), and **Deploy**. The https address it gives you works on phones,
microphone included. (Browsers only allow the microphone on https pages and on localhost.)

## Speech: what works where

| | Listening to you (speech recognition) | Reading lines aloud (Hindi voice) |
|---|---|---|
| Chrome / Edge (Android, Mac, Windows) | Yes, needs internet | Yes |
| Safari (iPhone, Mac) | Partly: less accurate for Hindi | Yes (Lekha voice) |
| Firefox | No: type your answers instead | Depends on installed voices |

Settings shows what the current device supports. Without speech recognition you type answers (Devanagari or
English letters both work).

## Editing the course

All lesson content is in [`src/content/course.ts`](src/content/course.ts): units, lessons, characters, phrases and
tips. The shape is described in [`src/content/types.ts`](src/content/types.ts). For each phrase:

- `hi`: Hindi in Devanagari, `rom`: romanised, `en`: English
- `accept`: other answers that count as correct (optional)
- `fem`: the feminine-speaker version, where it differs (optional)
- `{name}`: replaced with the learner's first name

To use **video of real people** instead of the illustrated characters, add `clips` to a lesson: one video URL per
line the character says, in order. Portrait (9:16) videos suit phones best.

**Have a fluent Hindi speaker review any new or changed text.** `npm test` checks that every learner line is
accepted when said exactly, in both scripts and both gender forms.

## Checks

```bash
npm test          # unit tests: scoring, lessons, gender forms, streaks, course content
npm run build     # type-check and production build into dist/
```

## How answers are judged

[`src/lib/scoring.ts`](src/lib/scoring.ts) compares what was heard with the phrase two ways and keeps the better
score: Devanagari against Devanagari (ignoring nukta, chandrabindu vs anusvara, and punctuation), and a forgiving
phonetic Latin key (so "एक chai दीजिए" and typed "ek chai dijiye" both match). 75% similarity passes, above 92% is
"Perfect". Speech recognition itself is the browser's, so its accuracy depends on the device, microphone and
connection.
