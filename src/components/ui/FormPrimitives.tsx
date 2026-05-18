import type { CSSProperties, ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
      }}
    >
      <h2
        style={{
          fontSize: 20,
          marginBottom: 20,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-h)',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </section>
  )
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: 'var(--text-body)', fontSize: 14, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: 'var(--cyan)', marginLeft: 4 }}>*</span>}
        </span>
        {hint && <span style={{ fontSize: 12 }}>{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bg-alt)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-h)',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.15s',
}

export const pageStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg)',
  padding: '48px 20px 96px',
}

export const containerStyle: CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
}
