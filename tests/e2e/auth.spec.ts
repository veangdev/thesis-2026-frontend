import { test, expect, type Page } from '@playwright/test'

/**
 * Auth flows in mock mode (NEXT_PUBLIC_USE_MOCKS=true — set by the Playwright
 * webServer config). Demo credentials come from the seeded mock db.
 */

const PASSWORD = 'Password123!'

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

test.describe('Authentication', () => {
  test('rejects wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('student@pnc.edu')
    await page.getByLabel('Password').fill('nope')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('student logs in, sees student nav, and logs out', async ({ page }) => {
    await login(page, 'student@pnc.edu')

    const sidebar = page.getByRole('complementary')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(
      sidebar.getByRole('link', { name: 'Journey Star', exact: true })
    ).toBeVisible()
    // Student must NOT see coordinator-only areas.
    await expect(sidebar.getByRole('link', { name: 'Users' })).toHaveCount(0)
    await expect(sidebar.getByRole('link', { name: 'Settings' })).toHaveCount(0)

    // Log out via the sidebar user menu.
    await sidebar.getByRole('button', { name: /open account menu/i }).click()
    await page.getByRole('menuitem', { name: /log out/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('facilitator sees staff nav', async ({ page }) => {
    await login(page, 'facilitator@pnc.edu')
    const sidebar = page.getByRole('complementary')
    await expect(sidebar.getByRole('link', { name: 'Teams' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Users' })).toHaveCount(0)
  })

  test('coordinator sees the full nav', async ({ page }) => {
    await login(page, 'coordinator@pnc.edu')
    const sidebar = page.getByRole('complementary')
    await expect(sidebar.getByRole('link', { name: 'Users' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Settings' })).toBeVisible()
  })

  test('authenticated users are bounced away from the login page', async ({
    page,
  }) => {
    await login(page, 'student@pnc.edu')
    await page.goto('/login')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
