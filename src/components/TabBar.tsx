import { href } from '../lib/router'
import { BookIcon, GearIcon, HomeIcon } from './Icons'

const TABS = [
  { name: 'home', label: 'Learn', icon: <HomeIcon /> },
  { name: 'phrases', label: 'Phrases', icon: <BookIcon /> },
  { name: 'settings', label: 'Settings', icon: <GearIcon /> },
] as const

export function TabBar({ current }: { current: string }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(t => (
        <a key={t.name} href={href({ name: t.name })} className={'tab' + (current === t.name ? ' on' : '')} aria-current={current === t.name ? 'page' : undefined}>
          {t.icon}<span>{t.label}</span>
        </a>
      ))}
    </nav>
  )
}
