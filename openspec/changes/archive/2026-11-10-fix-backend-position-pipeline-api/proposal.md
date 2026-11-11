# Proposal

## Why

La página de proceso de una posición (change `position-kanban-view`) sigue el contrato de la tarea, pero el backend actual no lo cumple: las rutas tienen otro prefijo, falta la ruta de cambio de fase y la respuesta de `interviewFlow` está envuelta dos veces. Además, los datos de la base de datos no permiten probar todos los casos del tablero (no hay candidatos en todas las fases, ni una posición sin proceso, ni las tres posiciones que enlaza el listado). El listado `/positions` del frontend tampoco puede mostrar datos reales porque el backend no tiene un endpoint que liste las posiciones. Sin este cambio, la funcionalidad no se puede probar de extremo a extremo.

## What Changes

- **BREAKING:** las rutas de posiciones pasan de `/position/:id/...` a `/positions/:id/...`. Hoy no hay consumidores del prefijo antiguo en el repositorio.
- Nueva ruta `PUT /candidates/:id/stage` para cambiar la fase de un candidato. **BREAKING:** sustituye a `PUT /candidates/:id`.
- `GET /positions/:id/interviewFlow` devuelve `{ positionName, interviewFlow }` sin el envoltorio extra que tiene hoy.
- Nuevo `GET /positions` que lista las posiciones con `id`, `title`, `status` y `applicationDeadline`, para que el listado del frontend lea datos reales. No incluye manager porque el esquema no relaciona una posición con un manager.
- `GET /positions/:id/candidates` mantiene `fullName`, `currentInterviewStep` y `averageScore`, y se documenta que incluye `id` (candidato) y `applicationId`, que el frontend necesita para el cambio de fase.
- El cambio de fase valida que la fase pertenezca al proceso de la posición de la aplicación y corrige el mensaje de error de `applicationId` inválido.
- El seed (`backend/prisma/seed.ts`) se puede ejecutar varias veces sin fallar, se expone como script de npm y ofrece datos para probar todos los casos del tablero: candidatos en cada fase con puntuaciones distintas, una posición con proceso vacío y las tres posiciones que enlaza el listado del frontend, con estados distintos (`Open`, `Filled`, `Draft`).
- Se actualizan `backend/api-spec.yaml`, los tests de controladores afectados y el README (paso de seed).
- Fuera de alcance: cambios en el frontend, otros endpoints nuevos distintos de `GET /positions`, filtros y paginación del listado, el manager de la posición (requiere un cambio de esquema que no se ha acordado), autenticación, y cambios del esquema de Prisma.

## Capabilities

### New Capabilities

- `position-pipeline-api`: API del backend para consultar el proceso de contratación de una posición, listar sus candidatos por fase y cambiar la fase de un candidato, junto con los datos de ejemplo necesarios para probarla.

### Modified Capabilities

Ninguna. No hay specs vigentes en `openspec/specs/`; el change `position-kanban-view` (que consume esta API) sigue activo y sin sincronizar.

## Impact

- **Código modificado:** `backend/src/index.ts` (prefijo de rutas), `backend/src/routes/candidateRoutes.ts` (ruta `/:id/stage`), `backend/src/routes/positionRoutes.ts` (ruta de listado), `backend/src/presentation/controllers/positionController.ts` (forma de la respuesta y listado), `backend/src/application/services/positionService.ts` (listado), `backend/src/presentation/controllers/candidateController.ts` y `backend/src/application/services/candidateService.ts` (validación y mensajes), `backend/prisma/seed.ts` y `backend/package.json` (script de seed).
- **Documentación y tests:** `backend/api-spec.yaml`, tests de los controladores de posición y candidato, y el README.
- **Dependencias:** ninguna nueva.
- **Relación con otros changes:** desbloquea la verificación de extremo a extremo de `position-kanban-view` (tareas 1.1, 1.2 y 7.x).
