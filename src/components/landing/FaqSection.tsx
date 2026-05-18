import type { ReactNode } from 'react'
import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const linkStyle: React.CSSProperties = { color: colors.cyan, textDecoration: 'none', borderBottom: `1px solid ${colors.cyan}55` }

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: 'Do I need an API key?',
    a: (
      <>
        Yes — get one free on the <a href="/get-key" style={linkStyle}>registration page</a>. One key per team,
        valid for the duration of the event.
      </>
    ),
  },
  {
    q: 'Team size?',
    a: <>1–4 people. Solo submissions are welcome. Find teammates on the <a href="/participants" style={linkStyle}>participant canvas</a>.</>,
  },
  {
    q: 'What can I build?',
    a: (
      <>
        Anything using the Infrared SDK — web app, CLI, API, agent, notebook, visualization. Pick a
        challenge track or ship in the Open track. Browse the <a href="https://infrared.city/docs/sdk/" target="_blank" rel="noopener noreferrer" style={linkStyle}>SDK docs</a> for
        what's possible.
      </>
    ),
  },
  {
    q: 'How are projects judged?',
    a: <>Technical depth, creativity, real-world impact, and presentation. Three winners — €5,000 / €2,000 / €1,000 in cloud credits.</>,
  },
  {
    q: 'Where do I submit my project?',
    a: <>The <a href="/submit" style={linkStyle}>submission page</a> opens at kickoff. Deadline is Sun May 31, 24:00 CET.</>,
  },
  {
    q: 'Can I use AI agents?',
    a: (
      <>
        Yes — that's a whole track. The <a href="https://github.com/Infrared-city/infrared-skills" target="_blank" rel="noopener noreferrer" style={linkStyle}>Infrared skills repo</a> drops
        into Claude Code, Cursor, and Copilot. There's also a Jupyter cookbook with one notebook per analysis.
      </>
    ),
  },
  {
    q: 'API rate limits / cost?',
    a: <>Hackathon keys are free for the duration. Each analysis runs on real compute — be reasonable; don't burn the budget on one team. After June 3 the keys auto-deactivate.</>,
  },
  {
    q: 'Is there a Discord / chat?',
    a: <>The link will be sent in the kickoff email on May 27. Sign up on the landing page if you haven't already so you get it.</>,
  },
]

export function FaqSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={eyebrowStyle}>FAQ</div>
        <h2 style={h2Style}>Questions</h2>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {faqs.map((f) => (
          <details
            key={f.q}
            style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: '18px 22px',
            }}
          >
            <summary
              style={{
                fontFamily: fonts.display,
                fontSize: '1rem',
                color: colors.textH,
                cursor: 'pointer',
                fontWeight: 400,
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span>{f.q}</span>
              <span style={{ color: colors.cyan, fontFamily: fonts.mono, fontSize: 18 }}>+</span>
            </summary>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textBody, marginTop: 12 }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
