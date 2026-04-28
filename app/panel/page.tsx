import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Calendar, Users, Clock, TrendingUp, ChevronRight, CalendarDays } from "lucide-react"

// Demo data
const stats = {
  todayAppointments: 8,
  weekAppointments: 32,
  totalPatients: 156,
  completionRate: 94,
}

const nextAppointment = {
  id: "1",
  patientName: "Juan Perez",
  time: "10:00",
  reason: "Consulta por manchas en la piel",
  status: "confirmed" as const,
}

const todayAppointments = [
  { id: "1", patientName: "Juan Perez", time: "10:00", status: "confirmed" as const },
  { id: "2", patientName: "Maria Lopez", time: "10:30", status: "confirmed" as const },
  { id: "3", patientName: "Carlos Ruiz", time: "11:00", status: "pending" as const },
  { id: "4", patientName: "Ana Martinez", time: "11:30", status: "confirmed" as const },
  { id: "5", patientName: "Pedro Sanchez", time: "12:00", status: "pending" as const },
]

const quickLinks = [
  { href: "/panel/citas", label: "Ver Agenda", icon: Calendar },
  { href: "/panel/pacientes", label: "Pacientes", icon: Users },
  { href: "/panel/horarios", label: "Horarios", icon: Clock },
  { href: "/panel/perfil", label: "Mi Perfil", icon: CalendarDays },
]

export default function ProfessionalDashboard() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Buenos dias" : currentHour < 18 ? "Buenas tardes" : "Buenas noches"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{greeting}, Dra. Maria</h1>
        <p className="text-muted-foreground">Aqui esta el resumen de tu dia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.todayAppointments}</p>
                <p className="text-sm text-muted-foreground">Citas hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <CalendarDays className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.weekAppointments}</p>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Pacientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-confirmed/10">
                <TrendingUp className="h-6 w-6 text-status-confirmed" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Asistencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next Appointment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Proxima Cita</CardTitle>
            <CardDescription>Tu siguiente paciente del dia</CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {nextAppointment.patientName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{nextAppointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{nextAppointment.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{nextAppointment.time}</p>
                  <StatusBadge status={nextAppointment.status} />
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No hay citas pendientes para hoy</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accesos Rapidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Button key={link.href} variant="outline" asChild className="h-auto flex-col gap-2 py-4">
                <Link href={link.href}>
                  <link.icon className="h-5 w-5" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Citas de Hoy</CardTitle>
            <CardDescription>Tu agenda para hoy</CardDescription>
          </div>
          <Button variant="outline" asChild size="sm">
            <Link href="/panel/citas" className="gap-1">
              Ver todas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/panel/citas/${apt.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                    {apt.patientName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
