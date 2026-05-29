import { useEffect, useRef, useState, type DragEvent } from 'react'
import { uploadFile, validateFile, MAX_VIDEO_BYTES } from '../../lib/upload'
import { inputStyle } from '../ui/FormPrimitives'
import { dropZoneBase, dropZoneActive, progressTrack, progressFill, errorText } from './uploaderStyles'

interface VidItem {
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  progress: number
  url?: string
  error?: string
}

interface VideoUploaderProps {
  /** Final video URL — pasted link or uploaded public URL ('' if none). */
  onChange: (url: string) => void
  onBusyChange: (busy: boolean) => void
}

const fmtMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 14px',
  borderRadius: 8,
  border: `1px solid ${active ? 'var(--cyan-border)' : 'var(--border)'}`,
  background: active ? 'var(--cyan-dim)' : 'var(--bg-alt)',
  color: active ? 'var(--cyan)' : 'var(--text-body)',
  cursor: 'pointer',
  fontSize: 13,
})

export function VideoUploader({ onChange, onBusyChange }: VideoUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'link'>('upload')
  const [link, setLink] = useState('')
  const [item, setItem] = useState<VidItem | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === 'link') {
      onChange(link.trim())
      onBusyChange(false)
    } else {
      onChange(item?.status === 'done' && item.url ? item.url : '')
      onBusyChange(item?.status === 'uploading')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, link, item])

  const startUpload = (file: File) => {
    const v = validateFile(file, 'video')
    if (!v.ok) {
      setItem({ name: file.name, size: file.size, status: 'error', progress: 0, error: v.error })
      return
    }
    setItem({ name: file.name, size: file.size, status: 'uploading', progress: 0 })
    uploadFile(file, 'video', (pct) =>
      setItem((cur) => (cur ? { ...cur, progress: pct } : cur)),
    )
      .then((url) => setItem((cur) => (cur ? { ...cur, status: 'done', progress: 100, url } : cur)))
      .catch((err: Error) =>
        setItem((cur) => (cur ? { ...cur, status: 'error', error: err.message } : cur)),
      )
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) startUpload(f)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" style={tabStyle(mode === 'upload')} onClick={() => setMode('upload')}>
          Upload file
        </button>
        <button type="button" style={tabStyle(mode === 'link')} onClick={() => setMode('link')}>
          Paste link
        </button>
      </div>

      {mode === 'link' ? (
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={inputStyle}
          placeholder="https://youtu.be/… or Loom link"
        />
      ) : item ? (
        <div
          style={{
            border: `1px solid ${item.status === 'error' ? '#ff6060' : 'var(--border)'}`,
            borderRadius: 10,
            padding: 14,
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-h)', fontSize: 14, wordBreak: 'break-all' }}>
              🎬 {item.name}{' '}
              <span style={{ color: 'var(--text)', fontSize: 12 }}>· {fmtMB(item.size)}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setItem(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
              }}
              aria-label="Remove video"
            >
              ×
            </button>
          </div>
          {item.status === 'uploading' && (
            <div style={{ marginTop: 10 }}>
              <div style={progressTrack}>
                <div style={progressFill(item.progress)} />
              </div>
              <div style={{ color: 'var(--text)', fontSize: 12, marginTop: 4 }}>
                Uploading… {item.progress}%
              </div>
            </div>
          )}
          {item.status === 'done' && (
            <div style={{ color: 'var(--cyan)', fontSize: 13, marginTop: 8 }}>✓ Uploaded</div>
          )}
          {item.status === 'error' && <div style={errorText}>{item.error}</div>}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Add video"
          style={{ ...dropZoneBase, ...(dragOver ? dropZoneActive : null) }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          Drag &amp; drop your demo video, or <strong>click to browse</strong>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
            MP4 / WebM / MOV · max {Math.round(MAX_VIDEO_BYTES / 1024 / 1024)} MB
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        data-testid="video-input"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) startUpload(f)
        }}
      />
    </div>
  )
}
