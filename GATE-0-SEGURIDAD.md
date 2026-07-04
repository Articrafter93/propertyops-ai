# GATE 0 — Preflight de Seguridad 2.0 (abreviado)

**Fecha:** 2026-07-02
**Modo:** `GATE 0 abreviado` (superficie `low-risk/local` — ver justificación abajo)
**Baseline:** `docs/experto-seguridad-legacy.md` + doctrina raíz (vigentes en sesión)
**Veredicto:** **PASS** — Security de la matriz full-stack pasa `bloqueada` → `cubierta`.

---

## Justificación del modo abreviado

Tras la regularización (Notas de Cambio N.º 01 y N.º 02), la superficie de riesgo del activo es mínima:

- **Sin secretos vivos:** Supabase eliminado; ya no hay `NEXT_PUBLIC_SUPABASE_*` ni service-role key. La única variable es `NEXT_PUBLIC_DEMO_AUTH` (flag público de exhibición, no secreto).
- **Sin base de datos viva:** datos = `seed.json` estático de solo lectura. Sin SQL, sin RLS, sin superficie de inyección de datos.
- **Sin backend externo vivo:** integraciones (Make/GAS/WhatsApp/OpenAI/Drive) simuladas como datos; no hay llamadas de red salientes con credenciales.
- **`tipo_cliente: ficticio`**, sandbox-first, sin producción real ni PII real (toda la PII del seed es inventada).

Cumple las condiciones de `low-risk/local` del modo balanceado (alcance acotado, sin red viva, sin installs en runtime, sin lectura de secretos, sin git-write destructivo).

## Evidencia verificada

| Control | Estado | Evidencia |
|---|---|---|
| `.env*` en `.gitignore` | ✅ | `.gitignore` L26-27, L40 (confirmado en retoma) |
| Sin secretos hardcodeados | ✅ | Solo password demo sandbox (`Demo1234!`, excepción sancionada de login mock); sin tokens/keys en código |
| Sin sink de XSS | ✅ | `dangerouslySetInnerHTML` = 0 ocurrencias en el repo |
| Security headers | ✅ | `next.config.ts`: X-Frame-Options (SAMEORIGIN), nosniff, Referrer-Policy, Permissions-Policy, X-XSS-Protection |
| **CSP** | ✅ | `next.config.ts`: `Content-Security-Policy` añadida (default-src 'self', object-src 'none', frame-ancestors 'self', base-uri 'self', form-action 'self'; `'unsafe-inline'` en script/style justificado para hydration Next + estilos inline Tailwind/Recharts, sin sink de inyección) |
| Autenticación | ✅ | Sesión mock local por cookie `httpOnly` (`lib/auth.ts`), gate `NEXT_PUBLIC_DEMO_AUTH` |
| Control de acceso por rol | ✅ | `proxy.ts` (`isPathAllowed`), técnico acotado a `/incidencias` |
| Login mock bloqueado sin flag | ✅ | `signInLocal` retorna error si `NEXT_PUBLIC_DEMO_AUTH != enabled` |
| Vulnerabilidades de dependencias | ✅ | `npm audit` = **0 vulnerabilidades** (10 preexistentes remediadas 2026-07-02) |
| lint / build | ✅ | `npm run lint` 0/0 · `npm run build` PASS (15 rutas) |

## Pendiente (no bloquea GATE 0, sí el cierre)

- Verificación funcional en vivo del role-gating y logout en navegador → **VFH (Fase 6)**.
- Los headers/CSP se verifican servidos en el deploy → 2.ª VFH (`vrc`, fuera del alcance de esta tanda hasta sello parcial).
