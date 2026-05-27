import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const days = [
  {
    date: 'Wednesday · May 27',
    label: 'Kickoff',
    events: [
      { time: '17:00–19:00 CET', title: 'Online kickoff', note: 'SDK intro, challenge prompts, Q&A' },
    ],
  },
  {
    date: 'Thursday · May 28',
    label: 'Day 1',
    events: [
      { time: '09:00–10:00 CET', title: 'Open Q&A', note: 'Drop in, not mandatory' },
      { time: '17:00–18:00 CET', title: 'Afternoon checkup', note: '' },
    ],
  },
  {
    date: 'Friday · May 29',
    label: 'Day 2',
    events: [
      { time: '09:00–10:00 CET', title: 'Open Q&A', note: 'Drop in, not mandatory' },
      { time: '17:00–19:00 CET', title: 'Closing session', note: 'Submission walkthrough, final Q&A' },
    ],
  },
  {
    date: 'Sunday · May 31',
    label: 'Deadline',
    events: [
      { time: 'End of day', title: 'Submission deadline', note: 'GitHub repo, demo, short description' },
    ],
  },
  {
    date: 'Tuesday · June 2',
    label: 'Results',
    events: [
      { time: '17:00 CET', title: 'Winner announcement', note: 'Online' },
    ],
  },
]

export function TimelineSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>📅 May 27–31, 2026 · Online</div>
        <h2 style={h2Style}>Schedule</h2>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 2 }}>
        {days.map((day, i) => (
          <div
            key={day.date}
            className="timeline-row"
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: i === 0 ? '10px 10px 0 0' : i === days.length - 1 ? '0 0 10px 10px' : 0,
              overflow: 'hidden',
            }}
          >
            {/* Date column */}
            <div
              style={{
                padding: '20px 20px',
                borderRight: `1px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colors.cyan,
                  marginBottom: 4,
                }}
              >
                {day.label}
              </div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 13,
                  color: colors.textH,
                  lineHeight: 1.4,
                }}
              >
                {day.date}
              </div>
            </div>

            {/* Events column */}
            <div style={{ padding: '16px 24px', display: 'grid', gap: 10 }}>
              {day.events.map((ev) => (
                <div key={ev.title} className="timeline-event" style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div
                    className="timeline-event-time"
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 11,
                      color: colors.text,
                      minWidth: 110,
                      flexShrink: 0,
                    }}
                  >
                    {ev.time}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, color: colors.textH, fontFamily: fonts.sans }}>{ev.title}</span>
                    {ev.note && (
                      <span style={{ fontSize: 13, color: colors.text, marginLeft: 8 }}>— {ev.note}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
