"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { registrarOrganizacion } from "@/app/servicios/organizaciones"

function generarSlug(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [orgData, setOrgData] = useState({
    nombre: "",
    slug: "",
    email: "",
    telefono: "",
  })

  const [adminData, setAdminData] = useState({
    admin_email: "",
    admin_password: "",
    confirmar_password: "",
  })

  useEffect(() => {
    if (orgData.nombre) {
      setOrgData((prev) => ({ ...prev, slug: generarSlug(prev.nombre) }))
    }
  }, [orgData.nombre])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (orgData.slug.length < 3) {
      setError("La URL personalizada debe tener al menos 3 caracteres")
      return
    }
    if (!/^[a-z0-9-]+$/.test(orgData.slug)) {
      setError("La URL solo puede contener letras minúsculas, números y guiones")
      return
    }

    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (adminData.admin_password !== adminData.confirmar_password) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (adminData.admin_password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (!/[A-Z]/.test(adminData.admin_password)) {
      setError("La contraseña debe contener al menos una letra mayúscula")
      return
    }
    if (!/[0-9]/.test(adminData.admin_password)) {
      setError("La contraseña debe contener al menos un número")
      return
    }

    setIsLoading(true)

    const payload = {
      nombre: orgData.nombre,
      slug: orgData.slug,
      email: orgData.email,
      telefono: orgData.telefono,
      admin_email: adminData.admin_email,
      admin_password: adminData.admin_password,
    }

    const resultado = await registrarOrganizacion(payload)

    if (!resultado.ok) {
      setError(resultado.message || "Error al registrar la organización")
      setIsLoading(false)
      return
    }

    router.push("/login?registered=true")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Calendar className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold text-foreground">AgendaPro</span>
      </Link>

      {/* Indicador de pasos */}
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {step > 1 ? <Check className="h-4 w-4" /> : "1"}
        </div>
        <div className={`h-1 w-12 rounded ${step > 1 ? "bg-primary" : "bg-muted"}`} />
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          2
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {step === 1 ? "Registra tu organización" : "Crea tu cuenta de admin"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Ingresa los datos de tu clínica, consultorio o centro médico"
              : "Esta cuenta será el administrador principal de la organización"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ── PASO 1: datos de la organización ── */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la organización</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Clínica Dental Sonrisas"
                  value={orgData.nombre}
                  onChange={(e) => setOrgData({ ...orgData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL personalizada</Label>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-sm text-muted-foreground">agendapro.com/</span>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="clinica-sonrisas"
                    value={orgData.slug}
                    onChange={(e) =>
                      setOrgData({ ...orgData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })
                    }
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Solo letras minúsculas, números y guiones
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo de contacto</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@clinica.com"
                  value={orgData.email}
                  onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+593 99 123 4567"
                  value={orgData.telefono}
                  onChange={(e) => setOrgData({ ...orgData, telefono: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* ── PASO 2: datos del admin ── */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin_email">Correo electrónico</Label>
                <Input
                  id="admin_email"
                  type="email"
                  placeholder="tu@email.com"
                  value={adminData.admin_email}
                  onChange={(e) => setAdminData({ ...adminData, admin_email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={adminData.admin_password}
                    onChange={(e) => setAdminData({ ...adminData, admin_password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Debe tener al menos 8 caracteres, una mayúscula y un número
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar_password">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmar_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={adminData.confirmar_password}
                    onChange={(e) => setAdminData({ ...adminData, confirmar_password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => { setStep(1); setError("") }}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}