import { useEffect } from 'react'
import { findLesson } from './content/course'
import { canSpeak } from './lib/speech'
import { useRoute } from './lib/router'
import { useStore } from './lib/store'
import { Welcome } from './screens/Welcome'
import { Home } from './screens/Home'
import { Phrasebook } from './screens/Phrasebook'
import { Settings } from './screens/Settings'
import { LessonPlayer } from './screens/LessonPlayer'
import { TabBar } from './components/TabBar'

export function App() {
  const state = useStore()
  const route = useRoute()

  // Browsers load their voice list lazily; asking early means a Hindi voice is ready by the first lesson
  useEffect(() => {
    if (!canSpeak()) return
    speechSynthesis.getVoices()
    const load = () => speechSynthesis.getVoices()
    speechSynthesis.addEventListener('voiceschanged', load)
    return () => speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  if (!state.onboarded) return <Welcome />

  if (route.name === 'lesson') {
    const lesson = findLesson(route.id)
    if (lesson) return <LessonPlayer key={lesson.id} lesson={lesson} />
  }

  return (
    <div className="shell">
      {route.name === 'phrases' ? <Phrasebook /> : route.name === 'settings' ? <Settings /> : <Home />}
      <TabBar current={route.name === 'lesson' ? 'home' : route.name} />
    </div>
  )
}
