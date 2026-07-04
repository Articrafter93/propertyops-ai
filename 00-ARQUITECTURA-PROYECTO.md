# 00-ARQUITECTURA-PROYECTO.md - PropertyOps AI

Version: 3.0.0
Fecha: 2026-07-02 (reconciliado por REPARADOR — Supabase eliminado; datos = seed estático, auth = mock local)
Proyecto: Plataforma de gestion de alquileres por habitacion (portafolio, `tipo_cliente: ficticio`)

> **Nota de reconciliacion (v3.0.0):** la v2.0.0 documentaba **Supabase (Postgres + Auth)** como
> unica capa de datos. Supabase fue **eliminado** (Nota de Cambio N.º 01, 2026-07-02). La realidad
> construida es: **datos = `seed.json` estatico tipado** (sin base de datos viva) + **autenticacion
> = sesion mock local por cookie** (`NEXT_PUBLIC_DEMO_AUTH`). Las integraciones externas
> (Make/GAS/WhatsApp/OpenAI/Drive) estan **simuladas como datos sembrados en el seed**, no como
> integraciones vivas. Ver `MATRIZ-BACKEND.md` v3.0.0 y `CLASIFICACION-ACTIVO.md`.

---

## 1. Resumen del Formulario Pre-Scaffold

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | Tipo de proyecto principal | Plataforma con auth (dashboards, area privada) |
| 2 | ¿Se requiere CMS? | No (datos dinamicos desde el seed tipado) |
| 3 | ¿Se requiere base de datos? | No en este build — datos en `seed.json` estatico (16 entidades modeladas en `lib/types.ts`) |
| 4 | ¿Se requiere pasarela de pago? | No (registro contable representado en el seed) |
| 5 | Nivel de sensibilidad de los datos | Registrado (PII ficticia de inquilinos, contratos) |
| 6 | ¿Se usara Docker? | Innecesario (arquitectura serverless / Vercel) |
| 7 | ¿Se usara Google Stitch? | Por confirmar (diseno UI existente) |

## 2. Decisiones de Stack (con justificacion)

### Framework / Lenguaje
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Justificacion:** Dashboard complejo con multiples vistas, SSR/SSG para SEO, App Router para routing moderno
- **Referencia KB:** KB 04 (Technical Fullstack 2026), KB 11 (Maquetacion)

### Backend Real
- **Datos:** `seed.json` estatico tipado (`lib/seed.ts`) — capa de datos construida; sin base de datos viva
- **Auth:** sesion mock local por cookie (`lib/auth.ts` + `lib/roles.ts`), gate `NEXT_PUBLIC_DEMO_AUTH`
- **Integraciones externas (Make / GAS / WhatsApp / OpenAI / Drive):** **simuladas como datos
  sembrados en el seed** (monitor de automatizaciones, logs). No son integraciones vivas en el MVP de portafolio.
- **Justificacion:** sandbox-first de portafolio; la demo es funcional con datos ficticios sin depender de SaaS externos vivos ni de base de datos que pueda pausarse
- **Referencia KB:** KB 07 (IAM)

### Base de Datos
- **Proveedor:** `seed.json` estatico (sin base de datos viva) — 16 entidades modeladas
- **Justificacion:** las 11 vistas del dashboard consumen el seed tipado; una demo de portafolio sandbox-first no necesita DB viva (que ademas se pausa por inactividad en free tier y rompe la demo del reclutador)
- **Entidades:** Properties, Rooms, Tenants, Leads, Contracts, Incidents, Technicians, Inspections, Checkin/Checkout, Payments, KPIs, AutomationRuns, ErrorLogs, Documents, Messages, Inventory
- **Modelo en codigo:** `frontend/lib/types.ts`; datos en `frontend/data/seed.json`; expuestos por `frontend/lib/seed.ts`
- **Nota:** fecha "now" fija (2026-04-25) para semaforos SLA consistentes
- **Referencia KB:** KB 08 (Bases de Datos 2026 — modelo relacional de referencia)

### Autenticacion
- **Proveedor:** Mock local por cookie (no SaaS de auth)
- **Justificacion:** login demo recruiter-friendly sin dependencia externa; la demo nunca se rompe por config faltante; password demo es dato sandbox (excepcion sancionada a "sin credenciales hardcodeadas")
- **Mecanica:** cookie `httpOnly` `propertyops_demo_session` con el email demo, validado contra allowlist en `lib/demo-accounts.ts`; gate `NEXT_PUBLIC_DEMO_AUTH=enabled`; role-gating (admin/tecnico) en `proxy.ts` via `isPathAllowed`
- **Archivos:** `frontend/lib/auth.ts`, `frontend/lib/demo-accounts.ts`, `frontend/lib/roles.ts`, `frontend/app/auth/actions.ts`, `frontend/proxy.ts`
- **Referencia KB:** KB 07 (Ciberseguridad e IAM)

### IA y Procesamiento
- **Proveedor:** OpenAI GPT-4o + GPT-4o-mini — *aspiracional (simulado)*
- **Uso narrado:** Inspeccion visual multimodal (GPT-4o Vision), NLP de incidencias (GPT-4o-mini)
- **Estado:** SIMULADO — resultados representados como datos en el seed
- **Referencia KB:** KB 12 (Google Stitch - IA)

### Comunicaciones
- **Proveedor:** WhatsApp Business Cloud API + Gmail — *aspiracional (simulado)*
- **Uso narrado:** Notificaciones transaccionales bidireccionales, resumen diario de KPIs
- **Estado:** SIMULADO — representado como eventos en el seed

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
- **KB 08:** Arquitectura de Bases de Datos 2026 (modelo relacional de referencia)
- **KB 11:** HTML/CSS/Tailwind Styling Guide
- **KB 12:** Google Stitch - Diseno Visual con IA
- **KB 16:** Automatizacion Orquestada n8n (Make analogo)

## 4. GAPS y Validaciones Manuales

| KB / Componente | Decision | Estado | Riesgo |
|---|---|---|---|
| Firma Electronica | DocuSign / PandaDoc (placeholder) | REQUIERE VALIDACION MANUAL | Medio |
| Make Scenarios | 5 escenarios definidos (simulados) | REQUIERE VALIDACION MANUAL | Bajo |
| Google Apps Script | 7 scripts (simulados) | REQUIERE VALIDACION MANUAL | Bajo |
| Next.js 16 Features | App Router, Server Actions | REQUIERE VALIDACION MANUAL | Bajo |
| Auth mock local | Implementado (cookie + gate) | Verificar en GATE 0 / VFH | Bajo |

## 5. Variables de Entorno (.env.example)

Capa real (lo construido — dashboard Next.js + seed estatico + auth mock local):

```bash
# Gate de la sesion demo mock local (unica variable requerida)
NEXT_PUBLIC_DEMO_AUTH=enabled
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

> [GATE 3] — RESUMEN DE STACK DECIDIDO (reconciliado a seed estatico + auth mock local)
> Framework/Lenguaje: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn
> CMS: No (datos dinamicos desde el seed tipado)
> Datos: `seed.json` estatico (sin base de datos viva)
> Auth: mock local por cookie (gate `NEXT_PUBLIC_DEMO_AUTH`)
> Integraciones externas (Make/GAS/WhatsApp/OpenAI/Drive): simuladas como datos en el seed (sandbox)
> Pasarela de pago: No (registro contable en el seed)
> Docker: Innecesario (serverless / Vercel)
> Visualizacion: Recharts
> Deploy: Vercel
> tipo_cliente: ficticio (sandbox-first)

---

## GATE 3 Status: APROBADO (2026-07-02, reconciliado a seed estatico + auth mock local)
