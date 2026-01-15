from typing import Optional

from fastapi import APIRouter, Query

from ..models import (BatchUsageRequest, BatchUsageResponse, CalculoResponse,
                      ServiceName, ServiceUsage, ServiceUsageUpdate,
                      StoredUsage)
from ..store import store

router = APIRouter(prefix="/usages", tags=["usages"])


@router.post("", response_model=StoredUsage)
def create_usage(uso: ServiceUsage):
    return store.create_usage(uso)


@router.get("", response_model=list[StoredUsage])
def list_usages(
    servicio: Optional[ServiceName] = None,
    proyecto: Optional[str] = None,
    min_horas: Optional[float] = Query(None, gt=0),
    max_horas: Optional[float] = Query(None, gt=0),
):
    return store.list_usages(servicio=servicio, proyecto=proyecto, min_horas=min_horas, max_horas=max_horas)


@router.get("/{usage_id}", response_model=StoredUsage)
def get_usage(usage_id: int):
    return store.get_usage(usage_id)


@router.patch("/{usage_id}", response_model=StoredUsage)
def patch_usage(usage_id: int, update: ServiceUsageUpdate):
    return store.patch_usage(usage_id, update)


@router.delete("/{usage_id}")
def delete_usage(usage_id: int):
    store.delete_usage(usage_id)
    return {"detail": f"Usage {usage_id} eliminado"}


@router.delete("")
def clear_all_usages():
    n = store.clear_usages()
    return {"detail": f"Se han eliminado {n} usos. Historial vacío."}


@router.post("/batch", response_model=BatchUsageResponse)
def create_batch(data: BatchUsageRequest):
    resultados: list[CalculoResponse] = []
    total = 0.0

    for uso in data.usos:
        calc = store.calcular(uso)
        resultados.append(calc)
        total += calc.total_estimado

        # opcional: también guardarlo en historial
        store.create_usage(uso)

    return BatchUsageResponse(resultados=resultados, total_global=round(total, 4))
