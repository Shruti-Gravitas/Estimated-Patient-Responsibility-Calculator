import { useEffect, useMemo, useState } from "react"
import { getPatients } from "@/services/patient"
import type { Patient } from "@/services/patient"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  // ==================================================
  // Load Patients
  // ==================================================


  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
      } catch (error) {
        console.error(
          "Unable to fetch patients",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])


  // ==================================================
  // Search / Filter
  // ==================================================

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim()


    if (!query) {
      return patients
    }

    return patients.filter((patient) => {
      const fullName =
        `${patient.first_name} ${patient.last_name}`.toLowerCase()

      return (
        fullName.includes(query) ||
        patient.first_name
          .toLowerCase()
          .includes(query) ||
        patient.last_name
          .toLowerCase()
          .includes(query) ||
        patient.member_id
          .toLowerCase()
          .includes(query) ||
        patient.insurance_name
          .toLowerCase()
          .includes(query) ||
        (patient.group_number ?? "")
          .toLowerCase()
          .includes(query) ||
        patient.state
          .toLowerCase()
          .includes(query)
      )
    })
  }, [patients, search])


  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading patients...
        </p>
      </div>
    )
  }


  // ==================================================
  // Dashboard
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Page Heading
      ================================================== */}

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


      {/* ==================================================
          Search
      ================================================== */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-5">

          <Input
            placeholder="Search by name, member ID, insurance, group number or state..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </CardContent>

      </Card>


      {/* ==================================================
          Patient Table
      ================================================== */}

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

                {/* Patient */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  Patient
                </th>

                {/* DOB */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  Date of Birth
                </th>

                {/* State */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  State
                </th>

                {/* Insurance */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  Insurance
                </th>

                {/* Member ID */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  Member / Subscriber ID
                </th>

                {/* Group */}
                <th className="whitespace-nowrap pb-3 pr-6">
                  Group Number
                </th>

                {/* Status */}
                <th className="whitespace-nowrap pb-3">
                  Status
                </th>

                {/*Active */}
                <th className="whitespace-nowrap pb-3 pl-6 text-right">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredPatients.map((patient) => (

                <tr
                  key={patient.id}
                  className="border-b hover:bg-slate-50"
                >

                  {/* ==================================================
                      Patient
                  ================================================== */}

                  <td className="py-4 pr-6">

                    <div className="flex items-center gap-3">

                      {/* Initial */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">

                        {patient.first_name
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <p className="font-medium whitespace-nowrap">

                          {patient.first_name}{" "}
                          {patient.last_name}

                        </p>

                        <p className="text-xs text-slate-500">
                          Patient ID #{patient.id}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* ==================================================
                      Date of Birth
                  ================================================== */}

                  <td className="whitespace-nowrap pr-6 text-sm">

                    {patient.date_of_birth}

                  </td>


                  {/* ==================================================
                      State
                  ================================================== */}

                  <td className="whitespace-nowrap pr-6 text-sm">

                    {patient.state}

                  </td>


                  {/* ==================================================
                      Insurance
                  ================================================== */}

                  <td className="whitespace-nowrap pr-6 text-sm font-medium">

                    {patient.insurance_name}

                  </td>


                  {/* ==================================================
                      Member ID
                  ================================================== */}

                  <td className="whitespace-nowrap pr-6 text-sm">

                    {patient.member_id}

                  </td>


                  {/* ==================================================
                      Group Number
                  ================================================== */}

                  <td className="whitespace-nowrap pr-6 text-sm">

                    {patient.group_number || (
                      <span className="text-slate-400">
                        Not provided
                      </span>
                    )}

                  </td>


                  {/* ==================================================
                      Status
                  ================================================== */}

                  <td>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>

                  </td>

                  <td className="pl-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/patients/${patient.id}`)
                      }
                    >
                      View Patient
                    </Button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* ==================================================
              No Results
          ================================================== */}

          {filteredPatients.length === 0 && (

            <div className="py-10 text-center">

              <p className="text-sm text-slate-500">
                No patients found.
              </p>

              {search && (
                <p className="mt-1 text-xs text-slate-400">
                  Try searching with a different name,
                  member ID, insurance, or state.
                </p>
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  )
}