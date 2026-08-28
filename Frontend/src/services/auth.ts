import api from "./api"

export interface RegisterData {
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export const registerPatient = async (
  data: RegisterData
) => {
  const response = await api.post(
    "/api/auth/register",
    data
  )

  return response.data
}

export const loginUser = async (
  data: LoginData
) => {
  const response = await api.post(
    "/api/auth/login",
    data
  )

  return response.data
}