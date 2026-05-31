"use client";

import "./TicketsTable.css";
import React from "react";
import { Ticket, SlaStatus } from "../../lib/types/ticket.types";

interface TicketsTableProps {
  tickets: Ticket[];
  filter: string;
}

function getPrioridadLabel(prioridad: string): string {
  const labels: Record<string, string> = {
    Critica: "Crítica",
    Alta: "Alta",
    Media: "Media",
    Baja: "Baja",
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
  if (percent >= 100) return "critical";
  if (percent >= 75) return "warning";
  return "ok";
}

function getSlaLabel(percent: number): string {
  if (percent >= 100) return `${percent}% — Vencido`;
  if (percent >= 75) return `${percent}% — En riesgo`;
  return `${percent}%`;
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

export default function TicketsTable({ tickets, filter }: TicketsTableProps) {
  const filtered = applyFilter(tickets, filter);

  const getFilterLabel = (): string => {
    const labels: Record<string, string> = {
      Abierto: "Abiertos",
      Progreso: "En progreso",
      Resuelto: "Resueltos",
      Cerrado: "Cerrados",
      Critica: "Críticos",
      Chat: "Canal Chat",
      Email: "Canal Email",
      Telefono: "Canal Teléfono",
      App: "Canal App",
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
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#6b7280", fontSize: "0.875rem" }}>
                  No hay tickets que coincidan con el filtro seleccionado
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => {
                const slaStatus = getSlaStatus(ticket.slaPercent);
                return (
                  <tr key={ticket.id}>
                    <td>
                      <span className="ticket-id">{ticket.id}</span>
                    </td>
                    <td>
                      <span className="ticket-title">{ticket.asunto}</span>
                    </td>
                    <td>
                      <span className="ticket-category">{ticket.canal}</span>
                    </td>
                    <td>
                      <span className={`badge-priority badge-priority--${ticket.prioridad}`}>
                        {getPrioridadLabel(ticket.prioridad)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status badge-status--${ticket.estado.toLowerCase()}`}>
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