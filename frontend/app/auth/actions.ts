'use server'

import { redirect } from 'next/navigation'
import { signInLocal, signOutLocal } from '@/lib/auth'
import { getRole } from '@/lib/roles'

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const err = await signInLocal(email, password)
  if (err) return err

  // Redirect by role so the URL matches the landing view (no double-redirect via proxy)
  redirect(getRole(email) === 'tecnico' ? '/incidents' : '/dashboard')
}

export async function signOut() {
  await signOutLocal()
  redirect('/login')
}
