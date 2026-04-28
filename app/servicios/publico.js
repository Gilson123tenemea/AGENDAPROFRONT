// servicios/publico.js
// Rutas SIN autenticación — acceso del paciente
import { BASE_URL } from "./api";
import { manejarRespuesta } from "./helpers";

const PUBLICO_URL = `${BASE_URL}/api/v1/publico`;

// ── Perfil público del profesional ───────────────────────────────────
export async function perfilPublicoProfesional(token) {
  try {
    const response = await fetch(`${PUBLICO_URL}/profesionales/${token}`);
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en perfilPublicoProfesional:", error);
    throw error;
  }
}

// ── Slots disponibles para una fecha ────────────────────────────────
// fecha: ISO 8601, ej: "2026-04-09T00:00:00"
export async function slotsDisponibles(token, fecha) {
  try {
    const response = await fetch(
      `${PUBLICO_URL}/profesionales/${token}/slots?fecha=${encodeURIComponent(fecha)}`
    );
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en slotsDisponibles:", error);
    throw error;
  }
}

// ── Reservar cita ────────────────────────────────────────────────────
// Recibe: { nombre_paciente, telefono_paciente, email_paciente?, motivo, inicio }
export async function reservarCita(token, datos) {
  const response = await fetch(`${PUBLICO_URL}/profesionales/${token}/reservar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al reservar la cita" };
  }

  return { ok: true, data };
}

// ── Consultar estado de cita por token de reserva ───────────────────
// GET /publico/citas/{token}
export async function estadoCita(token) {
  try {
    const response = await fetch(`${PUBLICO_URL}/citas/${token}`);
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en estadoCita:", error);
    throw error;
  }
}

// ── Cancelar cita (desde la vista del paciente) ──────────────────────
// POST /publico/citas/{token}/cancelar
// Recibe: { motivo_cancelacion: string }
export async function cancelarCitaPublica(token, datos) {
  const response = await fetch(`${PUBLICO_URL}/citas/${token}/cancelar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al cancelar la cita" };
  }

  return { ok: true, data };
}