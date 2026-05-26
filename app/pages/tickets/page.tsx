"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, Ticket } from "lucide-react";
import TicketDetail from "../../components/tickets/TicketDetail";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { mockTickets, mockTicketDetalle } from "../../lib/mocks/tickets.mock";
import { Ticket as TicketType } from "../../lib/types/ticket.types";

function getPrioridadLabel(prioridad: string) {
  const map: Record<string, string> = {
    Critica: "Crítica", Alta: "Alta", Media: "Media", Baja: "Baja",
  };
  return map[prioridad] ?? prioridad;
}

function getEstadoLabel(estado: string) {
  const map: Record<string, string> = {
    Abierto: "Abierto", Progreso: "En progreso", Resuelto: "Resuelto", Cerrado: "Cerrado",
  };
  return map[estado] ?? estado;
}

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  // TODO: reemplazar con estado real desde fetch
  const [isLoading] = useState(false);

  if (selectedTicket) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div
          className="flex items-center gap-4 px-6 py-3 border-b border-[#d9d9d9] bg-white"
          style={{ minHeight: "52px" }}
        >
          <button
            onClick={() => setSelectedTicket(null)}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a tickets
          </button>
          <span className="text-[#d9d9d9]">|</span>
          <span className="text-sm font-mono text-[#6b7280]">
            {mockTicketDetalle.id}
          </span>
          <span className="text-sm text-[#353535] font-medium">
            {mockTicketDetalle.asunto}
          </span>
        </div>
        <TicketDetail ticket={mockTicketDetalle} />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Tickets
          </h1>
          <p className="text-sm text-[#6b7280]">
            {mockTickets.length} tickets en total
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : mockTickets.length === 0 ? (
        <div className="border border-[#d9d9d9] rounded-xl">
          <EmptyState
            icon={Ticket}
            title="No hay tickets"
            description="Aún no se han creado tickets. Usa el botón 'Crear Ticket' para abrir el primero."
          />
        </div>
      ) : (
        <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#284b63]">
                {["ID", "Asunto", "Canal", "Prioridad", "Estado", "Agente", "Cliente", "SLA", ""].map((h) => (
                  <th key={h} className="text-left text-white text-xs font-medium px-4 py-3 tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket: TicketType) => {
                const slaStatus =
                  ticket.slaPercent >= 100 ? "critical"
                  : ticket.slaPercent >= 75 ? "warning"
                  : "ok";
                const slaColor =
                  slaStatus === "critical" ? "#ef4444"
                  : slaStatus === "warning" ? "#eab308"
                  : "#22c55e";

                return (
                  <tr
                    key={ticket.id}
                    className="border-b border-[#d9d9d9] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">
                      {ticket.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#353535] max-w-[220px]">
                      <span className="block truncate">{ticket.asunto}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b7280]">
                      {ticket.canal}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.prioridad === "Critica" ? "bg-red-500 text-white"
                        : ticket.prioridad === "Alta" ? "bg-[#353535] text-white"
                        : ticket.prioridad === "Media" ? "bg-[#d9d9d9] text-[#353535]"
                        : "border border-[#d9d9d9] text-[#6b7280]"
                      }`}>
                        {getPrioridadLabel(ticket.prioridad)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.estado === "Abierto" ? "border border-[#284b63] text-[#284b63]"
                        : ticket.estado === "Progreso" ? "bg-[#284b63] text-white"
                        : ticket.estado === "Resuelto" ? "bg-[#3c6e71] text-white"
                        : "bg-[#d9d9d9] text-[#353535]"
                      }`}>
                        {getEstadoLabel(ticket.estado)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b7280]">
                      {ticket.agente_nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b7280]">
                      {ticket.cliente_nombre}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: slaColor }} />
                        <span className="text-xs font-medium" style={{ color: slaColor }}>
                          {ticket.slaPercent >= 100 ? `${ticket.slaPercent}% — Vencido`
                          : ticket.slaPercent >= 75 ? `${ticket.slaPercent}% — En riesgo`
                          : `${ticket.slaPercent}%`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-[#6b7280] hover:text-[#3c6e71] transition-colors"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                        }}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}