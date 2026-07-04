# VERIFICACIÓN FUNCIONAL HUMANA (VFH)

**Proyecto:** PropertyOps AI (CAT-01-S03)
**Fecha:** 2026-07-04
**Resultado:** SI
**tipo_cliente:** ficticio (portafolio) · **renderizable:** SI

> Esta VFH (2026-07-04, conducida con Playwright) **supersede** la firma previa del 2026-07-03. Aquella se dio sobre una versión donde varias interacciones §6 estaban implementadas como placeholders estáticos; una segunda VFH con Playwright (el motivo de correr más de una) lo destapó, se remediaron las interacciones, y esta VFH verifica el activo genuinamente funcional.

---

## Confirmación del developer

El developer observó la evidencia de la conducción Playwright (screenshots por ítem + fixes) y dio su **aprobación literal expresa** en el chat:

> "la apruebo, go"

## Conducción (Playwright, agente conduce → developer observa y aprueba)

El agente ejerció cada ítem §6 con **clic/drag real + aserción de resultado funcional**, presentando screenshots consecutivos (en `reports/vfh/`, referenciados abajo). Separación de roles respetada: el agente condujo y produjo evidencia; el developer observó y dio la bendición final.

## Lista §6 ejercida — 10/10 PASS

| # | Ítem §6 del correo corporativo | Resultado | Evidencia |
|---|---|---|---|
| 1 | Login admin (selector demo + password prellenada) → dashboard | ✅ | `vfh-01-login-admin.png` |
| 2 | Logout → login técnico → vista acotada + RBAC | ✅ | (RBAC: técnico→`/rooms` redirige a `/incidents`) |
| 3 | Dashboard: KPIs + gráfico de tendencia + activity feed | ✅ | `vfh-03-dashboard.png` |
| 4 | Kanban onboarding con score por card | ✅ | `vfh-04-onboarding-approve.png` |
| 5 | Expediente inquilino con pestañas (resumen/pagos/incidencias/docs) | ✅ | `vfh-05-tenant-tabs.png` |
| 6 | Habitaciones + detalle de inventario | ✅ | (Room 101 + inventory) |
| 7 | Incidencias: semáforo SLA + **filtro por prioridad + expansión de fila** | ✅ | `vfh-07-incidents-filter-expand.png` |
| 8 | Wizard de checkout: **4 pasos que avanzan** (aviso→inspección→cargos→cierre) | ✅ | `vfh-08-checkout-completed.png` |
| 9 | Inspección: **slider antes/después funcional** + donut de AI score | ✅ | `vfh-09-inspection-slider.png` |
| 10 | Monitor de automatizaciones identificado como datos demo (banner honestidad) | ✅ | (banner "Sandbox demonstration data") |

## Interacciones remediadas y verificadas en runtime (esta sesión)

- **Incidencias (ítem 7):** filtro por prioridad reduce filas (High → 3 filas: INC-005/003/001); expansión de fila muestra detalle (SLA target 24h, última actualización, inquilino). Antes: tabla estática sin filtro ni expansión.
- **Checkout (ítem 8):** wizard avanza Step 1→2→3→4→"Checkout completed" con clics reales; stepper navegable hacia atrás; "Save draft" da feedback. Antes: congelado en Step 3.
- **Inspección (ítem 9):** slider comparativo real — `aria-valuenow` cambia con drag (pointer events, 60→20%) y teclado (ArrowLeft/Right). Antes: 2 divs placeholder estáticos.
- **Onboarding (ítem 4):** Approve/Reject con estado optimista — al aprobar a María Flores, stats pasan de "2 approved" a "3 approved", la card muestra "Approved", columna New Lead → 0. Antes: botones muertos sin `onClick`.
- **Botón muerto tenant:** "View contract PDF" (`href="#"`) → reemplazado por divulgación honesta "Archived · Google Drive".

## Lente de reclutador (runtime, portafolio)

- Controles reaccionan (clic/drag real + estado observado); sin botones muertos restantes.
- Sin errores rojos en consola (0 errores en toda la corrida).
- Estado coherente entre vistas; empty states presentes (incl. checkout vacío añadido); gating de rol bloquea en la UI con aviso ("Scoped view").
- Logout visible; login sin fricción (selector + prefill).
- Bilingüe EN/ES (inglés por defecto).

## Bugs cazados y corregidos durante la conducción de la VFH

- Chart "Revenue by property" mostraba mes español **"Abr"** → locale-aware **"Apr"** (EN) / "Abr" (ES) vía `seedContent.month` + `tickFormatter`.
- Badge de rol del sidebar casi invisible (tokens de tema claro sobre fondo oscuro) → tokens `sidebar-*`; contraste verificado **10.5:1** (WCAG AAA). *(Este bug originó además una mejora doctrinal transversal: `inspeccion-visual` ahora mide contraste en runtime.)*

## Estado técnico al momento de la firma

- `npm run lint` PASS (0/0) · `npm run build` PASS (15 rutas) · `npm audit` = 0 vulnerabilidades.
- `NEXT_PUBLIC_DEMO_AUTH=enabled` para el login mock local.
- 4 nuevos client components (`IncidentsClient`, `CheckoutWizard`, `BeforeAfterSlider`, `OnboardingBoard`); RBAC re-verificado intacto tras el refactor.

## Regla VFH

Esta confirmación NO se autoemitió ni se infirió de tests/gates: proviene de la frase literal del developer tras observar la conducción Playwright del activo. `WF-011` = **PASS**.
