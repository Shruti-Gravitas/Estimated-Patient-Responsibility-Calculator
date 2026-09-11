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

export interface EligibilityCheckResponse {
  id: number
  patient_id: number
  status: string
  stedi_check_id: string | null
  response: Record<string, unknown>
}

export const searchPayers = async (
  query: string
): Promise<PayerSearchResponse> => {
  const response = await api.get("/api/eligibility/payers/search", {
    params: { query },
  })

  return response.data
}

export const checkEligibility = async (
  data: EligibilityCheckData
): Promise<EligibilityCheckResponse> => {
  const response = await api.post("/api/eligibility/check", data)

  return response.data
}