import { colors, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const CDN         = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev'
const AGENT_ORBIT = `${CDN}/media/image/er7xea79kb98/optimised.jpg`
const SDK_PLAYGROUND = 'https://sdk-playground-14t.pages.dev/?embed=1'

export function SDKVisualSection() {
  return (
    <>
      {/* ── Interactive SDK playground ── */}
      <section className="scroll-animate" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={eyebrowStyle}>Infrared SDK</div>
          <h2 style={h2Style}>8 analyses, one SDK</h2>
          <p style={{ color: colors.text, maxWidth: 640, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
            Wind, sun, daylight, sky view, thermal comfort — all from a single Python client.
            Try it live below — real simulation endpoints, all eight engines.
          </p>
        </div>

        {/* Playground iframe */}
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 0 80px rgba(35,229,229,0.08), 0 24px 64px rgba(0,0,0,0.5)',
            position: 'relative',
            aspectRatio: '16 / 10',
          }}
        >
          <iframe
            src={SDK_PLAYGROUND}
            title="Infrared SDK Playground — try all 8 analyses live"
            loading="lazy"
            allow="clipboard-write"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </div>

        <p
          style={{
            textAlign: 'center',
            color: colors.text,
            fontSize: 13,
            marginTop: 16,
            lineHeight: 1.5,
          }}
        >
          Live simulation endpoints, automatic tiling for large areas, all eight engines.{' '}
          <a
            href="https://infrared.city/docs/sdk/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.cyan, textDecoration: 'none' }}
          >
            Read the docs →
          </a>
        </p>
      </section>

      {/* ── AI agents row ── */}
      <section
        className="scroll-animate"
        style={{
          ...sectionStyle,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={eyebrowStyle}>Infrared Skills</div>
          <h2 style={{ ...h2Style, textAlign: 'left' }}>Build with your AI agents.</h2>
          <p style={{ color: colors.textBody, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            Drop-in skills for Claude Code, Cursor, and Codex, plus a Jupyter cookbook for every analysis.
            Your agents and your engineers share the same recipes — integrations that used to take a sprint
            now ship in an afternoon.
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 10, marginBottom: 32 }}>
            {[
              'Natural language → simulation → georeferenced result',
              'Works with Claude Code, Cursor, and Copilot',
              'Notebooks for every analysis type',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: colors.textBody }}>
                <span style={{ color: colors.cyan, flexShrink: 0 }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/Infrared-city/infrared-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ display: 'inline-flex' }}
          >
            Browse on GitHub
          </a>
        </div>

        <div
          style={{
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 60px rgba(35,229,229,0.1), 0 16px 48px rgba(0,0,0,0.5)`,
          }}
        >
          <img
            src={AGENT_ORBIT}
            alt="Infrared agent skills orbit — Claude, OpenAI, Cursor logos with simulation glyphs"
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>
    </>
  )
}
