import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { APIS, TRACKS } from '../types/index'
import {
  Section,
  Field,
  inputStyle,
  pageStyle,
  containerStyle,
} from '../components/ui/FormPrimitives'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const ONE_LINER_MAX = 140

const emptyForm = {
  project_name: '',
  one_liner: '',
  challenge_track: '',
  team_name: '',
  members: '',
  github_url: '',
  demo_url: '',
  video_url: '',
  apis_used: [] as string[],
  screenshot_1: '',
  screenshot_2: '',
  screenshot_3: '',
}

type FormState = typeof emptyForm

export function SubmitPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleApi = (apiName: string) => {
    setForm((prev) => ({
      ...prev,
      apis_used: prev.apis_used.includes(apiName)
        ? prev.apis_used.filter((a) => a !== apiName)
        : [...prev.apis_used, apiName],
    }))
  }

  const reset = () => {
    setForm(emptyForm)
    setStatus('idle')
    setErrorMsg('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const screenshots = [form.screenshot_1, form.screenshot_2, form.screenshot_3]
      .map((s) => s.trim())
      .filter(Boolean)

    const body = {
      project_name: form.project_name.trim(),
      one_liner: form.one_liner.trim(),
      challenge_track: form.challenge_track,
      team_name: form.team_name.trim(),
      members: form.members.trim(),
      github_url: form.github_url.trim(),
      demo_url: form.demo_url.trim() || undefined,
      video_url: form.video_url.trim() || undefined,
      apis_used: form.apis_used,
      screenshots: screenshots.length ? screenshots : undefined,
    }

    try {
      await api.submitProject(body)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  if (status === 'success') return <SuccessView onAnother={reset} />

  const submitting = status === 'submitting'
  const oneLinerLen = form.one_liner.length
  const oneLinerOver = oneLinerLen > ONE_LINER_MAX

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 44, marginBottom: 12 }}>Submit your project</h1>
          <p style={{ color: 'var(--text)', fontSize: 17, lineHeight: 1.6 }}>
            Submissions are public immediately. Fill in what you have — you can resubmit.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <Section title="Project">
            <Field label="Project name" required>
              <input
                type="text"
                value={form.project_name}
                onChange={(e) => update('project_name', e.target.value)}
                required
                style={inputStyle}
                placeholder="e.g. Urban Cool Mapper"
              />
            </Field>

            <Field
              label="One-liner description"
              required
              hint={
                <span style={{ color: oneLinerOver ? '#ff8080' : 'var(--text)' }}>
                  {oneLinerLen}/{ONE_LINER_MAX}
                </span>
              }
            >
              <input
                type="text"
                value={form.one_liner}
                onChange={(e) => update('one_liner', e.target.value.slice(0, ONE_LINER_MAX))}
                required
                maxLength={ONE_LINER_MAX}
                style={inputStyle}
                placeholder="One sentence — what does it do?"
              />
            </Field>

            <Field label="Challenge track" required>
              <select
                value={form.challenge_track}
                onChange={(e) => update('challenge_track', e.target.value)}
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Select a track…
                </option>
                {TRACKS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Team">
            <Field label="Team name" required>
              <input
                type="text"
                value={form.team_name}
                onChange={(e) => update('team_name', e.target.value)}
                required
                style={inputStyle}
              />
            </Field>

            <Field label="Team members">
              <input
                type="text"
                value={form.members}
                onChange={(e) => update('members', e.target.value)}
                style={inputStyle}
                placeholder="nickname1, nickname2, nickname3"
              />
            </Field>
          </Section>

          <Section title="Links">
            <Field label="GitHub URL" required>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => update('github_url', e.target.value)}
                required
                style={inputStyle}
                placeholder="https://github.com/team/repo"
              />
            </Field>

            <Field label="Live demo URL">
              <input
                type="url"
                value={form.demo_url}
                onChange={(e) => update('demo_url', e.target.value)}
                style={inputStyle}
                placeholder="https://your-demo.example.com"
              />
            </Field>

            <Field
              label="Video URL"
              hint={<span style={{ color: 'var(--text)' }}>YouTube, Loom, etc.</span>}
            >
              <input
                type="url"
                value={form.video_url}
                onChange={(e) => update('video_url', e.target.value)}
                style={inputStyle}
                placeholder="https://youtu.be/…"
              />
            </Field>
          </Section>

          <Section title="APIs Used">
            <div style={{ marginBottom: 12, color: 'var(--text)', fontSize: 14 }}>
              Which Infrared SDK analyses did you use?
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 10,
              }}
            >
              {APIS.map((apiName) => {
                const checked = form.apis_used.includes(apiName)
                return (
                  <label
                    key={apiName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: checked ? 'var(--cyan-dim)' : 'var(--bg-surface)',
                      border: `1px solid ${checked ? 'var(--cyan-border)' : 'var(--border)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: checked ? 'var(--cyan)' : 'var(--text-body)',
                      fontSize: 14,
                      transition: 'background 0.15s, border-color 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleApi(apiName)}
                      style={{ accentColor: '#23E5E5', cursor: 'pointer' }}
                    />
                    {apiName}
                  </label>
                )
              })}
            </div>
          </Section>

          <Section title="Screenshots (optional)">
            <div style={{ marginBottom: 12, color: 'var(--text)', fontSize: 14 }}>
              Screenshot URLs (optional) — paste up to 3 public image URLs (R2 or any host).
            </div>
            {([1, 2, 3] as const).map((n) => {
              const key = `screenshot_${n}` as 'screenshot_1' | 'screenshot_2' | 'screenshot_3'
              return (
                <Field key={n} label={`Screenshot ${n}`}>
                  <input
                    type="url"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    style={inputStyle}
                    placeholder="https://…"
                  />
                </Field>
              )
            })}
          </Section>

          {status === 'error' && (
            <div
              style={{
                background: 'rgba(255, 96, 96, 0.08)',
                border: '1px solid rgba(255, 96, 96, 0.4)',
                color: '#ff8080',
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {errorMsg || 'Submission failed. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px 28px',
              fontSize: 17,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'wait' : 'pointer',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Project →'}
          </button>
        </form>
      </div>
    </div>
  )
}

function SuccessView({ onAnother }: { onAnother: () => void }) {
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
