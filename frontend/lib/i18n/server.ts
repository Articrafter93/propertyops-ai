import { cookies } from 'next/headers'
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from './config'
import { en } from './messages/en'
import { es } from './messages/es'

export type Dictionary = typeof en

const DICTIONARIES: Record<Locale, Dictionary> = { en, es }

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()]
}

export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}
