# Herramientas Externas — PropertyOps AI

> Manifiesto **editable** de herramientas externas. PROVISIONAL en Plan Mode/Paso 3,
> CONFIRMADO en GATE 3, vivo durante construcción. **Anti-loop:** antes de que un paso
> dependa de una herramienta, su estado debe estar declarado aquí. Sin disponibilidad =
> loop de bloqueo → `asesor`/connector/secret Zero-Knowledge o `BLOQUEADO` en `QUE-FALTA.md`.
>
> **Seguridad:** sin secretos. Solo metadata no sensible (nombres de variable, no valores).
> Estado determinado presence/availability-only, nunca leyendo `.env*`.

## Fuentes que este manifiesto referencia (no duplica)

- **Registro global:** `doctrina/REGISTRO-HERRAMIENTAS-EXTERNAS.md`.
- **MATRIZ-BACKEND.md** v2.0.0: proveedores por rubro (Supabase real; resto SIMULADO).
- **Capacidades del entorno:** MCPs/connectors pertenecen al entorno; aquí solo su uso en este proyecto.

## Leyenda de estado de integracion

- `disponible` — instalada y autenticada; lista para usar.
- `requiere-auth` — presente sin sesión/credencial válida; gate `asesor` (Zero-Knowledge).
- `no-integrado` — sin MCP/connector/CLI en el entorno.
- `faltante` — requerida por el plan pero ausente; bloquea el paso dependiente.
- `bloqueado` — gate abierto en `QUE-FALTA.md`.
- `no-aplica` — listada para descartar explícitamente.

## Manifiesto

| Herramienta | Rubro | Propósito en el proyecto | Fase/Gate | Estado | Superficie sensible | Fallback / alternativa | Recurso (no secreto) |
|---|---|---|---|---|---|---|---|
| **Supabase** | db/auth | Capa de datos real (Postgres) + Auth multi-rol del dashboard | Paso 3 / GATE 3 | `requiere-auth` | PII (inquilinos), RLS, sesiones | Postgres local / seed estático | MCP `supabase`; proyecto Supabase free (sandbox) |
| **Vercel** | deploy | Hosting objetivo del frontend Next.js | Paso 10 / deploy | `requiere-auth` | URL pública | `npm run build` local + `rend` | MCP `vercel` |
| **GitHub** | vcs | Repo privado `propertyops-ai` (versionado) | continuo | `disponible` | — | — | MCP `github`; repo existente |
| Make (Integromat) | orquestación | Arquitectura objetivo (no construida); simulado como datos | — | `no-aplica` | — | datos seed en Supabase | `docs/ARCHITECTURE.md` |
| Google Apps Script | lógica backend | Arquitectura objetivo (no construida); simulado | — | `no-aplica` | — | datos seed en Supabase | `docs/ARCHITECTURE.md` |
| WhatsApp Business Cloud | comms | Arquitectura objetivo (no construida); simulado | — | `no-aplica` | mensajes reales | datos seed en Supabase | `docs/ARCHITECTURE.md` |
| OpenAI (GPT-4o / mini) | ia | Arquitectura objetivo (scoring/visión); simulado | — | `no-aplica` | costo, datos | scores/resultados seed | `docs/ARCHITECTURE.md` |
| Google Drive | storage | Arquitectura objetivo (expedientes); simulado | — | `no-aplica` | PII docs | Supabase Storage (objetivo) | `docs/ARCHITECTURE.md` |

> **Nota:** las herramientas marcadas `no-aplica` corresponden al **diseño objetivo no implementado** en este build sandbox. No se integran ni se requieren para la demo de portafolio; se documentan para trazabilidad del diseño. Si se decide construir el backend (vía expansión de alcance o `get-real`), pasan a `requiere-auth` y se abre su gate.

## Keep-alive Supabase (gate duro de portafolio)

Como `tipo_cliente: ficticio` con Supabase, aplica `doctrina/reglas/db-ficticio-supabase-pooling.md`:
- [ ] Schema dedicado (schema-pooling) configurado.
- [ ] Keep-alive (cron GitHub Action cada 3-5 días) configurado y verificado — **bloquea admisión a portafolio** sin esto.

## Gate de disponibilidad (checklist re-ejecutable)

Antes de cerrar GATE 3 y antes de cualquier paso que dependa de una herramienta:

- [x] Toda herramienta del plan está listada con su `Estado`.
- [ ] Ninguna requerida queda `faltante`/`bloqueado` sin entrada en `QUE-FALTA.md`.
- [ ] Las `requiere-auth` (Supabase, Vercel) tienen gate `asesor` registrado antes de usarse en vivo; no se asumen activas.
- [x] Las `no-aplica` (backend objetivo) descartadas explícitamente.
