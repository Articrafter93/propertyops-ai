# MATRIZ-BACKEND.md - PropertyOps AI

Version: 2.0.0
Fecha: 2026-06-25 (reconciliado por STRATEGIST — capa de datos real = Supabase)
Proyecto: Plataforma de gestion de alquileres por habitacion (portafolio, `tipo_cliente: ficticio`)

> **Nota de reconciliacion (v2.0.0):** la v1 documentaba Airtable + Make + GAS como backend
> "real". La implementacion en `frontend/` usa **Supabase (Postgres + Auth)** como unica capa
> de datos y persistencia. Las integraciones externas (Make, Google Apps Script, WhatsApp,
> OpenAI, Drive) **no estan implementadas como integraciones vivas**: se representan como
> datos sembrados en Supabase (monitor de automatizaciones, logs de error) para una demo
> sandbox-first de portafolio. Esta matriz refleja la realidad construida, no la aspiracional.

---

## Rubros de Integracion Backend

### 1. API Principal (IA)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** OpenAI (GPT-4o / GPT-4o-mini) — *aspiracional*
- **Estado:** SIMULADO (mock sandbox) — no hay llamadas vivas a OpenAI en el codigo
- **Uso narrado:** scoring de leads, inspeccion visual, NLP de incidencias
- **Realidad:** los resultados (scores, clasificaciones) viven como datos sembrados en Supabase

### 2. Autenticacion (Auth)
- **¿Requerida?** SI
- **Proveedor:** **Supabase Auth**
- **Estado:** CONFIRMADO (implementado)
- **Uso:** login multi-rol (admin / tecnico de mantenimiento), gestion de sesiones SSR
- **Archivos:** `frontend/lib/supabase.ts`, `frontend/lib/supabase-server.ts`, `frontend/app/auth/actions.ts`, `frontend/app/login/`

### 3. Base de Datos
- **¿Requerida?** SI
- **Proveedor:** **Supabase (PostgreSQL)** — fuente unica de verdad
- **Estado:** CONFIRMADO (implementado)
- **Modelo:** entidades en `frontend/lib/types.ts` (Property, Room, Tenant, Lead, Contract, Payment, Incident, Inspection, AutomationRun, ErrorLog, etc.); seed en `frontend/data/seed.json`
- **Pendiente ficticio:** schema-pooling + keep-alive segun `doctrina/reglas/db-ficticio-supabase-pooling.md`

### 4. Storage (Almacenamiento)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** **Supabase Storage** (objetivo) — Google Drive era aspiracional
- **Estado:** SIMULADO (mock sandbox) — fotos de inspeccion / PDFs representados como referencias en seed
- **Uso narrado:** expedientes de inquilinos, contratos PDF, fotos de inspeccion antes/despues

### 5. Pagos (Pasarela)
- **¿Requerida?** NO
- **Proveedor:** N/A (registro contable, no procesamiento)
- **Estado:** NO APLICA — los pagos se registran como filas en Supabase (`Payment`), sin pasarela

### 6. Email / Comunicaciones
- **¿Requerida?** SI (conceptual)
- **Proveedor:** WhatsApp Business Cloud API + Gmail — *aspiracional*
- **Estado:** SIMULADO (mock sandbox) — notificaciones representadas como eventos/datos en Supabase
- **Uso narrado:** avisos transaccionales WhatsApp, resumen diario de KPIs

### 7. CRM
- **¿Requerida?** SI (integrado)
- **Proveedor:** **Supabase** (tablas `Lead`, `Tenant`, `Contract`, `Incident`)
- **Estado:** CONFIRMADO (implementado como datos)
- **Uso:** gestion de leads, inquilinos, contratos e incidencias en el dashboard

### 8. CMS (Content Management)
- **¿Requerida?** NO
- **Proveedor:** N/A
- **Estado:** NO APLICA — contenido del dashboard es dinamico desde Supabase

### 9. Analitica
- **¿Requerida?** SI (interna)
- **Proveedor:** KPIs en Supabase + visualizacion **Recharts** en el dashboard Next.js
- **Estado:** CONFIRMADO (implementado)
- **Uso:** KPIs de ocupacion, pagos, incidencias; graficos y donuts de score

### 10. Otros (Orquestacion)
- **¿Requerida?** SI (conceptual)
- **Proveedor:** Make (Integromat) — *aspiracional*, 5 escenarios narrados
- **Estado:** SIMULADO (mock sandbox) — el "Monitor de Automatizaciones" lee `automation_runs` y `error_logs` sembrados en Supabase (`getAutomationRuns`, `getErrorLogs`)
- **Escenarios narrados:** 01-Intake, 02-Onboarding, 03-Incidents, 04-Inspection, 05-Reporting

---

## Resumen de Proveedores (realidad construida)

| Rubro | Proveedor real | Estado |
|---|---|---|
| Auth | Supabase Auth | CONFIRMADO |
| DB | Supabase (PostgreSQL) | CONFIRMADO |
| CRM | Supabase (tablas) | CONFIRMADO |
| Analitica | Supabase + Recharts | CONFIRMADO |
| Storage | Supabase Storage (objetivo) | SIMULADO |
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
- [x] Backend/datos real: **Supabase (Postgres + Auth)**
- [x] Integraciones externas (Make/GAS/WhatsApp/OpenAI/Drive): **simuladas como datos en Supabase** (sandbox de portafolio, honesto)
- [x] CMS: No requiere
- [x] Pasarela de pago: No (registro contable en Supabase)
- [x] Docker: Innecesario (serverless / Vercel)
- [x] Visualizacion: Recharts
- [x] Plataforma de despliegue: Vercel
- [x] `tipo_cliente`: ficticio (sandbox-first)

---

## Decisiones de Stack Cerradas

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn
- **Datos + Auth:** Supabase (PostgreSQL + Supabase Auth) — capa real
- **Integraciones externas:** simuladas como datos sembrados en Supabase (no integraciones vivas)
- **Visualizacion:** Recharts
- **Deploy:** Vercel (conectado a GitHub)

---

## GATE 3 Status: APROBADO (2026-06-25, reconciliado a Supabase)
