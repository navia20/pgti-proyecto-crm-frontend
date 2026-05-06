"use client";

import { useState } from "react";
import { Filter, Search, Plus } from "lucide-react";
import KpiCard from "@/app/components/dashboard/Kpicard";
import TicketsTable from "@/app/components/dashboard/TicketsTable";
import WeeklyChart from "@/app/components/dashboard/WeeklyChart";
import { mockTickets, mockWeeklyChart } from "@/app/lib/mocks/tickets.mock";

const filterOptions = [
  { value: "all", label: "Todos los tickets" },
  { value: "open", label: "Abiertos" },
  { value: "in-progress", label: "En progreso" },
  { value: "urgent", label: "Urgentes" },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState("all");

  const openTickets = mockTickets.filter((t) => t.status === "open").length;
  const urgentTickets = mockTickets.filter((t) => t.priority === "urgent").length;
  const inProgressTickets = mockTickets.filter((t) => t.status === "in-progress").length;
  const resolvedToday = mockTickets.filter((t) => t.status === "resolved").length;

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
          {/* Filtro */}
          <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white">
            <Filter size={14} className="text-[#6b7280]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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

          {/* Crear ticket */}
          <button className="flex items-center gap-2 bg-[#3c6e71] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors">
            <Plus size={16} />
            Crear Ticket
          </button>
        </div>
      </div>

      {/* KPIs */}
      <KpiCard
        openTickets={openTickets}
        urgentTickets={urgentTickets}
        inProgressTickets={inProgressTickets}
        resolvedToday={resolvedToday}
      />

      {/* Tabla */}
      <TicketsTable tickets={mockTickets} filter={filter} />

      {/* Gráfico */}
      <WeeklyChart data={mockWeeklyChart} />
    </div>
  );
}