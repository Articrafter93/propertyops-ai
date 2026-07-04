# PropertyOps AI — Arquitectura del Sistema (Diseño Objetivo)

Plataforma de automatización de ciclo completo para gestión de habitaciones en alquiler: desde la captación del candidato hasta la devolución de depósito, con IA multimodal, WhatsApp Business y dashboard en tiempo real.

> **Estado de implementación (honesto).** Este documento describe la **arquitectura objetivo
> (diseño)**, no el estado construido. Lo **implementado** en el repo es el **dashboard
> Next.js 16** con datos de demostración **estáticos** (`seed.json`) y **autenticación mock
> local** por cookie. La capa de automatización multi-servicio (Make · GAS · WhatsApp · OpenAI
> · Drive) descrita abajo es el **blueprint de diseño y NO está construida** como integraciones
> vivas. En los diagramas, la capa de persistencia objetivo se representa como **PostgreSQL**
> (base de datos relacional de producción propuesta); en el build actual esos datos viven como
> `seed.json` estático. Los diagramas representan el flujo propuesto, no el construido.

---

## Stack tecnológico

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Dashboard | Next.js 16 + TypeScript + Tailwind v4 + Recharts | ✅ Implementado |
| Datos | `seed.json` estático tipado (`lib/seed.ts`) | ✅ Implementado |
| Auth | Mock local por cookie (gate `NEXT_PUBLIC_DEMO_AUTH`) | ✅ Implementado |
| Persistencia de producción (objetivo) | PostgreSQL | 📐 Diseño (no construido) |
| Orquestación | Make (Integromat) — 5 escenarios | 📐 Diseño (no construido) |
| Lógica de negocio | Google Apps Script (GAS) — 7 scripts | 📐 Diseño (no construido) |
| Documentos | Google Drive + Google Docs | 📐 Diseño (no construido) |
| Comunicación | WhatsApp Business Cloud API | 📐 Diseño (no construido) |
| IA | OpenAI GPT-4o + GPT-4o-mini | 📐 Diseño (no construido) |
| Firma electrónica | DocuSign / PandaDoc | 📐 Diseño (placeholder) |
| Despliegue | Vercel | 🎯 Objetivo |

---

## Flujo end-to-end (diseño propuesto)

```mermaid
flowchart TD
    WF([Formulario Web]) -->|POST webhook| S01[Escenario 01\nIntake & Scoring]
    S01 -->|GAS doPost| GAS_SCORE[lead_scoring.gs\nScore 0-100]
    GAS_SCORE --> S01
    S01 -->|Create/Update| AT_LEADS[(PostgreSQL\nLeads)]
    S01 -->|CreateFolder| DRIVE[(Google Drive\nExpedientes)]
    S01 -->|Template WA| WA[WhatsApp\nBusiness API]

    AT_LEADS -->|Watch Status=Approved| S02[Escenario 02\nOnboarding]
    S02 -->|GAS doPost| GAS_CONT[contract_generator.gs\nPDF contrato]
    GAS_CONT --> DRIVE
    S02 -->|Create| AT_CONT[(PostgreSQL\nContracts)]
    S02 -->|Update| AT_ROOMS[(PostgreSQL\nRooms → Occupied)]
    S02 -->|Update| AT_TENANTS[(PostgreSQL\nTenants → Active)]
    S02 -->|Template WA| WA

    WA -->|Inbound message| S03[Escenario 03\nIncident Mgmt]
    S03 -->|GPT-4o-mini NLP| OAI_MINI[OpenAI\nGPT-4o-mini]
    OAI_MINI --> S03
    S03 -->|Create| AT_INC[(PostgreSQL\nIncidents)]
    S03 -->|Search| AT_TECH[(PostgreSQL\nTechnicians)]
    S03 -->|Template WA x2| WA

    DRIVE -->|New photo| S04[Escenario 04\nAI Inspection]
    S04 -->|GAS doPost base64| GAS_INSP[inspection.gs\nGPT-4o Vision]
    GAS_INSP -->|API call| OAI_VISION[OpenAI\nGPT-4o Vision]
    OAI_VISION --> GAS_INSP
    GAS_INSP --> S04
    S04 -->|Create| AT_INSP[(PostgreSQL\nVisual_Inspections)]
    S04 -->|Create| AT_PAY[(PostgreSQL\nPayments)]
    S04 -->|Template WA| WA

    CRON([CRON 07:00]) --> S05[Escenario 05\nKPI Reporting]
    S05 -->|GAS doPost| GAS_KPI[kpi_reporter.gs\n12 KPIs]
    GAS_KPI -->|Read all tables| AT_LEADS & AT_INC & AT_TENANTS & AT_PAY
    GAS_KPI --> S05
    S05 -->|Create| AT_KPI[(PostgreSQL\nDaily_KPIs)]
    S05 -->|HTML email| GMAIL[Gmail\nResumen gestor]

    AT_KPI & AT_INC & AT_TENANTS & AT_ROOMS -->|Static seed| DASH[Next.js Dashboard\nVercel]
```

