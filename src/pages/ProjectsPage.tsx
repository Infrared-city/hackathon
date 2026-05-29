import { useEffect, useState, type CSSProperties } from 'react'
import { api } from '../lib/api'
import { TRACKS, type Submission } from '../types/index'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectModal } from '../components/projects/ProjectModal'

const REFRESH_MS = 30_000
const SKELETON_COUNT = 6

export function ProjectsPage() {
  const [items, setItems] = useState<Submission[] | null>(null)
  const [error, setError] = useState<string>('')
  const [track, setTrack] = useState<string>('All')
  const [selected, setSelected] = useState<Submission | null>(null)

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
                <ProjectCard key={p.id ?? `${p.project_name}-${i}`} project={p} onOpen={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
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
