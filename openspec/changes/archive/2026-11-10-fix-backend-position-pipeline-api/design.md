# Design

## Context

El backend (`backend/`) es Express + Prisma sobre PostgreSQL, con la estructura `routes` → `presentation/controllers` → `application/services` → `domain/models`. Ver `proposal.md` para la motivación y `specs/position-pipeline-api/spec.md` para los requisitos.

Estado observado hoy (comprobado con `curl` contra el backend en marcha y leyendo el código):

- `src/index.ts` monta las rutas de posiciones en `/position`; `candidateRoutes.ts` define `PUT /:id` y no hay `/:id/stage`.
- `getInterviewFlowByPosition` responde `res.json({ interviewFlow })` sobre un resultado del servicio que ya es `{ positionName, interviewFlow }`, así que el cliente recibe `{ interviewFlow: { positionName, interviewFlow } }`.
- `getCandidatesByPositionService` ya devuelve `id` y `applicationId` además de los tres campos de la tarea.
- `updateCandidateStage` comprueba que la aplicación existe y pertenece al candidato, pero no que la fase pertenezca al proceso de su posición. El controlador distingue el 404 comparando el texto del mensaje (`'Error: Application not found'`) y usa el mensaje "Invalid position ID format" para un `applicationId` inválido.
- `prisma/seed.ts` solo usa `create`, así que un segundo arranque falla por el email único de `Candidate`, y no hay script de npm (el README lo ejecuta con `npx ts-node --transpile-only prisma/seed.ts`). La aplicación 2 (candidato 1 en la posición 2) apunta a una fase de otro proceso.
- Los tests existentes son unitarios con servicios y Prisma simulados (`jest` + `ts-jest`); no hay tests contra una base de datos real.

## Goals / Non-Goals

**Goals:**
- Que el contrato de la tarea funcione de extremo a extremo con el frontend de `position-kanban-view` sin cambiar este.
- Que los datos de ejemplo se puedan recrear en cualquier momento y cubran los casos del tablero.

**Non-Goals:**
- Reorganizar capas del backend o sustituir la comparación por texto de errores en el controlador por una jerarquía de errores.
- Autorización, paginación o cambios de esquema de Prisma.
- Cambiar el frontend: el listado de `/positions` lo conecta `position-kanban-view` y traduce los estados al español en la interfaz.
- Filtros, paginación o manager en el listado (el esquema no relaciona una posición con un manager; si se acuerda, será un cambio de esquema aparte).

## Decisions

**Prefijo `/positions` sin alias.** Se cambia el montaje en `index.ts` de `/position` a `/positions`. Alternativa: servir ambos prefijos. Se descarta porque no hay consumidores del antiguo en el repositorio y un alias dejaría dos contratos que mantener y documentar. El cambio es **BREAKING** y se anota en `api-spec.yaml`.

**`PUT /candidates/:id/stage` sustituye a `PUT /candidates/:id`.** Mismo controlador y mismo cuerpo, solo cambia la ruta. Alternativa: mantener ambas. Se descarta por la misma razón; además la ruta sin sufijo es ambigua (parece actualizar el candidato entero).

**Endpoint de listado `GET /positions`.** Se añade `router.get('/', ...)` en `positionRoutes.ts`, un controlador y una función de servicio que hace un `findMany` de Prisma con `select` de `id`, `title`, `status` y `applicationDeadline`, ordenado por `id`. Alternativas: devolver la fila completa (se descarta: expone campos que el listado no usa, como la descripción del puesto o el rango salarial) o filtrar por `isVisible` (se descarta: no se pidió y ocultaría borradores que el listado muestra como "Borrador"). El `status` se devuelve tal cual está en la base de datos (`Open`, `Filled`, `Closed`, `Draft`) y la traducción al español vive en el frontend. No se incluye manager, ver Non-Goals.

**Respuesta plana de `interviewFlow`.** El controlador responde con el resultado del servicio tal cual (`res.status(200).json(interviewFlow)`). Se arregla en el controlador y no en el servicio, porque el servicio ya devuelve la forma documentada en la tarea y en su test.

