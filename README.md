# AWS Service Simulation API – Grupo 2

## Descripción del proyecto

Este proyecto consiste en una **API REST desarrollada con FastAPI** cuyo objetivo es **simular el uso y el coste de servicios básicos de AWS**, concretamente **EC2, S3 y RDS**.

La aplicación permite:
- Calcular el coste estimado del uso de servicios cloud.
- Registrar y gestionar un historial de usos.
- Obtener estadísticas agregadas por servicio y por proyecto.
- Simular el coste mensual de una infraestructura en la nube.

El proyecto se ha desarrollado como **ejercicio práctico de diseño de APIs**, aplicando principios de organización modular y separación de responsabilidades.

---

## Tecnologías utilizadas

- **Python 3**
- **FastAPI**
- **Uvicorn**
- **Pydantic**
- **Swagger / OpenAPI** (documentación automática)

Los datos se almacenan **en memoria**, sin base de datos, con el objetivo de simplificar el desarrollo y centrarse en la lógica de negocio de la API.

---

## Estructura del proyecto

```text
app/
├── main.py          # Punto de entrada de la aplicación
├── models.py        # Modelos Pydantic (validación y esquemas de datos)
├── store.py         # Lógica de negocio y almacenamiento en memoria
├── routers/
│   ├── pricing.py   # Gestión de precios por servicio
│   ├── usages.py    # CRUD de usos de servicios
│   ├── stats.py     # Estadísticas agregadas
│   └── simulate.py  # Simulación de costes mensuales
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd aws.grupo2
```

*(Reemplazar `<URL_DEL_REPOSITORIO>` por la URL real del repositorio)*

---

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

---

### 3. Ejecutar la aplicación

```bash
uvicorn app.main:app --reload
```

---

### Acceso a la aplicación

La API estará disponible en:

```text
http://127.0.0.1:8000
```

Documentación interactiva (Swagger):

```text
http://127.0.0.1:8000/docs
```

---

## Endpoints principales

### Información y estado
- `GET /` – Endpoint raíz
- `GET /health` – Comprobación de estado del servicio
- `GET /info` – Información general de la API

---

### Gestión de precios
- `GET /pricing` – Obtener precios actuales por servicio
- `PUT /pricing/{servicio}` – Actualizar el precio de un servicio

---

### Cálculo de costes
- `POST /calcular` – Calcular el coste estimado de un uso puntual

---

### Gestión de usos (CRUD)
- `POST /usages` – Crear un nuevo registro de uso
- `GET /usages` – Listar usos registrados (con filtros)
- `GET /usages/{usage_id}` – Obtener un uso concreto
- `PATCH /usages/{usage_id}` – Modificar parcialmente un uso
- `DELETE /usages/{usage_id}` – Eliminar un uso
- `DELETE /usages` – Eliminar todos los usos
- `POST /usages/batch` – Registrar múltiples usos en una sola petición

---

### Estadísticas
- `GET /stats/summary` – Resumen global de uso y coste
- `GET /stats/by-service` – Estadísticas agrupadas por servicio
- `GET /stats/by-project` – Estadísticas agrupadas por proyecto

---

### Simulación
- `POST /simulate/monthly` – Simulación del coste mensual de una infraestructura

---

## Ejemplos de uso

### Crear un uso de servicio

```json
POST /usages
{
  "servicio": "EC2",
  "horas": 10,
  "proyecto": "demo"
}
```

---

### Simulación mensual

```json
POST /simulate/monthly
{
  "dias": 30,
  "horas_diarias_ec2": 5,
  "horas_diarias_s3": 2,
  "horas_diarias_rds": 1
}
```

---

## Decisiones de diseño

- Se utiliza **almacenamiento en memoria** para evitar dependencias externas y facilitar la ejecución del proyecto.
- La lógica de negocio se concentra en la capa `store`, manteniendo los routers simples y enfocados en la gestión de peticiones HTTP.
- Se incluyen endpoints de **estadísticas y simulación** para representar escenarios reales de planificación y control de costes en la nube.
- La arquitectura modular permite ampliar fácilmente el sistema, por ejemplo añadiendo persistencia en base de datos o autenticación.

---

## Observaciones finales

Este proyecto se ha desarrollado con fines académicos como práctica de diseño de APIs REST, validación de datos, documentación automática y organización modular del código.
