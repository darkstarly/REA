import { useEffect, useState } from 'react'
import { canListen, canSpeak, hasHindiVoice, speak } from '../lib/speech'
import { resetAll, setState, useStore, type Prefs } from '../lib/store'

export function Settings() {
  const { prefs } = useStore()
  const [voice, setVoice] = useState(hasHindiVoice)
  const set = (p: Partial<Prefs>) => setState(s => ({ ...s, prefs: { ...s.prefs, ...p } }))

  // The voice list can arrive after the page opens
  useEffect(() => {
    if (!canSpeak()) return
    const update = () => setVoice(hasHindiVoice())
    speechSynthesis.addEventListener('voiceschanged', update)
    const t = setTimeout(update, 500)
    return () => { clearTimeout(t); speechSynthesis.removeEventListener('voiceschanged', update) }
  }, [])

  return (
    <main className="page">
      <h1 className="page-title">Settings</h1>

      <section className="card settings">
        <label className="field">
          <span>Your first name</span>
          <input value={prefs.name} onChange={e => set({ name: e.target.value })} placeholder="e.g. Alex" maxLength={30} autoComplete="given-name" />
        </label>

        <fieldset className="segmented">
          <legend>Teach me the forms for</legend>
          <label className={prefs.form === 'm' ? 'on' : ''}><input type="radio" name="form" checked={prefs.form === 'm'} onChange={() => set({ form: 'm' })} />A man <span className="hi">नया हूँ</span></label>
          <label className={prefs.form === 'f' ? 'on' : ''}><input type="radio" name="form" checked={prefs.form === 'f'} onChange={() => set({ form: 'f' })} />A woman <span className="hi">नई हूँ</span></label>
        </fieldset>

        <label className="toggle">
          <span>Show English letters under the Hindi</span>
          <input type="checkbox" role="switch" checked={prefs.showRom} onChange={e => set({ showRom: e.target.checked })} />
        </label>
        <label className="toggle">
          <span>Read phrases slowly</span>
          <input type="checkbox" role="switch" checked={prefs.slow} onChange={e => set({ slow: e.target.checked })} />
        </label>
      </section>

      <section className="card settings">
        <h2>Speech on this device</h2>
        <p className={canListen() ? 'ok' : 'warn'}>{canListen() ? '✓ Speaking practice is available.' : '✗ This browser can’t listen. Use Chrome or Edge to practise speaking; you can still type your answers.'}</p>
        <p className={voice ? 'ok' : 'warn'}>{voice === undefined ? 'Checking for a Hindi voice…' : voice ? '✓ A Hindi voice is installed.' : '✗ No Hindi voice is installed, so lines can’t be read aloud. Add a Hindi voice in your device’s text-to-speech settings.'}</p>
        <button className="btn" onClick={() => speak('नमस्ते! आप कैसे हैं?', { slow: prefs.slow })}>Test the voice</button>
      </section>

      <section className="card settings">
        <h2>Progress</h2>
        <p className="muted">Your progress is saved in this browser only.</p>
        <button className="btn danger" onClick={() => { if (confirm('Reset all progress, XP and your streak? This can’t be undone.')) resetAll() }}>Reset progress</button>
      </section>
    </main>
  )
}
