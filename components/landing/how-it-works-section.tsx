import { UserPlus, Link2, CalendarCheck } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Registrate",
    description: "Crea tu cuenta en menos de 2 minutos. Configura tu organizacion y agrega tus profesionales.",
  },
  {
    icon: Link2,
    title: "Comparte tu Link",
    description: "Obtén tu link personalizado y codigo QR. Compartelo por WhatsApp, redes sociales o imprimelo.",
  },
  {
    icon: CalendarCheck,
    title: "Recibe Reservas",
    description: "Tus pacientes reservan en segundos. Reciben recordatorios automaticos y tu gestionas todo desde el panel.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">Como Funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Empieza a recibir reservas en tres simples pasos
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <step.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
