// servicios/horarios.js
// Rutas: POST / | GET /:profesional_id | PATCH /:horario_id/estado | DELETE /:horario_id
import { BASE_URL } from "./api";
import { authHeaders, manejarRespuesta } from "./helpers";

const HORARIOS_URL = `${BASE_URL}/api/v1/horarios`;

// ============================
// 📌 Crear horario para un profesional
// Query param: profesional_id (requerido)
// Recibe: { dia_semana, hora_inicio, hora_fin }
// ============================
export async function crearHorario(profesional_id, datos) {
  try {
    const response = await fetch(`${HORARIOS_URL}/?profesional_id=${profesional_id}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en crearHorario:", error);
    throw error;
  }
}

// ============================
// 📌 Listar horarios de un profesional
// ============================
export async function listarHorarios(profesionalId) {
  try {
    const response = await fetch(`${HORARIOS_URL}/${profesionalId}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarHorarios:", error);
    throw error;
  }
}

// ============================
// 📌 Activar o desactivar un horario
// Query param: esta_activo (boolean)
// ============================
export async function cambiarEstadoHorario(horarioId, estaActivo) {
  try {
    const response = await fetch(
      `${HORARIOS_URL}/${horarioId}/estado?esta_activo=${estaActivo}`,
      {
        method: "PATCH",
        headers: authHeaders(),
      }
    );
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en cambiarEstadoHorario:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar un horario
// ============================
export async function eliminarHorario(horarioId) {
  try {
    const response = await fetch(`${HORARIOS_URL}/${horarioId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en eliminarHorario:", error);
    throw error;
  }
}