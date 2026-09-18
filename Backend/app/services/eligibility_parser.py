from typing import Any


def _to_number(value: Any) -> float | None:
    """Convert a Stedi benefit value to a number."""
    if value is None:
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _to_percentage(value: Any) -> float | None:
    """
    Stedi returns coinsurance values like:
        0    -> 0%
        0.2  -> 20%
        0.5  -> 50%
    """
    number = _to_number(value)

    if number is None:
        return None

    return number * 100


def parse_eligibility_response(response: dict) -> dict:
    """
    Convert the raw Stedi eligibility response into a
    frontend-friendly structure.

    This parser currently focuses on:
    - Eligibility status
    - Plan information
    - Deductible
    - Out-of-pocket maximum
    - Copays
    - Coinsurance
    """

    plan_information = response.get("planInformation", {})
    plan_date_information = response.get("planDateInformation", {})
    plan_status = response.get("planStatus", [])
    benefits_information = response.get("benefitsInformation", [])

    # --------------------------------------------------
    # Eligibility
    # --------------------------------------------------

    eligibility_status = "Unknown"
    plan_name = None

    for status in plan_status:
        if status.get("status"):
            eligibility_status = status["status"]

        if status.get("planDetails"):
            plan_name = status["planDetails"]

    # --------------------------------------------------
    # Plan
    # --------------------------------------------------

    insurance_type = None

    for benefit in benefits_information:
        if benefit.get("name") == "Active Coverage":
            insurance_type = benefit.get("insuranceType")
            plan_name = (
                benefit.get("planCoverage")
                or plan_name
            )
            break

    # --------------------------------------------------
    # Benefit containers
    # --------------------------------------------------

    deductible = {
        "in_network": {
            "contract": None,
            "remaining": None,
        },
        "out_of_network": {
            "contract": None,
            "remaining": None,
        },
    }

    out_of_pocket = {
        "in_network": {
            "contract": None,
            "remaining": None,
        },
        "out_of_network": {
            "contract": None,
            "remaining": None,
        },
    }

    service_benefits: dict[str, dict] = {}

    # --------------------------------------------------
    # Parse benefits
    # --------------------------------------------------

    for benefit in benefits_information:

        name = benefit.get("name")
        network = benefit.get("inPlanNetworkIndicator")

        if network == "Yes":
            network_type = "in_network"
        elif network == "No":
            network_type = "out_of_network"
        else:
            network_type = None

        time_qualifier = benefit.get("timeQualifier")
        amount = _to_number(benefit.get("benefitAmount"))

        # ----------------------------------------------
        # Deductible
        # ----------------------------------------------

        if name == "Deductible" and network_type:

            if time_qualifier == "Contract":
                deductible[network_type]["contract"] = amount

            elif time_qualifier == "Remaining":
                deductible[network_type]["remaining"] = amount

        # ----------------------------------------------
        # Out-of-pocket maximum
        # ----------------------------------------------

        elif name == "Out of Pocket (Stop Loss)" and network_type:

            if time_qualifier == "Contract":
                out_of_pocket[network_type]["contract"] = amount

            elif time_qualifier == "Remaining":
                out_of_pocket[network_type]["remaining"] = amount

        # ----------------------------------------------
        # Copay
        # ----------------------------------------------

        elif name == "Co-Payment" and network_type:

            service_types = benefit.get("serviceTypes", [])
            descriptions = benefit.get(
                "additionalInformation",
                [],
            )

            service_names = [
                item.get("description")
                for item in descriptions
                if item.get("description")
            ]

            for service in service_types:

                key = service.lower().replace(" ", "_")

                service_benefits.setdefault(
                    key,
                    {
                        "service": service,
                        "in_network": {
                            "copay": None,
                            "coinsurance": None,
                        },
                        "out_of_network": {
                            "copay": None,
                            "coinsurance": None,
                        },
                    },
                )

                service_benefits[key][network_type]["copay"] = amount

                if service_names:
                    service_benefits[key]["descriptions"] = service_names

        # ----------------------------------------------
        # Coinsurance
        # ----------------------------------------------

        elif name == "Co-Insurance" and network_type:

            service_types = benefit.get("serviceTypes", [])
            descriptions = benefit.get(
                "additionalInformation",
                [],
            )

            service_names = [
                item.get("description")
                for item in descriptions
                if item.get("description")
            ]

            percentage = _to_percentage(
                benefit.get("benefitPercent")
            )

            for service in service_types:

                key = service.lower().replace(" ", "_")

                service_benefits.setdefault(
                    key,
                    {
                        "service": service,
                        "in_network": {
                            "copay": None,
                            "coinsurance": None,
                        },
                        "out_of_network": {
                            "copay": None,
                            "coinsurance": None,
                        },
                    },
                )

                service_benefits[key][network_type][
                    "coinsurance"
                ] = percentage

                if service_names:
                    service_benefits[key]["descriptions"] = service_names

    # --------------------------------------------------
    # Return normalized response
    # --------------------------------------------------

    return {
        "payer": {
            "name": response.get("payer", {}).get("name"),
            "payer_id": response.get(
                "tradingPartnerServiceId"
            ),
        },

        "subscriber": {
            "member_id": response.get(
                "subscriber", {}
            ).get("memberId"),
            "first_name": response.get(
                "subscriber", {}
            ).get("firstName"),
            "last_name": response.get(
                "subscriber", {}
            ).get("lastName"),
            "date_of_birth": response.get(
                "subscriber", {}
            ).get("dateOfBirth"),
        },

        "eligibility": {
            "status": eligibility_status,
            "plan": plan_name,
            "plan_type": insurance_type,
            "effective_date": plan_date_information.get(
                "planBegin"
            ),
            "service_date": plan_date_information.get(
                "service"
            ),
        },

        "benefits": {
            "deductible": deductible,
            "out_of_pocket": out_of_pocket,
            "services": service_benefits,
        },
    }