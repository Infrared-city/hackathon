import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const CDN = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev'

const ANALYSES_COLLAGE = `${CDN}/media/image/c9glcf6lj0vm/optimised.jpg`
const AGENT_ORBIT     = `${CDN}/media/image/er7xea79kb98/optimised.jpg`

const analyses = [
  { label: 'Wind Speed', img: `${CDN}/media/image/j2cjjpkvv1j6/optimised.jpg` },
  { label: 'Pedestrian Wind Comfort', img: `${CDN}/media/image/pne2rkdkrv3c/optimised.jpg` },
  { label: 'Daylight Availability', img: `${CDN}/media/image/cgmaum9s9aja/optimised.jpg` },
  { label: 'Direct Sun Hours', img: `${CDN}/media/image/6q6ilj1cr4cb/optimised.jpg` },
  { label: 'Sky View Factor', img: `${CDN}/media/image/w9tc6rmfld8e/optimised.jpg` },
  { label: 'Solar Radiation', img: `${CDN}/media/image/8qr9dn9drf8k/optimised.jpg` },
  { label: 'UTCI Thermal Comfort', img: `${CDN}/media/image/wg5dimserojh/optimised.jpg` },
  { label: 'Thermal Comfort Stats', img: `${CDN}/media/image/k4len4f6br7a/optimised.jpg` },
]

export function SDKVisualSection() {
  return (
    <>
      {/* ── 8 analyses showcase ── */}
      <section className="scroll-animate" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={eyebrowStyle}>Infrared SDK</div>
          <h2 style={h2Style}>8 analyses, one SDK</h2>
          <p style={{ color: colors.text, maxWidth: 640, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
            Wind, sun, daylight, sky view, thermal comfort — all available from a single Python client.
            Each analysis returns a georeferenced heatmap ready to render, export, or feed into your pipeline.
          </p>
        </div>

        {/* Wide collage */}
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            marginBottom: 32,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={ANALYSES_COLLAGE}
            alt="All 8 SDK analyses rendered side-by-side"
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Individual chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {analyses.map((a) => (
            <div
              key={a.label}
              style={{
                background: colors.bgSurface,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 90, overflow: 'hidden' }}>
                <img
                  src={a.img}
                  alt={a.label}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div
                style={{
                  padding: '8px 10px',
                  fontSize: 11,
                  fontFamily: fonts.mono,
                  color: colors.textBody,
                  letterSpacing: '0.03em',
                }}
              >
                {a.label}
              </div>
            </div>
          ))}
        </div>
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
          <ul
            style={{
              listStyle: 'none',
              display: 'grid',
              gap: 10,
              marginBottom: 32,
            }}
          >
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
