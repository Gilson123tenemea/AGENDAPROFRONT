"use client"

import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  className?: string
}

export function TimeSlotPicker({
  slots,
  selectedTime,
  onTimeSelect,
  className,
}: TimeSlotPickerProps) {
  const morningSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0])
    return hour < 12
  })

  const afternoonSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0])
    return hour >= 12 && hour < 18
  })

  const eveningSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0])
    return hour >= 18
  })

  const renderSlots = (timeSlots: TimeSlot[], label: string) => {
    if (timeSlots.length === 0) return null

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {label}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                slot.available
                  ? "hover:bg-primary/10 hover:border-primary cursor-pointer border-border"
                  : "text-muted-foreground/40 cursor-not-allowed border-border/50 bg-muted/30",
                selectedTime === slot.time &&
                  "bg-primary text-primary-foreground border-primary hover:bg-primary"
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {renderSlots(morningSlots, "Manana")}
      {renderSlots(afternoonSlots, "Tarde")}
      {renderSlots(eveningSlots, "Noche")}
    </div>
  )
}
