# Tasks

## 1. Rutas y forma de las respuestas

- [x] 1.1 Cambiar el montaje de posiciones de `/position` a `/positions` en `backend/src/index.ts` y verificar con `curl` que `GET /positions/1/candidates` responde 200 y `GET /position/1/candidates` responde 404
- [x] 1.2 Añadir `PUT /:id/stage` en `backend/src/routes/candidateRoutes.ts`, eliminar `PUT /:id`, y verificar con `curl` que la ruta nueva cambia la fase y la antigua no
- [x] 1.3 Hacer que `getInterviewFlowByPosition` responda con el resultado del servicio sin envolver, y verificar con un test de controlador (`positionController.test.ts`) que el cuerpo es `{ positionName, interviewFlow }`, y con `curl` en la posición 1
- [x] 1.4 Actualizar `backend/api-spec.yaml` con las rutas `/positions/{id}/interviewFlow`, `/positions/{id}/candidates` (incluyendo `id` y `applicationId`) y `PUT /candidates/{id}/stage`, marcando el cambio de rutas como incompatible, y verificar que el YAML sigue siendo válido

## 2. Validación del cambio de fase

- [x] 2.1 Corregir los mensajes 400 de `updateCandidateStageController` para que citen `applicationId` y `currentInterviewStep`, y verificar con tests de controlador de ambos casos
- [x] 2.2 Validar en `updateCandidateStage` que la fase destino pertenece al proceso de la posición de la aplicación, devolviendo 400 si no, y verificar con tests del servicio (fase válida, fase de otro proceso, fase inexistente), ampliando el mock de Prisma de `candidateService.test.ts`
- [x] 2.3 Verificar con `curl` contra la base de datos real los escenarios de error: aplicación de otro candidato (404), cuerpo sin `applicationId` (400), sin `currentInterviewStep` (400) y fase de otro proceso (400)

## 3. Seed re-ejecutable con datos de prueba

- [x] 3.1 Hacer que `backend/prisma/seed.ts` rechace `NODE_ENV=production` y vacíe las tablas con `TRUNCATE ... RESTART IDENTITY CASCADE` antes de crear datos, y verificar ejecutándolo dos veces seguidas sin error
- [x] 3.2 Reajustar los datos del seed según `design.md` (candidatos Alice Johnson y Bob Brown, aplicaciones en las tres fases de la posición 1, entrevistas con las puntuaciones indicadas, posición 2 sin aplicaciones y posición 3 nueva), y verificar con `curl` los escenarios de datos de la spec (candidatos por fase de la posición 1, proceso vacío de la posición 2, posición 3 con fases y sin candidatos)
- [x] 3.3 Añadir el script `seed` en `backend/package.json` y actualizar el README para usar `npm run seed` y advertir de que borra los datos, verificando que el comando documentado funciona tal cual desde `backend/`

## 4. Listado de posiciones

- [x] 4.1 Añadir `GET /positions` (ruta en `positionRoutes.ts`, controlador y función de servicio con `select` de `id`, `title`, `status` y `applicationDeadline`, ordenado por `id`) y verificar con tests de controlador y de servicio (lista con posiciones y lista vacía) y con `curl` que devuelve solo esos cuatro campos
- [x] 4.2 Documentar `GET /positions` en `backend/api-spec.yaml` y verificar que el YAML sigue siendo válido
- [x] 4.3 Variar los estados del seed (posición 1 `Open`, posición 2 `Filled`, posición 3 `Draft`), ejecutar el seed y verificar con `curl` el escenario de estados distintos de `GET /positions`

## 5. Verificación integrada

- [x] 5.1 Ejecutar `npm test` y `npm run build` en `backend/` y verificar que pasan sin errores
- [x] 5.2 Con el backend y el frontend de `position-kanban-view` en marcha y la base de datos recién poblada, abrir `/positions/1`, mover una tarjeta y verificar que el cambio persiste al recargar; comprobar también `/positions/2` (sin fases) y `/positions/3` (sin candidatos)
- [x] 5.3 Ejecutar `npx openspec validate fix-backend-position-pipeline-api --strict` y verificar que no hay errores

## Workflow follow-up

- Tras integrar este change, cerrar las tareas 1.1, 1.2 y 7.x de `position-kanban-view` y archivarlo.
- Archivar este change cuando se cumplan los requisitos de revisión del proyecto.
