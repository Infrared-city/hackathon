import { useState } from 'react'
import { api } from '../lib/api'
import { SKILLS, type KeyResponse } from '../types'
import { HACKATHON_START } from '../lib/config'
import { CountdownSection } from '../components/landing/CountdownSection'

function extractKey(raw: unknown): KeyResponse | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const inner = (r.result && typeof r.result === 'object' ? (r.result as Record<string, unknown>) : r)
  const api_key =
    (inner.api_key as string | undefined) ??
    (inner.key as string | undefined) ??
    (inner.apiKey as string | undefined)
  if (!api_key) return null
  return { api_key, key_name: (inner.key_name as string | undefined) ?? (inner.name as string | undefined) ?? '' }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#091C1F',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  color: '#E8F4F4',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#E8F4F4',
  fontSize: 13,
  marginBottom: 6,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.02em',
}

const isOpen = Date.now() >= HACKATHON_START.getTime()

export function GetKeyPage() {
  const [teamName, setTeamName]           = useState('')
  const [email, setEmail]                 = useState('')
  const [nickname, setNickname]           = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [projectIdea, setProjectIdea]     = useState('')
  const [lookingForTeam, setLookingForTeam] = useState(true)
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [result, setResult]               = useState<KeyResponse | null>(null)
  const [copied, setCopied]               = useState(false)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim() || !email.trim() || !nickname.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const raw = await api.requestKey({
        team_name: teamName.trim(),
        email: email.trim(),
        nickname: nickname.trim(),
        skills: selectedSkills,
        project_idea: projectIdea.trim() || undefined,
        looking_for_team: lookingForTeam,
      })
      const parsed = extractKey(raw)
      if (!parsed) throw new Error('No API key in response')
      setResult(parsed)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete registration')
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
    } catch { /* ignore */ }
  }

  if (!isOpen) {
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

  if (result) {
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
              You're registered for the Infrared SDK Hackathon. Your team <strong style={{ color: 'var(--text-h)' }}>{teamName}</strong> is
              now on the participant canvas.
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
            <button
              type="button"
              onClick={copyKey}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: 14 }}
            >
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
              <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>pip install infrared-sdk</code>
              {' '}— then set{' '}
              <code style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>INFRARED_API_KEY=&lt;your key&gt;</code>
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

  const canSubmit = teamName.trim() && email.trim() && nickname.trim() && !submitting

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>
      <header style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 12 }}>
          Join the <span className="text-gradient">Hackathon</span>
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.6 }}>
          Register your team, choose your skills, and get an API key — all in one step.
          You'll appear on the participant canvas instantly.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 32,
          display: 'grid',
          gap: 22,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
              placeholder="Climate Hackers"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="nickname" style={labelStyle}>
              Your name on canvas <span style={{ color: 'var(--cyan)' }}>*</span>
            </label>
            <input
              id="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Alice"
              style={inputStyle}
            />
          </div>
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
            placeholder="you@team.com"
            style={inputStyle}
          />
          <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 5 }}>
            Your key is also sent here. We'll keep you posted on the hackathon.
          </div>
        </div>

        <div>
          <div style={{ ...labelStyle, marginBottom: 10 }}>Skills (select all that apply)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map((skill) => {
              const active = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '6px 13px',
                    fontSize: 12,
                    fontFamily: 'var(--font-sans)',
                    borderRadius: 20,
                    border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                    background: active ? 'rgba(35,229,229,0.12)' : 'transparent',
                    color: active ? 'var(--cyan)' : 'var(--text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="project_idea" style={labelStyle}>
            What are you planning to build? <span style={{ color: 'var(--text)' }}>(optional)</span>
          </label>
          <textarea
            id="project_idea"
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            placeholder="A heat risk dashboard for marathon route planning..."
            rows={2}
            maxLength={200}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            role="switch"
            aria-checked={lookingForTeam}
            onClick={() => setLookingForTeam((v) => !v)}
            style={{
              width: 40,
              height: 22,
              borderRadius: 11,
              background: lookingForTeam ? 'var(--cyan)' : 'var(--border)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: lookingForTeam ? 21 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </button>
          <span style={{ fontSize: 14, color: 'var(--text)' }}>
            Looking for teammates
          </span>
        </div>

        {error && (
          <div
            style={{
              color: '#ff8a8a',
              fontSize: 14,
              background: 'rgba(255,138,138,0.08)',
              border: '1px solid rgba(255,138,138,0.3)',
              padding: '10px 14px',
              borderRadius: 6,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed', marginTop: 4 }}
        >
          {submitting ? 'Registering…' : 'Join & get my API key →'}
        </button>
      </form>

      <p style={{ marginTop: 18, color: 'var(--text)', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
        Keys come from a shared hackathon pool of 50 service accounts. Each team gets one key valid for
        the duration of the event.
      </p>
    </div>
  )
}
