# PropertyOps AI

Plataforma de automatización de ciclo completo para gestión de habitaciones en alquiler. Cubre desde la captación del candidato hasta la devolución del depósito, con IA multimodal, WhatsApp Business API y un dashboard ejecutivo en tiempo real.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/propertyops-ai)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Orquestación | Make (Integromat) — 5 escenarios |
| Base de datos | Airtable — 16 tablas |
| Lógica de negocio | Google Apps Script — 7 scripts |
| Documentos | Google Drive + Google Docs |
| Comunicación | WhatsApp Business Cloud API |
| IA | OpenAI GPT-4o (visión) + GPT-4o-mini (NLP) |
| Dashboard | Next.js 16 · Tailwind v4 · Recharts · shadcn/ui |
| Despliegue | Vercel (SSG — 26 páginas estáticas) |

---

## Módulos

| # | Módulo | Trigger | Estado |
|---|--------|---------|--------|
| 1 | Pre-onboarding & Intake | Webhook form | ✅ Implementado |
| 2 | Tenant Onboarding | Airtable Watch (Lead=Approved) | ✅ Implementado |
| 3 | Incident Management | WhatsApp Inbound | ✅ Implementado |
| 4 | AI Inspect (Check-in/out) | Drive Watch (new photo) | ✅ Implementado |
| 5 | Reporting & Observability | CRON diario 07:00 | ✅ Implementado |

---

## Frontend Dashboard

8 pantallas construidas con Next.js 16 App Router, datos seed estáticos y diseño "mesa de control" (teal/petróleo):

- **Dashboard ejecutivo** — KPIs, tendencia 30 días, activity feed
- **Onboarding Kanban** — pipeline de leads con score y acciones
- **Inquilinos** — tabla con expediente individual (pagos, incidencias, docs)
- **Habitaciones** — grid por propiedad + inventario por habitación
- **Incidencias** — semáforo SLA en tiempo real, filtros, expansión de fila
- **Checkout** — wizard 4-pasos (aviso → inspección → cargos → cierre)
- **Inspecciones** — slider antes/después, donut de AI score, tabla de cargos
- **Automatizaciones** — estado de escenarios Make + log de errores

---

## Estructura del proyecto

```
PropertyOps AI/
├── frontend/                    # Next.js 16 dashboard
│   ├── app/
│   │   ├── (dashboard)/         # Route group — 8 secciones
│   │   │   ├── dashboard/
│   │   │   ├── onboarding/
│   │   │   ├── inquilinos/[id]/
│   │   │   ├── habitaciones/[id]/
│   │   │   ├── incidencias/
│   │   │   ├── checkout/
│   │   │   ├── inspecciones/[id]/
│   │   │   └── automatizaciones/
│   │   ├── layout.tsx
│   │   └── page.tsx             # Redirect → /dashboard
│   ├── components/
│   │   ├── charts/              # OccupancyTrendChart, RevenueByPropertyChart
│   │   ├── layout/              # Sidebar, TopBar, DashboardShell
│   │   └── ui/                  # KpiCard, StatusBadge, SlaIndicator, BeforeAfterSlider
│   ├── data/
│   │   └── seed.json            # Datos demo (fecha fija: 2026-04-25)
│   └── lib/
│       ├── seed.ts              # Re-exportación tipada + helpers
│       └── types.ts             # Interfaces TypeScript de todas las entidades
├── src/
│   ├── apps-script/             # Google Apps Script (7 scripts)
│   │   ├── utils.gs             # CONFIG, helpers compartidos
│   │   ├── lead_scoring.gs      # Scoring candidatos (0-100)
│   │   ├── contract_generator.gs # Generación PDF contratos
│   │   ├── kpi_reporter.gs      # 12 KPIs diarios
│   │   ├── inspection.gs        # Análisis GPT-4o Vision
│   │   ├── checkout.gs          # Gestión de salidas
│   │   ├── whatsapp_notifier.gs # Envío WhatsApp Business
│   │   └── drive_manager.gs     # Gestión de carpetas Drive
│   ├── make-scenarios/          # Blueprints técnicos Make (v2.0)
│   │   ├── 01-intake.json
│   │   ├── 02-onboarding.json
│   │   ├── 03-incidents.json
│   │   ├── 04-ai-inspect.json
│   │   └── 05-reporting.json
│   └── webhooks/
│       ├── simulator.js         # Simulador local de payloads
│       └── package.json
├── templates/
│   └── contract_template.txt    # Plantilla de contrato con variables {{}}
├── docs/
│   ├── ARCHITECTURE.md          # Diagramas Mermaid + descripción del sistema
│   └── DATABASE.md              # Schema completo Airtable (16 tablas)
└── vercel.json                  # Config de despliegue Vercel
```

---

## Ejecución local

```bash
# Dashboard frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000/dashboard

# Simulador de webhooks
cd src/webhooks
npm install
npm run test:intake      # Simula formulario de candidato
npm run test:onboarding  # Simula aprobación de lead
npm run test:incident    # Simula mensaje WhatsApp de incidencia
npm run test:inspect     # Simula subida de foto de inspección
```

---

## Variables de entorno GAS

Configurar en `src/apps-script/utils.gs` → objeto `CONFIG`:

```javascript
const CONFIG = {
  AIRTABLE_API_KEY:          'pat...',
  AIRTABLE_BASE_ID:          'app...',
  DRIVE_TENANTS_FOLDER_ID:   '...',
  DRIVE_TEMPLATE_FILE_ID:    '...',  // .gdoc plantilla contrato
  DRIVE_CONTRACTS_FOLDER_ID: '...',  // carpeta destino PDFs
  WHATSAPP_PHONE_ID:         '...',
  WHATSAPP_ACCESS_TOKEN:     'EAA...',
  OPENAI_API_KEY:            'sk-...',
  GAS_LEAD_SCORING_URL:      'https://script.google.com/...',
};
```

---

## Arquitectura

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para:
- Diagrama de flujo end-to-end (WebForm → Make → GAS → Airtable → WhatsApp)
- Diagrama de dependencias GAS (qué tabla lee/escribe cada script)
- Schema completo de las 16 tablas Airtable

Ver [docs/DATABASE.md](docs/DATABASE.md) para el schema completo de Airtable.
