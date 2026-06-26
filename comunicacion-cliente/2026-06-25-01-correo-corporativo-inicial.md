# Correo Corporativo Inicial — PropertyOps AI

> **Generado por:** Skill `/cliente-exigente` Modo A
> **Fecha:** 2026-06-25
> **Tipo de cliente:** `ficticio`
> **Modo ficticio:** `portafolio funcional sandbox-first`
> **Estado:** `VIGENTE — contrato vinculante`
>
> Nota de contexto: este contrato se emite en una **retoma** de un proyecto ya parcialmente
> construido (dashboard Next.js + Supabase). Codifica el estándar exigible del entregable de
> portafolio. La capa de automatización multi-servicio (Make/GAS/WhatsApp/OpenAI/Drive) se
> contrata explícitamente como **arquitectura de diseño representada/simulada**, NO como
> integraciones vivas (decisión de alcance registrada 2026-06-25, opción "reframe honesto").

---

Estimados responsables de PropertyOps AI:

He revisado el brief del administrador de propiedades. El encargo es claro en su dolor: hoy todo es manual (WhatsApp, hojas de cálculo, carpetas en Drive) y se pierden pagos, contexto e incidencias. Como cliente exigente, no aceptaré un tablero "bonito pero hueco": exijo una **mesa de control operativa creíble**, navegable de punta a punta, que un evaluador externo pueda recorrer sin tropezar con un solo cabo suelto. A continuación fijo el contrato.

## §1. Objetivos y Requisitos

**Objetivo de negocio.** Centralizar el ciclo completo de gestión de habitaciones en alquiler —de la captación del candidato a la devolución del depósito— en un único panel operativo que reduzca el caos manual y dé visibilidad inmediata de ocupación, cobros e incidencias.

**Requisitos funcionales (vinculantes):**
1. Dashboard ejecutivo con KPIs reales sobre los datos: ocupación, ingresos del mes, incidencias abiertas, score medio de leads, tendencia temporal y activity feed.
2. Pipeline de onboarding de candidatos (Kanban) con score visible y estados (auto-aprobado / revisión / rechazado / contrato).
3. Gestión de inquilinos con expediente individual: resumen, pagos, incidencias y documentos.
4. Gestión de habitaciones por propiedad, con estado (ocupada/libre/mantenimiento) e inventario por habitación.
5. Gestión de incidencias con semáforo de SLA, filtros y detalle expandible.
6. Flujo de checkout (salida) guiado por pasos: aviso → inspección → cargos → cierre y devolución de depósito.
7. Inspecciones visuales con comparativa antes/después y puntuación de estado.
8. Monitor de automatizaciones que muestre el estado de los escenarios y un registro de errores (representado con datos de demostración).
9. **Acceso multi-rol:** administrador/arrendador (visión completa) y técnico de mantenimiento (acceso acotado a las incidencias que le corresponden).

**Requisitos no funcionales (vinculantes):** rendimiento web fluido, estados vacíos y de carga en cada vista, coherencia visual total, cero contenido de desarrollo visible (TODO/FIXME/placeholder), accesibilidad básica (etiquetado, contraste, `prefers-reduced-motion`).

### Suficiencia del Brief por Categoría

Resultado: `COMPLETADO_POR_CLIENTE_EXIGENTE`

El brief define objetivo, audiencia, funcionalidad y dolor con claridad suficiente. Vacíos críticos que, por ser `tipo_cliente: ficticio`, completo y elevo a **requisitos contractuales**:
- **Acceso de reclutador sin fricción:** el login no estaba especificado para evaluación de portafolio.
- **Patrón de privacidad de PII:** el brief maneja PII (nombres, emails, teléfonos, DNI) sin mencionar protección.
- **Estados vacíos / error:** no especificados; obligatorios para credibilidad operativa.
- **Acotación real del rol técnico:** el brief lo pide ("ve las incidencias que le corresponden") pero no lo detalla; lo fijo como control de acceso por rol.

### Gap de Producto por Categoría

Categorías: `04-Aplicaciones-web-empresariales` (primaria), `06-Dashboards-analitica-BI`, `15-Prototipos-MVP-validacion`.

