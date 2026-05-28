export function CommunityTalkPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 32px 80px' }}>

        {/* Eyebrow label */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: 'var(--cyan)',
          marginBottom: '24px',
        }}>
          infrared.city · SDK Buildathon 2026
        </p>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(56px, 10vw, 96px)',
          lineHeight: 1.0,
          marginBottom: 0,
        }}>
          <span style={{ color: 'var(--text-h)', display: 'block' }}>Community</span>
          <span style={{ color: 'var(--cyan)', display: 'block' }}>Talk</span>
        </h1>

        {/* Divider */}
        <div style={{
          width: 64,
          height: 3,
          background: 'var(--cyan)',
          borderRadius: 2,
          margin: '32px 0',
          opacity: 0.7,
        }} />

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: 'var(--text)',
          lineHeight: 1.6,
          maxWidth: 560,
          marginBottom: '40px',
        }}>
          Hackathon results, winning projects, and a showcase of everything built over 5 days.
        </p>

        {/* Date + time row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--cyan-dim)',
            border: '1px solid var(--cyan-border)',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            padding: '10px 24px',
            borderRadius: '8px',
          }}>
            Monday, June 1
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--text)',
          }}>
            15:30 CEST · Open to everyone
          </span>
        </div>

        {/* StreamYard embed */}
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--bg-alt)',
        }}>
          <div style={{ width: '100%', height: 0, position: 'relative', paddingBottom: '56.25%' }}>
            <iframe
              src="https://streamyard.com/watch/pg4HGYzMsngx?embed=true"
              width="100%"
              height="100%"
              frameBorder={0}
              allow="autoplay; fullscreen"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'hidden',
              }}
              title="Community Talk – SDK Buildathon 2026"
            />
          </div>
        </div>

      </div>
    </main>
  )
}
