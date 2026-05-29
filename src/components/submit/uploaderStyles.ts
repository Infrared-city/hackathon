import type { CSSProperties } from 'react'

export const dropZoneBase: CSSProperties = {
  border: '1.5px dashed var(--border)',
  borderRadius: 10,
  padding: '28px 20px',
  textAlign: 'center',
  cursor: 'pointer',
  background: 'var(--bg-alt)',
  color: 'var(--text)',
  fontSize: 14,
  transition: 'border-color 0.15s, background 0.15s',
}

export const dropZoneActive: CSSProperties = {
  borderColor: 'var(--cyan-border)',
  background: 'var(--cyan-dim)',
  color: 'var(--cyan)',
}

export const progressTrack: CSSProperties = {
  height: 4,
  borderRadius: 2,
  background: 'var(--border)',
  overflow: 'hidden',
}

export function progressFill(pct: number, error?: boolean): CSSProperties {
  return {
    height: '100%',
    width: `${pct}%`,
    background: error ? '#ff6060' : 'var(--cyan)',
    transition: 'width 0.2s',
  }
}

export const removeBtn: CSSProperties = {
  position: 'absolute',
  top: 4,
  right: 4,
  width: 22,
  height: 22,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(0,0,0,0.65)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 13,
  lineHeight: '22px',
  padding: 0,
}

export const errorText: CSSProperties = {
  color: '#ff8080',
  fontSize: 12,
  marginTop: 4,
}
