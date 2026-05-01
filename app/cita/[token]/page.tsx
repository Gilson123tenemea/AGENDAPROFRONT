"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar, Clock, Star, DollarSign, ChevronLeft, ChevronRight,
  MapPin, MessageCircle, User, Loader2, Languages, Briefcase,
  GraduationCap, Phone, MessageSquare, XCircle, AlertTriangle,
} from "lucide-react"
import { estadoCita, cancelarCitaPublica, tokenPublicoProfesionalDeCita } from "@/app/servicios/publico"

// ── Tipos ─────────────────────────────────────────────────────────────
type EstadoCita =
  | "pendiente" | "confirmada" | "cancelada"
  | "completada" | "no_asistio"

type CitaPublica = {
  token_reserva: string
  estado: EstadoCita
  inicio: string
  fin: string
  motivo: string
  motivo_cancelacion: string | null
  nombre_paciente: string
  telefono_paciente: string
  nombre_profesional: string
  titulo_profesional: string | null
  telefono_profesional: string | null
  organizacion_nombre: string
  direccion_consultorio: string | null
}

// ── Config de estados ──────────────────────────────────────────────────
const ESTADO_CONFIG: Record<EstadoCita, {
  label: string
  badgeBg: string
  badgeText: string
  iconBg: string
  iconColor: string
}> = {
  pendiente:  { label: "Pendiente de pago", badgeBg: "bg-amber-100",  badgeText: "text-amber-800",  iconBg: "bg-amber-100",  iconColor: "text-amber-600"  },
  confirmada: { label: "Confirmada",         badgeBg: "bg-green-100",  badgeText: "text-green-800",  iconBg: "bg-green-100",  iconColor: "text-green-600"  },
  cancelada:  { label: "Cancelada",          badgeBg: "bg-red-100",    badgeText: "text-red-800",    iconBg: "bg-red-100",    iconColor: "text-red-500"    },
  completada: { label: "Completada",         badgeBg: "bg-blue-100",   badgeText: "text-blue-800",   iconBg: "bg-blue-100",   iconColor: "text-blue-600"   },
  no_asistio: { label: "No asistió",         badgeBg: "bg-gray-100",   badgeText: "text-gray-700",   iconBg: "bg-gray-100",   iconColor: "text-gray-500"   },
}

const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
]
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]

function formatFecha(iso: string) {
  const d = new Date(iso)
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}
function formatHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false })
}

