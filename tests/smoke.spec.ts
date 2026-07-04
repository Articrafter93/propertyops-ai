/**
 * Smoke test — PropertyOps AI (portfolio demo)
 *
 * Runs with GLOBAL Playwright (webapp-testing skill), NOT a project dependency.
 * The frontend has no test runner installed by design (sandbox portfolio).
 *
 * Prereq: dev server running with NEXT_PUBLIC_DEMO_AUTH=enabled.
 *   Set-Location "<project>/frontend"; npm run dev
 * Then, from a shell with global Playwright:
 *   $env:BASE_URL="http://localhost:3000"; npx playwright test tests/smoke.spec.ts
 *
 * Covers the MUST-2 role-gating and login/logout flow that the VFH §6 also exercises.
 */
import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const ADMIN = { email: 'admin@propertyops.demo', password: 'Demo1234!' }
const TECH = { email: 'tecnico@propertyops.demo', password: 'Demo1234!' }

async function login(page, { email, password }: { email: string; password: string }) {
  await page.goto(`${BASE}/login`)
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
}

test('unauthenticated root redirects to /login', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page).toHaveURL(/\/login$/)
})

test('admin logs in and lands on /dashboard', async ({ page }) => {
  await login(page, ADMIN)
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('locale toggle switches EN <-> ES', async ({ page }) => {
  await page.goto(`${BASE}/login`)
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  await page.click('button[title="Cambiar a español"]')
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
})

test('technician logs in scoped to /incidents', async ({ page }) => {
  await login(page, TECH)
  await expect(page).toHaveURL(/\/incidents$/)
  // Only "My Incidents" nav item is present for the technician role
  await expect(page.getByText('My Incidents')).toBeVisible()
})

test('technician is redirected away from admin-only /dashboard', async ({ page }) => {
  await login(page, TECH)
  await page.goto(`${BASE}/dashboard`)
  await expect(page).toHaveURL(/\/incidents$/)
})

test('logout returns to /login', async ({ page }) => {
  await login(page, ADMIN)
  await page.click('form button[type="submit"]:has-text("Sign out")')
  await expect(page).toHaveURL(/\/login$/)
})
