# Smoke Test — Resultados de corrida

**Fecha:** 2026-07-02
**Herramienta:** navegador conducido por el agente (preview/Playwright global), dev server local con `NEXT_PUBLIC_DEMO_AUTH=enabled`.
**Script:** `tests/smoke.spec.ts` (re-ejecutable con Playwright global).
**Build/lint:** `npm run lint` 0/0 · `npm run build` PASS (15 rutas) al momento de la corrida.

> **Nota (2026-07-04):** en la cadena de cierre GATE 9 las rutas se renombraron ES→EN (`/incidencias`→`/incidents`, etc.) por el gate de `reclutador-exigente` (idioma recruiter-facing). Las rutas `/incidencias` citadas abajo corresponden a esta corrida histórica; el spec re-ejecutable `tests/smoke.spec.ts` ya usa las rutas inglesas, re-verificadas por smoke el 2026-07-04 (mismo comportamiento: técnico→`/incidents`, gating, logout).

## Casos ejercidos (todos PASS)

| # | Caso | Esperado | Observado | Resultado |
|---|---|---|---|---|
| 1 | Raíz sin autenticar | redirect a `/login` | `/login` | ✅ |
| 2 | Login admin | `/dashboard` con KPIs | `/dashboard`, KPIs + charts renderizan, **0 errores de consola** | ✅ |
| 3 | Toggle EN→ES | UI cambia a español | "Sign in"→"Iniciar sesión", "Access your management panel"→"Accede a tu panel de gestión" | ✅ |
| 4 | Login técnico | `/incidencias` acotado | `/incidencias`, sidebar solo "My Incidents", aviso "Scoped view" | ✅ |
| 5 | Técnico → `/dashboard` | redirect a `/incidencias` (role-gate) | rebota a `/incidencias` | ✅ |
| 6 | Logout | vuelve a `/login` | `/login` | ✅ |

## Bugs detectados y corregidos por este smoke (verificación en vivo)

1. **`KpiCard` client-boundary error.** Al internacionalizar, `KpiCard` se convirtió en Client Component y recibía el prop `icon` (componente Lucide) desde un Server Component → `Only plain objects can be passed to Client Components`. **Fix:** revertido a Server Component; el texto "vs previous month" se pasa como prop `deltaSuffix` ya traducido. Consola limpia tras el fix.
2. **Doble-redirect en login de técnico.** `signIn` redirigía siempre a `/dashboard` y luego el `proxy.ts` rebotaba al técnico a `/incidencias`, dejando la URL (`/dashboard`) desalineada del contenido (`/incidencias`). **Fix:** `signIn` ahora redirige por rol directamente (`getRole(email)`), URL y contenido alineados.

## Nota

Estos casos son un subconjunto de la lista §6 de la VFH (Fase 6), que el developer ejercerá y firmará. Este smoke cubre el eje MUST-2 (role-gating) + login/logout + toggle de idioma como red de seguridad re-ejecutable.
