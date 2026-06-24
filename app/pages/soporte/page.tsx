"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import MetricCard from "../../components/soporte/MetricCard";
import { SkeletonKpiGrid } from "../../components/ui/Skeleton";
import { reportesApi, MetricasTickets, MetricasSla } from "../../lib/api/reportes.api";

const periodOptions = [
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
];

export default function SoportePage() {
  const [period, setPeriod] = useState("7d");
  const [metricasTickets, setMetricasTickets] = useState<MetricasTickets | null>(null);
  const [metricasSla, setMetricasSla] = useState<MetricasSla | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [tickets, sla] = await Promise.all([
          reportesApi.getMetricasTickets(),
          reportesApi.getMetricasSla(),
        ]);
        setMetricasTickets(tickets);
        setMetricasSla(sla);
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
      label: "Tickets Activos",
      value: metricasTickets?.total_tickets ?? 0,
      change: -8.2,
      icon: Ticket,
    },
    {
      label: "Tiempo Prom. Resolución",
      value: metricasTickets
        ? `${metricasTickets.promedio_tiempo_resolucion_horas.toFixed(1)}h`
        : "—",
      change: -12.5,
      icon: Clock,
    },
    {
      label: "Cumplimiento SLA",
      value: metricasSla
        ? `${metricasSla.porcentaje_cumplimiento.toFixed(1)}%`
        : "—",
      change: metricasSla ? metricasSla.porcentaje_cumplimiento - 100 : 0,
      icon: CheckCircle2,
    },
    {
      label: "Tickets Vencidos",
      value: metricasTickets?.tickets_vencidos ?? 0,
      change: 0,
      icon: Shield,
    },
  ];

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Panel de Soporte
          </h1>
          <p className="text-sm text-[#6b7280]">
            Métricas en tiempo real del sistema CRM
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

      {/* Resumen SLA detallado */}
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

      {/* Detalle de estados */}
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

      {/* Banner alerta dinámica */}
      {!isLoading && metricasTickets && metricasTickets.tickets_vencidos > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-amber-900">
              {metricasTickets.tickets_vencidos} tickets han excedido su SLA
            </div>
            <div className="text-xs text-amber-700 mt-0.5">
              {metricasTickets.tickets_proximos_vencer} tickets próximos a vencer ·{" "}
              {metricasTickets.abiertos} tickets abiertos en total
            </div>
          </div>
          <TrendingUp size={18} className="text-amber-600 flex-shrink-0" />
        </div>
      )}
    </div>
  );
}