# Proposal

## Why

Los reclutadores pueden ver las posiciones en `/positions`, pero no tienen forma de ver ni gestionar los candidatos de una posición concreta. Necesitan ver en qué fase del proceso está cada candidato y poder avanzarlo. Hoy la botonera "Ver proceso" de cada tarjeta no lleva a ninguna parte.

## What Changes

- Nueva página de proceso de una posición (`/positions/:id`) con el título de la posición en la parte superior y una flecha para volver a `/positions`.
- Vista tipo kanban: una columna por cada fase del proceso de contratación (`interviewFlow.interviewSteps`, ordenadas por `orderIndex`).
- Cada candidato se muestra como tarjeta en la columna de su fase actual, con nombre completo y puntuación media.
- Arrastrar una tarjeta a otra columna actualiza la fase del candidato mediante `PUT /candidates/:id/stage`.
- Diseño responsive: en móvil las fases se apilan verticalmente ocupando todo el ancho.
- El botón "Ver proceso" de `Positions.tsx` navega a la nueva página.
- El listado `/positions` lee las posiciones reales de `GET /positions` en lugar de datos mock. El estado se traduce al español en la interfaz (`Open` → Abierto, `Filled` → Contratado, `Closed` → Cerrado, `Draft` → Borrador), el campo Manager se muestra sin valor hasta que se acuerde un cambio de esquema que lo soporte, y los filtros siguen sin funcionar.
- Fuera de alcance: editar la posición, el botón "Editar", filtros de la vista de posiciones, el manager real de cada posición, creación de fases, y la estructura global de la página (menú superior y footer), que se asume existente.

## Capabilities

### New Capabilities

- `position-hiring-pipeline`: visualización del proceso de contratación de una posición como tablero de fases con candidatos, y cambio de fase de un candidato arrastrando su tarjeta.

### Modified Capabilities

Ninguna. La API que consume esta vista está definida en la spec `position-pipeline-api`.

## Impact

- **Código nuevo:** página de proceso de posición, componentes de columna y tarjeta de candidato, y una capa de servicio para los endpoints de posición y candidato.
- **Código modificado:** `frontend/src/App.js` (nueva ruta `/positions/:id`) y `frontend/src/components/Positions.tsx` (lee las posiciones del backend y el botón "Ver proceso" navega a la nueva ruta).
- **APIs consumidas:** `GET /positions`, `GET /positions/:id/interviewFlow`, `GET /positions/:id/candidates` y `PUT /candidates/:id/stage`. Se sigue el contrato de la tarea y de la spec `position-pipeline-api`; esta propuesta no incluye cambios de backend.
- **Dependencias:** ninguna nueva prevista. El arrastrar y soltar se puede hacer con la API HTML5 nativa; si se elige una librería, se añadirá en `design.md`.
