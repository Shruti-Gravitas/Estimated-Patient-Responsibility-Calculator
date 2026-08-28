import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getMyPatient } from "@/services/patient"
import type { Patient } from "@/services/patient"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export default function PatientDashboard() {
  const navigate = useNavigate()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getMyPatient()
        setPatient(data)
      } catch (error) {
        console.error(error)
        setError("Unable to load patient details.")
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("role")

    navigate("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-3 text-3xl">🏥</div>

          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-3 text-4xl">⚠️</div>

            <h2 className="text-lg font-semibold">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <Button
              className="mt-5"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              EPR Care
            </h1>

            <p className="text-xs text-slate-500">
              Estimated Patient Responsibility
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {patient?.patient_name}
              </p>

              <p className="text-xs text-slate-500">
                Patient
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </div>

      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">

          <p className="text-sm font-medium text-slate-500">
            Patient Portal
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome, {patient?.patient_name} 👋
          </h2>

          <p className="mt-2 text-slate-500">
            View your patient and insurance information below.
          </p>

        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* Patient Profile */}
          <Card className="border-0 shadow-sm">

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                Patient Profile
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Patient Name
                  </p>

                  <p className="mt-1 font-medium">
                    {patient?.patient_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Date of Birth
                  </p>

                  <p className="mt-1 font-medium">
                    {patient?.date_of_birth}
                  </p>
                </div>

              </div>

            </CardContent>

          </Card>

          {/* Insurance */}
          <Card className="border-0 shadow-sm">

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                Insurance
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Insurance Card
                  </p>

                  <p className="mt-1 font-medium">
                    {patient?.insurance_card_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Member ID
                  </p>

                  <p className="mt-1 font-medium">
                    {patient?.member_id}
                  </p>
                </div>

              </div>

            </CardContent>

          </Card>

        </div>

        {/* EPR Section */}
        <Card className="mt-6 border-0 shadow-sm">

          <CardContent className="p-8">

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="text-sm font-medium">
                  Estimated Patient Responsibility
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Check your healthcare estimate
                </h3>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Review your estimated out-of-pocket responsibility
                  based on your insurance information.
                </p>

              </div>

              <Button
                onClick={() => navigate("/patient/epr")}
                className="whitespace-nowrap"
              >
                View EPR Estimate →
              </Button>

            </div>

          </CardContent>

        </Card>

      </main>

    </div>
  )
}