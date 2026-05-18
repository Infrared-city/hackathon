import { colors, fonts, sectionStyle, eyebrowStyle } from './tokens'

const SF_THERMAL = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev/media/image/7dlrnpjlip7g/optimised.jpg'

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
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(900px 500px at 50% -10%, rgba(35,229,229,0.07), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="two-col-stack"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* ── Left: text ── */}
        <div>
          <div style={eyebrowStyle}>infrared.city SDK Hackathon</div>

          <h1
            className="text-gradient"
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            5 lines of code.
            <br />
            Any city.
            <br />
            Any climate.
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
              lineHeight: 1.65,
              color: colors.textBody,
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            Three days to explore what's possible when urban climate data becomes an API call.
            Build an app, a workflow, a reporting tool, a plugin — and win up to €5,000 in infrared.city credits.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="/get-key" className="btn-primary">
              Join the Hackathon
            </a>
            <a href="/submit" className="btn-outline">
              Submit Project
            </a>
          </div>

          {/* stats bar */}
          <div
            className="hero-stats"
            style={{
              border: `1px solid ${colors.border}`,
              background: colors.border,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {heroStats.map((s) => (
              <div
                key={s.label}
                style={{ background: colors.bgSurface, padding: '16px 12px', textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
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
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: colors.text,
                    marginTop: 5,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: city visualization ── */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 0 80px rgba(35,229,229,0.12), 0 24px 64px rgba(0,0,0,0.6)`,
              aspectRatio: '16/10',
              position: 'relative',
            }}
          >
            <img
              src={SF_THERMAL}
              alt="3D city thermal simulation — San Francisco with heat-comfort overlay"
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* bottom fade into dark bg */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(9,28,31,0.7) 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* label chip */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                background: 'rgba(9,28,31,0.85)',
                border: `1px solid ${colors.cyanBorder}`,
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: 11,
                fontFamily: fonts.mono,
                color: colors.cyan,
                letterSpacing: '0.06em',
                backdropFilter: 'blur(8px)',
              }}
            >
              SDK · gen_grid_image() · San Francisco
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
