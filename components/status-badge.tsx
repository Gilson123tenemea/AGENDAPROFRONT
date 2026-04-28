import { cn } from "@/lib/utils"
import type { AppointmentStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: {
    label: "Pendiente",
    className: "bg-status-pending/15 text-status-pending border-status-pending/30",
  },
  confirmed: {
    label: "Confirmada",
    className: "bg-status-confirmed/15 text-status-confirmed border-status-confirmed/30",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
  },
  completed: {
    label: "Completada",
    className: "bg-status-completed/15 text-status-completed border-status-completed/30",
  },
  noshow: {
    label: "No asistio",
    className: "bg-status-noshow/15 text-status-noshow border-status-noshow/30",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
