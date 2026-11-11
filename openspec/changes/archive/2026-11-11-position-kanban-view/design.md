# Design

## Context

El frontend (`frontend/`) es una app Create React App con React Router v6 y react-bootstrap. Las rutas se declaran en `frontend/src/App.js`. La página `Positions.tsx` usaba datos mock y su botón "Ver proceso" no tenía destino; este cambio la conecta al backend (`GET /positions`) y añade la página de detalle de posición, que no existía.

El backend expone la información del proceso en `backend/src/application/services/positionService.ts` (`interviewFlow` con `interviewSteps`). Los contratos de la API son los de la tarea y los de la spec `position-pipeline-api`.

`frontend/src/services/candidateService.js` importa `axios`, que no está en `frontend/package.json`. Para esta funcionalidad se usará `fetch`, igual que en el resto de componentes.

## Goals / Non-Goals

**Goals:**
- Página `/positions/:id` con cabecera, flecha de vuelta y tablero de fases.
- Tarjetas de candidato colocadas por fase actual, con arrastrar y soltar para cambiar de fase.
- Layout de columnas en escritorio y apilado en móvil.

**Non-Goals:**
- Manager real de cada posición (el esquema no lo relaciona con la posición) y filtros del listado.
- Crear, editar o eliminar fases o posiciones.
- Modificar el backend.
- Tests end-to-end del arrastre en navegadores reales (se valida manualmente).

## Decisions

**Rutas y navegación.** Añadir `<Route path="/positions/:id" element={<PositionPipeline />} />` en `App.js`. En `Positions.tsx` el botón "Ver proceso" usa `Link` de `react-router-dom` hacia `/positions/${id}`.

**Capa de servicio.** Crear `frontend/src/services/positionService.ts` con:
- `getInterviewFlow(positionId)` → `GET /positions/:id/interviewFlow`
- `getPositionCandidates(positionId)` → `GET /positions/:id/candidates`
- `updateCandidateStage(candidateId, applicationId, stepId)` → `PUT /candidates/:id/stage` con cuerpo `{ applicationId, currentInterviewStep }`

Usa `fetch` contra `http://localhost:3010`, lanzando errores con el código de estado. No se toca `candidateService.js` en este cambio.

**Contrato de la API.** Se sigue la definición de la tarea y de la spec `position-pipeline-api`: `GET /positions`, `GET /positions/:id/interviewFlow`, `GET /positions/:id/candidates` y `PUT /candidates/:id/stage`. El backend queda fuera de alcance. Todas las rutas se aíslan en `positionService.ts`, de modo que cualquier cambio de contrato solo afecta a ese archivo.

El cuerpo del `PUT` usa `currentInterviewStep` y `applicationId`, como el ejemplo de la tarea y la spec `position-pipeline-api` (el texto de la tarea lo llama `new_interview_step`, pero no es el nombre del campo del contrato). El `GET` de candidatos devuelve el **nombre** de la fase, mientras que el `PUT` espera su **id** (`interviewSteps[].id`), que sale del `interviewFlow`.

**Datos del candidato.** `GET /positions/:id/candidates` devuelve `fullName`, `currentInterviewStep` (nombre de la fase) y `averageScore`. El ejemplo de la tarea no incluye el id del candidato (va en la ruta del `PUT`) ni el id de la aplicación (va en el cuerpo del `PUT`); según la spec `position-pipeline-api`, el listado los devuelve como `id` y `applicationId`. El frontend se apoya en esos dos campos; si sus nombres cambian, solo se ajustan los tipos y `positionService.ts`.

**Mapeo de columnas.** Las columnas salen de `interviewSteps` ordenadas por `orderIndex`, desempatando por `id` (en el ejemplo de la tarea hay dos fases con `orderIndex` 2). Cada candidato se asigna a la columna cuyo `name` coincide con `currentInterviewStep`. Los nombres se comparan tal cual; si el backend cambia un nombre de fase, el candidato quedaría sin columna, por lo que se muestra en una columna de "Sin fase" para no perderlo. Esa columna es de solo lectura: no acepta soltar tarjetas y sus tarjetas no son arrastrables, porque no tiene un id de fase al que enviar el cambio.

**Arrastrar y soltar.** Se usa la API HTML5 nativa (`draggable`, `onDragStart`, `onDragOver`, `onDrop`), sin librería nueva. Motivo: el caso de uso es un único tablero con pocas interacciones, y evita añadir una dependencia. Tras soltar, la tarjeta cambia de columna de forma optimista y se revierte si la llamada falla.

**Móvil.** Con react-bootstrap, las columnas usan `Col xs={12} md`, de modo que en móvil se apilan a ancho completo y desde `md` se reparten el ancho a partes iguales. El arrastre en móvil con HTML5 DnD no funciona en muchos navegadores; se documenta como limitación y se deja como mejora posterior, ya que el requisito de móvil es de visualización.

**Listado de posiciones.** `Positions.tsx` deja de usar el array mock y carga las posiciones con `getPositions()`, una nueva función de `positionService.ts` que llama a `GET /positions` (`{ id, title, status, applicationDeadline }`). La traducción del estado vive en la interfaz, en un objeto constante dentro de `Positions.tsx` (`Open` → Abierto, `Filled` → Contratado, `Closed` → Cerrado, `Draft` → Borrador); un estado desconocido se muestra tal cual en vez de ocultarlo. Alternativa: traducir en el backend, se descarta porque los textos de la interfaz son del frontend y el backend devuelve el valor almacenado. La fecha límite se muestra como `YYYY-MM-DD` tomando la parte de fecha del valor recibido, y queda vacía si es nula. El campo Manager se mantiene en la tarjeta sin valor, pues el backend no lo devuelve. Los colores del distintivo de estado se derivan de la etiqueta en español, como hasta ahora. Los filtros no se tocan (siguen inertes). Se añaden estados de carga, error y lista vacía, con `Alert` de `react-bootstrap` como en la página de proceso.

**Estructura de componentes.** `frontend/src/components/PositionPipeline.tsx` (página), `PipelineColumn.tsx` (columna con su zona de drop) y `CandidateCard.tsx` (tarjeta arrastrable, con la puntuación como círculos según el diseño de las capturas). La puntuación media se redondea al entero más cercano para decidir cuántos círculos se muestran (3,5 → 4), ya que la tarea no define otro criterio. TypeScript con `type` para los modelos, como en `Positions.tsx`.

## Risks / Trade-offs

- **Nombres de los ids en la respuesta de candidatos.** Si el contrato cambia `id` o `applicationId`, el cambio de fase deja de funcionar. Mitigación: el ajuste se limita a los tipos y `positionService.ts`.
- **HTML5 DnD en móvil.** Limitado en varios navegadores. Trade-off aceptado: móvil se entrega como visualización apilada; arrastrar en móvil queda fuera de esta propuesta.
- **Cambio optimista.** Si la llamada falla, hay un parpadeo al revertir. Trade-off aceptado frente a esperar a la respuesta del servidor en cada movimiento.
- **Sin tests automatizados en el frontend.** `frontend/package.json` referencia un `jest.config.js` que no existe. La validación de esta funcionalidad será manual; añadir tests queda como tarea separada.
