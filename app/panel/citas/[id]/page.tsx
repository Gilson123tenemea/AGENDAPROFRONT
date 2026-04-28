"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  Loader2,
} from "lucide-react"
import type { AppointmentStatus } from "@/lib/types"

// Demo data
const appointmentData = {
  id: "1",
  patient: {
    id: "p1",
    name: "Juan Perez",
    phone: "+52 55 1234 5678",
    email: "juan.perez@email.com",
    appointmentCount: 5,
    lastVisit: "2024-11-15",
  },
  date: "2024-12-20",
  time: "10:00",
  duration: 30,
  status: "confirmed" as AppointmentStatus,
  reason: "Consulta por manchas en la piel que aparecieron hace 2 semanas. El paciente menciona que le causan picazon.",
  notes: "Paciente con antecedentes de dermatitis atopica. Revisar historial de alergias.",
  notifications: [
    { id: "1", type: "confirmation", sentAt: "2024-12-18 14:30", status: "delivered" },
    { id: "2", type: "reminder_48h", sentAt: "2024-12-18 10:00", status: "delivered" },
    { id: "3", type: "reminder_24h", sentAt: "2024-12-19 10:00", status: "pending" },
    { id: "4", type: "reminder_2h", sentAt: "2024-12-20 08:00", status: "pending" },
  ],
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const notificationLabels: Record<string, string> = {
  confirmation: "Confirmacion de cita",
  reminder_48h: "Recordatorio 48 horas",
  reminder_24h: "Recordatorio 24 horas",
  reminder_2h: "Recordatorio 2 horas",
}

export default function AppointmentDetailPage() {
  const params = useParams()
  const [notes, setNotes] = useState(appointmentData.notes)
  const [isSaving, setIsSaving] = useState(false)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    const dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    return `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]} de ${d.getFullYear()}`
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const canModify = appointmentData.status === "pending" || appointmentData.status === "confirmed"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/panel/citas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Detalle de Cita</h1>
            <p className="text-muted-foreground">Cita #{params.id}</p>
          </div>
        </div>
        <StatusBadge status={appointmentData.status} className="w-fit" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacion del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {appointmentData.patient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{appointmentData.patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {appointmentData.patient.appointmentCount} citas anteriores
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{appointmentData.patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{appointmentData.patient.email}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/panel/pacientes/${appointmentData.patient.id}`}>
                      <User className="mr-2 h-4 w-4" />
                      Ver Historial del Paciente
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles de la Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium text-foreground">{formatDate(appointmentData.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium text-foreground">{appointmentData.time} ({appointmentData.duration} min)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Motivo de consulta</p>
                  <p className="text-foreground">{appointmentData.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Notas Clinicas  
              </CardTitle>
              <CardDescription>
                Notas privadas visibles solo para ti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Escribe tus notas clinicas aqui..."
                  rows={5}
                />
              </div>
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

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                Historial de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointmentData.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{notificationLabels[notif.type]}</p>
                      <p className="text-sm text-muted-foreground">{notif.sentAt}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        notif.status === "delivered"
                          ? "bg-status-confirmed/15 text-status-confirmed"
                          : "bg-status-pending/15 text-status-pending"
                      }`}
                    >
                      {notif.status === "delivered" ? "Enviado" : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canModify && (
                <>
                  <Button className="w-full gap-2" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                    Reagendar Cita
                  </Button>
                  <Button className="w-full gap-2 text-destructive hover:text-destructive" variant="outline">
                    <XCircle className="h-4 w-4" />
                    Cancelar Cita
                  </Button>
                </>
              )}
              {appointmentData.status === "confirmed" && (
                <>
                  <div className="border-t border-border pt-3">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Marcar como:</p>
                    <div className="space-y-2">
                      <Button className="w-full gap-2 bg-status-confirmed/10 text-status-confirmed hover:bg-status-confirmed/20" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                        Paciente Asistio
                      </Button>
                      <Button className="w-full gap-2 bg-status-noshow/10 text-status-noshow hover:bg-status-noshow/20" variant="outline">
                        <XCircle className="h-4 w-4" />
                        Paciente No Asistio
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contacto Rapido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" variant="outline" asChild>
                <a href={`https://wa.me/${appointmentData.patient.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button className="w-full gap-2" variant="outline" asChild>
                <a href={`tel:${appointmentData.patient.phone}`}>
                  <Phone className="h-4 w-4" />
                  Llamar
                </a>
              </Button>
              <Button className="w-full gap-2" variant="outline" asChild>
                <a href={`mailto:${appointmentData.patient.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
