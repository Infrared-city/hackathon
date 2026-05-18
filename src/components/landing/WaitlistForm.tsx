import { useState } from 'react'
import { api } from '../../lib/api'
import { colors, fonts } from './tokens'

interface WaitlistFormProps {
  source: 'landing' | 'getkey' | 'footer'
  compact?: boolean
}

export function WaitlistForm({ source, compact }: WaitlistFormProps) {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [busy, setBusy]       = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [done, setDone]       = useState<'subscribed' | 'already_subscribed' | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setBusy(true)
    setError(null)
    try {
      const raw = await api.notifyMe({ email: email.trim(), name: name.trim(), source })
      const status = ((raw as Record<string, unknown>).status as string)
                  ?? (((raw as Record<string, unknown>).result as Record<string, unknown> | undefined)?.status as string)
      setDone(status === 'already_subscribed' ? 'already_subscribed' : 'subscribed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not subscribe')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div
        style={{
          background: 'rgba(91,231,179,0.08)',
          border: `1px solid rgba(91,231,179,0.3)`,
          borderRadius: 8,
          padding: '12px 16px',
          color: '#5be7b3',
          fontSize: 14,
          fontFamily: fonts.sans,
          textAlign: 'center',
        }}
      >
        {done === 'subscribed'
          ? `✓ You're on the list. We'll email ${email} on May 27.`
          : `You're already on the list. See you May 27!`}
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: compact ? 180 : 220,
    padding: '11px 14px',
    background: '#091C1F',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    color: colors.textH,
    fontFamily: fonts.sans,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <form
      onSubmit={submit}
      className="waitlist-form"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      {!compact && (
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          aria-label="Your name"
        />
      )}
      <input
        type="email"
        required
        placeholder="you@team.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="btn-primary"
        disabled={busy || !email.includes('@')}
        style={{
          padding: '11px 22px',
          fontSize: 14,
          opacity: busy || !email.includes('@') ? 0.6 : 1,
          cursor: busy || !email.includes('@') ? 'not-allowed' : 'pointer',
        }}
      >
        {busy ? '…' : 'Notify me'}
      </button>
      {error && (
        <div style={{ flexBasis: '100%', color: '#ff8a8a', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
          {error}
        </div>
      )}
    </form>
  )
}
