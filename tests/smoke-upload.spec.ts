import { test, expect } from '@playwright/test'

// Phase 2 — REAL upload chain: browser -> /api/presign -> PUT directly to R2.
// Requires the presign Function running with valid R2 creds:
//
//   cp .dev.vars.example .dev.vars   # fill R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
//   npm run pages:dev                # terminal 1 (wrangler pages dev on :8788)
//   npm run test:upload              # terminal 2
//
// The submission gate is forced open in the UI only (server-side gate untouched);
// these tests stop at the upload step and never write to NocoDB.

// 1x1 transparent PNG.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
  'base64',
)
// Tiny dummy bytes — R2 stores any payload; content is not validated.
const MP4 = Buffer.from('AAAAIGZ0eXBpc29t', 'base64')

const openGate = async (page: import('@playwright/test').Page) =>
  page.route('**/f/hackathon/status', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ registration: 'open', submission: 'open' }),
    }),
  )

const isR2Put = (r: import('@playwright/test').Response) =>
  r.url().includes('r2.cloudflarestorage.com') && r.request().method() === 'PUT'

test.describe('Upload chain (real presign -> R2)', () => {
  test('image: presign 200 -> PUT 2xx -> public GET 200', async ({ page, request }) => {
    await openGate(page)
    await page.goto('/submit')
    await expect(page.getByText(/submit your project/i)).toBeVisible({ timeout: 10_000 })

    const presignResp = page.waitForResponse('**/api/presign')
    const putResp = page.waitForResponse(isR2Put)
    await page.getByTestId('image-input').setInputFiles({
      name: 'shot.png',
      mimeType: 'image/png',
      buffer: PNG,
    })

    const presign = await (await presignResp).json()
    expect(presign.publicUrl, 'publicUrl points at the bucket').toContain('r2.dev')

    const put = await putResp
    expect(put.status(), 'R2 accepted the PUT').toBeGreaterThanOrEqual(200)
    expect(put.status()).toBeLessThan(300)

    const got = await request.get(presign.publicUrl)
    expect(got.status(), 'object is publicly retrievable').toBe(200)

    await expect(page.getByRole('img', { name: 'shot.png' })).toBeVisible()
  })

  test('video: presign 200 -> PUT 2xx -> "Uploaded"', async ({ page }) => {
    await openGate(page)
    await page.goto('/submit')
    await expect(page.getByText(/submit your project/i)).toBeVisible({ timeout: 10_000 })

    const putResp = page.waitForResponse(isR2Put)
    await page.getByTestId('video-input').setInputFiles({
      name: 'demo.mp4',
      mimeType: 'video/mp4',
      buffer: MP4,
    })

    const put = await putResp
    expect(put.status()).toBeGreaterThanOrEqual(200)
    expect(put.status()).toBeLessThan(300)
    await expect(page.getByText(/✓ Uploaded/i)).toBeVisible({ timeout: 20_000 })
  })

  test('oversize video is rejected client-side (no presign call)', async ({ page }) => {
    await openGate(page)
    await page.goto('/submit')
    await expect(page.getByText(/submit your project/i)).toBeVisible({ timeout: 10_000 })

    let presignCalled = false
    await page.route('**/api/presign', (route) => {
      presignCalled = true
      route.continue()
    })

    // 501 MB sparse buffer would be heavy; fabricate a File with a spoofed size
    // via the DataTransfer API so the client size-guard runs without moving bytes.
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('[data-testid="video-input"]')!
      const big = new File([new Uint8Array(8)], 'huge.mp4', { type: 'video/mp4' })
      Object.defineProperty(big, 'size', { value: 501 * 1024 * 1024 })
      const dt = new DataTransfer()
      dt.items.add(big)
      input.files = dt.files
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    await expect(page.getByText(/too large/i)).toBeVisible({ timeout: 5_000 })
    expect(presignCalled, 'no presign request for an oversize file').toBe(false)
  })
})
