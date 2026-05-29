import { test, expect } from '@playwright/test'

// Phase 2 — integration tests, requires live Windmill + NocoDB
// Run against preview: BASE_URL=https://hackathon-73i.pages.dev npx playwright test smoke-integration
// Or locally with real backend wired

const TEST_TEAM  = `smoke-team-${Date.now()}`
const TEST_EMAIL = 'smoke@infrared.city'
const TEST_NICK  = `smokebot-${Date.now()}`

test.describe('API Key flow', () => {
  test('request key → key displayed on page', async ({ page }) => {
    await page.goto('/get-key')
    await page.getByPlaceholder(/team name/i).fill(TEST_TEAM)
    await page.getByPlaceholder(/email/i).fill(TEST_EMAIL)
    await page.getByRole('button', { name: /get my api key/i }).click()

    // Loading state
    await expect(page.getByText(/generating/i)).toBeVisible()

    // Key appears (format: any non-empty string in code block)
    await expect(page.getByText(/your api key/i)).toBeVisible({ timeout: 10_000 })
    const keyEl = page.locator('code').first()
    const key = await keyEl.textContent()
    expect(key?.trim().length, 'API key should be non-empty').toBeGreaterThan(10)
  })

  test('copy button copies key to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/get-key')
    await page.getByPlaceholder(/team name/i).fill(TEST_TEAM + '-copy')
    await page.getByPlaceholder(/email/i).fill(TEST_EMAIL)
    await page.getByRole('button', { name: /get my api key/i }).click()
    await expect(page.getByText(/your api key/i)).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /copy/i }).click()
    await expect(page.getByText(/copied/i)).toBeVisible()
  })
})

test.describe('Participant registration', () => {
  test('register → card appears on canvas', async ({ page }) => {
    await page.goto('/participants')
    await page.getByRole('button', { name: /join the canvas/i }).click()
    await page.getByPlaceholder(/nickname/i).fill(TEST_NICK)
    // Toggle a skill
    await page.getByText('Python').click()
    await page.getByRole('button', { name: /join/i }).last().click()

    // Success message
    await expect(page.getByText(new RegExp(TEST_NICK, 'i'))).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('Project submission → gallery', () => {
  test('submit project → appears in /projects', async ({ page }) => {
    const projectName = `Smoke Test Project ${Date.now()}`

    await page.goto('/submit')
    await page.getByPlaceholder(/project name/i).fill(projectName)
    await page.getByPlaceholder(/one.liner|in one sentence/i).fill('Automated smoke test submission')
    await page.getByRole('combobox').selectOption('Open')
    await page.getByPlaceholder(/what problem/i).fill('Smoke test problem statement')
    await page.getByPlaceholder(/how does your project/i).fill('Smoke test solution statement')
    await page.getByPlaceholder(/team name/i).fill(TEST_TEAM)
    await page.getByPlaceholder(/Ada Lovelace|members|teammates/i).fill(TEST_NICK)
    await page.getByPlaceholder(/github/i).fill('https://github.com/Infrared-city/hackathon')

    await page.getByRole('button', { name: /submit project/i }).click()
    await expect(page.getByText(/your project is live/i)).toBeVisible({ timeout: 10_000 })

    // Navigate to gallery and find it
    await page.goto('/projects')
    await page.waitForTimeout(2000) // allow auto-refresh cycle
    await expect(page.getByText(projectName)).toBeVisible({ timeout: 35_000 })
  })
})

test.describe('Key pool recycling (manual)', () => {
  test.skip('run manually: verify current_index wraps at 100', async () => {
    // Check NocoDB hackathon_config table: current_index should be 0–99
    // After 100 requests it should wrap back to 0
    // This is a manual check via NocoDB UI
  })
})
