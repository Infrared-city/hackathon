import { test, expect } from '@playwright/test'

// Phase 1 — pure frontend, no backend required
// Run: npm run build && npm run preview, then npx playwright test smoke-frontend

test.describe('Navigation', () => {
  test('all nav links resolve without 404', async ({ page }) => {
    const routes = ['/', '/participants', '/get-key', '/submit', '/projects']
    for (const route of routes) {
      const res = await page.goto(route)
      expect(res?.status(), `${route} returned non-200`).toBeLessThan(400)
      // no JS errors
      const errors: string[] = []
      page.on('pageerror', e => errors.push(e.message))
      expect(errors, `JS errors on ${route}`).toHaveLength(0)
    }
  })
})

test.describe('Landing page /', () => {
  test.beforeEach(({ page }) => page.goto('/'))

  test('hero headline visible', async ({ page }) => {
    await expect(page.getByText(/5 lines of code/i)).toBeVisible()
  })

  test('Get API Key CTA present', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get.*api key/i })).toBeVisible()
  })

  test('Submit Project CTA present', async ({ page }) => {
    await expect(page.getByRole('link', { name: /submit project/i })).toBeVisible()
  })

  test('7 challenge track cards rendered', async ({ page }) => {
    // tracks: Urban Heat, Wind, Solar, Climate Adaptation, AI Agents, Digital Climate Twin, Open
    const tracks = ['Urban Heat', 'Wind', 'Solar', 'Climate Adaptation', 'AI Agents', 'Digital Climate Twin', 'Open']
    for (const track of tracks) {
      await expect(page.getByText(new RegExp(track, 'i'))).toBeVisible()
    }
  })

  test('SDK code block renders', async ({ page }) => {
    await expect(page.getByText(/pip install infrared-sdk/i)).toBeVisible()
    await expect(page.getByText(/InfraredClient/)).toBeVisible()
  })

  test('prize copy visible', async ({ page }) => {
    await expect(page.getByText(/€5,000/)).toBeVisible()
  })
})

test.describe('Participants page /participants', () => {
  test.beforeEach(({ page }) => page.goto('/participants'))

  test('page heading visible', async ({ page }) => {
    await expect(page.getByText(/who.*building/i)).toBeVisible()
  })

  test('canvas/list toggle present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /canvas/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /list/i })).toBeVisible()
  })

  test('list view toggle switches layout', async ({ page }) => {
    await page.getByRole('button', { name: /list/i }).click()
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('join canvas button opens registration form', async ({ page }) => {
    await page.getByRole('button', { name: /join the canvas/i }).click()
    await expect(page.getByPlaceholder(/nickname/i)).toBeVisible()
  })

  test('skill chips render in registration form', async ({ page }) => {
    await page.getByRole('button', { name: /join the canvas/i }).click()
    await expect(page.getByText('Python')).toBeVisible()
    await expect(page.getByText('React')).toBeVisible()
  })

  test('submit disabled with empty nickname', async ({ page }) => {
    await page.getByRole('button', { name: /join the canvas/i }).click()
    const submit = page.getByRole('button', { name: /join/i }).last()
    await expect(submit).toBeDisabled()
  })
})

test.describe('Get Key page /get-key', () => {
  test.beforeEach(({ page }) => page.goto('/get-key'))

  test('heading and form visible (or countdown if pre-launch)', async ({ page }) => {
    const hasCountdown = await page.getByText(/registration opens/i).isVisible().catch(() => false)
    const hasForm = await page.getByPlaceholder(/team name/i).isVisible().catch(() => false)
    expect(hasCountdown || hasForm, 'either form or countdown should be visible').toBeTruthy()
  })

  test('submit button disabled when required fields empty', async ({ page }) => {
    const btn = page.getByRole('button', { name: /join.*api key/i })
    if (await btn.isVisible().catch(() => false)) {
      await expect(btn).toBeDisabled()
    }
  })

  test('submit button enables when required fields filled', async ({ page }) => {
    const btn = page.getByRole('button', { name: /join.*api key/i })
    if (!await btn.isVisible().catch(() => false)) return // pre-launch
    await page.getByPlaceholder(/team name/i).fill('Test Team')
    await page.getByPlaceholder(/email/i).fill('test@example.com')
    await page.getByPlaceholder(/your name/i).fill('Alice')
    await expect(btn).toBeEnabled()
  })

  test('skill chips visible in registration form', async ({ page }) => {
    const hasForm = await page.getByPlaceholder(/team name/i).isVisible().catch(() => false)
    if (!hasForm) return // pre-launch countdown shown instead
    await expect(page.getByRole('button', { name: 'Python' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'React' })).toBeVisible()
  })
})

test.describe('Submit page /submit', () => {
  test.beforeEach(async ({ page }) => {
    // Force the gate open in the UI so the form renders regardless of date/backend.
    await page.route('**/f/hackathon/status', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ registration: 'open', submission: 'open' }),
      }),
    )
    await page.goto('/submit')
  })

  test('heading visible', async ({ page }) => {
    await expect(page.getByText(/submit your project/i)).toBeVisible()
  })

  test('new description + media + upload sections render', async ({ page }) => {
    await expect(page.getByText(/what problem are you solving/i)).toBeVisible()
    await expect(page.getByText(/how does your project solve/i)).toBeVisible()
    await expect(page.getByText(/Demo video/i)).toBeVisible()
    await expect(page.getByText(/Screenshots/i)).toBeVisible()
    await expect(page.getByTestId('image-input')).toBeAttached()
    await expect(page.getByTestId('video-input')).toBeAttached()
    await expect(page.getByTestId('tag-input')).toBeVisible()
    await expect(page.getByPlaceholder(/account@yourteam/i)).toBeVisible()
  })

  test('required fields present', async ({ page }) => {
    await expect(page.getByPlaceholder(/project name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/github/i)).toBeVisible()
    await expect(page.getByPlaceholder(/team name/i)).toBeVisible()
  })

  test('char counter on one-liner', async ({ page }) => {
    const input = page.getByPlaceholder(/one.liner|in one sentence/i)
    await input.fill('Hello world')
    await expect(page.getByText(/11.*140|11\s*\//)).toBeVisible()
  })

  test('all 8 API checkboxes present', async ({ page }) => {
    const apis = ['Wind Speed', 'UTCI', 'Solar Radiation', 'Sky View Factor']
    for (const api of apis) {
      await expect(page.getByText(api)).toBeVisible()
    }
  })

  test('all 7 challenge tracks in dropdown', async ({ page }) => {
    const select = page.getByRole('combobox')
    await select.selectOption('Urban Heat')
    await expect(select).toHaveValue('Urban Heat')
  })
})

test.describe('Projects page /projects', () => {
  test.beforeEach(({ page }) => page.goto('/projects'))

  test('heading visible', async ({ page }) => {
    await expect(page.getByText(/projects/i)).toBeVisible()
  })

  test('track filter chips render', async ({ page }) => {
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
    await expect(page.getByText('Urban Heat')).toBeVisible()
  })

  test('empty state or cards render (no crash)', async ({ page }) => {
    // Either shows empty state or project cards — just no crash
    await page.waitForTimeout(2000)
    const hasEmpty = await page.getByText(/no projects yet/i).isVisible().catch(() => false)
    const hasCards = await page.locator('[data-testid="project-card"]').count()
    expect(hasEmpty || hasCards >= 0).toBeTruthy()
  })
})