// ── Componente ────────────────────────────────────────────────────────
export default function AppointmentStatusPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [cita, setCita]             = useState<CitaPublica | null>(null)
  const [cargando, setCargando]     = useState(true)
  const [errorCarga, setErrorCarga] = useState("")

  const [mostraCancelar, setMostraCancelar]       = useState(false)
  const [motivoCancelacion, setMotivoCancelacion] = useState("")
  const [cancelando, setCancelando]               = useState(false)
  const [errorCancelar, setErrorCancelar]         = useState("")

  // ── Nuevo: resolución del token público del profesional ──────────
  const [tokenProfesional, setTokenProfesional]   = useState<string | null>(null)
  const [cargandoTokenProf, setCargandoTokenProf] = useState(false)

  // ── Carga inicial ────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await estadoCita(token)
        setCita(res?.data ?? res)
      } catch {
        setErrorCarga("No pudimos encontrar esta cita. Verifica el enlace.")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [token])

  // ── Cancelación ──────────────────────────────────────────────────
  const handleCancelar = async () => {
    setErrorCancelar("")
    if (!motivoCancelacion.trim()) {
      setErrorCancelar("Por favor indica el motivo de cancelación")
      return
    }
    setCancelando(true)
    try {
      const res = await cancelarCitaPublica(token, {
        motivo_cancelacion: motivoCancelacion.trim(),
      })
      setCita(res?.data ?? res)
      setMostraCancelar(false)
    } catch {
      setErrorCancelar("No pudimos cancelar la cita. Intenta de nuevo.")
    } finally {
      setCancelando(false)
    }
  }

  // ── Navegar al perfil del profesional resolviendo el token ───────
  const irAlPerfilProfesional = async () => {
    // Si ya lo tenemos cacheado, navegar directo sin nueva petición
    if (tokenProfesional) {
      router.push(`/p/${tokenProfesional}`)
      return
    }
    setCargandoTokenProf(true)
    try {
      const res = await tokenPublicoProfesionalDeCita(token)
      const tp = res?.token_publico ?? res?.data?.token_publico
      if (!tp) throw new Error("Token no recibido")
      setTokenProfesional(tp)
      router.push(`/p/${tp}`)
    } catch {
      // Fallo silencioso — el botón queda habilitado para reintentar
    } finally {
      setCargandoTokenProf(false)
    }
  }

  // ── Estados de carga / error ─────────────────────────────────────
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (errorCarga || !cita) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Cita no encontrada</h1>
        <p className="text-muted-foreground">{errorCarga}</p>
      </div>
    )
  }

  const cfg       = ESTADO_CONFIG[cita.estado] ?? ESTADO_CONFIG.pendiente
  const puedeCanc = cita.estado === "pendiente" || cita.estado === "confirmada"
  const puedeCal  = cita.estado === "completada"

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
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${cfg.iconBg}`}>
              <Calendar className={`h-8 w-8 ${cfg.iconColor}`} />
            </div>
            <CardTitle className="text-2xl">Estado de tu cita</CardTitle>
            <CardDescription className="font-mono text-xs">
              {token.slice(0, 8)}…{token.slice(-8)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Badge de estado */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${cfg.badgeBg} ${cfg.badgeText}`}>
                {cfg.label}
              </span>
            </div>

            {/* Motivo de cancelación si aplica */}
            {cita.estado === "cancelada" && cita.motivo_cancelacion && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-sm text-red-800">
                  Motivo de cancelación: {cita.motivo_cancelacion}
                </AlertDescription>
              </Alert>
            )}

            {/* Detalles */}
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profesional</p>
                  <p className="font-medium text-foreground">{cita.nombre_profesional}</p>
                  {cita.titulo_profesional && (
                    <p className="text-sm text-muted-foreground">{cita.titulo_profesional}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium text-foreground">{cita.nombre_paciente}</p>
                  <p className="text-sm text-muted-foreground">{cita.telefono_paciente}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha y hora</p>
                  <p className="font-medium text-foreground capitalize">{formatFecha(cita.inicio)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatHora(cita.inicio)} – {formatHora(cita.fin)}
                  </p>
                </div>
              </div>

              {(cita.organizacion_nombre || cita.direccion_consultorio) && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="font-medium text-foreground">{cita.organizacion_nombre}</p>
                    {cita.direccion_consultorio && (
                      <p className="text-sm text-muted-foreground">{cita.direccion_consultorio}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Motivo de consulta</p>
                  <p className="font-medium text-foreground">{cita.motivo}</p>
                </div>
              </div>

              {cita.telefono_profesional && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contacto del profesional</p>
                    <p className="font-medium text-foreground">{cita.telefono_profesional}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Panel de cancelación inline ─────────────────────── */}
            {mostraCancelar && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                <p className="text-sm font-medium text-destructive">¿Seguro que deseas cancelar?</p>
                <div className="space-y-1.5">
                  <Label htmlFor="motivo-cancel" className="text-xs text-muted-foreground">
                    Motivo de cancelación <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="motivo-cancel"
                    rows={2}
                    placeholder="Ej: Tengo un imprevisto ese día"
                    value={motivoCancelacion}
                    disabled={cancelando}
                    onChange={e => {
                      setMotivoCancelacion(e.target.value)
                      setErrorCancelar("")
                    }}
                  />
                  {errorCancelar && (
                    <p className="text-xs text-destructive">{errorCancelar}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={cancelando}
                    onClick={() => { setMostraCancelar(false); setErrorCancelar("") }}
                  >
                    Volver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    disabled={cancelando}
                    onClick={handleCancelar}
                  >
                    {cancelando
                      ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" />Cancelando...</>
                      : "Confirmar cancelación"}
                  </Button>
                </div>
              </div>
            )}

            {/* ── Acciones ─────────────────────────────────────────── */}
            {!mostraCancelar && (
              <div className="space-y-3 pt-2">
                {puedeCal && (
                  <Button asChild className="w-full gap-2">
                    <Link href={`/calificar/${token}`}>
                      <Star className="h-4 w-4" />
                      Calificar tu experiencia
                    </Link>
                  </Button>
                )}
                {puedeCanc && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setMostraCancelar(true)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar cita
                  </Button>
                )}

                {/* ← Reemplaza el <Link> estático — resuelve el token antes de navegar */}
                <Button
                  variant="ghost"
                  className="w-full"
                  disabled={cargandoTokenProf}
                  onClick={irAlPerfilProfesional}
                >
                  {cargandoTokenProf
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cargando perfil...</>
                    : "Ver perfil del profesional"}
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </main>
    </div>
  )
}