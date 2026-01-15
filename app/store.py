from datetime import datetime
from typing import Dict, List, Optional, Tuple

from fastapi import HTTPException

from .models import (CalculoResponse, ServiceName, ServiceUsage,
                     ServiceUsageUpdate, StoredUsage)


class InMemoryStore:
    """
    Almacén en memoria:
    - precios por defecto (pricing)
    - historial de usos (usages)
    """

    def __init__(self) -> None:
        self.pricing: Dict[ServiceName, float] = {
            "EC2": 0.12,
            "S3": 0.023,
            "RDS": 0.20,
        }
        self.usages: List[StoredUsage] = []
        self.next_id: int = 1

    # ---------- Pricing ----------
    def get_pricing(self) -> Dict[ServiceName, float]:
        return self.pricing

    def set_price(self, servicio: ServiceName, nuevo_precio: float) -> float:
        self.pricing[servicio] = round(nuevo_precio, 4)
        return self.pricing[servicio]

    # ---------- Cálculo ----------
    def calcular(self, uso: ServiceUsage) -> CalculoResponse:
        precio = uso.precio_por_hora if uso.precio_por_hora is not None else self.pricing[uso.servicio]
        total = round(precio * uso.horas, 4)
        return CalculoResponse(
            servicio=uso.servicio,
            horas=uso.horas,
            precio_por_hora=precio,
            total_estimado=total,
        )

    # ---------- Usages CRUD ----------
    def create_usage(self, uso: ServiceUsage) -> StoredUsage:
        calc = self.calcular(uso)
        stored = StoredUsage(
            id=self.next_id,
            servicio=calc.servicio,
            horas=calc.horas,
            precio_por_hora=calc.precio_por_hora,
            total_estimado=calc.total_estimado,
            proyecto=uso.proyecto,
            timestamp=datetime.utcnow(),
        )
        self.usages.append(stored)
        self.next_id += 1
        return stored

    def list_usages(
        self,
        servicio: Optional[ServiceName] = None,
        proyecto: Optional[str] = None,
        min_horas: Optional[float] = None,
        max_horas: Optional[float] = None,
    ) -> List[StoredUsage]:
        res = self.usages

        if servicio is not None:
            res = [u for u in res if u.servicio == servicio]
        if proyecto is not None:
            res = [u for u in res if (u.proyecto or "").lower() == proyecto.lower()]
        if min_horas is not None:
            res = [u for u in res if u.horas >= min_horas]
        if max_horas is not None:
            res = [u for u in res if u.horas <= max_horas]

        return res

    def get_usage(self, usage_id: int) -> StoredUsage:
        for u in self.usages:
            if u.id == usage_id:
                return u
        raise HTTPException(status_code=404, detail=f"Usage con id {usage_id} no encontrado")

    def patch_usage(self, usage_id: int, update: ServiceUsageUpdate) -> StoredUsage:
        u = self.get_usage(usage_id)

        # Actualizamos campos si vienen en la petición
        if update.horas is not None:
            u.horas = update.horas
        if update.precio_por_hora is not None:
            u.precio_por_hora = update.precio_por_hora
        if update.proyecto is not None:
            u.proyecto = update.proyecto

        # Recalcular total_estimado siempre que cambie horas o precio
        u.total_estimado = round(u.horas * u.precio_por_hora, 4)
        return u

    def delete_usage(self, usage_id: int) -> None:
        u = self.get_usage(usage_id)
        self.usages.remove(u)

    def clear_usages(self) -> int:
        n = len(self.usages)
        self.usages.clear()
        self.next_id = 1
        return n


store = InMemoryStore()

store = InMemoryStore()
