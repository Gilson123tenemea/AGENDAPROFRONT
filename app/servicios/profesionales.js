// servicios/profesionales.js
// Rutas: POST / | GET / | GET /:id | PUT /:id | DELETE /:id
import { BASE_URL } from "./api";
import { authHeaders, manejarRespuesta } from "./helpers";

const PROF_URL = `${BASE_URL}/api/v1/profesionales`;    

// ============================
// 📌 Crear nuevo profesional
// Requiere rol admin
// Recibe: { nombre, email, especialidad, ... }
// ============================
export async function crearProfesional(datos) {
  try {
    const response = await fetch(`${PROF_URL}/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en crearProfesional:", error);
    throw error;
  }
}

// ============================
// 📌 Listar profesionales de mi organización
// Requiere rol admin
// ============================
export async function listarProfesionales() {
  try {
    const response = await fetch(`${PROF_URL}/`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarProfesionales:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener detalle de un profesional
// ============================
export async function obtenerProfesional(profesionalId) {
  try {
    const response = await fetch(`${PROF_URL}/${profesionalId}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en obtenerProfesional:", error);
    throw error;
  }
}

// ============================
// 📌 Actualizar datos de un profesional
// Recibe: { nombre, especialidad, ... }
// ============================
export async function actualizarProfesional(profesionalId, datos) {
  try {
    const response = await fetch(`${PROF_URL}/${profesionalId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en actualizarProfesional:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar profesional (borrado lógico)
// Requiere rol admin
// ============================
export async function eliminarProfesional(profesionalId) {
  try {
    const response = await fetch(`${PROF_URL}/${profesionalId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en eliminarProfesional:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener mi propio perfil (profesional autenticado)
// ============================
export async function obtenerMiPerfil() {
  try {
    const response = await fetch(`${PROF_URL}/yo`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en obtenerMiPerfil:", error);
    throw error;
  }
}

// ============================
// 📌 Completar perfil del profesional autenticado
// Recibe: { titulo_profesional, descripcion, experiencia_anios, ... }
// ============================
export async function completarMiPerfil(datos) {
  try {
    const response = await fetch(`${PROF_URL}/yo/perfil`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en completarMiPerfil:", error);
    throw error;
  }
}

export async function listarMisPacientes(q = "") {
  try {
    const params = q ? `?q=${encodeURIComponent(q)}` : ""
    const response = await fetch(`${PROF_URL}/yo/pacientes${params}`, {
      headers: authHeaders(),
    })
    return await manejarRespuesta(response)
  } catch (error) {
    console.error("❌ Error en listarMisPacientes:", error)
    throw error
  }
}