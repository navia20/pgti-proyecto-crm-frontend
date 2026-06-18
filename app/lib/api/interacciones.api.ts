import { API_ROUTES } from "./config";
import { Interaccion } from "../types/ticket.types";

function mapInteraccion(data: Record<string, unknown>): Interaccion {
  const autorNombre = (data.autor_nombre as string) ?? 
    data.autor_tipo === "cliente" ? "Cliente" 
    : data.autor_tipo === "agente" ? "Agente" 
    : "Sistema";
    
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

export const interaccionesApi = {
  getByTicket: async (ticketId: string): Promise<Interaccion[]> => {
    const res = await fetch(API_ROUTES.interaccionesByTicket(ticketId));
    if (!res.ok) throw new Error("Error al obtener interacciones");
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapInteraccion) : [];
  },

  crear: async (payload: {
    ticket_id: string;
    autor_tipo: string;
    autor_id: string;
    contenido: string;
    es_nota_interna: boolean;
  }): Promise<Interaccion> => {
    const res = await fetch(API_ROUTES.interacciones, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear interacción");
    const data = await res.json();
    return mapInteraccion(data);
  },
};