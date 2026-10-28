// Everything Bolo remembers, kept in this browser (localStorage). Nothing is sent anywhere.
import { useSyncExternalStore } from 'react'
import type { Form } from './lesson'

export type Prefs = {
  name: string
  form: Form
  /** read phrases slower */
  slow: boolean
  /** show the romanised line under the Hindi */
  showRom: boolean
}

export type LessonRecord = { done: boolean; best: number; completedAt: string }

export type State = {
  /** false until the welcome screens are finished */
  onboarded: boolean
  prefs: Prefs
  lessons: Record<string, LessonRecord>
  xp: number
  streak: { count: number; last: string | null }
}

const KEY = 'bolo:v1'

export const initialState: State = {
  onboarded: false,
  prefs: { name: '', form: 'm', slow: false, showRom: true },
  lessons: {},
  xp: 0,
  streak: { count: 0, last: null },
}

/** Today's date in the learner's own time zone, as YYYY-MM-DD */
export function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dayBefore(day: string) {
  const [y, m, d] = day.split('-').map(Number)
  return localDay(new Date(y, m - 1, d - 1))
}

/** The streak after practising on `today`: same day keeps it, the next day adds one, a gap starts over */
export function nextStreak(streak: State['streak'], today: string): State['streak'] {
  if (streak.last === today) return streak
  return { count: streak.last === dayBefore(today) ? streak.count + 1 : 1, last: today }
}

/** The streak as it stands on `today`: it lapses once a whole day has been missed */
export function currentStreak(streak: State['streak'], today: string) {
  return streak.last === today || streak.last === dayBefore(today) ? streak.count : 0
}

/** Record a finished lesson: keeps the best accuracy, adds XP and extends the streak */
export function finishLesson(s: State, id: string, accuracyPct: number, xp: number, today = localDay()): State {
  const before = s.lessons[id]
  return {
    ...s,
    lessons: { ...s.lessons, [id]: { done: true, best: Math.max(before?.best ?? 0, accuracyPct), completedAt: new Date().toISOString() } },
    xp: s.xp + xp,
    streak: nextStreak(s.streak, today),
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw) as Partial<State>
    return { ...initialState, ...saved, prefs: { ...initialState.prefs, ...saved.prefs } }
  } catch {
    return initialState
  }
}

let state: State = typeof localStorage === 'undefined' ? initialState : load()
const listeners = new Set<() => void>()

export function getState() { return state }

export function setState(update: (s: State) => State) {
  state = update(state)
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode or storage full: keep going in memory */ }
  listeners.forEach(l => l())
}

export function resetAll() {
  setState(() => initialState)
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }

/** The current state, re-rendering when it changes */
export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState)
}
