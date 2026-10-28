import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Lesson } from '../content/types'
import { feedbackMessage, judgeStep, type AnswerResult, type Learner, type Step } from '../lib/lesson'
import { canListen, listen, speak, stopSpeaking, type Listener } from '../lib/speech'
import type { Prefs } from '../lib/store'
import { KeyboardIcon, MicIcon, NextIcon, SpeakerIcon } from './Icons'

/** How long a correct answer shows before moving on */
const ADVANCE_MS = 1200
/** Pause after the character finishes a line */
const AFTER_LINE_MS = 500

type Props = {
  step: Step
  lesson: Lesson
  learner: Learner
  prefs: Prefs
  /** true once the learner has tapped the microphone in this lesson */
  autoListen: RefObject<boolean>
  onNext: (score?: { score: number; skipped: boolean }) => void
}

/** One step of a lesson. Rendered with key={step index}, so every step starts fresh. */
export function StepView(props: Props) {
  return props.step.kind === 'them' ? <TheirLine {...props} /> : <YourTurn {...props} />
}

function Caption({ step, prefs, speaker, words }: { step: Step; prefs: Prefs; speaker: string; words?: AnswerResult['words'] }) {
  const t = step.text
  return (
    <div className={'caption ' + step.kind} aria-live="polite">
      <p className="caption-who">{speaker}</p>
      <p className="hi caption-hi" lang="hi">
        {words
          ? words.map((w, i) => <span key={i} className={w.ok ? 'w-ok' : 'w-miss'}>{w.text}{i < words.length - 1 ? ' ' : ''}</span>)
          : t.hi}
      </p>
      {prefs.showRom && <p className="caption-rom">{t.rom}</p>}
      <p className="caption-en">{t.en}</p>
    </div>
  )
}

function Avatar({ emoji, talking, listening = false }: { emoji: string; talking: boolean; listening?: boolean }) {
  return <div className={'avatar' + (talking ? ' talking' : '') + (listening ? ' listening' : '')} aria-hidden="true">{emoji}</div>
}

function Controls({ left, main, right }: { left: ReactNode; main: ReactNode; right: ReactNode }) {
  return <div className="controls">{left}<div className="controls-main">{main}</div>{right}</div>
}

/** The character says a line: read aloud (or their video clip plays), then the lesson moves on */
function TheirLine({ step, lesson, prefs, onNext }: Props) {
  const [talking, setTalking] = useState(true)
  const [silent, setSilent] = useState(false)
  const timer = useRef<number>(undefined)

  function play() {
    clearTimeout(timer.current)
    if (step.kind === 'them' && step.clip) return
    setTalking(true)
    const ok = speak(step.text.hi, {
      slow: prefs.slow,
      voice: lesson.character.voice,
      onDone: () => { setTalking(false); timer.current = window.setTimeout(() => onNext(), AFTER_LINE_MS) },
    })
    // No Hindi voice on this device: the learner reads the line and continues themselves
    if (!ok) { clearTimeout(timer.current); setSilent(true); setTalking(false) }
  }

  useEffect(() => {
    play()
    return () => { clearTimeout(timer.current); stopSpeaking() }
    // Once per line: this component is keyed by the step
  }, [])

  const clip = step.kind === 'them' ? step.clip : undefined
  return (
    <>
      {clip && <video className="clip" src={clip} autoPlay playsInline onEnded={() => onNext()} onError={() => setSilent(true)} />}
      <Caption step={step} prefs={prefs} speaker={lesson.character.name} />
      <div className="center">{!clip && <Avatar emoji={lesson.character.emoji} talking={talking} />}</div>
      <div className="bubble" aria-live="polite">{silent ? 'Read the line, then tap the arrow to continue.' : talking ? `${lesson.character.name} is speaking…` : '…'}</div>
      <Controls
        left={<button className="side-btn" aria-label="Hear it again" onClick={play}><SpeakerIcon /></button>}
        main={<button className="main-btn" aria-label="Continue" onClick={() => { stopSpeaking(); onNext() }}><NextIcon /></button>}
        right={<span className="side-gap" />}
      />
    </>
  )
}

