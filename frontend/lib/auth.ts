import { cookies } from 'next/headers'
import { getRole, type UserRole } from './roles'
import { isValidDemoAccount } from './demo-accounts'

const COOKIE_NAME = 'propertyops_demo_session'

export function isDemoAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_AUTH === 'enabled'
}

export interface Session {
  email: string
  role: UserRole
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  const email = store.get(COOKIE_NAME)?.value ?? null
  if (!email) return null
  return { email, role: getRole(email) }
}

// Error codes (localized in the client via the i18n dictionary)
export type AuthErrorCode = 'demoDisabled' | 'invalidCredentials'

export async function signInLocal(
  email: string,
  password: string
): Promise<{ error: AuthErrorCode } | null> {
  if (!isDemoAuthEnabled()) {
    return { error: 'demoDisabled' }
  }
  if (!isValidDemoAccount(email, password)) {
    return { error: 'invalidCredentials' }
  }
  const store = await cookies()
  store.set(COOKIE_NAME, email, { httpOnly: true, path: '/', sameSite: 'lax' })
  return null
}

export async function signOutLocal(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
