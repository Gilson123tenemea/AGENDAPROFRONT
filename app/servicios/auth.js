// servicios/auth.js
// Rutas: POST /api/v1/auth/login | POST /api/v1/auth/refresh
import { BASE_URL } from "./api";

const AUTH_URL = `${BASE_URL}/api/v1/auth`;

// ============================
// 📌 Login de usuario
// Recibe: { email, password }
// Devuelve: { access_token, refresh_token }
// ============================
export async function login(datos) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al iniciar sesión" };
  }

  return { ok: true, data };
}

// ============================
// 📌 Refrescar token
// Recibe: { refresh_token }
// Devuelve: { access_token, refresh_token }
// ============================
export async function refrescarToken(datos) {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al refrescar el token" };
  }

  return { ok: true, data };
}