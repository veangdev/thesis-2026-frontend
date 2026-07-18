import { test, expect, type Page } from '@playwright/test'

/**
 * Shared screens in mock mode: Journey Star, goals, coaching, notifications,
 * and gap analysis — reachable and functional for their primary roles.
 */

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('Password123!')
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function nav(page: Page, name: string, urlPattern: RegExp) {
  await page
    .getByRole('complementary')
    .getByRole('link', { name, exact: true })
    .click()
  await expect(page).toHaveURL(urlPattern)
}

test.describe('Shared screens', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only flows')

  test('student: journey star with zones and cycle overlays', async ({
    page,
  }) => {
    await login(page, 'student@pnc.edu')
    await nav(page, 'Journey Star', /\/journey-star/)
    await expect(page.getByText(/sophea lim'?s journey star/i)).toBeVisible()
    await expect(page.getByText(/growth zones/i)).toBeVisible()
    await expect(page.getByText('Thriving')).toBeVisible()
    // Overlay a past cycle — it joins the chart legend.
    await page.getByLabel(/cycle 1 — foundation/i).click()
    await expect(
      page.locator('.recharts-legend-item-text').filter({ hasText: 'Cycle 1' })
    ).toBeVisible()
  })

  test('student: creates a goal and bumps progress', async ({ page }) => {
    await login(page, 'student@pnc.edu')
    await nav(page, 'Goals', /\/goals/)
    await page.getByRole('button', { name: /new goal/i }).click()
    await page
      .getByPlaceholder(/speak up once/i)
      .fill('Present a demo without notes')
    await page.getByRole('button', { name: /^create goal$/i }).click()
    await expect(page.getByText('Present a demo without notes')).toBeVisible()
  })

  test('student: notifications center filters and marks read', async ({
    page,
  }) => {
    await login(page, 'student@pnc.edu')
    await nav(page, 'Notifications', /\/notifications/)
    await expect(
      page.getByText(/cycle 4 self-assessment is open/i)
    ).toBeVisible()
    await page.getByRole('button', { name: /mark all read/i }).click()
    await page.getByLabel(/unread only/i).click()
    await expect(page.getByText(/all caught up/i)).toBeVisible()
  })

  test('facilitator: schedules a coaching session', async ({ page }) => {
    await login(page, 'facilitator@pnc.edu')
    await nav(page, 'Coaching', /\/coaching/)
    await page.getByRole('button', { name: /schedule/i }).click()
    await page
      .getByPlaceholder(/interview practice/i)
      .fill('Mock interview marathon')
    // Batch scope auto-includes the roster, so no participant picking needed.
    await page.getByRole('combobox').filter({ hasText: 'Individual' }).click()
    await page.getByRole('option', { name: 'Batch' }).click()
<<<<<<< HEAD
    await page.getByRole('button', { name: /pick a date/i }).click()
=======
    // The schedule dialog has two date pickers (session date + optional
    // follow-up); pick the first (the session date).
    await page
      .getByRole('button', { name: /pick a date/i })
      .first()
      .click()
>>>>>>> origin/main
    await page
      .getByRole('dialog')
      .getByText('15', { exact: true })
      .first()
      .click()
    await page.getByRole('button', { name: /schedule session/i }).click()
    await expect(page.getByText('Mock interview marathon')).toBeVisible()
  })

  test('facilitator: gap analysis renders severity bars', async ({ page }) => {
    await login(page, 'facilitator@pnc.edu')
    await nav(page, 'Assessments', /\/assessments/)
    await page.getByRole('tab', { name: /all assessments/i }).click()
    // Open a COMPLETED assessment — drafts have no mentor scores, so no gap.
    await page
      .locator('[data-slot=card]')
      .filter({ hasText: 'Completed' })
      .first()
      .getByRole('link', { name: /^view$/i })
      .click()
    // The radar re-layout can shift the link mid-click; navigate by href.
    const gapHref = await page
      .getByRole('link', { name: /gap analysis/i })
      .getAttribute('href')
    await page.goto(gapHref as string)
    await expect(page.getByText(/perception gap/i)).toBeVisible()
    await expect(page.getByText('Communication')).toBeVisible()
  })
})
