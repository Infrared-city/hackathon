import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const resources = [
  { title: '10 Jupyter notebooks', body: 'From quickstart to error handling and webhook patterns.' },
  {
    title: 'Infrared SKILL.md',
    body: 'Drop-in agent interface. Works with Claude Code, Cursor, Copilot, Windsurf, Codex.',
  },
  { title: '8 runnable Python scripts', body: 'Including async + webhook demos.' },
  { title: 'Gradio + Hugging Face Spaces recipe', body: 'Ship a public demo in under 30 minutes.' },
]

export function ResourcesSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>What we provide</div>
        <h2 style={h2Style}>Resources</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
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
                fontSize: '1.05rem',
                fontWeight: 400,
                color: colors.textH,
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              {r.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.text }}>{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
