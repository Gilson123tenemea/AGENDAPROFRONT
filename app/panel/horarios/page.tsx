"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Save, Loader2, Clock, Eye, AlertCircle, CheckCircle2, Utensils } from "lucide-react"
import {
  crearHorario,
  listarHorarios,
  cambiarEstadoHorario,
  eliminarHorario,
} from "@/app/servicios/horarios"
import { obtenerMiPerfil } from "@/app/servicios/profesionales"

// ── Tipos ────────────────────────────────────────────────────────────
type DayConfig = {
  isActive: boolean
  startTime: string
  endTime: string
  hasLunch: boolean
  lunchStart: string
  lunchEnd: string
  // IDs devueltos por el back para poder hacer PATCH/DELETE
  horarioId: number | null
  lunchHorarioId: number | null
}

type Notificacion = { tipo: "exito" | "error"; mensaje: string }

// ── Constantes ───────────────────────────────────────────────────────
const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const SHORT_DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

// dia_semana que espera el back (0 = lunes … 6 = domingo, ajusta según tu API)
// Si tu back usa 0=domingo, cambia este array:
const DIA_SEMANA_MAP = [6, 0, 1, 2, 3, 4, 5] // índice JS → valor back

const TIME_OPTIONS: string[] = []
for (let h = 6; h <= 22; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`)
  if (h < 22) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`)
}

const DEFAULT_DAY: DayConfig = {
  isActive: false,
  startTime: "09:00",
  endTime: "18:00",
  hasLunch: false,
  lunchStart: "12:00",
  lunchEnd: "13:00",
  horarioId: null,
  lunchHorarioId: null,
}

const INITIAL_SCHEDULE: Record<number, DayConfig> = Object.fromEntries(
  Array.from({ length: 7 }, (_, i) => [i, { ...DEFAULT_DAY }])
)

// ── Helpers ──────────────────────────────────────────────────────────
function calcTurnos(cfg: DayConfig): number {
  if (!cfg.isActive) return 0
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }
  let mins = toMin(cfg.endTime) - toMin(cfg.startTime)
  if (cfg.hasLunch) mins -= toMin(cfg.lunchEnd) - toMin(cfg.lunchStart)
  return Math.max(0, Math.floor(mins / 30))
}

// Convierte horarios del back al estado local
function backendToSchedule(horarios: any[]): Record<number, DayConfig> {
  const result: Record<number, DayConfig> = Object.fromEntries(
    Array.from({ length: 7 }, (_, i) => [i, { ...DEFAULT_DAY }])
  )

  for (const h of horarios) {
    // Encontrar el índice JS (0=Dom…6=Sáb) que corresponde al dia_semana del back
    const jsIndex = DIA_SEMANA_MAP.indexOf(h.dia_semana)
    if (jsIndex === -1) continue

    const cfg = result[jsIndex]

    // Distinguimos horario principal vs bloque de almuerzo por la duración
    // o por alguna propiedad que devuelva tu back. Aquí usamos: si ya hay
    // hora_inicio y es el turno más corto → almuerzo.
    if (!cfg.isActive) {
      // Primer horario del día → turno principal
      cfg.isActive = true
      cfg.startTime = h.hora_inicio.slice(0, 5)
      cfg.endTime = h.hora_fin.slice(0, 5)
      cfg.horarioId = h.id
    } else {
      // Segundo horario del mismo día → almuerzo
      cfg.hasLunch = true
      cfg.lunchStart = h.hora_inicio.slice(0, 5)
      cfg.lunchEnd = h.hora_fin.slice(0, 5)
      cfg.lunchHorarioId = h.id
    }
  }

  return result
}

