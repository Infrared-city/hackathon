import { CountdownSection } from '../components/landing/CountdownSection'
import { useStatus } from '../lib/useStatus'

const PLATFORM_SIGNUP_URL = 'https://app.infrared.city/login'

const steps = [
  {
    n: '1',
    title: 'Sign up on the platform',
    body: 'Continue with Google for the fastest path, or use email + password. Free trial — no credit card.',
  },
  {
    n: '2',
    title: 'Complete your profile',
    body: 'A few short fields about you and what you\'re building. Takes under a minute.',
  },
  {
    n: '3',
    title: 'Grab your API key',
    body: 'Your account starts with 10,000 credits free — plenty for the hackathon. Copy the key from your dashboard and start building.',
  },
]

export function GetKeyPage() {
  const { status, loading } = useStatus()
  const regStatus = status.registration

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px', textAlign: 'center', color: 'var(--text)' }}>
        Loading…
      </div>
    )
  }

  if (regStatus === 'locked') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px' }}>
        <header style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 12 }}>
            <span className="text-gradient">Hackathon</span> registration
          </h1>
          <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.6 }}>
            Almost there — registration opens soon.
          </p>
        </header>
        <CountdownSection inline />
      </div>
    )
  }

  if (regStatus === 'closed') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 16 }}>
          Registration closed
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
          The hackathon is now in progress. Already have a key? Just keep building. Submission opens May 31.
        </p>
        <a href="/participants" className="btn-outline" style={{ marginRight: 12 }}>See participants</a>
        <a href="/projects"     className="btn-primary">View projects</a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
      <header style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 12 }}>
          Get your <span className="text-gradient">API key</span>
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Each participant signs up individually on the infrared.city platform. Your account starts
          with <strong style={{ color: 'var(--text-h)' }}>10,000 credits free</strong> — that's your
          hackathon budget.
        </p>
      </header>

      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 36px',
          display: 'grid',
          gap: 14,
        }}
      >
        {steps.map((s) => (
          <li
            key={s.n}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '20px 22px',
              display: 'grid',
              gridTemplateColumns: '40px 1fr',
              gap: 18,
              alignItems: 'start',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan-border)',
                color: 'var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 16,
              }}
            >
              {s.n}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  color: 'var(--text-h)',
                  marginBottom: 4,
                }}
              >
                {s.title}
              </div>
              <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <a
          href={PLATFORM_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: 15 }}
        >
          Sign up on the platform →
        </a>
        <span style={{ color: 'var(--text)', fontSize: 13 }}>
          Opens app.infrared.city in a new tab
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '14px 16px',
          fontSize: 13,
          color: 'var(--text)',
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: 'var(--text-h)' }}>Once you have your key:</strong>{' '}
        <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>pip install infrared-sdk</code>
        {' '}— then set{' '}
        <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>INFRARED_API_KEY=&lt;your key&gt;</code>
      </div>

      <p style={{ marginTop: 28, color: 'var(--text)', fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
        Looking for teammates? Browse the{' '}
        <a href="/participants" style={{ color: 'var(--cyan)' }}>participant canvas →</a>
      </p>
    </div>
  )
}
