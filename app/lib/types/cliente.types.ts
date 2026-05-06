export type ClienteStatus = "active" | "inactive";
export type DealStage =
  | "Prospección"
  | "Calificación"
  | "Propuesta"
  | "Negociación"
  | "Cerrado";
export type ActividadType =
  | "call"
  | "email"
  | "meeting"
  | "deal"
  | "task"
  | "note";
export type TicketClienteStatus = "abierto" | "en_progreso" | "resuelto";
export type TicketClientePriority = "urgente" | "alta" | "media" | "baja";

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  lastPurchase: string;
  totalSpent: string;
  orders: number;
}

export interface DuplicateGroup {
  id: string;
  similarityScore: number;
  records: Cliente[];
}

export interface ClienteMetric {
  label: string;
  value: string;
  change?: { value: string; positive: boolean };
  context: string;
}

export interface Actividad {
  id: string;
  type: ActividadType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: string;
  stage: DealStage;
  probability: number;
  closeDate: string;
  source: string;
}

export interface TicketCliente {
  id: string;
  title: string;
  description: string;
  status: TicketClienteStatus;
  priority: TicketClientePriority;
  created: string;
  assignee: string;
}

export interface ClientePerfil {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  avatar?: string;
  status: ClienteStatus;
  customerSince: string;
}