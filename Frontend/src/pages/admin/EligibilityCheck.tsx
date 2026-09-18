import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Loader2, Search, ShieldCheck } from "lucide-react"

import { getPatients, type Patient } from "@/services/patient"
import {
  checkEligibility,
  searchPayers,
  type Payer,
} from "@/services/eligibility"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EligibilityCheck() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const patientId = searchParams.get("patientId")

  const [patient, setPatient] = useState<Patient | null>(null)

  const [payerSearch, setPayerSearch] = useState("")
  const [payers, setPayers] = useState<Payer[]>([])
  const [selectedPayerId, setSelectedPayerId] = useState("")

  const [loadingPatient, setLoadingPatient] = useState(true)
  const [searchingPayers, setSearchingPayers] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(false)

  const [error, setError] = useState("")

  /*
   * Load selected patient
   */
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoadingPatient(true)
        setError("")

        const patients = await getPatients()

        const selectedPatient = patients.find(
          (item) => item.id === Number(patientId)
        )

        if (!selectedPatient) {
          setError("Patient not found.")
          return
        }

        setPatient(selectedPatient)
        setPayerSearch(selectedPatient.insurance_name)
      } catch (err) {
        console.error(err)
        setError("Unable to load patient information.")
      } finally {
        setLoadingPatient(false)
      }
    }

    if (patientId) {
      loadPatient()
    } else {
      setLoadingPatient(false)
      setError("Patient ID is missing.")
    }
  }, [patientId])

  /*
   * Search insurance payers
   */
  const handlePayerSearch = async () => {
    if (!payerSearch.trim()) {
      setError("Please enter an insurance name.")
      return
    }

    try {
      setSearchingPayers(true)
      setError("")
      setPayers([])
      setSelectedPayerId("")

      const result = await searchPayers(payerSearch.trim())

      const payerList =
        result.items?.map((item) => item.payer).filter(Boolean) ?? []

      setPayers(payerList)

      if (payerList.length === 0) {
        setError("No supported insurance payer found.")
      }
    } catch (err) {
      console.error(err)
      setError("Unable to search insurance payers.")
    } finally {
      setSearchingPayers(false)
    }
  }

  /*
   * Check eligibility
   */
  const handleCheckEligibility = async () => {
    if (!patient) {
      setError("Patient information is missing.")
      return
    }

    if (!selectedPayerId) {
      setError("Please select an insurance payer.")
      return
    }

    try {
      setCheckingEligibility(true)
      setError("")

      const result = await checkEligibility({
        patient_id: patient.id,
        trading_partner_service_id: selectedPayerId,
      })

      /*
       * Eligibility check is complete.
       *
       * Now move to the separate Insurance Benefits page.
       */
      navigate(
        `/admin/benefits?patientId=${patient.id}&eligibilityId=${result.id}`
      )
    } catch (err: any) {
      console.error(err)

      const message =
        err?.response?.data?.detail ||
        "Eligibility check failed. Please try again."

      setError(message)
    } finally {
      setCheckingEligibility(false)
    }
  }

  if (loadingPatient) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading patient information...
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/patients")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>

        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold">Patient not found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error || "Please select a valid patient."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(`/admin/patients/${patient.id}`)}
          className="mb-2 -ml-3 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patient Details
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Eligibility Check
            </h1>

            <p className="text-sm text-muted-foreground">
              Verify insurance eligibility for the selected patient.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Patient Name
              </p>

              <p className="mt-1 font-medium">
                {patient.first_name} {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Date of Birth
              </p>

              <p className="mt-1 font-medium">
                {patient.date_of_birth}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Member ID
              </p>

              <p className="mt-1 font-medium">
                {patient.member_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Group Number
              </p>

              <p className="mt-1 font-medium">
                {patient.group_number || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Payer */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Payer</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Insurance Name
              </label>

              <Input
                value={payerSearch}
                onChange={(event) =>
                  setPayerSearch(event.target.value)
                }
                placeholder="Search insurance company..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handlePayerSearch()
                  }
                }}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handlePayerSearch}
                disabled={searchingPayers}
                className="gap-2"
              >
                {searchingPayers ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Payer
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Payer selection */}
          {payers.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Payer
              </label>

              <Select
                value={selectedPayerId}
                onValueChange={(value) =>
                  setSelectedPayerId(value ?? "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the correct insurance payer" />
                </SelectTrigger>

                <SelectContent>
                  {payers.map((payer) => (
                    <SelectItem
                      key={`${payer.stediId}-${payer.primaryPayerId}`}
                      value={payer.primaryPayerId}
                    >
                      {payer.displayName} —{" "}
                      {payer.primaryPayerId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected payer */}
          {selectedPayerId && (
            <div className="rounded-lg border bg-muted/30 p-4">
              {(() => {
                const selectedPayer = payers.find(
                  (payer) =>
                    payer.primaryPayerId === selectedPayerId
                )

                if (!selectedPayer) return null

                return (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Payer Name
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedPayer.displayName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Primary Payer ID
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedPayer.primaryPayerId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Stedi Payer ID
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedPayer.stediId}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Check Eligibility */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleCheckEligibility}
              disabled={
                !selectedPayerId || checkingEligibility
              }
              className="gap-2"
            >
              {checkingEligibility ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking Eligibility...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Check Eligibility
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}