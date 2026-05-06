export interface TicketTrendData {
  fecha: string;
  abiertos: number;
  cerrados: number;
  resueltos: number;
}

export interface PriorityData {
  nombre: string;
  valor: number;
  color: string;
}

export interface CategoryData {
  categoria: string;
  tickets: number;
}

export interface AgentData {
  agente: string;
  tickets: number;
  promedio: string;
  satisfaccion: number;
}

export const mockTicketTrend: TicketTrendData[] = [
  { fecha: "Sem 1", abiertos: 142, cerrados: 128, resueltos: 135 },
  { fecha: "Sem 2", abiertos: 156, cerrados: 145, resueltos: 149 },
  { fecha: "Sem 3", abiertos: 138, cerrados: 152, resueltos: 158 },
  { fecha: "Sem 4", abiertos: 165, cerrados: 148, resueltos: 142 },
  { fecha: "Sem 5", abiertos: 148, cerrados: 168, resueltos: 171 },
  { fecha: "Sem 6", abiertos: 152, cerrados: 159, resueltos: 164 },
];

export const mockPriorityData: PriorityData[] = [
  { nombre: "Crítica", valor: 23, color: "#ef4444" },
  { nombre: "Alta", valor: 67, color: "#f97316" },
  { nombre: "Media", valor: 142, color: "#eab308" },
  { nombre: "Baja", valor: 98, color: "#22c55e" },
];

export const mockCategoryData: CategoryData[] = [
  { categoria: "Técnico", tickets: 145 },
  { categoria: "Cuenta", tickets: 89 },
  { categoria: "Facturación", tickets: 67 },
  { categoria: "Producto", tickets: 54 },
  { categoria: "Otros", tickets: 45 },
];

export const mockAgentData: AgentData[] = [
  { agente: "Ana García", tickets: 87, promedio: "2.1h", satisfaccion: 4.8 },
  { agente: "Carlos Ruiz", tickets: 82, promedio: "2.4h", satisfaccion: 4.7 },
  { agente: "Laura Díaz", tickets: 78, promedio: "1.9h", satisfaccion: 4.9 },
  { agente: "Miguel Torres", tickets: 75, promedio: "2.6h", satisfaccion: 4.6 },
  { agente: "Sofia López", tickets: 68, promedio: "2.2h", satisfaccion: 4.8 },
];