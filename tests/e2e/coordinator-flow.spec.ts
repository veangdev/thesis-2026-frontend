import { test, expect } from '@playwright/test'

/**
 * Coordinator portal flow in mock mode: dashboard KPIs, user management,
 * and the spec §7 acceptance — flipping a cohort's scoring scale 5 → 10
 * visibly changes scoring UIs and chart axes.
 */

test.describe('Coordinator flow', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only flow')

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('coordinator@pnc.edu')
    await page.getByLabel('Password').fill('Password123!')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('dashboard shows KPIs, heatmap, and facilitator workload', async ({
    page,
  }) => {
    await expect(
      page.getByText('Self-Assessors', { exact: true })
    ).toBeVisible()
    await expect(page.getByText(/cycle completion/i)).toBeVisible()
    await expect(page.getByText(/cohort heatmap/i)).toBeVisible()
    await expect(page.getByText(/facilitator workload/i)).toBeVisible()
    // Heatmap rows render student names once analytics load.
    await expect(page.getByText('Sophea Lim').first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('user management: search, drawer, and facilitator assignment', async ({
    page,
  }) => {
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Users' })
      .click()
    await expect(page).toHaveURL(/\/users/)

    await page.getByPlaceholder(/search name or email/i).fill('Sophea')
    await expect(page.getByText('student@pnc.edu')).toBeVisible()

    // Open the profile drawer.
    await page.getByText('Sophea Lim').click()
    await expect(
      page.getByRole('heading', { name: 'Sophea Lim' })
    ).toBeVisible()
    await expect(page.getByText(/facilitator/i).first()).toBeVisible()
  })

  test('flipping a cohort scale 5 → 10 rescales scoring UIs (spec §7)', async ({
    page,
  }) => {
    // Baseline: a completed cohort-1 assessment renders a 5-point radar
    // (no "10" tick on the radius axis).
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Assessments' })
      .click()
    await page
      .getByRole('button', { name: /^open$/i })
      .first()
      .click()
    await page
      .getByRole('link', { name: /^view$/i })
      .first()
      .click()
    await expect(page.getByText(/scored on a 5-point scale/i)).toBeVisible()

    // Switch cohort-1 to the 10-point scale in Settings.
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Settings' })
      .click()
    await page.getByRole('tab', { name: /scoring scale/i }).click()
    await expect(
      page.getByText(/currently scores on a 5-point scale/i)
    ).toBeVisible()
    await page.getByLabel(/10-point scale/i).click()
    await page.getByRole('button', { name: /switch scale/i }).click()
    await expect(
      page.getByText(/now scores on a 10-point scale/i)
    ).toBeVisible()
    await expect(
      page.getByText(/currently scores on a 10-point scale/i)
    ).toBeVisible()

    // The same assessment now renders against the 10-point scale.
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Assessments' })
      .click()
    await page
      .getByRole('button', { name: /^open$/i })
      .first()
      .click()
    await page
      .getByRole('link', { name: /^view$/i })
      .first()
      .click()
    await expect(page.getByText(/scored on a 10-point scale/i)).toBeVisible()
    // Radar radius axis now shows the "10" tick.
    await expect(
      page.locator('svg text', { hasText: /^10$/ }).first()
    ).toBeVisible()
  })
})