// ── Componente ───────────────────────────────────────────────────────
export default function SchedulePage() {
  const [profesionalId, setProfesionalId] = useState<number | null>(null)
  const [schedule, setSchedule] = useState<Record<number, DayConfig>>(INITIAL_SCHEDULE)
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)

  // ── Carga inicial ─────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        // 1. Obtener id del profesional autenticado
        const perfilData = await obtenerMiPerfil()
        const prof = perfilData?.data ?? perfilData
        setProfesionalId(prof.id)

        // 2. Traer sus horarios
        const horariosData = await listarHorarios(prof.id)
        const horarios: any[] = horariosData?.data ?? horariosData ?? []

        if (Array.isArray(horarios) && horarios.length > 0) {
          setSchedule(backendToSchedule(horarios))
        }
      } catch {
        mostrarNotificacion("error", "Error al cargar los horarios")
      } finally {
        setIsFetching(false)
      }
    }
    cargar()
  }, [])

  const mostrarNotificacion = (tipo: "exito" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje })
    setTimeout(() => setNotificacion(null), 4000)
  }

  const updateDay = (dayIndex: number, updates: Partial<DayConfig>) => {
    setSchedule((prev) => ({ ...prev, [dayIndex]: { ...prev[dayIndex], ...updates } }))
  }

  // ── Guardar ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profesionalId) return
    setIsSaving(true)

    try {
      for (const [idxStr, cfg] of Object.entries(schedule)) {
        const jsIndex = Number(idxStr)
        const diaSemana = DIA_SEMANA_MAP[jsIndex]

        if (cfg.isActive) {
          // ── Turno principal ──
          if (!cfg.horarioId) {
            // Crear
            const res = await crearHorario(profesionalId, {
              dia_semana: diaSemana,
              hora_inicio: cfg.startTime,
              hora_fin: cfg.endTime,
            })
            const nuevo = res?.data ?? res
            updateDay(jsIndex, { horarioId: nuevo.id })
          } else {
            // Ya existe: si el back no tiene PUT usamos delete+create,
            // o simplemente cambiarEstadoHorario si solo queremos activar/desactivar.
            // Aquí re-creamos si cambió el horario (estrategia simple):
            await eliminarHorario(cfg.horarioId)
            const res = await crearHorario(profesionalId, {
              dia_semana: diaSemana,
              hora_inicio: cfg.startTime,
              hora_fin: cfg.endTime,
            })
            const nuevo = res?.data ?? res
            updateDay(jsIndex, { horarioId: nuevo.id })
          }

          // ── Almuerzo ──
          if (cfg.hasLunch) {
            if (!cfg.lunchHorarioId) {
              const res = await crearHorario(profesionalId, {
                dia_semana: diaSemana,
                hora_inicio: cfg.lunchStart,
                hora_fin: cfg.lunchEnd,
              })
              const nuevo = res?.data ?? res
              updateDay(jsIndex, { lunchHorarioId: nuevo.id })
            } else {
              await eliminarHorario(cfg.lunchHorarioId)
              const res = await crearHorario(profesionalId, {
                dia_semana: diaSemana,
                hora_inicio: cfg.lunchStart,
                hora_fin: cfg.lunchEnd,
              })
              const nuevo = res?.data ?? res
              updateDay(jsIndex, { lunchHorarioId: nuevo.id })
            }
          } else if (cfg.lunchHorarioId) {
            // Tenía almuerzo y lo quitaron
            await eliminarHorario(cfg.lunchHorarioId)
            updateDay(jsIndex, { lunchHorarioId: null })
          }
        } else {
          // Día desactivado → eliminar si existía
          if (cfg.horarioId) {
            await eliminarHorario(cfg.horarioId)
            updateDay(jsIndex, { horarioId: null, isActive: false })
          }
          if (cfg.lunchHorarioId) {
            await eliminarHorario(cfg.lunchHorarioId)
            updateDay(jsIndex, { lunchHorarioId: null })
          }
        }
      }

      mostrarNotificacion("exito", "¡Horarios guardados correctamente!")
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al guardar los horarios")
    } finally {
      setIsSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalTurnos = Object.values(schedule).reduce((acc, s) => acc + calcTurnos(s), 0)
  const diasActivos = Object.values(schedule).filter((s) => s.isActive).length

  return (
    <div className="space-y-6">

      {/* Toast */}
      {notificacion && (
        <div className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 border shadow-lg
          ${notificacion.tipo === "exito"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"}`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{notificacion.mensaje}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración de Horarios</h1>
          <p className="text-muted-foreground">Define tu disponibilidad semanal</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
            : <><Save className="mr-2 h-4 w-4" />Guardar Cambios</>}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Configuración ── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Horarios por Día
            </CardTitle>
            <CardDescription>
              Activa los días que atiendas, configura el horario y el bloque de almuerzo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DAY_NAMES.map((dayName, index) => {
              const cfg = schedule[index]
              return (
                <div key={index} className={`rounded-lg border p-4 space-y-3
                  ${cfg.isActive ? "border-primary/30 bg-primary/5" : "border-border"}`}>

                  {/* Fila principal */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Toggle + nombre */}
                    <div className="flex min-w-[150px] items-center gap-3">
                      <Switch
                        id={`day-${index}`}
                        checked={cfg.isActive}
                        onCheckedChange={(checked) =>
                          updateDay(index, { isActive: checked })
                        }
                      />
                      <Label
                        htmlFor={`day-${index}`}
                        className={`text-sm font-medium ${cfg.isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {dayName}
                      </Label>
                    </div>

                    {cfg.isActive ? (
                      <div className="flex flex-1 flex-wrap items-center gap-3">
                        {/* Hora inicio */}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">De</Label>
                          <Select
                            value={cfg.startTime}
                            onValueChange={(v) => updateDay(index, { startTime: v })}
                          >
                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Hora fin */}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">a</Label>
                          <Select
                            value={cfg.endTime}
                            onValueChange={(v) => updateDay(index, { endTime: v })}
                          >
                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <span className="text-sm text-muted-foreground">
                          ({calcTurnos(cfg)} turnos)
                        </span>

                        {/* Toggle almuerzo */}
                        <div className="flex items-center gap-2 ml-auto">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm text-muted-foreground">Almuerzo</Label>
                          <Switch
                            checked={cfg.hasLunch}
                            onCheckedChange={(c) => updateDay(index, { hasLunch: c })}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No disponible</span>
                    )}
                  </div>

                  {/* Fila almuerzo */}
                  {cfg.isActive && cfg.hasLunch && (
                    <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed border-amber-300 bg-amber-50 px-3 py-2">
                      <Utensils className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">Horario de almuerzo</span>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">De</Label>
                        <Select
                          value={cfg.lunchStart}
                          onValueChange={(v) => updateDay(index, { lunchStart: v })}
                        >
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">a</Label>
                        <Select
                          value={cfg.lunchEnd}
                          onValueChange={(v) => updateDay(index, { lunchEnd: v })}
                        >
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <span className="text-xs text-amber-600 ml-auto">
                        Este bloque no estará disponible para citas
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* ── Vista previa ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5" />
              Vista Previa
            </CardTitle>
            <CardDescription>Así verán tus pacientes tu disponibilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DAY_NAMES.map((_, index) => {
                const cfg = schedule[index]
                return (
                  <div key={index} className={`rounded-lg p-3 ${cfg.isActive ? "bg-primary/10" : "bg-muted/50"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${cfg.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {SHORT_DAY_NAMES[index]}
                      </span>
                      <span className={`text-sm ${cfg.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {cfg.isActive ? `${cfg.startTime} – ${cfg.endTime}` : "Cerrado"}
                      </span>
                    </div>
                    {cfg.isActive && cfg.hasLunch && (
                      <div className="mt-1 flex items-center justify-between text-xs text-amber-600">
                        <span className="flex items-center gap-1">
                          <Utensils className="h-3 w-3" />Almuerzo
                        </span>
                        <span>{cfg.lunchStart} – {cfg.lunchEnd}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 border-t border-border pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Días activos</span>
                <span className="font-medium">{diasActivos} días</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Turnos/semana</span>
                <span className="font-medium">{totalTurnos} turnos</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}