# GEMINI.md - Project Baseline (Antigravity)

## Objetivo

Alinear este proyecto con el baseline operativo y de seguridad de Antigravity, preservando overrides locales cuando el proyecto lo requiera.

## Referencias obligatorias

- `C:\Users\g-cub\Antigravity projects\neuronas\GEMINI.md`
- `C:\Users\g-cub\Antigravity projects\neuronas\00-WORKFLOW-MAESTRO.md`
- `C:\Users\g-cub\Antigravity projects\neuronas\00-INDEX-MAESTRO.md`
- `C:\Users\g-cub\Antigravity projects\procedimientos\experto en seguridad de antigravity 2.0.md`
- `C:\Users\g-cub\Antigravity projects\procedimientos\WORKSPACE-SOURCE-OF-TRUTH.md`

## Reglas de operacion

1. No exponer secretos ni credenciales en chat, codigo o logs.
2. Mantener `.env*` fuera de git.
3. Usar broker de comandos para acciones sensibles.
4. Actualizar `QUE-FALTA.md` en cada cierre de bloque.
5. Ejecutar pre-cierre obligatorio antes de declarar done.

## Overrides locales

Si este proyecto necesita politicas adicionales, definirlas aqui y mantener compatibilidad con baseline global.
