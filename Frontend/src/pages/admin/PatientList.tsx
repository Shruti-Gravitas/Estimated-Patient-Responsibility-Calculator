import { useEffect, useState } from "react"

import { getPatients, type Patient } from "@/services/patient"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
      } catch (error) {
        console.error("Failed to fetch patients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading patients...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Insurance Card</TableHead>
                  <TableHead>Member ID</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.patient_name}</TableCell>
                    <TableCell>{patient.date_of_birth}</TableCell>
                    <TableCell>
                      {patient.insurance_card_number}
                    </TableCell>
                    <TableCell>{patient.member_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}