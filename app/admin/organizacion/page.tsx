"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2, Save, Loader2, CreditCard, Check,
  Upload, CheckCircle2, Pencil, X, AlertCircle
} from "lucide-react"
import { completarPerfilOrganizacion, obtenerMiOrganizacion, actualizarOrganizacion } from "@/app/servicios/organizaciones"
import { useAuthGuard } from "@/hooks/useAuthGuard"

const planFeatures = [
  "Hasta 5 profesionales",
  "Agenda ilimitada",
  "Links públicos personalizados",
  "Recordatorios WhatsApp",
  "Panel de administración",
  "Reportes básicos",
  "Soporte prioritario",
]

type Notificacion = { tipo: "exito" | "error"; mensaje: string }
type FormData = {
  nombre: string; email: string; telefono: string
  descripcion: string; direccion: string; ciudad: string
  sitio_web: string; redes_sociales: string; logo_url: string
}
type Errores = Partial<Record<keyof FormData, string>>

const VACIO: FormData = {
  nombre: "", email: "", telefono: "", descripcion: "",
  direccion: "", ciudad: "", sitio_web: "", redes_sociales: "", logo_url: "",
}

function validar(data: FormData): Errores {
  const e: Errores = {}
  if (!data.nombre.trim()) e.nombre = "El nombre es obligatorio"
  else if (data.nombre.trim().length < 3) e.nombre = "Mínimo 3 caracteres"
  if (!data.email.trim()) e.email = "El correo es obligatorio"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Correo inválido"
  if (data.telefono && !/^[+\d\s\-()]{7,20}$/.test(data.telefono))
    e.telefono = "Teléfono inválido"
  if (data.sitio_web && !/^https?:\/\/.+\..+/.test(data.sitio_web))
    e.sitio_web = "Debe empezar con https://"
  if (data.descripcion && data.descripcion.length > 500)
    e.descripcion = "Máximo 500 caracteres"
  if (data.ciudad && data.ciudad.trim().length < 2) e.ciudad = "Ciudad inválida"
  return e
}

// Solo letras, espacios y acentos
const soloLetras = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]$/.test(e.key) &&
    !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
    e.preventDefault()
  }
}

// Solo dígitos, +, espacios y guiones (para teléfono)
const soloTelefono = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[\d+\s\-()]$/.test(e.key) &&
    !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
    e.preventDefault()
  }
}

