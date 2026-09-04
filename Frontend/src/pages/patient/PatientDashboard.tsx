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

  // ==================================================
  // Edit Form Values
  // ==================================================

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [state, setState] = useState("")

  const [insuranceName, setInsuranceName] = useState("")
  const [memberId, setMemberId] = useState("")
  const [groupNumber, setGroupNumber] = useState("")


  // ==================================================
  // Dropdown Data
  // ==================================================

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "District of Columbia",
  ]

  const insuranceCompanies = [
    "Aetna",
    "Anthem",
    "Blue Cross Blue Shield",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Medicaid",
    "Medicare",
    "Molina Healthcare",
    "UnitedHealthcare",
  ]


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

    setFirstName(patient.first_name)
    setLastName(patient.last_name)
    setDateOfBirth(patient.date_of_birth)
    setState(patient.state)

    setInsuranceName(patient.insurance_name)
    setMemberId(patient.member_id)
    setGroupNumber(patient.group_number ?? "")

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
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        state: state,
        insurance_name: insuranceName,
        member_id: memberId,
        group_number: groupNumber || null,
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
                {patient?.first_name}{" "}
                {patient?.last_name}
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
            Welcome, {patient?.first_name}{" "}
            {patient?.last_name} 👋
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
                className="space-y-8"
              >

                {/* ==================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <div>

                  <div className="mb-5">

                    <h3 className="font-semibold text-slate-900">
                      Personal Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your basic patient information.
                    </p>

                  </div>


                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* First Name */}
                    <div className="space-y-2">

                      <Label htmlFor="firstName">
                        First Name
                      </Label>

                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(event) =>
                          setFirstName(
                            event.target.value
                          )
                        }
                        required
                      />

                    </div>


                    {/* Last Name */}
                    <div className="space-y-2">

                      <Label htmlFor="lastName">
                        Last Name
                      </Label>

                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(event) =>
                          setLastName(
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


                    {/* State */}
                    <div className="space-y-2">

                      <Label htmlFor="state">
                        State
                      </Label>

                      <select
                        id="state"
                        value={state}
                        onChange={(event) =>
                          setState(event.target.value)
                        }
                        required
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      >

                        <option value="">
                          Select your state
                        </option>

                        {states.map((stateName) => (
                          <option
                            key={stateName}
                            value={stateName}
                          >
                            {stateName}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                </div>


                {/* Divider */}
                <div className="border-t" />


                {/* ==================================================
                    INSURANCE INFORMATION
                ================================================== */}

                <div>

                  <div className="mb-5">

                    <h3 className="font-semibold text-slate-900">
                      Insurance Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update the information shown on your
                      insurance card.
                    </p>

                  </div>


                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Insurance Name */}
                    <div className="space-y-2 sm:col-span-2">

                      <Label htmlFor="insuranceName">
                        Insurance Name
                      </Label>

                      <select
                        id="insuranceName"
                        value={insuranceName}
                        onChange={(event) =>
                          setInsuranceName(
                            event.target.value
                          )
                        }
                        required
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      >

                        <option value="">
                          Select your insurance
                        </option>

                        {insuranceCompanies.map(
                          (insurance) => (
                            <option
                              key={insurance}
                              value={insurance}
                            >
                              {insurance}
                            </option>
                          )
                        )}

                      </select>

                    </div>


                    {/* Member ID */}
                    <div className="space-y-2">

                      <Label htmlFor="memberId">
                        Member / Subscriber ID
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


                    {/* Group Number */}
                    <div className="space-y-2">

                      <Label htmlFor="groupNumber">
                        Group Number
                        <span className="ml-1 text-slate-400">
                          (Optional)
                        </span>
                      </Label>

                      <Input
                        id="groupNumber"
                        value={groupNumber}
                        onChange={(event) =>
                          setGroupNumber(
                            event.target.value
                          )
                        }
                        placeholder="Enter group number"
                      />

                    </div>

                  </div>

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
                INFORMATION CARDS
            ================================================== */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* ==================================================
                  PERSONAL INFORMATION
              ================================================== */}

              <Card className="border-0 shadow-sm">

                <CardHeader>

                  <CardTitle className="flex items-center gap-2">

                    <span className="text-xl">
                      👤
                    </span>

                    Personal Information

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        First Name
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.first_name}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Last Name
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.last_name}
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


                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        State
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.state}
                      </p>

                    </div>

                  </div>

                </CardContent>

              </Card>


              {/* ==================================================
                  INSURANCE INFORMATION
              ================================================== */}

              <Card className="border-0 shadow-sm">

                <CardHeader>

                  <CardTitle className="flex items-center gap-2">

                    <span className="text-xl">
                      💳
                    </span>

                    Insurance Information

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <div className="space-y-5">

                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Insurance Name
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.insurance_name}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Member / Subscriber ID
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.member_id}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Group Number
                      </p>

                      <p className="mt-1 font-medium">
                        {patient?.group_number || "Not provided"}
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

                    <p className="text-sm font-medium text-blue-600">
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
                    className="whitespace-nowrap bg-black hover:cursor-pointer"
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