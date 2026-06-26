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

- **Estado:** `confirmada`
- **Última actualización:** 2026-06-25 — creada en retoma `/quefalta` con evidencia de código (post GATE 3 reconciliado)

> Nota: aún no `final` porque restan artefactos de GATE (correo corporativo Modo A, `MATRIZ PRODUCCION FULL-STACK` / `WF-011`). Se promueve a `final` cuando esos cierren.

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
estado_clasificacion: "confirmada"
```

---

## Justificación de la clasificación

**Primaria — 04 (Aplicaciones web empresariales):** PropertyOps AI es una web app con autenticación (Supabase Auth), roles diferenciados (administrador/arrendador y técnico de mantenimiento), área privada y flujos operativos internos (onboarding, inquilinos, habitaciones, incidencias, checkout, inspecciones). Encaja literalmente con la definición de la categoría 04 ("SaaS, intranets, plataformas con auth"). Evidencia: `BRIEF.md` (roles y dashboard), `frontend/app/(dashboard)/` (8 vistas con auth), `frontend/lib/supabase*.ts`.

**Secundaria — 06 (Dashboards analítica BI):** existe una superficie real de visualización de KPIs (ocupación, ingresos, incidencias, scores) con Recharts. Agrega controles de exactitud/freshness/permisos de datos.

**Secundaria — 15 (Prototipos MVP validación):** el activo es una **demo de portafolio sandbox-first**; el backend multi-servicio (Make/GAS/WhatsApp/OpenAI/Drive) está **simulado como datos en Supabase, no implementado**. Esta secundaria hace explícita la deuda y los límites de producción (no es producto operativo real). Evidencia: `MATRIZ-BACKEND.md` v2.0.0, `src/` vacío.

**Por qué NO 05 (Integraciones APIs) ni 01 (Automatizaciones):** aunque el diseño objetivo las contempla, no hay integraciones ni automatizaciones vivas construidas; declararlas crearía superficie de auditoría inexistente. Se reconsiderarán solo si se construye el backend (ver `get-real`/expansión de alcance).

---

## Implicaciones de seguridad y protocolos

- **Categoría 04 → superficies `auth` + `roles`:** control de sesión (Supabase Auth, SSR con `@supabase/ssr`), separación de privilegios por rol, RLS por tabla en Supabase. Verificar en GATE 0 y revision-final perfil 04.
- **Superficie `pii`:** los datos de inquilinos incluyen nombres, emails, teléfonos y DNI (PII sensible). Aplica protección de datos: política de privacidad (`/privacidad`), consentimiento explícito no pre-marcado, aviso de retención. **Pendiente** (ver `QUE-FALTA.md`). En `tipo_cliente: ficticio` la PII es **ficticia** (seed), pero el patrón de protección debe estar presente para exhibición.
- **Categoría 15 → límites de producción:** el activo NO autoriza producción real, datos reales ni claims de compliance. Cierre = exhibición pública verificada con datos ficticios (`revision-final` ficticio).
- **Login mock multi-rol (portafolio):** debe ofrecer selector de cuentas demo + contraseña prellenada + logout visible, y estar bloqueado en producción (`NODE_ENV`). Verificable por `reclutador-exigente`.

Superficies de producción NO declaradas (no aplican en este build sandbox): `public_api`, `payments` (solo registro contable, sin pasarela), `high_traffic`, `cdn_cache`.

---

## Historial de cambios de clasificación

| Fecha | Paso | Cambio | Motivo |
|---|---|---|---|
| 2026-06-25 | Retoma `/quefalta` | Clasificación creada como `confirmada`/`media` | Artefacto ausente detectado en retoma; clasificado con evidencia de código real (la v1 del proyecto nunca lo creó) |
