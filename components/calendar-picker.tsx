"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarPickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  availableDates?: Date[]
  minDate?: Date
  maxDate?: Date
  className?: string
}

const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  availableDates,
  minDate = new Date(),
  maxDate,
  className,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const date = selectedDate || new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateAvailable = (date: Date) => {
    if (!availableDates || availableDates.length === 0) {
      // If no available dates provided, check only min/max
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (date < today) return false
      if (minDate && date < minDate) return false
      if (maxDate && date > maxDate) return false
      
      return true
    }

    return availableDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentMonth)

  const canGoToPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          disabled={!canGoToPrevious()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const available = isDateAvailable(date)
          const selected = isDateSelected(date)
          const today = isToday(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => available && onDateSelect(date)}
              disabled={!available}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                available
                  ? "hover:bg-primary/10 cursor-pointer"
                  : "text-muted-foreground/40 cursor-not-allowed",
                selected && "bg-primary text-primary-foreground hover:bg-primary",
                today && !selected && "border border-primary text-primary",
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
