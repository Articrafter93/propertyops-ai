# Nota de Cambio N.º 01 — PropertyOps AI

**Fecha:** 2026-07-02
**Tipo:** Cambio de arquitectura (capa de datos + autenticación)
**Referencia:** Correo corporativo inicial (`2026-06-25-01-correo-corporativo-inicial.md`), §3 Arquitectura y Stack
**Estado:** Aprobado por el developer (Plan Mode, decisión de arquitectura) antes de implementar

---

## Qué cambia

El correo corporativo §3 contrató como **stack construido real**: *"Supabase (PostgreSQL + Auth) como capa de datos y autenticación"*. Esta Nota de Cambio sustituye esa capa:

| Capa | Antes (correo §3) | Ahora (esta Nota) |
|---|---|---|
| Datos | Supabase (PostgreSQL) | **`seed.json` estático** tipado (`frontend/lib/seed.ts` + `data/seed.json`) — sin base de datos viva |
| Autenticación | Supabase Auth (`@supabase/ssr`) | **Sesión mock local por cookie** (`propertyops_demo_session`) gateada por `NEXT_PUBLIC_DEMO_AUTH=enabled`, reusando el mapeo de rol de `lib/roles.ts` |
| Dependencias | `@supabase/ssr`, `@supabase/supabase-js` | **Removidas** (12 paquetes) |
| Gate de portafolio | Keep-alive Supabase (cron + schema-pooling) | **`NO_APLICA`** — sin Supabase no hay pausa por inactividad que mitigar |

## Por qué

1. **Supabase era innecesario.** Las 11 vistas del dashboard ya consumían el `seed.json` estático (fecha fija 2026-04-25 para semáforos SLA consistentes). Supabase solo gateaba el login vía `signInWithPassword`; los helpers de datos (`lib/supabase.ts`) contra tablas Supabase no eran la fuente de verdad de la UI.
2. **La demo estaba rota en local.** `.env.local` no tenía las claves de Supabase, así que el login no autenticaba en desarrollo local ni en un deploy de exhibición sin configurar el proyecto Supabase.
3. **Elimina un gate duro de portafolio.** Sin Supabase free, desaparece el requisito de keep-alive (`doctrina/reglas/db-ficticio-supabase-pooling.md`), que era condición dura de admisión y una superficie de "demo rota" para el reclutador que visita idle.
4. **Reduce superficie y dependencias.** Menos deps, sin secretos vivos, la demo nunca se rompe por inactividad ni por config externa faltante.

## Qué NO cambia (contrato preservado)

El correo §6 (10 pruebas de aceptación) es **stack-agnóstico**: exige *comportamiento* de login (selector de roles demo, password prellenada, logout visible, role-gating admin/técnico), no la tecnología subyacente. Todo ese comportamiento se **preserva íntegro**:

- Login recruiter-friendly (selector de cuentas demo + password prellenada `Demo1234!`).
- Logout visible y persistente.
- Role-gating real (técnico acotado a `/incidencias`, redirect en el `proxy.ts`).
- Los 10 ítems §6 siguen siendo la lista de la VFH.

El **producto y el diseño no se tocan** — solo el motor de sesión y el origen de datos, ambos transparentes para el usuario final.

## Impacto en clasificación

- Superficies detectadas: `auth` sigue presente (mock local), `roles`, `pii` (ficticia en seed), `data` (estática). Sin cambio de categoría (`04` primaria; `06`/`15` secundarias).
- `CLASIFICACION-ACTIVO.md`, `PLAN.md` (matriz), `MATRIZ-BACKEND.md`, `00-ARQUITECTURA-PROYECTO.md`, `HERRAMIENTAS-EXTERNAS.md`, `README.md` y `docs/` reconciliados en la misma tanda.

## Nota de seguridad asociada

Durante la remoción de dependencias se detectaron y **resolvieron 10 vulnerabilidades preexistentes** (1 low, 6 moderate, 3 high) en deps transitivas + Next.js: `npm audit fix` para las transitivas, bump `next@16.2.4 → 16.2.10` (patch API-compatible, NO el downgrade catastrófico a `next@9.x` que propone `--force`), y `override` de `postcss ^8.5.10`. Resultado: **0 vulnerabilidades**, lint PASS, build PASS.