**MUST (entran al contrato y al `PLAN.md` automáticamente — ficticio):**
- `MUST-1` **Login mock multi-rol recruiter-friendly:** selector de cuentas demo al clic en el campo usuario, contraseña demo prellenada, etiqueta de rol+destino por opción, y **logout visible y persistente** que permita re-ingresar con otro rol. Login bloqueado en producción (`NODE_ENV`).
- `MUST-2` **Control de acceso por rol:** el técnico de mantenimiento solo ve sus incidencias asignadas; el administrador ve todo. Sin fuga de vistas entre roles.
- `MUST-3` **Estados vacíos y de carga** en las 8 vistas (sin pantallas en blanco ni spinners infinitos).
- `MUST-4` **Patrón de privacidad de PII:** página `/privacidad`, consentimiento explícito no pre-marcado donde haya captura, aviso de retención. PII de demo es ficticia, pero el patrón debe estar presente.
- `MUST-5` **Honestidad de portafolio:** la UI y los docs deben dejar claro, sin engañar, qué es dato simulado; el monitor de automatizaciones no puede presentarse como integración viva real.

**SHOULD (mejoran calidad; diferibles con razón):**
- `SHOULD-1` Responsive/mobile usable del panel.
- `SHOULD-2` Skeletons de carga en tablas y gráficos.
- `SHOULD-3` Búsqueda/filtros persistentes en listados largos.

**COULD (fuera de alcance base):**
- `COULD-1` Exportación CSV/PDF de KPIs.
- `COULD-2` Modo oscuro.

### Propuesta de ampliación para cliente real

Estado: `NO_APLICA` (cliente ficticio; los MUST entran directo al contrato).

---

## §2. Experiencia de Usuario (UX)

**Audiencia:** administrador/arrendador (uso diario, visión ejecutiva) y técnico de mantenimiento (uso acotado). Evaluador real: reclutador técnico.

**Flujos críticos:** (1) entrar → ver salud del negocio en el dashboard; (2) abrir un inquilino y reconstruir su historial completo; (3) triar una incidencia por SLA; (4) recorrer un checkout de salida; (5) cambiar de rol vía logout/login.

**Dirección visual:** estética "mesa de control" profesional, paleta teal/petróleo ya presente, densidad de información alta pero legible, jerarquía clara, microinteracciones sobrias. Tono de marca: serio, operativo, confiable. La dirección visual aprobada debe materializarse/verificarse con la herramienta visual canónica del entorno (Figma MCP si está disponible, sujeto a `asesor`), y registrarse en `DIRECCION-VISUAL.md`.

---

## §3. Arquitectura y Stack

**Construido (real, contratado):** Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + Recharts; **Supabase (PostgreSQL + Auth)** como capa de datos y autenticación; datos de demostración sembrados. Deploy objetivo: Vercel.

**Diseño objetivo (representado/simulado, NO construido en este build):** orquestación Make, lógica Google Apps Script, WhatsApp Business, OpenAI (scoring/visión), Google Drive. Documentado en `docs/ARCHITECTURE.md` como blueprint. **No se exige construirlo** para cerrar este contrato; sí se exige que esté representado con honestidad.

**Gate duro de portafolio:** por usar Supabase free en `ficticio`, exijo **keep-alive** (cron) + schema-pooling configurados antes de admisión a portafolio (`doctrina/reglas/db-ficticio-supabase-pooling.md`).

---

## §4. Calidad, Riesgos y Entregables

**Criterios de calidad:** cero errores de lint/build, cero warnings, cero `TODO/FIXME` sin ticket, cero contenido de desarrollo visible, coherencia visual total, estados vacíos/carga/error presentes.

**Riesgos:** (1) **honestidad** — el mayor riesgo de este activo es vender backend inexistente; mitigado por el reframe; (2) **PII** — patrón de privacidad obligatorio aunque la data sea ficticia; (3) **pausa de Supabase free** — mitigada por keep-alive; (4) **roles** — fuga de vistas entre admin y técnico.

