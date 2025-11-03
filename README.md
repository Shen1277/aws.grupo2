
# ARQUITECTURA ORIENTADA A SERVICIOS 
## Curso 2025-26 
## FastAPI Project

# FastAPI Project – AWS Service Simulation

This is a simple FastAPI-based project developed by **Grupo 2 (Hengan, Shenjian, Alex, Bernat)**.  
It simulates basic AWS services using a RESTful API.  
The project includes GET and POST endpoints that allow users to retrieve service information and calculate estimated costs.

---

## Project Structure

```bash
grupo2/
│
├── app/
│   ├── main.py               # Main entry point for the FastAPI application
│   └── models.py             # Defines the data models using Pydantic
│
├── requirements.txt          # Dependencies for the project
└── README.md                 # Project documentation
```

---

## Project Setup

### 1. **Clone the Project**

First, clone the project repository to your local machine:

```bash
git clone https://github.com/mcastrol/aossample.git
cd aossample/grupo2
```

---

### 2. **Create and Activate a Python Virtual Environment**

Create a virtual environment to manage dependencies.

**On Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

---

### 3. **Install Dependencies from `requirements.txt`**

Once the virtual environment is activated, install the project dependencies:

```bash
pip install -r requirements.txt
```

This will install all the necessary packages such as **FastAPI**, **Uvicorn**, and **Pydantic**.

---

### 4. **Run the FastAPI Application**

To run the FastAPI application, use the following command:

```bash
uvicorn app.main:app --reload
```

The application will be available at:

- **Local URL:** http://127.0.0.1:8000  
- **Swagger UI:** http://127.0.0.1:8000/docs  
- **ReDoc:** http://127.0.0.1:8000/redoc

---

## API Endpoints

### **GET** `/info`
- **Description**: Returns a list of AWS services and a short description.

**Example Request:**
```bash
GET /info
```

**Response:**
```json
{
  "servicios": ["EC2", "S3", "RDS"],
  "descripcion": "Ejemplo de API para simular servicios de AWS",
  "autor": "Grupo 2"
}
```

---

### **POST** `/calcular`
- **Description**: Accepts JSON data representing service usage and calculates the estimated cost.

**Request Body:**
```json
{
  "servicio": "EC2",
  "horas": 10,
  "precio_por_hora": 0.25
}
```

**Response:**
```json
{
  "servicio": "EC2",
  "horas": 10,
  "precio_por_hora": 0.25,
  "total_estimado": 2.5
}
```

---

## Example Usage (with `curl`)

**1. Test the GET endpoint:**
```bash
curl http://127.0.0.1:8000/info
```

**2. Test the POST endpoint:**
```bash
curl -X POST http://127.0.0.1:8000/calcular -H "Content-Type: application/json"   -d '{"servicio":"S3","horas":20,"precio_por_hora":0.15}'
```

**Response Example:**
```json
{
  "servicio": "S3",
  "horas": 20,
  "precio_por_hora": 0.15,
  "total_estimado": 3.0
}
```

---

## Notes

- This is a **demo project** created for the course *Arquitectura Orientada a Servicios* (AOS).  
- The API simulates basic AWS functionalities (EC2, S3, RDS).  
- The data is stored **in memory only**, no database connection is required.  
- The goal is to demonstrate **simple RESTful design and basic API logic** using **FastAPI**.

---

## Authors

**Grupo 2:**  
- Hengan  
- Shenjian  
- Alex  
- Bernat
