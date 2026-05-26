"use client";

import React, { useState } from "react";
import { Filter, Search, User, LayoutGrid, Ticket } from "lucide-react";
import KpiCard from "../../components/dashboard/Kpicard";
import TicketsTable from "../../components/dashboard/TicketsTable";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonKpiGrid, SkeletonTable } from "../../components/ui/Skeleton";
import { mockTickets, mockWeeklyChart } from "../../lib/mocks/tickets.mock";
import { Ticket as TicketType } from "../../lib/types/ticket.types";

const AGENTE_ACTUAL = "agt-001";

const filterOptions = [
  { value: "all", label: "Todos los tickets" },
  { value: "Abierto", label: "Abiertos" },
  { value: "Progreso", label: "En progreso" },
  { value: "Resuelto", label: "Resueltos" },
  { value: "Critica", label: "Críticos" },
  { value: "Chat", label: "Canal: Chat" },
  { value: "Email", label: "Canal: Email" },
  { value: "Telefono", label: "Canal: Teléfono" },
  { value: "App", label: "Canal: App" },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState("all");
  const [vistaPropia, setVistaPropia] = useState(false);
  // TODO: reemplazar con estado real desde fetch
  const [isLoading] = useState(false);

  const ticketsFiltradosPorVista = vistaPropia
    ? mockTickets.filter((t: TicketType) => t.agente_id === AGENTE_ACTUAL)
    : mockTickets;

  const openTickets = ticketsFiltradosPorVista.filter((t: TicketType) => t.estado === "Abierto").length;
  const urgentTickets = ticketsFiltradosPorVista.filter((t: TicketType) => t.prioridad === "Critica").length;
  const inProgressTickets = ticketsFiltradosPorVista.filter((t: TicketType) => t.estado === "Progreso").length;
  const resolvedToday = ticketsFiltradosPorVista.filter((t: TicketType) => t.estado === "Resuelto").length;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Soporte Técnico
          </h1>
          <p className="text-sm text-[#6b7280]">
            Dashboard operativo en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle vista */}
          <div className="flex items-center border border-[#d9d9d9] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setVistaPropia(false)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                !vistaPropia ? "bg-[#284b63] text-white" : "text-[#6b7280] hover:text-[#353535]"
              }`}
            >
              <LayoutGrid size={13} />
              Todos
            </button>
            <button
              onClick={() => setVistaPropia(true)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                vistaPropia ? "bg-[#284b63] text-white" : "text-[#6b7280] hover:text-[#353535]"
              }`}
            >
              <User size={13} />
              Mis tickets
            </button>
          </div>

          {/* Filtro */}
          <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white">
            <Filter size={14} className="text-[#6b7280]" />
            <select
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
              className="text-sm text-[#353535] bg-transparent outline-none cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buscar */}
          <button className="border border-[#d9d9d9] rounded-lg p-2 bg-white hover:border-[#3c6e71] transition-colors">
            <Search size={16} className="text-[#6b7280]" />
          </button>
        </div>
      </div>

      {/* Indicador vista propia */}
      {vistaPropia && (
        <div className="flex items-center gap-2 mb-4 text-sm text-[#284b63] bg-[#f0f7f7] border border-[#3c6e71] rounded-lg px-3 py-2 w-fit">
          <User size={14} />
          Mostrando solo tus tickets asignados
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <>
          <SkeletonKpiGrid />
          <SkeletonTable rows={6} />
        </>
      ) : (
        <>
          <KpiCard
            openTickets={openTickets}
            urgentTickets={urgentTickets}
            inProgressTickets={inProgressTickets}
            resolvedToday={resolvedToday}
          />

          {ticketsFiltradosPorVista.length === 0 ? (
            <div className="border border-[#d9d9d9] rounded-xl mb-8">
              <EmptyState
                icon={Ticket}
                title={vistaPropia ? "No tienes tickets asignados" : "No hay tickets"}
                description={
                  vistaPropia
                    ? "No tienes tickets asignados actualmente. Los tickets que se te asignen aparecerán aquí."
                    : "No hay tickets que coincidan con los filtros seleccionados."
                }
                actionLabel={vistaPropia ? undefined : "Limpiar filtros"}
                onAction={vistaPropia ? undefined : () => setFilter("all")}
              />
            </div>
          ) : (
            <TicketsTable tickets={ticketsFiltradosPorVista} filter={filter} />
          )}

          <WeeklyChart data={mockWeeklyChart} />
        </>
      )}
    </div>
  );
}