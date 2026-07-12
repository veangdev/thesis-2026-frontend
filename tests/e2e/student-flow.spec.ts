import { test, expect, type Page } from '@playwright/test'

/**
 * Self-Assessor portal flow in mock mode: dashboard → continue the draft
 * assessment → score all dimensions → review → submit → success state.
 * The mock db seeds student@pnc.edu with a clean draft in the active cycle.
 */

test.describe('Student flow', () => {
  // Desktop-first flows; the tablet/mobile pass happens in the polish phase.
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only flow')

  async function login(page: Page, email = 'student@pnc.edu') {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('Password123!')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
  }

  test('dashboard shows the journey hero, star, and trend', async ({
    page,
  }) => {
    await login(page)
    await expect(
      page.getByRole('heading', { name: /welcome back, sophea/i })
    ).toBeVisible()
    await expect(page.getByText(/journey progress/i)).toBeVisible()
    await expect(page.getByText(/my journey star/i)).toBeVisible()
    // The radar renders dimension labels once analytics load.
    await expect(
      page.locator('svg').getByText('Communication').first()
    ).toBeVisible({ timeout: 10_000 })
  })

  test('completes the self-assessment wizard end-to-end', async ({ page }) => {
    await login(page)
    // The hero CTA links straight to the draft assessment.
    await page.getByRole('link', { name: /continue cycle 4/i }).click()
    await expect(page).toHaveURL(/\/assessments\//)

    // Score all 8 dimensions at 4/5, adding a reflection on the first.
    for (let step = 0; step < 8; step += 1) {
      await expect(page.getByText(`Dimension ${step + 1} of 8`)).toBeVisible()
      await page.getByRole('radio', { name: '4 of 5' }).click()
      if (step === 0) {
        await page
          .getByPlaceholder(/led our stand-up/i)
          .fill('I presented our project demo to the whole class.')
      }
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }

    // Review step: everything scored, submit unlocked.
    await expect(page.getByText(/review your star/i)).toBeVisible()
    await expect(page.getByText('8/8 scored')).toBeVisible()
    await page
      .getByPlaceholder(/what defined this cycle/i)
      .fill('I stepped out of my comfort zone this cycle.')
    await page.getByRole('button', { name: /submit assessment/i }).click()

    // Success animation state.
    await expect(page.getByText(/assessment submitted/i)).toBeVisible()

    // The assessment list now shows the submitted status. Navigate in-app:
    // a full page load would re-seed the in-memory mock db.
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Assessments' })
      .click()
    await expect(page.getByText('Self-Submitted').first()).toBeVisible()
  })

  test('draft autosave survives leaving the wizard', async ({ page }) => {
    // A different seeded student with their own active-cycle draft, so this
    // test never races the submit test for the same record (shared mock db).
    await login(page, 'piseth.heng@student.pnc.edu.kh')
    await page.getByRole('link', { name: /continue cycle 4/i }).click()
    await page.getByRole('radio', { name: '5 of 5' }).click()
    await page.getByRole('button', { name: /save draft/i }).click()
    await expect(page.getByText(/draft saved/i)).toBeVisible()

    // Leave and come back via in-app navigation (a full reload would re-seed
    // the in-memory mock db) — the score is restored from the saved draft.
    await page
      .getByRole('complementary')
      .getByRole('link', { name: 'Assessments' })
      .click()
    await page
      .getByRole('link', { name: /continue/i })
      .first()
      .click()
    await expect(page.getByText('1/8 scored')).toBeVisible()
  })
})
