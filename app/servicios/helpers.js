// servicios/helpers.js
import { refrescarToken } from "./auth";

export function authHeaders(token) {
  const accessToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
}

function cerrarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

// Intenta refrescar el token y reintentar la petición original
async function refrescarYReintentar(fetchFn) {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    cerrarSesion();
    return;
  }

  const resultado = await refrescarToken({ refresh_token: refreshToken });

  if (!resultado.ok) {
    cerrarSesion();
    return;
  }

  // Guardar el nuevo token
  localStorage.setItem("access_token", resultado.data.access_token);
  if (resultado.data.refresh_token) {
    localStorage.setItem("refresh_token", resultado.data.refresh_token);
  }

  // Reintentar la petición original con el nuevo token
  return await fetchFn(resultado.data.access_token);
}

// Wrapper que maneja 401 automáticamente
export async function fetchConAuth(url, opciones = {}, fetchFn) {
  const response = await fetch(url, {
    ...opciones,
    headers: authHeaders(),
  });

  if (response.status === 401) {
    return await refrescarYReintentar(fetchFn);
  }

  return response;
}

export async function manejarRespuesta(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Error en la petición");
  }
  return data;
}