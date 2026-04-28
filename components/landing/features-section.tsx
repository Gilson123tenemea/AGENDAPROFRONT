import { Calendar, Bell, Users, Clock, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Visualiza tu agenda por dia o semana. Gestiona citas con un clic: confirma, cancela o reagenda.",
  },
  {
    icon: Bell,
    title: "Recordatorios WhatsApp",
    description: "Recordatorios automaticos 2 dias, 24 horas y 2 horas antes de cada cita. Reduce inasistencias hasta un 95%.",
  },
  {
    icon: Users,
    title: "Gestion de Pacientes",
    description: "Historial completo de cada paciente. Notas clinicas privadas y seguimiento de todas sus visitas.",
  },
  {
    icon: Clock,
    title: "Horarios Flexibles",
    description: "Configura tu disponibilidad por dia de la semana. Define hora de inicio y fin de atencion.",
  },
  {
    icon: Shield,
    title: "Multi-organizacion",
    description: "Gestiona multiples profesionales desde un solo panel de administracion. Ideal para clinicas y consultorios.",
  },
  {
    icon: BarChart3,
    title: "Reportes y Metricas",
    description: "Dashboard con estadisticas de citas, ingresos y rendimiento. Toma decisiones basadas en datos.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">Todo lo que necesitas para gestionar tu agenda</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Herramientas poderosas diseñadas para profesionales de salud y servicios
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
