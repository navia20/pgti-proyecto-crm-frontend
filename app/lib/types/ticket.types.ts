// ============================================
// ENUMS — alineados al MER
// ============================================
export type TicketEstado = "Abierto" | "Progreso" | "Resuelto" | "Cerrado";
export type TicketPrioridad = "Baja" | "Media" | "Alta" | "Critica";
export type TicketCanal = "Chat" | "Email" | "Telefono" | "App";
export type AutorTipo = "Cliente" | "Agente" | "Sistema";
export type SlaStatus = "ok" | "warning" | "critical";

// ============================================
// ENTIDADES PRINCIPALES — según MER
// ============================================

export interface Ticket {
  id: string;                          // UUID
  cliente_id: number;
  agente_id: string | null;            // UUID, nullable si sin asignar
  asunto: string;
  estado: TicketEstado;
  prioridad: TicketPrioridad;
  canal: TicketCanal;
  fecha_vencimiento_sla: string;       // Timestamp ISO
  pedido_id_ref: string | null;        // Ref externa nullable
  suscripcion_id_ref: string | null;   // Ref externa nullable
  // Campos calculados para UI
  slaPercent: number;
  agente_nombre: string;               // Join para mostrar en tabla
  cliente_nombre: string;              // Join para mostrar en tabla
}

export interface Interaccion {
  id: string;                          // UUID
  ticket_id: string;
  autor_tipo: AutorTipo;
  autor_id: string;                    // UUID
  contenido: string;
  es_nota_interna: boolean;
  creado_en: string;                   // Timestamp ISO
  // Campos calculados para UI
  autor_nombre: string;
  autor_iniciales: string;
}

export interface ArticuloKB {
  id: string;                          // UUID
  titulo: string;
  contenido: string;
  categoria: string;
}

export interface TicketArticulo {
  id: string;                          // UUID
  ticket_id: string;
  articulo_id: string;
  fue_enviado_al_cliente: boolean;
  agente_id: string;
  vinculado_en: string;                // Timestamp ISO
  // Campo calculado para UI
  articulo?: ArticuloKB;
}

// ============================================
// VISTA DETALLE — agrupación para UI
// ============================================
export interface TicketDetalle extends Ticket {
  interacciones: Interaccion[];
  articulos_kb: TicketArticulo[];
  tags: string[];
}

// ============================================
// CHART DATA
// ============================================
export interface WeeklyChartData {
  day: string;
  tickets: number;
}

// ============================================
// FORMULARIO CREAR TICKET
// ============================================
export interface CrearTicketForm {
  cliente_id: number | null;
  asunto: string;
  prioridad: TicketPrioridad;
  canal: TicketCanal;
  descripcion: string;
  pedido_id_ref: string;
  suscripcion_id_ref: string;
}

// Aliases para compatibilidad con componentes existentes
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