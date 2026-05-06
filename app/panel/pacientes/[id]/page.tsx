"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft, Phone, Mail, Calendar, FileText,
  Save, Loader2, User, CheckCircle, XCircle, AlertCircle,
} from "lucide-react"
import { obtenerPaciente, historialCitasPaciente, actualizarNotasPaciente } from "@/app/servicios/pacientes"

// ── Tipos ─────────────────────────────────────────────────────────────
type Paciente = {
  id: number
  nombre_completo: string
  telefono: string
  email: string | null
  notas: string | null
  creado_en: string
}

type Cita = {
  id: number
  inicio: string
  fin: string
  motivo: string
  estado: string
  asistio: boolean | null
  motivo_cancelacion: string | null
}

type Historial = {
  citas: Cita[]
  total: number
  completadas: number
  no_asistio: number
  canceladas: number
  tasa_asistencia: number
}

// ── Helpers ───────────────────────────────────────────────────────────
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function formatFecha(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

function formatHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false })
}

function iniciales(nombre: string) {
  return nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
}

// ── Badge de estado ───────────────────────────────────────────────────
const ESTADO_CONFIG: Record<string, { label: string; className: string }> = {
  pendiente:  { label: "Pendiente",  className: "bg-amber-100 text-amber-800" },
  confirmada: { label: "Confirmada", className: "bg-blue-100 text-blue-800"   },
  completada: { label: "Completada", className: "bg-green-100 text-green-800" },
  cancelada:  { label: "Cancelada",  className: "bg-red-100 text-red-800"     },
  no_asistio: { label: "No asistió", className: "bg-gray-100 text-gray-700"  },
}

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, className: "bg-muted text-muted-foreground" }
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

// ── Componente principal ──────────────────────────────────────────────
export default function PatientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [paciente,  setPaciente]  = useState<Paciente | null>(null)
  const [historial, setHistorial] = useState<Historial | null>(null)
  const [cargando,  setCargando]  = useState(true)

  const [notas,     setNotas]     = useState("")
  const [editando,  setEditando]  = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado,  setGuardado]  = useState(false)

  // ── Carga inicial ────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resPaciente, resHistorial] = await Promise.all([
          obtenerPaciente(id),
          historialCitasPaciente(id),
        ])
        const p = resPaciente?.data  ?? resPaciente
        const h = resHistorial?.data ?? resHistorial
        setPaciente(p)
        setHistorial(h)
        setNotas(p.notas ?? "")
      } catch {
        // estados quedan en null
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  // ── Guardar notas ────────────────────────────────────────────────
  const handleGuardarNotas = async () => {
    if (!paciente) return
    setGuardando(true)
    setGuardado(false)
    try {
      const res = await actualizarNotasPaciente(paciente.id, { notas })
      const actualizado = res?.data ?? res
      setNotas(actualizado.notas ?? "")
      setGuardado(true)
      setEditando(false)
    } catch {
      // silencioso
    } finally {
      setGuardando(false)
    }
  }

  // ── Cargando ─────────────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────
  if (!paciente) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
        <User className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No se pudo cargar la información del paciente</p>
        <Button variant="outline" asChild>
          <Link href="/panel/pacientes">Volver a pacientes</Link>
        </Button>
      </div>
    )
  }

  const proximas = historial?.citas.filter(
    (c) => c.estado === "pendiente" || c.estado === "confirmada"
  ).length ?? 0

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/panel/pacientes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{paciente.nombre_completo}</h1>
          <p className="text-muted-foreground">Paciente desde {formatFecha(paciente.creado_en)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Columna principal ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información de contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {iniciales(paciente.nombre_completo)}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teléfono</p>
                        <p className="font-medium text-foreground">{paciente.telefono}</p>
                      </div>
                    </div>
                    {paciente.email && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{paciente.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://wa.me/${paciente.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                    {paciente.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${paciente.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Notas del paciente
                  </CardTitle>
                  <CardDescription>
                    Información clínica general, alergias, preferencias u observaciones
                  </CardDescription>
                </div>
                {!editando && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGuardado(false)
                      setEditando(true)
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {notas ? "Editar nota" : "Agregar nota"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editando ? (
                <div className="space-y-3">
                  <Textarea
                    value={notas}
                    onChange={(e) => {
                      setNotas(e.target.value)
                      setGuardado(false)
                    }}
                    placeholder="Ej: Paciente con piel sensible, alérgico a parabenos..."
                    rows={5}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleGuardarNotas} disabled={guardando}>
                      {guardando ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Guardando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Guardar
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={guardando}
                      onClick={() => {
                        setNotas(paciente.notas ?? "")
                        setEditando(false)
                        setGuardado(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {guardado && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      Nota guardada correctamente
                    </div>
                  )}
                  {notas ? (
                    <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
                      {notas}
                    </p>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">
                        Sin notas — pulsa "Agregar nota" para añadir información
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Historial de citas
              </CardTitle>
              {historial && (
                <CardDescription>
                  {historial.total} cita{historial.total !== 1 ? "s" : ""} en total
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {(!historial || historial.citas.length === 0) ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No hay citas registradas con este profesional
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historial.citas.map((cita) => (
                    <Link
                      key={cita.id}
                      href={`/panel/citas/${cita.id}`}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{cita.motivo}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFecha(cita.inicio)} · {formatHora(cita.inicio)} – {formatHora(cita.fin)}
                        </p>
                        {cita.motivo_cancelacion && (
                          <p className="text-xs italic text-muted-foreground">
                            Cancelación: {cita.motivo_cancelacion}
                          </p>
                        )}
                      </div>
                      <EstadoBadge estado={cita.estado} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* ── Sidebar estadísticas ── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {historial ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de citas</span>
                    <span className="text-xl font-bold text-foreground">{historial.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Completadas
                    </span>
                    <span className="text-xl font-bold text-green-600">{historial.completadas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      No asistió
                    </span>
                    <span className="text-xl font-bold text-gray-500">{historial.no_asistio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-400" />
                      Canceladas
                    </span>
                    <span className="text-xl font-bold text-red-500">{historial.canceladas}</span>
                  </div>
                  {proximas > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Próximas</span>
                      <span className="text-xl font-bold text-blue-500">{proximas}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tasa de asistencia</span>
                      <span className="text-xl font-bold text-primary">{historial.tasa_asistencia}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${historial.tasa_asistencia}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}