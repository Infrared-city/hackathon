import { HACKATHON_START, HACKATHON_END } from '../../lib/config'
import { colors, fonts } from './tokens'

const TITLE = 'Infrared SDK Buildathon'
const DETAILS =
  '5 lines of code. Any city. Any climate.\n\nKickoff Wed May 27 17:00 CET · Submission deadline Sun May 31 24:00 CET · Winners Tue Jun 2.\n\nhttps://hackathon.infrared.city'
const LOCATION = 'Online'

function gcalLink() {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${fmt(HACKATHON_START)}/${fmt(HACKATHON_END)}`,
    details: DETAILS,
    location: LOCATION,
  })
  return `https://www.google.com/calendar/render?${params.toString()}`
}

function outlookLink() {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru:  'addevent',
    subject:  TITLE,
    body:     DETAILS,
    location: LOCATION,
    startdt:  HACKATHON_START.toISOString(),
    enddt:    HACKATHON_END.toISOString(),
  })
  return `https://outlook.live.com/owa/?${params.toString()}`
}

const ICS_HREF = '/hackathon.ics' // served as a static file (public/hackathon.ics)

const linkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 14px',
  minHeight: 44,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  fontFamily: fonts.mono,
  fontSize: 12,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: colors.text,
  textDecoration: 'none',
  background: 'transparent',
  transition: 'border-color 0.15s, color 0.15s',
  boxSizing: 'border-box',
}

export function AddToCalendar() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: 13, color: colors.text, fontFamily: fonts.sans }}>📅 Save the date:</span>
      <a href={gcalLink()}    target="_blank" rel="noopener noreferrer" style={linkStyle}>Google</a>
      <a href={outlookLink()} target="_blank" rel="noopener noreferrer" style={linkStyle}>Outlook</a>
      <a href={ICS_HREF}      download="infrared-hackathon-2026.ics"     style={linkStyle}>Apple / iCal</a>
    </div>
  )
}
