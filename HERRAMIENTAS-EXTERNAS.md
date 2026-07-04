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
- **MATRIZ-BACKEND.md** v3.0.0: proveedores por rubro (seed estático + auth mock local reales; resto SIMULADO).
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
| **Vercel** | deploy | Hosting objetivo del frontend Next.js | Paso 10 / deploy | `requiere-auth` | URL pública | `npm run build` local + `rend` | MCP `vercel` |
| **GitHub** | vcs | Repo privado `propertyops-ai` (versionado) | continuo | `disponible` | — | — | MCP `github`; repo existente |
| Make (Integromat) | orquestación | Arquitectura objetivo (no construida); simulado como datos | — | `no-aplica` | — | datos en seed.json | `docs/ARCHITECTURE.md` |
| Google Apps Script | lógica backend | Arquitectura objetivo (no construida); simulado | — | `no-aplica` | — | datos en seed.json | `docs/ARCHITECTURE.md` |
| WhatsApp Business Cloud | comms | Arquitectura objetivo (no construida); simulado | — | `no-aplica` | mensajes reales | datos en seed.json | `docs/ARCHITECTURE.md` |
| OpenAI (GPT-4o / mini) | ia | Arquitectura objetivo (scoring/visión); simulado | — | `no-aplica` | costo, datos | scores/resultados seed | `docs/ARCHITECTURE.md` |
| Google Drive | storage | Arquitectura objetivo (expedientes); simulado | — | `no-aplica` | PII docs | referencias en seed.json | `docs/ARCHITECTURE.md` |

> **Nota:** las herramientas marcadas `no-aplica` corresponden al **diseño objetivo no implementado** en este build sandbox. No se integran ni se requieren para la demo de portafolio; se documentan para trazabilidad del diseño. Si se decide construir el backend (vía expansión de alcance o `get-real`), pasan a `requiere-auth` y se abre su gate.

## Keep-alive Supabase (gate duro de portafolio) — `NO_APLICA`

**Supabase eliminado** (Nota de Cambio N.º 01, 2026-07-02). Sin base de datos viva no hay pausa
por inactividad que mitigar, así que `doctrina/reglas/db-ficticio-supabase-pooling.md` **no aplica**:
- [x] Sin Supabase → sin schema-pooling requerido.
- [x] Sin Supabase → sin keep-alive requerido. La demo es 100% estática (`seed.json`), no se pausa.

## Gate de disponibilidad (checklist re-ejecutable)

Antes de cerrar GATE 3 y antes de cualquier paso que dependa de una herramienta:

- [x] Toda herramienta del plan está listada con su `Estado`.
- [x] Ninguna requerida queda `faltante`/`bloqueado` sin entrada en `QUE-FALTA.md`.
- [ ] La única `requiere-auth` (Vercel) tiene gate `asesor` registrado antes de usarse en vivo; no se asume activa.
- [x] Las `no-aplica` (backend objetivo) descartadas explícitamente.
