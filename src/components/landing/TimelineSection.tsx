import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const steps = [
  { n: '1', title: 'Register & Get Key', body: 'Free API key for hackathon participants. Instant assignment.' },
  { n: '2', title: 'Build', body: 'Wind, solar, thermal comfort, daylight — on any polygon you draw.' },
  { n: '3', title: 'Submit', body: 'GitHub repo, demo URL, short video. Public gallery, immediate.' },
  { n: '4', title: 'Win', body: '€5,000 API credits. Featured in the developer showcase.' },
]

export function TimelineSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>Process</div>
        <h2 style={h2Style}>How it works</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}
      >
        {steps.map((step) => (
          <div
            key={step.n}
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.cyan,
                letterSpacing: '0.12em',
                marginBottom: 16,
              }}
            >
              STEP {step.n}
            </div>
            <h3
              style={{
                fontFamily: fonts.display,
                fontSize: '1.15rem',
                fontWeight: 400,
                color: colors.textH,
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.text }}>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
