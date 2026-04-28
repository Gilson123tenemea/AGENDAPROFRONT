"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar, Loader2, ArrowLeft, CheckCircle,
  User, Phone, Mail, MessageSquare
} from "lucide-react"
import { perfilPublicoProfesional, reservarCita } from "@/app/servicios/publico"

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]

// ── Validación de teléfono ───────────────────────────────────────────
// Acepta formatos: +593991234567 | 0991234567 | +1 (555) 123-4567
function validarTelefono(tel: string): boolean {
  const limpio = tel.replace(/[\s\-\(\)]/g, "")
  return /^\+?[0-9]{7,15}$/.test(limpio)
}

type Profesional = {
  nombre_completo: string
  titulo_profesional: string | null
  duracion_cita_min: number
  requiere_pago: boolean
  precio: number | null
  atiende_en: string | null
  organizacion_nombre?: string
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params.token as string
  const date = searchParams.get("date")   // "2026-04-22"
  const time = searchParams.get("time")   // "09:00"

  const [profesional, setProfesional] = useState<Profesional | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenReserva, setTokenReserva] = useState("")

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    motivo: "",
  })

  // ── Errores de campo individuales ──────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // ── Carga perfil ──────────────────────────────────────────────────
  useEffect(() => {
    if (!date || !time) {
      router.replace(`/p/${token}`)
      return
    }
    const cargar = async () => {
      try {
        const data = await perfilPublicoProfesional(token)
        setProfesional(data?.data ?? data)
      } catch {
        // Si falla igual dejamos reservar
      } finally {
        setIsFetching(false)
      }
    }
    cargar()
  }, [token, date, time, router])

  const formatDate = () => {
    if (!date) return ""
    const d = new Date(date + "T12:00:00")
    return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`
  }

  const buildInicio = () => `${date}T${time}:00`

  // ── Validación ────────────────────────────────────────────────────
  const validar = (): boolean => {
    const errores: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      errores.nombre = "El nombre es obligatorio"
    } else if (formData.nombre.trim().length < 3) {
      errores.nombre = "Ingresa tu nombre completo"
    }

    if (!formData.telefono.trim()) {
      errores.telefono = "El número de WhatsApp es obligatorio"
    } else if (!validarTelefono(formData.telefono)) {
      errores.telefono = "Ingresa un número válido (ej: +593 99 123 4567)"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errores.email = "Ingresa un correo válido"
    }

    if (!formData.motivo.trim()) {
      errores.motivo = "El motivo de consulta es obligatorio"
    } else if (formData.motivo.trim().length < 10) {
      errores.motivo = "Por favor describe un poco más el motivo (mínimo 10 caracteres)"
    }

    setFieldErrors(errores)
    return Object.keys(errores).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validar()) return

    setIsLoading(true)
    try {
      const resultado = await reservarCita(token, {
        nombre_paciente: formData.nombre.trim(),
        telefono_paciente: formData.telefono.trim(),
        email_paciente: formData.email.trim() || undefined,
        motivo: formData.motivo.trim(),
        inicio: buildInicio(),
      })

      if (!resultado.ok) {
        // Errores conocidos del backend
        const msg = resultado.message ?? ""
        if (msg.includes("no disponible") || msg.includes("ocupado")) {
          setError("Ese horario ya no está disponible. Vuelve y elige otro.")
        } else {
          setError(msg || "Error al reservar. Intenta de nuevo.")
        }
        return
      }

      const reserva = resultado.data?.data ?? resultado.data
      setTokenReserva(reserva?.token_reserva ?? reserva?.token ?? "")
      setSuccess(true)
    } catch {
      setError("No pudimos conectar con el servidor. Verifica tu conexión e intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Helper para clases de campo con error ─────────────────────────
  const inputClass = (campo: string) =>
    fieldErrors[campo] ? "border-destructive focus-visible:ring-destructive" : ""

  // ── Pantalla de éxito ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto flex h-14 items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">AgendaPro</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Cita Reservada!</CardTitle>
              <CardDescription>Tu cita ha sido agendada exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                <p className="font-medium text-foreground mb-2">Detalles de tu cita</p>
                {profesional && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profesional</span>
                    <span className="font-medium">{profesional.nombre_completo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paciente</span>
                  <span>{formData.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha</span>
                  <span>{formatDate()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora</span>
                  <span>{time}</span>
                </div>
                {profesional?.duracion_cita_min && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración</span>
                    <span>{profesional.duracion_cita_min} minutos</span>
                  </div>
                )}
                {profesional?.requiere_pago && profesional.precio && (
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-muted-foreground">Total a pagar</span>
                    <span className="font-medium">${profesional.precio} USD</span>
                  </div>
                )}
              </div>

              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-sm text-green-800">
                  Recibirás una confirmación por WhatsApp al número{" "}
                  <span className="font-medium">{formData.telefono}</span> con todos los detalles.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {tokenReserva && (
                  <Button asChild className="w-full">
                    <Link href={`/cita/${tokenReserva}`}>Ver estado de mi cita</Link>
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/p/${token}`}>Agendar otra cita</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // ── Formulario ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AgendaPro</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-lg">
          <Button variant="ghost" asChild className="mb-6 gap-2">
            <Link href={`/p/${token}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver a seleccionar horario
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Completa tu reserva</CardTitle>
              <CardDescription>Ingresa tus datos para confirmar la cita</CardDescription>
            </CardHeader>
            <CardContent>

              {/* Resumen de la cita */}
              <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {isFetching ? "Cargando..." : profesional?.nombre_completo ?? "Profesional"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate()} a las {time}
                    </p>
                    {profesional?.duracion_cita_min && (
                      <p className="text-xs text-muted-foreground">
                        {profesional.duracion_cita_min} min
                        {profesional.requiere_pago && profesional.precio
                          ? ` · $${profesional.precio} USD`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Nombre */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    disabled={isLoading}
                    className={inputClass("nombre")}
                    onChange={e => {
                      setFormData(p => ({ ...p, nombre: e.target.value }))
                      if (fieldErrors.nombre) setFieldErrors(p => ({ ...p, nombre: "" }))
                    }}
                  />
                  {fieldErrors.nombre && (
                    <p className="text-xs text-destructive">{fieldErrors.nombre}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+593 99 123 4567"
                    value={formData.telefono}
                    disabled={isLoading}
                    className={inputClass("telefono")}
                    onChange={e => {
                      setFormData(p => ({ ...p, telefono: e.target.value }))
                      if (fieldErrors.telefono) setFieldErrors(p => ({ ...p, telefono: "" }))
                    }}
                  />
                  {fieldErrors.telefono ? (
                    <p className="text-xs text-destructive">{fieldErrors.telefono}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Recibirás la confirmación aquí. Si ya tienes citas previas, se vincularán automáticamente.
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Correo electrónico{" "}
                    <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    disabled={isLoading}
                    className={inputClass("email")}
                    onChange={e => {
                      setFormData(p => ({ ...p, email: e.target.value }))
                      if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: "" }))
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Motivo */}
                <div className="space-y-1.5">
                  <Label htmlFor="motivo" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Motivo de consulta <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="motivo"
                    rows={3}
                    placeholder="Describe brevemente el motivo de tu consulta"
                    value={formData.motivo}
                    disabled={isLoading}
                    className={inputClass("motivo")}
                    onChange={e => {
                      setFormData(p => ({ ...p, motivo: e.target.value }))
                      if (fieldErrors.motivo) setFieldErrors(p => ({ ...p, motivo: "" }))
                    }}
                  />
                  <div className="flex items-center justify-between">
                    {fieldErrors.motivo ? (
                      <p className="text-xs text-destructive">{fieldErrors.motivo}</p>
                    ) : (
                      <span />
                    )}
                    <p className={`text-xs ${formData.motivo.length < 10 && formData.motivo.length > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {formData.motivo.length}/500
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirmando...</>
                    : "Confirmar reserva"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Al confirmar aceptas que el profesional contacte contigo por WhatsApp.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}