"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft, User, Settings, Loader2,
  CheckCircle2, AlertCircle, Save
} from "lucide-react"
import { obtenerProfesional, actualizarProfesional } from "@/app/servicios/profesionales"

type FormData = {
  telefono: string
  duracion_cita_min: string
  requiere_pago: boolean
  precio: string
}

type Errores = Partial<Record<keyof FormData, string>>

function validar(data: FormData): Errores {
  const e: Errores = {}

  if (data.telefono && !/^[+\d\s\-()]{7,20}$/.test(data.telefono))
    e.telefono = "Teléfono inválido"

  if (data.requiere_pago && !data.precio)
    e.precio = "Ingresa el precio de la consulta"
  else if (data.precio && isNaN(Number(data.precio)))
    e.precio = "El precio debe ser un número"
  else if (data.precio && Number(data.precio) <= 0)
    e.precio = "El precio debe ser mayor a 0"

  return e
}

const soloTelefono = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^[\d+\s\-()]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
  ) e.preventDefault()
}

const soloNumeros = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^[\d.]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
  ) e.preventDefault()
}

export default function EditProfessionalPage() {
  const router = useRouter()
  const params = useParams()
  const profesionalId = Number(params.id)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [confirmar, setConfirmar] = useState(false)
  const [errores, setErrores] = useState<Errores>({})
  const [notificacion, setNotificacion] = useState<{ tipo: "exito" | "error"; mensaje: string } | null>(null)
  const [nombreCompleto, setNombreCompleto] = useState("")

  const [formData, setFormData] = useState<FormData>({
    telefono: "",
    duracion_cita_min: "30",
    requiere_pago: false,
    precio: "",
  })
  const [snapshot, setSnapshot] = useState<FormData>(formData)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerProfesional(profesionalId)
        const prof = data?.data ?? data
        const cargado: FormData = {
          telefono: prof.telefono ?? "",
          duracion_cita_min: String(prof.duracion_cita_min ?? 30),
          requiere_pago: prof.requiere_pago ?? false,
          precio: prof.precio ? String(prof.precio) : "",
        }
        setNombreCompleto(prof.nombre_completo ?? "")
        setFormData(cargado)
        setSnapshot(cargado)
      } catch {
        mostrarNotificacion("error", "Error al cargar los datos del profesional")
      } finally {
        setIsFetching(false)
      }
    }
    cargar()
  }, [profesionalId])

  const mostrarNotificacion = (tipo: "exito" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje })
    setTimeout(() => setNotificacion(null), 4000)
  }

  const errorMsg = (key: keyof FormData) =>
    errores[key] ? (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <AlertCircle className="h-3 w-3" />{errores[key]}
      </p>
    ) : null

  const inputClass = (key: keyof FormData) =>
    errores[key] ? "border-red-400 focus-visible:ring-red-400" : ""

  const handleGuardarClick = () => {
    const e = validar(formData)
    if (Object.keys(e).length > 0) {
      setErrores(e)
      mostrarNotificacion("error", "Revisa los campos marcados en rojo")
      return
    }
    setErrores({})
    setConfirmar(true)
  }

  const handleConfirmar = async () => {
    setConfirmar(false)
    setIsLoading(true)

    const payload = {
      telefono: formData.telefono || undefined,
      duracion_cita_min: Number(formData.duracion_cita_min),
      requiere_pago: formData.requiere_pago,
      precio: formData.requiere_pago && formData.precio ? Number(formData.precio) : undefined,
    }

    try {
      await actualizarProfesional(profesionalId, payload)
      setSnapshot(formData)
      mostrarNotificacion("exito", "¡Datos actualizados exitosamente!")
      setTimeout(() => router.push("/admin/profesionales"), 1500)
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al actualizar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = () => {
    setFormData(snapshot)
    setErrores({})
    router.push("/admin/profesionales")
  }

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
      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">¿Guardar cambios?</p>
                <p className="text-sm text-muted-foreground">
                  Se actualizarán los datos de {nombreCompleto}.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmar(false)}>
                No, cancelar
              </Button>
              <Button className="flex-1" onClick={handleConfirmar}>
                Sí, guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/profesionales">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editar Profesional</h1>
          <p className="text-muted-foreground">Modifica los datos de {nombreCompleto}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Info personal — solo lectura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Nombre — no editable */}
            <div className="space-y-1.5">
              <Label htmlFor="nombre_completo">Nombre completo</Label>
              <Input
                id="nombre_completo"
                value={nombreCompleto}
                disabled
                className="bg-muted/40 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">El nombre no puede modificarse</p>
            </div>

            {/* Teléfono — editable */}
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+593 99 123 4567"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                onKeyDown={soloTelefono}
                disabled={isLoading}
                className={inputClass("telefono")}
              />
              {errorMsg("telefono")}
            </div>

          </CardContent>
        </Card>

        {/* Configuración de citas — editable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Configuración de Citas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-1.5">
              <Label htmlFor="duracion">Duración de la cita</Label>
              <Select
                value={formData.duracion_cita_min}
                onValueChange={(v) => setFormData(prev => ({ ...prev, duracion_cita_min: v }))}
                disabled={isLoading}
              >
                <SelectTrigger id="duracion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="requiere_pago">Requiere pago previo</Label>
                <p className="text-sm text-muted-foreground">
                  Los pacientes verán el precio antes de reservar
                </p>
              </div>
              <Switch
                id="requiere_pago"
                checked={formData.requiere_pago}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, requiere_pago: checked, precio: checked ? prev.precio : "" }))
                }
                disabled={isLoading}
              />
            </div>

            {formData.requiere_pago && (
              <div className="space-y-1.5">
                <Label htmlFor="precio">Precio de la consulta (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="precio"
                    type="text"
                    inputMode="decimal"
                    className={`pl-7 ${inputClass("precio")}`}
                    placeholder="50.00"
                    value={formData.precio}
                    onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                    onKeyDown={soloNumeros}
                    disabled={isLoading}
                  />
                </div>
                {errorMsg("precio")}
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleCancelar} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleGuardarClick} disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Guardar Cambios</>
          )}
        </Button>
      </div>

    </div>
  )
}