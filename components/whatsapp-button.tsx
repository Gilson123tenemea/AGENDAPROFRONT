import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  phone: string
  message?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({
  phone,
  message = "",
  variant = "default",
  size = "default",
  className,
  children,
}: WhatsAppButtonProps) {
  // Remove any non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, "")
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Build WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ""}`

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      asChild
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        {children || "WhatsApp"}
      </a>
    </Button>
  )
}