export default function OrganizationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [errores, setErrores] = useState<Errores>({})
  const [formData, setFormData] = useState<FormData>(VACIO)
  const [snapshot, setSnapshot] = useState<FormData>(VACIO)
  const [suscripcion, setSuscripcion] = useState({
    planName: "Plan Pro", planPrice: 59, nextBillingDate: "",
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const resultado = await obtenerMiOrganizacion()
        if (resultado?.ok !== false) {
          const org = resultado?.data ?? resultado
          const datos: FormData = {
            nombre: org.nombre ?? "",
            email: org.email ?? "",
            telefono: org.telefono ?? "",
            descripcion: org.descripcion ?? "",
            direccion: org.direccion ?? "",
            ciudad: org.ciudad ?? "",
            sitio_web: org.sitio_web ?? "",
            redes_sociales: org.redes_sociales ?? "",
            logo_url: org.logo_url ?? "",
          }
          setFormData(datos)
          setSnapshot(datos)
          if (org.logo_url) setLogoPreview(org.logo_url)
          if (org.suscripcion) {
            setSuscripcion({
              planName: org.suscripcion.plan ?? "Plan Pro",
              planPrice: org.suscripcion.precio ?? 59,
              nextBillingDate: org.suscripcion.proximo_cobro ?? "",
            })
          }
        }
      } catch { /* silencioso */ }
      finally { setIsFetching(false) }
    }
    cargar()
  }, [])

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData(prev => ({ ...prev, [key]: e.target.value }))

  const mostrarNotificacion = (tipo: "exito" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje })
    setTimeout(() => setNotificacion(null), 4000)
  }

  const handleEditar = () => { setSnapshot(formData); setEditando(true); setErrores({}) }

  const handleCancelar = () => {
    setFormData(snapshot)
    setLogoPreview(snapshot.logo_url || null)
    setEditando(false)
    setErrores({})
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      mostrarNotificacion("error", "La imagen no puede superar los 2MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setLogoPreview(base64)
      setFormData(prev => ({ ...prev, logo_url: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleGuardarClick = () => {
    const e = validar(formData)
    if (Object.keys(e).length > 0) { setErrores(e); return }
    setErrores({})
    setConfirmar(true)
  }

  const handleConfirmar = async () => {
  setConfirmar(false)
  setIsLoading(true)

  // 1️⃣ Datos básicos → PUT /yo
  const datosBasicos = {
    nombre: formData.nombre,
    email: formData.email,
    telefono: formData.telefono,
  }

  // 2️⃣ Datos de perfil → PUT /yo/perfil
  const datosPerfil = {
    descripcion: formData.descripcion,
    direccion: formData.direccion,
    ciudad: formData.ciudad,
    sitio_web: formData.sitio_web,
    redes_sociales: formData.redes_sociales,
    logo_url: formData.logo_url || undefined,
  }

  const [r1, r2] = await Promise.all([
    actualizarOrganizacion(datosBasicos),
    completarPerfilOrganizacion(datosPerfil),
  ])

  if ((!r1?.ok && r1?.ok !== undefined) || (!r2?.ok && r2?.ok !== undefined)) {
    const msg = r1?.message || r2?.message || "Error al guardar los cambios"
    mostrarNotificacion("error", msg)
  } else {
    setSnapshot(formData)
    setEditando(false)
    mostrarNotificacion("exito", "¡Perfil actualizado exitosamente!")
  }

  setIsLoading(false)
}

  const errorMsg = (key: keyof FormData) => errores[key] ? (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="h-3 w-3" />{errores[key]}
    </p>
  ) : null

  const inputClass = (key: keyof FormData) =>
    errores[key] ? "border-red-400 focus-visible:ring-red-400" : ""

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—"
    const d = new Date(dateStr + "T12:00:00")
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
      "Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
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
                <p className="text-sm text-muted-foreground">Esta acción actualizará el perfil de tu organización.</p>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Organización</h1>
          <p className="text-muted-foreground">Configura los datos de tu organización</p>
        </div>
        <div className="flex gap-2">
          {!editando ? (
            <Button onClick={handleEditar}>
              <Pencil className="mr-2 h-4 w-4" />Editar datos
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancelar} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />Cancelar
              </Button>
              <Button onClick={handleGuardarClick} disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
                  : <><Save className="mr-2 h-4 w-4" />Guardar cambios</>}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Información de la Organización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Logo + nombre + email + teléfono */}
            <div className="flex flex-col gap-6 sm:flex-row">

              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden">
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    : <Building2 className="h-10 w-10 text-muted-foreground" />}
                </div>
                {editando && (
                  <>
                    <label htmlFor="logo-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />Subir Logo
                        </span>
                      </Button>
                    </label>
                    <input id="logo-upload" type="file" accept="image/*"
                      className="hidden" onChange={handleLogoChange} />
                    <p className="text-xs text-muted-foreground">Máx. 2MB</p>
                  </>
                )}
              </div>

              {/* Nombre + email + teléfono */}
              <div className="flex-1 space-y-4">

                {/* Nombre */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre de la organización</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    disabled={!editando}
                    onChange={set("nombre")}
                    onKeyDown={soloLetras}
                    placeholder="Clínica Dental Sonrisas"
                    className={inputClass("nombre")}
                  />
                  {errorMsg("nombre")}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Correo de contacto</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled={!editando}
                      onChange={set("email")}
                      placeholder="contacto@clinica.com"
                      className={inputClass("email")}
                    />
                    {errorMsg("email")}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={formData.telefono}
                      disabled={!editando}
                      onChange={set("telefono")}
                      onKeyDown={soloTelefono}
                      placeholder="+593 99 123 4567"
                      className={inputClass("telefono")}
                    />
                    {errorMsg("telefono")}
                  </div>

                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu clínica o consultorio..."
                value={formData.descripcion}
                disabled={!editando}
                rows={3}
                onChange={set("descripcion")}
                className={errores.descripcion ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              <div className="flex items-center justify-between">
                {errorMsg("descripcion") ?? <span />}
                <span className="text-xs text-muted-foreground">{formData.descripcion.length}/500</span>
              </div>
            </div>

            {/* Dirección + ciudad */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  disabled={!editando}
                  onChange={set("direccion")}
                  placeholder="Av. Principal 123"
                  className={inputClass("direccion")}
                />
                {errorMsg("direccion")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  disabled={!editando}
                  onChange={set("ciudad")}
                  onKeyDown={soloLetras}
                  placeholder="Cuenca"
                  className={inputClass("ciudad")}
                />
                {errorMsg("ciudad")}
              </div>
            </div>

            {/* Sitio web + redes */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="sitio_web">Sitio web</Label>
                <Input
                  id="sitio_web"
                  type="url"
                  value={formData.sitio_web}
                  disabled={!editando}
                  onChange={set("sitio_web")}
                  placeholder="https://miclinica.com"
                  className={inputClass("sitio_web")}
                />
                {errorMsg("sitio_web")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="redes_sociales">Redes sociales</Label>
                <Input
                  id="redes_sociales"
                  value={formData.redes_sociales}
                  disabled={!editando}
                  onChange={set("redes_sociales")}
                  placeholder="@miclinica"
                  className={inputClass("redes_sociales")}
                />
                {errorMsg("redes_sociales")}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Suscripción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{suscripcion.planName}</span>
                <Badge className="bg-green-100 text-green-700 border-0">Activo</Badge>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${suscripcion.planPrice}
                <span className="text-sm font-normal text-muted-foreground">/mes</span>
              </p>
            </div>
            <ul className="space-y-2">
              {planFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-green-600" />{f}
                </li>
              ))}
            </ul>
            {suscripcion.nextBillingDate && (
              <div className="border-t border-border pt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Próximo cobro</span>
                <span className="font-medium text-foreground">{formatDate(suscripcion.nextBillingDate)}</span>
              </div>
            )}
            <Button variant="outline" className="w-full">Cambiar Plan</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}