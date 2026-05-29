import { test, expect } from '@playwright/test'
import { validateFile, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '../src/lib/upload'

// Pure unit tests — no browser, no server. Mirror functions/api/presign.ts guards.

test.describe('validateFile — images', () => {
  test('accepts a small image', () => {
    expect(validateFile({ name: 'a.png', type: 'image/png', size: 2048 }, 'image').ok).toBe(true)
  })

  test('rejects a non-image as image', () => {
    const r = validateFile({ name: 'a.mp4', type: 'video/mp4', size: 2048 }, 'image')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/not an image/)
  })

  test('rejects image just over 10 MB', () => {
    const r = validateFile({ name: 'big.png', type: 'image/png', size: MAX_IMAGE_BYTES + 1 }, 'image')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/too large/)
  })

  test('accepts image exactly at 10 MB', () => {
    expect(validateFile({ name: 'edge.png', type: 'image/png', size: MAX_IMAGE_BYTES }, 'image').ok).toBe(true)
  })
})

test.describe('validateFile — videos', () => {
  test('accepts a 499 MB video', () => {
    expect(validateFile({ name: 'demo.mp4', type: 'video/mp4', size: 499 * 1024 * 1024 }, 'video').ok).toBe(true)
  })

  test('rejects a 501 MB video (the size guard)', () => {
    const r = validateFile({ name: 'huge.mp4', type: 'video/mp4', size: 501 * 1024 * 1024 }, 'video')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/500 MB/)
  })

  test('rejects a non-video as video', () => {
    expect(validateFile({ name: 'a.png', type: 'image/png', size: 2048 }, 'video').ok).toBe(false)
  })

  test('rejects an empty file', () => {
    expect(validateFile({ name: 'empty.mp4', type: 'video/mp4', size: 0 }, 'video').ok).toBe(false)
  })
})

test.describe('validateFile — documents (PDF / sketch)', () => {
  test('accepts a PDF', () => {
    expect(validateFile({ name: 'idea.pdf', type: 'application/pdf', size: 1024 * 1024 }, 'document').ok).toBe(true)
  })

  test('accepts an image sketch', () => {
    expect(validateFile({ name: 'sketch.png', type: 'image/png', size: 1024 }, 'document').ok).toBe(true)
  })

  test('rejects a non-pdf/non-image (e.g. zip)', () => {
    const r = validateFile({ name: 'a.zip', type: 'application/zip', size: 1024 }, 'document')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/PDF or image/)
  })

  test('rejects a doc over 25 MB', () => {
    const r = validateFile({ name: 'big.pdf', type: 'application/pdf', size: 26 * 1024 * 1024 }, 'document')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/too large/)
  })
})
