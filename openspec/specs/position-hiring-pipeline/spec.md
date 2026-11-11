# position-hiring-pipeline Specification

## Purpose
Permite a los reclutadores ver el proceso de contratación de una posición como un tablero por fases, con los candidatos en su fase actual, y cambiar la fase de un candidato arrastrando su tarjeta.

## Requirements
### Requirement: Página de proceso de una posición
El sistema SHALL mostrar una página por posición en la ruta `/positions/:id`, con el título de la posición en la parte superior y, a la izquierda del título, una flecha que permita volver al listado de posiciones.

#### Scenario: Carga correcta de la página
- **WHEN** el usuario abre `/positions/1` y la posición existe
- **THEN** el sistema muestra el título de la posición devuelto por el backend y, a su izquierda, una flecha de navegación a `/positions`

#### Scenario: Volver al listado
- **WHEN** el usuario pulsa la flecha de navegación
- **THEN** el sistema navega a `/positions`

#### Scenario: Posición inexistente
- **WHEN** el usuario abre `/positions/999` y el backend responde con error
- **THEN** el sistema muestra un mensaje de error y mantiene la flecha de navegación

### Requirement: Columnas por fase del proceso
El sistema SHALL mostrar una columna por cada fase del proceso de contratación de la posición, en el orden indicado por `orderIndex`, con el nombre de la fase como cabecera.

#### Scenario: Una columna por fase
- **WHEN** el proceso de la posición tiene tres fases
- **THEN** el sistema muestra tres columnas con los nombres de las fases en orden ascendente de `orderIndex`

#### Scenario: Fases con el mismo orderIndex
- **WHEN** dos fases tienen el mismo `orderIndex`
- **THEN** el sistema las muestra una tras otra ordenadas por su `id` ascendente

#### Scenario: Proceso sin fases
- **WHEN** el proceso de la posición no tiene fases
- **THEN** el sistema muestra un mensaje indicando que la posición no tiene proceso definido

### Requirement: Tarjeta de candidato en su fase
El sistema SHALL mostrar cada candidato de la posición como una tarjeta dentro de la columna correspondiente a su fase actual, con su nombre completo y su puntuación media. La puntuación se representa con un círculo por cada punto de la media, redondeada al entero más cercano.

#### Scenario: Candidato en una fase
- **WHEN** un candidato tiene como fase actual "Technical Interview" con puntuación media 4
- **THEN** su tarjeta aparece en la columna "Technical Interview" mostrando su nombre completo y cuatro círculos

#### Scenario: Puntuación media con decimales
- **WHEN** un candidato tiene puntuación media 3,5
- **THEN** su tarjeta muestra cuatro círculos

#### Scenario: Candidato sin puntuación
- **WHEN** un candidato tiene puntuación media 0
- **THEN** su tarjeta muestra el nombre completo y ningún círculo

#### Scenario: Fase del candidato sin columna
- **WHEN** la fase actual de un candidato no coincide con ninguna fase del proceso
- **THEN** el sistema muestra una columna adicional "Sin fase" con su tarjeta, y esa columna no aparece si todos los candidatos coinciden con alguna fase

#### Scenario: Columna "Sin fase" de solo lectura
- **WHEN** el usuario intenta arrastrar una tarjeta de la columna "Sin fase" o soltar una tarjeta sobre ella
- **THEN** el sistema no permite arrastrar esas tarjetas ni soltar en esa columna, y no realiza ninguna llamada al backend

#### Scenario: Columna sin candidatos
- **WHEN** una fase no tiene candidatos
- **THEN** la columna se muestra vacía sin error

### Requirement: Cambio de fase arrastrando la tarjeta
El sistema SHALL permitir cambiar la fase de un candidato arrastrando su tarjeta a otra columna, y SHALL persistir el cambio llamando al backend con el identificador de la nueva fase.

#### Scenario: Movimiento a otra fase
- **WHEN** el usuario arrastra la tarjeta de un candidato desde "Initial Screening" hasta "Manager Interview"
- **THEN** el sistema envía la nueva fase al backend y muestra la tarjeta en la columna "Manager Interview"

#### Scenario: Error al guardar el cambio
- **WHEN** el usuario mueve una tarjeta y el backend responde con error
- **THEN** el sistema devuelve la tarjeta a su columna original y muestra un mensaje de error

#### Scenario: Soltar en la misma columna
- **WHEN** el usuario suelta la tarjeta en la columna en la que ya estaba
- **THEN** el sistema no realiza ninguna llamada al backend

### Requirement: Diseño adaptable a móvil
El sistema SHALL mostrar las fases apiladas verticalmente, ocupando todo el ancho de la pantalla, cuando la anchura de la ventana sea de móvil.

#### Scenario: Vista en móvil
- **WHEN** el usuario abre la página con una pantalla de móvil
- **THEN** cada fase ocupa el ancho completo y se muestra debajo de la anterior

### Requirement: Acceso desde el listado de posiciones
El sistema SHALL navegar a la página de proceso de la posición cuando el usuario pulse "Ver proceso" en una tarjeta del listado de posiciones.

#### Scenario: Ir al proceso desde el listado
- **WHEN** el usuario pulsa "Ver proceso" en la posición con id 1
- **THEN** el sistema navega a `/positions/1`

### Requirement: Listado de posiciones con datos reales
El sistema SHALL mostrar en `/positions` una tarjeta por cada posición devuelta por `GET /positions`, con título, fecha límite, estado en español y el campo Manager sin valor.

#### Scenario: Posiciones del backend
- **WHEN** el usuario abre `/positions` y el backend devuelve posiciones
- **THEN** ve una tarjeta por posición con su título y su fecha límite (`YYYY-MM-DD`, vacía si no hay) y el campo Manager sin valor

#### Scenario: Estado en español
- **WHEN** una posición llega con estado `Open`, `Filled`, `Closed` o `Draft`
- **THEN** la tarjeta muestra Abierto, Contratado, Cerrado o Borrador respectivamente, y un estado desconocido se muestra tal cual

#### Scenario: Carga y error
- **WHEN** la petición está en curso, falla o no devuelve posiciones
- **THEN** el sistema muestra respectivamente un indicador de carga, un mensaje de error o un mensaje de lista vacía
