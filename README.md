# PropertyOps AI

Dashboard ejecutivo para la gestión de habitaciones en alquiler: cubre conceptualmente todo el ciclo —desde la captación del candidato hasta la devolución del depósito— con una interfaz tipo "mesa de control" sobre datos en tiempo real.

> **Alcance de este build (honesto).** Lo que está **construido y funcionando** es el
> **dashboard Next.js 16 + Supabase** con datos de demostración. La automatización
> multi-servicio (Make / Google Apps Script / WhatsApp / OpenAI / Drive) es el
> **diseño de arquitectura objetivo**, documentado en `docs/`, pero **no está implementada
> como integraciones vivas** en este repositorio: en la demo, las "automatizaciones" se
> representan como datos sembrados en Supabase (monitor de escenarios, logs de error).
> Proyecto de portafolio `tipo_cliente: ficticio` (sandbox-first, datos ficticios).

---

## Stack (lo construido)

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Dashboard | Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Recharts | ✅ Implementado |
| Datos + Auth | Supabase (PostgreSQL + Supabase Auth) | ✅ Implementado |
| Datos demo | Seed estático (`frontend/data/seed.json`, fecha fija 2026-04-25) | ✅ Implementado |
| Despliegue | Vercel | 🎯 Objetivo |

## Arquitectura objetivo (diseño, no implementada en este build)

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Orquestación | Make (Integromat) — 5 escenarios | 📐 Diseño (no construido) |
| Lógica de negocio | Google Apps Script — 7 scripts | 📐 Diseño (no construido) |
| Documentos | Google Drive + Google Docs | 📐 Diseño (no construido) |
| Comunicación | WhatsApp Business Cloud API | 📐 Diseño (no construido) |
| IA | OpenAI GPT-4o (visión) + GPT-4o-mini (NLP) | 📐 Diseño (no construido) |

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el diseño end-to-end propuesto.

---

## Frontend Dashboard (8 vistas, implementadas)

Next.js 16 App Router, datos seed desde Supabase, diseño "mesa de control" (teal/petróleo):

- **Dashboard ejecutivo** — KPIs, tendencia 30 días, activity feed
- **Onboarding Kanban** — pipeline de leads con score y acciones
- **Inquilinos** — tabla con expediente individual (pagos, incidencias, docs)
- **Habitaciones** — grid por propiedad + inventario por habitación
- **Incidencias** — semáforo SLA en tiempo real, filtros, expansión de fila
- **Checkout** — wizard 4-pasos (aviso → inspección → cargos → cierre)
- **Inspecciones** — slider antes/después, donut de AI score, tabla de cargos
- **Automatizaciones** — monitor de escenarios (datos simulados) + log de errores

---

## Estructura del proyecto (real)

```
PropertyOps AI/
├── frontend/                    # Next.js 16 dashboard (lo construido)
│   ├── app/
│   │   ├── (dashboard)/         # Route group — 8 secciones
│   │   │   ├── dashboard/  onboarding/  inquilinos/[id]/
│   │   │   ├── habitaciones/[id]/  incidencias/  checkout/
│   │   │   ├── inspecciones/[id]/  automatizaciones/
│   │   ├── auth/                # Server actions de Supabase Auth
│   │   ├── login/              # Login multi-rol
│   │   ├── layout.tsx
│   │   └── page.tsx             # Redirect → /dashboard
│   ├── components/
│   │   ├── charts/              # OccupancyTrendChart, RevenueByPropertyChart
│   │   ├── layout/              # Sidebar, TopBar, DashboardShell
│   │   └── ui/                  # KpiCard, StatusBadge, SlaIndicator, BeforeAfterSlider
│   ├── data/
│   │   └── seed.json            # Datos demo (fecha fija: 2026-04-25)
│   └── lib/
│       ├── supabase.ts          # Cliente browser
│       ├── supabase-server.ts   # Cliente SSR
│       ├── seed.ts              # Re-exportación tipada + helpers
│       └── types.ts             # Interfaces TypeScript de las entidades
├── docs/
│   ├── ARCHITECTURE.md          # Diseño de arquitectura objetivo (Mermaid)
│   └── DATABASE.md              # Modelo de datos conceptual (16 entidades)
└── src/                         # Reservado para backend objetivo (no implementado)
    ├── ai/                      # (vacío)
    └── automation/              # (vacío)
```

---

## Ejecución local

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000/dashboard
```

Requiere variables de entorno de Supabase en `frontend/.env.local`
(ver `.env.example` cuando esté disponible):

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Documentación

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — diseño de arquitectura **objetivo** end-to-end (no implementado en este build).
- [docs/DATABASE.md](docs/DATABASE.md) — modelo de datos conceptual (16 entidades); la demo implementa un subconjunto en Supabase.
