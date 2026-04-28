"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Save, Loader2, User, Link2, Copy, Check, GraduationCap,
  QrCode, ExternalLink, Pencil, X, AlertCircle, CheckCircle2, BadgeCheck
} from "lucide-react"
import { actualizarProfesional, obtenerMiPerfil, completarMiPerfil } from "@/app/servicios/profesionales"

// ── Tipos ────────────────────────────────────────────────────────────
type FormBasico = {
  telefono: string
  duracion_cita_min: string
  requiere_pago: boolean
  precio: string
}

type FormPerfil = {
  titulo_profesional: string
  descripcion: string
  experiencia_anios: string
  educacion: string
  certificaciones: string
  idiomas: string
  atiende_en: string
  direccion_consultorio: string
}

type Profesional = {
  id: number
  nombre_completo: string
  telefono: string | null
  titulo_profesional: string | null
  descripcion: string | null
  experiencia_anios: number | null
  educacion: string | null
  certificaciones: string | null
  idiomas: string | null
  atiende_en: string | null
  direccion_consultorio: string | null
  token_publico: string
  duracion_cita_min: number
  requiere_pago: boolean
  precio: number | null
  promedio_calif: number
  total_citas: number
  esta_activo: boolean
  perfil_completo: boolean
  organizacion_id: number
}

type Notificacion = { tipo: "exito" | "error"; mensaje: string }
type Errores = Partial<Record<string, string>>

// ── Helpers de teclado ───────────────────────────────────────────────
const soloTelefono = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[\d+\s\-()]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
    e.preventDefault()
}
const soloNumeros = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[\d.]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
    e.preventDefault()
}
const soloAnios = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^\d$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
    e.preventDefault()
}

function validarBasico(data: FormBasico): Errores {
  const e: Errores = {}
  if (data.telefono && !/^[+\d\s\-()]{7,20}$/.test(data.telefono))
    e.telefono = "Teléfono inválido"
  if (data.requiere_pago && !data.precio)
    e.precio = "Ingresa el precio"
  else if (data.precio && Number(data.precio) <= 0)
    e.precio = "Debe ser mayor a 0"
  return e
}

function validarPerfil(data: FormPerfil): Errores {
  const e: Errores = {}
  if (data.descripcion && data.descripcion.length > 500)
    e.descripcion = "Máximo 500 caracteres"
  if (data.experiencia_anios && (isNaN(Number(data.experiencia_anios)) || Number(data.experiencia_anios) < 0))
    e.experiencia_anios = "Valor inválido"
  return e
}

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://agendapro.com"

const BASICO_VACIO: FormBasico = { telefono: "", duracion_cita_min: "30", requiere_pago: false, precio: "" }
const PERFIL_VACIO: FormPerfil = {
  titulo_profesional: "", descripcion: "", experiencia_anios: "",
  educacion: "", certificaciones: "", idiomas: "", atiende_en: "", direccion_consultorio: "",
}

