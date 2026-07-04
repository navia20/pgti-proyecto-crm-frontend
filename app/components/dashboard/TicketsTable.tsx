"use client";

import "./TicketsTable.css";
import React from "react";
import { Ticket, SlaStatus } from "../../lib/types/ticket.types";

interface TicketsTableProps {
  tickets: Ticket[];
  filter: string;
  onTicketClick?: (ticket: Ticket) => void;
}

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

export default function TicketsTable({ tickets, filter, onTicketClick }: TicketsTableProps) {
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
    <div className="tickets-table-section">
      <div className="tickets-table-section__header">
        <div>
          <div className="tickets-table-section__title">Tickets Activos</div>
          <div className="tickets-table-section__subtitle">
            {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
            {filter !== "all" && ` · Filtrado por ${getFilterLabel()}`}
          </div>
        </div>
      </div>

      <div className="tickets-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Asunto</th>
              <th>Canal</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Agente</th>
              <th>Cliente</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  No hay tickets que coincidan con el filtro seleccionado
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => {
                const slaStatus = getSlaStatus(ticket.slaPercent);
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onTicketClick?.(ticket)}
                    style={{ cursor: onTicketClick ? "pointer" : "default" }}
                  >
                    <td>
                      <span className="ticket-id" title={ticket.id}>{ticket.id.slice(0, 8)}</span>
                    </td>
                    <td>
                      <span className="ticket-title">{ticket.asunto}</span>
                    </td>
                    <td>
                      <span className="ticket-category capitalize">{ticket.canal}</span>
                    </td>
                    <td>
                      <span className={`badge-priority badge-priority--${ticket.prioridad}`}>
                        {getPrioridadLabel(ticket.prioridad)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status badge-status--${ticket.estado}`}>
                        {getEstadoLabel(ticket.estado)}
                      </span>
                    </td>
                    <td>
                      <span className="ticket-agent">{ticket.agente_nombre}</span>
                    </td>
                    <td>
                      <span className="ticket-agent">{ticket.cliente_nombre}</span>
                    </td>
                    <td>
                      <div className="sla-cell">
                        <div className={`sla-dot sla-dot--${slaStatus}`} />
                        <span className={`sla-text--${slaStatus}`}>
                          {getSlaLabel(ticket.slaPercent)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}