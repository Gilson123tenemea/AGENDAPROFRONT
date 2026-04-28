import Link from "next/link"
import { Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">AgendaPro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plataforma de agendamiento de citas para profesionales de salud y servicios.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Producto</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Testimonios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/ayuda" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Documentacion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Politica de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terminos de Servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgendaPro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
