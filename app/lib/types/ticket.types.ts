export type TicketEstado = "abierto" | "progreso" | "resuelto" | "cerrado";
export type TicketPrioridad = "baja" | "media" | "alta" | "critica";
export type TicketCanal = "chat" | "email" | "telefono" | "app";
export type AutorTipo = "cliente" | "agente" | "sistema";
export type SlaStatus = "ok" | "warning" | "critical";

export interface Ticket {
  id: string;
  cliente_id: number;
  agente_id: string | null;
  asunto: string;
  estado: TicketEstado;
  prioridad: TicketPrioridad;
  canal: TicketCanal;
  fecha_vencimiento_sla: string;
  pedido_id_ref: string | null;
  suscripcion_id_ref: string | null;
  salud_ref: string | null;
  slaPercent: number;
  agente_nombre: string;
  cliente_nombre: string;
}

export interface Interaccion {
  id: string;
  ticket_id: string;
  autor_tipo: AutorTipo;
  autor_id: string;
  contenido: string;
  es_nota_interna: boolean;
  creado_en: string;
  autor_nombre: string;
  autor_iniciales: string;
}

export interface ArticuloKB {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
}

export interface TicketArticulo {
  id: string;
  ticket_id: string;
  articulo_id: string;
  fue_enviado_al_cliente: boolean;
  agente_id: string;
  vinculado_en: string;
  articulo?: ArticuloKB;
}

export interface TicketDetalle extends Ticket {
  interacciones: Interaccion[];
}

export interface WeeklyChartData {
  day: string;
  tickets: number;
}

export interface CrearTicketForm {
  cliente_id: number | null;
  asunto: string;
  prioridad: TicketPrioridad;
  canal: TicketCanal;
  descripcion: string;
  pedido_id_ref: string;
  suscripcion_id_ref: string;
}

// Aliases para compatibilidad
export type TicketActivity = {
  id: number;
  type: "status_change" | "assignment" | "priority_change" | "tag_added";
  user: string;
  timestamp: string;
  from?: string;
  to?: string;
  assignee?: string;
  tag?: string;
};

export type TicketDetail = TicketDetalle;