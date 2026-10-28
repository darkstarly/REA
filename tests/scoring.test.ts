import { describe, expect, it } from 'vitest'
import { judge, normalizeDeva, phoneticKey, toLatin } from '../src/lib/scoring'

const targets = (hi: string, rom: string, accept: string[] = []) => [hi, rom, ...accept]

describe('toLatin', () => {
  it.each([
    ['नमस्ते', 'namaste'],
    ['ठीक', 'theek'],
    ['हैं', 'hain'],
    ['आप कैसे हैं?', 'aap kaise hain?'],
    ['मैं ठीक हूँ।', 'main theek hoon।'],
    ['धन्यवाद', 'dhanyavaad'],
  ])('%s → %s', (deva, latin) => expect(toLatin(deva)).toBe(latin))

  it('passes Latin letters through', () => expect(toLatin('एक chai')).toBe('ek chai'))
})

describe('normalizeDeva', () => {
  it('treats chandrabindu and anusvara alike, and ignores nukta and punctuation', () => {
    expect(normalizeDeva('मैं ठीक हूँ।')).toBe(normalizeDeva('मैं ठीक हूं'))
    expect(normalizeDeva('माफ़ कीजिए')).toBe(normalizeDeva('माफ कीजिए'))
  })
})

describe('phoneticKey', () => {
  it('forgives vowel length and doubled letters', () => expect(phoneticKey('theek hai')).toBe(phoneticKey('thik hai')))
})

describe('judge', () => {
  const namaste = targets('नमस्ते', 'namaste', ['नमस्कार'])
  it('exact Devanagari is perfect', () => expect(judge(['नमस्ते'], namaste, 'नमस्ते').verdict).toBe('perfect'))
  it('an accepted variant passes', () => expect(judge(['नमस्कार'], namaste, 'नमस्ते').passed).toBe(true))
  it('something else is a miss', () => expect(judge(['कुछ भी नहीं'], namaste, 'नमस्ते').verdict).toBe('miss'))

  const fine = targets('मैं ठीक हूँ', 'main theek hoon')
  it('anusvara spelling is perfect', () => expect(judge(['मैं ठीक हूं'], fine, 'मैं ठीक हूँ').verdict).toBe('perfect'))
  it('typed romanisation passes', () => expect(judge(['main theek hoon'], fine, 'मैं ठीक हूँ').passed).toBe(true))
  it('loose romanisation passes', () => expect(judge(['mai thik hu'], fine, 'मैं ठीक हूँ').passed).toBe(true))

  const tea = targets('भैया, एक चाय दीजिए', 'bhaiya, ek chai dijiye')
  it('a loanword recognised in Latin letters passes', () => expect(judge(['भैया एक chai दीजिए'], tea, 'भैया, एक चाय दीजिए').passed).toBe(true))
  it('a missing word is not perfect and is marked', () => {
    const r = judge(['भैया एक चाय'], tea, 'भैया, एक चाय दीजिए')
    expect(r.verdict).not.toBe('perfect')
    expect(r.words.map(w => w.ok)).toEqual([true, true, true, false])
  })
  it('the best of several alternatives counts', () => expect(judge(['भैया एक छाया', 'भैया एक चाय दीजिए'], tea, 'भैया, एक चाय दीजिए').verdict).toBe('perfect'))
  it('nothing heard is a miss', () => expect(judge([''], tea, 'भैया, एक चाय दीजिए').verdict).toBe('miss'))
})
