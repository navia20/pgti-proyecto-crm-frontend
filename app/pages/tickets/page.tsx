"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import TicketDetail from "../../components/tickets/TicketDetail";
import { mockTickets, mockTicketDetail } from "../../lib/mocks/tickets.mock";
import { Ticket } from "../../lib/types/ticket.types";

function getPriorityLabel(priority: string) {
  const map: Record<string, string> = {
    urgent: "Urgente", high: "Alta", medium: "Media", low: "Baja",
  };
  return map[priority] ?? priority;
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    open: "Abierto", "in-progress": "En progreso", resolved: "Resuelto",
  };
  return map[status] ?? status;
}

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (selectedTicket) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header detalle */}
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
            {mockTicketDetail.id}
          </span>
          <span className="text-sm text-[#353535] font-medium">
            {mockTicketDetail.title}
          </span>
        </div>

        {/* Detalle */}
        <TicketDetail ticket={mockTicketDetail} />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Tickets
          </h1>
          <p className="text-sm text-[#6b7280]">
            {mockTickets.length} tickets en total
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#3c6e71] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors">
          + Crear Ticket
        </button>
      </div>

      {/* Tabla */}
      <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#284b63]">
              {["ID", "Título", "Prioridad", "Estado", "Agente", "Categoría", "SLA", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-white text-xs font-medium px-4 py-3 tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {mockTickets.map((ticket: Ticket) => {
              const slaStatus =
                ticket.slaPercent >= 100
                  ? "critical"
                  : ticket.slaPercent >= 75
                  ? "warning"
                  : "ok";
              const slaColor =
                slaStatus === "critical"
                  ? "#ef4444"
                  : slaStatus === "warning"
                  ? "#eab308"
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
                  <td className="px-4 py-3 text-sm text-[#353535] max-w-[260px]">
                    <span className="block truncate">{ticket.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.priority === "urgent"
                          ? "bg-red-500 text-white"
                          : ticket.priority === "high"
                          ? "bg-[#353535] text-white"
                          : ticket.priority === "medium"
                          ? "bg-[#d9d9d9] text-[#353535]"
                          : "border border-[#d9d9d9] text-[#6b7280]"
                      }`}
                    >
                      {getPriorityLabel(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === "open"
                          ? "border border-[#284b63] text-[#284b63]"
                          : ticket.status === "in-progress"
                          ? "bg-[#284b63] text-white"
                          : "bg-[#3c6e71] text-white"
                      }`}
                    >
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {ticket.agent}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {ticket.category}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: slaColor }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: slaColor }}
                      >
                        {ticket.slaPercent >= 100
                          ? `${ticket.slaPercent}% — Vencido`
                          : ticket.slaPercent >= 75
                          ? `${ticket.slaPercent}% — En riesgo`
                          : `${ticket.slaPercent}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-[#6b7280] hover:text-[#3c6e71] transition-colors"
                      onClick={(e) => {
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
    </div>
  );
}