---

## Dependencias entre scripts GAS

```mermaid
graph LR
    subgraph GAS Scripts
        U[utils.gs\nCONFIG · dbRequest\nwriteAuditLog · generateId]
        LS[lead_scoring.gs]
        CG[contract_generator.gs]
        KR[kpi_reporter.gs]
        IN[inspection.gs]
        CO[checkout.gs]
        WN[whatsapp_notifier.gs]
        DM[drive_manager.gs]
    end

    subgraph PostgreSQL Tables
        TL[(Leads)]
        TT[(Tenants)]
        TR[(Rooms)]
        TC[(Contracts)]
        TI[(Incidents)]
        TVI[(Visual_Inspections)]
        TP[(Payments)]
        TK[(Daily_KPIs)]
        TAL[(Audit_Log)]
        TCO[(Check-in/Checkout)]
    end

    U --> LS & CG & KR & IN & CO & WN & DM

    LS -->|Read| TL
    LS -->|Write score| TL
    LS -->|Audit| TAL

    CG -->|Read template| DRIVE_T[(Drive Template)]
    CG -->|Write PDF| DRIVE_C[(Drive Contratos)]
    CG -->|Read| TT & TR
    CG -->|Write| TC
    CG -->|Audit| TAL

    KR -->|Read| TL & TT & TR & TI & TP & TCO
    KR -->|Write| TK
    KR -->|Audit| TAL

    IN -->|Read photo| DRIVE_P[(Drive Inspecciones)]
    IN -->|OpenAI GPT-4o| OAI[(OpenAI API)]
    IN -->|Read baseline| TVI
    IN -->|Write| TVI
    IN -->|Audit| TAL

    CO -->|Read/Write| TT & TR & TCO & TP
    CO -->|Call| WN
    CO -->|Audit| TAL

    WN -->|WhatsApp API| WA_API[(WA Business Cloud)]
    WN -->|Audit| TAL

    DM -->|Drive API| DRIVE_ROOT[(Drive Root)]
    DM -->|Audit| TAL
```

---

## Módulos y escenarios Make

| # | Escenario | Trigger | Pasos | GAS llamado |
|---|-----------|---------|-------|-------------|
| 01 | Pre-onboarding & Intake | Webhook POST form | 10 | `lead_scoring.gs` |
| 02 | Tenant Onboarding | DB Watch (Lead=Approved) | 11 | `contract_generator.gs` |
| 03 | Incident Management | WhatsApp Inbound | 12 | `whatsapp_notifier.gs` |
| 04 | AI Visual Inspection | Drive Watch (new photo) | 11 | `inspection.gs` |
| 05 | Daily KPI Reporting | CRON 07:00 | 8 | `kpi_reporter.gs` |

---

## Base de datos objetivo — PostgreSQL (16 tablas)

Ver [DATABASE.md](DATABASE.md) para el schema completo con todos los campos, tipos y relaciones.

**Relaciones clave:**
```
Properties ──< Rooms ──< Beds
               Rooms ──< Tenants ──< Contracts
               Rooms ──< Incidents ──< Technicians
               Rooms ──< Inventory_Master
               Rooms ──< Visual_Inspections ──< Check-in/Checkout
               Tenants ──< Documents
               Tenants ──< Payments
               Tenants ──< Messages_Comms
```

---

## Dashboard frontend (Next.js 16)

8 pantallas estáticas (SSG) desplegadas en Vercel:

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | KPIs ejecutivos, tendencia 30 días, activity feed |
| `/onboarding` | Kanban de leads (4 columnas) con score badge |
| `/inquilinos` | Tabla de inquilinos activos con búsqueda |
| `/inquilinos/[id]` | Expediente: Resumen / Pagos / Incidencias / Docs |
| `/habitaciones` | Grid de habitaciones por propiedad |
| `/habitaciones/[id]` | Inventario checklist + historial inspecciones |
| `/incidencias` | Tabla con semáforo SLA, filtros, row expansion |
| `/checkout` | Lista de salidas + wizard 4-pasos |
| `/inspecciones` | Lista de inspecciones con AI score |
| `/inspecciones/[id]` | Slider antes/después, donut score, tabla cargos |
| `/automatizaciones` | Estado de 5 escenarios Make + error log |

---

## Seguridad y compliance

- **Secrets:** Variables de entorno en Make + `CONFIG` en GAS. Nunca en código fuente.
- **PII:** Carpetas Drive con acceso restringido por inquilino. `shareFileWithTenant()` solo añade viewer.
- **Audit trail:** Todo write/update pasa por `writeAuditLog()` en `utils.gs` → tabla `Audit_Log`.
- **Idempotencia:** Todos los escenarios Make tienen `idempotency_key` con ventana temporal y guard field en la base de datos.
- **Reintentos:** Strategy `exponential backoff` (3 intentos, inicio 2-5s) en todos los escenarios.
