import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Bell, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-16 md:pb-32 md:pt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            Mas de 5,000 profesionales confian en nosotros
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-balance">Gestiona tu agenda de citas de forma</span>{" "}
            <span className="text-primary">inteligente</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            AgendaPro permite a medicos, dentistas, abogados y otros profesionales gestionar su agenda. 
            Tus pacientes reservan en segundos y reciben recordatorios automaticos por WhatsApp.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/registro">
                Comenzar Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Ver Como Funciona</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="mb-1 text-3xl font-bold text-foreground">+50,000</span>
            <span className="text-sm text-muted-foreground">Citas agendadas al mes</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <span className="mb-1 text-3xl font-bold text-foreground">5,000+</span>
            <span className="text-sm text-muted-foreground">Profesionales activos</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <span className="mb-1 text-3xl font-bold text-foreground">95%</span>
            <span className="text-sm text-muted-foreground">Reduccion de inasistencias</span>
          </div>
        </div>

        {/* App Preview */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-status-pending" />
              <div className="h-3 w-3 rounded-full bg-status-confirmed" />
            </div>
            <div className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar preview */}
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20" />
                    <div>
                      <div className="h-3 w-20 rounded bg-foreground/20" />
                      <div className="mt-1 h-2 w-14 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-full rounded-lg bg-primary/10" />
                    <div className="h-8 w-full rounded-lg bg-muted/50" />
                    <div className="h-8 w-full rounded-lg bg-muted/50" />
                    <div className="h-8 w-full rounded-lg bg-muted/50" />
                  </div>
                </div>
                {/* Calendar preview */}
                <div className="rounded-xl border border-border bg-background p-4 md:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-4 w-24 rounded bg-foreground/20" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-lg bg-muted" />
                      <div className="h-8 w-8 rounded-lg bg-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-6 w-full rounded bg-muted-foreground/10 text-center text-xs" />
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex h-10 w-full items-center justify-center rounded-lg text-xs ${
                          i === 15 ? "bg-primary text-primary-foreground" : i === 16 || i === 17 ? "bg-accent/20" : "bg-muted/50"
                        }`}
                      >
                        {i + 1 <= 31 ? i + 1 : ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
