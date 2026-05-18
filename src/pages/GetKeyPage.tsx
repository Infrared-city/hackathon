import { useState } from 'react'
import { api } from '../lib/api'
import type { KeyResponse } from '../types'

function extractKey(raw: unknown): KeyResponse | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  // Windmill may wrap the script return in `result` or return it directly.
  const inner = (r.result && typeof r.result === 'object' ? (r.result as Record<string, unknown>) : r)
  const api_key =
    (inner.api_key as string | undefined) ??
    (inner.key as string | undefined) ??
    (inner.apiKey as string | undefined)
  if (!api_key) return null
  const key_name =
    (inner.key_name as string | undefined) ??
    (inner.name as string | undefined) ??
    ''
  return { api_key, key_name }
}

export function GetKeyPage() {
  const [teamName, setTeamName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<KeyResponse | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim() || !email.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const raw = await api.requestKey({
        team_name: teamName.trim(),
        email: email.trim(),
      })
      const parsed = extractKey(raw)
      if (!parsed) {
        throw new Error('No API key in response')
      }
      setResult(parsed)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate a key')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyKey() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.api_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-h)',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--text-h)',
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'var(--font-display)',
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 12 }}>
          Get your <span className="text-gradient">API Key</span>
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 17, lineHeight: 1.5 }}>
          Enter your team name and email. We&apos;ll send you a working infrared.city API
          key instantly — no account needed.
        </p>
      </header>

      {!result ? (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 28,
            display: 'grid',
            gap: 18,
          }}
        >
          <div>
            <label htmlFor="team_name" style={labelStyle}>
              Team name <span style={{ color: 'var(--cyan)' }}>*</span>
            </label>
            <input
              id="team_name"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Climate Hackers"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" style={labelStyle}>
              Email <span style={{ color: 'var(--cyan)' }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                color: '#ff8a8a',
                fontSize: 14,
                background: 'rgba(255, 138, 138, 0.08)',
                border: '1px solid rgba(255, 138, 138, 0.3)',
                padding: '10px 12px',
                borderRadius: 6,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || !teamName.trim() || !email.trim()}
            style={{
              opacity: submitting || !teamName.trim() || !email.trim() ? 0.6 : 1,
              cursor:
                submitting || !teamName.trim() || !email.trim()
                  ? 'not-allowed'
                  : 'pointer',
              marginTop: 4,
            }}
          >
            {submitting ? 'Generating…' : 'Get my API key →'}
          </button>
        </form>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--cyan-border)',
            borderRadius: 12,
            padding: 28,
            display: 'grid',
            gap: 16,
          }}
        >
          <div
            style={{
              color: 'var(--green)',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            ✓ Your API key:
          </div>

          <pre
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              color: 'var(--cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            {result.api_key}
          </pre>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={copyKey}
              className="btn-outline"
              style={{ padding: '10px 20px', fontSize: 14 }}
            >
              {copied ? 'Copied!' : 'Copy key'}
            </button>
            <span style={{ color: 'var(--text)', fontSize: 14 }}>
              We also sent it to <strong style={{ color: 'var(--text-h)' }}>{email}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setResult(null)
              setTeamName('')
              setEmail('')
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
              justifySelf: 'start',
              padding: 0,
              marginTop: 4,
            }}
          >
            Request another key
          </button>
        </div>
      )}

      {/* Info box */}
      <section
        style={{
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          marginTop: 32,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            marginBottom: 14,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-h)',
          }}
        >
          What can I do with this key?
        </h3>
        <ul
          style={{
            listStyle: 'none',
            display: 'grid',
            gap: 10,
            color: 'var(--text-body)',
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          <li style={{ display: 'flex', gap: 10 }}>
            <span style={{ color: 'var(--cyan)' }}>→</span>
            <span>
              Run wind, solar, thermal, and daylight simulations via the Infrared SDK
            </span>
          </li>
          <li style={{ display: 'flex', gap: 10 }}>
            <span style={{ color: 'var(--cyan)' }}>→</span>
            <span>
              <code>pip install infrared-sdk</code> — works in 60 seconds
            </span>
          </li>
          <li style={{ display: 'flex', gap: 10 }}>
            <span style={{ color: 'var(--cyan)' }}>→</span>
            <span>Valid for the duration of the hackathon</span>
          </li>
        </ul>
      </section>

      <p
        style={{
          marginTop: 20,
          color: 'var(--text)',
          fontSize: 13,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        Keys are shared from a hackathon pool. Each key can run up to ~1,000 simulations
        during the event.
      </p>
    </div>
  )
}
