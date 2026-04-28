// servicios/organizaciones.js
// Rutas: POST /registrar | GET /yo | PUT /yo | PUT /yo/perfil
//        GET / (superadmin) | PATCH /:org_id/estado (superadmin)
import { BASE_URL } from "./api";
import { authHeaders, manejarRespuesta } from "./helpers";

const ORG_URL = `${BASE_URL}/api/v1/organizaciones`;

// ============================
// 📌 Registrar nueva organización (público)
// Paso 1 del onboarding — no requiere token
// Recibe: { nombre, email, password, ... }
// Devuelve: { organizacion, usuario, mensaje }
// ============================
export async function registrarOrganizacion(datos) {
  const response = await fetch(`${ORG_URL}/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, message: data.detail || "Error al registrar la organización" };
  }

  return { ok: true, data };
}

// ============================
// 📌 Obtener mi organización
// ============================
export async function obtenerMiOrganizacion() {
  try {
    const fetchFn = (nuevoToken) =>
      fetch(`${ORG_URL}/yo`, { headers: authHeaders(nuevoToken) });

    const response = await fetchConAuth(`${ORG_URL}/yo`, {}, fetchFn);
    if (!response) return; // fue redirigido al login
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en obtenerMiOrganizacion:", error);
    throw error;
  }
}

// ============================
// 📌 Actualizar datos básicos de la organización
// Recibe: { nombre, telefono, ... }
// ============================
export async function actualizarOrganizacion(datos) {
  try {
    const response = await fetch(`${ORG_URL}/yo`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en actualizarOrganizacion:", error);
    throw error;
  }
}

// ============================
// 📌 Completar perfil de la organización
// Paso 2 del onboarding
// Recibe: { descripcion, direccion, logo, redes_sociales, ... }
// ============================
export async function completarPerfilOrganizacion(datos) {
  try {
    const response = await fetch(`${ORG_URL}/yo/perfil`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(datos),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en completarPerfilOrganizacion:", error);
    throw error;
  }
}

// ============================
// 📌 [Superadmin] Listar todas las organizaciones
// Query params: skip?, limit?
// ============================
export async function listarTodasOrganizaciones({ skip = 0, limit = 50 } = {}) {
  try {
    const response = await fetch(`${ORG_URL}/?skip=${skip}&limit=${limit}`, {
      headers: authHeaders(),
    });
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en listarTodasOrganizaciones:", error);
    throw error;
  }
}

// ============================
// 📌 [Superadmin] Activar o suspender organización
// Query param: esta_activo (boolean)
// ============================
export async function cambiarEstadoOrganizacion(orgId, estaActivo) {
  try {
    const response = await fetch(
      `${ORG_URL}/${orgId}/estado?esta_activo=${estaActivo}`,
      {
        method: "PATCH",
        headers: authHeaders(),
      }
    );
    return await manejarRespuesta(response);
  } catch (error) {
    console.error("❌ Error en cambiarEstadoOrganizacion:", error);
    throw error;
  }
}