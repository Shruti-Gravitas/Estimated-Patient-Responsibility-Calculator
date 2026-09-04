import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ShieldCheck } from "lucide-react"

import { getPatients } from "@/services/patient"
import type { Patient } from "@/services/patient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PatientDetails() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const patients = await getPatients()

        const selectedPatient = patients.find(
          (item) => item.id === Number(patientId)
        )

        if (!selectedPatient) {
          setError("Patient not found.")
          return
        }

        setPatient(selectedPatient)
      } catch (error) {
        console.error("Unable to load patient", error)
        setError("Unable to load patient information.")
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading patient information...
        </p>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Patient not found."}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/patients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {patient.first_name} {patient.last_name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Patient ID #{patient.id}
            </p>
          </div>

        </div>

        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Active
        </span>

      </div>

      {/* Patient Information */}
      <Card className="border-0 shadow-sm">

        <CardHeader>
          <CardTitle>
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                First Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.first_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Last Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Date of Birth
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.date_of_birth}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                State
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.state}
              </p>
            </div>

          </div>

        </CardContent>

      </Card>

      {/* Insurance Information */}
      <Card className="border-0 shadow-sm">

        <CardHeader>
          <CardTitle>
            Insurance Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Insurance Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.insurance_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Member / Subscriber ID
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.member_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Group Number
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {patient.group_number || "Not provided"}
              </p>
            </div>

          </div>

        </CardContent>

      </Card>

      {/* Next Step */}
      <Card className="border-teal-100 bg-teal-50/50 shadow-sm">

        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="rounded-lg bg-teal-100 p-3">
              <ShieldCheck className="h-6 w-6 text-teal-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Insurance Eligibility
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Verify this patient's insurance coverage before
                calculating their estimated responsibility.
              </p>
            </div>

          </div>

          <Button
            onClick={() =>
              navigate(`/admin/eligibility?patientId=${patient.id}`)
            }
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Check Eligibility
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}