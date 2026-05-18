import { colors, sectionStyle, h2Style } from './tokens'

export function FinalCtaSection() {
  return (
    <section
      className="scroll-animate"
      style={{
        ...sectionStyle,
        paddingBottom: 140,
        textAlign: 'center',
      }}
    >
      <h2 style={{ ...h2Style, marginBottom: 16 }}>Ready to build?</h2>
      <p style={{ color: colors.text, maxWidth: 560, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.7 }}>
        Climate simulation data is only useful if it can be acted on. Three days. Real data. Your ideas.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/get-key" className="btn-primary">
          Join the Buildathon
        </a>
        <a href="/participants" className="btn-outline">
          Find Teammates
        </a>
      </div>
      <p
        style={{
          marginTop: 28,
          color: colors.text,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        Kickoff · Wednesday May 27th, 17:00 CET · Online
      </p>
    </section>
  )
}
