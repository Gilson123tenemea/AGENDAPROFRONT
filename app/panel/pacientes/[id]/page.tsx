"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  FileText,
  Save,
  Loader2,
} from "lucide-react"
import type { AppointmentStatus } from "@/lib/types"

// Demo data
const patientData = {
  id: "1",
  name: "Juan Perez",
  phone: "+52 55 1234 5678",
  email: "juan.perez@email.com",
  notes: "Paciente con piel sensible. Reacciona a productos con parabenos. Preferir tratamientos naturales.",
  createdAt: "2024-06-15",
  appointments: [
    { id: "1", date: "2024-12-20", time: "10:00", reason: "Consulta por manchas", status: "confirmed" as AppointmentStatus },
    { id: "2", date: "2024-12-15", time: "11:30", reason: "Seguimiento tratamiento", status: "completed" as AppointmentStatus },
    { id: "3", date: "2024-11-28", time: "09:00", reason: "Revision general", status: "completed" as AppointmentStatus },
    { id: "4", date: "2024-10-15", time: "16:00", reason: "Primera consulta", status: "completed" as AppointmentStatus },
    { id: "5", date: "2024-09-10", time: "10:30", reason: "Consulta por acne", status: "noshow" as AppointmentStatus },
  ],
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function PatientDetailPage() {
  const params = useParams()
  const [notes, setNotes] = useState(patientData.notes)
  const [isSaving, setIsSaving] = useState(false)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const stats = {
    totalAppointments: patientData.appointments.length,
    completedAppointments: patientData.appointments.filter(a => a.status === "completed").length,
    noShowAppointments: patientData.appointments.filter(a => a.status === "noshow").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/panel/pacientes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{patientData.name}</h1>
          <p className="text-muted-foreground">Paciente desde {formatDate(patientData.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacion de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {patientData.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Telefono</p>
                        <p className="font-medium text-foreground">{patientData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{patientData.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://wa.me/${patientData.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${patientData.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Notas del Paciente
              </CardTitle>
              <CardDescription>
                Informacion general sobre el paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe notas sobre el paciente..."
                rows={4}
              />
              <Button onClick={handleSaveNotes} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Notas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Appointment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Historial de Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientData.appointments.map((apt) => (
                  <Link
                    key={apt.id}
                    href={`/panel/citas/${apt.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{apt.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(apt.date)} a las {apt.time}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadisticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total de citas</span>
                <span className="text-xl font-bold text-foreground">{stats.totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completadas</span>
                <span className="text-xl font-bold text-status-completed">{stats.completedAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">No asistio</span>
                <span className="text-xl font-bold text-status-noshow">{stats.noShowAppointments}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasa de asistencia</span>
                  <span className="text-xl font-bold text-status-confirmed">
                    {Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
