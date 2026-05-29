import type { Submission } from '../../types/index'

const MAX_APIS_SHOWN = 3
const MAX_TAGS_SHOWN = 4

/** NocoDB stores multi-value fields as joined strings; tolerate string | string[]. */
export function splitList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof value === 'string')
    return value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  return []
}

/** Screenshots are newline/comma/space-joined public URLs. */
export function parseUrls(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter((s) => /^https?:\/\//.test(s.trim()))
  if (typeof value === 'string')
    return value.split(/[\s,]+/).map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s))
  return []
}

export function timeAgo(dateString?: string): string {
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

const pill = (text: string, key?: string) => (
  <span
    key={key ?? text}
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
    {text}
  </span>
)

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Submission
  onOpen: (p: Submission) => void
}) {
  const apis = splitList(project.apis_used)
  const tags = splitList(project.tags)
  const shots = parseUrls(project.screenshots)
  const docs = parseUrls(project.documents)
  const apisShown = apis.slice(0, MAX_APIS_SHOWN)
  const apisExtra = Math.max(0, apis.length - MAX_APIS_SHOWN)

  return (
    <article className="project-card" style={{ cursor: 'pointer' }} onClick={() => onOpen(project)}>
      {shots[0] && (
        <img
          src={shots[0]}
          alt={project.project_name}
          loading="lazy"
          style={{
            width: 'calc(100% + 40px)',
            margin: '-20px -20px 0',
            height: 150,
            objectFit: 'cover',
            borderRadius: '12px 12px 0 0',
            background: 'var(--bg-alt)',
          }}
        />
      )}

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
        <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.5 }}>
          {project.one_liner}
        </p>
      </div>

      <span style={{ color: 'var(--text)', fontSize: 13 }}>👥 {project.team_name}</span>

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

      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.slice(0, MAX_TAGS_SHOWN).map((t) => pill(`#${t}`, t))}
        </div>
      )}

      {apis.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {apisShown.map((a) => pill(a))}
          {apisExtra > 0 && (
            <span style={{ color: 'var(--text)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              +{apisExtra} more
            </span>
          )}
        </div>
      )}

      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {project.github_url && <SmallLink href={project.github_url} label="GitHub" />}
        {project.demo_url && <SmallLink href={project.demo_url} label="Demo" />}
        {project.video_url && <SmallLink href={project.video_url} label="Video" />}
        {docs.map((url, i) => (
          <SmallLink key={url} href={url} label={/\.pdf($|\?)/i.test(url) ? 'PDF' : `Sketch ${i + 1}`} />
        ))}
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
