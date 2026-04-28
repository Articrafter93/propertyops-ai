# PropertyOps AI — Arquitectura del Sistema

Plataforma de automatización de ciclo completo para gestión de habitaciones en alquiler: desde la captación del candidato hasta la devolución de depósito, con IA multimodal, WhatsApp Business y dashboard en tiempo real.

---

## Stack tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Orquestación | Make (Integromat) | 5 escenarios que conectan todos los servicios |
| Base de datos operativa | Airtable (16 tablas) | Fuente única de verdad |
| Lógica de negocio | Google Apps Script (GAS) | 7 scripts: scoring, contratos, inspección, KPIs, checkout, WhatsApp, Drive |
| Documentos | Google Drive + Google Docs | Expedientes, contratos PDF, fotos de inspección |
| Comunicación | WhatsApp Business Cloud API | Notificaciones transaccionales bidireccionales |
| IA | OpenAI GPT-4o + GPT-4o-mini | Inspección visual multimodal · NLP de incidencias |
| Dashboard | Next.js 16 + Tailwind + Recharts | 8 pantallas estáticas (SSG) desplegadas en Vercel |
| Firma electrónica | DocuSign / PandaDoc (placeholder) | Firma de contratos |

---

## Flujo end-to-end

```mermaid
flowchart TD
    WF([Formulario Web]) -->|POST webhook| S01[Escenario 01\nIntake & Scoring]
    S01 -->|GAS doPost| GAS_SCORE[lead_scoring.gs\nScore 0-100]
    GAS_SCORE --> S01
    S01 -->|Create/Update| AT_LEADS[(Airtable\nLeads)]
    S01 -->|CreateFolder| DRIVE[(Google Drive\nExpedientes)]
    S01 -->|Template WA| WA[WhatsApp\nBusiness API]

    AT_LEADS -->|Watch Status=Approved| S02[Escenario 02\nOnboarding]
    S02 -->|GAS doPost| GAS_CONT[contract_generator.gs\nPDF contrato]
    GAS_CONT --> DRIVE
    S02 -->|Create| AT_CONT[(Airtable\nContracts)]
    S02 -->|Update| AT_ROOMS[(Airtable\nRooms → Occupied)]
    S02 -->|Update| AT_TENANTS[(Airtable\nTenants → Active)]
    S02 -->|Template WA| WA

    WA -->|Inbound message| S03[Escenario 03\nIncident Mgmt]
    S03 -->|GPT-4o-mini NLP| OAI_MINI[OpenAI\nGPT-4o-mini]
    OAI_MINI --> S03
    S03 -->|Create| AT_INC[(Airtable\nIncidents)]
    S03 -->|Search| AT_TECH[(Airtable\nTechnicians)]
    S03 -->|Template WA x2| WA

    DRIVE -->|New photo| S04[Escenario 04\nAI Inspection]
    S04 -->|GAS doPost base64| GAS_INSP[inspection.gs\nGPT-4o Vision]
    GAS_INSP -->|API call| OAI_VISION[OpenAI\nGPT-4o Vision]
    OAI_VISION --> GAS_INSP
    GAS_INSP --> S04
    S04 -->|Create| AT_INSP[(Airtable\nVisual_Inspections)]
    S04 -->|Create| AT_PAY[(Airtable\nPayments)]
    S04 -->|Template WA| WA

    CRON([CRON 07:00]) --> S05[Escenario 05\nKPI Reporting]
    S05 -->|GAS doPost| GAS_KPI[kpi_reporter.gs\n12 KPIs]
    GAS_KPI -->|Read all tables| AT_LEADS & AT_INC & AT_TENANTS & AT_PAY
    GAS_KPI --> S05
    S05 -->|Create| AT_KPI[(Airtable\nDaily_KPIs)]
    S05 -->|HTML email| GMAIL[Gmail\nResumen gestor]

    AT_KPI & AT_INC & AT_TENANTS & AT_ROOMS -->|Static seed| DASH[Next.js Dashboard\nVercel]
```

---

## Dependencias entre scripts GAS

```mermaid
graph LR
    subgraph GAS Scripts
        U[utils.gs\nCONFIG · airtableRequest\nwriteAuditLog · generateId]
        LS[lead_scoring.gs]
        CG[contract_generator.gs]
        KR[kpi_reporter.gs]
        IN[inspection.gs]
        CO[checkout.gs]
        WN[whatsapp_notifier.gs]
        DM[drive_manager.gs]
    end

    subgraph Airtable Tables
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
| 02 | Tenant Onboarding | Airtable Watch (Lead=Approved) | 11 | `contract_generator.gs` |
| 03 | Incident Management | WhatsApp Inbound | 12 | `whatsapp_notifier.gs` |
| 04 | AI Visual Inspection | Drive Watch (new photo) | 11 | `inspection.gs` |
| 05 | Daily KPI Reporting | CRON 07:00 | 8 | `kpi_reporter.gs` |

---

## Base de datos Airtable (16 tablas)

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
- **Idempotencia:** Todos los escenarios Make tienen `idempotency_key` con ventana temporal y guard field en Airtable.
- **Reintentos:** Strategy `exponential backoff` (3 intentos, inicio 2-5s) en todos los escenarios.
