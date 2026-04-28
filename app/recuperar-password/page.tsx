"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function RecoverPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)
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
          {success ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed/20">
                <CheckCircle className="h-8 w-8 text-status-confirmed" />
              </div>
              <CardTitle className="text-2xl">Revisa tu correo</CardTitle>
              <CardDescription>
                Hemos enviado instrucciones para restablecer tu contraseña a {email}
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
              <CardDescription>
                Ingresa tu correo electronico y te enviaremos instrucciones para restablecer tu contraseña
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam o intenta nuevamente.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Volver al Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electronico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Instrucciones"
                )}
              </Button>

              <Button variant="ghost" asChild className="w-full gap-2">
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Login
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
