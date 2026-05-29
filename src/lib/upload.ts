// Client-side R2 upload helper.
// Flow: validate -> POST /api/presign -> PUT file directly to R2 (with progress).
// The big file never passes through our server — only the tiny presign call does.

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024 // 500 MB
export const MAX_DOC_BYTES = 25 * 1024 * 1024 // 25 MB (PDF / sketch)
export const MAX_IMAGES = 5
export const MAX_DOCS = 5

export type UploadKind = 'image' | 'video' | 'document'

export interface FileMeta {
  name: string
  type: string
  size: number
}

export interface ValidationResult {
  ok: boolean
  error?: string
}

function mb(bytes: number): number {
  return Math.round(bytes / 1024 / 1024)
}

/** Pure, side-effect-free — mirrors the server-side check in functions/api/presign.ts. */
export function validateFile(file: FileMeta, kind: UploadKind): ValidationResult {
  if (kind === 'image') {
    if (!file.type.startsWith('image/')) return { ok: false, error: `${file.name}: not an image` }
    if (file.size > MAX_IMAGE_BYTES)
      return { ok: false, error: `${file.name}: image too large (max ${mb(MAX_IMAGE_BYTES)} MB)` }
  } else if (kind === 'video') {
    if (!file.type.startsWith('video/')) return { ok: false, error: `${file.name}: not a video` }
    if (file.size > MAX_VIDEO_BYTES)
      return { ok: false, error: `${file.name}: video too large (max ${mb(MAX_VIDEO_BYTES)} MB)` }
  } else {
    const okType = file.type === 'application/pdf' || file.type.startsWith('image/')
    if (!okType) return { ok: false, error: `${file.name}: must be a PDF or image` }
    if (file.size > MAX_DOC_BYTES)
      return { ok: false, error: `${file.name}: file too large (max ${mb(MAX_DOC_BYTES)} MB)` }
  }
  if (file.size <= 0) return { ok: false, error: `${file.name}: empty file` }
  return { ok: true }
}

export interface PresignResponse {
  putUrl: string
  publicUrl: string
  key: string
  expiresIn: number
}

async function presign(file: FileMeta, kind: UploadKind): Promise<PresignResponse> {
  const res = await fetch('/api/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, type: file.type, size: file.size, kind }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error((detail as { error?: string }).error || `Could not start upload (${res.status})`)
  }
  return res.json() as Promise<PresignResponse>
}

/** PUT the file straight to R2, reporting 0–100 progress. Resolves on 2xx. */
function putWithProgress(
  putUrl: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', putUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (HTTP ${xhr.status})`))
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.onabort = () => reject(new Error('Upload cancelled'))
    xhr.send(file)
  })
}

/** Validate, presign, and upload one file. Returns the public URL on success. */
export async function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress: (pct: number) => void = () => {},
): Promise<string> {
  const v = validateFile(file, kind)
  if (!v.ok) throw new Error(v.error)
  const { putUrl, publicUrl } = await presign(file, kind)
  await putWithProgress(putUrl, file, onProgress)
  return publicUrl
}
