import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  DollarSign,
  Loader2,
  ShieldCheck,
} from "lucide-react"

import {
  getEligibilityCheck,
  type NormalizedEligibility,
  type ServiceBenefit,
} from "@/services/eligibility"

import { getPatients, type Patient } from "@/services/patient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EPRCalculator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const patientId = searchParams.get("patientId")
  const eligibilityId = searchParams.get("eligibilityId")

  const [patient, setPatient] = useState<Patient | null>(null)
  const [eligibility, setEligibility] =
    useState<NormalizedEligibility | null>(null)

  const [selectedService, setSelectedService] = useState("")
  const [network, setNetwork] = useState<"in_network" | "out_of_network">(
    "in_network"
  )

  const [allowedAmount, setAllowedAmount] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /*
   * Load patient + eligibility information
   */
  useEffect(() => {
    const loadData = async () => {
      if (!patientId || !eligibilityId) {
        setError(
          "Patient or eligibility information is missing."
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const [patients, eligibilityResult] = await Promise.all([
          getPatients(),
          getEligibilityCheck(Number(eligibilityId)),
        ])

        const selectedPatient = patients.find(
          (item) => item.id === Number(patientId)
        )

        if (!selectedPatient) {
          setError("Patient not found.")
          return
        }

        setPatient(selectedPatient)
        setEligibility(
          eligibilityResult.eligibility ?? null
        )
      } catch (err: any) {
        console.error(err)

        const message =
          err?.response?.data?.detail ||
          "Unable to load EPR information."

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [patientId, eligibilityId])

  /*
   * Available services
   */
  const services = useMemo(() => {
    if (!eligibility) {
      return []
    }

    return Object.values(
      eligibility.benefits.services
    )
  }, [eligibility])

  /*
   * Selected service benefit
   */
  const selectedServiceBenefit: ServiceBenefit | null =
    useMemo(() => {
      if (!eligibility || !selectedService) {
        return null
      }

      return (
        eligibility.benefits.services[selectedService] ??
        null
      )
    }, [eligibility, selectedService])

  /*
   * Current network benefit
   */
  const currentNetworkBenefit = useMemo(() => {
    if (!selectedServiceBenefit) {
      return {
        copay: null,
        coinsurance: null,
      }
    }

    return selectedServiceBenefit[network]
  }, [selectedServiceBenefit, network])

  /*
   * Current deductible
   */
  const deductible = useMemo(() => {
    if (!eligibility) {
      return {
        contract: 0,
        remaining: 0,
      }
    }

    return eligibility.benefits.deductible[network]
  }, [eligibility, network])

  /*
   * Current out-of-pocket maximum
   */
  const outOfPocket = useMemo(() => {
    if (!eligibility) {
      return {
        contract: 0,
        remaining: 0,
      }
    }

    return eligibility.benefits.out_of_pocket[network]
  }, [eligibility, network])

  /*
   * EPR calculation
   *
   * Simplified estimation logic:
   *
   * 1. Apply remaining deductible
   * 2. Apply copay
   * 3. Apply coinsurance to amount remaining after deductible
   * 4. Do not exceed allowed amount
   * 5. Do not exceed remaining out-of-pocket maximum
   */
  const calculation = useMemo(() => {
    const allowed = Number(allowedAmount)

    if (
      !Number.isFinite(allowed) ||
      allowed <= 0 ||
      !eligibility
    ) {
      return {
        allowedAmount: 0,
        deductibleApplied: 0,
        remainingAfterDeductible: 0,
        copay: 0,
        coinsurance: 0,
        estimatedPatientResponsibility: 0,
        estimatedInsurancePayment: 0,
        oopLimitApplied: false,
      }
    }

    const deductibleRemaining =
      Number(deductible.remaining) || 0

    const deductibleApplied = Math.min(
      allowed,
      Math.max(0, deductibleRemaining)
    )

    const remainingAfterDeductible = Math.max(
      0,
      allowed - deductibleApplied
    )

    const copay = Math.min(
      remainingAfterDeductible,
      Math.max(0, Number(currentNetworkBenefit.copay) || 0)
    )

    const coinsurancePercent =
      Math.max(
        0,
        Number(currentNetworkBenefit.coinsurance) || 0
      ) / 100

    const amountAfterCopay = Math.max(
      0,
      remainingAfterDeductible - copay
    )

    const coinsurance = Math.min(
      amountAfterCopay,
      amountAfterCopay * coinsurancePercent
    )

    let patientResponsibility =
      deductibleApplied +
      copay +
      coinsurance

    /*
     * Patient responsibility cannot exceed
     * the remaining out-of-pocket maximum.
     */
    const oopRemaining =
      Number(outOfPocket.remaining) || 0

    let oopLimitApplied = false

    if (oopRemaining > 0 && patientResponsibility > oopRemaining) {
      patientResponsibility = oopRemaining
      oopLimitApplied = true
    }

    /*
     * Patient responsibility cannot exceed
     * the allowed amount.
     */
    patientResponsibility = Math.min(
      allowed,
      patientResponsibility
    )

    const insurancePayment = Math.max(
      0,
      allowed - patientResponsibility
    )

    return {
      allowedAmount: allowed,
      deductibleApplied,
      remainingAfterDeductible,
      copay,
      coinsurance,
      estimatedPatientResponsibility:
        patientResponsibility,
      estimatedInsurancePayment:
        insurancePayment,
      oopLimitApplied,
    }
  }, [
    allowedAmount,
    eligibility,
    deductible,
    currentNetworkBenefit,
    outOfPocket,
  ])

  /*
   * Format currency
   */
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return "—"
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading EPR calculator...
        </div>
      </div>
    )
  }

  /*
   * Error
   */
  if (error || !patient || !eligibility) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          onClick={() =>
            patientId
              ? navigate(`/admin/patients/${patientId}`)
              : navigate("/admin/patients")
          }
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold">
                Unable to load EPR Calculator
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error || "Required information is missing."}
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
          onClick={() =>
            navigate(
              `/admin/benefits?patientId=${patient.id}&eligibilityId=${eligibilityId}`
            )
          }
          className="mb-2 -ml-3 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Insurance Benefits
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              EPR Calculator
            </h1>

            <p className="text-sm text-muted-foreground">
              Estimate the patient's financial responsibility
              for a healthcare service.
            </p>
          </div>
        </div>
      </div>

      {/* Patient + Insurance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Patient & Insurance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Patient
              </p>

              <p className="mt-1 font-medium">
                {patient.first_name} {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Insurance
              </p>

              <p className="mt-1 font-medium">
                {eligibility.payer.name || patient.insurance_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Member ID
              </p>

              <p className="mt-1 font-medium">
                {eligibility.subscriber.member_id ||
                  patient.member_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Eligibility
              </p>

              <div className="mt-1 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />

                <span className="font-medium">
                  {eligibility.eligibility.status}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Input */}
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Service */}
            <div className="space-y-2">
              <Label htmlFor="service">
                Healthcare Service
              </Label>

              <Select
                value={selectedService}
                onValueChange={(value) =>
                  setSelectedService(value ?? "")
                }
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>

                <SelectContent>
                  {services.map((service) => (
                    <SelectItem
                      key={service.service}
                      value={Object.keys(
                        eligibility.benefits.services
                      ).find(
                        (key) =>
                          eligibility.benefits.services[key]
                            .service === service.service
                      ) || service.service}
                    >
                      {service.service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network */}
            <div className="space-y-2">
              <Label htmlFor="network">
                Network
              </Label>

              <Select
                value={network}
                onValueChange={(value) =>
                  setNetwork(
                    value as
                      | "in_network"
                      | "out_of_network"
                  )
                }
              >
                <SelectTrigger id="network">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="in_network">
                    In-Network
                  </SelectItem>

                  <SelectItem value="out_of_network">
                    Out-of-Network
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Allowed Amount */}
          <div className="max-w-md space-y-2">
            <Label htmlFor="allowedAmount">
              Estimated Allowed Amount
            </Label>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="allowedAmount"
                type="number"
                min="0"
                step="0.01"
                value={allowedAmount}
                onChange={(event) =>
                  setAllowedAmount(event.target.value)
                }
                placeholder="Enter allowed amount"
                className="pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Enter the estimated amount allowed by the
              insurance plan for this service.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Insurance Benefits */}
      {selectedServiceBenefit && (
        <Card>
          <CardHeader>
            <CardTitle>
              Applicable Insurance Benefits
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Deductible Remaining
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(deductible.remaining)}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Copay
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(
                    currentNetworkBenefit.copay
                  )}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Coinsurance
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {currentNetworkBenefit.coinsurance !==
                  null
                    ? `${currentNetworkBenefit.coinsurance}%`
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculation Result */}
      {calculation.allowedAmount > 0 && (
        <>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Estimated Patient Responsibility</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Patient */}
                <div className="rounded-xl border bg-muted/30 p-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Estimated Patient Responsibility
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {formatCurrency(
                      calculation.estimatedPatientResponsibility
                    )}
                  </p>
                </div>

                {/* Insurance */}
                <div className="rounded-xl border bg-muted/30 p-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Estimated Insurance Payment
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {formatCurrency(
                      calculation.estimatedInsurancePayment
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Breakdown</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-muted-foreground">
                    Allowed Amount
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      calculation.allowedAmount
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-muted-foreground">
                    Deductible Applied
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      calculation.deductibleApplied
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-muted-foreground">
                    Copay
                  </span>

                  <span className="font-medium">
                    {formatCurrency(calculation.copay)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-muted-foreground">
                    Coinsurance
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      calculation.coinsurance
                    )}
                  </span>
                </div>

                {calculation.oopLimitApplied && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">
                      Out-of-pocket maximum applied
                    </p>

                    <p className="mt-1 text-xs text-amber-700">
                      The patient's estimated responsibility
                      was limited by the remaining
                      out-of-pocket maximum.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold">
                    Estimated Patient Responsibility
                  </span>

                  <span className="text-xl font-bold">
                    {formatCurrency(
                      calculation.estimatedPatientResponsibility
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formula Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Estimation Formula</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-sm leading-6">
                  <span className="font-semibold">
                    Estimated Patient Responsibility
                  </span>{" "}
                  =
                  <span className="ml-1">
                    Deductible Applied
                  </span>{" "}
                  +
                  <span className="ml-1">Copay</span>{" "}
                  +
                  <span className="ml-1">
                    Coinsurance
                  </span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  This is an estimate based on the selected
                  service, network, allowed amount, and
                  insurance benefits returned during the
                  eligibility check.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save / Continue */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />

                <div>
                  <h3 className="font-semibold">
                    EPR estimate calculated
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Review the estimated patient
                    responsibility before saving the estimate.
                  </p>
                </div>
              </div>

              <Button
                disabled
                className="gap-2"
              >
                Save Estimate
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}