# Nota de Cambio N.º 02 — PropertyOps AI

**Fecha:** 2026-07-02
**Tipo:** Ampliación de alcance (feature) — toggle bilingüe EN/ES
**Referencia:** Decisión del developer durante la regularización; doctrina "Idioma del portafolio" (piso inglés)
**Estado:** Aprobado por el developer ("que tenga un toggle con ambos idiomas")

---

## Qué cambia

Se añade un **toggle de idioma bilingüe (inglés/español)** a toda la superficie renderizada:

| Aspecto | Valor |
|---|---|
| `idioma_render` | `toggle` (antes implícito `es`) |
| Idioma por defecto | **Inglés** (piso de portafolio; el reclutador puede ser internacional) |
| Alternancia | Español, vía toggle persistente en el chrome (sidebar) y en el login |
| Framework | **i18n zero-dependency** por cookie (`propertyops_locale`), sin añadir paquetes |
| Persistencia | Cookie leída server-side (`next/headers`), default `en` |

## Por qué

- Doctrina de portafolio exige superficie recruiter-facing en **inglés** (lingua franca técnico). El developer eligió `toggle` para demostrar i18n real además de cumplir el piso inglés.
- `reclutador-exigente` (Fase 7) verifica idioma; sin esto sería cabo suelto que bloquea `APTO_PORTAFOLIO`.

## Arquitectura (i18n zero-dep)

- `lib/i18n/config.ts` — locales, default `en`, nombre de cookie.
- `lib/i18n/messages/{en,es}.ts` — catálogo tipado por namespace; `es: typeof en` fuerza paridad de claves.
- `lib/i18n/server.ts` — `getLocale()` / `getDictionary()` para Server Components (async, lee cookie).
- `lib/i18n/client.tsx` — `I18nProvider` + `useDict()`/`useI18n()` para Client Components (context).
- `lib/i18n/format.ts` — formatters locale-aware (`fmtCurrency` EUR en-GB/es-ES, `fmtDate`, `fmtRelativeTime`).
- `components/LocaleToggle.tsx` — toggle client (setea cookie + `router.refresh()`).
- Enums de estado (StatusBadge) y SLA localizados por mapa; datos libres del seed (nombres, descripciones) permanecen como contenido demo (esperado en sandbox).

## Cobertura

**Internacionalizado (EN default + ES):** las 11 vistas (dashboard, login, incidencias, onboarding, inquilinos, inquilinos/[id], habitaciones, habitaciones/[id], checkout, inspecciones, inspecciones/[id], automatizaciones) + `/privacidad` (público, con `generateMetadata` localizado) + chrome (Sidebar, TopBar, StatusBadge, SlaIndicator, KpiCard) + `<html lang>` dinámico + metadata raíz en inglés.

### Ampliación (2026-07-02, decisión del developer "opción B"): contenido del seed también bilingüe

Se extendió el i18n al **contenido de datos del `seed.json`** (antes quedaba en español como dato demo):

- **Campos enum-like** (pocos valores, muchas vistas) → mapas en el catálogo (`seedContent`): `roomType`, `employment`, `paymentType`, `specialty`, `scenario`.
- **Texto libre único** (por registro) → `lib/i18n/seed-en.ts` (traducciones EN keyed por id, sin tocar `seed.json`): `incident.description`, `activity_feed.message`, `inspection.notes/findings/billable_items`, `payment.note`.
- **Preservado como está** (no se traduce): nombres propios (personas, ciudades), IDs, fechas, `error_log.error` (ya en inglés técnico), `inspection.type` (Check-in/Check-out).

Verificado en navegador ambas direcciones: EN "New incident INC-005 opened — Ceiling leaks" ↔ ES "Nueva incidencia INC-005 abierta — Filtraciones techo", con nombres propios (María Flores Campos, Pedro Sánchez) intactos. lint 0/0, build PASS, sin deps nuevas.

## Validación

- `npm run lint` PASS (0/0), `npm run build` PASS (15 rutas). Sin dependencias nuevas.
- Toggle verificado a nivel de compilación; la verificación funcional en vivo (cambiar idioma en el navegador) entra en la VFH (Fase 6).

## Nota

Aprovechando esta pasada se corrigió una referencia rezagada a "Supabase Auth" en `/privacidad` (la perdió el grep de Fase 2 por estar en `.tsx`, no `.md`) → ahora "sesión mock local".
