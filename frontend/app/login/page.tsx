import { LoginForm } from './LoginForm'
import { getLocale } from '@/lib/i18n/server'
import { I18nProvider } from '@/lib/i18n/client'

export default async function LoginPage() {
  const locale = await getLocale()
  return (
    <I18nProvider locale={locale}>
      <LoginForm />
    </I18nProvider>
  )
}
