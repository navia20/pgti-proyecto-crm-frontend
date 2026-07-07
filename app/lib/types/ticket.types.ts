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
  pago_id_ref: string | null;
  salud_ref: string | null;
  slaPercent: number;
  agente_nombre: string;
  cliente_nombre: string;
  descripcion?: string;
  resolucion?: string;
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
  resolucion?: string;
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
  pago_id_ref: string;
  salud_ref: string;
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

export interface SaludPaciente {
  id: string;
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  sexo: string;
  direccion: string;
}

export interface SaludVisita {
  id: string;
  fechaProgramada: string;
  horaProgramada: string;
  estado: string;
  duracionEstimadaMin: number;
  checkInAt: string | null;
  checkOutAt: string | null;
  prioridad: string;
}

export interface SaludProfesional {
  id: string;
  profesion: string;
  numeroRegistro: string;
  nombres: string;
  apellidos: string;
  email: string;
}

export interface SaludIncidente {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  severidad: string;
  tipo: string;
  origen: string;
  createdAt: string;
  pacienteId: string;
  paciente: SaludPaciente;
  visitaId: string | null;
  visita: SaludVisita | null;
  profesionalSaludId: string | null;
  profesionalSalud: SaludProfesional | null;
}

export interface PedidoCliente {
  nombre: string;
  email: string;
  telefono: string;
}

export interface PedidoDireccion {
  calle: string;
  numero: number;
  ciudad: string;
  region: string;
  pais: string;
  codigo_postal: string;
}

export interface PedidoItem {
  sku: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
}

export interface PedidoOrden {
  id: string;
  id_canal: string;
  estado: string;
  prioridad: string;
  subtotal: number;
  impuestos: number;
  total: number;
  fecha_creacion: string;
  cliente: PedidoCliente;
  direccion_envio: PedidoDireccion;
  items: PedidoItem[];
}