import api from "./api"

export interface Payer {
  stediId: string
  displayName: string
  primaryPayerId: string
  aliases: string[]
  names: string[]
}

export interface PayerSearchItem {
  payer: Payer
}

export interface PayerSearchResponse {
  items: PayerSearchItem[]
}

export interface EligibilityCheckData {
  patient_id: number
  trading_partner_service_id: string
}

export interface BenefitNetwork {
  copay: number | null
  coinsurance: number | null
}

export interface ServiceBenefit {
  service: string
  in_network: BenefitNetwork
  out_of_network: BenefitNetwork
  descriptions?: string[]
}

export interface DeductibleNetwork {
  contract: number | null
  remaining: number | null
}

export interface OutOfPocketNetwork {
  contract: number | null
  remaining: number | null
}

export interface NormalizedEligibility {
  payer: {
    name: string | null
    payer_id: string | null
  }

  subscriber: {
    member_id: string | null
    first_name: string | null
    last_name: string | null
    date_of_birth: string | null
  }

  eligibility: {
    status: string
    plan: string | null
    plan_type: string | null
    effective_date: string | null
    service_date: string | null
  }

  benefits: {
    deductible: {
      in_network: DeductibleNetwork
      out_of_network: DeductibleNetwork
    }

    out_of_pocket: {
      in_network: OutOfPocketNetwork
      out_of_network: OutOfPocketNetwork
    }

    services: Record<string, ServiceBenefit>
  }
}

export interface EligibilityCheckResponse {
  id: number
  patient_id: number
  status: string
  stedi_check_id: string | null
  response: Record<string, unknown>
  eligibility?: NormalizedEligibility
}

/**
 * Search insurance payers through Stedi
 */
export const searchPayers = async (
  query: string
): Promise<PayerSearchResponse> => {
  const response = await api.get("/api/eligibility/payers/search", {
    params: { query },
  })

  return response.data
}

/**
 * Check eligibility for a selected patient
 */
export const checkEligibility = async (
  data: EligibilityCheckData
): Promise<EligibilityCheckResponse> => {
  const response = await api.post("/api/eligibility/check", data)

  return response.data
}

export const getEligibilityCheck = async (
  eligibilityId: number
): Promise<EligibilityCheckResponse> => {
  const response = await api.get(
    `/api/eligibility/${eligibilityId}`
  )

  return response.data
}