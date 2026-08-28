from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.patient import Patient
from app.models.user import User
from app.schemas.patient import PatientCreate
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==================================================
# Patient - Create Patient Details
# ==================================================

@router.post("/")
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only patients can create their own patient details
    if current_user.role != "patient":
        raise HTTPException(
            status_code=403,
            detail="Patient access required",
        )

    # Check whether patient details already exist
    existing_patient = (
        db.query(Patient)
        .filter(Patient.user_id == current_user.id)
        .first()
    )

    if existing_patient:
        raise HTTPException(
            status_code=400,
            detail="Patient details already exist",
        )

    # Create patient details linked to logged-in user
    new_patient = Patient(
        user_id=current_user.id,
        patient_name=patient.patient_name,
        date_of_birth=patient.date_of_birth,
        insurance_card_number=patient.insurance_card_number,
        member_id=patient.member_id,
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return {
        "message": "Patient created successfully",
        "patient_id": new_patient.id,
    }


# ==================================================
# Patient - Get Own Details
# ==================================================

@router.get("/me")
def get_my_patient(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only patients can access their own details
    if current_user.role != "patient":
        raise HTTPException(
            status_code=403,
            detail="Patient access required",
        )

    patient = (
        db.query(Patient)
        .filter(Patient.user_id == current_user.id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient details not found",
        )

    return patient


# ==================================================
# Admin - Get All Patients
# ==================================================

@router.get("/")
def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only admin can see all patients
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    patients = db.query(Patient).all()

    return patients