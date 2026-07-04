# CLASIFICACIÓN DE ACTIVO — PropertyOps AI

> **Fuente oficial:** `doctrina/neuronas/00-TAXONOMIA-ACTIVOS-DIGITALES.md` (20 categorías oficiales).
> **Para qué sirve:** la categoría del activo determina los perfiles `revision-final`, los controles de GATE 9 y los protocolos de seguridad que aplican a TODO el proyecto.
> **Este es el hogar canónico** del bloque de metadata de clasificación. `00-ARQUITECTURA-PROYECTO.md` solo lo referencia; no lo duplica.

---

## Ciclo de vida del artefacto

| Etapa | Paso del Playbook | `estado_clasificacion` | Confianza esperada |
|---|---|---|---|
| Provisional | Paso 0.5 (Scaffold) | `provisional` | `baja` |
| Confirmada | Paso 1 — GATE 1 | `confirmada` | `media` o `alta` |
| Final | Paso 3 — GATE 3 | `final` | `alta` |

**Regla bloqueante:** no se autoriza cierre, deploy, publicación ni entrega con `estado_clasificacion` distinto de `final` o con `confianza_clasificacion: baja`.

---

## Estado de la clasificación

- **Estado:** `final`
- **Última actualización:** 2026-07-04 — promovida a `final` en cierre GATE 9 (`revision-final`). Los artefactos que bloqueaban la promoción cerraron: correo corporativo Modo A (2026-06-25), `MATRIZ PRODUCCION FULL-STACK` con todas las capas `cubierta`/`no_aplica`, y `WF-011 PASS` vía VFH firmada por el developer (2026-07-03).

> Nota: promoción `confirmada`→`final` ejecutada según la regla pre-declarada de este mismo archivo (se promueve cuando cierran correo Modo A + MATRIZ/WF-011). `confianza_clasificacion` se mantiene en `media` (honesto: primaria 04 confirmada con evidencia de código; secundarias 06/15 inferidas del diseño sandbox, no productivas).

---

## Metadata oficial (bloque obligatorio)

```yaml
categoria_activo_primaria: "04-Aplicaciones-web-empresariales"
categorias_activo_secundarias: ["06-Dashboards-analitica-BI", "15-Prototipos-MVP-validacion"]
renderizable: "SI"   # web UI con dashboard multi-rol → VFH via rend + inspeccion visual
superficies_detectadas: ["auth", "roles", "pii", "data"]
confianza_clasificacion: "media"
evidencia_clasificacion: ["BRIEF.md", "frontend/lib/types.ts", "frontend/app/(dashboard)/", "00-ARQUITECTURA-PROYECTO.md", "MATRIZ-BACKEND.md"]
revision_final_perfiles_requeridos: ["core", "04", "06", "15"]
estado_clasificacion: "final"
```

---

## Justificación de la clasificación

**Primaria — 04 (Aplicaciones web empresariales):** PropertyOps AI es una web app con autenticación (sesión mock local por cookie, gateada por `NEXT_PUBLIC_DEMO_AUTH`), roles diferenciados (administrador/arrendador y técnico de mantenimiento), área privada y flujos operativos internos (onboarding, inquilinos, habitaciones, incidencias, checkout, inspecciones). Encaja literalmente con la definición de la categoría 04 ("SaaS, intranets, plataformas con auth"). Evidencia: `BRIEF.md` (roles y dashboard), `frontend/app/(dashboard)/` (8 vistas con auth), `frontend/lib/auth.ts`, `frontend/lib/roles.ts`.

**Secundaria — 06 (Dashboards analítica BI):** existe una superficie real de visualización de KPIs (ocupación, ingresos, incidencias, scores) con Recharts. Agrega controles de exactitud/freshness/permisos de datos.

**Secundaria — 15 (Prototipos MVP validación):** el activo es una **demo de portafolio sandbox-first**; el backend multi-servicio (Make/GAS/WhatsApp/OpenAI/Drive) está **representado como datos estáticos en `seed.json`, no implementado**. Esta secundaria hace explícita la deuda y los límites de producción (no es producto operativo real). Evidencia: `MATRIZ-BACKEND.md`, `src/` vacío.

**Por qué NO 05 (Integraciones APIs) ni 01 (Automatizaciones):** aunque el diseño objetivo las contempla, no hay integraciones ni automatizaciones vivas construidas; declararlas crearía superficie de auditoría inexistente. Se reconsiderarán solo si se construye el backend (ver `get-real`/expansión de alcance).

---

## Implicaciones de seguridad y protocolos

- **Categoría 04 → superficies `auth` + `roles`:** control de sesión (mock local por cookie `httpOnly`, gate `NEXT_PUBLIC_DEMO_AUTH`), separación de privilegios por rol aplicada en `proxy.ts` (`isPathAllowed`, técnico → `/incidencias`). Sin RLS: no hay base de datos viva; los datos son `seed.json` estático de solo lectura. Verificar en GATE 0 y revision-final perfil 04.
- **Superficie `pii`:** los datos de inquilinos incluyen nombres, emails, teléfonos y DNI (PII sensible). Aplica protección de datos: política de privacidad (`/privacidad`), consentimiento explícito no pre-marcado, aviso de retención. **Pendiente** (ver `QUE-FALTA.md`). En `tipo_cliente: ficticio` la PII es **ficticia** (seed), pero el patrón de protección debe estar presente para exhibición.
- **Categoría 15 → límites de producción:** el activo NO autoriza producción real, datos reales ni claims de compliance. Cierre = exhibición pública verificada con datos ficticios (`revision-final` ficticio).
- **Login mock multi-rol (portafolio):** debe ofrecer selector de cuentas demo + contraseña prellenada + logout visible, y estar bloqueado en producción (`NODE_ENV`). Verificable por `reclutador-exigente`.

Superficies de producción NO declaradas (no aplican en este build sandbox): `public_api`, `payments` (solo registro contable, sin pasarela), `high_traffic`, `cdn_cache`.

---

## Historial de cambios de clasificación

| Fecha | Paso | Cambio | Motivo |
|---|---|---|---|
| 2026-06-25 | Retoma `/quefalta` | Clasificación creada como `confirmada`/`media` | Artefacto ausente detectado en retoma; clasificado con evidencia de código real (la v1 del proyecto nunca lo creó) |
| 2026-07-02 | Regularización (Fase 1-2) | Capa auth Supabase → mock local por cookie; capa datos = `seed.json` estático (sin DB viva) | Nota de Cambio N.º 01: Supabase innecesario y roto en local; elimina gate keep-alive. Sin cambio de categoría |
| 2026-07-04 | Cierre GATE 9 (`revision-final`) | `estado_clasificacion` `confirmada`→`final` | Artefactos que bloqueaban la promoción cerraron: correo Modo A, MATRIZ full-stack `cubierta`/`no_aplica`, `WF-011 PASS` vía VFH firmada (2026-07-03) |
