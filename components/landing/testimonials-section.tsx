import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dra. Maria Garcia",
    role: "Dermatologa",
    content: "AgendaPro transformo mi consultorio. Antes perdia horas llamando pacientes, ahora todo es automatico. Mis pacientes aman la facilidad de reservar.",
    rating: 5,
    initials: "MG",
  },
  {
    name: "Dr. Carlos Rodriguez",
    role: "Odontologo",
    content: "Desde que uso AgendaPro, las inasistencias bajaron drasticamente. Los recordatorios por WhatsApp son clave. Super recomendado.",
    rating: 5,
    initials: "CR",
  },
  {
    name: "Lic. Ana Martinez",
    role: "Psicologa",
    content: "La interfaz es muy intuitiva. Puedo gestionar toda mi agenda desde el celular. El soporte es excelente y siempre responden rapido.",
    rating: 5,
    initials: "AM",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">Lo que dicen nuestros usuarios</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de profesionales ya confian en AgendaPro para gestionar sus citas
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-status-pending text-status-pending" />
                ))}
              </div>
              <p className="mb-6 flex-1 text-muted-foreground">{`"${testimonial.content}"`}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