**Entregables:** dashboard navegable end-to-end, `DIRECCION-VISUAL.md` (`Resultado: SI`), `INSPECCION-VISUAL.md` (`Resultado: SI`, renderizable), `revision-final` aprobado, `reclutador-exigente` `APTO_PORTAFOLIO`, VFH humana registrada.

**No funcionales proporcionales:** cache/CDN = Vercel por defecto (sin estrategia custom, justificado en MATRIZ); scaling/observability/error-tracking/recovery = `NO APLICA` por ser demo sandbox (justificado en `PLAN.md`); costos = free tier + keep-alive.

---

## §5. Clasificación de Activo e Implicaciones de Seguridad

- **Categoría primaria:** `04-Aplicaciones-web-empresariales`.
- **Secundarias:** `06-Dashboards-analitica-BI`, `15-Prototipos-MVP-validacion`.
- **Superficies:** `auth`, `roles`, `pii`, `data`. `renderizable: SI`.
- **Controles que activa:** sesión segura (Supabase Auth), separación de privilegios por rol + RLS por tabla, patrón de protección de PII, login bloqueado en producción, secretos por variables de entorno (Zero-Knowledge, nunca en código).
- Fuente y detalle: `CLASIFICACION-ACTIVO.md`. Cualquier ajuste de categoría se refleja allí.

---

## §6. Pruebas de Aceptación del Tester Humano (lista VFH)

> Fuente única del checklist de la VFH. Evidencia aceptable: `sandbox` / `demo visual` con datos ficticios.

| # | Acción del tester | Condición inicial | Resultado observable esperado | Aprueba / Falla |
|---|---|---|---|---|
| 1 | Abrir `/login`, desplegar el selector de cuentas demo y entrar como **administrador** (contraseña prellenada) | App levantada, sin sesión | Acceso concedido; aterriza en el dashboard del administrador | Falla si no hay selector, no hay contraseña prellenada o no entra |
| 2 | Pulsar **logout** y volver a entrar como **técnico de mantenimiento** | Sesión de admin activa | Logout visible termina sesión → `/login`; re-login como técnico aterriza en su vista acotada | Falla si no hay logout visible o si el técnico ve vistas de admin |
| 3 | Revisar el **dashboard ejecutivo** | Sesión admin, datos seed | KPIs con valores, gráfico de tendencia y activity feed renderizados (no vacío/roto) | Falla si hay KPIs en blanco o gráficos rotos |
| 4 | Abrir el **Kanban de onboarding** | Sesión admin | Leads distribuidos en columnas con score visible por tarjeta | Falla si no hay leads o no se ve el score |
| 5 | Abrir el **expediente de un inquilino** y recorrer sus pestañas | Sesión admin | Resumen + pagos + incidencias + documentos del inquilino visibles | Falla si alguna pestaña está vacía/rota |
| 6 | Entrar a **habitaciones**, abrir una habitación y ver su inventario | Sesión admin | Grid por propiedad + checklist de inventario de la habitación | Falla si no carga el detalle |
| 7 | En **incidencias**, filtrar por prioridad y expandir una fila | Sesión admin | Semáforo SLA visible; filtro responde; fila expande detalle | Falla si el filtro no responde o no expande |
| 8 | Recorrer el **wizard de checkout** de una salida | Sesión admin | Los 4 pasos (aviso → inspección → cargos → cierre) avanzan con datos | Falla si un paso se rompe o no avanza |
| 9 | Abrir una **inspección** y usar el slider antes/después + ver el donut de score | Sesión admin | Slider comparativo funciona; donut de AI score renderiza | Falla si el slider o el donut no funcionan |
| 10 | Abrir el **monitor de automatizaciones** y confirmar que se identifica como datos de demostración | Sesión admin | Estados de escenarios + log de errores visibles, **sin presentarse como integración viva real** | Falla si engaña sobre datos reales o si está vacío |

---

**Firmado y aceptado como contrato vinculante:** `Sí`

Quedo atento. Cualquier desviación de este contrato deberá registrarse como nota de cambio numerada en `comunicacion-cliente/` antes de implementarse.

**Cliente Exigente — Antigravity Projects**
2026-06-25
