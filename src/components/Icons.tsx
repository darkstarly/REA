import type { ReactNode } from 'react'

// Icons. Decorative: the buttons that hold them carry the label.
const svg = (size: number, children: ReactNode, fill = false) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

export const MicIcon = ({ size = 34 }) => svg(size, <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>)
export const SpeakerIcon = ({ size = 24 }) => svg(size, <><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></>)
export const KeyboardIcon = ({ size = 24 }) => svg(size, <><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M8 14h8" /></>)
export const CloseIcon = ({ size = 22 }) => svg(size, <path d="M5 5l14 14M19 5L5 19" />)
export const NextIcon = ({ size = 32 }) => svg(size, <path d="M5 12h14M13 6l6 6-6 6" />)
export const PlayIcon = ({ size = 30 }) => svg(size, <path d="M8 5v14l11-7z" />, true)
export const CheckIcon = ({ size = 18 }) => svg(size, <path d="M5 12.5l4.5 4.5L19 7.5" />)
export const BookIcon = ({ size = 24 }) => svg(size, <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h7" /></>)
export const HomeIcon = ({ size = 24 }) => svg(size, <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>)
export const GearIcon = ({ size = 24 }) => svg(size, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>)
export const TurtleIcon = ({ size = 22 }) => svg(size, <><path d="M4 15c0-4 3.6-7 8-7s8 3 8 7z" /><path d="M20 15h1.5a1.5 1.5 0 0 0 0-3H20M6 15l-1 3M18 15l1 3M9 9l1.5 6M15 9l-1.5 6" /></>)
