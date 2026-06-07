import { useState, type FormEvent, type ReactNode } from 'react'
import { api } from '../lib/api'
import { Section, Field, inputStyle, textareaStyle, pageStyle, containerStyle } from '../components/ui/FormPrimitives'
import { useStatus } from '../lib/useStatus'
import { ImageUploader } from '../components/submit/ImageUploader'
import { VideoUploader } from '../components/submit/VideoUploader'
import { GateNotice, SuccessView } from './_submitViews'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const emptyForm = {
  project_name: '',
  description: '',
  demo_url: '',
  github_url: '',
  team_name: '',
  members: '',
}
type FormState = typeof emptyForm

const subHeadStyle = { fontSize: 15, fontWeight: 600, color: 'var(--text-h)', marginBottom: 2 }
const subHintStyle = { color: 'var(--text)', fontSize: 13, marginBottom: 10 }
const rowGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 } as const

function MediaBlock({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div>
      <div style={subHeadStyle}>{label}</div>
      <div style={subHintStyle}>{hint}</div>
      {children}
    </div>
  )
}

export function SubmitPage() {
  const { status: gates, loading: gatesLoading } = useStatus()
  // Dev: preview the form without flipping the live gate.
  const submission = import.meta.env.DEV ? 'open' : gates.submission

  const [form, setForm] = useState<FormState>(emptyForm)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [imagesBusy, setImagesBusy] = useState(false)
  const [videoBusy, setVideoBusy] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (gatesLoading) {
    return <div style={pageStyle}><div style={{ ...containerStyle, color: 'var(--text)' }}>Loading…</div></div>
  }
  if (submission === 'locked') {
    return <GateNotice title="Submissions not open yet" body="The Day 3 submission window opens once your instructor turns it on. Until then, keep building." ctaHref="/" ctaLabel="Back to home" />
  }
  if (submission === 'closed') {
    return <GateNotice title="Submissions closed" body="The Day 3 deadline (Sunday, June 7) has passed. Browse what everyone shipped." ctaHref="/projects" ctaLabel="View projects" />
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const reset = () => {
    setForm(emptyForm)
    setScreenshots([])
    setVideoUrl('')
    setStatus('idle')
    setErrorMsg('')
  }

  const uploadsBusy = imagesBusy || videoBusy

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (uploadsBusy) return

    const missing: string[] = []
    if (!form.project_name.trim()) missing.push('project name')
    if (!form.description.trim()) missing.push('a description')
    if (!form.demo_url.trim()) missing.push('your live URL')
    if (!form.github_url.trim()) missing.push('your GitHub repo')
    if (!form.team_name.trim()) missing.push('your name or team')
    if (screenshots.length === 0 && !videoUrl.trim()) missing.push('at least one image or a video')
    if (missing.length) {
      setStatus('error')
      setErrorMsg('Please add: ' + missing.join(', ') + '.')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    const description = form.description.trim()
    const body = {
      project_name: form.project_name.trim(),
      one_liner: description.slice(0, 140),
      challenge_track: 'IAAC Day 3 — Deployment',
      team_name: form.team_name.trim(),
      members: form.members.trim(),
      github_url: form.github_url.trim(),
      demo_url: form.demo_url.trim(),
      video_url: videoUrl.trim() || undefined,
      screenshots: screenshots.length ? screenshots : undefined,
      solution: description,
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

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 12 }}>
            IAAC × infrared.city · Day 3 · Deployment
          </div>
          <h1 style={{ fontSize: 44, marginBottom: 12 }}>Submit your app</h1>
          <p style={{ color: 'var(--text)', fontSize: 17, lineHeight: 1.6 }}>
            Your final deployment. Public immediately — you can resubmit any time.{' '}
            <b style={{ color: 'var(--text-h)' }}>Due Sunday, June 7.</b>
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          {/* 1 — Your app */}
          <Section title="Your app" step={1}>
            <Field label="Project name" required>
              <input type="text" value={form.project_name} onChange={(e) => update('project_name', e.target.value)} required style={inputStyle} placeholder="e.g. Cool Routes Vienna" />
            </Field>
            <Field label="Description" required hint={<span style={{ color: 'var(--text)' }}>what does it do?</span>}>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} required style={textareaStyle} placeholder="A few sentences: what your app does and who it's for." />
            </Field>
            <div style={rowGrid}>
              <Field label="Live URL" required hint={<span style={{ color: 'var(--text)' }}>the deployed app</span>}>
                <input type="url" value={form.demo_url} onChange={(e) => update('demo_url', e.target.value)} required style={inputStyle} placeholder="https://your-app.vercel.app" />
              </Field>
              <Field label="GitHub repo" required>
                <input type="url" value={form.github_url} onChange={(e) => update('github_url', e.target.value)} required style={inputStyle} placeholder="https://github.com/you/your-app" />
              </Field>
            </div>
          </Section>

          {/* 2 — Your team */}
          <Section title="Your team" step={2}>
            <div style={rowGrid}>
              <Field label="Name or team" required>
                <input type="text" value={form.team_name} onChange={(e) => update('team_name', e.target.value)} required style={inputStyle} placeholder="Your name or team name" />
              </Field>
              <Field label="Team members" hint={<span style={{ color: 'var(--text)' }}>optional</span>}>
                <input type="text" value={form.members} onChange={(e) => update('members', e.target.value)} style={inputStyle} placeholder="If you worked together: names" />
              </Field>
            </div>
          </Section>

          {/* 3 — Video & image */}
          <Section title="Video & image" step={3}>
            <MediaBlock label="A short video" hint="Upload (max 500 MB) or paste a YouTube / Loom link — a quick screen recording is perfect.">
              <VideoUploader onChange={setVideoUrl} onBusyChange={setVideoBusy} />
            </MediaBlock>
            <MediaBlock label="Image(s)" hint="A screenshot of your app — up to 5.">
              <ImageUploader onChange={setScreenshots} onBusyChange={setImagesBusy} />
            </MediaBlock>
            <div style={{ color: 'var(--text)', fontSize: 13 }}>At least one image or a video is required.</div>
          </Section>

          {status === 'error' && (
            <div style={{ background: 'rgba(255, 96, 96, 0.08)', border: '1px solid rgba(255, 96, 96, 0.4)', color: '#ff8080', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              {errorMsg || 'Submission failed. Please try again.'}
            </div>
          )}

          {uploadsBusy && (
            <div style={{ color: 'var(--text)', fontSize: 14, marginBottom: 14, textAlign: 'center' }}>
              Waiting for uploads to finish…
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting || uploadsBusy} style={{ width: '100%', padding: '16px 28px', fontSize: 17, opacity: submitting || uploadsBusy ? 0.7 : 1, cursor: submitting ? 'wait' : uploadsBusy ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Submitting…' : uploadsBusy ? 'Uploading…' : 'Submit my app →'}
          </button>
        </form>
      </div>
    </div>
  )
}
