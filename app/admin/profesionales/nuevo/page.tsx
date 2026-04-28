"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Settings, KeyRound, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { crearProfesional } from "@/app/servicios/profesionales"

type FormData = {
  nombre_completo: string
  telefono: string
  duracion_cita_min: string
  requiere_pago: boolean
  precio: string
  email_acceso: string
  password_acceso: string
  confirmar_password: string
}

type Errores = Partial<Record<keyof FormData, string>>

const VACIO: FormData = {
  nombre_completo: "",
  telefono: "",
  duracion_cita_min: "30",
  requiere_pago: false,
  precio: "",
  email_acceso: "",
  password_acceso: "",
  confirmar_password: "",
}

function validar(data: FormData): Errores {
  const e: Errores = {}

  if (!data.nombre_completo.trim())
    e.nombre_completo = "El nombre es obligatorio"
  else if (data.nombre_completo.trim().length < 3)
    e.nombre_completo = "Mínimo 3 caracteres"

  if (data.telefono && !/^[+\d\s\-()]{7,20}$/.test(data.telefono))
    e.telefono = "Teléfono inválido"

  if (!data.email_acceso.trim())
    e.email_acceso = "El correo es obligatorio"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email_acceso))
    e.email_acceso = "Correo inválido"

  if (!data.password_acceso)
    e.password_acceso = "La contraseña es obligatoria"
  else if (data.password_acceso.length < 8)
    e.password_acceso = "Mínimo 8 caracteres"
  else if (!/[A-Z]/.test(data.password_acceso))
    e.password_acceso = "Debe tener al menos una mayúscula"
  else if (!/[0-9]/.test(data.password_acceso))
    e.password_acceso = "Debe tener al menos un número"

  if (!data.confirmar_password)
    e.confirmar_password = "Confirma la contraseña"
  else if (data.password_acceso !== data.confirmar_password)
    e.confirmar_password = "Las contraseñas no coinciden"

  if (data.requiere_pago && !data.precio)
    e.precio = "Ingresa el precio de la consulta"
  else if (data.precio && isNaN(Number(data.precio)))
    e.precio = "El precio debe ser un número"
  else if (data.precio && Number(data.precio) <= 0)
    e.precio = "El precio debe ser mayor a 0"

  return e
}

const soloLetras = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
  ) e.preventDefault()
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

export default function NewProfessionalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errores, setErrores] = useState<Errores>({})
  const [notificacion, setNotificacion] = useState<{ tipo: "exito" | "error"; mensaje: string } | null>(null)
  const [formData, setFormData] = useState<FormData>(VACIO)

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData(prev => ({ ...prev, [key]: e.target.value }))

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validar(formData)
    if (Object.keys(e2).length > 0) {
      setErrores(e2)
      mostrarNotificacion("error", "Revisa los campos marcados en rojo")
      return
    }
    setErrores({})
    setIsLoading(true)

    const payload = {
      nombre_completo: formData.nombre_completo.trim(),
      telefono: formData.telefono || undefined,
      duracion_cita_min: Number(formData.duracion_cita_min),
      requiere_pago: formData.requiere_pago,
      precio: formData.requiere_pago && formData.precio ? Number(formData.precio) : undefined,
      email_acceso: formData.email_acceso.trim(),
      password_acceso: formData.password_acceso,
    }

    try {
      await crearProfesional(payload)
      mostrarNotificacion("exito", "¡Profesional creado exitosamente!")
      setTimeout(() => router.push("/admin/profesionales"), 1500)
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al crear el profesional")
    } finally {
      setIsLoading(false)
    }
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

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/profesionales">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Profesional</h1>
          <p className="text-muted-foreground">Agrega un nuevo profesional a tu organización</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="nombre_completo">Nombre completo *</Label>
                <Input
                  id="nombre_completo"
                  placeholder="Dr. Juan Pérez"
                  value={formData.nombre_completo}
                  onChange={set("nombre_completo")}
                  onKeyDown={soloLetras}
                  disabled={isLoading}
                  className={inputClass("nombre_completo")}
                />
                {errorMsg("nombre_completo")}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+593 99 123 4567"
                  value={formData.telefono}
                  onChange={set("telefono")}
                  onKeyDown={soloTelefono}
                  disabled={isLoading}
                  className={inputClass("telefono")}
                />
                {errorMsg("telefono")}
                <p className="text-xs text-muted-foreground">
                  Recibirá notificaciones de nuevas citas en este número
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Configuración de citas */}
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
                      onChange={set("precio")}
                      onKeyDown={soloNumeros}
                      disabled={isLoading}
                    />
                  </div>
                  {errorMsg("precio")}
                </div>
              )}

            </CardContent>
          </Card>

          {/* Credenciales de acceso */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5" />
                Credenciales de Acceso
              </CardTitle>
              <CardDescription>
                El profesional usará estas credenciales para ingresar a su panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email_acceso">Correo electrónico *</Label>
                  <Input
                    id="email_acceso"
                    type="email"
                    placeholder="profesional@clinica.com"
                    value={formData.email_acceso}
                    onChange={set("email_acceso")}
                    disabled={isLoading}
                    className={inputClass("email_acceso")}
                  />
                  {errorMsg("email_acceso")}
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="password_acceso">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password_acceso"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password_acceso}
                      onChange={set("password_acceso")}
                      disabled={isLoading}
                      className={inputClass("password_acceso")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar" : "Mostrar"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errorMsg("password_acceso")}
                  <p className="text-xs text-muted-foreground">
                    Debe tener mayúscula y número
                  </p>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmar_password">Confirmar contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmar_password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={formData.confirmar_password}
                      onChange={set("confirmar_password")}
                      disabled={isLoading}
                      className={inputClass("confirmar_password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errorMsg("confirmar_password")}
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/profesionales">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</>
            ) : (
              "Crear Profesional"
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}