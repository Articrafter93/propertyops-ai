# Registro Permanente de Retoma (Save State) - PropertyOps AI

> Reconciliado por `/quefalta` (ANALYST) el 2026-06-25. Esta retoma contrastó los
> pendientes contra el código real y detectó **drift entre la documentación y la
> implementación**. Ver sección "Drift / Reconciliación pendiente".

## Metadata de Activo Digital

- `tipo_cliente:` **PENDIENTE CRITICO** — no registrado. Es candidato de portafolio
  (programa-portafolio-60) → presuntamente `ficticio`. Confirmar y registrar en `BRIEF.md`.
- `categoria_activo_primaria:` **PENDIENTE CRITICO** — falta `CLASIFICACION-ACTIVO.md`.
  Tentativa: Plataforma SaaS con auth / dashboard operativo (área privada multi-rol).
- `confianza_clasificacion:` baja (sin artefacto formal).
- `revision_final_perfiles_requeridos:` **PENDIENTE** — derivar tras clasificar.

## Estado de gates (reconciliado contra fuentes)

| Gate | Declarado (QUE-FALTA/REDO) | Fuente real | Veredicto |
|---|---|---|---|
| GATE 1.0 (correo corporativo Modo A) | — | `comunicacion-cliente/2026-06-25-01-correo-corporativo-inicial.md` | **CREADO** (contrato vinculante, firmado) |
| GATE 1 (briefing) | APROBADO | `01-BRIEFING.md` existe | OK provisional |
| GATE 3 (stack) | APROBADO | `00-ARQUITECTURA-PROYECTO.md` L137: **`PENDIENTE`** | **CONTRADICCIÓN — no cerrado** |
| GATE 0 (seguridad 2.0) | pendiente | sin evidencia | PENDIENTE |

## Verificado en código (auto-tachado en esta sesión)

- [x] `.env.local` existe y `.env*` está en `.gitignore` (`.gitignore` L26-27, L40).
- [x] TypeScript strict mode activo (`frontend/tsconfig.json` → `"strict": true`).
- [x] Metadata base en `frontend/app/layout.tsx` (title + description + `<html lang="es">`).
- [x] Briefing redactado (`01-BRIEFING.md`).
- [x] Frontend scaffolded: 8 vistas dashboard (automatizaciones, checkout, dashboard,
      habitaciones, incidencias, inquilinos, inspecciones, onboarding) + auth + login.

## Pendientes de construcción (PASO 5+ — verificados como NO hechos)

- [x] Ejecutar GATE 0 (Preflight seguridad 2.0) — **PASS abreviado** (2026-07-02, `GATE-0-SEGURIDAD.md`); CSP añadida; Security matriz → `cubierta`.
- [x] Crear `robots.txt` y `sitemap.xml` (`frontend/public/`) — 2026-06-25.
- [x] Agregar security headers en `frontend/next.config.ts` — 2026-06-25.
- [x] Implementar política de privacidad (`/privacidad`) — ruta pública, SEO, PII pattern, MUST-4 — 2026-06-25.
- [x] Login mock multi-rol recruiter-friendly (MUST-1): selector de cuentas demo, password prellenada, logout visible — 2026-06-25.
- [x] Control de acceso por rol (MUST-2): `proxy.ts` + `lib/roles.ts` + incidencias filtradas por `DEMO_TECNICO_ID` — 2026-06-25.
- [x] Empty states y loading states (MUST-3): `loading.tsx` compartido + estados vacíos en habitaciones, inquilinos, incidencias, inspecciones, automatizaciones — 2026-06-25.
- [x] Aviso honestidad portafolio en automatizaciones (MUST-5): banner "Datos de demostración sandbox" — 2026-06-25.
- [x] `npm run lint` — PASS (0 errores, 0 warnings) — 2026-06-25.
- [x] `npm run build` — PASS (14 rutas, 0 errores) — 2026-06-25.

## Pendientes críticos de gobernanza (faltan artefactos canónicos)

