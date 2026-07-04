"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  MessageSquare,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react";
import MetricCard from "../../components/soporte/MetricCard";
import SourceChart from "../../components/soporte/SourceChart";
import TrendChart from "../../components/soporte/TrendChart";
import PriorityChart from "../../components/soporte/PriorityChart";
import { SkeletonKpiGrid } from "../../components/ui/Skeleton";
import {
  reportesApi,
  MetricasTickets,
  MetricasSla,
  MetricasFuente,
  TrendData,
  MetricasPrioridad,
  MetricasInteraccionesTipo,
} from "../../lib/api/reportes.api";

const periodOptions = [
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
];

const PRIORITY_COLORS: Record<string, string> = {
  critica: "#ef4444",
  alta: "#f97316",
  media: "#eab308",
  baja: "#22c55e",
};

const PRIORITY_LABELS: Record<string, string> = {
  critica: "Crítica",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export default function SoportePage() {
  const [period, setPeriod] = useState("7d");
  const [metricasTickets, setMetricasTickets] = useState<MetricasTickets | null>(null);
  const [metricasSla, setMetricasSla] = useState<MetricasSla | null>(null);
  const [metricasFuente, setMetricasFuente] = useState<MetricasFuente | null>(null);
  const [tendencia, setTendencia] = useState<TrendData[]>([]);
  const [prioridad, setPrioridad] = useState<MetricasPrioridad | null>(null);
  const [interacciones, setInteracciones] = useState<MetricasInteraccionesTipo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [tickets, sla, fuente, tend, prio, ints] = await Promise.all([
          reportesApi.getMetricasTickets(),
          reportesApi.getMetricasSla(),
          reportesApi.getMetricasFuente(),
          reportesApi.getTendencia(7),
          reportesApi.getMetricasPrioridad(),
          reportesApi.getMetricasInteraccionesTipo(),
        ]);
        setMetricasTickets(tickets);
        setMetricasSla(sla);
        setMetricasFuente(fuente);
        setTendencia(tend);
        setPrioridad(prio);
        setInteracciones(ints);
      } catch {
        setError("Usando datos de ejemplo — backend no disponible");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetricas();
  }, [period]);

  const kpis = [
    {
      label: "Tickets Totales",
      value: metricasTickets?.total_tickets ?? 0,
      change: 0,
      icon: Ticket,
    },
    {
      label: "Tiempo Prom. Resolución",
      value: metricasTickets
        ? `${metricasTickets.promedio_tiempo_resolucion_horas.toFixed(1)}h`
        : "—",
      change: 0,
      icon: Clock,
    },
    {
      label: "Cumplimiento SLA",
      value: metricasSla
        ? `${metricasSla.porcentaje_cumplimiento.toFixed(1)}%`
        : "—",
      change: 0,
      icon: CheckCircle2,
    },
    {
      label: "Total Mensajes",
      value: interacciones?.total ?? 0,
      change: 0,
      icon: MessageSquare,
    },
  ];

  const priorityData = prioridad
    ? Object.entries(prioridad).map(([key, valor]) => ({
        nombre: PRIORITY_LABELS[key] ?? key,
        valor,
        color: PRIORITY_COLORS[key] ?? "#6b7280",
      }))
    : [];

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Panel de Soporte
          </h1>
          <p className="text-sm text-[#6b7280]">
            Métricas y análisis del sistema CRM
          </p>
        </div>

        <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-[#353535] bg-transparent outline-none cursor-pointer"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      {/* KPIs */}
      {isLoading ? (
        <SkeletonKpiGrid />
      ) : (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <MetricCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
            />
          ))}
        </div>
      )}

      {/* SLA detallado */}
      {!isLoading && metricasSla && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-sm text-[#6b7280]">SLA OK</span>
            </div>
            <div className="text-3xl font-semibold text-[#353535]">
              {metricasSla.ok}
            </div>
            <div className="text-xs text-[#9ca3af] mt-1">
              tickets dentro del tiempo
            </div>
          </div>

          <div className="bg-white border border-[#d9d9d9] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
              <span className="text-sm text-[#6b7280]">SLA En riesgo</span>
            </div>
            <div className="text-3xl font-semibold text-[#353535]">
              {metricasSla.warning}
            </div>
            <div className="text-xs text-[#9ca3af] mt-1">
              tickets próximos a vencer
            </div>
          </div>

          <div className="bg-white border border-[#d9d9d9] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-sm text-[#6b7280]">SLA Vencido</span>
            </div>
            <div className="text-3xl font-semibold text-[#353535]">
              {metricasSla.critical}
            </div>
            <div className="text-xs text-[#9ca3af] mt-1">
              tickets que excedieron el SLA
            </div>
          </div>
        </div>
      )}

      {/* Gráficos - Fila 1: Tendencia + Prioridad */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <TrendChart data={tendencia} />
        </div>
        <div>
          {priorityData.length > 0 && (
            <PriorityChart data={priorityData} />
          )}
        </div>
      </div>

      {/* Fila 2: Fuentes + Métricas de interacciones */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          {!isLoading && metricasFuente && (
            <SourceChart data={metricasFuente} />
          )}
        </div>
        <div className="col-span-2">
          {/* Métricas de interacciones */}
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-[#284b63]" />
              <span className="text-sm font-semibold text-[#353535]">
                Actividad de Mensajes
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-[#353535]">
                  {interacciones?.total ?? 0}
                </div>
                <div className="text-xs text-[#6b7280] mt-1">Total</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-[#3c6e71]">
                  {interacciones?.por_tipo.cliente ?? 0}
                </div>
                <div className="text-xs text-[#6b7280] mt-1">
                  <Users size={10} className="inline mr-1" />
                  Clientes
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-[#284b63]">
                  {interacciones?.por_tipo.agente ?? 0}
                </div>
                <div className="text-xs text-[#6b7280] mt-1">
                  <Users size={10} className="inline mr-1" />
                  Agentes
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-[#6b7280]">
                  {interacciones?.por_tipo.sistema ?? 0}
                </div>
                <div className="text-xs text-[#6b7280] mt-1">
                  <FileText size={10} className="inline mr-1" />
                  Sistema
                </div>
              </div>
            </div>

            {interacciones && interacciones.notas_internas > 0 && (
              <div className="mt-3 pt-3 border-t border-[#d9d9d9] flex items-center gap-2">
                <span className="text-xs text-[#6b7280]">
                  {interacciones.notas_internas} notas internas
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de estados */}
      {!isLoading && metricasTickets && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
            <div className="text-xs text-[#6b7280] mb-1">Abiertos</div>
            <div className="text-2xl font-semibold text-[#284b63]">
              {metricasTickets.abiertos}
            </div>
          </div>
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
            <div className="text-xs text-[#6b7280] mb-1">En Progreso</div>
            <div className="text-2xl font-semibold text-[#353535]">
              {metricasTickets.en_progreso}
            </div>
          </div>
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
            <div className="text-xs text-[#6b7280] mb-1">Resueltos</div>
            <div className="text-2xl font-semibold text-[#3c6e71]">
              {metricasTickets.resueltos}
            </div>
          </div>
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
            <div className="text-xs text-[#6b7280] mb-1">Cerrados</div>
            <div className="text-2xl font-semibold text-[#6b7280]">
              {metricasTickets.cerrados}
            </div>
          </div>
        </div>
      )}

      {/* Alerta SLA */}
      {!isLoading && metricasTickets && metricasTickets.tickets_vencidos > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-red-900">
              {metricasTickets.tickets_vencidos} tickets han excedido su SLA
            </div>
            <div className="text-xs text-red-700 mt-0.5">
              {metricasTickets.tickets_proximos_vencer} tickets próximos a vencer ·{" "}
              {metricasTickets.abiertos} tickets abiertos en total
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