export default function ProfilePage() {
  const [profesional, setProfesional] = useState<Profesional | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)

  // Sección básico
  const [editandoBasico, setEditandoBasico] = useState(false)
  const [confirmarBasico, setConfirmarBasico] = useState(false)
  const [savingBasico, setSavingBasico] = useState(false)
  const [erroresBasico, setErroresBasico] = useState<Errores>({})
  const [formBasico, setFormBasico] = useState<FormBasico>(BASICO_VACIO)
  const [snapshotBasico, setSnapshotBasico] = useState<FormBasico>(BASICO_VACIO)

  // Sección perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [confirmarPerfil, setConfirmarPerfil] = useState(false)
  const [savingPerfil, setSavingPerfil] = useState(false)
  const [erroresPerfil, setErroresPerfil] = useState<Errores>({})
  const [formPerfil, setFormPerfil] = useState<FormPerfil>(PERFIL_VACIO)
  const [snapshotPerfil, setSnapshotPerfil] = useState<FormPerfil>(PERFIL_VACIO)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerMiPerfil()
        const prof: Profesional = data?.data ?? data
        setProfesional(prof)

        const b: FormBasico = {
          telefono: prof.telefono ?? "",
          duracion_cita_min: String(prof.duracion_cita_min ?? 30),
          requiere_pago: prof.requiere_pago ?? false,
          precio: prof.precio ? String(prof.precio) : "",
        }
        setFormBasico(b); setSnapshotBasico(b)

        const p: FormPerfil = {
          titulo_profesional: prof.titulo_profesional ?? "",
          descripcion: prof.descripcion ?? "",
          experiencia_anios: prof.experiencia_anios ? String(prof.experiencia_anios) : "",
          educacion: prof.educacion ?? "",
          certificaciones: prof.certificaciones ?? "",
          idiomas: prof.idiomas ?? "",
          atiende_en: prof.atiende_en ?? "",
          direccion_consultorio: prof.direccion_consultorio ?? "",
        }
        setFormPerfil(p); setSnapshotPerfil(p)
      } catch {
        mostrarNotificacion("error", "Error al cargar tu perfil")
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

  const publicUrl = profesional ? `${BASE_URL}/p/${profesional.token_publico}` : ""

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Básico ───────────────────────────────────────────────────────
  const handleGuardarBasicoClick = () => {
    const e = validarBasico(formBasico)
    if (Object.keys(e).length > 0) { setErroresBasico(e); mostrarNotificacion("error", "Revisa los campos"); return }
    setErroresBasico({}); setConfirmarBasico(true)
  }

  const handleConfirmarBasico = async () => {
    if (!profesional) return
    setConfirmarBasico(false); setSavingBasico(true)
    try {
      const actualizado = await actualizarProfesional(profesional.id, {
        telefono: formBasico.telefono || undefined,
        duracion_cita_min: Number(formBasico.duracion_cita_min),
        requiere_pago: formBasico.requiere_pago,
        precio: formBasico.requiere_pago && formBasico.precio ? Number(formBasico.precio) : undefined,
      })
      setProfesional(actualizado?.data ?? actualizado)
      setSnapshotBasico(formBasico); setEditandoBasico(false)
      mostrarNotificacion("exito", "¡Datos básicos actualizados!")
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al guardar")
    } finally { setSavingBasico(false) }
  }

  // ── Perfil ───────────────────────────────────────────────────────
  const handleGuardarPerfilClick = () => {
    const e = validarPerfil(formPerfil)
    if (Object.keys(e).length > 0) { setErroresPerfil(e); mostrarNotificacion("error", "Revisa los campos"); return }
    setErroresPerfil({}); setConfirmarPerfil(true)
  }

  const handleConfirmarPerfil = async () => {
    setConfirmarPerfil(false); setSavingPerfil(true)
    try {
      const payload = {
        titulo_profesional: formPerfil.titulo_profesional || undefined,
        descripcion: formPerfil.descripcion || undefined,
        experiencia_anios: formPerfil.experiencia_anios ? Number(formPerfil.experiencia_anios) : undefined,
        educacion: formPerfil.educacion || undefined,
        certificaciones: formPerfil.certificaciones || undefined,
        idiomas: formPerfil.idiomas || undefined,
        atiende_en: formPerfil.atiende_en || undefined,
        direccion_consultorio: formPerfil.direccion_consultorio || undefined,
      }
      const actualizado = await completarMiPerfil(payload)
      setProfesional(actualizado?.data ?? actualizado)
      setSnapshotPerfil(formPerfil); setEditandoPerfil(false)
      mostrarNotificacion("exito", "¡Perfil profesional completado!")
    } catch (err: any) {
      mostrarNotificacion("error", err.message || "Error al guardar")
    } finally { setSavingPerfil(false) }
  }

  const errorMsg = (key: string, errores: Errores) =>
    errores[key] ? (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <AlertCircle className="h-3 w-3" />{errores[key]}
      </p>
    ) : null

  const cls = (key: string, errores: Errores) =>
    errores[key] ? "border-red-400 focus-visible:ring-red-400" : ""

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
          ${notificacion.tipo === "exito" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{notificacion.mensaje}</span>
        </div>
      )}

      {/* Modal básico */}
      {confirmarBasico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">¿Guardar cambios?</p>
                <p className="text-sm text-muted-foreground">Se actualizarán tus datos básicos.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmarBasico(false)}>No, cancelar</Button>
              <Button className="flex-1" onClick={handleConfirmarBasico}>Sí, guardar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal perfil */}
      {confirmarPerfil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">¿Guardar perfil profesional?</p>
                <p className="text-sm text-muted-foreground">Esta información será visible para tus pacientes.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmarPerfil(false)}>No, cancelar</Button>
              <Button className="flex-1" onClick={handleConfirmarPerfil}>Sí, guardar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Configura tu información profesional</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">

          {/* ── Card: Datos básicos ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <div className="flex gap-2">
                  {!editandoBasico ? (
                    <Button size="sm" onClick={() => { setSnapshotBasico(formBasico); setEditandoBasico(true); setErroresBasico({}) }}>
                      <Pencil className="mr-2 h-4 w-4" />Editar
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setFormBasico(snapshotBasico); setEditandoBasico(false); setErroresBasico({}) }} disabled={savingBasico}>
                        <X className="mr-2 h-4 w-4" />Cancelar
                      </Button>
                      <Button size="sm" onClick={handleGuardarBasicoClick} disabled={savingBasico}>
                        {savingBasico ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <><Save className="mr-2 h-4 w-4" />Guardar</>}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-1.5">
                <Label>Nombre completo</Label>
                <Input value={profesional?.nombre_completo ?? ""} disabled className="bg-muted/40 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">El nombre no puede modificarse</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
                <Input
                  id="telefono" type="tel" placeholder="+593 99 123 4567"
                  value={formBasico.telefono} disabled={!editandoBasico}
                  onChange={(e) => setFormBasico(p => ({ ...p, telefono: e.target.value }))}
                  onKeyDown={soloTelefono} className={cls("telefono", erroresBasico)}
                />
                {errorMsg("telefono", erroresBasico)}
                <p className="text-xs text-muted-foreground">Recibirás notificaciones en este número</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duracion">Duración de la cita</Label>
                <Select value={formBasico.duracion_cita_min}
                  onValueChange={(v) => setFormBasico(p => ({ ...p, duracion_cita_min: v }))}
                  disabled={!editandoBasico}>
                  <SelectTrigger id="duracion"><SelectValue /></SelectTrigger>
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
                  <p className="text-sm text-muted-foreground">Los pacientes verán el precio antes de reservar</p>
                </div>
                <Switch id="requiere_pago" checked={formBasico.requiere_pago}
                  onCheckedChange={(c) => setFormBasico(p => ({ ...p, requiere_pago: c, precio: c ? p.precio : "" }))}
                  disabled={!editandoBasico} />
              </div>

              {formBasico.requiere_pago && (
                <div className="space-y-1.5">
                  <Label htmlFor="precio">Precio de la consulta (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input id="precio" type="text" inputMode="decimal" className={`pl-7 ${cls("precio", erroresBasico)}`}
                      placeholder="50.00" value={formBasico.precio} disabled={!editandoBasico}
                      onChange={(e) => setFormBasico(p => ({ ...p, precio: e.target.value }))}
                      onKeyDown={soloNumeros} />
                  </div>
                  {errorMsg("precio", erroresBasico)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Card: Perfil profesional ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5" />
                    Perfil Profesional
                    {profesional?.perfil_completo && (
                      <span className="flex items-center gap-1 text-xs font-normal text-green-600">
                        <BadgeCheck className="h-4 w-4" />Completo
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Esta información es visible para tus pacientes</p>
                </div>
                <div className="flex gap-2">
                  {!editandoPerfil ? (
                    <Button size="sm" onClick={() => { setSnapshotPerfil(formPerfil); setEditandoPerfil(true); setErroresPerfil({}) }}>
                      <Pencil className="mr-2 h-4 w-4" />{profesional?.perfil_completo ? "Editar" : "Completar"}
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setFormPerfil(snapshotPerfil); setEditandoPerfil(false); setErroresPerfil({}) }} disabled={savingPerfil}>
                        <X className="mr-2 h-4 w-4" />Cancelar
                      </Button>
                      <Button size="sm" onClick={handleGuardarPerfilClick} disabled={savingPerfil}>
                        {savingPerfil ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <><Save className="mr-2 h-4 w-4" />Guardar</>}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="titulo">Título profesional</Label>
                  <Input id="titulo" placeholder="Médico General, Dentista..."
                    value={formPerfil.titulo_profesional} disabled={!editandoPerfil}
                    onChange={(e) => setFormPerfil(p => ({ ...p, titulo_profesional: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="experiencia">Años de experiencia</Label>
                  <Input id="experiencia" type="text" inputMode="numeric" placeholder="5"
                    value={formPerfil.experiencia_anios} disabled={!editandoPerfil}
                    onChange={(e) => setFormPerfil(p => ({ ...p, experiencia_anios: e.target.value }))}
                    onKeyDown={soloAnios} className={cls("experiencia_anios", erroresPerfil)} />
                  {errorMsg("experiencia_anios", erroresPerfil)}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descripcion">Descripción / Bio</Label>
                <Textarea id="descripcion" placeholder="Cuéntale a tus pacientes sobre ti..."
                  rows={3} value={formPerfil.descripcion} disabled={!editandoPerfil}
                  onChange={(e) => setFormPerfil(p => ({ ...p, descripcion: e.target.value }))}
                  className={erroresPerfil.descripcion ? "border-red-400" : ""} />
                <div className="flex justify-between">
                  {errorMsg("descripcion", erroresPerfil) ?? <span />}
                  <span className="text-xs text-muted-foreground">{formPerfil.descripcion.length}/500</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="educacion">Educación</Label>
                <Textarea id="educacion" placeholder="Universidad, título, año de graduación..."
                  rows={2} value={formPerfil.educacion} disabled={!editandoPerfil}
                  onChange={(e) => setFormPerfil(p => ({ ...p, educacion: e.target.value }))} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="certificaciones">Certificaciones</Label>
                <Textarea id="certificaciones" placeholder="Cursos, diplomados, certificados..."
                  rows={2} value={formPerfil.certificaciones} disabled={!editandoPerfil}
                  onChange={(e) => setFormPerfil(p => ({ ...p, certificaciones: e.target.value }))} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="idiomas">Idiomas</Label>
                  <Input id="idiomas" placeholder="Español, Inglés..."
                    value={formPerfil.idiomas} disabled={!editandoPerfil}
                    onChange={(e) => setFormPerfil(p => ({ ...p, idiomas: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="atiende_en">Atiende en</Label>
                  <Input id="atiende_en" placeholder="Consultorio, Virtual, Domicilio..."
                    value={formPerfil.atiende_en} disabled={!editandoPerfil}
                    onChange={(e) => setFormPerfil(p => ({ ...p, atiende_en: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="direccion_consultorio">Dirección del consultorio</Label>
                <Input id="direccion_consultorio" placeholder="Av. Principal 123, Piso 2..."
                  value={formPerfil.direccion_consultorio} disabled={!editandoPerfil}
                  onChange={(e) => setFormPerfil(p => ({ ...p, direccion_consultorio: e.target.value }))} />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5" />Tu Link Público
              </CardTitle>
              <CardDescription>Comparte este link con tus pacientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="break-all text-sm text-foreground">{publicUrl}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyLink}>
                  {copied ? <><Check className="h-4 w-4" />Copiado</> : <><Copy className="h-4 w-4" />Copiar Link</>}
                </Button>
                <Button variant="outline" asChild>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Estadísticas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total de citas</span>
                <span className="text-lg font-semibold">{profesional?.total_citas ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Calificación promedio</span>
                <span className="text-lg font-semibold">
                  {profesional?.promedio_calif ? `${Number(profesional.promedio_calif).toFixed(1)} ★` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Estado del perfil</span>
                <span className={`text-sm font-medium ${profesional?.perfil_completo ? "text-green-600" : "text-amber-600"}`}>
                  {profesional?.perfil_completo ? "Completo" : "Incompleto"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><QrCode className="h-5 w-5" />Código QR</CardTitle>
              <CardDescription>Imprime o comparte tu código QR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border border-border bg-white p-4">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`h-6 w-6 ${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24].includes(i) ? "bg-foreground" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">Escanea para abrir tu perfil público</p>
              <Button variant="outline" className="w-full">Descargar QR</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}