- [x] **Registrar `tipo_cliente`** en `BRIEF.md` → `ficticio` (2026-06-25).
- [x] **Crear `CLASIFICACION-ACTIVO.md`** → primaria `04`, secundarias `06`/`15`, `confirmada`/`media` (2026-06-25).
- [x] **Crear `MATRIZ PRODUCCION FULL-STACK`** en `PLAN.md` (2026-06-25). Capas `bloqueada`: Security, Compliance, Testing.
- [x] **Crear `HERRAMIENTAS-EXTERNAS.md`** (manifiesto + gate de disponibilidad) (2026-06-25).
- [ ] **Ejecutar `WF-011`** (pasada funcional) → hoy `PENDIENTE`; requerido para cerrar GATE 9.
- [x] **Correo corporativo inicial** (Cliente Exigente Modo A) creado → GATE 1.0 contrato firmado (2026-06-25).
- [x] **Carpeta renombrada** `comunicacion-clientes/` → `comunicacion-cliente/` (singular canónica).
- [x] **Keep-alive Supabase** → **`NO_APLICA`** (Supabase eliminado 2026-07-02, Nota de Cambio N.º 01; demo 100% estática `seed.json`, no se pausa).

## Drift / Reconciliación (estado)

- [x] **GATE 3 contradictorio → RESUELTO:** cerrado `APROBADO` de forma consistente en
      `MATRIZ-BACKEND.md` v2.0.0 y `00-ARQUITECTURA-PROYECTO.md` v2.0.0 (2026-06-25).
- [x] **Stack de datos divergente (keystone) → RESUELTO:** decisión del developer = **Supabase**.
      `00-ARQUITECTURA-PROYECTO.md` y `MATRIZ-BACKEND.md` reconciliados a Supabase (Postgres + Auth);
      integraciones externas marcadas como SIMULADO (mock sandbox), honesto para `ficticio`.
- [x] **`REDO-TRACKING.md` reconciliado:** stack y rutas `ORIGIN/DESTINATION` actualizados a la ubicación real.
- [x] **Narrativa propagada a Supabase + reframe honesto (2026-06-25):** `README.md`, `docs/ARCHITECTURE.md`,
      `docs/DATABASE.md`, `01-BRIEFING.md`, `INSTRUCCIONES-CLIENTE-*.md` reescritos. **Hallazgo material:**
      el backend (Make/GAS/WhatsApp/OpenAI/Drive) descrito como "✅ Implementado" NO existe en el repo
      (`src/` solo tiene `ai/` y `automation/` vacíos). Reframe aplicado: dashboard Next.js+Supabase = real;
      backend multi-servicio = diseño/blueprint NO construido. Elimina red flag de `reclutador-exigente`.
- [x] **`PLAN.md` reconstruido** con alcance/stack real (2026-06-25); reconciliado a seed estático + auth mock local (2026-07-02).
- [x] **`comunicacion-clientes/` (plural)** — resuelto: carpeta canónica `comunicacion-cliente/` (singular) en uso.
- [x] **Arquitectura Supabase → seed estático + auth mock local (2026-07-02):** Nota de Cambio N.º 01. Supabase eliminado (innecesario + roto en local); deps removidas; 10 vulns preexistentes → 0; docs v3.0.0. `README.md`, `docs/`, `MATRIZ-BACKEND.md`, `00-ARQUITECTURA-PROYECTO.md`, `CLASIFICACION-ACTIVO.md`, `HERRAMIENTAS-EXTERNAS.md`, `BRIEF.md`, `01-BRIEFING.md`, `REDO-TRACKING.md`, `INSTRUCCIONES-CLIENTE`, `02-ARQUITECTURA-SITIO.md` reconciliados.

## Siguiente paso

**Fases 1-5 COMPLETAS** (2026-07-02). **Fase 6 (VFH) conducida — AWAITING FIRMA HUMANA.** Al retomar:

