# CHECKLIST-CONTROL.md - PropertyOps AI

Version: 1.0.0
Fecha: 2026-04-27
Modo: [Renovacion]
Proyecto destino: PropertyOps AI
Cliente: [Por confirmar]

---

## Paso 1 - Briefing y Descubrimiento
- [ ] Comprension de Audiencia (`01-BRIEFING.md`).
- [ ] Inventario de Branding / Redes Sociales.
- [ ] Creacion de matriz backend base en `MATRIZ-BACKEND.md`.
- [ ] Clasificacion de Dinamismo comercial: `[low/medium/high]`.
- **[GATE 1]** Aprobacion de idea central, ruta destino firme y clasificacion de negocio evaluada.

## Paso 2 - Alcance, MVP y Criterios de Exito
- [ ] Listado de "Incluido", "Reemplazado" y "No incluido".
- [ ] Mapas y KPIs de conversion.
- [ ] Definicion booleana final: ¿Habra DB?, ¿Habra pasarelas?, ¿API?, ¿Mock Data o Real?
- **[GATE 2]** Alcance aprobado. Permiso para disenar la arquitectura.

## Paso 3 - Arquitectura Tecnica y Flow (Pre-Scaffold)
- [ ] Crear `00-ARQUITECTURA-PROYECTO.md` y el Sitemap `02-ARQUITECTURA-SITIO.md`.
- [ ] Cerrar Stack Tecnico: Ejs. Next.js, FastAPI, PostgreSQL, Supabase.
- [ ] Definir variables de entorno en archivo `.env.example`.
- [ ] Establecer explicitamente `MOTION-STRATEGY.md`.
- [ ] **Navegacion Circular:** Asegurar que el diseno contemple acceso al Inicio desde cualquier subpagina.
- **[GATE 3]** Stack tecnico blindado, rutas estaticas definidas. Aprobado pasar al nivel visual.

## Paso 4 - Direccion Visual (Stitch o Referencia)
- [ ] Proponer visual con `stitch` (Landing Page) O utilizar el recurso de Figma del cliente.
- [ ] Aplicar Copywriting central (no Lorem Ipsum).
- [ ] Expansion multipagina: Solo generar las paginas subsidiarias despues de que el humano apruebe la portada.
- **[GATE 4]** Propuesta UI aprobada para implementacion dura.

## Paso 5 - Scaffold y Configuracion Local
- [ ] *(Renovacion):* Copiar carpetas del entorno seguro desde la "version origen" a la "version destino" desvinculando git/builds del clonado.
- [ ] Configurar el ambiente `Mock` por defecto si no existen las DB.
- [ ] Conectar `GEMINI.md` de reglas si es necesario.
- **[GATE 5]** Entorno local operativo y aislado.

## Paso 6 - Desarrollo Iterativo (Dev)
- [ ] Home y Rutas ensambladas con semantica.
- [ ] Responsive absoluto.
- [ ] Backend y Auth interactuando, mockeado o vivo.
- [ ] **Back to Home:** Verificar que todas las rutas menores tengan un enlace funcional a la Home.
- [ ] Micro-interacciones integradas de acuerdo a su peso comercial.
- **[GATE 6]** Proyecto ensamblado, listo y navegable localmente para Auditoria.

## Paso 7 - QA Tecnico y Auditoria de Cumplimiento
- [ ] Correr `rotos` (o `ROTOS_REPORT.md` resultante) y chequear 404s.
- [ ] UI visualmente identico o mejor al benchmark de Stitch aprobado en GATE 4.
- [ ] **Higiene de Navegacion:** Confirmar 0 paginas "huerfanas" (sin retorno al inicio).
- [ ] Pruebas A11y (Lector Pantallas, Contrastes). Test `prefers-reduced-motion`.
- **[GATE 7]** Aprobado para control de fugas (Sec).

## Paso 8 - Seguridad Pre-Deploy
- [ ] No existen Tokens o Secretos "quemados" en el codigo.
- [ ] Si involucro pagos o pasarelas de usuario, tokenizacion validada a fondo.
- **[GATE 8]** Entidad tecnica sin grietas severas de ciberseguridad.

## Paso 8.5 y 8.7 - La Puerta de Hierro (Quality Gate Tecnico y Check Funcional)
- [ ] `GATE 8.5`: Terminal verde limpisima en `npm run check`, tests logrados.
- [ ] **Audit de Secretos:** Ejecutar skill `secrets` para garantizar que NO hay API Keys ni PII en el repositorio.
- [ ] `GATE 8.7 (Herencia de la Pasada Funcional)`: Navegacion interactiva completada.
- [ ] **Auditoria de Comunicacion**: Validar carpeta `/docs/comunicacion/` y confirmar cumplimiento de cada instruccion del cliente.
- **[GATES cerrados]**. El proyecto es irrompible y seguro.

## Paso 9 - Entrega y Deploy
- [ ] **Validacion de Bloqueo (HARD STOP):** Confirmar que GATES 7, 8, 8.5 y 8.7 estan cerrados.
- [ ] **Auditoria DevSecOps:** Ejecucion obligatoria de la skill `vuln`.
- [ ] Preview Local exitoso. Repo GitHub sincronizado.
- [ ] Deploy en infraestructura final invocando la orden autorizada expresamente por cliente humano.
- **[GATE 9]** En Produccion (Mock live o Real live).

## Paso 10 - Cierre y Handover
- [ ] Entrega de control `CHECKLIST-CONTROL.md`.
- [ ] Planes y Riesgos futuros informados.
- **[GATE 10]** Caso Cerrado operativamente.

---

## Log de Fases Activas
- `[2026-04-27] GATE -1 (Ren) [PENDIENTE]`
- `[2026-04-27] GATE  0 (Sec) [PENDIENTE]`
- `[2026-04-27] GATE  1 (Brief) [PENDIENTE]`
- `[2026-04-27] GATE  2 (Alc) [PENDIENTE]`
- `[2026-04-27] GATE  3 (Arq) [PENDIENTE]`
- `[2026-04-27] GATE  4 (Vis) [PENDIENTE]`
- `[2026-04-27] GATE  5 (Set) [PENDIENTE]`
- `[2026-04-27] GATE  6 (Dev) [PENDIENTE]`
- `[2026-04-27] GATE  7 (QA)  [PENDIENTE]`
- `[2026-04-27] GATE  8 (Sec) [PENDIENTE]`
- `[2026-04-27] GATE 8.5 (Prg) [PENDIENTE]`
- `[2026-04-27] GATE 8.7 (UI)  [PENDIENTE]`
- `[2026-04-27] GATE  9 (Dep) [PENDIENTE]`
- `[2026-04-27] GATE 10 (Hnd) [PENDIENTE]`