/** The learner's turn: a key phrase to repeat, or their line in the conversation */
function YourTurn({ step, lesson, learner, prefs, autoListen, onNext }: Props) {
  const hasMic = canListen()
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [note, setNote] = useState('')
  const [typing, setTyping] = useState(!hasMic)
  const [typed, setTyped] = useState('')
  const best = useRef(0)
  const mic = useRef<Listener | null>(null)
  const timer = useRef<number>(undefined)
  const isLearn = step.kind === 'learn'

  useEffect(() => {
    // Key phrases are read aloud first; then (once the learner has used the mic) listening starts by itself
    if (isLearn) speak(step.text.hi, { slow: prefs.slow, voice: lesson.character.voice, onDone: () => { if (autoListen.current && hasMic) start() } })
    else if (autoListen.current && hasMic) start()
    return () => { clearTimeout(timer.current); mic.current?.abort(); mic.current = null; stopSpeaking() }
  }, [])

  function check(alternatives: string[]) {
    if (step.kind === 'them') return
    const r = judgeStep(step, alternatives, learner)
    best.current = Math.max(best.current, r.passed ? r.score : Math.min(r.score, 0.74))
    setResult(r)
    setNote(feedbackMessage(r, learner.form))
    if (r.passed) timer.current = window.setTimeout(() => onNext({ score: best.current, skipped: false }), ADVANCE_MS)
  }

  function start() {
    if (mic.current) { mic.current.stop(); return }
    stopSpeaking()
    setHeard('')
    setNote('')
    setResult(null)
    const session = listen({
      onResult: h => { setHeard(h.transcript); if (h.final) check(h.alternatives) },
      onError: message => setNote(message),
      onEnd: () => { mic.current = null; setListening(false) },
    })
    if (!session) return
    mic.current = session
    setListening(true)
  }

  function tapMic() {
    autoListen.current = true
    start()
  }

  function hear() {
    mic.current?.abort()
    speak(step.text.hi, { slow: prefs.slow, voice: isLearn ? lesson.character.voice : undefined })
  }

  function toggleTyping() {
    if (!typing) { mic.current?.abort(); setNote('') }
    setTyping(!typing)
  }

  function submitTyped() {
    if (!typed.trim()) return setNote('Type the phrase first.')
    setHeard(typed)
    check([typed])
  }

  const passed = !!result?.passed
  let bubble = isLearn ? 'Listen, then say it.' : 'Your turn. Say this line.'
  if (!hasMic) bubble = isLearn ? 'Listen, then type it.' : 'Your turn. Type this line.'
  if (listening) bubble = heard ? `“${heard}”` : 'I am listening…'
  else if (note) bubble = note

  return (
    <>
      <Caption step={step} prefs={prefs} speaker={isLearn ? 'Say it' : 'You'} words={result?.words} />
      <div className="center"><Avatar emoji={lesson.character.emoji} talking={false} listening={listening} /></div>
      {typing && (
        <form className="type-row" onSubmit={e => { e.preventDefault(); submitTyped() }}>
          <input value={typed} onChange={e => setTyped(e.target.value)} aria-label="Type your answer" placeholder="Type in Hindi or English letters" autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} />
          <button className="btn small primary" type="submit">Check</button>
        </form>
      )}
      <div className={'bubble' + (!listening && result ? (passed ? ' ok' : ' bad') : '')} aria-live="polite">{bubble}</div>
      <Controls
        left={<button className="side-btn" aria-label="Hear the phrase" onClick={hear}><SpeakerIcon /></button>}
        main={hasMic
          ? <button className={'main-btn mic' + (listening ? ' listening' : '')} aria-label={listening ? 'Stop listening' : 'Speak'} aria-pressed={listening} onClick={tapMic} disabled={passed}>
              {listening ? <span className="dots" aria-hidden="true"><i /><i /><i /><i /><i /></span> : <MicIcon />}
            </button>
          : <span className="main-gap" />}
        right={hasMic
          ? <button className={'side-btn' + (typing ? ' on' : '')} aria-label="Type instead" aria-pressed={typing} onClick={toggleTyping}><KeyboardIcon /></button>
          : <span className="side-gap" />}
      />
      <button className="skip" onClick={() => onNext({ score: best.current, skipped: true })} disabled={passed}>Skip this line</button>
    </>
  )
}
