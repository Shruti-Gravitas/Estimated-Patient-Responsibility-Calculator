import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import {
  getMyPatient,
  updateMyPatient,
  deleteMyPatient,
} from "@/services/patient"

import type {
  Patient,
  PatientCreateData,
} from "@/services/patient"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PatientDashboard() {
  const navigate = useNavigate()

  const [patient, setPatient] =
    useState<Patient | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Edit mode
  const [editing, setEditing] = useState(false)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [message, setMessage] = useState("")

  // Edit form values
  const [patientName, setPatientName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [insuranceCardNumber, setInsuranceCardNumber] =
    useState("")
  const [memberId, setMemberId] = useState("")


  // ==================================================
  // Load Patient
  // ==================================================

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getMyPatient()

        setPatient(data)

      } catch (error) {
        console.error(error)

        setError(
          "Unable to load patient details."
        )

      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [])


  // ==================================================
  // Logout
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("role")

    navigate("/login")
  }


  // ==================================================
  // Start Editing
  // ==================================================

  const handleEdit = () => {
    if (!patient) {
      return
    }

    setPatientName(patient.patient_name)

    setDateOfBirth(patient.date_of_birth)

    setInsuranceCardNumber(
      patient.insurance_card_number
    )

    setMemberId(patient.member_id)

    setMessage("")
    setEditing(true)
  }


  // ==================================================
  // Cancel Editing
  // ==================================================

  const handleCancelEdit = () => {
    setEditing(false)
    setMessage("")
  }


  // ==================================================
  // Save Changes
  // ==================================================

  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setSaving(true)
    setMessage("")

    try {
      const updatedData: PatientCreateData = {
        patient_name: patientName,
        date_of_birth: dateOfBirth,
        insurance_card_number:
          insuranceCardNumber,
        member_id: memberId,
      }

      await updateMyPatient(updatedData)

      // Reload patient information
      const updatedPatient =
        await getMyPatient()

      setPatient(updatedPatient)

      setEditing(false)

      setMessage(
        "Patient information updated successfully."
      )

    } catch (error) {
      console.error(
        "Failed to update patient:",
        error
      )

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.detail ||
          "Unable to update patient information."
        )
      } else {
        setMessage(
          "Unable to update patient information."
        )
      }

    } finally {
      setSaving(false)
    }
  }


  // ==================================================
  // Delete Patient
  // ==================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your patient information?\n\nYou will need to enter your information again before an EPR estimate can be prepared."
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setMessage("")

    try {
      await deleteMyPatient()

      // Keep user account.
      // Only patient details are deleted.
      navigate("/patient")

    } catch (error) {
      console.error(
        "Failed to delete patient:",
        error
      )

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.detail ||
          "Unable to delete patient information."
        )
      } else {
        setMessage(
          "Unable to delete patient information."
        )
      }

    } finally {
      setDeleting(false)
    }
  }


  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mb-3 text-3xl">
            🏥
          </div>

          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>

        </div>

      </div>
    )
  }


  // ==================================================
  // Error
  // ==================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <Card className="w-full max-w-md">

          <CardContent className="p-6 text-center">

            <div className="mb-3 text-4xl">
              ⚠️
            </div>

            <h2 className="text-lg font-semibold">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <Button
              className="mt-5"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </Button>

          </CardContent>

        </Card>

      </div>
    )
  }


  // ==================================================
  // Dashboard
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          Header
      ================================================== */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <div>

            <h1 className="text-xl font-bold tracking-tight">
              EPR Care
            </h1>

            <p className="text-xs text-slate-500">
              Estimated Patient Responsibility
            </p>

          </div>


          {/* Header Actions */}
          <div className="flex items-center gap-3">

            {/* Patient Name */}
            <div className="hidden text-right sm:block mr-2">

              <p className="text-sm font-medium">
                {patient?.patient_name}
              </p>

              <p className="text-xs text-slate-500">
                Patient
              </p>

            </div>


            {/* Edit */}
            <Button
              variant="outline"
              onClick={handleEdit}
              disabled={editing}
            >
              Edit
            </Button>


            {/* Delete */}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || editing}
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </Button>


            {/* Logout */}
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </div>

      </header>


      {/* ==================================================
          Main Content
      ================================================== */}

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
            View and manage your patient and insurance
            information below.
          </p>

        </div>


        {/* Success / Error Message */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">

            <p className="text-sm text-green-700">
              {message}
            </p>

          </div>
        )}


        {/* ==================================================
            EDIT FORM
        ================================================== */}

        {editing ? (

          <Card className="border-0 shadow-sm">

            <CardHeader>

              <CardTitle>
                Edit Patient Information
              </CardTitle>

              <p className="text-sm text-slate-500">
                Update your personal and insurance
                information.
              </p>

            </CardHeader>


            <CardContent>

              <form
                onSubmit={handleSave}
                className="space-y-6"
              >

                {/* Patient Name */}
                <div className="space-y-2">

                  <Label htmlFor="patientName">
                    Patient Name
                  </Label>

                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(event) =>
                      setPatientName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Date of Birth */}
                <div className="space-y-2">

                  <Label htmlFor="dateOfBirth">
                    Date of Birth
                  </Label>

                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                      setDateOfBirth(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Insurance */}
                <div className="space-y-2">

                  <Label htmlFor="insuranceCardNumber">
                    Insurance Card Number
                  </Label>

                  <Input
                    id="insuranceCardNumber"
                    value={insuranceCardNumber}
                    onChange={(event) =>
                      setInsuranceCardNumber(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Member ID */}
                <div className="space-y-2">

                  <Label htmlFor="memberId">
                    Member ID
                  </Label>

                  <Input
                    id="memberId"
                    value={memberId}
                    onChange={(event) =>
                      setMemberId(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Edit Form Buttons */}
                <div className="flex gap-3 pt-2">

                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>

                </div>

              </form>

            </CardContent>

          </Card>

        ) : (

          <>
            {/* ==================================================
                PATIENT INFORMATION
            ================================================== */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Patient Profile */}
              <Card className="border-0 shadow-sm">

                <CardHeader>

                  <CardTitle className="flex items-center gap-2">

                    <span className="text-xl">
                      👤
                    </span>

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

                    <span className="text-xl">
                      💳
                    </span>

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


            {/* ==================================================
                EPR
            ================================================== */}

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
                      Review your estimated out-of-pocket
                      responsibility based on your insurance
                      information.
                    </p>

                  </div>


                  <Button
                    onClick={() =>
                      navigate("/patient/epr")
                    }
                    className="whitespace-nowrap"
                  >
                    View EPR Estimate →
                  </Button>

                </div>

              </CardContent>

            </Card>

          </>
        )}

      </main>

    </div>
  )
}