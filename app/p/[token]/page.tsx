"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar, Clock, Star, DollarSign, ChevronLeft, ChevronRight,
  MapPin, MessageCircle, User, Loader2, Languages, Briefcase, GraduationCap
} from "lucide-react"
import { perfilPublicoProfesional, slotsDisponibles } from "@/app/servicios/publico"

// ── Tipos ────────────────────────────────────────────────────────────
type Profesional = {
  nombre_completo: string
  titulo_profesional: string | null
  descripcion: string | null
  experiencia_anios: number | null
  educacion: string | null
  certificaciones: string | null
  idiomas: string | null
  atiende_en: string | null
  direccion_consultorio: string | null
  duracion_cita_min: number
  requiere_pago: boolean
  precio: number | null
  promedio_calif: number | null
  total_citas: number
  token_publico: string
  organizacion_nombre?: string
}

type Slot = { hora: string; disponible: boolean }

// ── Constantes ───────────────────────────────────────────────────────
const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]
const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]

// ── Helpers ──────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function toISOLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`
}

function normalizeSlots(raw: any[]): Slot[] {
  return raw.map((s: any) => ({
    hora: s.hora ?? s.time ?? s.inicio?.slice(11, 16) ?? "",
    disponible: s.disponible ?? s.available ?? true,
  }))
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${sz} ${s <= rating
          ? "fill-status-pending text-status-pending"
          : "fill-muted text-muted"}`} />
      ))}
    </div>
  )
}

// ── Componente ───────────────────────────────────────────────────────
export default function PublicProfilePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [profesional, setProfesional] = useState<Profesional | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [errorCarga, setErrorCarga] = useState("")

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Set de índices JS (0=Dom…6=Sáb) que tienen horario configurado
  const [diasConHorario, setDiasConHorario] = useState<Set<number>>(new Set())
  const [detectandoDias, setDetectandoDias] = useState(true)

  const [activeTab, setActiveTab] = useState("reservar")

  // ── Carga perfil ─────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await perfilPublicoProfesional(token)
        setProfesional(data?.data ?? data)
      } catch {
        setErrorCarga("No pudimos cargar el perfil. Verifica el enlace.")
      } finally {
        setIsFetching(false)
      }
    }
    cargar()
  }, [token])

  // ── Detecta qué días de la semana tienen horario ─────────────────
  // Consulta cada día de la semana próxima (uno por día) para saber
  // cuáles devuelven slots — esos son los días activos del profesional.
  useEffect(() => {
    const detectar = async () => {
      setDetectandoDias(true)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      // Tomamos la próxima ocurrencia de cada día de la semana (Dom-Sáb)
      const diasActivos = new Set<number>()

      await Promise.all(
        Array.from({ length: 7 }, async (_, diaSemana) => {
          // Encontrar la próxima fecha que cae en ese día de semana
          const fecha = new Date(hoy)
          const diff = (diaSemana - hoy.getDay() + 7) % 7
          fecha.setDate(hoy.getDate() + (diff === 0 ? 7 : diff)) // si es hoy, la semana que viene
          try {
            const data = await slotsDisponibles(token, toISOLocal(fecha))
            const raw: any[] = data?.data ?? data ?? []
            // Si devuelve al menos un slot (disponible o no), ese día tiene horario
            if (raw.length > 0) diasActivos.add(diaSemana)
          } catch {
            // Si falla, asumimos que no hay horario ese día
          }
        })
      )

      setDiasConHorario(diasActivos)
      setDetectandoDias(false)
    }
    detectar()
  }, [token])

  // ── Carga slots al seleccionar fecha ─────────────────────────────
  useEffect(() => {
    if (!selectedDate) return
    const cargarSlots = async () => {
      setLoadingSlots(true)
      setSlots([])
      setSelectedTime(null)
      try {
        const data = await slotsDisponibles(token, toISOLocal(selectedDate))
        const raw: any[] = data?.data ?? data ?? []
        setSlots(normalizeSlots(raw))
      } catch {
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    cargarSlots()
  }, [selectedDate, token])

  // ── Calendario helpers ────────────────────────────────────────────
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const lastDay = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = Array(firstDay).fill(null)
    for (let i = 1; i <= lastDay; i++) days.push(i)
    return days
  }

  const isPastDay = (day: number) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < today
  }

  // Día sin horario configurado (profesional no atiende ese día de la semana)
  const isInactiveDay = (day: number) => {
    if (detectandoDias) return false // mientras detecta, no bloqueamos
    const fecha = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return !diasConHorario.has(fecha.getDay())
  }

  const isSelectedDay = (day: number) =>
    !!selectedDate &&
    day === selectedDate.getDate() &&
    currentMonth.getMonth() === selectedDate.getMonth() &&
    currentMonth.getFullYear() === selectedDate.getFullYear()

  const isToday = (day: number) => {
    const t = new Date()
    return (
      day === t.getDate() &&
      currentMonth.getMonth() === t.getMonth() &&
      currentMonth.getFullYear() === t.getFullYear()
    )
  }

  const isPrevMonthDisabled = () => {
    const t = new Date()
    return currentMonth.getMonth() === t.getMonth() && currentMonth.getFullYear() === t.getFullYear()
  }

  const handleDayClick = (day: number) => {
    if (isPastDay(day) || isInactiveDay(day)) return
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ""
    return `${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}`
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return
    const dateStr = selectedDate.toISOString().split("T")[0]
    router.push(`/p/${token}/reservar?date=${dateStr}&time=${selectedTime}`)
  }

  // ── Render de estado ──────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (errorCarga || !profesional) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 text-center px-4">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Perfil no encontrado</h1>
        <p className="text-muted-foreground">{errorCarga || "El enlace no es válido o ha expirado."}</p>
      </div>
    )
  }

  // ── Render principal ──────────────────────────────────────────────
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
        <div className="mx-auto max-w-4xl">

          {/* Info profesional */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary">
                  {initials(profesional.nombre_completo)}
                </div>
                <div className="flex-1">
                  <h1 className="mb-0.5 text-2xl font-bold text-foreground">{profesional.nombre_completo}</h1>
                  {profesional.titulo_profesional && (
                    <p className="mb-1 text-lg text-primary">{profesional.titulo_profesional}</p>
                  )}
                  {profesional.organizacion_nombre && (
                    <p className="mb-3 text-sm text-muted-foreground">{profesional.organizacion_nombre}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profesional.promedio_calif && profesional.promedio_calif > 0 ? (
                      <button onClick={() => setActiveTab("opiniones")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Star className="h-4 w-4 fill-status-pending text-status-pending" />
                        <span className="font-medium text-foreground">{Number(profesional.promedio_calif).toFixed(1)}</span>
                        <span className="underline">({profesional.total_citas} citas)</span>
                      </button>
                    ) : null}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /><span>{profesional.duracion_cita_min} min</span>
                    </div>
                    {profesional.requiere_pago && profesional.precio && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /><span>${profesional.precio} USD</span>
                      </div>
                    )}
                    {profesional.atiende_en && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /><span>{profesional.atiende_en}</span>
                      </div>
                    )}
                  </div>
                  {profesional.direccion_consultorio && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{profesional.direccion_consultorio}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="reservar" className="gap-2">
                <Calendar className="h-4 w-4" />Reservar
              </TabsTrigger>
              <TabsTrigger value="perfil" className="gap-2">
                <User className="h-4 w-4" />Perfil
              </TabsTrigger>
              <TabsTrigger value="opiniones" className="gap-2">
                <MessageCircle className="h-4 w-4" />Opiniones
              </TabsTrigger>
            </TabsList>

            {/* ── Tab Reservar ── */}
            <TabsContent value="reservar">
              <div className="grid gap-6 lg:grid-cols-2">

                {/* Calendario */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Selecciona una fecha</CardTitle>
                        {/* Leyenda de días */}
                        {!detectandoDias && diasConHorario.size > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Atiende: {Array.from(diasConHorario).sort().map(d => DAY_NAMES[d]).join(", ")}
                          </p>
                        )}
                        {detectandoDias && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Verificando disponibilidad...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          disabled={isPrevMonthDisabled()}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[130px] text-center text-sm font-medium">
                          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <Button variant="outline" size="icon"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {DAY_NAMES.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                      ))}
                      {getDaysInMonth(currentMonth).map((day, i) => {
                        if (day === null) return <div key={i} />

                        const past = isPastDay(day)
                        const inactive = isInactiveDay(day)
                        const selected = isSelectedDay(day)
                        const today = isToday(day)
                        const disabled = past || inactive

                        return (
                          <button key={i}
                            disabled={disabled}
                            onClick={() => handleDayClick(day)}
                            title={inactive && !past ? "El profesional no atiende este día" : undefined}
                            className={`relative flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors
                              ${selected
                                ? "bg-primary text-primary-foreground"
                                : today && !disabled
                                  ? "border border-primary bg-primary/10 font-medium"
                                  : past
                                    ? "cursor-not-allowed text-muted-foreground/30"
                                    : inactive
                                      ? "cursor-not-allowed text-muted-foreground/30 line-through"
                                      : "hover:bg-muted cursor-pointer"
                              }`}>
                            {day}
                            {/* Punto verde para días con horario activo */}
                            {!past && !inactive && !selected && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/60" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Leyenda del calendario */}
                    {!detectandoDias && (
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary/60" />
                          Disponible
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block w-4 text-center line-through text-muted-foreground/30 text-xs">15</span>
                          Sin atención
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Slots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDate ? formatSelectedDate() : "Selecciona un horario"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDate ? "Elige un horario disponible" : "Primero selecciona una fecha en el calendario"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!selectedDate ? (
                      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">Selecciona una fecha para ver horarios</p>
                      </div>
                    ) : loadingSlots ? (
                      <div className="flex h-48 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
                        <Clock className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Sin horarios disponibles para este día</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slots.map(slot => (
                            <Button key={slot.hora}
                              variant={selectedTime === slot.hora ? "default" : "outline"}
                              disabled={!slot.disponible}
                              onClick={() => setSelectedTime(slot.hora)}
                              className={`w-full ${!slot.disponible ? "opacity-40 line-through" : ""}`}>
                              {slot.hora}
                            </Button>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded border border-border bg-background" />
                            Disponible
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded border border-border bg-muted opacity-40" />
                            Ocupado
                          </span>
                        </div>
                      </>
                    )}

                    {selectedDate && selectedTime && (
                      <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4 space-y-1.5 text-sm">
                          <p className="font-medium text-foreground mb-2">Resumen de tu cita</p>
                          <p className="text-muted-foreground">{profesional.nombre_completo}</p>
                          <p className="text-muted-foreground">{formatSelectedDate()} a las {selectedTime}</p>
                          <p className="text-muted-foreground">Duración: {profesional.duracion_cita_min} min</p>
                          {profesional.requiere_pago && profesional.precio && (
                            <p className="font-medium text-foreground pt-1">Precio: ${profesional.precio} USD</p>
                          )}
                        </div>
                        <Button onClick={handleContinue} className="w-full">
                          Continuar con la Reserva
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Tab Perfil ── */}
            <TabsContent value="perfil">
              <div className="grid gap-6 lg:grid-cols-2">
                {profesional.descripcion && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />Acerca del profesional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{profesional.descripcion}</p>
                    </CardContent>
                  </Card>
                )}
                {(profesional.educacion || profesional.certificaciones || profesional.experiencia_anios) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="h-5 w-5" />Formación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profesional.experiencia_anios && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Experiencia</p>
                          <p className="text-sm text-foreground">{profesional.experiencia_anios} años</p>
                        </div>
                      )}
                      {profesional.educacion && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Educación</p>
                          <p className="text-sm text-foreground whitespace-pre-line">{profesional.educacion}</p>
                        </div>
                      )}
                      {profesional.certificaciones && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Certificaciones</p>
                          <p className="text-sm text-foreground whitespace-pre-line">{profesional.certificaciones}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                {profesional.idiomas && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Languages className="h-5 w-5" />Idiomas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{profesional.idiomas}</p>
                    </CardContent>
                  </Card>
                )}
                {profesional.direccion_consultorio && (
                  <Card className={!profesional.idiomas ? "lg:col-span-2" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5" />Ubicación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          {profesional.organizacion_nombre && (
                            <p className="font-medium text-foreground">{profesional.organizacion_nombre}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{profesional.direccion_consultorio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* ── Tab Opiniones ── */}
            <TabsContent value="opiniones">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opiniones</CardTitle>
                  <CardDescription>Solo pacientes que asistieron pueden dejar opiniones</CardDescription>
                </CardHeader>
                <CardContent>
                  {profesional.promedio_calif && profesional.promedio_calif > 0 ? (
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-bold text-foreground">
                        {Number(profesional.promedio_calif).toFixed(1)}
                      </span>
                      <div>
                        <StarRating rating={Math.round(profesional.promedio_calif)} size="md" />
                        <p className="mt-1 text-sm text-muted-foreground">{profesional.total_citas} citas realizadas</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                      Aún no hay opiniones para este profesional
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}