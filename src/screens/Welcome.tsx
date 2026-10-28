import { useState } from 'react'
import { setState, useStore } from '../lib/store'
import type { Form } from '../lib/lesson'

/** First run: what Bolo is, the learner's name, and which gender forms to teach */
export function Welcome() {
  const { prefs } = useStore()
  const [page, setPage] = useState(0)
  const [name, setName] = useState(prefs.name)

  function finish(form: Form) {
    setState(s => ({ ...s, onboarded: true, prefs: { ...s.prefs, name: name.trim(), form } }))
    location.hash = '#/'
  }

  return (
    <main className="welcome">
      {page === 0 && (
        <section className="welcome-page">
          <div className="logo-mark" aria-hidden="true">बोलो</div>
          <h1>Bolo</h1>
          <p className="lede">Speak Hindi from your very first lesson.</p>
          <ul className="welcome-points">
            <li><span aria-hidden="true">🎭</span>Short conversations with people you’d really meet: a neighbour, a chai seller, an auto driver.</li>
            <li><span aria-hidden="true">🎙️</span>Say every line out loud and get instant feedback on what you said.</li>
            <li><span aria-hidden="true">✍️</span>Every phrase in Hindi script, in English letters, and in English.</li>
          </ul>
          <button className="btn primary wide" onClick={() => setPage(1)}>Get started</button>
        </section>
      )}
      {page === 1 && (
        <section className="welcome-page">
          <p className="step-count">1 of 2</p>
          <h2>What should we call you?</h2>
          <p className="muted">Your name appears in your lessons, so you can introduce yourself: मेरा नाम {name.trim() || '…'} है.</p>
          <label className="field">
            <span>First name</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex" autoComplete="given-name" maxLength={30}
              onKeyDown={e => { if (e.key === 'Enter') setPage(2) }} />
          </label>
          <button className="btn primary wide" onClick={() => setPage(2)}>{name.trim() ? 'Continue' : 'Skip'}</button>
        </section>
      )}
      {page === 2 && (
        <section className="welcome-page">
          <p className="step-count">2 of 2</p>
          <h2>Which forms should we teach you?</h2>
          <p className="muted">In Hindi, some words change with the speaker’s gender. You can change this any time in Settings.</p>
          <div className="choice-list">
            <button className="choice" onClick={() => finish('m')}>
              <strong>Masculine forms</strong>
              <span className="hi">मैं यहाँ नया हूँ</span>
              <small>“I am new here”, as a man says it</small>
            </button>
            <button className="choice" onClick={() => finish('f')}>
              <strong>Feminine forms</strong>
              <span className="hi">मैं यहाँ नई हूँ</span>
              <small>“I am new here”, as a woman says it</small>
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
