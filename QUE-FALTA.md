# Registro Permanente de Retoma (Save State)
> PropertyOps AI — Última auditoría: 2026-04-27

---

## FASE 1–3: Setup, Arquitectura y UI (COMPLETADO)

- [x] Estructura del proyecto: frontend/ (Next.js 16), src/ (Apps Script, Make, webhooks)
- [x] Stack definido: Next.js 16.2.4 + React 19 + Tailwind v4 + shadcn/ui (base-ui)
- [x] Tipos TypeScript completos (14 interfaces en `frontend/lib/types.ts`)
- [x] Seed JSON con datos demo coherentes (`frontend/data/seed.json`, fecha fija 2026-04-25)
- [x] Layout con Sidebar + TopBar + DashboardShell
- [x] GEMINI.md y baseline operativo configurados
- [x] `.env*` en `.gitignore` — verificado
- [x] `vercel.json` configurado (build desde `frontend/`, framework nextjs)

---

## FASE 4–5: Pantallas del Dashboard (COMPLETADO — datos estáticos)

- [x] `/dashboard` — KPIs, 2 gráficas Recharts (ocupación + ingresos), activity feed
- [x] `/onboarding` — Kanban 4 columnas (leads), cards con chips de estado
- [x] `/inquilinos` — tabla con links a expediente individual
- [x] `/inquilinos/[id]` — tabs: Pagos / Incidencias / Documentos, contrato, generateStaticParams
- [x] `/habitaciones` — grid por propiedad con links a detalle
- [x] `/habitaciones/[id]` — info, inventario hardcodeado por room ID, historial inspecciones
- [x] `/incidencias` — tabla semáforo SLA con lógica real de cálculo
- [x] `/checkout` — wizard 4 pasos (hardcodeado en paso 3, TENANT-006 fijo)
- [x] `/inspecciones` — tabla con score AI
- [x] `/inspecciones/[id]` — score donut (Recharts client component), before/after placeholders, cargos
- [x] `/automatizaciones` — estado escenarios Make + log de errores
- [x] Scripts Google Apps Script: utils, lead_scoring, contract_generator, kpi_reporter, inspection, checkout, whatsapp_notifier, drive_manager (8 archivos .gs)
- [x] Blueprints Make: intake, onboarding, incidents, ai-inspect, reporting (5 escenarios .json)

---

## FASE 6: Interactividad y Handlers (PENDIENTE)

- [ ] **B6-A** Checkout wizard funcional — actualmente fijo en paso 3 con TENANT-006 hardcodeado; implementar navegación entre pasos con estado
- [ ] **B6-B** Botón "Aprobar lead" en `/onboarding` — sin onClick handler
- [ ] **B6-C** Botón "Rechazar lead" en `/onboarding` — sin onClick handler
- [ ] **B6-D** Botón "Confirmar liquidación" en checkout — sin onClick handler
- [ ] **B6-E** Badge "3 incidencias" en `Sidebar.tsx` — hardcodeado, debe ser dinámico (calculado desde seed/DB)

---

## FASE 7: Conexión de Datos Reales

- [x] **B7-A** Crear proyecto Supabase `propertyops-ai` (ID: `raipjqyjzguaejopxyvd`, us-east-1)
- [x] **B7-B** Poblar `frontend/.env.local` con URL + anon key de Supabase
- [x] **B7-C** Schema completo creado (13 tablas + enums + RLS anon-read) + seed data insertado
- [x] **B7-D** `frontend/lib/supabase.ts` creado con helpers tipados; todas las pages.tsx migradas a async Supabase (build OK — 30 páginas)
- [x] **B7-E** Supabase Auth implementado — usuario demo `admin@propertyops.demo` / `Demo1234!` creado en DB
- [x] **B7-F** Rutas protegidas con `proxy.ts` (Next.js 16 convention) — login page en `/login` con `useActionState` + signIn/signOut server actions

---

## FASE 8: Integraciones Externas (PENDIENTE)

- [ ] **B8-A** Conectar simulador de webhooks (`src/webhooks/simulator.js`) con frontend real
- [ ] **B8-B** Activar escenarios Make con webhooks reales (URLs de producción)
- [ ] **B8-C** Conectar Google Apps Script con Sheets/Drive real del cliente
- [ ] **B8-D** Integrar WhatsApp Business API (notificaciones de incidencias y checkout)
- [ ] **B8-E** Integrar OpenAI / GPT-4o Vision para fotos reales de inspecciones (reemplazar SVG placeholders)
- [ ] **B8-F** Conectar Google Drive para almacenamiento de contratos generados

---

## FASE 9: Pre-deploy y QA (PENDIENTE)

- [ ] **B9-A** Ejecutar `/vuln` (DevSecOps SAST/SCA) antes de deploy
- [ ] **B9-B** Ejecutar `/revision-final` (GATE 9) — pasada funcional obligatoria
- [ ] **B9-C** Validar build de producción: `cd frontend && npm run build` sin errores
- [ ] **B9-D** Imágenes reales en inspecciones (before/after actualmente son SVG placeholder)

---

## FASE 10: Deploy Vercel (PENDIENTE)

- [ ] **B10-A** Ejecutar `/vrc` para deploy desde CLI Vercel MCP
- [ ] **B10-B** Verificar que Vercel Authentication está DESACTIVADA si el link es público (Settings → Deployment Protection)
- [ ] **B10-C** Configurar variables de entorno en Vercel (no exponer en chat — usar `vercel env pull`)
- [ ] **B10-D** Smoke test en URL de producción

---

## 🎯 Top #1 Objetivo Actual

**Deploy a Vercel (B10).**
B7 completado al 100%: DB real, todas las páginas migrando datos de Supabase, auth funcional con login/logout y rutas protegidas. El siguiente paso es ejecutar `/vrc` para hacer el deploy a Vercel y configurar las variables de entorno en el panel de Vercel.

## 🧭 Bloque Activo: B9 — Pre-deploy QA → B10 Deploy Vercel
