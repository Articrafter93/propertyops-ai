# 00-ARQUITECTURA-PROYECTO.md - PropertyOps AI

Version: 2.0.0
Fecha: 2026-06-25 (reconciliado por STRATEGIST — capa de datos real = Supabase)
Proyecto: Plataforma de gestion de alquileres por habitacion (portafolio, `tipo_cliente: ficticio`)

> **Nota de reconciliacion (v2.0.0):** la v1 documentaba Airtable + Make + GAS como backend real.
> La implementacion usa **Supabase (Postgres + Auth)** como unica capa de datos. Las integraciones
> externas (Make/GAS/WhatsApp/OpenAI/Drive) estan **simuladas como datos sembrados en Supabase**
> (sandbox-first de portafolio), no como integraciones vivas. Ver `MATRIZ-BACKEND.md` v2.0.0.

---

## 1. Resumen del Formulario Pre-Scaffold

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | Tipo de proyecto principal | Plataforma con auth (dashboards, area privada) |
| 2 | ¿Se requiere CMS? | No (datos dinamicos desde Supabase) |
| 3 | ¿Se requiere base de datos? | Si (Supabase / PostgreSQL - 16 entidades) |
| 4 | ¿Se requiere pasarela de pago? | No (registro contable en Supabase) |
| 5 | Nivel de sensibilidad de los datos | Registrado (PII de inquilinos, contratos) |
| 6 | ¿Se usara Docker? | Innecesario (arquitectura serverless con Make/GAS) |
| 7 | ¿Se usara Google Stitch? | Por confirmar (diseno UI existente) |

## 2. Decisiones de Stack (con justificacion)

### Framework / Lenguaje
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Justificacion:** Dashboard complejo con multiples vistas, SSR/SSG para SEO, App Router para routing moderno
- **Referencia KB:** KB 04 (Technical Fullstack 2026), KB 11 (Maquetacion)

### Backend Real
- **Datos + Auth:** Supabase (PostgreSQL + Supabase Auth) — capa real implementada
- **Integraciones externas (Make / GAS / WhatsApp / OpenAI / Drive):** **simuladas como datos
  sembrados en Supabase** (monitor de automatizaciones, logs). No son integraciones vivas en el MVP de portafolio.
- **Justificacion:** sandbox-first de portafolio; la demo es funcional con datos ficticios sin depender de SaaS externos vivos
- **Referencia KB:** KB 07 (IAM), KB 08 (Bases de Datos 2026)

### Base de Datos
- **Proveedor:** Supabase (PostgreSQL) — 16 entidades
- **Justificacion:** fuente unica de verdad relacional, Auth integrada, SSR con `@supabase/ssr`, free tier sandbox
- **Entidades:** Properties, Rooms, Tenants, Leads, Contracts, Incidents, Technicians, Inspections, Checkin/Checkout, Payments, KPIs, AutomationRuns, ErrorLogs, Documents, Messages, Inventory
- **Modelo en codigo:** `frontend/lib/types.ts`; seed en `frontend/data/seed.json`
- **Pendiente ficticio:** schema-pooling + keep-alive (`doctrina/reglas/db-ficticio-supabase-pooling.md`)
- **Referencia KB:** KB 08 (Bases de Datos 2026)

### Autenticacion
- **Proveedor:** Supabase Auth
- **Justificacion:** Auth robusto, integracion con Next.js, manejo de sesiones
- **Archivos:** `frontend/lib/supabase.ts`, `frontend/lib/supabase-server.ts`, `frontend/app/auth/actions.ts`
- **Referencia KB:** KB 07 (Ciberseguridad e IAM)

### IA y Procesamiento
- **Proveedor:** OpenAI GPT-4o + GPT-4o-mini
- **Uso:** Inspeccion visual multimodal (GPT-4o Vision), NLP de incidencias (GPT-4o-mini)
- **Justificacion:** Capacidades multimodales para analisis de fotos de inspeccion, NLP para clasificacion de incidencias
- **Referencia KB:** KB 12 (Google Stitch - IA)

