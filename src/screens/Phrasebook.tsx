import { LESSONS } from '../content/course'
import { personalize } from '../lib/lesson'
import { href } from '../lib/router'
import { speak } from '../lib/speech'
import { useStore } from '../lib/store'
import { SpeakerIcon } from '../components/Icons'
import { sceneStyle } from './Home'

/** Every key phrase from the lessons the learner has finished, to listen to again */
export function Phrasebook() {
  const { lessons, prefs } = useStore()
  const learned = LESSONS.filter(l => lessons[l.id]?.done)

  return (
    <main className="page">
      <h1 className="page-title">Your phrases</h1>
      {!learned.length ? (
        <div className="empty">
          <p>Finish a lesson and its key phrases will appear here, ready to listen to again.</p>
          <a className="btn primary" href={href({ name: 'home' })}>Go to lessons</a>
        </div>
      ) : learned.map(l => (
        <section className="phrase-group" key={l.id}>
          <h2><span className="scene-thumb tiny" style={sceneStyle(l)} aria-hidden="true">{l.character.emoji}</span>{l.title}</h2>
          <ul className="phrase-list">
            {l.learn.map((p, i) => {
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
      ))}
    </main>
  )
}
