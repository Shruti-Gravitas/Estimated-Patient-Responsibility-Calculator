from pydantic import BaseModel
from app.services.stedi import (
    check_eligibility,
    search_payers,
)


class EligibilityCheckRequest(BaseModel):
    patient_id: int
    trading_partner_service_id: str