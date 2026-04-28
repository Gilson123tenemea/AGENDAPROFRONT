// servicios/administrador.js
// Rutas: POST /api/v1/admin/login | POST /api/v1/admin/refresh
import { BASE_URL } from "./api";

const ADMIN_URL = `${BASE_URL}/api/v1/admin`;

// ============================
// 📌 Login de administrador
// Recibe: { email, password }
// Devuelve: { access_token, refresh_token }
// ============================
export async function loginAdmin(datos) {
  const response = await fetch(`${ADMIN_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al iniciar sesión como administrador" };
  }

  return { ok: true, data };
}

// ============================
// 📌 Refrescar token de administrador
// Recibe: { refresh_token }
// Devuelve: { access_token, refresh_token }
// ============================
export async function refrescarTokenAdmin(datos) {
  const response = await fetch(`${ADMIN_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al refrescar el token del administrador" };
  }

  return { ok: true, data };
}