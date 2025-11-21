# ARQUITECTURA ORIENTADA A SERVICIOS  
## Curso 2025-26  

## FastAPI Project – AWS Service Simulation (Grupo 2)

Este proyecto es una API sencilla desarrollada con **FastAPI** por el **Grupo 2 (Hengan, Shenjian, Alex, Bernat)**.  
La aplicación simula de forma básica algunos servicios de AWS (EC2, S3, RDS) mediante una API REST.

Incluye:

- Un endpoint `GET` para consultar información general de los servicios.
- Un endpoint `POST` para calcular un coste estimado a partir del uso de un servicio.

---

## Estructura del proyecto

```text
aws.grupo2/
│
├── app/
│   ├── main.py        # Punto de entrada de la aplicación FastAPI
│   └── models.py      # Modelos de datos definidos con Pydantic
│
├── requirements.txt   # Dependencias del proyecto
└── README.md          # Documentación del proyecto
```

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/Shen1277/aws.grupo2.git
cd aws.grupo2
```

---

### 2. Crear y activar un entorno virtual

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

---

### 3. Instalar dependencias

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

Esto instalará, entre otros, **FastAPI**, **Uvicorn** y **Pydantic**.

---

### 4. Ejecutar la aplicación FastAPI

Lanza el servidor de desarrollo con:

```bash
uvicorn app.main:app --reload
```

Por defecto, la aplicación estará disponible en:

- API base: <http://127.0.0.1:8000>
- Documentación interactiva (Swagger UI): <http://127.0.0.1:8000/docs>
- Documentación alternativa (ReDoc): <http://127.0.0.1:8000/redoc>

---

## Endpoints de la API

### GET `/info`

- **Descripción**: Devuelve una lista de servicios de AWS simulados y una descripción general.

**Ejemplo de respuesta:**

```json
{
  "servicios": ["EC2", "S3", "RDS"],
  "descripcion": "Ejemplo de API para simular servicios de AWS",
  "autor": "Grupo 2"
}
```

---

### POST `/calcular`

- **Descripción**: Recibe un JSON con la información de uso de un servicio y devuelve el coste estimado.

**Cuerpo de la petición (request body):**

```json
{
  "servicio": "EC2",
  "horas": 10,
  "precio_por_hora": 0.25
}
```

**Ejemplo de respuesta:**

```json
{
  "servicio": "EC2",
  "horas": 10,
  "precio_por_hora": 0.25,
  "total_estimado": 2.5
}
```

---

## Ejemplos con `curl`

1. Probar el endpoint **GET** `/info`:

```bash
curl http://127.0.0.1:8000/info
```

2. Probar el endpoint **POST** `/calcular`:

```bash
curl -X POST "http://127.0.0.1:8000/calcular"      -H "Content-Type: application/json"      -d '{"servicio":"S3","horas":20,"precio_por_hora":0.15}'
```

**Respuesta esperada:**

```json
{
  "servicio": "S3",
  "horas": 20,
  "precio_por_hora": 0.15,
  "total_estimado": 3.0
}
```

---

## Notas

- Este proyecto es un ejemplo para la asignatura **Arquitectura Orientada a Servicios (AOS)**.
- Los datos se gestionan **en memoria**, no se utiliza base de datos.
- El objetivo es practicar diseño REST básico y uso de **FastAPI** para exponer servicios tipo AWS.

---

## Autores

**Grupo 2**

- Hengan  
- Shenjian  
- Alex  
- Bernat  
