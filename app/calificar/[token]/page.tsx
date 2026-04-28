"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Star, Loader2, CheckCircle2 } from "lucide-react"

// Demo data
const appointmentData = {
  id: "1",
  professionalName: "Dra. Maria Garcia",
  specialty: "Dermatologia",
  organization: "Clinica Dermatologica Integral",
  date: "2026-04-10",
  time: "10:00",
  patientName: "Juan Perez",
}

export default function RatingPage() {
  const router = useRouter()
  const params = useParams()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const ratingLabels = [
    "",
    "Muy mala experiencia",
    "Mala experiencia",
    "Experiencia regular",
    "Buena experiencia",
    "Excelente experiencia",
  ]

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">AgendaPro</span>
        </Link>

        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed/10">
                <CheckCircle2 className="h-8 w-8 text-status-confirmed" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Gracias por tu opinion</h2>
            <p className="mb-6 text-muted-foreground">
              Tu calificacion ayuda a otros pacientes a encontrar el profesional adecuado.
            </p>
            <div className="mb-6 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= rating
                      ? "fill-status-pending text-status-pending"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <Button asChild className="w-full">
              <Link href={`/p/${appointmentData.professionalName.toLowerCase().replace(/\s+/g, "-")}`}>
                Ver perfil del profesional
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="text-2xl">Califica tu experiencia</CardTitle>
          <CardDescription>
            Tu opinion es importante para nosotros y ayuda a otros pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Appointment Info */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {appointmentData.professionalName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-foreground">{appointmentData.professionalName}</p>
                <p className="text-sm text-primary">{appointmentData.specialty}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(appointmentData.date)} - {appointmentData.time}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-center block">Como fue tu experiencia?</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-status-pending text-status-pending"
                          : "fill-muted text-muted hover:text-status-pending/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {ratingLabels[hoveredRating || rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comentario (opcional)</Label>
              <Textarea
                id="comment"
                placeholder="Cuentanos mas sobre tu experiencia..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Tu comentario sera visible para otros pacientes
              </p>
            </div>

            {/* Quick feedback buttons */}
            {rating > 0 && (
              <div className="space-y-2">
                <Label>Que te gusto? (opcional)</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Puntualidad",
                    "Atencion amable",
                    "Explicaciones claras",
                    "Instalaciones",
                    "Tiempo de espera",
                    "Profesionalismo",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (comment.includes(tag)) {
                          setComment(comment.replace(tag + ", ", "").replace(tag, ""))
                        } else {
                          setComment(comment ? `${comment}, ${tag}` : tag)
                        }
                      }}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        comment.includes(tag)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar calificacion"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Tu nombre se mostrara como{" "}
            <span className="font-medium">{appointmentData.patientName.split(" ")[0]} {appointmentData.patientName.split(" ")[1]?.[0]}.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
