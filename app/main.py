from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import ServiceInfo, ServiceUsage
from .routers.pricing import router as pricing_router
from .routers.simulate import router as simulate_router
from .routers.stats import router as stats_router
from .routers.usages import router as usages_router
from .store import store

app = FastAPI(
    title="FastAPI AWS Service Simulation - Grupo 2",
    description="API ampliada para simular servicios básicos de AWS (EC2, S3, RDS) con historial, estadísticas y simulaciones.",
    version="2.0.0",
)

# CORS (por si luego añadís UI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(pricing_router)
app.include_router(usages_router)
app.include_router(stats_router)
app.include_router(simulate_router)


@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚀", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/info", response_model=ServiceInfo)
def obtener_info():
    return ServiceInfo(
        servicios=["EC2", "S3", "RDS"],
        descripcion="API para simular servicios de AWS con cálculo, historial, estadísticas y simulaciones.",
        autor="Grupo 2",
    )


@app.post("/calcular")
def calcular_coste(uso: ServiceUsage):
    """
    Calcula el coste estimado de uso de un servicio AWS.
    - Si no se envía precio_por_hora, se usa el precio por defecto actual.
    """
    calc = store.calcular(uso)
    return calc.model_dump()
