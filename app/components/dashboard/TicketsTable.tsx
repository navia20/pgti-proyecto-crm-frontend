"use client";

import "./TicketsTable.css";
import { useState } from "react";
import { Ticket, TicketPriority, TicketStatus, SlaStatus } from "@/app/lib/types/ticket.types";

interface TicketsTableProps {
  tickets: Ticket[];
  filter: string;
}

function getPriorityLabel(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    urgent: "Urgente",
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };
  return labels[priority];
}

function getStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: "Abierto",
    "in-progress": "En progreso",
    resolved: "Resuelto",
  };
  return labels[status];
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

export default function TicketsTable({ tickets, filter }: TicketsTableProps) {
  const filtered = tickets.filter((t) => {
    if (filter === "all") return true;
    if (filter === "open") return t.status === "open";
    if (filter === "in-progress") return t.status === "in-progress";
    if (filter === "urgent") return t.priority === "urgent";
    return true;
  });

  return (
    <div className="tickets-table-section">
      <div className="tickets-table-section__header">
        <div>
          <div className="tickets-table-section__title">Tickets Activos</div>
          <div className="tickets-table-section__subtitle">
            {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
            {filter !== "all" && ` · Filtrado por ${filter}`}
          </div>
        </div>
      </div>

      <div className="tickets-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Agente</th>
              <th>Categoría</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => {
              const slaStatus = getSlaStatus(ticket.slaPercent);
              return (
                <tr key={ticket.id}>
                  <td>
                    <span className="ticket-id">{ticket.id}</span>
                  </td>
                  <td>
                    <span className="ticket-title">{ticket.title}</span>
                  </td>
                  <td>
                    <span className={`badge-priority badge-priority--${ticket.priority}`}>
                      {getPriorityLabel(ticket.priority)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status badge-status--${ticket.status}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td>
                    <span className="ticket-agent">{ticket.agent}</span>
                  </td>
                  <td>
                    <span className="ticket-category">{ticket.category}</span>
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}