import { API_BASE_URL } from "./config";
import { Interaccion } from "../types/ticket.types";
import { EnlaceResponse, EnlaceCrearResponse, CanalNotificacion } from "../types/enlace.types";

function mapInteraccion(data: Record<string, unknown>): Interaccion {
  const autorNombre =
    (data.autor_nombre as string) ??
    (data.autor_tipo === "cliente"
      ? "Cliente"
      : data.autor_tipo === "agente"
      ? "Agente"
      : "Sistema");

  const iniciales = autorNombre
    .split(" ")
    .map((n: string) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id: data.id as string,
    ticket_id: data.ticket_id as string,
    autor_tipo: data.autor_tipo as Interaccion["autor_tipo"],
    autor_id: data.autor_id as string,
    contenido: data.contenido as string,
    es_nota_interna: data.es_nota_interna as boolean,
    creado_en: data.creado_en as string,
    autor_nombre: autorNombre,
    autor_iniciales: iniciales,
  };
}

export const enlacesApi = {
  async crear(ticketId: string, canalNotificacion: CanalNotificacion = "otro"): Promise<EnlaceCrearResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/tickets/${ticketId}/enlace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canal_notificacion: canalNotificacion }),
    });
    if (!res.ok) throw new Error("Error al crear enlace");
    return res.json();
  },

  async getByToken(token: string): Promise<EnlaceResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/enlace/${token}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Enlace no encontrado");
      if (res.status === 410) throw new Error("Este enlace ha expirado");
      throw new Error("Error al obtener enlace");
    }
    const data = await res.json();
    return {
      ...data,
      interacciones: data.interacciones.map(mapInteraccion),
    };
  },

  async responder(token: string, contenido: string): Promise<Interaccion> {
    const res = await fetch(`${API_BASE_URL}/api/v1/enlace/${token}/interacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido }),
    });
    if (!res.ok) throw new Error("Error al enviar respuesta");
    const data = await res.json();
    return mapInteraccion(data);
  },
};