**Validación de la fase en el servicio.** En `updateCandidateStage`, tras comprobar la aplicación, se carga la fase destino y se compara su `interviewFlowId` con el de la posición de la aplicación; si no coincide (o la fase no existe) se lanza un error que el controlador devuelve como 400, que es lo que ya hace su rama por defecto. Alternativa: confiar en la clave foránea de la base de datos. Se descarta porque la clave foránea solo comprueba que la fase exista, no que pertenezca al proceso correcto. Se mantiene la convención actual de errores con mensaje (sin crear jerarquía de errores, ver Non-Goals). Se corrige el mensaje de `applicationId` inválido.

**Seed re-ejecutable con `TRUNCATE ... RESTART IDENTITY CASCADE`.** Al empezar, el seed vacía todas las tablas de negocio y reinicia las secuencias, y después crea los datos. Así los identificadores son siempre los mismos (posiciones 1, 2 y 3, fases 1 a 3), que es lo que los specs y el frontend asumen. Alternativas: `upsert` por clave natural (no existe clave natural para varias tablas y no fija los ids) o `deleteMany` en orden de dependencias (no reinicia las secuencias). Se rechaza ejecutarlo con `NODE_ENV=production` para no borrar datos reales. El coste es que borra los datos de desarrollo que alguien haya añadido a mano; se documenta en el README.

**Datos del seed.** Se mantienen compañía, empleados, tipos y fases actuales, y se reajustan las aplicaciones:

- Posición 1 (proceso 1, con dos fases con `orderIndex` 2): John Doe en "Manager Interview" con 5, Jane Smith en "Technical Interview" con 4, Carlos García en "Initial Screening" sin entrevistas (0), Alice Johnson en "Initial Screening" con dos entrevistas puntuadas 3 y 4 (media 3,5, útil para el redondeo del frontend) y Bob Brown en "Technical Interview" con 2. Alice Johnson y Bob Brown son candidatos nuevos.
- Posición 2 (proceso 2, sin fases): sin aplicaciones. Hoy tiene una aplicación que apunta a una fase de otro proceso; se elimina para que los datos sean coherentes con la validación nueva.
- Posición 3 ("Product Manager", reutiliza el proceso 1): sin aplicaciones.
- Estados para probar el listado: posición 1 `Open`, posición 2 `Filled` y posición 3 `Draft`.

Se añade un script `seed` en `backend/package.json` que ejecuta `ts-node --transpile-only prisma/seed.ts`. No se configura la clave `prisma.seed` para no cambiar el comportamiento de `prisma migrate dev`, que lo lanzaría y vaciaría la base de datos en cada migración.

**Tests.** Se añaden o ajustan tests unitarios en el estilo actual (servicios y Prisma simulados): forma de la respuesta de `interviewFlow`, mensajes del 400 y la nueva validación de fase. La verificación de rutas y seed se hace contra el backend y la base de datos reales con `curl`, porque no hay infraestructura de tests de integración y crearla excede este cambio.

## Risks / Trade-offs

- [Romper clientes del prefijo `/position` o de `PUT /candidates/:id`] → No hay consumidores en el repositorio; se anota como **BREAKING** en `api-spec.yaml` y en el PR.
- [El seed borra datos de desarrollo] → Rechaza `NODE_ENV=production`, solo se ejecuta manualmente y el README lo advierte.
- [Ids fijos asumidos por los specs y el frontend] → Los garantiza `RESTART IDENTITY`; si alguien ejecuta el seed sin el `TRUNCATE`, los ids pueden variar. El seed siempre lo ejecuta primero.
- [Validación de fase añade una consulta por cambio de fase] → Aceptable: una consulta por una acción manual del usuario.
- [El `TRUNCATE` depende de los nombres de tabla de Prisma] → Se escriben tal cual en las migraciones; si el esquema cambia, el seed fallará de forma visible, no silenciosa.
