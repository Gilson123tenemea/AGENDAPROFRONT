"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import { loginAdmin } from "@/app/servicios/administrador"
import { login } from "@/app/servicios/auth"

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch {
    return null
  }
}

function getRutaPorRol(rol: string): string {
  switch (rol?.toLowerCase()) {
    case "superadmin":
    case "super_admin":
      return "/superadmin"
    case "admin_org":
    case "admin":
      return "/admin"
    case "profesional":
    default:
      return "/panel"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const credenciales = { email: formData.email, password: formData.password }

    // 1️⃣ Intentar como superadmin
    const resultadoAdmin = await loginAdmin(credenciales)

    if (resultadoAdmin.ok) {
      localStorage.setItem("access_token", resultadoAdmin.data.access_token)
      if (resultadoAdmin.data.refresh_token) {
        localStorage.setItem("refresh_token", resultadoAdmin.data.refresh_token)
      }
      router.push("/superadmin")
      return
    }

    // 2️⃣ Intentar como admin_org o profesional
    const resultadoAuth = await login(credenciales)

    if (!resultadoAuth.ok) {
      setError(resultadoAuth.message || "Credenciales incorrectas")
      setIsLoading(false)
      return
    }

    const { access_token, refresh_token } = resultadoAuth.data
    localStorage.setItem("access_token", access_token)
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token)

    // Leer rol desde el JWT
    const payload = decodeJWT(access_token)
    const rol = payload?.rol || payload?.role || payload?.tipo || "profesional"

    router.push(getRutaPorRol(rol))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Calendar className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold text-foreground">AgendaPro</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-primary hover:underline">
              Registra tu organización
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Al continuar, aceptas nuestros{" "}
        <Link href="/terminos" className="underline hover:text-foreground">Términos de Servicio</Link>{" "}
        y{" "}
        <Link href="/privacidad" className="underline hover:text-foreground">Política de Privacidad</Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Los pacientes no necesitan cuenta. Usan el link público del profesional para agendar citas.
      </p>
    </div>
  )
}