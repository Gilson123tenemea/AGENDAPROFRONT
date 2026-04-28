import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Basico",
    price: 29,
    description: "Ideal para profesionales independientes",
    features: [
      "1 profesional",
      "Agenda ilimitada",
      "Link publico personalizado",
      "Recordatorios WhatsApp",
      "Panel de gestion",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: 59,
    description: "Para consultorios con varios profesionales",
    features: [
      "Hasta 5 profesionales",
      "Agenda ilimitada",
      "Links publicos personalizados",
      "Recordatorios WhatsApp",
      "Panel de administracion",
      "Reportes basicos",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Clinica",
    price: 99,
    description: "Para clinicas y centros de salud",
    features: [
      "Profesionales ilimitados",
      "Agenda ilimitada",
      "Links publicos personalizados",
      "Recordatorios WhatsApp",
      "Panel de administracion avanzado",
      "Reportes avanzados",
      "API de integracion",
      "Soporte dedicado 24/7",
    ],
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">Planes para cada necesidad</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tu practica. Sin contratos, cancela cuando quieras.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm",
                plan.highlighted
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : "border-border"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Mas Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
              >
                <Link href="/registro">Comenzar Ahora</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
