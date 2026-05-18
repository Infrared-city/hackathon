import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const CDN = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev'

const tracks = [
  {
    title: 'Urban Heat',
    apis: 'UTCI · Thermal Comfort Statistics',
    body: 'Map heat stress, find cool corridors, quantify the impact of tree planting.',
    img: `${CDN}/media/image/72la5kotgtpi/optimised.jpg`,
  },
  {
    title: 'Wind & Pedestrian Safety',
    apis: 'Wind Speed · Pedestrian Wind Comfort',
    body: 'Audit developments for Lawson Class E unsafe zones.',
    img: `${CDN}/media/image/j2cjjpkvv1j6/optimised.jpg`,
  },
  {
    title: 'Solar Access & Energy',
    apis: 'Direct Sun Hours · Daylight · Solar Radiation',
    body: 'Solar equity, PV siting, daylighting compliance.',
    img: `${CDN}/media/image/8qr9dn9drf8k/optimised.jpg`,
  },
  {
    title: 'AI Agents & Urban Intelligence',
    apis: 'Natural language → simulation → report',
    body: 'Build an agent using the Infrared SKILL.md interface — works with Claude Code, Cursor, Copilot.',
    img: `${CDN}/media/image/er7xea79kb98/optimised.jpg`,
  },
  {
    title: 'Digital Climate Twin',
    apis: 'SDK + live weather',
    body: 'Near-real-time climate monitoring dashboard for a neighbourhood.',
    img: `${CDN}/media/image/knt968q18gvf/optimised.jpg`,
  },
  {
    title: 'Open',
    apis: 'Any use of the Infrared SDK',
    body: 'Surprise us.',
    img: `${CDN}/media/image/7opse7szf1w2/optimised.jpg`,
  },
]

export function TracksSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>6 tracks</div>
        <h2 style={h2Style}>Challenge tracks</h2>
        <p style={{ color: colors.text, maxWidth: 640, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
          Pick one. Or ignore them all and ship in the Open track.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {tracks.map((t) => (
          <div
            key={t.title}
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.cyanBorder
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(35,229,229,0.08)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Image thumbnail */}
            <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
              <img
                src={t.img}
                alt={`${t.title} simulation example`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(9,28,31,0.1) 40%, rgba(9,28,31,0.85) 100%)',
                }}
              />
            </div>

            {/* Card body */}
            <div style={{ padding: 24 }}>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  color: colors.textH,
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {t.title}
              </h3>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  color: colors.cyan,
                  marginBottom: 10,
                  textTransform: 'uppercase',
                }}
              >
                {t.apis}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: colors.textBody, margin: 0 }}>{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
