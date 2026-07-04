import type { Locale } from './config'
import { NOW } from '@/lib/seed'

const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', es: 'es-ES' }

export function fmtCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], { style: 'currency', currency: 'EUR' }).format(amount)
}

export function fmtDate(dateStr: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

export function fmtRelativeTime(dateStr: string, locale: Locale): string {
  const diff = NOW.getTime() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (locale === 'en') {
    if (days > 1) return `${days} days ago`
    if (days === 1) return '1 day ago'
    if (hours > 1) return `${hours} hours ago`
    return 'less than 1 hour ago'
  }
  if (days > 1) return `hace ${days} días`
  if (days === 1) return 'hace 1 día'
  if (hours > 1) return `hace ${hours} horas`
  return 'hace menos de 1 hora'
}
