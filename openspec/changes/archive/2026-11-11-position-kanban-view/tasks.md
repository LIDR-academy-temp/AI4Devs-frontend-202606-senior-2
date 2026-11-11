# Tasks

## 1. Contrato de la API

- [x] 1.1 Confirmar que `GET /positions/:id/candidates` devuelve `id` (candidato) y `applicationId`, y que `GET /positions` devuelve `id`, `title`, `status` y `applicationDeadline`, según la spec `position-pipeline-api`

## 2. Servicio de posiciones

- [x] 2.1 Crear `frontend/src/services/positionService.ts` con `getInterviewFlow`, `getPositionCandidates` y `updateCandidateStage`, usando `fetch`
- [x] 2.2 Definir los tipos de respuesta (`type`) para el proceso, las fases y los candidatos

## 3. Ruta y navegación

- [x] 3.1 Añadir la ruta `/positions/:id` en `frontend/src/App.js`
- [x] 3.2 Hacer que el botón "Ver proceso" navegue a `/positions/:id` con `Link`

## 4. Página de proceso

- [x] 4.1 Crear `frontend/src/components/PositionPipeline.tsx` con la cabecera: título de la posición y, a su izquierda, flecha de vuelta a `/positions`
- [x] 4.2 Cargar el proceso y los candidatos en paralelo y mostrar un estado de carga y un mensaje de error
- [x] 4.3 Mostrar un mensaje cuando la posición no tiene fases

## 5. Columnas y tarjetas

- [x] 5.1 Crear `PipelineColumn.tsx` que muestra una columna por fase, ordenadas por `orderIndex` y desempatando por `id`
- [x] 5.2 Crear `CandidateCard.tsx` con nombre completo y puntuación media, representada con un círculo por punto, redondeando al entero más cercano (ninguno si es 0)
- [x] 5.3 Colocar cada candidato en la columna cuyo nombre coincide con `currentInterviewStep`, y añadir una columna "Sin fase" para los que no coincidan
- [x] 5.4 Hacer la columna "Sin fase" de solo lectura: sin zona de drop y con tarjetas no arrastrables
- [x] 5.5 Aplicar el layout responsive con `Col xs={12} md=...` para que las fases se apilen en móvil

## 6. Arrastrar y soltar

- [x] 6.1 Hacer las tarjetas arrastrables y las columnas zonas de drop con la API HTML5
- [x] 6.2 Al soltar en otra columna, actualizar la fase de forma optimista y llamar a `updateCandidateStage`
- [x] 6.3 Si la llamada falla, devolver la tarjeta a su columna original y mostrar un error
- [x] 6.4 Al soltar en la misma columna, no hacer ninguna llamada

## 7. Listado de posiciones con datos reales

- [x] 7.1 Añadir `getPositions` y el tipo de la posición del listado en `frontend/src/services/positionService.ts`, y verificar que `npx tsc --noEmit` en `frontend/` pasa
- [x] 7.2 Reescribir `frontend/src/components/Positions.tsx` para cargar las posiciones con `getPositions`, mostrar carga, error y lista vacía, traducir el estado al español, dejar el Manager sin valor, formatear la fecha límite como `YYYY-MM-DD`, y eliminar los datos mock; verificar en el navegador integrado con el backend en marcha que `/positions` muestra las tres posiciones del seed con estados Abierto, Contratado y Borrador y que "Ver proceso" abre su tablero

## 8. Verificación

- [x] 8.1 Probar la página con los datos de ejemplo del seed (backend corriendo en el puerto 3010)
- [x] 8.2 Probar el arrastre entre fases en escritorio y comprobar que el cambio persiste al recargar
- [x] 8.3 Probar la vista en móvil con el modo de dispositivo del navegador integrado
- [x] 8.4 Ejecutar `npm run build` en `frontend/` y revisar que no hay avisos nuevos de ESLint
- [x] 8.5 Ejecutar `npx openspec validate position-kanban-view` y corregir errores
