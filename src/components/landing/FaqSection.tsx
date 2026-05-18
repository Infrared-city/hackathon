import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const faqs = [
  { q: 'Do I need an API key?', a: 'Yes — get one free at /get-key for hackathon participants.' },
  { q: 'Team size?', a: '1–4 people. Individual submissions welcome.' },
  {
    q: 'What can I build?',
    a: 'Anything using the Infrared SDK — web app, CLI, API, agent, notebook, visualization.',
  },
  { q: 'How are projects judged?', a: 'Technical depth, creativity, real-world impact, and presentation.' },
]

export function FaqSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>FAQ</div>
        <h2 style={h2Style}>Questions</h2>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {faqs.map((f) => (
          <details
            key={f.q}
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: '18px 22px',
            }}
          >
            <summary
              style={{
                fontFamily: fonts.display,
                fontSize: '1rem',
                color: colors.textH,
                cursor: 'pointer',
                fontWeight: 400,
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span>{f.q}</span>
              <span style={{ color: colors.cyan, fontFamily: fonts.mono, fontSize: 18 }}>+</span>
            </summary>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textBody, marginTop: 12 }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
