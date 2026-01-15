from fastapi import APIRouter

from ..models import MonthlySimulationRequest, MonthlySimulationResponse
from ..store import store

router = APIRouter(prefix="/simulate", tags=["simulate"])


@router.post("/monthly", response_model=MonthlySimulationResponse)
def simulate_monthly(req: MonthlySimulationRequest):
    p = store.get_pricing()

    coste_ec2 = p["EC2"] * req.horas_diarias_ec2 * req.dias
    coste_s3 = p["S3"] * req.horas_diarias_s3 * req.dias
    coste_rds = p["RDS"] * req.horas_diarias_rds * req.dias
    total = coste_ec2 + coste_s3 + coste_rds

    return MonthlySimulationResponse(
        dias=req.dias,
        coste_ec2=round(coste_ec2, 4),
        coste_s3=round(coste_s3, 4),
        coste_rds=round(coste_rds, 4),
        coste_total=round(total, 4),
    )
    
