# 02-ARQUITECTURA-SITIO.md - PropertyOps AI

Version: 1.0.0
Fecha: 2026-04-27
Proyecto: Plataforma de automatizacion para gestion de alquileres

---

## 1. Sitemap Final

| Ruta | Nombre | Descripcion | Tipo |
|---|---|---|---|
| `/dashboard` | Dashboard | KPIs ejecutivos, tendencia 30 dias, activity feed | Principal |
| `/onboarding` | Onboarding | Kanban de leads (4 columnas) con score badge | Gestion |
| `/inquilinos` | Inquilinos | Tabla de inquilinos activos con busqueda | Gestion |
| `/inquilinos/[id]` | Expediente Inquilino | Resumen / Pagos / Incidencias / Docs | Detalle |
| `/habitaciones` | Habitaciones | Grid de habitaciones por propiedad | Gestion |
| `/habitaciones/[id]` | Detalle Habitacion | Inventario checklist + historial inspecciones | Detalle |
| `/incidencias` | Incidencias | Tabla con semaforo SLA, filtros, row expansion | Gestion |
| `/checkout` | Checkout | Lista de salidas + wizard 4-pasos | Operativo |
| `/inspecciones` | Inspecciones | Lista de inspecciones con AI score | Operativo |
| `/inspecciones/[id]` | Detalle Inspeccion | Slider antes/despues, donut score, tabla cargos | Detalle |
| `/automatizaciones` | Automatizaciones | Estado de 5 escenarios Make + error log | Admin |
| `/login` | Login | Formulario de acceso con Supabase Auth | Auth |
| `/privacidad` | Privacidad | Politica de privacidad (Ley 1581) | Legal |

## 2. Componentes por Tipo de Pagina

### Dashboard (`/dashboard`)
- **KpiCard:** Tarjetas con KPIs principales (ocupacion, ingresos, incidencias)
- **OccupancyTrendChart:** Grafico de tendencia 30 dias (Recharts)
- **RevenueByPropertyChart:** Grafico de ingresos por propiedad (Recharts)
- **ActivityFeed:** Lista de actividades recientes
- **StatusBadge:** Indicadores de estado

### Onboarding (`/onboarding`)
- **KanbanBoard:** 4 columnas (New, Contacted, Approved, Rejected)
- **LeadCard:** Tarjeta de lead con score badge
- **ScoreBadge:** Badge de color segun score (0-100)

### Inquilinos (`/inquilinos`)
- **DataTable:** Tabla con busqueda, filtros, paginacion
- **StatusBadge:** Estado del inquilino (Active, Late, Vacating)
- **SearchInput:** Busqueda por nombre/documento

### Expediente Inquilino (`/inquilinos/[id]`)
- **Tabs:** Resumen / Pagos / Incidencias / Docs
- **PaymentTable:** Historial de pagos
- **IncidentTable:** Incidencias del inquilino
- **DocumentList:** Lista de documentos (contrato, ID, etc.)

### Habitaciones (`/habitaciones`)
- **RoomGrid:** Grid de tarjetas de habitaciones
- **RoomCard:** Tarjeta con estado, inquilino actual, proximo pago
- **PropertyFilter:** Filtro por propiedad

### Detalle Habitacion (`/habitaciones/[id]`)
- **InventoryChecklist:** Checklist de inventario (furniture, appliances)
- **InspectionHistory:** Historial de inspecciones
- **StatusBadge:** Estado de la habitacion (Occupied, Vacant, Maintenance)

### Incidencias (`/incidencias`)
- **IncidentTable:** Tabla con semaforo SLA (verde/amarillo/rojo)
- **SlaIndicator:** Indicador visual de SLA
- **RowExpansion:** Detalles de la incidencia expandible
- **FilterBar:** Filtros por estado, tecnico, urgencia

### Checkout (`/checkout`)
- **CheckoutWizard:** Wizard de 4 pasos
  1. Seleccionar inquilino saliente
  2. Checklist de entrega
  3. Calculo de cargos (danos, limpieza, deposito)
  4. Confirmacion y firma
- **ProgressBar:** Indicador de paso actual

### Inspecciones (`/inspecciones`)
- **InspectionTable:** Lista con AI score (0-100)
- **ScoreBadge:** Badge de score visual
- **FilterBar:** Filtros por fecha, habitacion, resultado

