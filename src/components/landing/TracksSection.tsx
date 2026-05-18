import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const CDN = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev'

const tracks = [
  {
    title: 'UTCI — The Tree Budget',
    apis: 'UTCI · Thermal Comfort Statistics',
    body: 'One million euros for canopy. Where does each tree buy back the most °C of street relief — sidewalks, sewers, and sightlines accounted for?',
    img: `${CDN}/media/image/o43dfya05wkx/optimised.jpg`,
  },
  {
    title: 'Wind — The Downwash',
    apis: 'Wind Speed · Pedestrian Wind Comfort',
    body: 'New tower, new weather. Map what happens at the curb under the building before the building exists.',
    img: `${CDN}/media/image/hcam4d39t8zo/optimised.jpg`,
  },
  {
    title: 'Solar — Daylight Banking',
    apis: 'Direct Sun Hours · Daylight · Solar Radiation',
    body: "Which streets keep their winter sun, and which rooftops are worth harvesting? Find the city's daylight savings account.",
    img: `${CDN}/media/image/j0kq47vvwrzq/optimised.jpg`,
  },
  {
    title: 'AI Agent — Citizen Voice / Chat',
    apis: 'Voice · SDK · Open data',
    body: '"Hey, is my street getting hotter?" Build the phone-callable agent that answers neighborhood questions in plain language — grounded in simulation + open data.',
    img: `${CDN}/media/image/6wy0nxn7938v/optimised.jpg`,
  },
  {
    title: 'Live Weather — Event Operator',
    apis: 'Live weather · SDK · Agent',
    body: 'The Donauinselfest watcher. An agent that scans the 72h forecast for an outdoor event and flags the hot, windy, UV-risky hours — with maps showing exactly where the trouble lands.',
    img: `${CDN}/media/image/g2ro30lpeoib/optimised.jpg`,
  },
  {
    title: 'GIS — The Cool Route',
    apis: 'Satellite imagery · GIS · Routing',
    body: "Pull trees and surfaces from satellite imagery, then plan the shadiest run home. Plug into Strava, health apps, and the city's own GIS — self-optimization meets urban planning.",
    img: `${CDN}/media/image/f9w8515rk47d/optimised.jpg`,
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
        <div style={eyebrowStyle}>6 challenges + Open</div>
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