1. ~~DECISIÓN idioma del seed~~ → **RESUELTA: opción B ejecutada** (2026-07-02). Contenido del `seed.json` ahora también bilingüe (enum maps `seedContent` + `lib/i18n/seed-en.ts`). Verificado EN↔ES en navegador. Nombres propios/IDs/fechas preservados. lint 0/0, build PASS.
2. **VFH — HARD STOP humano (PENDIENTE):** los 10 ítems §6 fueron conducidos en navegador (todos funcionales). Con opción B hecha, ya no hay blemish de idioma. Falta la **frase literal de aprobación del developer** para emitir `VERIFICACION-FUNCIONAL-HUMANA.md`. No autoemitir. **Nota:** al aprobar, re-verificar rápido en vivo que los detalles §6 (que tuvieron el fix de 404 y ahora el seed i18n) siguen OK, o confiar en la conducción ya hecha + build PASS.
3. ~~CLEANUP de temporales en `frontend/`~~ — **HECHO** por el developer (2026-07-02): `frontend/DIRECCION-VISUAL.md`, `frontend/INSPECCION-VISUAL.md`, `frontend/reports/` borrados. Los canónicos viven en la raíz.
4. **Fase 7 — cadena de cierre (Opus): COMPLETA 2026-07-04.** `revision-final` PR_APPROVED + `cliente-exigente` Modo B EXITO TOTAL + `reclutador-exigente` APTO_PORTAFOLIO. **`SELLO DE APROBACION PARCIAL.md` EMITIDO.**
5. ~~REMEDIACIÓN de localización~~ → **HECHA** (README EN, rutas ES→EN + refs, comentarios EN, racional por-tech). Verificada por build + smoke.
6. **PRÓXIMO (fuera de esta sesión) — SELLO FINAL:** `vrc` (deploy Vercel de exhibición) + 2.ª VFH sobre la URL desplegada → `SELLO DE APROBACION FINAL.md`. Luego `add-to-portfolio` (admisión al portafolio público).
7. **Housekeeping menor:** borrar el dir gitignoreado `frontend/.next-stale-*` (caché movida a un lado durante el refactor; comando entregado al developer).

### VFH §6 — conducida 2026-07-02 (todos ✓, pendiente firma)
1 login admin→dashboard · 2 logout→técnico acotado · 3 dashboard KPIs+charts+feed · 4 kanban onboarding+score · 5 expediente inquilino+pestañas · 6 habitación+inventario · 7 incidencias SLA · 8 checkout wizard 4 pasos · 9 inspección slider+donut · 10 automations banner demo EN.

### Bugs cazados y corregidos durante Fase 4-6 (verificación en vivo)
- `KpiCard` RSC serialization (icon prop client-boundary).
- `signIn` doble-redirect (URL/contenido desalineados técnico).
- **Páginas detalle 404** (tenant/room/inspection): Next 16 `params` = Promise; i18n las volvió dinámicas y exponía `params.id` sin `await`. Corregidas las 3.

