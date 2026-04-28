import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, TrendingUp, ChevronRight, UserPlus, Building2 } from "lucide-react"

// Demo data
const stats = {
  activeProfessionals: 5,
  monthlyAppointments: 245,
  monthlyRevenue: 196000,
  growthRate: 12,
}

const recentActivity = [
  { type: "appointment", message: "Nueva cita agendada con Dr. Lopez", time: "Hace 5 min" },
  { type: "professional", message: "Dra. Garcia actualizo sus horarios", time: "Hace 1 hora" },
  { type: "appointment", message: "Cita cancelada con Dr. Martinez", time: "Hace 2 horas" },
  { type: "appointment", message: "Nueva cita agendada con Dra. Sanchez", time: "Hace 3 horas" },
]

const professionals = [
  { id: "1", name: "Dra. Maria Garcia", specialty: "Dermatologia", appointmentsThisMonth: 48, status: "active" },
  { id: "2", name: "Dr. Juan Lopez", specialty: "Cardiologia", appointmentsThisMonth: 52, status: "active" },
  { id: "3", name: "Dra. Ana Martinez", specialty: "Pediatria", appointmentsThisMonth: 61, status: "active" },
  { id: "4", name: "Dr. Carlos Ruiz", specialty: "Traumatologia", appointmentsThisMonth: 44, status: "active" },
  { id: "5", name: "Dra. Laura Sanchez", specialty: "Neurologia", appointmentsThisMonth: 40, status: "active" },
]

export default function AdminDashboard() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Buenos dias" : currentHour < 18 ? "Buenas tardes" : "Buenas noches"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{greeting}, Carlos</h1>
          <p className="text-muted-foreground">Panel de administracion de tu organizacion</p>
        </div>
        <Button asChild>
          <Link href="/admin/profesionales/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Profesional
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeProfessionals}</p>
                <p className="text-sm text-muted-foreground">Profesionales activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.monthlyAppointments}</p>
                <p className="text-sm text-muted-foreground">Citas este mes</p>
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
                <p className="text-2xl font-bold text-foreground">${(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-sm text-muted-foreground">Ingresos del mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">+{stats.growthRate}%</p>
                <p className="text-sm text-muted-foreground">Crecimiento mensual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Professionals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Profesionales</CardTitle>
              <CardDescription>Rendimiento de este mes</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/profesionales" className="gap-1">
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {professionals.map((prof) => (
                <Link
                  key={prof.id}
                  href={`/admin/profesionales/${prof.id}/editar`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {prof.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{prof.name}</p>
                      <p className="text-sm text-muted-foreground">{prof.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{prof.appointmentsThisMonth}</p>
                    <p className="text-sm text-muted-foreground">citas</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>Ultimos movimientos en la organizacion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === "appointment" ? "bg-primary" : "bg-accent"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accesos Rapidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" asChild className="h-auto justify-start gap-3 p-4">
              <Link href="/admin/profesionales">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Profesionales</p>
                  <p className="text-xs text-muted-foreground">Gestionar equipo</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto justify-start gap-3 p-4">
              <Link href="/admin/profesionales/nuevo">
                <UserPlus className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium">Nuevo Profesional</p>
                  <p className="text-xs text-muted-foreground">Agregar al equipo</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto justify-start gap-3 p-4">
              <Link href="/admin/organizacion">
                <Building2 className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Organizacion</p>
                  <p className="text-xs text-muted-foreground">Configuracion</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
