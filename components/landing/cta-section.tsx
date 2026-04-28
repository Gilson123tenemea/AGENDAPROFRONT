import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="border-t border-border bg-primary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            <span className="text-balance">Empieza a recibir reservas hoy mismo</span>
          </h2>
          <p className="mb-10 text-lg text-primary-foreground/80">
            Registrate gratis y configura tu agenda en menos de 5 minutos. Sin tarjeta de credito.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link href="/registro">
                Crear Cuenta Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