## Log de Sesión (Save State)
- `CURRENT_STEP=PASO_9`
- `BLOCK_ACTIVE=B9`
- `RECONCILED=2026-07-02` (regularización — Supabase→seed estático + auth mock local, docs v3.0.0)
- `GATE 1.0:` APROBADO (correo corporativo Modo A — 2026-06-25; Nota de Cambio N.º 01 — 2026-07-02)
- `GATE 1:` APROBADO (briefing — 2026-06-25)
- `GATE 3:` **APROBADO** (reconciliado a seed estático + auth mock local, 2026-07-02)
- `MUST-1 a MUST-5:` **COMPLETOS** (2026-06-25)
- `lint/build:` **PASS 0/0** · Next.js 16.2.10 · **0 vulnerabilidades** (2026-07-02)
- `Regularización Fase 1-6:` **COMPLETAS** (auth mock local, docs, toggle bilingüe + seed content, GATE 0+CSP, smoke tests, gates visuales SI/SI, **VFH aprobada por el developer 2026-07-03 → `WF-011 PASS`**); Fase 7 (cadena de cierre en Opus) pendiente
- `VFH:` **SI** (`VERIFICACION-FUNCIONAL-HUMANA.md`, firma literal del developer tras conducción en vivo en su Chrome)
- `MATRIZ FULL-STACK:` **todas las capas `cubierta`/`no_aplica`** (Security cubierta vía GATE 0; Testing cubierta vía smoke). `WF-011:` PENDIENTE (VFH, Fase 6)
- `SELLO PARCIAL:` **RE-EMITIDO 2026-07-04** (`SELLO DE APROBACION PARCIAL.md`) tras remediar las interacciones §6. Ciclo completo: 1.ª emisión → invalidado por 2.ª VFH Playwright (ítems 7/8/9 estáticos) → borrado físico → **construcción de las 4 interacciones + fixes** → 2.ª VFH 10/10 PASS firmada por el developer ("la apruebo, go") → cadena de cierre re-corrida (`revision-final` PR_APPROVED + `cliente-exigente` Modo B EXITO TOTAL `2026-07-04-05` + `reclutador-exigente` APTO_PORTAFOLIO + INSPECCION-VISUAL refrescada con pasada de contraste) → **sello re-emitido**. Reporte GATE 9 en `docs/GATE9_Revision_Reporte.md`.
- `VFH FRESCA (Playwright, 2026-07-04) — 1.ª pasada FALLA, 2.ª pasada 10/10 PASS tras remediación:` Ítems 7 (incidencias sin filtro/expansión), 8 (checkout wizard estático), 9 (inspección sin slider real) fallaban + botones muertos (onboarding Approve/Reject, checkout Confirm/Save, tenant "View contract PDF"). **Construcción en Sonnet 4.6/High:**
  - `IncidentsClient.tsx` (nuevo, client): filtro por prioridad (chips clickeables Emergency/High/Medium/Low + All) + expansión de fila con detalle (SLA target, última actualización, inquilino). `incidents/page.tsx` ahora server-prepara filas y delega.
  - `CheckoutWizard.tsx` (nuevo, client): estado de paso real 1→2→3→4→Completed, cada botón avanza (Confirm notice/inspection/settlement/Complete checkout), stepper navegable hacia atrás, "Save draft" da feedback real. `checkout/page.tsx` ahora delega + empty state añadido (gap preexistente cerrado).
  - `BeforeAfterSlider.tsx` (nuevo, client, en `components/ui/`): comparador drag real (pointer events + clip-path) + soporte teclado (ArrowLeft/Right) + `role="slider"` accesible. Reemplaza `BeforeAfterPlaceholder` estático en `inspections/[id]/page.tsx`.
  - `OnboardingBoard.tsx` (nuevo, client): Approve/Reject con estado optimista (mueve card entre columnas, stats en vivo). Botón "doc" decorativo sin función eliminado (no inventar feature falsa). `onboarding/page.tsx` delega.
  - `tenants/[id]/page.tsx`: "View contract PDF" (`href="#"` muerto) → reemplazado por divulgación honesta "Archived · Google Drive" (mismo patrón que Automations).
  - Bug cazado y corregido en la 1.ª pasada: chart Revenue mostraba mes español "Abr" → locale-aware "Apr" (`seedContent.month` + tickFormatter en `RevenueByPropertyChart.tsx`).
  - **Verificado en runtime (2.ª pasada Playwright):** filtro incidencias reduce filas (High→3) + expansión muestra detalle; checkout avanza 1→2→3→4→Completed; slider `aria-valuenow` cambia con drag (pointer events) y teclado; onboarding Approve cambia stats en vivo (2→3 approved) y card muestra "Approved"; RBAC técnico intacto (`/rooms`→redirige a `/incidents`); consola 0 errores en toda la corrida. lint 0/0, build PASS 15 rutas.
  - **PASS 10/10:** todos los ítems §6 confirmados con interacción real.
  - **Fix de contraste (sidebar role badge):** tokens de tema claro sobre fondo oscuro → tokens `sidebar-*` (10.5:1 WCAG AAA). Originó una **mejora doctrinal transversal** vía Polimatus: `inspeccion-visual` ahora mide contraste WCAG AA en runtime (`.agent/skills/inspeccion-visual/SKILL.md` + `11-HTML-CSS-Tailwind-Styling-Guide.md §D1`, doble prueba, validadores PASS, **pendiente versionar**).
  - **CIERRE 2026-07-04:** VFH firmada ("la apruebo, go") → cadena de cierre re-corrida → **`SELLO DE APROBACION PARCIAL.md` RE-EMITIDO**. Siguiente: `vrc` (deploy exhibición) + 2.ª VFH sobre URL → sello final → `add-to-portfolio`.
- `GATE 9 (2026-07-04):` ~~BLOQUEADO por idioma~~ → **RESUELTO.** El bloqueo inicial de `reclutador-exigente` (README+rutas ES) se remedió con localización a inglés: README reescrito, rutas renombradas ES→EN (`rooms`/`tenants`/`incidents`/`inspections`/`automations`/`privacy`) + todas las referencias, comentarios sweepeados, racional por-tech añadido. Verificado: build PASS 15 rutas EN, smoke (rutas 200, viejas 404, RBAC enforced, consola limpia). `REVISION-RECLUTADOR.md` = APTO_PORTAFOLIO.

