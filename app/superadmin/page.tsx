"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, DollarSign, TrendingUp, ChevronRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Demo data
const stats = {
  totalOrganizations: 156,
  activeOrganizations: 142,
  totalAppointments: 12450,
  monthlyRevenue: 9340,
}

const growthData = [
  { month: "Jul", organizations: 98, appointments: 8200 },
  { month: "Ago", organizations: 112, appointments: 9100 },
  { month: "Sep", organizations: 125, appointments: 10200 },
  { month: "Oct", organizations: 138, appointments: 11000 },
  { month: "Nov", organizations: 148, appointments: 11800 },
  { month: "Dic", organizations: 156, appointments: 12450 },
]

const recentOrganizations = [
  { id: "1", name: "Clinica Dental Sonrisas", plan: "clinic", professionals: 8, status: "active", createdAt: "2024-12-18" },
  { id: "2", name: "Centro Medico Vida", plan: "pro", professionals: 4, status: "active", createdAt: "2024-12-15" },
  { id: "3", name: "Consultorio Dr. Martinez", plan: "basic", professionals: 1, status: "active", createdAt: "2024-12-12" },
  { id: "4", name: "Clinica Pediatrica Kids", plan: "pro", professionals: 3, status: "active", createdAt: "2024-12-10" },
]

const planLabels: Record<string, string> = {
  basic: "Basico",
  pro: "Pro",
  clinic: "Clinica",
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function SuperadminDashboard() {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vista general del sistema AgendaPro</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrganizations}</p>
                <p className="text-sm text-muted-foreground">Organizaciones totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-confirmed/10">
                <Building2 className="h-6 w-6 text-status-confirmed" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeOrganizations}</p>
                <p className="text-sm text-muted-foreground">Organizaciones activas</p>
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
                <p className="text-2xl font-bold text-foreground">{(stats.totalAppointments / 1000).toFixed(1)}k</p>
                <p className="text-sm text-muted-foreground">Citas procesadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
                <p className="text-sm text-muted-foreground">Ingresos del mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Crecimiento de Organizaciones
            </CardTitle>
            <CardDescription>Ultimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="organizations"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Citas Procesadas
            </CardTitle>
            <CardDescription>Ultimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Organizations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Organizaciones Recientes</CardTitle>
            <CardDescription>Ultimas organizaciones registradas</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/superadmin/organizaciones" className="gap-1">
              Ver todas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrganizations.map((org) => (
              <Link
                key={org.id}
                href={`/superadmin/organizaciones/${org.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {org.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{org.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {planLabels[org.plan]} - {org.professionals} profesional{org.professionals !== 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    org.status === "active"
                      ? "bg-status-confirmed/15 text-status-confirmed"
                      : "bg-status-cancelled/15 text-status-cancelled"
                  }`}>
                    {org.status === "active" ? "Activa" : "Suspendida"}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(org.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
