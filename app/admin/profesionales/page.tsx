"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search, UserPlus, MoreHorizontal, Edit, UserX,
  UserCheck, Calendar, Mail, Loader2, CheckCircle2, AlertCircle
} from "lucide-react"
import { listarProfesionales, eliminarProfesional, actualizarProfesional } from "@/app/servicios/profesionales"

type Profesional = {
  id: number
  nombre_completo: string
  telefono: string | null
  foto_url: string | null
  titulo_profesional: string | null
  token_publico: string
  duracion_cita_min: number
  requiere_pago: boolean
  precio: number | null
  promedio_calif: number
  total_citas: number
  esta_activo: boolean
  perfil_completo: boolean
  organizacion_id: number
  creado_en: string
}

type Notificacion = { tipo: "exito" | "error"; mensaje: string }

export default function ProfessionalsPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)
  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string; activo: boolean } | null>(null)
  const [accionando, setAccionando] = useState<number | null>(null)

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {
    setIsFetching(true)
    try {
      const data = await listarProfesionales()
      setProfesionales(Array.isArray(data) ? data : data?.data ?? [])
    } catch {
      mostrarNotificacion("error", "Error al cargar los profesionales")
    } finally {
      setIsFetching(false)
    }
  }

  const mostrarNotificacion = (tipo: "exito" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje })
    setTimeout(() => setNotificacion(null), 4000)
  }

  const handleCambiarEstado = async () => {
    if (!confirmacion) return
    setAccionando(confirmacion.id)
    setConfirmacion(null)

    try {
      // Borrado lógico = desactivar; reactivar = actualizar esta_activo
      if (confirmacion.activo) {
        await eliminarProfesional(confirmacion.id)
      } else {
        await actualizarProfesional(confirmacion.id, { esta_activo: true })
      }
      mostrarNotificacion(
        "exito",
        confirmacion.activo
          ? `${confirmacion.nombre} ha sido desactivado`
          : `${confirmacion.nombre} ha sido activado`
      )
      await cargar()
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al cambiar el estado")
    } finally {
      setAccionando(null)
    }
  }

  const filtrados = profesionales.filter((p) => {
    const q = searchQuery.toLowerCase()
    return (
      p.nombre_completo.toLowerCase().includes(q) ||
      (p.titulo_profesional ?? "").toLowerCase().includes(q)
    )
  })

  const iniciales = (nombre: string) =>
    nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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

      {/* Modal confirmación */}
      {confirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full
                ${confirmacion.activo ? "bg-red-100" : "bg-green-100"}`}>
                {confirmacion.activo
                  ? <UserX className="h-5 w-5 text-red-600" />
                  : <UserCheck className="h-5 w-5 text-green-600" />}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {confirmacion.activo ? "¿Desactivar profesional?" : "¿Activar profesional?"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {confirmacion.activo
                    ? `${confirmacion.nombre} no podrá recibir citas mientras esté inactivo.`
                    : `${confirmacion.nombre} podrá volver a recibir citas.`}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmacion(null)}>
                Cancelar
              </Button>
              <Button
                className={`flex-1 ${confirmacion.activo ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={handleCambiarEstado}
              >
                {confirmacion.activo ? "Sí, desactivar" : "Sí, activar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profesionales</h1>
          <p className="text-muted-foreground">Gestiona los profesionales de tu organización</p>
        </div>
        <Button asChild>
          <Link href="/admin/profesionales/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Profesional
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">{filtrados.length} Profesionales</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <UserPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No hay profesionales aún</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Agrega el primer profesional a tu organización
              </p>
              <Button asChild size="sm">
                <Link href="/admin/profesionales/nuevo">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar Profesional
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtrados.map((prof) => (
                <div
                  key={prof.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    {prof.foto_url ? (
                      <img
                        src={prof.foto_url}
                        alt={prof.nombre_completo}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shrink-0">
                        {iniciales(prof.nombre_completo)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{prof.nombre_completo}</p>
                        <Badge
                          className={prof.esta_activo
                            ? "bg-green-100 text-green-700 border-0"
                            : "bg-gray-100 text-gray-500 border-0"}
                        >
                          {prof.esta_activo ? "Activo" : "Inactivo"}
                        </Badge>
                        {!prof.perfil_completo && (
                          <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Perfil incompleto
                          </Badge>
                        )}
                      </div>

                      {prof.titulo_profesional && (
                        <p className="text-sm text-muted-foreground">{prof.titulo_profesional}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {prof.total_citas} citas totales
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {prof.duracion_cita_min} min por cita
                        </span>
                        {prof.requiere_pago && prof.precio && (
                          <span className="text-green-700 font-medium">
                            ${prof.precio} USD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/profesionales/${prof.id}/editar`}>
                        <Edit className="mr-1 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={accionando === prof.id}>
                          {accionando === prof.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/profesionales/${prof.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {prof.esta_activo ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setConfirmacion({
                              id: prof.id,
                              nombre: prof.nombre_completo,
                              activo: true,
                            })}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600 focus:text-green-600"
                            onClick={() => setConfirmacion({
                              id: prof.id,
                              nombre: prof.nombre_completo,
                              activo: false,
                            })}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}