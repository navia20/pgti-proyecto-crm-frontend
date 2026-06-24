import { API_ROUTES } from "./config";
import { Ticket, TicketDetalle, CrearTicketForm } from "../types/ticket.types";

function calcularSlaPercent(fechaVencimiento: string): number {
  const ahora = new Date().getTime();
  const vencimiento = new Date(fechaVencimiento).getTime();
  const creacion = vencimiento - 24 * 60 * 60 * 1000;
  const total = vencimiento - creacion;
  const transcurrido = ahora - creacion;
  return Math.round((transcurrido / total) * 100);
}

function mapTicket(data: Record<string, unknown>): Ticket {
  return {
    id: data.id as string,
    cliente_id: data.cliente_id as number,
    agente_id: (data.agente_id as string) ?? null,
    asunto: data.asunto as string,
    estado: data.estado as Ticket["estado"],
    prioridad: data.prioridad as Ticket["prioridad"],
    canal: data.canal as Ticket["canal"],
    fecha_vencimiento_sla: data.fecha_vencimiento_sla as string,
    pedido_id_ref: (data.pedido_id_ref as string) ?? null,
    suscripcion_id_ref: (data.suscripcion_id_ref as string) ?? null,
    slaPercent: calcularSlaPercent(data.fecha_vencimiento_sla as string),
    // Sin módulo de usuarios, todos los tickets son gestionados por el sistema
    agente_nombre: "Administrador del Sistema",
    cliente_nombre: (data.cliente_nombre as string) ?? `Cliente ${data.cliente_id}`,
  };
}

export const ticketsApi = {
  getAll: async (params?: {
    skip?: number;
    take?: number;
    estado?: string;
    prioridad?: string;
    cliente_id?: number;
  }): Promise<Ticket[]> => {
    const url = new URL(API_ROUTES.tickets);
    if (params?.skip) url.searchParams.set("skip", String(params.skip));
    if (params?.take) url.searchParams.set("take", String(params.take));
    if (params?.estado) url.searchParams.set("estado", params.estado);
    if (params?.prioridad) url.searchParams.set("prioridad", params.prioridad);
    if (params?.cliente_id) url.searchParams.set("cliente_id", String(params.cliente_id));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Error al obtener tickets");
    const json = await res.json();
    const lista = Array.isArray(json) ? json : json.data ?? [];
    return lista.map(mapTicket);
  },

  getById: async (id: string): Promise<TicketDetalle> => {
    const res = await fetch(API_ROUTES.ticketById(id));
    if (!res.ok) throw new Error("Error al obtener ticket");
    const data = await res.json();
    return {
      ...mapTicket(data),
      interacciones: data.interacciones ?? [],
      articulos_kb: data.articulos ?? [],
      tags: [],
    };
  },

  crear: async (form: CrearTicketForm): Promise<Ticket> => {
    const body = {
      asunto: form.asunto,
      canal: form.canal,
      prioridad: form.prioridad,
      cliente_id: form.cliente_id,
      pedido_id_ref: form.pedido_id_ref || undefined,
      suscripcion_id_ref: form.suscripcion_id_ref || undefined,
    };
    const res = await fetch(API_ROUTES.tickets, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error al crear ticket");
    const data = await res.json();
    return mapTicket(data);
  },

  actualizar: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    const res = await fetch(API_ROUTES.ticketById(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Error al actualizar ticket");
    const data = await res.json();
    return mapTicket(data);
  },

  eliminar: async (id: string): Promise<void> => {
    const res = await fetch(API_ROUTES.ticketById(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar ticket");
  },
};