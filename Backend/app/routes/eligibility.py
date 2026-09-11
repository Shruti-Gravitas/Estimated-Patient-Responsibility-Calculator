from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import SessionLocal
from app.models.eligibility import EligibilityCheck
from app.models.patient import Patient
from app.models.user import User
from app.schemas.eligibility import EligibilityCheckRequest
from app.services.stedi import check_eligibility
from app.services.stedi import (
    check_aetna_test_eligibility,
    check_eligibility,
    search_payers,
)


router = APIRouter(
    prefix="/api/eligibility",
    tags=["Eligibility"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/payers/search")
async def search_eligibility_payers(
    query: str,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Payer search query is required",
        )

    try:
        return await search_payers(query.strip())

    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        )


@router.post("/test/aetna")
async def test_aetna_eligibility(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    try:
        result = await check_aetna_test_eligibility()

        return {
            "message": "Aetna Stedi test eligibility successful",
            "response": result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        )


@router.post("/check")
async def run_eligibility_check(
    data: EligibilityCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    try:
        result = await check_eligibility(
            trading_partner_service_id=data.trading_partner_service_id,
            first_name=patient.first_name,
            last_name=patient.last_name,
            date_of_birth=patient.date_of_birth.isoformat(),
            member_id=patient.member_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        )

    stedi_check_id = result.get("id")

    eligibility = EligibilityCheck(
        patient_id=patient.id,
        status="completed",
        trading_partner_service_id=data.trading_partner_service_id,
        stedi_check_id=stedi_check_id,
        response=result,
    )

    db.add(eligibility)
    db.commit()
    db.refresh(eligibility)

    return {
        "id": eligibility.id,
        "patient_id": patient.id,
        "status": eligibility.status,
        "stedi_check_id": eligibility.stedi_check_id,
        "response": result,
    }
