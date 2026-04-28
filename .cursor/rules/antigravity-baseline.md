# Antigravity Cursor Project Baseline

## Scope

Aplica a este proyecto dentro de `C:\Users\g-cub\Antigravity projects`.

## Regla de precedencia

1. Instruccion explicita del developer en la sesion actual.
2. `GEMINI.md` local del proyecto.
3. `AGENTS.md` local del proyecto (si existe y aplica al agente activo).
4. Baseline global:
   - `C:\Users\g-cub\Antigravity projects\neuronas\GEMINI.md`
   - `C:\Users\g-cub\Antigravity projects\neuronas\00-WORKFLOW-MAESTRO.md`
   - `C:\Users\g-cub\Antigravity projects\procedimientos\WORKSPACE-SOURCE-OF-TRUTH.md`

## Guardrails operativos

- Usar flujo broker-first para operaciones sensibles con:
  - `C:\Users\g-cub\Antigravity projects\procedimientos\scripts\security\invoke-safe-command.ps1`
- No exponer secretos ni contenido `.env*`.
- Mantener trazabilidad en `QUE-FALTA.md`.
- Antes de cierre final, correr:
  - `check_pre_cierre_obligatorio.ps1`

## Enforcement balanceado

- Permitido fast-lane read-only para tareas `low-risk/local`.
- Requerido gate humano para `gh`, `vercel`, deploy, borrados o cambios irreversibles.
