import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const CDN = 'https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev'

const tracks = [
  {
    title: 'UTCI — The Tree Budget',
    apis: 'UTCI · Thermal Comfort Statistics',
    body: 'One million euros for canopy. Where does each tree buy back the most °C of street relief?',
    img: `${CDN}/media/image/o43dfya05wkx/optimised.jpg`,
  },
  {
    title: 'Wind — The Downwash',
    apis: 'Wind Speed · Pedestrian Wind Comfort',
    body: 'New tower, new weather. Map what happens at the curb before the building exists.',
    img: `${CDN}/media/image/hcam4d39t8zo/optimised.jpg`,
  },
  {
    title: 'Solar — Daylight Banking',
    apis: 'Direct Sun Hours · Daylight · Solar Radiation',
    body: "Which streets keep their winter sun? Which rooftops are worth harvesting?",
    img: `${CDN}/media/image/j0kq47vvwrzq/optimised.jpg`,
    imgPosition: 'center 35%',
  },
  {
    title: 'AI Agent — Citizen Voice / Chat',
    apis: 'Voice · SDK · Open data',
    body: '"Hey, is my street getting hotter?" A phone-callable agent grounded in simulation + open data.',
    img: `${CDN}/media/image/6wy0nxn7938v/optimised.jpg`,
  },
  {
    title: 'Live Weather — Event Operator',
    apis: 'Live weather · SDK · Agent',
    body: 'The Donauinselfest watcher. Flag the hot, windy, UV-risky hours — with maps showing where trouble lands.',
    img: `${CDN}/media/image/g2ro30lpeoib/optimised.jpg`,
  },
  {
    title: 'GIS — The Cool Route',
    apis: 'Satellite imagery · GIS · Routing',
    body: 'Pull trees and surfaces from satellite imagery, then plan the shadiest run home.',
    img: `${CDN}/media/image/f9w8515rk47d/optimised.jpg`,
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

      <div className="tracks-grid">
        {tracks.map((t) => {
          const imgStyle = t.imgPosition ? { objectPosition: t.imgPosition } : undefined
          return (
            <div key={t.title} className="track-card">
              {/* Image stack: base + blurred saturated bloom overlay */}
              <div className="track-img-wrap">
                <img
                  src={t.img}
                  alt={`${t.title} simulation example`}
                  loading="lazy"
                  className="track-img"
                  style={imgStyle}
                />
                <img
                  src={t.img}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="track-glow"
                  style={imgStyle}
                />
              </div>

              {/* Card body */}
              <div style={{ padding: '20px 22px 22px' }}>
                <h3
                  style={{
                    fontFamily: fonts.display,
                    fontSize: '1.05rem',
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
                <p style={{ fontSize: 13, lineHeight: 1.6, color: colors.textBody, margin: 0 }}>{t.body}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Open track — highlighted pill below the grid */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div className="open-pill">
          <span className="open-pill-tag">Open track</span>
          <span style={{ color: colors.textBody, fontSize: 14 }}>
            Any use of the Infrared SDK. <span style={{ color: colors.textH }}>Surprise us.</span>
          </span>
        </div>
      </div>
    </section>
  )
}
