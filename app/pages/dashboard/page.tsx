"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import TicketsTable from "../../components/dashboard/TicketsTable";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonKpiGrid, SkeletonTable } from "../../components/ui/Skeleton";
import { ticketsApi } from "../../lib/api/tickets.api";
import { reportesApi, MetricasTickets } from "../../lib/api/reportes.api";
import { Ticket as TicketType } from "../../lib/types/ticket.types";
import { useRole } from "../../lib/context/RoleContext";

export default function DashboardPage() {
  const router = useRouter();
  const { esAdmin, userEmail } = useRole();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricasTickets, setMetricasTickets] = useState<MetricasTickets | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [result, metricas] = await Promise.all([
        ticketsApi.getAll({
          take: 10,
          agente_id: !esAdmin ? userEmail : undefined,
        }),
        reportesApi.getMetricasTickets(),
      ]);
      setTickets(result.data);
      setMetricasTickets(metricas);
    } catch {
      setTickets([]);
      setError("Usando datos locales — backend no disponible");
    } finally {
      setIsLoading(false);
    }
  }, [esAdmin, userEmail]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTickets();
  }, [fetchTickets]);

  const handleTicketClick = (ticket: TicketType) => {
    sessionStorage.setItem("selectedTicketId", ticket.id);
    router.push("/pages/tickets");
  };

  const urgentTickets = tickets.filter((t) => t.prioridad === "critica").length;
  const proximosVencer = metricasTickets?.tickets_proximos_vencer ?? 0;
  const vencidos = metricasTickets?.tickets_vencidos ?? 0;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Soporte Técnico
          </h1>
          <p className="text-sm text-[#6b7280]">
            {esAdmin ? "Vista operativa — tickets que requieren acción" : "Tus tickets asignados"}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <>
          <SkeletonKpiGrid />
          <SkeletonTable rows={6} />
        </>
      ) : (
        <>
          {/* KPIs compactos */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={15} className="text-[#284b63]" />
                <span className="text-xs text-[#6b7280]">Abiertos</span>
              </div>
              <div className="text-2xl font-semibold text-[#284b63]">
                {metricasTickets?.abiertos ?? tickets.filter(t => t.estado === "abierto").length}
              </div>
            </div>
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={15} className="text-red-500" />
                <span className="text-xs text-[#6b7280]">Críticos</span>
              </div>
              <div className="text-2xl font-semibold text-red-500">
                {urgentTickets}
              </div>
            </div>
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} className="text-[#353535]" />
                <span className="text-xs text-[#6b7280]">En progreso</span>
              </div>
              <div className="text-2xl font-semibold text-[#353535]">
                {metricasTickets?.en_progreso ?? tickets.filter(t => t.estado === "progreso").length}
              </div>
            </div>
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} className="text-[#3c6e71]" />
                <span className="text-xs text-[#6b7280]">Resueltos</span>
              </div>
              <div className="text-2xl font-semibold text-[#3c6e71]">
                {metricasTickets?.resueltos ?? tickets.filter(t => t.estado === "resuelto").length}
              </div>
            </div>
          </div>

          {/* Alertas */}
          {vencidos > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900">
                  {vencidos} tickets han excedido su SLA
                </div>
                <div className="text-xs text-red-700 mt-0.5">
                  {proximosVencer} tickets próximos a vencer
                </div>
              </div>
            </div>
          )}

          {proximosVencer > 0 && vencidos === 0 && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <Clock size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-900">
                  {proximosVencer} tickets próximos a vencer
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  Revisar asignaciones para evitar incumplimiento de SLA
                </div>
              </div>
            </div>
          )}

          {/* Tabla de tickets recientes */}
          {tickets.length === 0 ? (
            <div className="border border-[#d9d9d9] rounded-xl mb-8">
              <EmptyState
                icon={AlertCircle}
                title={esAdmin ? "No hay tickets" : "No tienes tickets asignados"}
                description={
                  esAdmin
                    ? "No hay tickets en el sistema."
                    : "No tienes tickets asignados actualmente."
                }
              />
            </div>
          ) : (
            <TicketsTable
              tickets={tickets}
              filter=""
              onTicketClick={handleTicketClick}
            />
          )}
        </>
      )}
    </div>
  );
}
