# PLAN — PropertyOps AI

> **Estado:** `Reconstruido en retoma /quefalta (2026-06-25)`, reconciliado en regularización
> (2026-07-02). El template vacío original (placeholder `flashcore-`) nunca se llenó. Este plan
> refleja el proyecto **ya construido** (dashboard Next.js 16 + seed estático + auth mock local)
> más el backlog pendiente, no una planificación greenfield. Supabase eliminado por Nota de
> Cambio N.º 01 (`comunicacion-cliente/2026-07-02-02-nota-de-cambio-01-arquitectura-mock-local.md`).

**Fecha de reconstrucción:** 2026-06-25
**`tipo_cliente`:** `ficticio` (portafolio, sandbox-first)
**Categoría:** `04-Aplicaciones-web-empresariales` (ver `CLASIFICACION-ACTIVO.md`)

---

## Fase A — Brief y alcance

**Brief de referencia:** `BRIEF.md` (administrador de propiedades; gestión de alquiler por habitación).

**Alcance del MVP (construido):**
- Dashboard ejecutivo multi-vista (KPIs, ocupación, ingresos, incidencias).
- Gestión operativa: onboarding de leads, inquilinos, habitaciones, incidencias, checkout, inspecciones.
- Auth multi-rol (administrador / técnico de mantenimiento) con sesión mock local por cookie.
- Datos de demostración sembrados (`seed.json` estático tipado).

**Fuera de alcance (este build):**
- Backend de automatización multi-servicio (Make/GAS/WhatsApp/OpenAI/Drive): es **diseño objetivo, no construido**; en la demo se representa como datos simulados. Ver `docs/ARCHITECTURE.md`.
- Producción real, datos reales, pasarela de pago, claims de compliance.

**Audiencia:** administrador/arrendador (principal), técnico de mantenimiento (secundaria); reclutadores (portafolio).

---

## Fase B — Stack y arquitectura

| Decisión | Valor |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui + Recharts |
| Datos | `seed.json` estático tipado (`lib/seed.ts`) — sin DB viva |
| Auth | Mock local por cookie (`lib/auth.ts`, gate `NEXT_PUBLIC_DEMO_AUTH`) |
| Servicios externos | Ninguno vivo (backend = diseño objetivo simulado) |
| Hosting | Vercel (objetivo) |
| Deploy target | Vercel + GitHub |

**Notas:** capa real = frontend Next.js + seed estático + auth mock local. Detalle y justificación en `00-ARQUITECTURA-PROYECTO.md` v3.0.0 y `MATRIZ-BACKEND.md` v3.0.0. GATE 3 APROBADO (2026-06-25; reconciliado 2026-07-02).

---

## Fase C — Control de versiones

| Campo | Valor |
|---|---|
| Nombre del repo | `propertyops-ai` |
| Visibilidad | `privada` |
| Branch principal | `main` |
| URL de GitHub | (repo privado existente; ver `QUE-FALTA.md`) |

---

## Matriz Produccion Full-Stack

> Estados: `APLICA`, `NO APLICA`, `BLOQUEADO`. Coberturas: `cubierta`, `no_aplica`, `bloqueada`.
> `bloqueada` aquí = la capa aplica pero su trabajo está pendiente (bloquea cierre hasta resolver).
> **WF-011:** `PASS` (VFH firmada por el developer 2026-07-03 — `VERIFICACION-FUNCIONAL-HUMANA.md`). Todas las capas `cubierta`/`no_aplica`, cero filas `PENDIENTE`/`bloqueada`.

