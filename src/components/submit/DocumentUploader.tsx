import { useEffect, useRef, useState, type DragEvent } from 'react'
import { uploadFile, validateFile, MAX_DOCS, MAX_DOC_BYTES } from '../../lib/upload'
import { dropZoneBase, dropZoneActive, progressTrack, progressFill, errorText } from './uploaderStyles'

interface Item {
  id: string
  name: string
  size: number
  isPdf: boolean
  status: 'uploading' | 'done' | 'error'
  progress: number
  url?: string
  error?: string
}

interface DocumentUploaderProps {
  onChange: (urls: string[]) => void
  onBusyChange: (busy: boolean) => void
}

let seq = 0
const uid = () => `doc-${Date.now()}-${seq++}`
const fmtMB = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`

export function DocumentUploader({ onChange, onBusyChange }: DocumentUploaderProps) {
  const [items, setItems] = useState<Item[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef<Item[]>([])
  itemsRef.current = items

  useEffect(() => {
    onChange(items.filter((i) => i.status === 'done' && i.url).map((i) => i.url as string))
    onBusyChange(items.some((i) => i.status === 'uploading'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const startUpload = (file: File, id: string) => {
    uploadFile(file, 'document', (pct) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, progress: pct } : i))),
    )
      .then((url) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: 'done', progress: 100, url } : i)),
        ),
      )
      .catch((err: Error) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: 'error', error: err.message } : i)),
        ),
      )
  }

  const addFiles = (files: FileList | File[]) => {
    const room = Math.max(0, MAX_DOCS - itemsRef.current.length)
    const toAdd = Array.from(files).slice(0, room)
    const created = toAdd.map<{ item: Item; file: File }>((file) => {
      const v = validateFile(file, 'document')
      return {
        file,
        item: {
          id: uid(),
          name: file.name,
          size: file.size,
          isPdf: file.type === 'application/pdf',
          status: v.ok ? 'uploading' : 'error',
          progress: 0,
          error: v.ok ? undefined : v.error,
        },
      }
    })
    setItems((prev) => [...prev, ...created.map((c) => c.item)])
    created.forEach((c) => c.item.status === 'uploading' && startUpload(c.file, c.item.id))
  }

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const full = items.length >= MAX_DOCS

  return (
    <div>
      {!full && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Add sketches or PDFs"
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
          Drag &amp; drop sketches or PDFs, or <strong>click to browse</strong>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
            PDF or image · up to {MAX_DOCS} files · max {Math.round(MAX_DOC_BYTES / 1024 / 1024)} MB each
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        multiple
        hidden
        data-testid="document-input"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: full ? 0 : 12 }}>
          {items.map((i) => (
            <div
              key={i.id}
              style={{
                border: `1px solid ${i.status === 'error' ? '#ff6060' : 'var(--border)'}`,
                borderRadius: 8,
                padding: '10px 12px',
                background: 'var(--bg-surface)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <span style={{ color: 'var(--text-h)', fontSize: 14, wordBreak: 'break-all' }}>
                  {i.isPdf ? '📄' : '🖼️'}{' '}
                  {i.status === 'done' && i.url ? (
                    <a href={i.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
                      {i.name}
                    </a>
                  ) : (
                    i.name
                  )}{' '}
                  <span style={{ color: 'var(--text)', fontSize: 12 }}>· {fmtMB(i.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                  aria-label={`Remove ${i.name}`}
                >
                  ×
                </button>
              </div>
              {i.status === 'uploading' && (
                <div style={{ ...progressTrack, marginTop: 8 }}>
                  <div style={progressFill(i.progress)} />
                </div>
              )}
              {i.status === 'done' && (
                <div style={{ color: 'var(--cyan)', fontSize: 12, marginTop: 6 }}>✓ Uploaded</div>
              )}
              {i.status === 'error' && <div style={errorText}>{i.error}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
