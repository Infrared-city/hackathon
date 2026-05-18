import { colors, sectionStyle, h2Style } from './tokens'

export function FinalCtaSection() {
  return (
    <section className="scroll-animate" style={{ ...sectionStyle, paddingBottom: 140, textAlign: 'center' }}>
      <h2 style={{ ...h2Style, marginBottom: 16 }}>Ready to build?</h2>
      <p style={{ color: colors.text, maxWidth: 540, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.6 }}>
        Grab a key. Ship something real. Win €5K.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/get-key" className="btn-primary">
          Get your API Key
        </a>
        <a href="/participants" className="btn-outline">
          Find Teammates
        </a>
      </div>
    </section>
  )
}
