"use client";

import "./TicketsGrid.css";
import React from "react";
import { Ticket, SlaStatus } from "../../lib/types/ticket.types";

interface TicketsGridProps {
  tickets: Ticket[];
  filter: string;
  onTicketClick?: (ticket: Ticket) => void;
  esAdmin?: boolean;
  onAsignarAgente?: (ticketId: string, agenteId: string | null) => void;
}

const AGENTES_CONOCIDOS = [
  { id: "", nombre: "Sin asignar" },
  { id: "p7.admin@ucn.cl", nombre: "Admin CRM" },
  { id: "p7.agent@ucn.cl", nombre: "Agente CRM" },
];

function getPrioridadLabel(prioridad: string): string {
  const labels: Record<string, string> = {
    critica: "Crítica",
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  };
  return labels[prioridad] ?? prioridad;
}

function getEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    abierto: "Abierto",
    progreso: "En progreso",
    resuelto: "Resuelto",
    cerrado: "Cerrado",
  };
  return labels[estado] ?? estado;
}

function getSlaStatus(percent: number): SlaStatus {
  const p = Math.max(0, percent);
  if (p >= 100) return "critical";
  if (p >= 75) return "warning";
  return "ok";
}

function getSlaLabel(percent: number): string {
  const p = Math.max(0, percent);
  if (p >= 100) return `${p}% — Vencido`;
  if (p >= 75) return `${p}% — En riesgo`;
  if (percent < 0) return `${p}%`;
  return `${p}%`;
}

function applyFilter(tickets: Ticket[], filter: string): Ticket[] {
  if (filter === "all") return tickets;
  if (["abierto", "progreso", "resuelto", "cerrado"].includes(filter)) {
    return tickets.filter((t) => t.estado === filter);
  }
  if (["critica", "alta", "media", "baja"].includes(filter)) {
    return tickets.filter((t) => t.prioridad === filter);
  }
  if (["chat", "email", "telefono", "app"].includes(filter)) {
    return tickets.filter((t) => t.canal === filter);
  }
  return tickets;
}

export default function TicketsGrid({ tickets, filter, onTicketClick, esAdmin, onAsignarAgente }: TicketsGridProps) {
  const filtered = applyFilter(tickets, filter);

  const getFilterLabel = (): string => {
    const labels: Record<string, string> = {
      abierto: "Abiertos",
      progreso: "En progreso",
      resuelto: "Resueltos",
      cerrado: "Cerrados",
      critica: "Críticos",
      chat: "Canal Chat",
      email: "Canal Email",
      telefono: "Canal Teléfono",
      app: "Canal App",
    };
    return labels[filter] ?? filter;
  };

  return (
    <div className="tickets-grid-section">
      <div className="tickets-grid-section__header">
        <div>
          <div className="tickets-grid-section__title">Tickets Activos</div>
          <div className="tickets-grid-section__subtitle">
            {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
            {filter !== "all" && ` · Filtrado por ${getFilterLabel()}`}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="tickets-grid-empty">
          No hay tickets que coincidan con el filtro seleccionado
        </div>
      ) : (
        <div className="tickets-grid">
          {filtered.map((ticket) => {
            const slaStatus = getSlaStatus(ticket.slaPercent);
            return (
              <div
                key={ticket.id}
                className="tickets-grid__card"
                onClick={() => onTicketClick?.(ticket)}
              >
                <div className="tickets-grid__card-header">
                  <span className="tickets-grid__card-id" title={ticket.id}>
                    {ticket.id.slice(0, 8)}
                  </span>
                  <span className={`badge-status badge-status--${ticket.estado}`}>
                    {getEstadoLabel(ticket.estado)}
                  </span>
                </div>

                <div className="tickets-grid__card-asunto">{ticket.asunto}</div>

                <div className="tickets-grid__card-badges">
                  <span className={`badge-priority badge-priority--${ticket.prioridad}`}>
                    {getPrioridadLabel(ticket.prioridad)}
                  </span>
                  <span className="tickets-grid__card-canal">{ticket.canal}</span>
                </div>

                <div className="tickets-grid__card-meta">
                  <div className="tickets-grid__card-meta-row">
                    <span className="tickets-grid__card-label">Agente</span>
                    {esAdmin ? (
                      <select
                        value={ticket.agente_id ?? ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          onAsignarAgente?.(ticket.id, e.target.value || null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="agent-select"
                      >
                        {AGENTES_CONOCIDOS.map((agente) => (
                          <option key={agente.id} value={agente.id}>
                            {agente.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="tickets-grid__card-value">{ticket.agente_nombre}</span>
                    )}
                  </div>
                  <div className="tickets-grid__card-meta-row">
                    <span className="tickets-grid__card-label">Cliente</span>
                    <span className="tickets-grid__card-value">{ticket.cliente_nombre}</span>
                  </div>
                </div>

                <div className="tickets-grid__card-sla">
                  {(ticket.estado === "resuelto" || ticket.estado === "cerrado") ? (
                    <>
                      <div className="sla-dot sla-dot--ok" />
                      <span className="sla-text--ok">Completado</span>
                    </>
                  ) : (
                    <>
                      <div className={`sla-dot sla-dot--${slaStatus}`} />
                      <span className={`sla-text--${slaStatus}`}>
                        {getSlaLabel(ticket.slaPercent)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
