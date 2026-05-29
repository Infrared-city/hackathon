import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { TRACKS } from '../types/index'
import { Section, Field, inputStyle, textareaStyle, pageStyle, containerStyle } from '../components/ui/FormPrimitives'
import { useStatus } from '../lib/useStatus'
import { ImageUploader } from '../components/submit/ImageUploader'
import { VideoUploader } from '../components/submit/VideoUploader'
import { DocumentUploader } from '../components/submit/DocumentUploader'
import { TagInput } from '../components/submit/TagInput'
import { ApiCheckboxGrid } from '../components/submit/ApiCheckboxGrid'
import { GateNotice, SuccessView } from './_submitViews'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const ONE_LINER_MAX = 140

const emptyForm = {
  project_name: '',
  one_liner: '',
  challenge_track: '',
  problem: '',
  solution: '',
  tech_impl: '',
  target_group: '',
  team_name: '',
  members: '',
  github_url: '',
  demo_url: '',
  apis_used: [] as string[],
  tags: [] as string[],
  sdk_feedback: '',
  prize_email: '',
}

type FormState = typeof emptyForm

const subHeadStyle = { fontSize: 15, fontWeight: 600, color: 'var(--text-h)', marginBottom: 2 }
const subHintStyle = { color: 'var(--text)', fontSize: 13, marginBottom: 10 }
const rowGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 } as const

