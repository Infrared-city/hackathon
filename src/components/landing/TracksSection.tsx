import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const tracks = [
  {
    icon: '🌡',
    title: 'Urban Heat',
    apis: 'UTCI · Thermal Comfort Statistics',
    body: 'Map heat stress, find cool corridors, quantify the impact of tree planting.',
  },
  {
    icon: '💨',
    title: 'Wind & Pedestrian Safety',
    apis: 'Wind Speed · Pedestrian Wind Comfort',
    body: 'Audit developments for Lawson Class E unsafe zones.',
  },
  {
    icon: '☀️',
    title: 'Solar Access & Energy',
    apis: 'Direct Sun Hours · Daylight · Solar Radiation',
    body: 'Solar equity, PV siting, daylighting compliance.',
  },
  {
    icon: '🌍',
    title: 'Climate Adaptation',
    apis: 'All 8 analyses · seasonal',
    body: 'Before/after scenario comparison, green infrastructure ROI.',
  },
  {
    icon: '🤖',
    title: 'AI Agents',
    apis: 'Natural language → simulation → report',
    body: 'Build an agent using the Infrared SKILL.md interface (works with Claude Code, Cursor, Copilot).',
  },
  {
    icon: '🏙️',
    title: 'Digital Climate Twin',
    apis: 'SDK + live weather',
    body: 'Near-real-time climate monitoring dashboard for a neighbourhood.',
  },
  {
    icon: '🔓',
    title: 'Open',
    apis: 'Any use of the Infrared SDK',
    body: 'Surprise us.',
  },
]

export function TracksSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>7 tracks</div>
        <h2 style={h2Style}>Challenge tracks</h2>
        <p style={{ color: colors.text, maxWidth: 640, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
          Pick one. Or ignore them all and ship in the Open track.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {tracks.map((t) => (
          <div
            key={t.title}
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 28,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.cyanBorder
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>{t.icon}</div>
            <h3
              style={{
                fontFamily: fonts.display,
                fontSize: '1.2rem',
                fontWeight: 400,
                color: colors.textH,
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              {t.title}
            </h3>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                letterSpacing: '0.06em',
                color: colors.cyan,
                marginBottom: 12,
                textTransform: 'uppercase',
              }}
            >
              {t.apis}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textBody }}>{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
