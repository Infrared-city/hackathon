import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const prizes = [
  {
    rank: '1st place',
    amount: '€5,000',
    title: 'in infrared.city credits',
    body: "That's ~120,000 simulations. Keep building on real urban climate data.",
    highlight: true,
  },
  {
    rank: '2nd place',
    amount: '€2,000',
    title: 'in credits',
    body: 'Full SDK access to take your project further after the event.',
    highlight: false,
  },
  {
    rank: '3rd place',
    amount: '€1,000',
    title: 'in credits',
    body: 'Plus feedback from the infrared.city team on your submission.',
    highlight: false,
  },
]

export function PrizesSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>🏆 Prizes</div>
        <h2 style={h2Style}>What you win</h2>
        <p style={{ color: colors.text, maxWidth: 560, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
          Credits are redeemable for any infrared.city simulation — wind, solar, thermal, daylight.
          Use them to keep building after the event.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {prizes.map((p) => (
          <div
            key={p.rank}
            className="prize-card"
            style={{
              background: p.highlight
                ? `linear-gradient(160deg, rgba(35,229,229,0.07), ${colors.bgSurface})`
                : colors.bgSurface,
              border: `1px solid ${p.highlight ? colors.cyanBorder : colors.border}`,
              borderRadius: 14,
              padding: 32,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: p.highlight ? colors.cyan : colors.text,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {p.rank}
            </div>
            <div
              className={`${p.highlight ? 'text-gradient prize-amount-large' : 'prize-amount'}`}
              style={{
                fontFamily: fonts.display,
                fontSize: p.highlight ? '3rem' : '2.25rem',
                fontWeight: 300,
                color: p.highlight ? undefined : colors.textH,
                lineHeight: 1,
                marginBottom: 4,
                letterSpacing: '-0.02em',
              }}
            >
              {p.amount}
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: '1rem',
                color: colors.textH,
                marginBottom: 14,
                fontWeight: 400,
              }}
            >
              {p.title}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textBody, margin: 0 }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
