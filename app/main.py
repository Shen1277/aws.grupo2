from fastapi import FastAPI
from .models import ServiceInfo, ServiceUsage

app = FastAPI(
    title="FastAPI AWS Service Simulation - Grupo 2",
    description="API de ejemplo para simular servicios básicos de AWS (EC2, S3, RDS).",
    version="1.0.0",
)


@app.get("/info", response_model=ServiceInfo)
def obtener_info():
    """
    Devuelve información básica de los servicios simulados.
    """
    return ServiceInfo(
        servicios=["EC2", "S3", "RDS"],
        descripcion="Ejemplo de API para simular servicios de AWS",
        autor="Grupo 2",
    )


@app.post("/calcular")
def calcular_coste(uso: ServiceUsage):
    """
    Calcula el coste estimado de uso de un servicio AWS.
    """
    total_estimado = uso.horas * uso.precio_por_hora

    return {
        "servicio": uso.servicio,
        "horas": uso.horas,
        "precio_por_hora": uso.precio_por_hora,
        "total_estimado": total_estimado,
    }
