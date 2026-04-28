"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, UserX, UserCheck, Building2, Users, Calendar } from "lucide-react"

// Demo data
const organizations = [
  { id: "1", name: "Clinica Dental Sonrisas", slug: "dental-sonrisas", plan: "clinic", professionals: 8, appointments: 520, status: "active" as const, createdAt: "2024-06-15" },
  { id: "2", name: "Centro Medico Vida", slug: "centro-vida", plan: "pro", professionals: 4, appointments: 245, status: "active" as const, createdAt: "2024-07-20" },
  { id: "3", name: "Consultorio Dr. Martinez", slug: "dr-martinez", plan: "basic", professionals: 1, appointments: 48, status: "active" as const, createdAt: "2024-08-10" },
  { id: "4", name: "Clinica Pediatrica Kids", slug: "pediatrica-kids", plan: "pro", professionals: 3, appointments: 180, status: "active" as const, createdAt: "2024-08-25" },
  { id: "5", name: "Centro Dermatologico", slug: "centro-derma", plan: "clinic", professionals: 6, appointments: 380, status: "suspended" as const, createdAt: "2024-05-01" },
  { id: "6", name: "Clinica Cardiologica Heart", slug: "clinica-heart", plan: "pro", professionals: 5, appointments: 290, status: "active" as const, createdAt: "2024-09-05" },
  { id: "7", name: "Consultorio Dra. Lopez", slug: "dra-lopez", plan: "basic", professionals: 1, appointments: 62, status: "active" as const, createdAt: "2024-10-12" },
  { id: "8", name: "Centro de Fisioterapia Move", slug: "fisio-move", plan: "pro", professionals: 4, appointments: 210, status: "active" as const, createdAt: "2024-11-01" },
]

const planLabels: Record<string, { label: string; color: string }> = {
  basic: { label: "Basico", color: "bg-muted text-muted-foreground" },
  pro: { label: "Pro", color: "bg-primary/15 text-primary" },
  clinic: { label: "Clinica", color: "bg-accent/15 text-accent" },
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrganizations = organizations.filter((org) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = org.name.toLowerCase().includes(query) || org.slug.toLowerCase().includes(query)
    const matchesStatus = statusFilter === "all" || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organizaciones</h1>
        <p className="text-muted-foreground">Gestiona todas las organizaciones del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">{filteredOrganizations.length} Organizaciones</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o slug..."
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
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="suspended">Suspendidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {org.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{org.name}</p>
                        <Badge className={`border-0 ${planLabels[org.plan].color}`}>
                          {planLabels[org.plan].label}
                        </Badge>
                        <Badge
                          variant={org.status === "active" ? "default" : "secondary"}
                          className={`border-0 ${
                            org.status === "active"
                              ? "bg-status-confirmed/15 text-status-confirmed"
                              : "bg-status-cancelled/15 text-status-cancelled"
                          }`}
                        >
                          {org.status === "active" ? "Activa" : "Suspendida"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">/{org.slug}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {org.professionals} profesional{org.professionals !== 1 ? "es" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {org.appointments} citas
                        </span>
                        <span>Registrada: {formatDate(org.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/superadmin/organizaciones/${org.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        Ver Detalle
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/superadmin/organizaciones/${org.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {org.status === "active" ? (
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Suspender
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-status-confirmed focus:text-status-confirmed">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No se encontraron organizaciones</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
