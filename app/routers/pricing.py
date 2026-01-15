from fastapi import APIRouter

from ..models import PriceUpdate, ServiceName
from ..store import store

router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.get("")
def get_pricing():
    return store.get_pricing()


@router.put("/{servicio}")
def update_price(servicio: ServiceName, data: PriceUpdate):
    nuevo = store.set_price(servicio, data.nuevo_precio)
    return {"servicio": servicio, "precio_por_hora": nuevo}
    return {"servicio": servicio, "precio_por_hora": nuevo}
