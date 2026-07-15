import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows the hero', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', {
        name: /track self-assessor growth from learning to employment/i,
      })
    ).toBeVisible()
  })

  test('renders the eight skill dimensions', async ({ page }) => {
    await page.goto('/')
    const dimensions = page.locator('#dimensions')
    await dimensions.scrollIntoViewIfNeeded()
    await expect(
      dimensions.getByText('Communication', { exact: true })
    ).toBeVisible()
    await expect(
      dimensions.getByText('Adaptability', { exact: true })
    ).toBeVisible()
  })

  test('dashboard CTA sends signed-out visitors to the login page', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .locator('#overview')
      .getByRole('link', { name: /explore dashboard/i })
      .click()
    await expect(page).toHaveURL(/\/login/)
    await expect(
      page.getByRole('heading', { name: /welcome back/i })
    ).toBeVisible()
  })

  test('deep links to protected routes redirect to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Routing', () => {
  test('renders a 404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('heading', { name: /this star isn't on the map/i })
    ).toBeVisible()
  })
})
