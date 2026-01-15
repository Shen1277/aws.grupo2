from collections import defaultdict

from fastapi import APIRouter

from ..models import (ServiceName, StatsByProjectItem, StatsByServiceItem,
                      StatsSummary)
from ..store import store

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary", response_model=StatsSummary)
def summary():
    usages = store.list_usages()
    total_usos = len(usages)
    horas_totales = sum(u.horas for u in usages)
    coste_total = sum(u.total_estimado for u in usages)

    return StatsSummary(
        total_usos=total_usos,
        horas_totales=round(horas_totales, 4),
        coste_total=round(coste_total, 4),
    )


@router.get("/by-service", response_model=list[StatsByServiceItem])
def by_service():
    usages = store.list_usages()
    agg_usos = defaultdict(int)
    agg_horas = defaultdict(float)
    agg_coste = defaultdict(float)

    for u in usages:
        agg_usos[u.servicio] += 1
        agg_horas[u.servicio] += u.horas
        agg_coste[u.servicio] += u.total_estimado

    out = []
    for servicio in ["EC2", "S3", "RDS"]:
        out.append(
            StatsByServiceItem(
                servicio=servicio,  # type: ignore
                usos=agg_usos[servicio],
                horas_totales=round(agg_horas[servicio], 4),
                coste_total=round(agg_coste[servicio], 4),
            )
        )
    return out


@router.get("/by-project", response_model=list[StatsByProjectItem])
def by_project():
    usages = store.list_usages()
    agg_usos = defaultdict(int)
    agg_horas = defaultdict(float)
    agg_coste = defaultdict(float)

    for u in usages:
        key = u.proyecto or "SIN_PROYECTO"
        agg_usos[key] += 1
        agg_horas[key] += u.horas
        agg_coste[key] += u.total_estimado

    out = []
    for proyecto, usos in sorted(agg_usos.items(), key=lambda x: x[0].lower()):
        out.append(
            StatsByProjectItem(
                proyecto=proyecto,
                usos=usos,
                horas_totales=round(agg_horas[proyecto], 4),
                coste_total=round(agg_coste[proyecto], 4),
            )
        )
    return out

