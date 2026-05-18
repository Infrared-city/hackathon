import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const prizes = [
  {
    rank: 'Grand Prize',
    title: '€5,000 of infrared.city API credits',
    body: "That's ~120,000 simulations. Keep building.",
    highlight: true,
  },
  {
    rank: 'Runner-up',
    title: '3 months Pro API access',
    body: 'Full SDK access, priority queue.',
    highlight: false,
  },
  {
    rank: 'Best AI Agent',
    title: 'Featured in infrared.city developer showcase',
    body: 'Public visibility to the Infrared dev community.',
    highlight: false,
  },
]

export function PrizesSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>Prizes</div>
        <h2 style={h2Style}>What you win</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {prizes.map((p) => (
          <div
            key={p.rank}
            style={{
              background: p.highlight
                ? `linear-gradient(180deg, ${colors.cyanDim}, ${colors.bgSurface})`
                : colors.bgSurface,
              border: `1px solid ${p.highlight ? colors.cyanBorder : colors.border}`,
              borderRadius: 12,
              padding: 32,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                letterSpacing: '0.12em',
                color: p.highlight ? colors.cyan : colors.text,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {p.rank}
            </div>
            <h3
              style={{
                fontFamily: fonts.display,
                fontSize: p.highlight ? '1.5rem' : '1.2rem',
                fontWeight: 400,
                color: colors.textH,
                marginBottom: 12,
                lineHeight: 1.25,
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textBody }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
