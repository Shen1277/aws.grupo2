from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field

ServiceName = Literal["EC2", "S3", "RDS"]


class ServiceInfo(BaseModel):
    servicios: List[ServiceName]
    descripcion: str
    autor: str


class ServiceUsage(BaseModel):
    """
    Uso de un servicio.
    - precio_por_hora es opcional: si no se envía, se usa el precio por defecto del sistema.
    - proyecto es opcional: útil para estadísticas por proyecto.
    """
    servicio: ServiceName
    horas: float = Field(gt=0, description="Número de horas de uso del servicio")
    precio_por_hora: Optional[float] = Field(default=None, gt=0, description="Precio por hora (opcional)")
    proyecto: Optional[str] = Field(default=None, description="Nombre del proyecto (opcional)")


class ServiceUsageUpdate(BaseModel):
    """
    Actualización parcial (PATCH) de un usage guardado.
    """
    horas: Optional[float] = Field(default=None, gt=0)
    precio_por_hora: Optional[float] = Field(default=None, gt=0)
    proyecto: Optional[Optional[str]] = None  # permite poner null explícito


class CalculoResponse(BaseModel):
    servicio: ServiceName
    horas: float
    precio_por_hora: float
    total_estimado: float


class StoredUsage(CalculoResponse):
    id: int
    proyecto: Optional[str]
    timestamp: datetime


class PriceUpdate(BaseModel):
    nuevo_precio: float = Field(gt=0, description="Nuevo precio por hora")


class BatchUsageRequest(BaseModel):
    usos: List[ServiceUsage]


class BatchUsageResponse(BaseModel):
    resultados: List[CalculoResponse]
    total_global: float


class StatsSummary(BaseModel):
    total_usos: int
    horas_totales: float
    coste_total: float


class StatsByServiceItem(BaseModel):
    servicio: ServiceName
    usos: int
    horas_totales: float
    coste_total: float


class StatsByProjectItem(BaseModel):
    proyecto: str
    usos: int
    horas_totales: float
    coste_total: float


class MonthlySimulationRequest(BaseModel):
    dias: int = Field(ge=1, le=31)
    horas_diarias_ec2: float = Field(ge=0)
    horas_diarias_s3: float = Field(ge=0)
    horas_diarias_rds: float = Field(ge=0)


class MonthlySimulationResponse(BaseModel):
    dias: int
    coste_ec2: float
    coste_s3: float
    coste_rds: float
    coste_total: float
    coste_total: float
