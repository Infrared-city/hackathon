import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const audience = [
  {
    title: 'Developers & computational designers',
    body: 'Want to work with environmental simulation data and build on top of a programmable analysis layer.',
  },
  {
    title: 'Architects & urban planners',
    body: 'With coding experience — looking to automate analysis that previously took days of manual setup.',
  },
  {
    title: 'Researchers',
    body: 'Building tools on top of spatial climate data for academic or applied projects.',
  },
  {
    title: 'Students & practitioners',
    body: 'Curious about what you can build when urban climate simulation becomes an API call.',
  },
]

const resources = [
  { title: 'Jupyter notebooks', body: 'From quickstart to error handling — one notebook per analysis type.' },
  { title: 'Infrared SKILL.md', body: 'Drop-in agent interface. Works with Claude Code, Cursor, Copilot, Codex.' },
  { title: 'Python scripts', body: 'Runnable examples including async, webhook, and tiling patterns.' },
  { title: 'Gradio recipe', body: 'Ship a public demo on Hugging Face Spaces in under 30 minutes.' },
]

export function ResourcesSection() {
  return (
    <>
      {/* ── Who this is for ── */}
      <section className="scroll-animate" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={eyebrowStyle}>Who this is for</div>
          <h2 style={h2Style}>Built for builders</h2>
          <p style={{ color: colors.text, maxWidth: 600, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
            You don't need a background in urban planning. You need curiosity and a text editor.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {audience.map((a) => (
            <div
              key={a.title}
              style={{
                background: colors.bgSurface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: colors.textH,
                  marginBottom: 10,
                  lineHeight: 1.35,
                }}
              >
                {a.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.text, margin: 0 }}>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="scroll-animate" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={eyebrowStyle}>What we provide</div>
          <h2 style={h2Style}>Starter kit</h2>
          <p style={{ color: colors.text, maxWidth: 560, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
            Everything you need to go from zero to a working prototype during the event.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {resources.map((r) => (
            <div
              key={r.title}
              style={{
                background: colors.bgSurface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: colors.textH,
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {r.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.text, margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
