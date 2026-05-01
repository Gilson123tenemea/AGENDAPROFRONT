"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, User, Phone, Calendar, ChevronRight, Loader2 } from "lucide-react"
import { listarMisPacientes } from "@/app/servicios/profesionales"

type Paciente = {
  id: number
  nombre_completo: string
  telefono: string
  total_citas: number
  ultima_cita: string | null
}

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]

function formatFecha(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

function iniciales(nombre: string) {
  return nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}


export default function PatientsPage() {
  const [pacientes, setPacientes]   = useState<Paciente[]>([])
  const [cargando, setCargando]     = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [busquedaActiva, setBusquedaActiva] = useState("")

  // Carga con el término de búsqueda activo
  const cargar = useCallback(async (q: string) => {
    setCargando(true)
    try {
      const res = await listarMisPacientes(q)
      setPacientes(res?.data ?? res ?? [])
    } catch {
      setPacientes([])
    } finally {
      setCargando(false)
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    cargar("")
  }, [cargar])

  // Debounce: espera 400ms tras dejar de escribir para buscar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busquedaActiva !== searchQuery) {
        setBusquedaActiva(searchQuery)
        cargar(searchQuery)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, busquedaActiva, cargar])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
        <p className="text-muted-foreground">Listado de todos tus pacientes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">
              {cargando
                ? "Cargando..."
                : `${pacientes.length} Paciente${pacientes.length !== 1 ? "s" : ""}`}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:w-80"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Estado de carga */}
          {cargando ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pacientes.length > 0 ? (
            <div className="space-y-3">
              {pacientes.map((paciente) => (
                <Link
                  key={paciente.id}
                  href={`/panel/pacientes/${paciente.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar con iniciales */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {iniciales(paciente.nombre_completo)}
                    </div>

                    <div>
                      <p className="font-medium text-foreground">{paciente.nombre_completo}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {paciente.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {paciente.total_citas} {paciente.total_citas === 1 ? "cita" : "citas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Última visita — solo visible en pantallas medianas+ */}
                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-muted-foreground">Última visita</p>
                      <p className="text-sm font-medium text-foreground">
                        {paciente.ultima_cita ? formatFecha(paciente.ultima_cita) : "—"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Estado vacío */
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? "No se encontraron pacientes con ese criterio" : "No hay pacientes registrados"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}