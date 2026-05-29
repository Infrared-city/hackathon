import { test, expect } from '@playwright/test'

// Gallery rendering with mocked NocoDB data — no backend required.
// Proves /projects renders the new fields + uploaded media (image thumbnail,
// tags, video link) and tolerates NocoDB's comma/newline-joined string fields.

const SAMPLE = {
  list: [
    {
      Id: 1,
      project_name: 'Urban Cool Mapper',
      one_liner: 'Maps urban heat islands from open data',
      team_name: 'Team Heat',
      members: 'Ada, Alan',
      challenge_track: 'Urban Heat',
      github_url: 'https://github.com/example/cool-mapper',
      demo_url: 'https://demo.example.com',
      video_url: 'https://youtu.be/example',
      // NocoDB returns multi-value fields as joined strings:
      apis_used: 'UTCI, Wind Speed, Solar Radiation, Sky View Factor',
      tags: 'heat-island, mobility',
      screenshots:
        'https://pub-9b430102b05b40a6aa3a156164ecbaaf.r2.dev/submissions/images/one.png\nhttps://pub-9b430102b05b40a6aa3a156164ecbaaf.r2.dev/submissions/images/two.png',
      problem: 'Cities overheat',
      solution: 'Identify hotspots',
      submitted_at: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  ],
  pageInfo: { totalRows: 1 },
}

test.describe('Projects gallery (mocked data)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      (url) => url.pathname.includes('/records'),
      (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(SAMPLE),
        }),
    )
  })

  test('renders a card with title, one-liner and team', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByText('Urban Cool Mapper')).toBeVisible()
    await expect(page.getByText(/maps urban heat islands/i)).toBeVisible()
    await expect(page.getByText(/Team Heat/)).toBeVisible()
  })

  test('renders the uploaded image as a thumbnail', async ({ page }) => {
    await page.goto('/projects')
    const img = page.getByRole('img', { name: 'Urban Cool Mapper' })
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('src', /submissions\/images\/one\.png$/)
  })

  test('renders tags and a video link', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByText('#heat-island')).toBeVisible()
    await expect(page.getByRole('link', { name: /video/i })).toBeVisible()
  })

  test('caps APIs shown and indicates the remainder', async ({ page }) => {
    await page.goto('/projects')
    // 4 APIs in data, 3 shown -> "+1 more"
    await expect(page.getByText(/\+1 more/)).toBeVisible()
  })
})
