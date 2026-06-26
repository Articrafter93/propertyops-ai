# INSTRUCCIONES-CLIENTE-PROPERTYOPS-AI.md

Version: 1.0.0
Fecha: 2026-04-27
Cliente: [Por confirmar - PropertyOps AI]
Proyecto: Plataforma de automatizacion para gestion de habitaciones en alquiler

---

## Matriz de Cumplimiento del Cliente

### Objetivo del Proyecto
Plataforma de automatizacion de ciclo completo para gestion de habitaciones en alquiler: desde la captacion del candidato hasta la devolucion de deposito, con IA multimodal, WhatsApp Business y dashboard en tiempo real.

### Requisitos Funcionales Solicitados

> **Semántica de estado (reconciliado 2026-06-25).** ✓ significa **representado en el
> dashboard construido** (Next.js + Supabase con datos seed), NO integración viva. Los
> requisitos de backend (scoring GAS, generación de contratos, WhatsApp, GPT-4o Vision,
> reporting) corresponden a la **arquitectura objetivo** y están **simulados como datos**,
> no implementados como servicios reales. Ver `MATRIZ-BACKEND.md` v2.0.0.

| # | Requisito | Estado | Notas |
|---|---|---|---|
| 1 | Captacion de leads via formulario web | ✓ | Escenario 01 - Intake & Scoring |
| 2 | Scoring automatico de leads (0-100) | ✓ | Google Apps Script: lead_scoring.gs |
| 3 | Generacion de contratos PDF | ✓ | Google Apps Script: contract_generator.gs |
| 4 | Firma electronica de contratos | ✓ | DocuSign / PandaDoc (placeholder) |
| 5 | Onboarding de inquilinos | ✓ | Escenario 02 - Tenant Onboarding |
| 6 | Gestion de incidencias via WhatsApp | ✓ | Escenario 03 - Incident Management |
| 7 | Inspeccion visual con IA (GPT-4o Vision) | ✓ | Escenario 04 - AI Visual Inspection |
| 8 | Reporte diario de KPIs | ✓ | Escenario 05 - Daily KPI Reporting |
| 9 | Dashboard Next.js con 8-11 pantallas | ✓ | Vercel SSG deployment |
| 10 | Integracion con Supabase (16 tablas) | ✓ | Fuente unica de verdad |
| 11 | Integracion con WhatsApp Business API | ✓ | Notificaciones transaccionales |
| 12 | Uso de OpenAI GPT-4o y GPT-4o-mini | ✓ | NLP e inspeccion visual |

### Restricciones y Notas Especiales
- **Base de datos:** Supabase (16 tablas) - Fuente unica de verdad
- **Orquestacion:** Make (Integromat) - 5 escenarios
- **Logica de negocio:** Google Apps Script (7 scripts)
- **Dashboard:** Next.js 16 + Tailwind + Recharts (8-11 pantallas estaticas)
- **IA:** OpenAI GPT-4o + GPT-4o-mini
- **Comunicacion:** WhatsApp Business Cloud API

### Cumplimiento de Instrucciones
- [ ] Todas las instrucciones del cliente han sido implementadas
- [ ] Funcionalidades adicionales solicitadas estan documentadas
- [ ] Existen diferencias entre arquitectura inicial y solicitudes posteriores (favor indicar)

### Documentos de Comunicacion Relacionados
- [ ] `/docs/comunicacion/` - Historial de correos y aprobaciones

---
