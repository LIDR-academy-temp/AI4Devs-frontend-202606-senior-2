# Spec Delta

## Purpose

API del backend que permite consultar el proceso de contratación de una posición, listar sus candidatos con su fase actual y cambiar la fase de un candidato, junto con los datos de ejemplo necesarios para probarla.

## ADDED Requirements

### Requirement: Consulta del proceso de una posición
El sistema SHALL responder a `GET /positions/:id/interviewFlow` con el título de la posición y las fases de su proceso de contratación, sin envoltorios adicionales.

#### Scenario: Posición con proceso
- **WHEN** se pide `GET /positions/1/interviewFlow` y la posición existe
- **THEN** el sistema responde 200 con un objeto `{ positionName, interviewFlow }`, donde `interviewFlow` contiene `id`, `description` e `interviewSteps` (cada fase con `id`, `interviewFlowId`, `interviewTypeId`, `name` y `orderIndex`)

#### Scenario: Posición inexistente
- **WHEN** se pide el proceso de una posición que no existe
- **THEN** el sistema responde 404 con un mensaje de error

#### Scenario: Posición con proceso sin fases
- **WHEN** se pide el proceso de una posición cuyo proceso no tiene fases
- **THEN** el sistema responde 200 con `interviewSteps` vacío

### Requirement: Listado de candidatos de una posición
El sistema SHALL responder a `GET /positions/:id/candidates` con una entrada por cada aplicación de la posición, indicando el nombre completo, la fase actual por nombre y la puntuación media.

#### Scenario: Candidatos de una posición
- **WHEN** se pide `GET /positions/1/candidates` y la posición tiene aplicaciones
- **THEN** el sistema responde 200 con una lista cuyos elementos incluyen `fullName`, `currentInterviewStep` (nombre de la fase), `averageScore`, `id` (del candidato) y `applicationId`

#### Scenario: Candidato sin entrevistas
- **WHEN** una aplicación no tiene entrevistas con puntuación
- **THEN** su `averageScore` es 0

#### Scenario: Posición sin candidatos
- **WHEN** la posición no tiene aplicaciones
- **THEN** el sistema responde 200 con una lista vacía

### Requirement: Listado de posiciones
El sistema SHALL responder a `GET /positions` con todas las posiciones, ordenadas por `id` ascendente, indicando solo `id`, `title`, `status` y `applicationDeadline`.

#### Scenario: Listado con posiciones
- **WHEN** se pide `GET /positions` y existen posiciones
- **THEN** el sistema responde 200 con una lista de objetos `{ id, title, status, applicationDeadline }`, sin otros campos

#### Scenario: Sin posiciones
- **WHEN** no existe ninguna posición
- **THEN** el sistema responde 200 con una lista vacía

### Requirement: Rutas de posiciones en plural
El sistema SHALL servir las rutas de posiciones bajo el prefijo `/positions` y SHALL NOT servirlas bajo `/position`.

#### Scenario: Prefijo en plural
- **WHEN** se pide `GET /positions/1/candidates`
- **THEN** el sistema responde con los candidatos de la posición 1

#### Scenario: Prefijo antiguo
- **WHEN** se pide `GET /position/1/candidates`
- **THEN** el sistema responde 404

### Requirement: Cambio de fase de un candidato
El sistema SHALL responder a `PUT /candidates/:id/stage`, con cuerpo `{ applicationId, currentInterviewStep }`, actualizando la fase actual de esa aplicación del candidato al identificador de fase indicado.

#### Scenario: Cambio correcto
- **WHEN** se envía `PUT /candidates/1/stage` con una aplicación del candidato 1 y el identificador de una fase del proceso de su posición
- **THEN** el sistema responde 200 con `{ message: "Candidate stage updated successfully", data }`, donde `data` es la aplicación con su nueva `currentInterviewStep`, y una consulta posterior de candidatos devuelve al candidato en la nueva fase

#### Scenario: Aplicación inexistente o de otro candidato
- **WHEN** el `applicationId` no existe o no pertenece al candidato de la ruta
- **THEN** el sistema responde 404 con un mensaje de error y no modifica ninguna aplicación

#### Scenario: Ruta antigua
- **WHEN** se envía `PUT /candidates/1` con el cuerpo de cambio de fase
- **THEN** el sistema no actualiza la fase de ninguna aplicación

### Requirement: Validación del cambio de fase
El sistema SHALL rechazar con 400 los cambios de fase con datos inválidos, con un mensaje que nombre el campo erróneo.

#### Scenario: applicationId inválido
- **WHEN** el cuerpo no incluye un `applicationId` numérico
- **THEN** el sistema responde 400 con un mensaje que menciona `applicationId`

#### Scenario: currentInterviewStep inválido
- **WHEN** el cuerpo no incluye un `currentInterviewStep` numérico
- **THEN** el sistema responde 400 con un mensaje que menciona `currentInterviewStep`

#### Scenario: Fase de otro proceso
- **WHEN** el `currentInterviewStep` no corresponde a una fase del proceso de la posición de la aplicación
- **THEN** el sistema responde 400 y no modifica la aplicación

### Requirement: Seed re-ejecutable
El sistema SHALL ofrecer un comando de npm en el backend que cargue los datos de ejemplo y que se pueda ejecutar varias veces seguidas sin fallar ni duplicar datos.

#### Scenario: Primera ejecución
- **WHEN** se ejecuta el comando de seed sobre una base de datos con las migraciones aplicadas
- **THEN** la base de datos contiene los datos de ejemplo y el comando termina sin error

#### Scenario: Ejecución repetida
- **WHEN** se vuelve a ejecutar el comando de seed
- **THEN** el comando termina sin error y la base de datos contiene los mismos datos de ejemplo, sin duplicados

### Requirement: Datos de ejemplo para el tablero de fases
El seed SHALL crear las posiciones 1, 2 y 3 y candidatos suficientes para probar el tablero de fases en todos sus casos.

#### Scenario: Candidatos en todas las fases
- **WHEN** se consultan los candidatos de la posición 1 tras el seed
- **THEN** hay al menos un candidato en cada fase de su proceso (incluida "Manager Interview") y las puntuaciones medias incluyen 0 y valores distintos entre 1 y 5

#### Scenario: Fases con el mismo orderIndex
- **WHEN** se consulta el proceso de la posición 1 tras el seed
- **THEN** al menos dos fases comparten `orderIndex`

#### Scenario: Posición con proceso vacío
- **WHEN** se consulta el proceso de la posición 2 tras el seed
- **THEN** el sistema responde 200 con `interviewSteps` vacío

#### Scenario: Posición con proceso y sin candidatos
- **WHEN** se consultan el proceso y los candidatos de la posición 3 tras el seed
- **THEN** el proceso tiene fases y la lista de candidatos está vacía

#### Scenario: Posiciones con estados distintos
- **WHEN** se consulta `GET /positions` tras el seed
- **THEN** las posiciones 1, 2 y 3 tienen los estados `Open`, `Filled` y `Draft` respectivamente
