// servicios/index.js
// Barrel de exportaciones — importa todo desde un solo lugar
// Ejemplo de uso:
//   import { login, listarCitas, reservarCita } from "@/servicios";

export * from "./auth";
export * from "./administrador";
export * from "./citas";
export * from "./horarios";
export * from "./organizaciones";
export * from "./pacientes";
export * from "./profesionales";
export * from "./publico";
export * from "./helpers";
export { BASE_URL } from "./api";