## Session history
- 2026-07-04: **Cadena de cierre GATE 9 en Opus 4.8/High → SELLO PARCIAL EMITIDO.** Fixes pre-gate: login label "Portfolio demo"→"Demo — pick a role"; `/privacidad` footer+s1Body des-meta-rotulados. Metadata reconciliada: `CLASIFICACION-ACTIVO.md` `confirmada`→`final`; `PLAN.md` WF-011 PENDIENTE→PASS. `revision-final` **PR_APPROVED** + `cliente-exigente` Modo B **EXITO TOTAL** (`comunicacion-cliente/2026-07-04-04`, + valor de mercado). `reclutador-exigente` 1.ª pasada **NO_APTO_PORTAFOLIO** (idioma recruiter-facing ES: README + rutas). **Remediación de localización a inglés** (developer eligió "remediación completa"): rendx detuvo dev server (PID 29252) para liberar locks; `git mv` rutas ES→EN (habitaciones→rooms, inquilinos→tenants, incidencias→incidents, inspecciones→inspections, automatizaciones→automations, privacidad→privacy); actualizadas todas las refs (Sidebar, proxy.ts, roles.ts, actions.ts, demo-accounts.ts, tabs, sitemap/robots, Links internos); README reescrito a inglés + racional por-tech, sin meta-rótulo; comentarios sweepeados; `.next` stale movido a un lado (fix de type validator). build PASS 15 rutas EN. Smoke (preview MCP): rutas nuevas 200, viejas 404, RBAC enforced (técnico→/rooms redirige a /incidents), consola limpia, UI 100% EN. `reclutador-exigente` re-audit **APTO_PORTAFOLIO**. **`SELLO DE APROBACION PARCIAL.md` EMITIDO** + `docs/GATE9_Revision_Reporte.md`. VFH firmada 2026-07-03 re-verificada por smoke (comportamiento §6 idéntico; solo cambiaron URLs/docs/comentarios).
- 2026-06-25: Sesión de construcción — governance artifacts commit (f81ba5b), MUST-1 login multi-rol, MUST-2 RBAC via proxy.ts, MUST-3 empty/loading states, MUST-4 /privacidad, MUST-5 automatizaciones banner. lint PASS, build PASS (14 rutas).
- 2026-07-03: **Fix error log automatizaciones** (flag del developer en VFH). (1) Error de hidratación en `Progress` (base-ui `aria-valuetext` locale-dependiente server vs client) → `getAriaValueText` determinista `${val}%`; consola 0 errores. (2) seed `error_log`: `airtable:CreateRecord`→`postgres:CreateRecord` (consistente con blueprint PostgreSQL), `urgency: Media`→`Medium`. Verificado en navegador. lint 0/0, build PASS.
- 2026-07-03: **Opción B — seed content bilingüe.** Enum maps (`seedContent`: roomType/employment/paymentType/specialty/scenario) + `lib/i18n/seed-en.ts` (free-text por id: incident.description, activity.message, inspection.notes/findings/billable, payment.note). ~20 render sites actualizados. Verificado EN↔ES en navegador (feed, incidencias, inspecciones). Nombres propios/IDs/fechas preservados. lint 0/0, build PASS. Pendiente: firma VFH del developer.
- 2026-07-02: Regularización tras `/revision-inicial` (REGULARIZACION_REQUERIDA) + Plan Mode aprobado. **Fase 1:** auth reescrito a mock local por cookie (`lib/auth.ts`, `lib/demo-accounts.ts`), `lib/supabase.ts`→`lib/data.ts` (shim sobre seed, renombrado), `supabase-server.ts` borrado, deps Supabase removidas (12 paquetes), `generateStaticParams`×3→seed, `.env.example`+flag. **Remediación vulns:** 10 preexistentes (1 low/6 mod/3 high)→0 (audit fix + next 16.2.4→16.2.10 + postcss override). **Fase 2:** 16 docs reconciliados (Supabase eliminado), Nota de Cambio N.º 01, keep-alive NO_APLICA. **Toggle bilingüe EN/ES (Nota de Cambio N.º 02):** i18n zero-dep por cookie (default inglés), 11 vistas + /privacidad + chrome internacionalizados, formatters locale-aware, `<html lang>` dinámico. lint PASS, build PASS (15 rutas), sin deps nuevas. Pendiente developer: borrar `lib/supabase.ts` huérfano (denegado al agente).