### Detalle Inspeccion (`/inspecciones/[id]`)
- **ImageSlider:** Comparacion antes/despues (Slider de fotos)
- **DonutScore:** Grafico de dona con score general
- **ChargeTable:** Tabla de cargos derivados (danos, limpieza)
- **PhotoComparison:** Vista lado a lado de fotos

### Automatizaciones (`/automatizaciones`)
- **ScenarioStatus:** Estado de 5 escenarios Make (green/red/yellow)
- **ErrorLog:** Tabla de errores recientes
- **LastRunIndicator:** Ultima ejecucion de cada escenario

### Login (`/login`)
- **LoginForm:** Formulario con email/password + "Demo" credentials
- **SupabaseAuth:** Integracion con Supabase Auth
- **DemoButton:** Boton de acceso demo pre-configurado

## 3. Reglas SEO Tecnico

### Metadata Base (next.config.ts o layout.tsx)
```typescript
export const metadata = {
  title: 'PropertyOps AI - Automatizacion de Alquileres',
  description: 'Plataforma de automatizacion de ciclo completo para gestion de habitaciones en alquiler con IA y WhatsApp Business',
  metadataBase: new URL('https://propertyops-ai.vercel.app'),
};
```

### Robots.txt
- **Allow:** `/`
- **Disallow:** `/api/`, `/admin/`, `/private/`
- **Sitemap:** `https://propertyops-ai.vercel.app/sitemap.xml`

### Sitemap.xml
- Generacion automatica via Next.js 16 `sitemap.ts`
- Paginas principales: `/dashboard`, `/onboarding`, `/inquilinos`, `/habitaciones`, `/incidencias`
- Excluir: `/api/`, `/privacidad` (opcional)

### Canonical URL
- Implementar `link rel="canonical"` en layout.tsx
- Evitar contenido duplicado entre `/inquilinos` y `/inquilinos/[id]`

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PropertyOps AI",
  "description": "Plataforma de automatizacion para gestion de alquileres",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web"
}
```

## 4. Componentes Reutilizables (UI System)

### Base (shadcn/ui)
- **Button:** Variantes (default, outline, ghost, link)
- **Card:** Card, CardHeader, CardContent, CardFooter
- **Badge:** Badge, StatusBadge, ScoreBadge
- **Table:** DataTable, TableHeader, TableBody, TableRow
- **Dialog:** Modal para confirmaciones
- **Sheet:** Side panel para detalles rapidos
- **Tabs:** Para secciones (Expediente inquilino)
- **Progress:** Barras de progreso (Wizard)

### Especializados
- **KpiCard:** Tarjeta de KPI con icono, valor, tendencia
- **SlaIndicator:** Semafoto visual de SLA
- **ScoreBadge:** Badge de score con color dinamico
- **ImageSlider:** Comparacion de imagenes antes/despues
- **DonutScore:** Grafico de dona para scores

## 5. Responsive y Breakpoints

- **Mobile First:** Diseno inicia en 320px
- **Breakpoints Tailwind:**
  - `sm`: 640px (tablets pequenas)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktop)
  - `xl`: 1280px (desktop grande)
- **Sidebar:** Colapsible en mobile (`Sheet` component)
- **Tables:** Horizontal scroll en mobile, stack en cards

## 6. Accesibilidad (A11y)

- **Navegacion por teclado:** Todos los botones y links focuseables
- **Labels en formularios:** `<label>` o `aria-label` explicito
- **Contraste:** Ratio minimo 4.5:1 (WCAG AA)
- **prefers-reduced-motion:** `@media (prefers-reduced-motion: reduce)` en animaciones
- **Semantica:** Uso correcto de `<nav>`, `<main>`, `<aside>`, `<table>`

## 7. Motion Strategy (`MOTION-STRATEGY.md`)

- **Micro-interacciones:** Transiciones suaves en hover/focus (150ms)
- **Page transitions:** `layout.tsx` con `framer-motion` (opcional)
- **Animation fallback:** `@media (prefers-reduced-motion: reduce)` deshabilita todas las animaciones
- **Loading states:** Skeleton screens en lugar de spinners
- **Hover effects:** Sutiles en cards y botones

---

## GATE 4 - Aprobacion Diseno UI

> [GATE 4] — RESUMEN DE DISENO VISUAL
> Herramienta principal de diseno: Por confirmar (Stitch sugerido basado en KB 12)
> Pantallas disenadas: 12 rutas definidas en sitemap
> ¿CONFIRMAS QUE ESTE DISENO ES APTO PARA PASAR A IMPLEMENTACION EN CODIGO? (si/no)

---

## GATE 4 Status: PENDIENTE
