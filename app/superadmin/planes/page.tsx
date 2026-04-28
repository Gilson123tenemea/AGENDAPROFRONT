"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Check } from "lucide-react"

const mockPlans = [
  {
    id: "1",
    name: "Básico",
    price: 29900,
    interval: "monthly",
    maxProfessionals: 1,
    maxAppointmentsPerMonth: 100,
    features: ["Agenda online", "Recordatorios WhatsApp", "Perfil público"],
    isActive: true,
    organizationsCount: 45,
  },
  {
    id: "2",
    name: "Profesional",
    price: 59900,
    interval: "monthly",
    maxProfessionals: 5,
    maxAppointmentsPerMonth: 500,
    features: ["Todo en Básico", "Múltiples profesionales", "Reportes avanzados", "Soporte prioritario"],
    isActive: true,
    organizationsCount: 28,
  },
  {
    id: "3",
    name: "Empresa",
    price: 149900,
    interval: "monthly",
    maxProfessionals: -1,
    maxAppointmentsPerMonth: -1,
    features: ["Todo en Profesional", "Profesionales ilimitados", "Citas ilimitadas", "API acceso", "Soporte 24/7"],
    isActive: true,
    organizationsCount: 12,
  },
  {
    id: "4",
    name: "Trial",
    price: 0,
    interval: "monthly",
    maxProfessionals: 1,
    maxAppointmentsPerMonth: 20,
    features: ["Agenda online", "Recordatorios WhatsApp"],
    isActive: true,
    organizationsCount: 156,
  },
]

export default function PlanesPage() {
  const [plans] = useState(mockPlans)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis"
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planes</h1>
          <p className="text-muted-foreground">
            Gestiona los planes de suscripción disponibles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plan</DialogTitle>
              <DialogDescription>
                Define las características y límites del nuevo plan
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Plan</Label>
                  <Input id="name" placeholder="Ej: Premium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (CLP)</Label>
                  <Input id="price" type="number" placeholder="99900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxProfessionals">Máx. Profesionales</Label>
                  <Input id="maxProfessionals" type="number" placeholder="-1 para ilimitado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAppointments">Máx. Citas/Mes</Label>
                  <Input id="maxAppointments" type="number" placeholder="-1 para ilimitado" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Características (una por línea)</Label>
                <Textarea 
                  id="features" 
                  placeholder="Agenda online&#10;Recordatorios WhatsApp&#10;Soporte prioritario"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" defaultChecked />
                <Label htmlFor="isActive">Plan activo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Crear Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant={plan.isActive ? "default" : "secondary"}>
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(plan.price)}
                </span>
                {plan.price > 0 && <span className="text-muted-foreground">/mes</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profesionales:</span>
                  <span className="font-medium">
                    {plan.maxProfessionals === -1 ? "Ilimitados" : plan.maxProfessionals}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Citas/mes:</span>
                  <span className="font-medium">
                    {plan.maxAppointmentsPerMonth === -1 ? "Ilimitadas" : plan.maxAppointmentsPerMonth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organizaciones:</span>
                  <span className="font-medium">{plan.organizationsCount}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Características:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Planes</CardTitle>
          <CardDescription>
            Vista detallada de todos los planes y sus métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Límite Prof.</TableHead>
                <TableHead>Límite Citas</TableHead>
                <TableHead>Organizaciones</TableHead>
                <TableHead>Ingresos Est.</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{formatPrice(plan.price)}</TableCell>
                  <TableCell>
                    {plan.maxProfessionals === -1 ? "Ilimitados" : plan.maxProfessionals}
                  </TableCell>
                  <TableCell>
                    {plan.maxAppointmentsPerMonth === -1 ? "Ilimitadas" : plan.maxAppointmentsPerMonth}
                  </TableCell>
                  <TableCell>{plan.organizationsCount}</TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(plan.price * plan.organizationsCount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
