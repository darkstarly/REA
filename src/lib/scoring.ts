// Judging an answer (spoken or typed) against the phrase the learner should say.
// Pure functions: no browser APIs, so they are unit-tested in tests/scoring.test.ts.
//
// Speech recognition for Hindi returns Devanagari, but often writes common English loanwords in Latin letters
// ("एक chai दीजिए"), and learners may type in either script. So an answer is compared two ways and the better
// one counts: Devanagari against Devanagari, and a rough phonetic Latin key against a Latin key.

/** At or above this similarity the phrase counts as said */
export const PASS = 0.75
/** Above this it's "Perfect" */
export const PERFECT = 0.92
/** Above this (but under PASS) it's "Close" */
export const CLOSE = 0.5

export type Verdict = 'perfect' | 'good' | 'close' | 'miss'

export type Judgement = {
  /** 0–1, the best across the alternatives heard and the accepted forms */
  score: number
  verdict: Verdict
  passed: boolean
  /** for each word of the target phrase (as shown), whether the answer contained it */
  words: { text: string; ok: boolean }[]
}

/**
 * Devanagari for comparison: NFC, no nukta (क़ = क), chandrabindu as anusvara (हूँ = हूं), no punctuation or
 * spaces. Latin letters are lower-cased and kept.
 */
export function normalizeDeva(s: string) {
  return (s || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/़/g, '')
    .replace(/ँ/g, 'ं')
    .replace(/[\s।॥.,!?;:'"“”‘’()\-–—]/g, '')
}

const VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
}
const MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e',
}
const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l',
}
const VIRAMA = '्'
const DIGITS: Record<string, string> = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' }

/**
 * Devanagari to plain Latin letters, roughly as a learner would romanise it: consonants carry an "a" unless a vowel
 * sign or virama follows, and a final "a" is dropped (नमस्ते → namaste, ठीक → theek, हैं → hain).
 * Latin letters pass through. Only for comparing answers, never shown.
 */
export function toLatin(s: string) {
  const text = (s || '').normalize('NFC').replace(/़/g, '')
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1]
    if (CONSONANTS[c]) {
      out += CONSONANTS[c]
      // The inherent vowel, unless a vowel sign or virama follows or the word ends here
      if (next && (CONSONANTS[next] || VOWELS[next] || next === 'ं' || next === 'ँ' || next === 'ः')) out += 'a'
    } else if (MATRAS[c]) out += MATRAS[c]
    else if (VOWELS[c]) out += VOWELS[c]
    else if (c === 'ं' || c === 'ँ') out += 'n'
    else if (c === 'ः') out += 'h'
    else if (DIGITS[c]) out += DIGITS[c]
    else if (c === VIRAMA) continue
    else out += c
  }
  return out.toLowerCase()
}

/**
 * A forgiving phonetic key for Latin text: long and short vowels count the same, doubled letters once,
 * w = v, z = j, and anything that isn't a letter or digit is dropped. "theek hai" and "thik he" come out close.
 */
export function phoneticKey(latin: string) {
  return latin
    .toLowerCase()
    .replace(/aa/g, 'a').replace(/ee|ii/g, 'i').replace(/oo|uu/g, 'u')
    .replace(/w/g, 'v').replace(/z/g, 'j').replace(/q/g, 'k')
    .replace(/[^a-z0-9]/g, '')
    .replace(/(.)\1+/g, '$1')
}

/** Levenshtein edit distance */
export function editDistance(a: string, b: string) {
  const m = a.length, n = b.length
  if (!m || !n) return Math.max(m, n)
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[n]
}

/** 0–1: 1 means the same */
export function similarity(a: string, b: string) {
  if (!a && !b) return 1
  if (!a || !b) return 0
  return 1 - editDistance(a, b) / Math.max(a.length, b.length)
}

const key = (s: string) => phoneticKey(toLatin(s))

/** How close one answer is to one correct form, comparing in both scripts */
export function compare(answer: string, target: string) {
  return Math.max(similarity(normalizeDeva(answer), normalizeDeva(target)), similarity(key(answer), key(target)))
}

/** Splits a phrase into the words shown to the learner (punctuation stays attached for display) */
export function displayWords(phrase: string) {
  return phrase.split(/\s+/).filter(Boolean)
}

/** Whether a target word appears (closely enough) among the answer's words */
function wordHeard(word: string, answerWords: string[]) {
  const w = normalizeDeva(word), wk = key(word)
  if (!w) return true
  return answerWords.some(a => {
    const d = normalizeDeva(a), k = key(a)
    const tolerance = Math.max(1, Math.floor(Math.max(wk.length, k.length) / 4))
    return d === w || editDistance(k, wk) <= tolerance
  })
}

/**
 * Judge an answer. `alternatives` are what was heard (speech recognition offers several) or what was typed;
 * `targets` are the correct forms: the phrase in Devanagari, romanised, and any accepted variants.
 * `shown` is the phrase as displayed, for marking its words.
 */
export function judge(alternatives: string[], targets: string[], shown: string): Judgement {
  let score = 0, best = alternatives[0] ?? ''
  for (const a of alternatives) {
    for (const t of targets) {
      const s = compare(a, t)
      if (s > score) { score = s; best = a }
    }
  }
  const verdict: Verdict = score >= PASS ? (score > PERFECT ? 'perfect' : 'good') : score > CLOSE ? 'close' : 'miss'
  const answerWords = displayWords(best)
  const words = displayWords(shown).map(text => ({ text, ok: wordHeard(text, answerWords) }))
  return { score, verdict, passed: score >= PASS, words }
}
