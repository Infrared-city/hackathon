import { colors, fonts, sectionStyle, eyebrowStyle } from './tokens'

const heroStats = [
  { value: '8', label: 'Analysis Types' },
  { value: '< 1 min', label: 'per simulation' },
  { value: 'Any', label: 'city polygon' },
  { value: '€5K', label: 'Prize' },
]

export function HeroSection() {
  return (
    <section
      style={{
        ...sectionStyle,
        paddingTop: 120,
        paddingBottom: 80,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(900px 500px at 50% -10%, rgba(35,229,229,0.10), transparent 60%), radial-gradient(700px 400px at 50% 110%, rgba(100,217,166,0.06), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={eyebrowStyle}>infrared.city SDK Hackathon</div>

        <h1
          className="text-gradient"
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            maxWidth: 980,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          5 lines of code. Any city. Any climate.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
            lineHeight: 1.6,
            color: colors.textBody,
            maxWidth: 780,
            margin: '0 auto 40px',
          }}
        >
          Run wind, solar, and thermal comfort simulations on any city polygon. Build something real. Win €5,000 of
          infrared.city API credits.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 1,
            maxWidth: 880,
            margin: '0 auto 48px',
            border: `1px solid ${colors.border}`,
            background: colors.border,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              style={{ background: colors.bgSurface, padding: '20px 16px', textAlign: 'center' }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                  color: colors.textH,
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colors.text,
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/get-key" className="btn-primary">
            Get your API Key
          </a>
          <a href="/submit" className="btn-outline">
            Submit Project
          </a>
        </div>
      </div>
    </section>
  )
}
