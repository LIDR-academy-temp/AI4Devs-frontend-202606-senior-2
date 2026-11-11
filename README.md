# LTI - Talent Tracking System  | EN

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is initiated with Create React App, and the backend is written in TypeScript.

## Directory and File Explanation

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: Contains the application logic.
    - `domain/`: Contains the business logic.
    - `infrastructure/`: Contains code that communicates with the database.
    - `presentation/`: Contains code related to the presentation layer (such as controllers).
    - `routes/`: Contains the route definitions for the API.
    - `tests/`: Contains test files.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files such as the HTML file and images.
  - `build/`: Contains the production-ready build of the frontend.
- `.env`: Contains the environment variables.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend


The frontend is a React application, and its main files are located in the `src` directory. The `public` directory contains static assets, and the build directory contains the production `build` of the application.

### Backend

The backend is an Express application written in TypeScript. The `src` directory contains the source code, divided into several subdirectories:

- `application`:Contains the application logic.
- `domain`: Contains the domain models.
- `infrastructure`: Contains code related to the infrastructure.
- `presentation`: Contains code related to the presentation layer.
- `routes`: Contains the application's routes.
- `tests`: Contains the application's tests.

The `prisma` directory contains the Prisma schema.

## Getting started

Follow these steps in order to run the project locally. You will need three things running: the PostgreSQL database, the backend and the frontend.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (open the app and wait until it is running before step 3)

### 1. Clone the repo

### 2. Install dependencies

```sh
cd backend
npm install

cd ../frontend
npm install
```

### 3. Start the PostgreSQL database

The database variables (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) live in `backend/.env`. Run this from the project root so Docker Compose can read them:

```sh
docker compose --env-file backend/.env up -d
```

> Note: newer Docker versions use `docker compose` (with a space) instead of `docker-compose`. The `-d` flag runs the container in the background.

To connect with any PostgreSQL client, use the values from `backend/.env` (host `localhost`, port `5432` by default).

To stop the database: `docker compose --env-file backend/.env down`

### 4. Prepare the database with Prisma

Make sure `backend/.env` contains `DATABASE_URL` with the correct connection string. Then, from `backend/`:

```sh
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

This generates the Prisma client, applies the migrations and populates the database with example data.

`npm run seed` can be run as many times as you want: it first **deletes all the data** in the database and restarts the ids, so the example positions (1, 2 and 3), their interview steps and their candidates are always the same. It refuses to run with `NODE_ENV=production`.

### 5. Start the backend

In a new terminal:

```sh
cd backend
npm run dev
```

The backend runs at http://localhost:3010 and restarts automatically when you change files. For a production-like run use `npm run build && npm start` instead.

### 6. Start the frontend

In another terminal:

```sh
cd frontend
npm start
```

The frontend runs at http://localhost:3000. There is no need to run `npm run build` first; that is only for production builds.

Once everything is running, you can save new candidates, both via the web and API, view them in the database, and retrieve them via GET by ID.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```
-------------------------------------------------------------------------------

## Spec-driven development with OpenSpec

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) to plan changes before implementing them. It is installed as a dev dependency in the root `package.json` and configured for Claude Code (see `openspec/` and `.claude/`).

- Propose a change: `/opsx:propose "description"`. This generates the proposal, design, specs and tasks in `openspec/changes/`.
- Implement it: `/opsx:apply`.
- Sync and archive when it is done: `/opsx:sync`, then `/opsx:archive`.
- Validate the specs: `npx openspec validate --all`.

Current specs live in `openspec/specs/`. Change them through a change, not by hand.


# LTI - Sistema de Seguimiento de Talento  | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como un ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `application/`: Contiene la lógica de aplicación.
    - `domain/`: Contiene la lógica de negocio.
    - `infrastructure/`: Contiene código que se comunica con la base de datos.
    - `presentation/`: Contiene código relacionado con la capa de presentación (como controladores).
    - `routes/`: Contiene las definiciones de rutas para la API.
    - `tests/`: Contiene archivos de prueba.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `.env`: Contiene las variables de entorno.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo, contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript. El directorio `src` contiene el código fuente, dividido en varios subdirectorios:

