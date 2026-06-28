"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, Ticket } from "lucide-react";
import TicketDetail from "../../components/tickets/TicketDetail";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { mockTickets, mockTicketDetalle } from "../../lib/mocks/tickets.mock";
import { ticketsApi } from "../../lib/api/tickets.api";
import { interaccionesApi } from "../../lib/api/interacciones.api";
import { Ticket as TicketType, TicketDetalle } from "../../lib/types/ticket.types";

const esAdmin = true; // TODO: reemplazar con auth real

function getPrioridadLabel(prioridad: string) {
  const map: Record<string, string> = {
    critica: "Crítica", alta: "Alta", media: "Media", baja: "Baja",
  };
  return map[prioridad] ?? prioridad;
}

function getEstadoLabel(estado: string) {
  const map: Record<string, string> = {
    abierto: "Abierto",
    progreso: "En progreso",
    resuelto: "Resuelto",
    cerrado: "Cerrado",
  };
  return map[estado] ?? estado;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketDetalle, setTicketDetalle] = useState<TicketDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarCerrados, setMostrarCerrados] = useState(false);

const handleSelectTicket = async (ticket: TicketType) => {
    if (ticket.estado === "cerrado" && !esAdmin) return;
    setSelectedTicket(ticket);
    setIsLoadingDetalle(true);
    try {
      const [detalle, interacciones] = await Promise.all([
        ticketsApi.getById(ticket.id),
        interaccionesApi.getByTicket(ticket.id),
      ]);
      setTicketDetalle({ ...detalle, interacciones });
    } catch {
      setTicketDetalle(mockTicketDetalle);
    } finally {
      setIsLoadingDetalle(false);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const data = await ticketsApi.getAll({ take: 50 });
        setTickets(data.length > 0 ? data : mockTickets);

        const selectedId = sessionStorage.getItem("selectedTicketId");
        if (selectedId) {
          sessionStorage.removeItem("selectedTicketId");
          const ticket = data.find((t) => t.id === selectedId);
          if (ticket) {
            handleSelectTicket(ticket);
          }
        }
      } catch {
        setTickets(mockTickets);
        setError("Usando datos locales — backend no disponible");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchTickets();
  }, []);

  const ticketsFiltrados = mostrarCerrados
    ? tickets
    : tickets.filter((t) => t.estado !== "cerrado");

  if (selectedTicket) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div
          className="flex items-center gap-4 px-6 py-3 border-b border-[#d9d9d9] bg-white"
          style={{ minHeight: "52px" }}
        >
          <button
            onClick={() => { setSelectedTicket(null); setTicketDetalle(null); }}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a tickets
          </button>
          <span className="text-[#d9d9d9]">|</span>
          <span className="text-sm font-mono text-[#6b7280]">
            {selectedTicket.id}
          </span>
          <span className="text-sm text-[#353535] font-medium">
            {selectedTicket.asunto}
          </span>
        </div>

        {isLoadingDetalle ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#6b7280]">
            Cargando detalle del ticket...
          </div>
        ) : (
          <TicketDetail
            ticket={ticketDetalle ?? mockTicketDetalle}
            esAdmin={esAdmin}
          />
        )}
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
            {ticketsFiltrados.length} tickets
            {!mostrarCerrados && tickets.filter(t => t.estado === "cerrado").length > 0 && (
              <span className="ml-1 text-[#9ca3af]">
                ({tickets.filter(t => t.estado === "cerrado").length} cerrados ocultos)
              </span>
            )}
          </p>
        </div>

        {/* Toggle mostrar cerrados */}
        <label className="flex items-center gap-2 text-sm text-[#6b7280] cursor-pointer">
          <input
            type="checkbox"
            checked={mostrarCerrados}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMostrarCerrados(e.target.checked)
            }
            className="accent-[#3c6e71]"
          />
          Mostrar tickets cerrados
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : ticketsFiltrados.length === 0 ? (
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
              {ticketsFiltrados.map((ticket: TicketType) => {
                const slaStatus =
                  ticket.slaPercent >= 100 ? "critical"
                  : ticket.slaPercent >= 75 ? "warning"
                  : "ok";
                const slaColor =
                  slaStatus === "critical" ? "#ef4444"
                  : slaStatus === "warning" ? "#eab308"
                  : "#22c55e";

                const esCerrado = ticket.estado === "cerrado";

                return (
                  <tr
                    key={ticket.id}
                    className={`border-b border-[#d9d9d9] last:border-0 transition-colors ${
                      esCerrado && !esAdmin
                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                        : esCerrado && esAdmin
                        ? "bg-gray-50 opacity-70 cursor-pointer hover:opacity-90"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={() => handleSelectTicket(ticket)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">
                      {ticket.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#353535] max-w-[220px]">
                      <span className="block truncate">{ticket.asunto}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b7280] capitalize">
                      {ticket.canal}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.prioridad === "critica" ? "bg-red-500 text-white"
                        : ticket.prioridad === "alta" ? "bg-[#353535] text-white"
                        : ticket.prioridad === "media" ? "bg-[#d9d9d9] text-[#353535]"
                        : "border border-[#d9d9d9] text-[#6b7280]"
                      }`}>
                        {getPrioridadLabel(ticket.prioridad)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.estado === "abierto" ? "border border-[#284b63] text-[#284b63]"
                        : ticket.estado === "progreso" ? "bg-[#284b63] text-white"
                        : ticket.estado === "resuelto" ? "bg-[#3c6e71] text-white"
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
                          handleSelectTicket(ticket);
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