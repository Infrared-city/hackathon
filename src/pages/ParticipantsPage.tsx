import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { SKILLS, type Participant } from '../types'
import { CanvasView, ListView } from './_participantViews'

type ViewMode = 'canvas' | 'list'

function normalizeParticipants(raw: unknown): Participant[] {
  // NocoDB returns { list: [...] }; tolerate a few shapes.
  if (!raw) return []
  const r = raw as Record<string, unknown>
  const list =
    (Array.isArray(r.list) && (r.list as unknown[])) ||
    (Array.isArray(r.records) && (r.records as unknown[])) ||
    (Array.isArray(raw) ? (raw as unknown[]) : [])
  return list.map((row) => {
    const o = row as Record<string, unknown>
    let skills: string[] = []
    const rawSkills = o.skills
    if (Array.isArray(rawSkills)) {
      skills = rawSkills.map(String)
    } else if (typeof rawSkills === 'string') {
      skills = rawSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    return {
      id: (o.id as string | undefined) ?? (o.Id as string | undefined),
      nickname: String(o.nickname ?? o.Nickname ?? ''),
      skills,
      looking_for_team: Boolean(o.looking_for_team ?? o.Looking_for_team ?? false),
      registered_at:
        (o.registered_at as string | undefined) ?? (o.CreatedAt as string | undefined),
    }
  })
}

export function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [view, setView] = useState<ViewMode>('canvas')
  const [skillFilters, setSkillFilters] = useState<string[]>([])

  const [formOpen, setFormOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [lookingForTeam, setLookingForTeam] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)

  async function fetchParticipants() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getParticipants()
      setParticipants(normalizeParticipants(data))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load participants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const filtered = useMemo(() => {
    if (skillFilters.length === 0) return participants
    return participants.filter((p) => skillFilters.every((s) => p.skills.includes(s)))
  }, [participants, skillFilters])

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await api.registerParticipant({
        nickname: nickname.trim(),
        skills: selectedSkills,
        looking_for_team: lookingForTeam,
      })
      const name = nickname.trim()
      setSuccessName(name)
      setNickname('')
      setSelectedSkills([])
      setLookingForTeam(true)
      setFormOpen(false)
      fetchParticipants()
      setTimeout(() => setSuccessName(null), 6000)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 12 }}>
          Who&apos;s <span className="text-gradient">building?</span>
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 18, maxWidth: 640 }}>
          Find teammates. Share your skills. See who&apos;s here.
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {(['canvas', 'list'] as ViewMode[]).map((mode) => {
            const active = view === mode
            return (
              <button
                key={mode}
                onClick={() => setView(mode)}
                style={{
                  padding: '10px 18px',
                  background: active ? 'var(--cyan-dim)' : 'transparent',
                  color: active ? 'var(--cyan)' : 'var(--text)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {mode} View
              </button>
            )
          })}
        </div>

        <button
          onClick={() => {
            setFormOpen((v) => !v)
            setSubmitError(null)
          }}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: 14, marginLeft: 'auto' }}
        >
          {formOpen ? 'Cancel' : 'Join the Canvas'}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
          paddingBottom: 24,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{ color: 'var(--text)', fontSize: 13, alignSelf: 'center', marginRight: 4 }}
        >
          Filter:
        </span>
        {SKILLS.map((skill) => {
          const active = skillFilters.includes(skill)
          return (
            <button
              key={skill}
              onClick={() => setSkillFilters((prev) => toggle(prev, skill))}
              style={{
                padding: '6px 12px',
                background: active ? 'var(--cyan-dim)' : 'transparent',
                border: `1px solid ${active ? 'var(--cyan-border)' : 'var(--border)'}`,
                color: active ? 'var(--cyan)' : 'var(--text)',
                borderRadius: 999,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {skill}
            </button>
          )
        })}
        {skillFilters.length > 0 && (
          <button
            onClick={() => setSkillFilters([])}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            clear
          </button>
        )}
      </div>

      {successName && (
        <div
          style={{
            background: 'var(--cyan-dim)',
            border: '1px solid var(--cyan-border)',
            color: 'var(--text-h)',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          You&apos;re on the canvas, <strong>{successName}</strong>!
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            display: 'grid',
            gap: 16,
          }}
        >
          <div>
            <label
              htmlFor="nickname"
              style={{
                display: 'block',
                color: 'var(--text-h)',
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              Nickname <span style={{ color: 'var(--cyan)' }}>*</span>
            </label>
            <input
              id="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Ada"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-h)',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: 'var(--text-h)',
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkills((prev) => toggle(prev, skill))}
                    style={{
                      padding: '6px 12px',
                      background: active ? 'var(--cyan-dim)' : 'transparent',
                      border: `1px solid ${active ? 'var(--cyan-border)' : 'var(--border)'}`,
                      color: active ? 'var(--cyan)' : 'var(--text)',
                      borderRadius: 999,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--text-body)',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={lookingForTeam}
              onChange={(e) => setLookingForTeam(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--cyan)' }}
            />
            Looking for a team?
          </label>

          {submitError && <div style={{ color: '#ff8a8a', fontSize: 14 }}>{submitError}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !nickname.trim()}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                opacity: submitting || !nickname.trim() ? 0.6 : 1,
                cursor: submitting || !nickname.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Joining…' : 'Add me to the canvas'}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setFormOpen(false)}
              style={{ padding: '10px 20px', fontSize: 14 }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--text)', padding: '40px 0' }}>Loading participants…</p>
      ) : error ? (
        <p style={{ color: '#ff8a8a', padding: '40px 0' }}>Error: {error}</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--text)', padding: '40px 0' }}>
          {participants.length === 0
            ? 'No participants yet — be the first!'
            : 'No participants match those filters.'}
        </p>
      ) : view === 'canvas' ? (
        <CanvasView participants={filtered} />
      ) : (
        <ListView participants={filtered} />
      )}
    </div>
  )
}
