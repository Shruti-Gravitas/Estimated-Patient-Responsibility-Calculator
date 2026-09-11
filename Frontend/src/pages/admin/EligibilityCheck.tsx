import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Loader2, Search } from "lucide-react"

import { getPatients, type Patient } from "../../services/patient"
import {
  checkEligibility,
  searchPayers,
  type Payer,
  type EligibilityCheckResponse,
} from "../../services/eligibility"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

export default function EligibilityCheck() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const patientId = Number(searchParams.get("patientId"))

  const [patient, setPatient] = useState<Patient | null>(null)

  const [payerSearch, setPayerSearch] = useState("")
  const [payers, setPayers] = useState<Payer[]>([])
  const [selectedPayer, setSelectedPayer] = useState<Payer | null>(null)

  const [loadingPatient, setLoadingPatient] = useState(true)
  const [searchingPayers, setSearchingPayers] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(false)

  const [eligibilityResult, setEligibilityResult] =
    useState<EligibilityCheckResponse | null>(null)

  const [error, setError] = useState("")

  // --------------------------------------------------
  // Load patient
  // --------------------------------------------------

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoadingPatient(true)
        setError("")

        const patients = await getPatients()

        const foundPatient = patients.find(
          (item) => item.id === patientId
        )

        if (!foundPatient) {
          setError("Patient not found")
          return
        }

        setPatient(foundPatient)

        // Start payer search with patient's insurance name
        setPayerSearch(foundPatient.insurance_name)
      } catch (err) {
        console.error(err)
        setError("Failed to load patient information")
      } finally {
        setLoadingPatient(false)
      }
    }

    if (patientId) {
      loadPatient()
    } else {
      setError("Invalid patient ID")
      setLoadingPatient(false)
    }
  }, [patientId])

  // --------------------------------------------------
  // Search payers
  // --------------------------------------------------

  const handlePayerSearch = async () => {
    if (!payerSearch.trim()) {
      return
    }

    try {
      setSearchingPayers(true)
      setError("")
      setSelectedPayer(null)

      const result = await searchPayers(payerSearch.trim())

      setPayers(
        result.items.map((item) => item.payer)
      )
    } catch (err) {
      console.error(err)
      setError("Failed to search insurance payers")
    } finally {
      setSearchingPayers(false)
    }
  }

  // --------------------------------------------------
  // Check eligibility
  // --------------------------------------------------

  const handleCheckEligibility = async () => {
    if (!patient || !selectedPayer) {
      return
    }

    try {
      setCheckingEligibility(true)
      setError("")
      setEligibilityResult(null)

      const result = await checkEligibility({
        patient_id: patient.id,
        trading_partner_service_id:
          selectedPayer.primaryPayerId,
      })

      setEligibilityResult(result)
    } catch (err) {
      console.error(err)
      setError("Eligibility check failed")
    } finally {
      setCheckingEligibility(false)
    }
  }

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (loadingPatient) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  // --------------------------------------------------
  // Error / patient not found
  // --------------------------------------------------

  if (!patient) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Patient not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-2 px-0"
            onClick={() =>
              navigate(`/admin/patients/${patient.id}`)
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient
          </Button>

          <h1 className="text-2xl font-semibold">
            Eligibility Check
          </h1>

          <p className="text-sm text-muted-foreground">
            Verify the patient's insurance eligibility through Stedi.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Patient Information */}

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-muted-foreground">
                Patient Name
              </p>

              <p className="font-medium">
                {patient.first_name} {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Date of Birth
              </p>

              <p className="font-medium">
                {patient.date_of_birth}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Member ID
              </p>

              <p className="font-medium">
                {patient.member_id}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Insurance
              </p>

              <p className="font-medium">
                {patient.insurance_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Group Number
              </p>

              <p className="font-medium">
                {patient.group_number || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                State
              </p>

              <p className="font-medium">
                {patient.state}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Payer Search */}

      <Card>
        <CardHeader>
          <CardTitle>Insurance Payer</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex gap-3">

            <Input
              value={payerSearch}
              onChange={(event) =>
                setPayerSearch(event.target.value)
              }
              placeholder="Search insurance payer..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handlePayerSearch()
                }
              }}
            />

            <Button
              onClick={handlePayerSearch}
              disabled={searchingPayers}
            >
              {searchingPayers ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}

              Search
            </Button>

          </div>

          {/* Search Results */}

          {payers.length > 0 && (
            <div className="space-y-2">

              <p className="text-sm font-medium">
                Search Results
              </p>

              {payers.map((payer) => {
                const isSelected =
                  selectedPayer?.stediId === payer.stediId

                return (
                  <button
                    key={payer.stediId}
                    type="button"
                    onClick={() => setSelectedPayer(payer)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <p className="font-medium">
                          {payer.displayName}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Payer ID: {payer.primaryPayerId}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Stedi ID: {payer.stediId}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5" />
                      )}

                    </div>
                  </button>
                )
              })}

            </div>
          )}

          {payers.length === 0 && !searchingPayers && (
            <p className="text-sm text-muted-foreground">
              Search for the patient's insurance payer.
            </p>
          )}

        </CardContent>
      </Card>

      {/* Selected Payer */}

      {selectedPayer && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Payer</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="rounded-lg border bg-muted/30 p-4">

              <div className="grid gap-4 md:grid-cols-3">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Payer Name
                  </p>

                  <p className="font-medium">
                    {selectedPayer.displayName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Payer ID
                  </p>

                  <p className="font-medium">
                    {selectedPayer.primaryPayerId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Stedi ID
                  </p>

                  <p className="font-medium">
                    {selectedPayer.stediId}
                  </p>
                </div>

              </div>

              <div className="mt-6">

                <Button
                  onClick={handleCheckEligibility}
                  disabled={checkingEligibility}
                >
                  {checkingEligibility && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {checkingEligibility
                    ? "Checking Eligibility..."
                    : "Check Eligibility"}
                </Button>

              </div>

            </div>

          </CardContent>
        </Card>
      )}

      {/* Eligibility Result */}

      {eligibilityResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Eligibility Response
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="mb-4 grid gap-4 md:grid-cols-3">

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <p className="font-medium capitalize">
                  {eligibilityResult.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Eligibility Record
                </p>

                <p className="font-medium">
                  #{eligibilityResult.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Stedi Check ID
                </p>

                <p className="font-medium">
                  {eligibilityResult.stedi_check_id || "N/A"}
                </p>
              </div>

            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Raw Stedi Response
              </p>

              <pre className="max-h-[500px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-white">
                {JSON.stringify(
                  eligibilityResult.response,
                  null,
                  2
                )}
              </pre>
            </div>

          </CardContent>
        </Card>
      )}

    </div>
  )
}