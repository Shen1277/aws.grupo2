from pydantic import BaseModel, Field
from typing import Literal, List


class ServiceInfo(BaseModel):
    """
    Información general de los servicios simulados.
    """
    servicios: List[str]
    descripcion: str
    autor: str


class ServiceUsage(BaseModel):
    """
    Datos de uso de un servicio de AWS para calcular el coste estimado.
    """
    servicio: Literal[\"EC2\", \"S3\", \"RDS\"]
    horas: float = Field(gt=0, description="Número de horas de uso del servicio")
    precio_por_hora: float = Field(gt=0, description="Precio por hora del servicio")
