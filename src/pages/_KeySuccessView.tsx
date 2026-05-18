import type { KeyResponse } from '../types'

interface Props {
  result: KeyResponse
  nickname: string
  teamName: string
  email: string
  copied: boolean
  onCopy: () => void
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#E8F4F4',
  fontSize: 13,
  marginBottom: 6,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.02em',
}

export function KeySuccessView({ result, nickname, teamName, email, copied, onCopy }: Props) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px' }}>
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--cyan-border)',
          borderRadius: 14,
          padding: 32,
          display: 'grid',
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              color: 'var(--green)',
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 8,
            }}
          >
            Welcome, {nickname}! 🎉
          </div>
          <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            You're registered for the Infrared SDK Hackathon. Your team{' '}
            <strong style={{ color: 'var(--text-h)' }}>{teamName}</strong> is now on the participant canvas.
          </p>
        </div>

        <div>
          <div style={{ ...labelStyle, color: 'var(--text)', marginBottom: 8 }}>Your API key</div>
          <pre
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px 16px',
              color: 'var(--cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}
          >
            <code>{result.api_key}</code>
          </pre>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={onCopy} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
            {copied ? '✓ Copied!' : 'Copy key'}
          </button>
          <span style={{ color: 'var(--text)', fontSize: 14 }}>
            Also sent to <strong style={{ color: 'var(--text-h)' }}>{email}</strong>
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-h)', display: 'block', marginBottom: 6 }}>Next steps</strong>
            <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>pip install infrared-sdk</code>{' '}
            — then set{' '}
            <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
              INFRARED_API_KEY=&lt;your key&gt;
            </code>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/participants" className="btn-outline" style={{ padding: '9px 18px', fontSize: 14 }}>
            See the canvas →
          </a>
          <a href="/" style={{ color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center' }}>
            Back to hackathon
          </a>
        </div>
      </div>
    </div>
  )
}
