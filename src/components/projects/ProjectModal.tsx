import { useEffect } from 'react'
import type { Submission } from '../../types/index'
import { splitList, parseUrls, timeAgo } from './ProjectCard'

const isVideoFile = (url: string) => /r2\.dev\//.test(url) || /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(url)

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value || !value.trim()) return null
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cyan)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
      <p style={{ color: 'var(--text-body)', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

function LinkBtn({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: '8px 14px',
        border: '1px solid var(--cyan-border)',
        borderRadius: 8,
        color: 'var(--cyan)',
        background: 'var(--cyan-dim)',
        fontSize: 13,
        fontFamily: 'var(--font-display)',
        textDecoration: 'none',
      }}
    >
      {label} ↗
    </a>
  )
}

export function ProjectModal({ project, onClose }: { project: Submission; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const tags = splitList(project.tags)
  const apis = splitList(project.apis_used)
  const shots = parseUrls(project.screenshots)
  const docs = parseUrls(project.documents)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 12, 14, 0.78)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 16px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          maxWidth: 760,
          width: '100%',
          padding: 28,
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 34,
            height: 34,
            borderRadius: 9,
            border: '1px solid var(--border)',
            background: 'var(--bg-alt)',
            color: 'var(--text-h)',
            fontSize: 18,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: 28, color: 'var(--text-h)', marginBottom: 6, paddingRight: 40, fontFamily: 'var(--font-display)' }}>
          {project.project_name}
        </h2>
        <p style={{ color: 'var(--text-body)', fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>
          {project.one_liner}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 20, color: 'var(--text)', fontSize: 13 }}>
          <span>👥 {project.team_name}</span>
          {project.members && <span>· {project.members}</span>}
          {project.challenge_track && (
            <span style={{ padding: '3px 10px', borderRadius: 999, background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid var(--cyan-border)', fontFamily: 'var(--font-mono)' }}>
              {project.challenge_track}
            </span>
          )}
          {project.submitted_at && <span>· {timeAgo(project.submitted_at)}</span>}
        </div>

        {project.video_url && (
          <div style={{ marginBottom: 20 }}>
            {isVideoFile(project.video_url) ? (
              <video src={project.video_url} controls style={{ width: '100%', borderRadius: 10, background: '#000', maxHeight: 420 }} />
            ) : (
              <LinkBtn href={project.video_url} label="Watch demo video" />
            )}
          </div>
        )}

        {shots.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
            {shots.map((src) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                <img src={src} alt="" loading="lazy" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              </a>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          <Detail label="PROBLEM" value={project.problem} />
          <Detail label="SOLUTION" value={project.solution} />
          <Detail label="TECHNICAL IMPLEMENTATION" value={project.tech_impl} />
          <Detail label="TARGET GROUP" value={project.target_group} />
        </div>

        {(tags.length > 0 || apis.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {tags.map((t) => (
              <span key={'t' + t} style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--cyan-dim)', color: 'var(--cyan)', fontSize: 12 }}>#{t}</span>
            ))}
            {apis.map((a) => (
              <span key={'a' + a} style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{a}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.github_url && <LinkBtn href={project.github_url} label="GitHub" />}
          {project.demo_url && <LinkBtn href={project.demo_url} label="Live demo" />}
          {docs.map((url, i) => (
            <LinkBtn key={url} href={url} label={/\.pdf($|\?)/i.test(url) ? 'PDF' : `Sketch ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
