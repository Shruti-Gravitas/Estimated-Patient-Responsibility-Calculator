import { useEffect, useMemo, useState } from "react"
import { getPatients } from "@/services/patient"
import type { Patient } from "@/services/patient"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
      } catch (error) {
        console.error("Unable to fetch patients", error)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const query = search.toLowerCase()

      return (
        patient.patient_name.toLowerCase().includes(query) ||
        patient.member_id.toLowerCase().includes(query) ||
        patient.insurance_card_number
          .toLowerCase()
          .includes(query)
      )
    })
  }, [patients, search])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading patients...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Page Heading */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Patients
          </h1>

          <p className="text-sm text-slate-500">
            View all registered patients in the EPR system.
          </p>
        </div>

        <Button variant="outline">
          Total Patients: {patients.length}
        </Button>

      </div>


      {/* Search */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-5">

          <Input
            placeholder="Search by patient name, member ID or insurance card..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </CardContent>

      </Card>


      {/* Patient Table */}

      <Card className="border-0 shadow-sm">

        <CardHeader>
          <CardTitle>
            Patient List
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-3">
                  Patient
                </th>

                <th className="pb-3">
                  Date of Birth
                </th>

                <th className="pb-3">
                  Insurance Card
                </th>

                <th className="pb-3">
                  Member ID
                </th>

                <th className="pb-3">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
                        {patient.patient_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <p className="font-medium">
                          {patient.patient_name}
                        </p>

                        <p className="text-xs text-slate-500">
                          Patient ID #{patient.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td>
                    {patient.date_of_birth}
                  </td>

                  <td>
                    {patient.insurance_card_number}
                  </td>

                  <td>
                    {patient.member_id}
                  </td>

                  <td>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>


          {filteredPatients.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              No patients found.
            </div>
          )}

        </CardContent>

      </Card>

    </div>
  )
}