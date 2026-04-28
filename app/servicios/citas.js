// servicios/citas.js
// Rutas: GET / | GET /:id | PATCH /:id/cancelar | PATCH /:id/reagendar
//        PATCH /:id/asistencia | POST /:id/notas | GET /:id/notas
import { BASE_URL } from "./api";
import { authHeaders, manejarRespuesta } from "./helpers";

const CITAS_URL = `${BASE_URL}/api/v1/citas`;

// ============================
// 📌 Listar citas del profesional
// Query params: profesional_id (requerido), estado?, fecha_desde?, fecha_hasta?
// ============================
export async function listarCitas({ profesional_id, estado, fecha_desde, fecha_hasta } = {}) {
  const params = new URLSearchParams({ profesional_id });
  if (estado) params.append("estado", estado);
  if (fecha_desde) params.append("fecha_desde", fecha_desde);
  if (fecha_hasta) params.append("fecha_hasta", fecha_hasta);

  try {
    const response = await fetch(`${CITAS_URL}/?${params}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarCitas:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener detalle de una cita
// ============================
export async function obtenerCita(citaId) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en obtenerCita:", error);
    throw error;
  }
}

// ============================
// 📌 Cancelar una cita
// Recibe: { motivo }
// ============================
export async function cancelarCita(citaId, datos) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}/cancelar`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en cancelarCita:", error);
    throw error;
  }
}

// ============================
// 📌 Reagendar una cita
// Recibe: { nueva_fecha }
// ============================
export async function reagendarCita(citaId, datos) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}/reagendar`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en reagendarCita:", error);
    throw error;
  }
}

// ============================
// 📌 Marcar asistencia de una cita
// Recibe: { asistio: boolean }
// ============================
export async function marcarAsistencia(citaId, datos) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}/asistencia`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en marcarAsistencia:", error);
    throw error;
  }
}

// ============================
// 📌 Agregar nota clínica a una cita
// Recibe: { contenido }
// ============================
export async function agregarNota(citaId, datos) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}/notas`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en agregarNota:", error);
    throw error;
  }
}

// ============================
// 📌 Listar notas de una cita
// ============================
export async function listarNotas(citaId) {
  try {
    const response = await fetch(`${CITAS_URL}/${citaId}/notas`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarNotas:", error);
    throw error;
  }
}