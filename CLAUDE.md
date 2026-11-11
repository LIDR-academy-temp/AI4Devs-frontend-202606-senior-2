# CLAUDE.md

Guía para trabajar en el frontend de este proyecto (LTI - Sistema de Seguimiento de Talento).

## Stack

- React 18 con Create React App (`react-scripts` 5).
- React Router v6 (`react-router-dom`) para la navegación.
- Bootstrap 5 con `react-bootstrap` para los componentes de UI e `react-bootstrap-icons` para los iconos.
- `react-datepicker` para los campos de fecha.
- `fetch` nativo para llamadas HTTP al backend.
- TypeScript (`strict: true` en `frontend/tsconfig.json`) conviviendo con archivos `.js`.

## Comandos

Desde `frontend/`:

- `npm install`: instala dependencias.
- `npm start`: servidor de desarrollo en http://localhost:3000.
- `npm run build`: build de producción en `build/`.

El backend corre en http://localhost:3010 y la base de datos en el puerto 5432 (ver README).

## Estructura

- `src/index.tsx`: punto de entrada. Envuelve la app en `React.StrictMode`.
- `src/App.js`: define las rutas con `BrowserRouter` y `Routes`. Es el único sitio donde se declaran rutas.
- `src/components/`: componentes de pantalla y componentes reutilizables, con nombre en PascalCase y un componente por archivo.
- `src/services/`: funciones que llaman al backend.
- `src/assets/`: imágenes importadas desde el código.

## Convenciones

- Componentes funcionales con hooks (`useState`). No se usan componentes de clase.
- Exportar un componente por defecto al final del archivo.
- Usar los componentes de `react-bootstrap` (`Container`, `Row`, `Col`, `Card`, `Form`, `Button`, `Alert`) con las clases de utilidad de Bootstrap para espaciado y estilo, en lugar de CSS nuevo.
- Los campos de formulario van con `Form.Group` y `Form.Label` asociados mediante `controlId`, para que las etiquetas sean accesibles.
- Los textos de la interfaz están en español.
- Al enviar formularios, se usa `e.preventDefault()` y se muestran los errores con un `Alert` de `react-bootstrap`.
- Las fechas se envían al backend en formato `YYYY-MM-DD`.
- Los tipos de datos se declaran con `type` en TypeScript (ver `Positions.tsx`).


## Spec-driven development (OpenSpec)

Los cambios de funcionalidad se planifican con OpenSpec. Está instalado como devDependency en la raíz (`@fission-ai/openspec`) y configurado para Claude Code (`openspec/` y `.claude/`).

- Antes de implementar un cambio nuevo, crea su propuesta con `/opsx:propose "descripción"`. Esto genera los artefactos (propuesta, diseño, specs y tareas) dentro de `openspec/changes/`.
- Implementa las tareas del cambio con `/opsx:apply`. Marca cada tarea como completada al terminarla.
- Cuando el cambio esté terminado, sincroniza sus specs con `/opsx:sync` y archívalo con `/opsx:archive`.
- Las specs vigentes viven en `openspec/specs/`. No las edites a mano sin pasar por un cambio.
- Valida la estructura con `npx openspec validate --all`.
