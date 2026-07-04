'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './config'
import { en } from './messages/en'
import { es } from './messages/es'

export type Dictionary = typeof en

const DICTIONARIES: Record<Locale, Dictionary> = { en, es }

interface I18nValue {
  locale: Locale
  dict: Dictionary
}

const I18nContext = createContext<I18nValue>({ locale: 'en', dict: en })

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict: DICTIONARIES[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nValue {
  return useContext(I18nContext)
}

export function useDict(): Dictionary {
  return useContext(I18nContext).dict
}
