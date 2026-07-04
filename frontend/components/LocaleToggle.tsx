'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Languages } from 'lucide-react'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'

export function LocaleToggle() {
  const { locale, dict } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function setLocale(next: Locale) {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div
      className="inline-flex items-center rounded-md border border-border overflow-hidden text-[11px] font-semibold"
      role="group"
      aria-label={dict.locale.label}
    >
      <Languages className="w-3 h-3 mx-1.5 text-muted-foreground shrink-0" aria-hidden />
      <button
        type="button"
        onClick={() => setLocale('en')}
        disabled={pending || locale === 'en'}
        aria-pressed={locale === 'en'}
        title={dict.locale.switchToEn}
        className={`px-2 py-1 transition-colors ${locale === 'en' ? 'bg-[#1a7070] text-white' : 'text-muted-foreground hover:bg-muted cursor-pointer'}`}
      >
        {dict.locale.en}
      </button>
      <button
        type="button"
        onClick={() => setLocale('es')}
        disabled={pending || locale === 'es'}
        aria-pressed={locale === 'es'}
        title={dict.locale.switchToEs}
        className={`px-2 py-1 transition-colors ${locale === 'es' ? 'bg-[#1a7070] text-white' : 'text-muted-foreground hover:bg-muted cursor-pointer'}`}
      >
        {dict.locale.es}
      </button>
    </div>
  )
}
