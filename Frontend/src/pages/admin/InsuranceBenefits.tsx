import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from "lucide-react"

import {
  getEligibilityCheck,
  type NormalizedEligibility,
} from "@/services/eligibility"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function InsuranceBenefits() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const patientId = searchParams.get("patientId")
  const eligibilityId = searchParams.get("eligibilityId")

  const [eligibility, setEligibility] =
    useState<NormalizedEligibility | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /*
   * Load saved eligibility result
   */
  useEffect(() => {
    const loadEligibility = async () => {
      if (!eligibilityId) {
        setError("Eligibility check ID is missing.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const result = await getEligibilityCheck(
          Number(eligibilityId)
        )

        setEligibility(result.eligibility ?? null)

        if (!result.eligibility) {
          setError(
            "Insurance benefits were not available for this eligibility check."
          )
        }
      } catch (err: any) {
        console.error(err)

        const message =
          err?.response?.data?.detail ||
          "Unable to load insurance benefits."

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadEligibility()
  }, [eligibilityId])

  /*
   * Format date
   */
  const formatDate = (date?: string | null) => {
    if (!date) return "—"

    if (/^\d{8}$/.test(date)) {
      return `${date.substring(4, 6)}/${date.substring(
        6,
        8
      )}/${date.substring(0, 4)}`
    }

    return date
  }

  /*
   * Format currency
   */
  const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) {
      return "—"
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  /*
   * Format percentage
   */
  const formatPercentage = (value?: number | null) => {
    if (value === null || value === undefined) {
      return "—"
    }

    return `${value}%`
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading insurance benefits...
        </div>
      </div>
    )
  }

  if (!eligibility) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          onClick={() =>
            patientId
              ? navigate(
                  `/admin/patients/${patientId}`
                )
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
                Insurance benefits unavailable
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const services = Object.values(
    eligibility.benefits.services
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() =>
            patientId
              ? navigate(
                  `/admin/patients/${patientId}`
                )
              : navigate("/admin/patients")
          }
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
              Insurance Benefits
            </h1>

            <p className="text-sm text-muted-foreground">
              Eligibility and insurance benefit details for
              this patient.
            </p>
          </div>
        </div>
      </div>

      {/* Eligibility Status */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h2 className="font-semibold text-green-900">
                Eligibility Verified
              </h2>

              <p className="text-sm text-green-700">
                Insurance coverage information was retrieved
                successfully.
              </p>
            </div>
          </div>

          <Badge className="w-fit bg-green-600 hover:bg-green-600">
            {eligibility.eligibility.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Eligibility Details */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Details</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Payer
              </p>

              <p className="mt-1 font-medium">
                {eligibility.payer.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Plan
              </p>

              <p className="mt-1 font-medium">
                {eligibility.eligibility.plan || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Plan Type
              </p>

              <p className="mt-1 font-medium">
                {eligibility.eligibility.plan_type || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Effective Date
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  eligibility.eligibility.effective_date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Service Date
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  eligibility.eligibility.service_date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Member ID
              </p>

              <p className="mt-1 font-medium">
                {eligibility.subscriber.member_id || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Subscriber
              </p>

              <p className="mt-1 font-medium">
                {eligibility.subscriber.first_name || "—"}{" "}
                {eligibility.subscriber.last_name || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Subscriber DOB
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  eligibility.subscriber.date_of_birth
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductible */}
      <Card>
        <CardHeader>
          <CardTitle>Deductible</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* In Network */}
            <div className="rounded-lg border p-5">
              <p className="font-semibold">
                In-Network
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Annual Deductible
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.deductible
                        .in_network.contract
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Remaining
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.deductible
                        .in_network.remaining
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Out of Network */}
            <div className="rounded-lg border p-5">
              <p className="font-semibold">
                Out-of-Network
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Annual Deductible
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.deductible
                        .out_of_network.contract
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Remaining
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.deductible
                        .out_of_network.remaining
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Out of Pocket */}
      <Card>
        <CardHeader>
          <CardTitle>
            Out-of-Pocket Maximum
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* In Network */}
            <div className="rounded-lg border p-5">
              <p className="font-semibold">
                In-Network
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Annual Maximum
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.out_of_pocket
                        .in_network.contract
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Remaining
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.out_of_pocket
                        .in_network.remaining
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Out of Network */}
            <div className="rounded-lg border p-5">
              <p className="font-semibold">
                Out-of-Network
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Annual Maximum
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.out_of_pocket
                        .out_of_network.contract
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Remaining
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(
                      eligibility.benefits.out_of_pocket
                        .out_of_network.remaining
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Benefits by Service</CardTitle>

          <p className="text-sm text-muted-foreground">
            Copay and coinsurance information returned by the
            insurance payer.
          </p>
        </CardHeader>

        <CardContent>
          {services.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">
                No service benefits available
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The payer did not return service-level benefit
                information.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 text-sm font-semibold">
                      Service
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      In-Network Copay
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      In-Network Coinsurance
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Out-of-Network Copay
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Out-of-Network Coinsurance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.service}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {service.service}
                        </p>

                        {service.descriptions &&
                          service.descriptions.length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {service.descriptions.join(", ")}
                            </p>
                          )}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(
                          service.in_network.copay
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {formatPercentage(
                          service.in_network.coinsurance
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(
                          service.out_of_network.copay
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {formatPercentage(
                          service.out_of_network.coinsurance
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue to EPR */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">
              Insurance information is ready
            </h3>

            <p className="text-sm text-muted-foreground">
              Continue to the EPR Calculator to estimate the
              patient's responsibility.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate(
                `/admin/epr?patientId=${patientId}&eligibilityId=${eligibilityId}`
              )
            }
            className="gap-2"
          >
            Continue to EPR
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}