import os

import httpx
from dotenv import load_dotenv

load_dotenv()

STEDI_MODE = os.getenv("STEDI_MODE", "production")

STEDI_API_KEY = os.getenv("STEDI_API_KEY")

STEDI_API_URL = os.getenv(
    "STEDI_API_URL",
    "https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3",
)

STEDI_PROVIDER_ORGANIZATION_NAME = os.getenv(
    "STEDI_PROVIDER_ORGANIZATION_NAME",
    "EPR Care",
)

STEDI_PROVIDER_NPI = os.getenv(
    "STEDI_PROVIDER_NPI",
    "1999999984",
)


async def check_aetna_test_eligibility():
    """
    Sends Stedi's official Aetna subscriber-only mock request.

    This is ONLY for development/testing with a Stedi TEST API key.
    """

    if not STEDI_API_KEY:
        raise ValueError("STEDI_API_KEY is not configured")

    if STEDI_MODE != "test":
        raise ValueError(
            "check_aetna_test_eligibility can only be used when "
            "STEDI_MODE=test"
        )

    payload = {
        "controlNumber": "112233445",
        "tradingPartnerServiceId": "60054",
        "provider": {
            "organizationName": STEDI_PROVIDER_ORGANIZATION_NAME,
            "npi": STEDI_PROVIDER_NPI,
        },
        "subscriber": {
            "firstName": "Jane",
            "lastName": "Doe",
            "dateOfBirth": "20040404",
            "memberId": "AETNA12345",
        },
        "encounter": {
            "serviceTypeCodes": ["30"],
        },
    }

    headers = {
        "Authorization": STEDI_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                STEDI_API_URL,
                json=payload,
                headers=headers,
            )
    except httpx.RequestError as error:
        raise RuntimeError(
            f"Unable to connect to Stedi: {error}"
        ) from error

    if response.status_code >= 400:
        raise RuntimeError(
            f"Stedi request failed: "
            f"{response.status_code} - {response.text}"
        )

    try:
        return response.json()
    except ValueError as error:
        raise RuntimeError(
            f"Stedi returned a non-JSON response: {response.text}"
        ) from error


async def check_eligibility(
    *,
    trading_partner_service_id: str,
    first_name: str,
    last_name: str,
    date_of_birth: str,
    member_id: str,
):
    """
    Normal eligibility request.

    This will be used later for production/real patient data.
    """

    if not STEDI_API_KEY:
        raise ValueError("STEDI_API_KEY is not configured")

    payload = {
        "tradingPartnerServiceId": trading_partner_service_id,
        "encounter": {
            "serviceTypeCodes": ["30"],
        },
        "provider": {
            "organizationName": STEDI_PROVIDER_ORGANIZATION_NAME,
            "npi": STEDI_PROVIDER_NPI,
        },
        "subscriber": {
            "firstName": first_name,
            "lastName": last_name,
            "dateOfBirth": date_of_birth.replace("-", ""),
            "memberId": member_id,
        },
    }

    headers = {
        "Authorization": STEDI_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                STEDI_API_URL,
                json=payload,
                headers=headers,
            )
    except httpx.RequestError as error:
        raise RuntimeError(
            f"Unable to connect to Stedi: {error}"
        ) from error

    if response.status_code >= 400:
        raise RuntimeError(
            f"Stedi request failed: "
            f"{response.status_code} - {response.text}"
        )

    try:
        return response.json()
    except ValueError as error:
        raise RuntimeError(
            f"Stedi returned a non-JSON response: {response.text}"
        ) from error


async def search_payers(query: str):
    if not STEDI_API_KEY:
        raise ValueError("STEDI_API_KEY is not configured")

    url = (
        "https://healthcare.us.stedi.com/"
        "2024-04-01/payers/search"
    )

    params = {
        "query": query,
        "eligibilityCheck": "SUPPORTED",
        "coverageTypes": "medical",
        "pageSize": 20,
    }

    headers = {
        "Authorization": STEDI_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                params=params,
                headers=headers,
            )
    except httpx.RequestError as error:
        raise RuntimeError(
            f"Unable to connect to Stedi payer search: {error}"
        ) from error

    if response.status_code >= 400:
        raise RuntimeError(
            f"Stedi payer search failed: "
            f"{response.status_code} - {response.text}"
        )

    try:
        return response.json()
    except ValueError as error:
        raise RuntimeError(
            f"Stedi payer search returned non-JSON data: "
            f"{response.text}"
        ) from error