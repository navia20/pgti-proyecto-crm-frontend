// ============================================
// ENTIDAD PRINCIPAL — según MER
// ============================================
export interface Cliente {
  id: number;                          // PK
  identidad_id: string;                // UUID externo (Proyecto 12)
  nombre_completo: string;
  email: string;                       // Unique
  telefono: string;
  fecha_nacimiento: string;            // Date ISO
  creado_en: string;                   // Timestamp ISO
}

// ============================================
// DUPLICADOS — basado en Cliente
// ============================================
export interface DuplicateGroup {
  id: string;
  similarityScore: number;
  records: ClienteDuplicado[];
}

export interface ClienteDuplicado extends Cliente {
  nombre_completo: string;
  name?: string;                // alias para UI
  lastPurchase?: string;
  totalSpent?: string;
  orders?: number;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
}
// ============================================
// PERFIL UNIFICADO — datos base CRM
// ============================================
export interface ClientePerfil {
  id: number;
  identidad_id: string;
  nombre_completo: string;
  name?: string;                // alias para compatibilidad UI
  email: string;
  telefono: string;
  phone?: string;               // alias para compatibilidad UI
  fecha_nacimiento: string;
  creado_en: string;
  empresa?: string;
  company?: string;             // alias para compatibilidad UI
  ubicacion?: string;
  location?: string;            // alias para compatibilidad UI
  estado: ClienteEstado;
  status?: ClienteEstado;       // alias para compatibilidad UI
  customerSince?: string;       // fecha legible para UI
}

export type ClienteEstado = "active" | "inactive";

// ============================================
// SALUD DEL CLIENTE — desde Proyecto 1
// ============================================
export type SaludNivel = "verde" | "amarillo" | "rojo";

export interface ClienteSalud {
  cliente_id: number;
  nivel: SaludNivel;
  descripcion: string;
  actualizado_en: string;
}

// ============================================
// MÉTRICAS DEL PERFIL
// ============================================
export interface ClienteMetric {
  label: string;
  value: string;
  change?: { value: string; positive: boolean };
  context: string;
}

// ============================================
// ACTIVIDAD — timeline del perfil
// ============================================
export type ActividadType =
  | "call"
  | "email"
  | "meeting"
  | "deal"
  | "task"
  | "note";

export interface Actividad {
  id: string;
  type: ActividadType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: string;
}

// ============================================
// DEALS — pipeline de ventas
// ============================================
export type DealStage =
  | "Prospección"
  | "Calificación"
  | "Propuesta"
  | "Negociación"
  | "Cerrado";

export interface Deal {
  id: string;
  title: string;
  value: string;
  stage: DealStage;
  probability: number;
  closeDate: string;
  source: string;
}

// ============================================
// TICKETS DEL CLIENTE — vista resumida
// ============================================
export type TicketClienteStatus = "abierto" | "en_progreso" | "resuelto";
export type TicketClientePriority = "urgente" | "alta" | "media" | "baja";

export interface TicketCliente {
  id: string;
  title: string;
  description: string;
  status: TicketClienteStatus;
  priority: TicketClientePriority;
  created: string;
  assignee: string;
}

// ============================================
// PEDIDOS — desde Proyecto 3 (mock)
// ============================================
export interface PedidoResumen {
  pedido_id: string;
  descripcion: string;
  estado: string;
  fecha: string;
  total: string;
}

// ============================================
// SUSCRIPCIONES — desde Proyecto 10 (mock)
// ============================================
export interface SuscripcionResumen {
  suscripcion_id: string;
  plan: string;
  ciclo: string;
  estado: string;
  renovacion: string;
}