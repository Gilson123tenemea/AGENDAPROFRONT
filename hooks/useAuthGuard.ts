// hooks/useAuthGuard.ts
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    // Verificar si el token está expirado
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expirado = payload.exp * 1000 < Date.now()

      if (expirado) {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          localStorage.removeItem("access_token")
          router.replace("/login")
        }
        // Si hay refresh token, helpers.js lo manejará en la primera petición
      }
    } catch {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      router.replace("/login")
    }
  }, [])
}