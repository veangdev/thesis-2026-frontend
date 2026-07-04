import { test, expect } from '@playwright/test'

/**
 * Facilitator portal flow in mock mode: dashboard → review queue → mentor
 * workspace → score/agree → complete the cycle. The seeded db guarantees
 * facilitator@pnc.edu has self_submitted assessments waiting.
 */

test.describe('Facilitator flow', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only flow')

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('facilitator@pnc.edu')
    await page.getByLabel('Password').fill('Password123!')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('dashboard shows roster, queue, and alerts', async ({ page }) => {
    await expect(page.getByText(/assigned students/i)).toBeVisible()
    await expect(page.getByText(/pending reviews/i)).toBeVisible()
    await expect(page.getByText('Ready for review')).toBeVisible()
    // Roster renders student cards.
    await expect(page.getByText(/my students/i)).toBeVisible()
  })

  test('reviews a submitted assessment through to completion', async ({
    page,
  }) => {
    // Open the review queue and pick the first submitted item.
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Assessments' })
      .click()
    await expect(
      page.getByRole('tab', { name: /needs attention/i })
    ).toBeVisible()
    await page
      .getByRole('link', { name: /^review$/i })
      .first()
      .click()

    // Side-by-side workspace: student column + mentor scoring.
    await expect(page.getByText(/student self-score/i).first()).toBeVisible()

    // Score all 8 dimensions at 3/5 and agree at 3.
    for (let index = 0; index < 8; index += 1) {
      const card = page
        .locator('[data-slot=card]')
        .filter({ hasText: 'Your score' })
        .nth(index)
      await card.getByRole('radio', { name: '3 of 5' }).click()
      await card.getByRole('button', { name: /agreed 3 of 5/i }).click()
    }

    await page
      .getByPlaceholder(/summarize the conversation/i)
      .fill('Solid cycle — we agreed on next steps together.')

    // Agree, then complete.
    await page.getByRole('button', { name: /mark scores agreed/i }).click()
    await expect(page.getByText(/ready to complete/i)).toBeVisible()
    await page.getByRole('button', { name: /complete cycle/i }).click()
    await expect(page.getByText(/cycle is complete/i)).toBeVisible()
    await expect(
      page.getByText(/cycle completed — great mentoring/i)
    ).toBeVisible()
  })
})
