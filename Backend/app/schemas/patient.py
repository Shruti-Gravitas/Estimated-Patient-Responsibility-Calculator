from datetime import date

from pydantic import BaseModel


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    state: str

    insurance_name: str
    member_id: str
    group_number: str | None = None