### Comunicaciones
- **Proveedor:** WhatsApp Business Cloud API + Gmail
- **Uso:** Notificaciones transaccionales bidireccionales, resumen diario de KPIs
- **Justificacion:** Canal preferido para comunicacion con inquilinos, notificaciones automaticas

### Visualizacion de Datos
- **Libreria:** Recharts
- **Justificacion:** Graficos para KPIs, tendencias, donuts para scores

### Deploy
- **Plataforma:** Vercel
- **Justificacion:** Integracion nativa con Next.js, despliegue continuo desde GitHub, SSL automatico
- **Referencia KB:** KB 05 (Next.js + VPS - adaptado para Vercel)

## 3. Referencias a KBs Usadas

- **KB 04:** Technical Fullstack 2026 (Next.js 16, TypeScript, Tailwind)
- **KB 05:** Next.js 15 + Hostinger VPS (adaptado para Vercel)
- **KB 07:** Ciberseguridad Web 2026 (Auth, IAM)
- **KB 08:** Arquitectura de Bases de Datos 2026 (Supabase / PostgreSQL)
- **KB 11:** HTML/CSS/Tailwind Styling Guide
- **KB 12:** Google Stitch - Diseno Visual con IA
- **KB 16:** Automatizacion Orquestada n8n (Make analogo)

## 4. GAPS y Validaciones Manuales

| KB / Componente | Decision | Estado | Riesgo |
|---|---|---|---|
| Firma Electronica | DocuSign / PandaDoc (placeholder) | REQUIERE VALIDACION MANUAL | Medio |
| Make Scenarios | 5 escenarios definidos | REQUIERE VALIDACION MANUAL | Bajo |
| Google Apps Script | 7 scripts en `src/apps-script/` | REQUIERE VALIDACION MANUAL | Bajo |
| Next.js 16 Features | App Router, Server Actions | REQUIERE VALIDACION MANUAL | Bajo |
| Supabase Auth | Implementado parcial | REQUIERE VALIDACION MANUAL | Medio |

## 5. Variables de Entorno (.env.example)

Capa real (lo construido — dashboard Next.js + Supabase):

```bash
# Supabase (capa de datos + auth real)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Capa objetivo (diseño, NO implementada en este build — solo si se construye el backend):

```bash
# OpenAI / WhatsApp / GAS / Make / Drive — arquitectura objetivo, no integrada
# OPENAI_API_KEY=...
# WHATSAPP_TOKEN=...
# WHATSAPP_PHONE_NUMBER_ID=...
# GAS_WEBAPP_URL=...
# MAKE_WEBHOOK_URL=...
```

## 6. Navegacion Circular (Logo-link a Home)

- **Header Logo:** Debe redirigir a `/dashboard` (o `/` si es publico)
- **Sidebar:** Link "Dashboard" siempre visible
- **Mobile:** Menu hamburguesa con enlace a inicio
- **Verificacion:** Todas las subpaginas deben tener un camino de regreso a la Home (`/dashboard`)

---

## GATE 3 - Aprobacion Stack Pre-Scaffold

> [GATE 3] — RESUMEN DE STACK DECIDIDO (reconciliado a Supabase)
> Framework/Lenguaje: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn
> CMS: No (datos dinamicos desde Supabase)
> Datos + Auth: Supabase (PostgreSQL + Supabase Auth) — capa real
> Integraciones externas (Make/GAS/WhatsApp/OpenAI/Drive): simuladas como datos en Supabase (sandbox)
> Pasarela de pago: No (registro contable en Supabase)
> Docker: Innecesario (serverless / Vercel)
> Visualizacion: Recharts
> Deploy: Vercel
> tipo_cliente: ficticio (sandbox-first)

---

## GATE 3 Status: APROBADO (2026-06-25, reconciliado a Supabase)
