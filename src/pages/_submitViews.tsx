import { pageStyle, containerStyle } from '../components/ui/FormPrimitives'

export function GateNotice({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string
  body: string
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div style={pageStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 64 }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>{title}</h1>
        <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>{body}</p>
        <a href={ctaHref} className="btn-primary">
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}

export function SuccessView({ onAnother }: { onAnother: () => void }) {
  return (
    <div style={pageStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 64 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'var(--cyan-dim)',
            border: '1px solid var(--cyan-border)',
            color: 'var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 48,
            lineHeight: 1,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 40, marginBottom: 12 }} className="text-gradient">
          Your project is live!
        </h1>
        <p style={{ color: 'var(--text)', marginBottom: 32 }}>
          Submissions are public immediately. Browse the gallery or submit another.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/projects" className="btn-primary">
            View all projects →
          </a>
          <button type="button" className="btn-outline" onClick={onAnother}>
            Submit another
          </button>
        </div>
      </div>
    </div>
  )
}
