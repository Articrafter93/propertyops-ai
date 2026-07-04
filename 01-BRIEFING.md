# 01-BRIEFING.md - PropertyOps AI

Version: 1.0.0
Fecha: 2026-04-27
Cliente: PropertyOps AI
Sector: Propiedad y Gestion de Alquileres

---

## 1. Objetivo del Proyecto
Plataforma de automatizacion de ciclo completo para gestion de habitaciones en alquiler: desde la captacion del candidato hasta la devolucion de deposito, con IA multimodal, WhatsApp Business y dashboard en tiempo real.

## 2. Audiencia Objetivo
- **Principal:** Administradores de propiedades y arrendadores
- **Secundaria:** Inquilinos (tenants) que buscan habitaciones
- **Terciaria:** Tecnicos de mantenimiento

## 3. Alcance Funcional Preliminar

### Paginas y Modulos Conocidos
1. **Dashboard** (`/dashboard`) - KPIs ejecutivos, tendencia 30 dias, activity feed
2. **Onboarding** (`/onboarding`) - Kanban de leads (4 columnas) con score badge
3. **Inquilinos** (`/inquilinos`) - Tabla de inquilinos activos con busqueda
4. **Inquilinos/[id]** (`/inquilinos/[id]`) - Expediente: Resumen / Pagos / Incidencias / Docs
5. **Habitaciones** (`/habitaciones`) - Grid de habitaciones por propiedad
6. **Habitaciones/[id]** (`/habitaciones/[id]`) - Inventario checklist + historial inspecciones
7. **Incidencias** (`/incidencias`) - Tabla con semaforo SLA, filtros, row expansion
8. **Checkout** (`/checkout`) - Lista de salidas + wizard 4-pasos
9. **Inspecciones** (`/inspecciones`) - Lista de inspecciones con AI score
10. **Inspecciones/[id]** (`/inspecciones/[id]`) - Slider antes/despues, donut score, tabla cargos
11. **Automatizaciones** (`/automatizaciones`) - Estado de 5 escenarios Make + error log

### Tecnologias Identificadas (reconciliado 2026-06-25)

**Construido (real):** _(reconciliado 2026-07-02 — Supabase eliminado, Nota de Cambio N.º 01)_
- **Dashboard:** Next.js 16 + TypeScript + Tailwind v4 + shadcn + Recharts (8 vistas)
- **Datos:** `seed.json` estático tipado (`lib/seed.ts`), sin DB viva
- **Auth:** mock local por cookie (`lib/auth.ts`, gate `NEXT_PUBLIC_DEMO_AUTH`)

**Arquitectura objetivo (diseño, NO implementada en este build):**
- **Orquestacion:** Make (Integromat) - 5 escenarios
- **Logica de negocio:** Google Apps Script (7 scripts)
- **Documentos:** Google Drive + Google Docs
- **Comunicacion:** WhatsApp Business Cloud API
- **IA:** OpenAI GPT-4o + GPT-4o-mini
- **Firma electronica:** DocuSign / PandaDoc (placeholder)

## 4. Nivel de Sensibilidad de Datos
- **Clasificacion:** Registrado (datos de inquilinos, contratos, pagos)
- **PII involucrada:** Nombres, emails, telefonos, direcciones, documentos de identidad
- **Datos financieros:** Informacion de pagos y depositos (no tarjetas directas)

## 5. Requerimientos de Pagos
- **¿Procesar pagos en linea?** No directamente (el sistema genera contratos y registra pagos, pero las transacciones son externas)
- **Pasarela:** No aplica procesamiento directo
- **Registro:** entidad `Payment` en el seed estático (objetivo: tabla en Postgres de producción)

## 6. Presupuesto y Plazos
- **Presupuesto hosting:** Por confirmar (Vercel para frontend; sin costo de DB — demo estática)
- **Plazos:** Por confirmar

## 7. Herramientas del Cliente (diseño objetivo)
- **CRM/Base datos:** PostgreSQL (16 tablas) — objetivo de producción; en el build = `seed.json`
- **Automatizacion:** Make (Integromat) — objetivo (simulado)
- **Documentos:** Google Workspace (Drive, Docs, Sheets) — objetivo (simulado)
- **IA:** OpenAI API — objetivo (simulado)

## 8. Capacidad Tecnica del Cliente
- **Nivel:** Media/Alta (maneja bases de datos, Make, GAS)
- **CMS:** No requiere CMS tradicional (datos desde el seed tipado / DB headless en producción)
- **Actualizaciones:** en el build, cambios via `seed.json`; en producción, via DB/Make

## 9. Necesidades de Infraestructura
- **Base de datos:** No en este build (datos en `seed.json` estático; Postgres = objetivo de producción)
- **Docker:** Innecesario (arquitectura serverless / Vercel)
- **Autenticacion:** Si (mock local por cookie, `frontend/lib/auth.ts`)
- **Multi-idioma:** No especificado

## 10. Respuestas No Contestadas
- [ ] Presupuesto exacto de hosting
- [ ] Plazos duros de entrega
- [x] Confirmacion de capa de datos: **`seed.json` estático + auth mock local** (2026-07-02; Supabase eliminado, Nota de Cambio N.º 01)
- [ ] Decision sobre firma electronica (DocuSign vs PandaDoc)
- [ ] Requerimientos de multi-idioma

---

## GATE 1 - Aprobacion Briefing

> [GATE 1] — RESUMEN DE FASE 1: BRIEFING Y DESCUBRIMIENTO
> Objeto del proyecto: Plataforma de automatizacion para gestion de habitaciones en alquiler con IA y WhatsApp
> Audiencia principal: Administradores de propiedades e inquilinos
> Sensibilidad de datos: Registrado (PII de inquilinos, contratos)
> Pagos en linea: No directamente (registro externo)
> Presupuesto hosting: Por confirmar
> Riesgos identificados: Manejo de PII bajo Ley 1581 (PII ficticia en seed), integracion multiple (Make-GAS-OpenAI) = diseño objetivo simulado, firma electronica pendiente
> ¿CONFIRMAS QUE ESTE BRIEFING ES CORRECTO Y COMPLETO PARA PASAR A LA FASE 2? (si/no)

---

## GATE 1 Status: PENDIENTE
