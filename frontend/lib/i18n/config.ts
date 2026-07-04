export type Locale = 'en' | 'es'

export const locales: Locale[] = ['en', 'es']

// English is the portfolio floor → default rendered language
export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'propertyops_locale'

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'es'
}
