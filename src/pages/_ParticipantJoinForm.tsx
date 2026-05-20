import { useState } from 'react'
import { SKILLS } from '../types'

interface JoinData {
  nickname: string
  skills: string[]
  looking_for_team: boolean
}

interface Props {
  onJoin: (data: JoinData) => Promise<void>
  onCancel: () => void
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

export function ParticipantJoinForm({ onJoin, onCancel }: Props) {
  const [nickname, setNickname] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [lookingForTeam, setLookingForTeam] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await onJoin({ nickname: nickname.trim(), skills: selectedSkills, looking_for_team: lookingForTeam })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed')
      setSubmitting(false)
    }
  }

  return (
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
          style={{ display: 'block', color: 'var(--text-h)', fontSize: 14, marginBottom: 6 }}
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
        <label style={{ display: 'block', color: 'var(--text-h)', fontSize: 14, marginBottom: 6 }}>
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
          onClick={onCancel}
          style={{ padding: '10px 20px', fontSize: 14 }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
