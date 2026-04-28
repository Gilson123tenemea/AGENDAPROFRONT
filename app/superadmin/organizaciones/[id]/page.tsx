"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  Users,
  CreditCard,
  UserX,
  UserCheck,
} from "lucide-react"

// Demo data
const organizationData = {
  id: "1",
  name: "Clinica Dental Sonrisas",
  slug: "dental-sonrisas",
  email: "contacto@dentalsonrisas.com",
  phone: "+52 55 1234 5678",
  plan: "clinic" as const,
  planName: "Clinica",
  planPrice: 99,
  status: "active" as const,
  createdAt: "2024-06-15",
  nextBillingDate: "2025-01-15",
  professionals: [
    { id: "1", name: "Dr. Roberto Gomez", specialty: "Odontologia General", appointmentsThisMonth: 65, status: "active" },
    { id: "2", name: "Dra. Laura Torres", specialty: "Ortodoncia", appointmentsThisMonth: 58, status: "active" },
    { id: "3", name: "Dr. Miguel Hernandez", specialty: "Endodoncia", appointmentsThisMonth: 42, status: "active" },
    { id: "4", name: "Dra. Patricia Ruiz", specialty: "Periodoncia", appointmentsThisMonth: 48, status: "active" },
    { id: "5", name: "Dr. Jose Martinez", specialty: "Cirugia Bucal", appointmentsThisMonth: 35, status: "active" },
    { id: "6", name: "Dra. Carmen Lopez", specialty: "Odontopediatria", appointmentsThisMonth: 72, status: "active" },
    { id: "7", name: "Dr. Fernando Diaz", specialty: "Implantologia", appointmentsThisMonth: 28, status: "inactive" },
    { id: "8", name: "Dra. Sofia Sanchez", specialty: "Estetica Dental", appointmentsThisMonth: 52, status: "active" },
  ],
  stats: {
    totalAppointments: 520,
    totalPatients: 312,
    completionRate: 92,
  },
}

const planColors: Record<string, string> = {
  basic: "bg-muted text-muted-foreground",
  pro: "bg-primary/15 text-primary",
  clinic: "bg-accent/15 text-accent",
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

export default function OrganizationDetailPage() {
  const params = useParams()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    return `${d.getDate()} de ${monthNames[d.getMonth()]} de ${d.getFullYear()}`
  }

  const activeProfessionals = organizationData.professionals.filter((p) => p.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/superadmin/organizaciones">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{organizationData.name}</h1>
              <Badge
                className={`border-0 ${
                  organizationData.status === "active"
                    ? "bg-status-confirmed/15 text-status-confirmed"
                    : "bg-status-cancelled/15 text-status-cancelled"
                }`}
              >
                {organizationData.status === "active" ? "Activa" : "Suspendida"}
              </Badge>
            </div>
            <p className="text-muted-foreground">/{organizationData.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {organizationData.status === "active" ? (
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <UserX className="h-4 w-4" />
              Suspender
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 text-status-confirmed hover:text-status-confirmed">
              <UserCheck className="h-4 w-4" />
              Activar
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeProfessionals}</p>
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
                <p className="text-2xl font-bold text-foreground">{organizationData.stats.totalAppointments}</p>
                <p className="text-sm text-muted-foreground">Citas totales</p>
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
                <p className="text-2xl font-bold text-foreground">{organizationData.stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Pacientes registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-confirmed/10">
                <Calendar className="h-6 w-6 text-status-confirmed" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{organizationData.stats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Tasa de asistencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Organization Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Informacion de la Organizacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{organizationData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefono</p>
                  <p className="font-medium text-foreground">{organizationData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de registro</p>
                  <p className="font-medium text-foreground">{formatDate(organizationData.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Suscripcion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">Plan {organizationData.planName}</span>
                <Badge className={`border-0 ${planColors[organizationData.plan]}`}>
                  {organizationData.planName}
                </Badge>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${organizationData.planPrice}<span className="text-sm font-normal text-muted-foreground">/mes</span>
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Proximo cobro</span>
              <span className="font-medium text-foreground">{formatDate(organizationData.nextBillingDate)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professionals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Profesionales ({organizationData.professionals.length})
          </CardTitle>
          <CardDescription>Listado de profesionales de esta organizacion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organizationData.professionals.map((prof) => (
              <div
                key={prof.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {prof.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{prof.name}</p>
                      <Badge
                        className={`border-0 ${
                          prof.status === "active"
                            ? "bg-status-confirmed/15 text-status-confirmed"
                            : "bg-status-noshow/15 text-status-noshow"
                        }`}
                      >
                        {prof.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{prof.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{prof.appointmentsThisMonth}</p>
                  <p className="text-sm text-muted-foreground">citas este mes</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
