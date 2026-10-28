import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Lesson } from '../content/types'
import { COURSE } from '../content/course'
import { accuracy, buildSteps, lessonXp, personalize, type Scores } from '../lib/lesson'
import { go } from '../lib/router'
import { canListen, speak, stopSpeaking } from '../lib/speech'
import { currentStreak, finishLesson, localDay, setState, useStore } from '../lib/store'
import { CloseIcon, PlayIcon, SpeakerIcon, TurtleIcon } from '../components/Icons'
import { StepView } from '../components/StepView'

type Phase = 'intro' | 'play' | 'done'

/**
 * Once the learner taps the microphone, later phrases start listening by themselves (see StepView), in this lesson
 * and the next ones, until the app is reloaded. Never before that tap, so the microphone only opens on request.
 */
const autoListen = { current: false }

/** A lesson, full screen: the scene, then the key phrases, then the conversation, then the results */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { prefs } = useStore()
  const learner = useMemo(() => ({ name: prefs.name, form: prefs.form }), [prefs.name, prefs.form])
  const steps = useMemo(() => buildSteps(lesson, learner), [lesson, learner])
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState<Scores>({})
  const [result, setResult] = useState<{ accuracy: number; xp: number } | null>(null)
  const unit = COURSE.find(u => u.lessons.includes(lesson))!

  // Leaving the lesson stops anything still being read aloud
  useEffect(() => () => stopSpeaking(), [])

  function close() {
    if (phase === 'play' && index > 0 && !confirm('Leave this lesson? Your progress in it won’t be saved.')) return
    go({ name: 'home' })
  }

  function next(score?: { score: number; skipped: boolean }) {
    const all = score ? { ...scores, [index]: score } : scores
    if (score) setScores(all)
    if (index + 1 < steps.length) return setIndex(index + 1)
    const r = { accuracy: accuracy(steps, all), xp: lessonXp(steps, all) }
    setState(s => finishLesson(s, lesson.id, r.accuracy, r.xp))
    setResult(r)
    setPhase('done')
  }

  function restart() {
    setScores({})
    setIndex(0)
    setResult(null)
    setPhase('play')
  }

  if (phase === 'done' && result) return <Results lesson={lesson} result={result} onAgain={restart} />

  const step = steps[index]
  const learnCount = lesson.learn.length
  const label = phase === 'intro' ? '' : step.kind === 'learn'
    ? `Key phrases · ${index + 1} of ${learnCount}`
    : `Conversation with ${lesson.character.name}`

  return (
    <div className="stage" style={{ '--c1': lesson.colors[0], '--c2': lesson.colors[1] } as CSSProperties} role="main" aria-label={`Lesson: ${lesson.title}`}>
      <div className="stage-bg" aria-hidden="true">
        {lesson.props.map((p, i) => <span key={i} className={`prop prop-${i}`}>{p}</span>)}
      </div>

      <div className="stage-ui">
        <div className="stage-top">
          <button className="round-btn" aria-label="Close lesson" onClick={close}><CloseIcon /></button>
          <div className="stage-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={phase === 'intro' ? 0 : index}>
            <i style={{ width: `${phase === 'intro' ? 0 : (index / steps.length) * 100}%` }} />
          </div>
          <button className={'round-btn' + (prefs.slow ? ' on' : '')} aria-label="Read slowly" aria-pressed={prefs.slow}
            onClick={() => setState(s => ({ ...s, prefs: { ...s.prefs, slow: !s.prefs.slow } }))}><TurtleIcon /></button>
        </div>

        {phase === 'intro' ? (
          <Intro lesson={lesson} unitTitle={unit.title} onStart={() => setPhase('play')} />
        ) : (
          <>
            <p className="phase-label">{label}</p>
            <StepView
              key={index}
              step={step}
              lesson={lesson}
              learner={learner}
              prefs={prefs}
              autoListen={autoListen}
              onNext={next}
            />
          </>
        )}
      </div>
    </div>
  )
}

function Intro({ lesson, unitTitle, onStart }: { lesson: Lesson; unitTitle: string; onStart: () => void }) {
  const youLines = lesson.conversation.filter(l => l.who === 'you').length
  return (
    <div className="intro">
      <div className="avatar big" aria-hidden="true">{lesson.character.emoji}</div>
      <p className="intro-kicker">{unitTitle}</p>
      <h1>{lesson.title}</h1>
      <p className="intro-scene">{lesson.scene}</p>
      <ol className="intro-plan">
        <li><b>Learn {lesson.learn.length} key phrases.</b> Listen, then say each one.</li>
        <li><b>Talk with {lesson.character.name}</b>, {lesson.character.role}. You have {youLines} lines to say.</li>
      </ol>
      {!canListen() && <p className="intro-note">This browser can’t listen to you, so you’ll type your answers. For speaking practice, open Bolo in Chrome or Edge.</p>}
      <button className="btn primary wide start" onClick={onStart}><PlayIcon size={22} /> Start lesson</button>
    </div>
  )
}

function Results({ lesson, result, onAgain }: { lesson: Lesson; result: { accuracy: number; xp: number }; onAgain: () => void }) {
  const { prefs, streak } = useStore()
  const days = currentStreak(streak, localDay())
  const done = useRef<HTMLHeadingElement>(null)
  useEffect(() => { done.current?.focus() }, [])
  const praise = result.accuracy >= 90 ? 'बहुत बढ़िया!' : result.accuracy >= 70 ? 'शाबाश!' : 'अच्छी कोशिश!'

  return (
    <main className="results">
      <div className="results-head">
        <p className="hi praise" lang="hi">{praise}</p>
        <h1 ref={done} tabIndex={-1}>Lesson complete</h1>
        <p className="muted">{lesson.title}</p>
      </div>
      <dl className="tiles">
        <div><dt>Accuracy</dt><dd>{result.accuracy}%</dd></div>
        <div><dt>XP earned</dt><dd>+{result.xp}</dd></div>
        <div><dt>Streak</dt><dd>🔥 {days}</dd></div>
      </dl>
      <section className="card tip">
        <h2>Good to know</h2>
        <p>{lesson.tip}</p>
      </section>
      <section className="card">
        <h2>Phrases you learned</h2>
        <ul className="phrase-list">
          {lesson.learn.map((p, i) => {
            const t = personalize(p, prefs)
            return (
              <li key={i}>
                <div>
                  <p className="hi phrase-hi" lang="hi">{t.hi}</p>
                  {prefs.showRom && <p className="phrase-rom">{t.rom}</p>}
                  <p className="phrase-en">{t.en}</p>
                </div>
                <button className="icon-btn" aria-label={`Hear “${t.en}” in Hindi`} onClick={() => speak(t.hi, { slow: prefs.slow })}><SpeakerIcon /></button>
              </li>
            )
          })}
        </ul>
      </section>
      <div className="results-actions">
        <button className="btn" onClick={onAgain}>Practise again</button>
        <button className="btn primary" onClick={() => go({ name: 'home' })}>Continue</button>
      </div>
    </main>
  )
}

