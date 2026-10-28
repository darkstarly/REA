import { describe, expect, it } from 'vitest'
import { COURSE, LESSONS } from '../src/content/course'
import { accuracy, buildSteps, judgeStep, lessonXp, personalize, type Learner } from '../src/lib/lesson'
import { currentStreak, finishLesson, initialState, nextStreak } from '../src/lib/store'

const man: Learner = { name: 'Alex', form: 'm' }
const woman: Learner = { name: 'Asha', form: 'f' }

describe('course content', () => {
  it('has unique lesson ids', () => expect(new Set(LESSONS.map(l => l.id)).size).toBe(LESSONS.length))
  it('every phrase has Hindi, romanisation and English', () => {
    for (const l of LESSONS) for (const p of [...l.learn, ...l.conversation]) {
      expect(p.hi.trim(), l.id).not.toBe('')
      expect(p.rom.trim(), l.id).not.toBe('')
      expect(p.en.trim(), l.id).not.toBe('')
      expect(/[ऀ-ॿ]/.test(p.hi), `${l.id}: ${p.hi}`).toBe(true)
    }
  })
  it('every lesson has phrases to learn and lines for the learner', () => {
    for (const l of LESSONS) {
      expect(l.learn.length, l.id).toBeGreaterThan(0)
      expect(l.conversation.some(c => c.who === 'you'), l.id).toBe(true)
    }
  })
  it('every learner line passes when said exactly, in both forms', () => {
    for (const l of LESSONS) for (const who of [man, woman]) {
      for (const s of buildSteps(l, who)) {
        if (s.kind === 'them') continue
        expect(judgeStep(s, [s.text.hi], who).passed, `${l.id}: ${s.text.hi}`).toBe(true)
        expect(judgeStep(s, [s.text.rom], who).passed, `${l.id}: ${s.text.rom}`).toBe(true)
      }
    }
  })
  it('has units', () => expect(COURSE.length).toBeGreaterThan(0))
})

describe('personalize', () => {
  const p = { hi: 'मैं यहाँ नया हूँ', rom: 'main yahaan naya hoon', en: 'I am new here', fem: { hi: 'मैं यहाँ नई हूँ', rom: 'main yahaan nayi hoon' } }
  it('uses the masculine form for m', () => expect(personalize(p, man).hi).toBe('मैं यहाँ नया हूँ'))
  it('uses the feminine form for f', () => expect(personalize(p, woman).hi).toBe('मैं यहाँ नई हूँ'))
  it('fills in the name', () => expect(personalize({ hi: 'मेरा नाम {name} है', rom: 'mera naam {name} hai', en: 'My name is {name}' }, man).rom).toBe('mera naam Alex hai'))
})

describe('judgeStep', () => {
  const lesson = LESSONS.find(l => l.id === 'introductions')!
  const step = (who: Learner) => buildSteps(lesson, who).find(s => s.kind === 'you' && s.text.hi.includes('हाँ, मैं यहाँ'))!
  it('catches the other gender’s form', () => {
    const s = step(man)
    if (s.kind === 'them') throw new Error('expected a speaking step')
    const r = judgeStep(s, ['हाँ, मैं यहाँ नई हूँ'], man)
    expect(r.passed).toBe(false)
    expect(r.wrongForm?.hi).toBe('हाँ, मैं यहाँ नई हूँ।')
  })
  it('accepts the learner’s own form', () => {
    const s = step(woman)
    if (s.kind === 'them') throw new Error('expected a speaking step')
    expect(judgeStep(s, ['हाँ मैं यहाँ नई हूँ'], woman).passed).toBe(true)
  })
})

describe('scoring a lesson', () => {
  const steps = buildSteps(LESSONS[0], man)
  const speaking = steps.map((s, i) => (s.kind === 'them' ? -1 : i)).filter(i => i >= 0)
  it('all perfect is 100%', () => {
    const scores = Object.fromEntries(speaking.map(i => [i, { score: 1, skipped: false }]))
    expect(accuracy(steps, scores)).toBe(100)
    expect(lessonXp(steps, scores)).toBe(10 + 2 * speaking.length)
  })
  it('skips count as zero', () => {
    const scores = Object.fromEntries(speaking.map((i, k) => [i, { score: 1, skipped: k === 0 }]))
    expect(accuracy(steps, scores)).toBe(Math.round((speaking.length - 1) / speaking.length * 100))
  })
})

describe('streak', () => {
  it('starts at 1', () => expect(nextStreak({ count: 0, last: null }, '2026-10-28')).toEqual({ count: 1, last: '2026-10-28' }))
  it('the same day keeps it', () => expect(nextStreak({ count: 3, last: '2026-10-28' }, '2026-10-28').count).toBe(3))
  it('the next day adds one, across a month end', () => expect(nextStreak({ count: 3, last: '2026-10-31' }, '2026-11-01').count).toBe(4))
  it('a gap starts over', () => expect(nextStreak({ count: 3, last: '2026-10-25' }, '2026-10-28').count).toBe(1))
  it('lapses after a missed day', () => {
    expect(currentStreak({ count: 5, last: '2026-10-27' }, '2026-10-28')).toBe(5)
    expect(currentStreak({ count: 5, last: '2026-10-26' }, '2026-10-28')).toBe(0)
  })
  it('finishing keeps the best accuracy and adds XP', () => {
    let s = finishLesson(initialState, 'namaste', 80, 20, '2026-10-28')
    s = finishLesson(s, 'namaste', 60, 15, '2026-10-28')
    expect(s.lessons.namaste.best).toBe(80)
    expect(s.xp).toBe(35)
    expect(s.streak).toEqual({ count: 1, last: '2026-10-28' })
  })
})
