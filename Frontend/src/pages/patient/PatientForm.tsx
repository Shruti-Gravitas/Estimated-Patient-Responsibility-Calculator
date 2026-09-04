import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { createPatient } from "@/services/patient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PatientForm() {
  const navigate = useNavigate()

  // Personal Information
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [state, setState] = useState("")

  // Insurance Information
  const [insuranceName, setInsuranceName] = useState("")
  const [memberId, setMemberId] = useState("")
  const [groupNumber, setGroupNumber] = useState("")

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

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
    "Medicare Louisiana",
    " Medicaid Louisiana",
    "Blue Cross Blue Shield of LA",
    "Blue Advantage of LA",
    "Healthy Blue of LA",
    "Aetna",
    "Cigna",
    "United Healthcare",
    "Imagine 360",
    "LA Healthcare connections",
    "Tricare",
    "Champva",
    "Ambetter"
  ]

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setLoading(true)
    setMessage("")
    setError(false)

    try {
      const result = await createPatient({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        state: state,
        insurance_name: insuranceName,
        member_id: memberId,
        group_number: groupNumber || null,
      })

      console.log("Patient created:", result)

      setMessage(
        "Your information has been saved successfully."
      )

      setTimeout(() => {
        navigate("/patient/dashboard")
      }, 800)

    } catch (error) {
      console.error("Failed to create patient:", error)

      setError(true)

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail

        if (backendMessage) {
          setMessage(backendMessage)
        } else {
          setMessage(
            "Unable to save your information. Please try again."
          )
        }
      } else {
        setMessage(
          "Unable to save your information. Please try again."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              E
            </div>

            <div>
              <h1 className="font-semibold text-slate-900">
                EPR Calculator
              </h1>

              <p className="text-xs text-slate-500">
                Patient Portal
              </p>
            </div>

          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/patient/dashboard")}
          >
            Dashboard
          </Button>

        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">

            <span className="font-medium">
              Step 1
            </span>

            <span className="text-slate-400">
              /
            </span>

            <span className="text-slate-500">
              Patient Information
            </span>

          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tell us about yourself
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Enter your personal and insurance information.
            This information will be used to prepare your
            Estimated Patient Responsibility.
          </p>

        </div>


        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Left Panel */}
          <div className="rounded-2xl bg-slate-900 p-8 text-white">

            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-xl">
                ✓
              </div>

              <h3 className="text-2xl font-semibold">
                Secure Patient Information
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                Your information helps us provide an accurate
                estimate of what you may need to pay for your
                healthcare service.
              </p>

            </div>


            {/* Steps */}
            <div className="space-y-6">

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm">
                  1
                </div>

                <div>
                  <p className="font-medium">
                    Personal Information
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Basic information used to identify your
                    patient record.
                  </p>
                </div>

              </div>


              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm">
                  2
                </div>

                <div>
                  <p className="font-medium">
                    Insurance Information
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Your insurance details help determine
                    your estimated responsibility.
                  </p>
                </div>

              </div>


              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm">
                  3
                </div>

                <div>
                  <p className="font-medium">
                    EPR Estimate
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Your provider can use this information
                    to calculate an estimated responsibility.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* Form */}
          <Card className="rounded-2xl border-slate-200 shadow-sm">

            <CardHeader className="border-b">

              <CardTitle className="text-xl">
                Patient Information
              </CardTitle>

              <p className="text-sm text-slate-500">
                Please provide accurate information below.
              </p>

            </CardHeader>


            <CardContent className="p-6">

              <form
                onSubmit={handleSubmit}
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
                      Basic details about the patient.
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
                          setFirstName(event.target.value)
                        }
                        placeholder="Enter first name"
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
                          setLastName(event.target.value)
                        }
                        placeholder="Enter last name"
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
                          setDateOfBirth(event.target.value)
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
                      Enter the information shown on your
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
                          setInsuranceName(event.target.value)
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


                    {/* Member / Subscriber ID */}
                    <div className="space-y-2">

                      <Label htmlFor="memberId">
                        Member / Subscriber ID
                      </Label>

                      <Input
                        id="memberId"
                        value={memberId}
                        onChange={(event) =>
                          setMemberId(event.target.value)
                        }
                        placeholder="Enter member ID"
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
                          setGroupNumber(event.target.value)
                        }
                        placeholder="Enter group number"
                      />

                    </div>

                  </div>

                </div>


                {/* Message */}
                {message && (
                  <div
                    className={`rounded-lg border p-3 ${error
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                      }`}
                  >

                    <p
                      className={`text-center text-sm ${error
                        ? "text-red-600"
                        : "text-green-600"
                        }`}
                    >
                      {message}
                    </p>

                  </div>
                )}


                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? "Saving Information..."
                    : "Save & Continue"}
                </Button>


                <p className="text-center text-xs text-slate-400">
                  Your information is securely associated
                  with your patient account.
                </p>

              </form>

            </CardContent>

          </Card>

        </div>

      </main>

    </div>
  )
}