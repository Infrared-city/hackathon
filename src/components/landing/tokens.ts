import type { CSSProperties } from 'react'

// Design tokens used via inline styles (mirror CSS vars defined in index.css)
export const colors = {
  bg: 'var(--bg)',
  bgSurface: 'var(--bg-surface)',
  border: 'var(--border)',
  text: 'var(--text)',
  textH: 'var(--text-h)',
  textBody: 'var(--text-body)',
  cyan: 'var(--cyan)',
  cyanDim: 'var(--cyan-dim)',
  cyanBorder: 'var(--cyan-border)',
  green: 'var(--green)',
  primary: 'var(--primary)',
  primaryDark: 'var(--primary-dark)',
}

export const fonts = {
  display: 'var(--font-display)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
}

export const sectionStyle: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '96px 24px',
}

export const h2Style: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
  fontWeight: 300,
  color: colors.textH,
  marginBottom: 12,
  letterSpacing: '-0.01em',
}

export const eyebrowStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: colors.cyan,
  marginBottom: 16,
}
