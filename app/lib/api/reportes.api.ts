import { API_ROUTES } from "./config";

export interface MetricasTickets {
  total_tickets: number;
  abiertos: number;
  en_progreso: number;
  resueltos: number;
  cerrados: number;
  promedio_tiempo_resolucion_horas: number;
  tickets_vencidos: number;
  tickets_proximos_vencer: number;
}

export interface MetricasSla {
  total_tickets_con_sla: number;
  ok: number;
  warning: number;
  critical: number;
  porcentaje_cumplimiento: number;
}

export interface MetricasFuente {
  pedidos: number;
  suscripciones: number;
  pagos: number;
  salud: number;
  interno: number;
  total: number;
}

export interface TrendData {
  fecha: string;
  abiertos: number;
  cerrados: number;
  resueltos: number;
}

export interface MetricasPrioridad {
  critica: number;
  alta: number;
  media: number;
  baja: number;
}

export interface MetricasInteraccionesTipo {
  total: number;
  por_tipo: { cliente: number; agente: number; sistema: number };
  notas_internas: number;
}

export const reportesApi = {
  getMetricasTickets: async (): Promise<MetricasTickets> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/tickets`);
    if (!res.ok) throw new Error("Error al obtener métricas de tickets");
    return res.json();
  },

  getMetricasSla: async (): Promise<MetricasSla> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/sla`);
    if (!res.ok) throw new Error("Error al obtener métricas de SLA");
    return res.json();
  },

  getMetricasPrioridad: async (): Promise<MetricasPrioridad> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/prioridad`);
    if (!res.ok) throw new Error("Error al obtener métricas de prioridad");
    return res.json();
  },

  getMetricasFuente: async (): Promise<MetricasFuente> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/fuente`);
    if (!res.ok) throw new Error("Error al obtener métricas por fuente");
    return res.json();
  },

  getTendencia: async (dias: number = 7): Promise<TrendData[]> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/tendencia?dias=${dias}`);
    if (!res.ok) throw new Error("Error al obtener tendencia");
    return res.json();
  },

  getMetricasInteraccionesTipo: async (): Promise<MetricasInteraccionesTipo> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/interacciones-tipo`);
    if (!res.ok) throw new Error("Error al obtener métricas de interacciones");
    return res.json();
  },
};
