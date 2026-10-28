// A tiny hash router: #/ (home), #/lesson/<id>, #/phrases, #/settings.
// Hash URLs work on any static host with no server configuration.
import { useSyncExternalStore } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'lesson'; id: string }
  | { name: 'phrases' }
  | { name: 'settings' }

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'lesson' && parts[1]) return { name: 'lesson', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 'phrases') return { name: 'phrases' }
  if (parts[0] === 'settings') return { name: 'settings' }
  return { name: 'home' }
}

export function href(r: Route) {
  return r.name === 'lesson' ? `#/lesson/${encodeURIComponent(r.id)}` : r.name === 'home' ? '#/' : `#/${r.name}`
}

export function go(r: Route) {
  location.hash = href(r)
}

const subscribe = (l: () => void) => { window.addEventListener('hashchange', l); return () => window.removeEventListener('hashchange', l) }

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => location.hash, () => '')
  return parse(hash)
}
