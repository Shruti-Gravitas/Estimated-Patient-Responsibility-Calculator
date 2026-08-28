from datetime import date
from pydantic import BaseModel


class PatientCreate(BaseModel):
    patient_name: str
    date_of_birth: date
    insurance_card_number: str
    member_id: str