| Capa | Estado | Cobertura | Decision | Riesgo | Evidencia | Dueno | Gate |
|---|---|---|---|---|---|---|---|
| Frontend | `APLICA` | `cubierta` | Next.js 16 + Tailwind v4 + shadcn + Recharts, 8 vistas | UX operativa, estado | `frontend/app/(dashboard)/` | BUILDER | GATE 3 |
| APIs y logica backend | `APLICA` | `cubierta` | Lectura de datos desde `seed.json` tipado en Server Components; sin API custom. Orquestación multi-servicio = diseño NO construido | Lógica de negocio limitada a lectura de seed | `frontend/lib/seed.ts`, `frontend/app/auth/actions.ts` | BUILDER | GATE 3 |
| Database y storage | `APLICA` | `cubierta` | `seed.json` estático (16 entidades, `lib/types.ts`); sin DB viva. Storage = diseño objetivo (simulado) | PII ficticia; sin DB → sin RLS | `frontend/lib/types.ts`, `frontend/data/seed.json` | BUILDER | GATE 3 |
| Auth y access control | `APLICA` | `cubierta` | Sesión mock local por cookie multi-rol (admin/técnico), gate `NEXT_PUBLIC_DEMO_AUTH`; role-gating en `proxy.ts` | Separación de roles por verificar en GATE 0 / VFH | `frontend/lib/auth.ts`, `frontend/proxy.ts`, `frontend/app/login/` | BUILDER | GATE 3 |
| Hosting y deployment | `APLICA` | `cubierta` | Decisión: Vercel. Ejecución de deploy pendiente (Paso 10); no bloqueante para demo local | URL pública pendiente | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Cloud y compute | `NO APLICA` | `no_aplica` | Arquitectura serverless gestionada (Vercel/Supabase); sin compute dedicado | N/A — sin servidores propios | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| CI/CD pipeline | `NO APLICA` | `no_aplica` | Demo de portafolio sin pipeline; sin keep-alive (no hay DB que pausar) | N/A — sin entregas continuas | `HERRAMIENTAS-EXTERNAS.md` | EXECUTOR | GATE 3 |
| Version control | `APLICA` | `cubierta` | GitHub repo privado `propertyops-ai`, `main` | — | repo existente, `git` | EXECUTOR | GATE 3 |
| Security y permissions | `APLICA` | `cubierta` | GATE 0 abreviado PASS (2026-07-02); security headers + **CSP** en `next.config.ts`; sin secretos vivos ni DB (sin RLS aplicable); auth mock cookie httpOnly + role-gating | Verificación en vivo → VFH | `GATE-0-SEGURIDAD.md`, `next.config.ts` | STRATEGIST | GATE 0 |
| Rate limiting | `NO APLICA` | `no_aplica` | Sin API pública en demo sandbox | N/A | `CLASIFICACION-ACTIVO.md` | STRATEGIST | GATE 3 |
| Caching y CDN | `NO APLICA` | `no_aplica` | Vercel sirve CDN por defecto; sin estrategia custom para demo | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Load balancing y scaling | `NO APLICA` | `no_aplica` | Serverless gestionado; sin tráfico productivo | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Testing strategy | `APLICA` | `cubierta` | Smoke UI con Playwright global (login admin/técnico, role-gating, logout, toggle idioma); 6 casos PASS. 2 bugs cazados y corregidos en la corrida | Cobertura smoke, no unitaria (proporcional a demo) | `tests/smoke.spec.ts`, `tests/SMOKE-RESULTS.md` | BUILDER | GATE 7 |
| Observability | `NO APLICA` | `no_aplica` | Demo; el "monitor de automatizaciones" es UI sobre datos seed, no observabilidad real | N/A | `frontend/app/(dashboard)/automatizaciones/` | STRATEGIST | GATE 9 |
| Error tracking y alerting | `NO APLICA` | `no_aplica` | Demo de portafolio sin tracking productivo | N/A | `CLASIFICACION-ACTIVO.md` | STRATEGIST | GATE 9 |
| Cost management | `APLICA` | `cubierta` | Solo Vercel free (sin DB de pago ni SaaS vivo); demo estática sin costo recurrente | N/A — sin servicios que pausar/facturar | `HERRAMIENTAS-EXTERNAS.md` | STRATEGIST | GATE 3 |
| Compliance y data privacy | `APLICA` | `cubierta` | `/privacidad` implementada (ruta pública, PII pattern, aviso de retención); PII ficticia pero patrón presente | — | `frontend/app/privacidad/`, MUST-4 (2026-06-25) | STRATEGIST | GATE 8 |
| Availability y recovery | `NO APLICA` | `no_aplica` | Demo estática; sin DB ni servicio con estado que recuperar (seed versionado en repo) | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 9 |

---

## Fase E — Criterios de salida

- [x] Backlog de construcción cerrado (security headers, robots/sitemap, `/privacidad`, lint/build) — 2026-06-25.
- [x] `MATRIZ PRODUCCION FULL-STACK` sin capas `bloqueada` → `WF-011 PASS` (Security cubierta vía GATE 0 Fase 3; Testing cubierta vía smoke Fase 4) — 2026-07-03.
- [x] Correo corporativo Modo A (`/cliente-exigente`) → GATE 1.0 (2026-06-25).
- [x] ~~Keep-alive Supabase~~ → **`NO_APLICA`** (Supabase eliminado, Nota de Cambio N.º 01).
- [x] `/revision-final` `PR_APPROVED` + `/cliente-exigente` Modo B `EXITO TOTAL` (`2026-07-04-05`) + `/reclutador-exigente` `APTO_PORTAFOLIO` — 2026-07-04. Bloqueos remediados: idioma (README+rutas ES→EN) **e interacciones §6 estáticas** (incidencias filtro/expansión, checkout wizard, inspección slider, botones muertos → 4 client components reales). **`SELLO DE APROBACION PARCIAL.md` RE-EMITIDO** tras 2.ª VFH 10/10.
- [x] VFH (verificación funcional humana) registrada — 2026-07-04 (`VERIFICACION-FUNCIONAL-HUMANA.md`, firma "la apruebo, go"); 10/10 §6 conducida en vivo con Playwright sobre el activo genuinamente interactivo.

---

## Historial de decisiones

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-06-25 | Capa de datos = Supabase (Airtable descartado) | Reconciliación de drift: el código siempre usó Supabase; docs decían Airtable |
| 2026-06-25 | Backend multi-servicio = diseño objetivo, no construido | Honestidad de portafolio: `src/` vacío; reframe aplicado a docs |
| 2026-06-25 | GATE 3 cerrado APROBADO | Stack reconciliado y consistente en todos los docs |

---

## Notas de cambio posteriores al plan

| Fecha | Nota | Cambio | Referencia |
|---|---|---|---|
| 2026-07-02 | N.º 01 | Capa datos Supabase → `seed.json` estático; auth Supabase → mock local por cookie; deps Supabase removidas; keep-alive `NO_APLICA`; 10 vulns preexistentes → 0 | `comunicacion-cliente/2026-07-02-02-nota-de-cambio-01-arquitectura-mock-local.md` |