- `application`: Contiene la lógica de aplicación.
- `domain`: Contiene los modelos de dominio.
- `infrastructure`: Contiene código relacionado con la infraestructura.
- `presentation`: Contiene código relacionado con la capa de presentación.
- `routes`: Contiene las rutas de la aplicación.
- `tests`: Contiene las pruebas de la aplicación.

El directorio `prisma` contiene el esquema de Prisma.

Tienes más información sobre buenas prácticas utilizadas en la [guía de buenas prácticas](./backend/ManifestoBuenasPracticas.md).

Las especificaciones de todos los endpoints de API los tienes en [api-spec.yaml](./backend/api-spec.yaml).

La descripción y diagrama del modelo de datos los tienes en [ModeloDatos.md](./backend/ModeloDatos.md).


## Primeros Pasos

Sigue estos pasos en orden para ejecutar el proyecto en local. Necesitarás tres cosas en marcha: la base de datos PostgreSQL, el backend y el frontend.

### Requisitos previos

- [Node.js](https://nodejs.org/) y npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (abre la aplicación y espera a que esté en ejecución antes del paso 3)

### 1. Clona el repositorio

### 2. Instala las dependencias

```sh
cd backend
npm install

cd ../frontend
npm install
```

### 3. Inicia la base de datos PostgreSQL

Las variables de la base de datos (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) están en `backend/.env`. Ejecuta esto desde la raíz del proyecto para que Docker Compose pueda leerlas:

```sh
docker compose --env-file backend/.env up -d
```

> Nota: las versiones nuevas de Docker usan `docker compose` (con espacio) en lugar de `docker-compose`. La bandera `-d` ejecuta el contenedor en segundo plano.

Para conectarte con cualquier cliente PostgreSQL, usa los valores de `backend/.env` (host `localhost`, puerto `5432` por defecto).

Para detener la base de datos: `docker compose --env-file backend/.env down`

### 4. Prepara la base de datos con Prisma

Asegúrate de que `backend/.env` contenga `DATABASE_URL` con la cadena de conexión correcta. Luego, desde `backend/`:

```sh
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

Esto genera el cliente de Prisma, aplica las migraciones y puebla la base de datos con datos de ejemplo.

`npm run seed` se puede ejecutar tantas veces como quieras: antes de crear los datos **borra todo el contenido** de la base de datos y reinicia los ids, de modo que las posiciones de ejemplo (1, 2 y 3), sus fases y sus candidatos son siempre los mismos. Se niega a ejecutarse con `NODE_ENV=production`.

### 5. Inicia el backend

En una nueva terminal:

```sh
cd backend
npm run dev
```

El backend corre en http://localhost:3010 y se reinicia solo al cambiar archivos. Para una ejecución tipo producción usa `npm run build && npm start`.

### 6. Inicia el frontend

En otra terminal:

```sh
cd frontend
npm start
```

El frontend corre en http://localhost:3000. No hace falta ejecutar `npm run build` antes; eso es solo para builds de producción.

Una vez todo está en marcha, puedes guardar nuevos candidatos, tanto vía web como vía API, verlos en la base de datos y obtenerlos mediante GET por id.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```



## Desarrollo guiado por especificaciones con OpenSpec

Este proyecto usa [OpenSpec](https://github.com/Fission-AI/OpenSpec) para planificar los cambios antes de implementarlos. Está instalado como devDependency en el `package.json` de la raíz y configurado para Claude Code (ver `openspec/` y `.claude/`).

- Proponer un cambio: `/opsx:propose "descripción"`. Genera la propuesta, el diseño, las specs y las tareas en `openspec/changes/`.
- Implementarlo: `/opsx:apply`.
- Sincronizar y archivar al terminar: `/opsx:sync`, y después `/opsx:archive`.
- Validar las specs: `npx openspec validate --all`.

Las specs vigentes están en `openspec/specs/`. Modifícalas a través de un cambio, no a mano.
