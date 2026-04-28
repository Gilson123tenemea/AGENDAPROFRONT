// servicios/pacientes.js
// Rutas: GET / | GET /:id | GET /:id/citas | PUT /:id/notas
import { BASE_URL } from "./api";
import { authHeaders, manejarRespuesta } from "./helpers";

const PACIENTES_URL = `${BASE_URL}/api/v1/pacientes`;

// ============================
// 📌 Listar pacientes de la organización
// Query param opcional: buscar (nombre o teléfono)
// ============================
export async function listarPacientes({ buscar } = {}) {
  try {
    const params = new URLSearchParams();
    if (buscar) params.append("buscar", buscar);

    const response = await fetch(`${PACIENTES_URL}/?${params}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarPacientes:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener perfil de un paciente
// ============================
export async function obtenerPaciente(pacienteId) {
  try {
    const response = await fetch(`${PACIENTES_URL}/${pacienteId}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en obtenerPaciente:", error);
    throw error;
  }
}

// ============================
// 📌 Historial de citas de un paciente
// ============================
export async function historialCitasPaciente(pacienteId) {
  try {
    const response = await fetch(`${PACIENTES_URL}/${pacienteId}/citas`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en historialCitasPaciente:", error);
    throw error;
  }
}

// ============================
// 📌 Actualizar notas de un paciente
// Recibe: { notas: string }
// ============================
export async function actualizarNotasPaciente(pacienteId, datos) {
  try {
    const response = await fetch(`${PACIENTES_URL}/${pacienteId}/notas`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en actualizarNotasPaciente:", error);
    throw error;
  }
}