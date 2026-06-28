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

  getMetricasPrioridad: async () => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/prioridad`);
    if (!res.ok) throw new Error("Error al obtener métricas de prioridad");
    return res.json();
  },

  getMetricasKb: async () => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/kb`);
    if (!res.ok) throw new Error("Error al obtener métricas de KB");
    return res.json();
  },

  getMetricasInteracciones: async () => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/interacciones`);
    if (!res.ok) throw new Error("Error al obtener métricas de interacciones");
    return res.json();
  },

  getMetricasFuente: async (): Promise<MetricasFuente> => {
    const res = await fetch(`${API_ROUTES.reportes}/metricas/fuente`);
    if (!res.ok) throw new Error("Error al obtener métricas por fuente");
    return res.json();
  },
};