/// <reference types="@cloudflare/workers-types" />
import { AwsClient } from 'aws4fetch'

// Cloudflare Pages Function — POST /api/presign
// Mints a short-lived presigned R2 PUT URL so the browser can upload a file
// (image or video) DIRECTLY to R2, bypassing the Worker request-body limit.
// The R2 credentials live only here (runtime secret) — never in the bundle.

interface Env {
  R2_ACCOUNT_ID: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_BUCKET: string
  R2_PUBLIC_BASE: string // e.g. https://pub-xxxx.r2.dev (no trailing slash)
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024 // 500 MB
const MAX_DOC_BYTES = 25 * 1024 * 1024 // 25 MB (PDF / sketch)
const URL_TTL_SECONDS = 3600 // 1h — generous for a 500 MB upload on a slow line

type Kind = 'image' | 'video' | 'document'

interface PresignRequest {
  name: string
  type: string
  size: number
  kind: Kind
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function sanitizeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file'
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80) || 'file'
}

function validate(body: Partial<PresignRequest>): string | null {
  const { name, type, size, kind } = body
  if (kind !== 'image' && kind !== 'video' && kind !== 'document')
    return 'kind must be "image", "video" or "document"'
  if (typeof name !== 'string' || !name.trim()) return 'name is required'
  if (typeof type !== 'string' || !type) return 'type is required'
  if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) return 'size is required'

  if (kind === 'image') {
    if (!type.startsWith('image/')) return 'images must be image/* files'
    if (size > MAX_IMAGE_BYTES) return `images must be <= ${MAX_IMAGE_BYTES / 1024 / 1024} MB`
  } else if (kind === 'video') {
    if (!type.startsWith('video/')) return 'videos must be video/* files'
    if (size > MAX_VIDEO_BYTES) return `videos must be <= ${MAX_VIDEO_BYTES / 1024 / 1024} MB`
  } else {
    if (type !== 'application/pdf' && !type.startsWith('image/'))
      return 'documents must be a PDF or image'
    if (size > MAX_DOC_BYTES) return `documents must be <= ${MAX_DOC_BYTES / 1024 / 1024} MB`
  }
  return null
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET ||
    !env.R2_PUBLIC_BASE
  ) {
    return json({ error: 'Upload is not configured (missing R2 env).' }, 500)
  }

  let body: Partial<PresignRequest>
  try {
    body = (await request.json()) as Partial<PresignRequest>
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const invalid = validate(body)
  if (invalid) return json({ error: invalid }, 400)

  const { name, kind } = body as PresignRequest
  const key = `submissions/${kind}s/${crypto.randomUUID()}-${sanitizeName(name)}`

  const aws = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    region: 'auto',
    service: 's3',
  })

  const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const target = new URL(`${endpoint}/${env.R2_BUCKET}/${key}`)
  target.searchParams.set('X-Amz-Expires', String(URL_TTL_SECONDS))

  // signQuery => credentials go in the query string (presigned URL).
  // Only `host` is signed, so the browser may send any Content-Type freely.
  const signed = await aws.sign(target.toString(), {
    method: 'PUT',
    aws: { signQuery: true },
  })

  const publicBase = env.R2_PUBLIC_BASE.replace(/\/+$/, '')
  return json({
    putUrl: signed.url,
    publicUrl: `${publicBase}/${key}`,
    key,
    expiresIn: URL_TTL_SECONDS,
  })
}
