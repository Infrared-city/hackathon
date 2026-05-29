import { useEffect, useRef, useState, type DragEvent } from 'react'
import { uploadFile, validateFile, MAX_IMAGES } from '../../lib/upload'
import {
  dropZoneBase,
  dropZoneActive,
  progressTrack,
  progressFill,
  removeBtn,
  errorText,
} from './uploaderStyles'

interface Item {
  id: string
  name: string
  preview: string
  status: 'uploading' | 'done' | 'error'
  progress: number
  url?: string
  error?: string
}

interface ImageUploaderProps {
  /** Called with the public URLs of successfully uploaded images. */
  onChange: (urls: string[]) => void
  /** Called whenever an upload is in flight, so the form can block submit. */
  onBusyChange: (busy: boolean) => void
}

let seq = 0
const uid = () => `img-${Date.now()}-${seq++}`

export function ImageUploader({ onChange, onBusyChange }: ImageUploaderProps) {
  const [items, setItems] = useState<Item[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef<Item[]>([])
  itemsRef.current = items

  // Emit derived state to the parent whenever items change.
  useEffect(() => {
    onChange(items.filter((i) => i.status === 'done' && i.url).map((i) => i.url as string))
    onBusyChange(items.some((i) => i.status === 'uploading'))
    // onChange/onBusyChange are expected to be stable (defined in parent render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Revoke object URLs on unmount.
  useEffect(
    () => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)),
    [],
  )

  const startUpload = (file: File, id: string) => {
    uploadFile(file, 'image', (pct) =>
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
    const incoming = Array.from(files)
    const room = Math.max(0, MAX_IMAGES - itemsRef.current.length)
    const toAdd = incoming.slice(0, room)
    const created = toAdd.map<{ item: Item; file: File }>((file) => {
      const v = validateFile(file, 'image')
      return {
        file,
        item: {
          id: uid(),
          name: file.name,
          preview: URL.createObjectURL(file),
          status: v.ok ? 'uploading' : 'error',
          progress: 0,
          error: v.ok ? undefined : v.error,
        },
      }
    })
    setItems((prev) => [...prev, ...created.map((c) => c.item)])
    created.forEach((c) => c.item.status === 'uploading' && startUpload(c.file, c.item.id))
  }

  const remove = (id: string) =>
    setItems((prev) => {
      const gone = prev.find((i) => i.id === id)
      if (gone) URL.revokeObjectURL(gone.preview)
      return prev.filter((i) => i.id !== id)
    })

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const full = items.length >= MAX_IMAGES

  return (
    <div>
      {!full && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Add images"
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
          Drag &amp; drop images here, or <strong>click to browse</strong>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
            PNG / JPG / WebP · up to {MAX_IMAGES} images · max 10 MB each
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        data-testid="image-input"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {items.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 12,
            marginTop: items.length && !full ? 14 : 0,
          }}
        >
          {items.map((i) => (
            <div key={i.id}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `1px solid ${i.status === 'error' ? '#ff6060' : 'var(--border)'}`,
                  background: 'var(--bg-surface)',
                }}
              >
                <img
                  src={i.preview}
                  alt={i.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: i.status === 'done' ? 1 : 0.55,
                  }}
                />
                <button type="button" style={removeBtn} onClick={() => remove(i.id)} aria-label="Remove">
                  ×
                </button>
                {i.status === 'done' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      background: 'var(--cyan)',
                      color: '#04201c',
                      borderRadius: 4,
                      fontSize: 11,
                      padding: '1px 6px',
                      fontWeight: 600,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
              {i.status === 'uploading' && (
                <div style={{ ...progressTrack, marginTop: 6 }}>
                  <div style={progressFill(i.progress)} />
                </div>
              )}
              {i.status === 'error' && <div style={errorText}>{i.error}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
