"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  List,
  CalendarDays,
  Eye,
  XCircle,
  RefreshCw,
  CheckCircle,
  Clock,
} from "lucide-react"
import type { AppointmentStatus } from "@/lib/types"

// Demo data
const appointments = [
  { id: "1", patientName: "Juan Perez", phone: "+52 55 1234 5678", time: "09:00", duration: 30, reason: "Consulta por manchas", status: "completed" as AppointmentStatus },
  { id: "2", patientName: "Maria Lopez", phone: "+52 55 2345 6789", time: "09:30", duration: 30, reason: "Revision de rutina", status: "completed" as AppointmentStatus },
  { id: "3", patientName: "Carlos Ruiz", phone: "+52 55 3456 7890", time: "10:00", duration: 30, reason: "Acne severo", status: "confirmed" as AppointmentStatus },
  { id: "4", patientName: "Ana Martinez", phone: "+52 55 4567 8901", time: "10:30", duration: 30, reason: "Primera consulta", status: "confirmed" as AppointmentStatus },
  { id: "5", patientName: "Pedro Sanchez", phone: "+52 55 5678 9012", time: "11:00", duration: 30, reason: "Seguimiento tratamiento", status: "pending" as AppointmentStatus },
  { id: "6", patientName: "Laura Garcia", phone: "+52 55 6789 0123", time: "11:30", duration: 30, reason: "Dermatitis", status: "pending" as AppointmentStatus },
  { id: "7", patientName: "Diego Torres", phone: "+52 55 7890 1234", time: "12:00", duration: 30, reason: "Lunares sospechosos", status: "cancelled" as AppointmentStatus },
  { id: "8", patientName: "Sofia Hernandez", phone: "+52 55 8901 2345", time: "16:00", duration: 30, reason: "Alergia cutanea", status: "confirmed" as AppointmentStatus },
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
]

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getAppointmentByTime = (time: string) => {
    return appointments.find((apt) => apt.time === time && apt.status !== "cancelled")
  }

  const prevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return `${dayNames[date.getDay()]} ${date.getDate()} de ${monthNames[date.getMonth()]}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Agenda</h1>
          <p className="text-muted-foreground">Gestiona todas tus citas</p>
        </div>
      </div>

      <Tabs defaultValue="day" className="space-y-4">
        <TabsList>
          <TabsTrigger value="day" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Vista de Dia
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        {/* Day View */}
        <TabsContent value="day" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg">{formatDate(currentDate)}</CardTitle>
                <Button variant="outline" size="icon" onClick={nextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Hoy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentByTime(time)
                  return (
                    <div key={time} className="flex items-stretch gap-4">
                      <div className="flex w-16 shrink-0 items-center justify-end text-sm text-muted-foreground">
                        {time}
                      </div>
                      <div className="flex-1 border-l border-border pl-4 py-1">
                        {appointment ? (
                          <Link
                            href={`/panel/citas/${appointment.id}`}
                            className="flex items-center justify-between rounded-lg border border-border bg-primary/5 p-3 transition-colors hover:bg-primary/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {appointment.patientName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={appointment.status} />
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex h-14 items-center rounded-lg border border-dashed border-border px-3">
                            <span className="text-sm text-muted-foreground">Disponible</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Todas las Citas</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar paciente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 sm:w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="sm:w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="noshow">No asistio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                          {apt.patientName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">{apt.phone}</p>
                          <p className="text-sm text-muted-foreground">{apt.reason}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {apt.time} ({apt.duration} min)
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/panel/citas/${apt.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            Ver
                          </Link>
                        </Button>
                        {(apt.status === "pending" || apt.status === "confirmed") && (
                          <>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="mr-1 h-4 w-4" />
                              Reagendar
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <XCircle className="mr-1 h-4 w-4" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <>
                            <Button variant="outline" size="sm" className="text-status-confirmed hover:text-status-confirmed">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Asistio
                            </Button>
                            <Button variant="outline" size="sm" className="text-status-noshow hover:text-status-noshow">
                              <XCircle className="mr-1 h-4 w-4" />
                              No asistio
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">No se encontraron citas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
