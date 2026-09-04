import { useEffect, useState } from "react"
import { Users, ShieldCheck, FileText, Clock } from "lucide-react"
import { getPatients, type Patient } from "../../services/patient"

export default function AdminDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load patient information.")
    } finally {
      setLoading(false)
    }
  }

  const totalPatients = patients.length

  const recentPatients = [...patients]
    .sort(
      (a, b) =>
        new Date(b.id).getTime() - new Date(a.id).getTime()
    )
    .slice(0, 5)

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-teal-600">
          EPR Care
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor patients, insurance verification, and EPR estimates.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Patients */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Patients
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "—" : totalPatients}
              </p>
            </div>

            <div className="rounded-lg bg-teal-50 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Registered patient records
          </p>
        </div>

        {/* Eligibility */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Eligibility
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                —
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Eligibility checks will appear here
          </p>
        </div>

        {/* Estimates */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                EPR Estimates
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                —
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Saved estimates will appear here
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                —
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Pending workflow items
          </p>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Patients
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recently registered patient records
            </p>
          </div>

          <a
            href="/admin/patients"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all
          </a>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No patients yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Patient registrations will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    State
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Insurance
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Member ID
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                          {patient.first_name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {patient.first_name} {patient.last_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Patient ID: {patient.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.state}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.insurance_name}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {patient.member_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}