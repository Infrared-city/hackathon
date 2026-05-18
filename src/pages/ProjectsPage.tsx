import { useEffect, useState, type CSSProperties } from 'react'
import { api } from '../lib/api'
import { TRACKS, type Submission } from '../types/index'

const REFRESH_MS = 30_000
const SKELETON_COUNT = 6
const MAX_APIS_SHOWN = 3

function timeAgo(dateString?: string): string {
  if (!dateString) return ''
  const then = new Date(dateString).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Math.max(0, Date.now() - then) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return `${m} minute${m === 1 ? '' : 's'} ago`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `${h} hour${h === 1 ? '' : 's'} ago`
  }
  if (diff < 30 * 86400) {
    const d = Math.floor(diff / 86400)
    return `${d} day${d === 1 ? '' : 's'} ago`
  }
  const mo = Math.floor(diff / (30 * 86400))
  return `${mo} month${mo === 1 ? '' : 's'} ago`
}

export function ProjectsPage() {
  const [items, setItems] = useState<Submission[] | null>(null)
  const [error, setError] = useState<string>('')
  const [track, setTrack] = useState<string>('All')

  useEffect(() => {
    let cancelled = false

    const fetchItems = async () => {
      try {
        const res = await api.getSubmissions()
        if (cancelled) return
        const list: Submission[] = Array.isArray(res?.list) ? res.list : []
        setItems(list)
        setError('')
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load projects')
        setItems((prev) => prev ?? [])
      }
    }

    fetchItems()
    const id = setInterval(fetchItems, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const filtered =
    items?.filter((p) => track === 'All' || p.challenge_track === track) ?? []
  const loading = items === null
  const count = filtered.length

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        @media (max-width: 980px) {
          .projects-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .projects-grid { grid-template-columns: 1fr; }
        }
        .project-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: background 0.15s, border-color 0.15s;
        }
        .project-card:hover {
          background: var(--bg-alt);
          border-color: #2C5F66;
        }
        .skeleton {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          height: 260px;
          animation: pulse 1.4s ease-in-out infinite;
        }
      `}</style>

      <div style={pageStyle}>
        <div style={containerStyle}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 44, marginBottom: 12 }}>Projects</h1>
            <p style={{ color: 'var(--text)', fontSize: 17, lineHeight: 1.6 }}>
              All submissions are public. Browse what teams are building.
            </p>
          </header>

          <FilterBar selected={track} onSelect={setTrack} />

          <div
            style={{
              color: 'var(--text)',
              fontSize: 13,
              margin: '8px 0 24px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {loading ? 'Loading…' : `${count} project${count === 1 ? '' : 's'}`}
          </div>

          {error && !loading && (
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
              {error}
            </div>
          )}

          {loading ? (
            <div className="projects-grid">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : count === 0 ? (
            <EmptyState filtered={track !== 'All'} />
          ) : (
            <div className="projects-grid">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id ?? `${p.project_name}-${i}`} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function FilterBar({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (t: string) => void
}) {
  const options = ['All', ...TRACKS]
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
      }}
    >
      {options.map((opt) => {
        const active = opt === selected
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              background: active ? 'var(--cyan-dim)' : 'transparent',
              border: `1px solid ${active ? 'var(--cyan-border)' : 'var(--border)'}`,
              color: active ? 'var(--cyan)' : 'var(--text-body)',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ProjectCard({ project }: { project: Submission }) {
  const apis = project.apis_used ?? []
  const extra = Math.max(0, apis.length - MAX_APIS_SHOWN)
  const shown = apis.slice(0, MAX_APIS_SHOWN)

  return (
    <article className="project-card">
      <div>
        <h3
          style={{
            fontSize: 20,
            color: 'var(--text-h)',
            marginBottom: 6,
            fontFamily: 'var(--font-display)',
            wordBreak: 'break-word',
          }}
        >
          {project.project_name}
        </h3>
        <p
          style={{
            color: 'var(--text-body)',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {project.one_liner}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text)', fontSize: 13 }}>
          👥 {project.team_name}
        </span>
      </div>

      {project.challenge_track && (
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 999,
              background: 'var(--cyan-dim)',
              color: 'var(--cyan)',
              border: '1px solid var(--cyan-border)',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {project.challenge_track}
          </span>
        </div>
      )}

      {apis.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {shown.map((a) => (
            <span
              key={a}
              style={{
                padding: '3px 8px',
                borderRadius: 4,
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {a}
            </span>
          ))}
          {extra > 0 && (
            <span
              style={{
                padding: '3px 8px',
                borderRadius: 4,
                color: 'var(--text)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}
            >
              +{extra} more
            </span>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginTop: 'auto',
          paddingTop: 8,
        }}
      >
        {project.github_url && (
          <SmallLink href={project.github_url} label="GitHub" />
        )}
        {project.demo_url && <SmallLink href={project.demo_url} label="Demo" />}
        {project.video_url && <SmallLink href={project.video_url} label="Video" />}
      </div>

      {project.submitted_at && (
        <div
          style={{
            color: 'var(--text)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
            opacity: 0.7,
          }}
        >
          {timeAgo(project.submitted_at)}
        </div>
      )}
    </article>
  )
}

function SmallLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 6,
        color: 'var(--text-h)',
        fontSize: 12,
        fontFamily: 'var(--font-display)',
        textDecoration: 'none',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan)'
        e.currentTarget.style.color = 'var(--cyan)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text-h)'
      }}
    >
      {label} ↗
    </a>
  )
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border)',
        borderRadius: 12,
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <p style={{ color: 'var(--text-body)', fontSize: 16, marginBottom: 16 }}>
        {filtered
          ? 'No projects in this track yet.'
          : 'No projects yet — be the first to submit!'}
      </p>
      <a href="/submit" className="btn-primary">
        Submit a project →
      </a>
    </div>
  )
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg)',
  padding: '48px 20px 96px',
}

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
}
