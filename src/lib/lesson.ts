// A lesson as a sequence of steps, and how the learner's answers are judged. Pure: tested in tests/lesson.test.ts.
import type { Lesson, Phrase, Text } from '../content/types'
import { judge, type Judgement } from './scoring'

/** Which forms the learner is taught where Hindi depends on the speaker's (or listener's) gender */
export type Form = 'm' | 'f'

export type Learner = { name: string; form: Form }

/** A phrase made concrete for this learner: their gender's form, their name filled in */
export function personalize(p: Phrase, who: Learner): Text {
  const base = who.form === 'f' && p.fem ? { ...p, ...p.fem } : p
  const name = who.name.trim() || 'Sam'
  const fill = (s: string) => s.replaceAll('{name}', name)
  return { hi: fill(base.hi), rom: fill(base.rom), en: fill(base.en), accept: base.accept?.map(fill) }
}

/** The other gender's version of a phrase, when it has one (to catch the learner using the wrong form) */
export function otherForm(p: Phrase, who: Learner): Text | null {
  if (!p.fem) return null
  return personalize(p, { ...who, form: who.form === 'f' ? 'm' : 'f' })
}

export type Step =
  /** learn phase: hear a key phrase and repeat it */
  | { kind: 'learn'; text: Text; phrase: Phrase }
  /** the character says a line (clip: its video, when the lesson has one) */
  | { kind: 'them'; text: Text; clip?: string }
  /** the learner's line in the conversation */
  | { kind: 'you'; text: Text; phrase: Phrase }

export function buildSteps(lesson: Lesson, who: Learner): Step[] {
  let clip = 0
  return [
    ...lesson.learn.map(p => ({ kind: 'learn' as const, text: personalize(p, who), phrase: p })),
    ...lesson.conversation.map(line => line.who === 'them'
      ? { kind: 'them' as const, text: personalize(line, who), clip: lesson.clips?.[clip++] }
      : { kind: 'you' as const, text: personalize(line, who), phrase: line }),
  ]
}

/** Steps where the learner speaks */
export const isSpeaking = (s: Step): s is Extract<Step, { phrase: Phrase }> => s.kind !== 'them'

export type AnswerResult = Judgement & {
  /** the answer matched the other gender's form better than the learner's own */
  wrongForm: Text | null
}

/** Judge what the learner said (or typed) for a speaking step */
export function judgeStep(step: Extract<Step, { phrase: Phrase }>, alternatives: string[], who: Learner): AnswerResult {
  const t = step.text
  const result = judge(alternatives, [t.hi, t.rom, ...(t.accept ?? [])], t.hi)
  const other = otherForm(step.phrase, who)
  if (other && other.hi !== t.hi) {
    const asOther = judge(alternatives, [other.hi, other.rom, ...(other.accept ?? [])], other.hi)
    // Said the other form: not passed, and the message explains which form to use
    if (asOther.score > result.score) return { ...result, passed: false, verdict: 'close', wrongForm: other }
  }
  return { ...result, wrongForm: null }
}

/** What the bubble says after an answer */
export function feedbackMessage(r: AnswerResult, form: Form) {
  if (r.wrongForm) return form === 'f'
    ? 'That’s the form a man would use. As a woman, say it as shown.'
    : 'That’s the form a woman would use. As a man, say it as shown.'
  switch (r.verdict) {
    case 'perfect': return 'Perfect!'
    case 'good': return 'Well said!'
    case 'close': return 'Close! Listen once more and try again.'
    case 'miss': return 'Not quite. Tap the speaker to listen, then try again.'
  }
}

/** Per speaking step: the best score reached (0 if skipped) */
export type Scores = Record<number, { score: number; skipped: boolean }>

/** Lesson accuracy, 0–100: the mean best score over every speaking step, skipped ones counting 0 */
export function accuracy(steps: Step[], scores: Scores) {
  const speaking = steps.map((s, i) => [s, i] as const).filter(([s]) => isSpeaking(s))
  if (!speaking.length) return 100
  const total = speaking.reduce((sum, [, i]) => sum + (scores[i] && !scores[i].skipped ? Math.min(1, scores[i].score) : 0), 0)
  return Math.round(total / speaking.length * 100)
}

/** XP for finishing a lesson: 10, plus 2 for every phrase said (not skipped) */
export function lessonXp(steps: Step[], scores: Scores) {
  return 10 + steps.reduce((xp, s, i) => xp + (isSpeaking(s) && scores[i] && !scores[i].skipped ? 2 : 0), 0)
}
