import api from "./api"

export interface Patient {
  id: number
  user_id: number
  patient_name: string
  date_of_birth: string
  insurance_card_number: string
  member_id: string
}

export interface PatientCreateData {
  patient_name: string
  date_of_birth: string
  insurance_card_number: string
  member_id: string
}

// Create patient
export const createPatient = async (
  data: PatientCreateData
) => {
  const response = await api.post(
    "/api/patients/",
    data
  )

  return response.data
}

// Get logged-in patient's details
export const getMyPatient = async () => {
  const response = await api.get(
    "/api/patients/me"
  )

  return response.data
}

// Get all patients - Admin
export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get(
    "/api/patients/"
  )

  return response.data
}