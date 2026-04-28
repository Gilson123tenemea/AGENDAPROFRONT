"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Loader2, ArrowLeft, XCircle, AlertTriangle } from "lucide-react"

// Demo data
const appointmentData = {
  professional: {
    name: "Dra. Maria Garcia",
    specialty: "Dermatologia",
  },
  date: "2024-12-20",
  time: "10:00",
  duration: 30,
}

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export default function CancelAppointmentPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reason, setReason] = useState("")

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00")
    const dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    return `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]} de ${d.getFullYear()}`
  }

  const handleCancel = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto flex h-14 items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">AgendaPro</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-cancelled/20">
                <XCircle className="h-8 w-8 text-status-cancelled" />
              </div>
              <CardTitle className="text-2xl">Cita Cancelada</CardTitle>
              <CardDescription>
                Tu cita ha sido cancelada exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profesional</span>
                    <span className="font-medium text-foreground">{appointmentData.professional.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="text-foreground">{formatDate(appointmentData.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora</span>
                    <span className="text-foreground">{appointmentData.time}</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  El profesional ha sido notificado de la cancelacion. Si deseas reagendar, puedes hacerlo desde su perfil publico.
                </AlertDescription>
              </Alert>

              <Button asChild className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">AgendaPro</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-lg">
          <Button variant="ghost" asChild className="mb-6 gap-2">
            <Link href={`/cita/${params.token}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver al estado de la cita
            </Link>
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Cancelar Cita</CardTitle>
              <CardDescription>
                Esta accion no se puede deshacer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Summary */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-3 font-medium text-foreground">Detalles de la cita a cancelar</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profesional</span>
                    <span className="font-medium text-foreground">{appointmentData.professional.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Especialidad</span>
                    <span className="text-foreground">{appointmentData.professional.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="text-foreground">{formatDate(appointmentData.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora</span>
                    <span className="text-foreground">{appointmentData.time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo de cancelacion (opcional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Cuentanos por que cancelas tu cita..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" asChild className="flex-1" disabled={isLoading}>
                  <Link href={`/cita/${params.token}`}>No, Mantener Cita</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    "Si, Cancelar Cita"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
