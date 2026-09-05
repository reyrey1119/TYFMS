// Line-icon set — replaces emoji used as functional UI icons (nav, section
// markers). Single stroke weight, no fill, so they read consistently at the
// small sizes used in the sidebar / bottom nav / mobile sheet.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }

function Svg({ children, size = 18, ...props }) {
  return <svg {...base} width={size} height={size} {...props}>{children}</svg>
}

export const Icons = {
  home: p => <Svg {...p}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h5v-6h2v6h5v-9" /></Svg>,
  compass: p => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m14.5 9.5-2 5-5 2 2-5z" /></Svg>,
  user: p => <Svg {...p}><circle cx="12" cy="8" r="3.3" /><path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" /></Svg>,
  chat: p => <Svg {...p}><path d="M4 19V6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v13l-3-2-3 2-3-2-3 2Z" /></Svg>,
  bolt: p => <Svg {...p}><path d="M13 3 4 14h6l-1 7 9-11h-6z" /></Svg>,
  lock: p => <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></Svg>,
  handshake: p => <Svg {...p}><path d="m2 12 4-4 4 3 3-2.5L18 13" /><path d="m9 11-3 3 2 2 3-2" /><path d="m22 12-4-4-3 2.5" /></Svg>,
  book: p => <Svg {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 0 4 23z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 1 2.5 2" /></Svg>,
  network: p => <Svg {...p}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M10.5 6.5 6.5 17M13.5 6.5l4 10.5M8 19h8" /></Svg>,
  document: p => <Svg {...p}><path d="M7 3h8l4 4v14H7z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>,
  trend: p => <Svg {...p}><path d="M4 17 10 10l4 4 6-8" /><path d="M15 6h5v5" /></Svg>,
  clipboard: p => <Svg {...p}><rect x="6" y="4.5" width="12" height="16" rx="1.5" /><path d="M9 4.5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v1" /><path d="M9 11h6M9 15h6" /></Svg>,
  checkCircle: p => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.3 2.3L16 10" /></Svg>,
  info: p => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" /></Svg>,
  star: p => <Svg {...p}><path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6-4.3-4.2 6-.9z" /></Svg>,
  lightbulb: p => <Svg {...p}><path d="M9 18h6M10 21h4" /><path d="M7 10a5 5 0 1 1 10 0c0 2-1.2 3-2 4.2-.5.8-.6 1.3-.6 1.8H9.6c0-.5-.1-1-.6-1.8C8.2 13 7 12 7 10Z" /></Svg>,
  menu: p => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>,
  search: p => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.3-4.3" /></Svg>,
  shield: p => <Svg {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></Svg>,
  close: p => <Svg {...p}><path d="m5 5 14 14M19 5 5 19" /></Svg>,
  chevron: p => <Svg {...p}><path d="m8 5 8 7-8 7" /></Svg>,
}

export function Icon({ name, ...props }) {
  const C = Icons[name]
  return C ? <C {...props} /> : null
}
