// The browser's speech services: recognition (listening to the learner) and synthesis (reading lines aloud).
// Both are Web Speech API features. Hindi recognition works in Chrome and Edge (it needs an internet connection);
// Safari's is less reliable, and Firefox has none. Call these from event handlers and effects only.

type BrowserRecognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionConstructor = new () => BrowserRecognition

function recognitionClass(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return w.SpeechRecognition || w.webkitSpeechRecognition
}

export const canListen = () => !!recognitionClass()

export type Heard = { transcript: string; alternatives: string[]; final: boolean }

export type Listener = { stop: () => void; abort: () => void }

export function errorMessage(code: string) {
  if (code === 'not-allowed' || code === 'service-not-allowed') return 'Microphone access is blocked. Allow it in your browser’s settings, or type your answer.'
  if (code === 'no-speech') return 'I didn’t hear anything. Tap the microphone and try again.'
  if (code === 'network') return 'Speech recognition needs an internet connection. You can type your answer instead.'
  if (code === 'audio-capture') return 'No microphone was found. You can type your answer instead.'
  return 'Listening stopped unexpectedly. Try again, or type your answer.'
}

/**
 * Listen for Hindi. onResult gets live guesses and then the final result (with up to 3 alternatives); onError gets
 * a message for the learner (not called when we stop it ourselves); onEnd is always called last.
 */
export function listen(handlers: { onResult: (h: Heard) => void; onError: (message: string) => void; onEnd: () => void }): Listener | null {
  const Recognition = recognitionClass()
  if (!Recognition) return null
  const rec = new Recognition()
  rec.lang = 'hi-IN'
  rec.interimResults = true
  rec.maxAlternatives = 3
  rec.continuous = false
  rec.onresult = e => {
    const r = e.results[e.results.length - 1]
    handlers.onResult({ transcript: r[0].transcript, alternatives: Array.from(r).map(a => a.transcript), final: r.isFinal })
  }
  rec.onerror = e => { if (e.error !== 'aborted') handlers.onError(errorMessage(e.error)) }
  rec.onend = () => handlers.onEnd()
  try { rec.start() } catch { handlers.onEnd(); return null }
  return {
    stop() { try { rec.stop() } catch { /* already stopped */ } },
    abort() { try { rec.abort() } catch { /* already stopped */ } },
  }
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

function hindiVoices() {
  return speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('hi'))
}

/** Undefined while the browser is still loading its voices; then whether a Hindi voice is installed */
export function hasHindiVoice() {
  if (!canSpeak()) return false
  if (!speechSynthesis.getVoices().length) return undefined
  return hindiVoices().length > 0
}

// Common voice names, to give female and male characters different voices where a device has both
const FEMALE = /lekha|kalpana|swara|heera|female|woman|google हिन्दी/i
const MALE = /rishi|hemant|madhur|prabhat|male|man\b/i

let pending: { timer: number; cancel: () => void } | null = null

/**
 * Read Hindi aloud, interrupting anything already playing. onDone runs once when it finishes or can't play at all
 * (a timer backs up browsers that never report the end); not when it is interrupted by stopSpeaking or another line.
 */
export function speak(text: string, opts: { slow?: boolean; voice?: 'female' | 'male'; onDone?: () => void } = {}) {
  stopSpeaking()
  let finished = false
  const done = () => {
    if (finished) return
    finished = true
    if (pending?.cancel === cancel) { clearTimeout(pending.timer); pending = null }
    opts.onDone?.()
  }
  const cancel = () => { finished = true }
  if (!canSpeak() || hasHindiVoice() === false) { setTimeout(done, 0); return false }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'
  u.rate = opts.slow ? 0.6 : 0.9
  const voices = hindiVoices()
  const wanted = opts.voice === 'male' ? MALE : opts.voice === 'female' ? FEMALE : null
  u.voice = (wanted && voices.find(v => wanted.test(v.name))) || voices[0] || null
  u.onend = done
  u.onerror = done
  // About 120 ms a character at normal speed, plus a margin
  pending = { timer: window.setTimeout(done, 2500 + text.length * (opts.slow ? 190 : 120)), cancel }
  speechSynthesis.speak(u)
  return true
}

/** Stop reading aloud; the interrupted line's onDone does not run */
export function stopSpeaking() {
  if (pending) { clearTimeout(pending.timer); pending.cancel(); pending = null }
  if (canSpeak()) speechSynthesis.cancel()
}
