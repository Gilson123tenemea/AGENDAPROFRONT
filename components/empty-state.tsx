import { Button } from "@/components/ui/button"
import { Calendar, Users, Building2, FileText, Clock, Search } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type: "appointments" | "patients" | "professionals" | "organizations" | "search" | "custom"
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: React.ReactNode
}

const defaultContent = {
  appointments: {
    icon: <Calendar className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin citas programadas",
    description: "No tienes citas agendadas para este periodo. Las nuevas reservas apareceran aqui.",
  },
  patients: {
    icon: <Users className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin pacientes registrados",
    description: "Aun no tienes pacientes. Cuando recibas tu primera reserva, los datos del paciente se guardaran automaticamente.",
  },
  professionals: {
    icon: <Users className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin profesionales",
    description: "No hay profesionales registrados en tu organizacion. Agrega profesionales para que puedan recibir citas.",
  },
  organizations: {
    icon: <Building2 className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin organizaciones",
    description: "No hay organizaciones registradas en la plataforma.",
  },
  search: {
    icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin resultados",
    description: "No se encontraron resultados para tu busqueda. Intenta con otros terminos.",
  },
  custom: {
    icon: <FileText className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sin contenido",
    description: "No hay contenido disponible.",
  },
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  const content = defaultContent[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {icon || content.icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title || content.title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || content.description}
      </p>
      {(actionLabel && actionHref) && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {(actionLabel && onAction) && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
