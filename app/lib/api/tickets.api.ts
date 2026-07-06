import { API_ROUTES } from "./config";
import { Ticket, TicketDetalle, CrearTicketForm, TicketPrioridad } from "../types/ticket.types";
import { authFetch } from "../auth/KeycloakProvider";

const SLA_HOURS: Record<TicketPrioridad, number> = {
  critica: 4,
  alta: 8,
  media: 24,
  baja: 48,
};

const AGENTES_CONOCIDOS: Record<string, string> = {
  "p7.admin@ucn.cl": "Admin CRM",
  "p7.agent@ucn.cl": "Agente CRM",
};

function calcularSlaPercent(fechaVencimiento: string, prioridad: TicketPrioridad): number {
  const ahora = Date.now();
  const vencimiento = new Date(fechaVencimiento).getTime();
  const slaMs = SLA_HOURS[prioridad] * 60 * 60 * 1000;
  const creacion = vencimiento - slaMs;
  const total = vencimiento - creacion;
  const transcurrido = ahora - creacion;
  return Math.round((transcurrido / total) * 100);
}

function mapTicket(data: Record<string, unknown>): Ticket {
  const prioridad = data.prioridad as TicketPrioridad;
  return {
    id: data.id as string,
    cliente_id: data.cliente_id as number,
    agente_id: (data.agente_id as string) ?? null,
    asunto: data.asunto as string,
    estado: data.estado as Ticket["estado"],
    prioridad,
    canal: data.canal as Ticket["canal"],
    fecha_vencimiento_sla: data.fecha_vencimiento_sla as string,
    pedido_id_ref: (data.pedido_id_ref as string) ?? null,
    suscripcion_id_ref: (data.suscripcion_id_ref as string) ?? null,
    salud_ref: (data.salud_ref as string) ?? null,
    pago_id_ref: (data.pago_id_ref as string) ?? null,
    slaPercent: calcularSlaPercent(data.fecha_vencimiento_sla as string, prioridad),
    agente_nombre: data.agente_id ? (AGENTES_CONOCIDOS[data.agente_id as string] ?? "Agente") : "Sin asignar",
    cliente_nombre: (data.cliente_nombre as string) ?? `Cliente ${data.cliente_id}`,
    descripcion: (data.descripcion as string) ?? undefined,
    resolucion: (data.resolucion as string) ?? undefined,
  };
}

export const ticketsApi = {
  getAll: async (params?: {
    skip?: number;
    take?: number;
    estado?: string;
    prioridad?: string;
    cliente_id?: number;
    canal?: string;
    search?: string;
    referencia?: string;
    agente_id?: string;
    ordenar?: string;
    direccion?: string;
  }): Promise<{ data: Ticket[]; total: number }> => {
    const url = new URL(API_ROUTES.tickets);
    if (params?.skip) url.searchParams.set("skip", String(params.skip));
    if (params?.take) url.searchParams.set("take", String(params.take));
    if (params?.estado) url.searchParams.set("estado", params.estado);
    if (params?.prioridad) url.searchParams.set("prioridad", params.prioridad);
    if (params?.cliente_id) url.searchParams.set("cliente_id", String(params.cliente_id));
    if (params?.canal) url.searchParams.set("canal", params.canal);
    if (params?.search) url.searchParams.set("search", params.search);
    if (params?.referencia) url.searchParams.set("referencia", params.referencia);
    if (params?.agente_id) url.searchParams.set("agente_id", params.agente_id);
    if (params?.ordenar) url.searchParams.set("ordenar", params.ordenar);
    if (params?.direccion) url.searchParams.set("direccion", params.direccion);

    const res = await authFetch(url.toString());
    if (!res.ok) throw new Error("Error al obtener tickets");
    const json = await res.json();
    const lista = Array.isArray(json) ? json : json.data ?? [];
    return {
      data: lista.map(mapTicket),
      total: json.total ?? lista.length,
    };
  },

  getById: async (id: string): Promise<TicketDetalle> => {
    const res = await authFetch(API_ROUTES.ticketById(id));
    if (!res.ok) throw new Error("Error al obtener ticket");
    const data = await res.json();
    return {
      ...mapTicket(data),
      interacciones: data.interacciones ?? [],
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
      pago_id_ref: form.pago_id_ref || undefined,
      salud_ref: form.salud_ref || undefined,
      descripcion: form.descripcion || undefined,
    };
    const res = await authFetch(API_ROUTES.tickets, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error al crear ticket");
    const data = await res.json();
    return mapTicket(data);
  },

  actualizar: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    const res = await authFetch(API_ROUTES.ticketById(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Error al actualizar ticket (${res.status}): ${body}`);
    }
    const data = await res.json();
    return mapTicket(data);
  },

  eliminar: async (id: string): Promise<void> => {
    const res = await authFetch(API_ROUTES.ticketById(id), {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar ticket");
  },
};
