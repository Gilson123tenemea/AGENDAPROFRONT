"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Phone, Calendar, ChevronRight } from "lucide-react"

// Demo data
const patients = [
  { id: "1", name: "Juan Perez", phone: "+52 55 1234 5678", email: "juan@email.com", appointmentCount: 5, lastVisit: "2024-12-15" },
  { id: "2", name: "Maria Lopez", phone: "+52 55 2345 6789", email: "maria@email.com", appointmentCount: 3, lastVisit: "2024-12-10" },
  { id: "3", name: "Carlos Ruiz", phone: "+52 55 3456 7890", email: "carlos@email.com", appointmentCount: 8, lastVisit: "2024-12-18" },
  { id: "4", name: "Ana Martinez", phone: "+52 55 4567 8901", email: "ana@email.com", appointmentCount: 2, lastVisit: "2024-11-28" },
  { id: "5", name: "Pedro Sanchez", phone: "+52 55 5678 9012", email: "pedro@email.com", appointmentCount: 12, lastVisit: "2024-12-19" },
  { id: "6", name: "Laura Garcia", phone: "+52 55 6789 0123", email: "laura@email.com", appointmentCount: 4, lastVisit: "2024-12-05" },
  { id: "7", name: "Diego Torres", phone: "+52 55 7890 1234", email: "diego@email.com", appointmentCount: 6, lastVisit: "2024-11-20" },
  { id: "8", name: "Sofia Hernandez", phone: "+52 55 8901 2345", email: "sofia@email.com", appointmentCount: 1, lastVisit: "2024-12-01" },
]

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase()
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    )
  })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
        <p className="text-muted-foreground">Listado de todos tus pacientes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">{filteredPatients.length} Pacientes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o telefono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/panel/pacientes/${patient.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {patient.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {patient.appointmentCount} citas
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-muted-foreground">Ultima visita</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(patient.lastVisit)}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? "No se encontraron pacientes" : "No hay pacientes registrados"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
