# MATRIZ-BACKEND.md - PropertyOps AI

Version: 3.0.0
Fecha: 2026-07-02 (reconciliado por REPARADOR — Supabase eliminado; capa de datos = seed estático, auth = mock local)
Proyecto: Plataforma de gestion de alquileres por habitacion (portafolio, `tipo_cliente: ficticio`)

> **Nota de reconciliacion (v3.0.0):** la v2.0.0 documentaba **Supabase (Postgres + Auth)** como
> unica capa de datos y persistencia. Supabase fue **eliminado por completo** (Nota de Cambio
> N.º 01, 2026-07-02): era innecesario —las 11 vistas del dashboard ya consumian `seed.json`
> estatico— y estaba roto en local (`.env.local` sin claves). La realidad construida ahora es:
> **datos = `seed.json` estatico tipado** (sin base de datos viva) + **autenticacion = sesion
> mock local por cookie** gateada por `NEXT_PUBLIC_DEMO_AUTH`. Las integraciones externas
> (Make, GAS, WhatsApp, OpenAI, Drive) siguen **representadas como datos sembrados en el seed**
> (monitor de automatizaciones, logs de error), no como integraciones vivas. Esta matriz refleja
> la realidad construida, no la aspiracional.

---

## Rubros de Integracion Backend

### 1. API Principal (IA)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** OpenAI (GPT-4o / GPT-4o-mini) — *aspiracional*
- **Estado:** SIMULADO (mock sandbox) — no hay llamadas vivas a OpenAI en el codigo
- **Uso narrado:** scoring de leads, inspeccion visual, NLP de incidencias
- **Realidad:** los resultados (scores, clasificaciones) viven como datos en `seed.json`

### 2. Autenticacion (Auth)
- **¿Requerida?** SI
- **Proveedor:** **Mock local por cookie** (no SaaS de auth)
- **Estado:** CONFIRMADO (implementado)
- **Uso:** login multi-rol (admin / tecnico de mantenimiento); sesion en cookie `httpOnly` `propertyops_demo_session`, gate `NEXT_PUBLIC_DEMO_AUTH=enabled`; role-gating en `proxy.ts`
- **Archivos:** `frontend/lib/auth.ts`, `frontend/lib/demo-accounts.ts`, `frontend/lib/roles.ts`, `frontend/app/auth/actions.ts`, `frontend/proxy.ts`, `frontend/app/login/`

### 3. Base de Datos
- **¿Requerida?** NO (para este build sandbox)
- **Proveedor:** **`seed.json` estatico** (sin base de datos viva)
- **Estado:** CONFIRMADO (implementado)
- **Modelo:** entidades en `frontend/lib/types.ts` (Property, Room, Tenant, Lead, Contract, Payment, Incident, Inspection, AutomationRun, ErrorLog, etc.); datos en `frontend/data/seed.json`, expuestos tipados por `frontend/lib/seed.ts`
- **Nota:** fecha "now" fija (2026-04-25) para semaforos SLA consistentes. Sin keep-alive ni schema-pooling: no hay servicio que pausar

### 4. Storage (Almacenamiento)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** Google Drive / almacenamiento de objetos — *aspiracional*
- **Estado:** SIMULADO (mock sandbox) — fotos de inspeccion / PDFs representados como referencias en seed
- **Uso narrado:** expedientes de inquilinos, contratos PDF, fotos de inspeccion antes/despues

### 5. Pagos (Pasarela)
- **¿Requerida?** NO
- **Proveedor:** N/A (registro contable, no procesamiento)
- **Estado:** NO APLICA — los pagos se representan como filas en el seed (`Payment`), sin pasarela

### 6. Email / Comunicaciones
- **¿Requerida?** SI (conceptual)
- **Proveedor:** WhatsApp Business Cloud API + Gmail — *aspiracional*
- **Estado:** SIMULADO (mock sandbox) — notificaciones representadas como eventos/datos en seed
- **Uso narrado:** avisos transaccionales WhatsApp, resumen diario de KPIs

### 7. CRM
- **¿Requerida?** SI (integrado)
- **Proveedor:** **Datos en `seed.json`** (`Lead`, `Tenant`, `Contract`, `Incident`)
- **Estado:** CONFIRMADO (implementado como datos estaticos)
- **Uso:** gestion de leads, inquilinos, contratos e incidencias en el dashboard

### 8. CMS (Content Management)
- **¿Requerida?** NO
- **Proveedor:** N/A
- **Estado:** NO APLICA — contenido del dashboard es dinamico desde el seed tipado

### 9. Analitica
- **¿Requerida?** SI (interna)
- **Proveedor:** KPIs en `seed.json` + visualizacion **Recharts** en el dashboard Next.js
- **Estado:** CONFIRMADO (implementado)
- **Uso:** KPIs de ocupacion, pagos, incidencias; graficos y donuts de score

### 10. Otros (Orquestacion)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** Make (Integromat) — *aspiracional*, 5 escenarios narrados
- **Estado:** SIMULADO (mock sandbox) — el "Monitor de Automatizaciones" lee `automation_runs` y `error_log` del seed (`getAutomationRuns`, `getErrorLogs`)
- **Escenarios narrados:** 01-Intake, 02-Onboarding, 03-Incidents, 04-Inspection, 05-Reporting

---

## Resumen de Proveedores (realidad construida)

| Rubro | Proveedor real | Estado |
|---|---|---|
| Auth | Mock local por cookie | CONFIRMADO |
| DB | `seed.json` estatico (sin DB viva) | CONFIRMADO |
| CRM | Datos en seed | CONFIRMADO |
| Analitica | Seed + Recharts | CONFIRMADO |
| Storage | Google Drive (objetivo) | SIMULADO |
| API/IA | OpenAI | SIMULADO (mock) |
| Email/Comms | WhatsApp + Gmail | SIMULADO (mock) |
| Orquestacion | Make (5 escenarios) | SIMULADO (mock) |
| Logica externa | Google Apps Script | SIMULADO (mock) |
| Pagos | N/A | NO APLICA |
| CMS | N/A | NO APLICA |
| Firma | DocuSign / PandaDoc | NO APLICA (placeholder, fuera de MVP) |

---

## GATE 3 - Checklist de Arquitectura

- [x] Framework/Lenguaje: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- [x] Backend/datos real: **`seed.json` estatico** (sin base de datos viva)
- [x] Auth real: **mock local por cookie** (gate `NEXT_PUBLIC_DEMO_AUTH`)
- [x] Integraciones externas (Make/GAS/WhatsApp/OpenAI/Drive): **simuladas como datos en el seed** (sandbox de portafolio, honesto)
- [x] CMS: No requiere
- [x] Pasarela de pago: No (registro contable en seed)
- [x] Docker: Innecesario (serverless / Vercel)
- [x] Visualizacion: Recharts
- [x] Plataforma de despliegue: Vercel
- [x] `tipo_cliente`: ficticio (sandbox-first)

---

## Decisiones de Stack Cerradas

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn
- **Datos:** `seed.json` estatico tipado (`lib/seed.ts`) — sin base de datos viva
- **Auth:** mock local por cookie (`lib/auth.ts` + `lib/roles.ts`), gate `NEXT_PUBLIC_DEMO_AUTH`
- **Integraciones externas:** simuladas como datos sembrados en el seed (no integraciones vivas)
- **Visualizacion:** Recharts
- **Deploy:** Vercel (conectado a GitHub)

---

## GATE 3 Status: APROBADO (2026-07-02, reconciliado a seed estatico + auth mock local)