function MediaBlock({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
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
  const [form, setForm] = useState<FormState>(emptyForm)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [imagesBusy, setImagesBusy] = useState(false)
  const [docsBusy, setDocsBusy] = useState(false)
  const [videoBusy, setVideoBusy] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (gatesLoading) {
    return <div style={pageStyle}><div style={{ ...containerStyle, color: 'var(--text)' }}>Loading…</div></div>
  }
  if (gates.submission === 'locked') {
    return <GateNotice title="Submissions not yet open" body="The submission window opens at kickoff (May 27) and closes Sunday May 31, 24:00 CET." ctaHref="/get-key" ctaLabel="Get your API key" />
  }
  if (gates.submission === 'closed') {
    return <GateNotice title="Submissions closed" body="The submission window has ended. Browse all submitted projects · winners announced Tue Jun 2." ctaHref="/projects" ctaLabel="View projects" />
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleApi = (apiName: string) =>
    setForm((prev) => ({
      ...prev,
      apis_used: prev.apis_used.includes(apiName)
        ? prev.apis_used.filter((a) => a !== apiName)
        : [...prev.apis_used, apiName],
    }))

  const reset = () => {
    setForm(emptyForm)
    setScreenshots([])
    setDocuments([])
    setVideoUrl('')
    setStatus('idle')
    setErrorMsg('')
  }

  const uploadsBusy = imagesBusy || videoBusy || docsBusy

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (uploadsBusy) return
    setStatus('submitting')
    setErrorMsg('')

    const body = {
      project_name: form.project_name.trim(),
      one_liner: form.one_liner.trim(),
      challenge_track: form.challenge_track,
      problem: form.problem.trim(),
      solution: form.solution.trim(),
      tech_impl: form.tech_impl.trim() || undefined,
      target_group: form.target_group.trim() || undefined,
      team_name: form.team_name.trim(),
      members: form.members.trim(),
      github_url: form.github_url.trim(),
      demo_url: form.demo_url.trim() || undefined,
      video_url: videoUrl.trim() || undefined,
      apis_used: form.apis_used,
      tags: form.tags,
      screenshots: screenshots.length ? screenshots : undefined,
      documents: documents.length ? documents : undefined,
      sdk_feedback: form.sdk_feedback.trim() || undefined,
      prize_email: form.prize_email.trim() || undefined,
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
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 44, marginBottom: 12 }}>Submit your project</h1>
          <p style={{ color: 'var(--text)', fontSize: 17, lineHeight: 1.6 }}>
            Public immediately — you can resubmit. Start with your video &amp; images.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          {/* 1 — Media first */}
          <Section title="Video & images" step={1}>
            <MediaBlock label="Demo video" hint="Upload (max 500 MB) or paste a YouTube / Loom link — optional.">
              <VideoUploader onChange={setVideoUrl} onBusyChange={setVideoBusy} />
            </MediaBlock>
            <MediaBlock label="Screenshots" hint="Up to 5 images.">
              <ImageUploader onChange={setScreenshots} onBusyChange={setImagesBusy} />
            </MediaBlock>
            <MediaBlock label="Idea sketches & PDFs" hint="Hand-drawn sketches, a slide, or a PDF — optional.">
              <DocumentUploader onChange={setDocuments} onBusyChange={setDocsBusy} />
            </MediaBlock>
          </Section>

          {/* 2 — Project */}
          <Section title="Your project" step={2}>
            <Field label="Project name" required>
              <input type="text" value={form.project_name} onChange={(e) => update('project_name', e.target.value)} required style={inputStyle} placeholder="e.g. Urban Cool Mapper" />
            </Field>
            <Field label="One-liner description" required hint={<span style={{ color: oneLinerOver ? '#ff8080' : 'var(--text)' }}>{oneLinerLen}/{ONE_LINER_MAX}</span>}>
              <input type="text" value={form.one_liner} onChange={(e) => update('one_liner', e.target.value.slice(0, ONE_LINER_MAX))} required maxLength={ONE_LINER_MAX} style={inputStyle} placeholder="One sentence — what does it do?" />
            </Field>
            <Field label="Challenge track" required>
              <select value={form.challenge_track} onChange={(e) => update('challenge_track', e.target.value)} required style={inputStyle}>
                <option value="" disabled>Select a track…</option>
                {TRACKS.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </Field>
            <Field label="Tags" hint={<span style={{ color: 'var(--text)' }}>press Enter</span>}>
              <TagInput value={form.tags} onChange={(tags) => update('tags', tags)} placeholder="e.g. heat-island, mobility, GIS" />
            </Field>
            <div style={rowGrid}>
              <Field label="Problem" required>
                <textarea value={form.problem} onChange={(e) => update('problem', e.target.value)} required style={textareaStyle} placeholder="What problem are you solving?" />
              </Field>
              <Field label="Solution" required>
                <textarea value={form.solution} onChange={(e) => update('solution', e.target.value)} required style={textareaStyle} placeholder="How does your project solve it?" />
              </Field>
            </div>
            <div style={rowGrid}>
              <Field label="Technical implementation">
                <textarea value={form.tech_impl} onChange={(e) => update('tech_impl', e.target.value)} style={textareaStyle} placeholder="Architecture, stack, how you used the Infrared SDK…" />
              </Field>
              <Field label="Target group">
                <input type="text" value={form.target_group} onChange={(e) => update('target_group', e.target.value)} style={inputStyle} placeholder="Who is this for? e.g. city planners" />
              </Field>
            </div>
          </Section>

          {/* 3 — Team & links */}
          <Section title="Team & links" step={3}>
            <div style={rowGrid}>
              <Field label="Team name" required>
                <input type="text" value={form.team_name} onChange={(e) => update('team_name', e.target.value)} required style={inputStyle} placeholder="Team Heat" />
              </Field>
              <Field label="Team members">
                <input type="text" value={form.members} onChange={(e) => update('members', e.target.value)} style={inputStyle} placeholder="Ada Lovelace, Alan Turing, …" />
              </Field>
            </div>
            <div style={rowGrid}>
              <Field label="GitHub URL">
                <input type="url" value={form.github_url} onChange={(e) => update('github_url', e.target.value)} style={inputStyle} placeholder="https://github.com/team/repo" />
              </Field>
              <Field label="Live demo URL">
                <input type="url" value={form.demo_url} onChange={(e) => update('demo_url', e.target.value)} style={inputStyle} placeholder="https://your-demo.example.com" />
              </Field>
            </div>
          </Section>

          {/* 4 — APIs, feedback & prize */}
          <Section title="APIs, feedback & prize" step={4}>
            <div style={{ color: 'var(--text)', fontSize: 14 }}>Which Infrared SDK analyses did you use?</div>
            <ApiCheckboxGrid selected={form.apis_used} onToggle={toggleApi} />
            <Field label="How was the Infrared SDK?" hint={<span style={{ color: 'var(--text)' }}>optional</span>}>
              <textarea value={form.sdk_feedback} onChange={(e) => update('sdk_feedback', e.target.value)} style={textareaStyle} placeholder="What worked, what was confusing, what you wished existed…" />
            </Field>
            <Field label="Prize account email" hint={<span style={{ color: 'var(--text)' }}>where winning tokens go</span>}>
              <input type="email" value={form.prize_email} onChange={(e) => update('prize_email', e.target.value)} style={inputStyle} placeholder="account@yourteam.com" />
            </Field>
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
            {submitting ? 'Submitting…' : uploadsBusy ? 'Uploading…' : 'Submit Project →'}
          </button>
        </form>
      </div>
    </div>
  )
}
