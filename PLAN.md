# PLAN — PropertyOps AI

> **Estado:** `Reconstruido en retoma /quefalta (2026-06-25)` — el template vacío original
> (placeholder `flashcore-`) nunca se llenó. Este plan refleja el proyecto **ya construido**
> (dashboard Next.js + Supabase) más el backlog pendiente, no una planificación greenfield.

**Fecha de reconstrucción:** 2026-06-25
**`tipo_cliente`:** `ficticio` (portafolio, sandbox-first)
**Categoría:** `04-Aplicaciones-web-empresariales` (ver `CLASIFICACION-ACTIVO.md`)

---

## Fase A — Brief y alcance

**Brief de referencia:** `BRIEF.md` (administrador de propiedades; gestión de alquiler por habitación).

**Alcance del MVP (construido):**
- Dashboard ejecutivo multi-vista (KPIs, ocupación, ingresos, incidencias).
- Gestión operativa: onboarding de leads, inquilinos, habitaciones, incidencias, checkout, inspecciones.
- Auth multi-rol (administrador / técnico de mantenimiento) con Supabase.
- Datos de demostración sembrados (Supabase / seed).

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
| Datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Servicios externos | Ninguno vivo (backend = diseño objetivo simulado) |
| Hosting | Vercel (objetivo) |
| Deploy target | Vercel + GitHub |

**Notas:** capa real = frontend + Supabase. Detalle y justificación en `00-ARQUITECTURA-PROYECTO.md` v2.0.0 y `MATRIZ-BACKEND.md` v2.0.0. GATE 3 APROBADO (2026-06-25).

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
> **WF-011:** `PENDIENTE` (pasada funcional no ejecutada aún).

| Capa | Estado | Cobertura | Decision | Riesgo | Evidencia | Dueno | Gate |
|---|---|---|---|---|---|---|---|
| Frontend | `APLICA` | `cubierta` | Next.js 16 + Tailwind v4 + shadcn + Recharts, 8 vistas | UX operativa, estado | `frontend/app/(dashboard)/` | BUILDER | GATE 3 |
| APIs y logica backend | `APLICA` | `cubierta` | Acceso a datos vía Supabase en Server Components/Actions; sin API custom. Orquestación multi-servicio = diseño NO construido | Lógica de negocio limitada a lectura de seed | `frontend/lib/supabase*.ts`, `frontend/app/auth/actions.ts` | BUILDER | GATE 3 |
| Database y storage | `APLICA` | `cubierta` | Supabase PostgreSQL (16 entidades, `lib/types.ts`); seed `data/seed.json`. Storage = Supabase Storage objetivo (simulado) | PII ficticia, RLS por verificar | `frontend/lib/types.ts`, `frontend/data/seed.json` | BUILDER | GATE 3 |
| Auth y access control | `APLICA` | `cubierta` | Supabase Auth multi-rol (admin/técnico), SSR | RLS y separación de roles por verificar en GATE 0 | `frontend/lib/supabase-server.ts`, `frontend/app/login/` | BUILDER | GATE 3 |
| Hosting y deployment | `APLICA` | `cubierta` | Decisión: Vercel. Ejecución de deploy pendiente (Paso 10); no bloqueante para demo local | URL pública pendiente | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Cloud y compute | `NO APLICA` | `no_aplica` | Arquitectura serverless gestionada (Vercel/Supabase); sin compute dedicado | N/A — sin servidores propios | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| CI/CD pipeline | `NO APLICA` | `no_aplica` | Demo de portafolio sin pipeline; único automatismo = keep-alive cron de Supabase | N/A — sin entregas continuas | `HERRAMIENTAS-EXTERNAS.md` | EXECUTOR | GATE 3 |
| Version control | `APLICA` | `cubierta` | GitHub repo privado `propertyops-ai`, `main` | — | repo existente, `git` | EXECUTOR | GATE 3 |
| Security y permissions | `APLICA` | `bloqueada` | Pendiente: GATE 0 seguridad, security headers en `next.config.ts`, verificación RLS | Headers/CSP ausentes, RLS sin auditar | `QUE-FALTA.md` (pendientes) | STRATEGIST | GATE 9 |
| Rate limiting | `NO APLICA` | `no_aplica` | Sin API pública en demo sandbox | N/A | `CLASIFICACION-ACTIVO.md` | STRATEGIST | GATE 3 |
| Caching y CDN | `NO APLICA` | `no_aplica` | Vercel sirve CDN por defecto; sin estrategia custom para demo | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Load balancing y scaling | `NO APLICA` | `no_aplica` | Serverless gestionado; sin tráfico productivo | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 3 |
| Testing strategy | `APLICA` | `bloqueada` | Pendiente: `tests/` vacío; definir smoke/UI mínimos para portafolio | Sin cobertura de pruebas | `tests/` (vacío) | BUILDER | GATE 7 |
| Observability | `NO APLICA` | `no_aplica` | Demo; el "monitor de automatizaciones" es UI sobre datos seed, no observabilidad real | N/A | `frontend/app/(dashboard)/automatizaciones/` | STRATEGIST | GATE 9 |
| Error tracking y alerting | `NO APLICA` | `no_aplica` | Demo de portafolio sin tracking productivo | N/A | `CLASIFICACION-ACTIVO.md` | STRATEGIST | GATE 9 |
| Cost management | `APLICA` | `cubierta` | Free tiers (Supabase free + Vercel free); keep-alive evita pausa por inactividad | Pausa de Supabase free si falta keep-alive | `HERRAMIENTAS-EXTERNAS.md` | STRATEGIST | GATE 3 |
| Compliance y data privacy | `APLICA` | `bloqueada` | Pendiente: `/privacidad`, consentimiento no pre-marcado, aviso de retención (PII ficticia pero patrón requerido) | PII sin política visible | `QUE-FALTA.md` (pendientes) | STRATEGIST | GATE 8 |
| Availability y recovery | `NO APLICA` | `no_aplica` | Demo; Supabase gestiona backups del free tier | N/A | `00-ARQUITECTURA-PROYECTO.md` | STRATEGIST | GATE 9 |

---

## Fase E — Criterios de salida

- [ ] Backlog de construcción cerrado (GATE 0, security headers, robots/sitemap, `/privacidad`, lint/build).
- [ ] `MATRIZ PRODUCCION FULL-STACK` sin capas `bloqueada` → `WF-011 PASS`.
- [ ] Correo corporativo Modo A (`/cliente-exigente`) → GATE 1.0.
- [ ] Keep-alive Supabase configurado (gate duro de portafolio).
- [ ] `/revision-final` + `/cliente-exigente` Modo B `EXITO TOTAL` + `/reclutador-exigente` `APTO_PORTAFOLIO`.
- [ ] VFH (verificación funcional humana) registrada.

---

## Historial de decisiones

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-06-25 | Capa de datos = Supabase (Airtable descartado) | Reconciliación de drift: el código siempre usó Supabase; docs decían Airtable |
| 2026-06-25 | Backend multi-servicio = diseño objetivo, no construido | Honestidad de portafolio: `src/` vacío; reframe aplicado a docs |
| 2026-06-25 | GATE 3 cerrado APROBADO | Stack reconciliado y consistente en todos los docs |

---

## Notas de cambio posteriores al plan

> *Registrar aquí cualquier cambio de alcance aprobado tras el plan inicial.*
