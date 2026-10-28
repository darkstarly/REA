import { COURSE, LESSONS } from '../content/course'
import type { Lesson } from '../content/types'
import { href } from '../lib/router'
import { currentStreak, localDay, useStore } from '../lib/store'
import { CheckIcon } from '../components/Icons'

export const sceneStyle = (l: Lesson) => ({ background: `linear-gradient(135deg, ${l.colors[0]}, ${l.colors[1]})` })

export function Home() {
  const { prefs, lessons, xp, streak } = useStore()
  const next = LESSONS.find(l => !lessons[l.id]?.done)
  const doneCount = LESSONS.filter(l => lessons[l.id]?.done).length
  const days = currentStreak(streak, localDay())

  return (
    <main className="page">
      <header className="home-head">
        <div className="wordmark">Bolo</div>
        <div className="stats">
          <span className="chip streak" title="Days in a row">🔥 {days}</span>
          <span className="chip xp" title="Experience points">⚡ {xp} XP</span>
        </div>
      </header>

      <h1 className="greet"><span className="hi">नमस्ते</span>{prefs.name ? `, ${prefs.name}` : ''}!</h1>
      <p className="muted">{doneCount === 0 ? 'Your first conversation is waiting.' : `${doneCount} of ${LESSONS.length} lessons done. Keep going!`}</p>

      {next ? (
        <a className="up-next" href={href({ name: 'lesson', id: next.id })}>
          <span className="scene-thumb big" style={sceneStyle(next)} aria-hidden="true">{next.character.emoji}</span>
          <span className="up-next-text">
            <small>{doneCount === 0 ? 'Start here' : 'Up next'}</small>
            <strong>{next.title}</strong>
            <span>{next.subtitle}</span>
          </span>
          <span className="btn primary small" aria-hidden="true">Start</span>
        </a>
      ) : (
        <div className="up-next all-done"><strong>You’ve finished every lesson. शाबाश!</strong><span>Replay any lesson below to practise, or review your phrases.</span></div>
      )}

      {COURSE.map((unit, u) => (
        <section className="unit" key={unit.id} aria-labelledby={`unit-${unit.id}`}>
          <h2 id={`unit-${unit.id}`}><span className="unit-num">Unit {u + 1}</span> {unit.title} <span className="hi unit-hi">{unit.hi}</span></h2>
          <ol className="lesson-list">
            {unit.lessons.map(l => {
              const rec = lessons[l.id]
              return (
                <li key={l.id}>
                  <a className={'lesson-row' + (rec?.done ? ' done' : '') + (next?.id === l.id ? ' next' : '')} href={href({ name: 'lesson', id: l.id })}>
                    <span className="scene-thumb" style={sceneStyle(l)} aria-hidden="true">{l.character.emoji}</span>
                    <span className="lesson-text"><strong>{l.title}</strong><span>{l.subtitle}</span></span>
                    {rec?.done
                      ? <span className="badge done"><CheckIcon /> {rec.best}%</span>
                      : next?.id === l.id ? <span className="badge next">Next</span> : null}
                  </a>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </main>
  )
}
