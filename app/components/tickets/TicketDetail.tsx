"use client";

import "./TicketDetail.css";
import { TicketDetail as TicketDetailType } from "../../lib/types/ticket.types";
import { Circle, AlertCircle, User, Clock, Tag } from "lucide-react";
import MessageThread from "./MessageThread";
import ActivityPanel from "./ActivityPanel";
import { useState } from "react";

interface TicketDetailProps {
  ticket: TicketDetailType;
}

const statusLabel: Record<string, string> = {
  open: "Abierto",
  "in-progress": "En progreso",
  resolved: "Resuelto",
};

const priorityLabel: Record<string, string> = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <div className="ticket-detail">
      {/* Panel izquierdo — Metadatos */}
      <aside className="ticket-detail__sidebar">
        {/* Status */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Circle size={12} />
            Status
          </div>
          <span className={`badge-status-detail badge-status-detail--${ticket.status}`}>
            {statusLabel[ticket.status]}
          </span>
        </div>

        {/* Priority */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <AlertCircle size={12} />
            Prioridad
          </div>
          <span className={`badge-priority-detail badge-priority-detail--${ticket.priority}`}>
            {priorityLabel[ticket.priority]}
          </span>
        </div>

        <hr className="ticket-detail__separator" />

        {/* Assignee */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Asignado a
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar">
              {ticket.assignee.initials}
            </div>
            <div className="ticket-detail__person-info">
              <span className="ticket-detail__person-name">
                {ticket.assignee.name}
              </span>
            </div>
          </div>
        </div>

        {/* Reporter */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Reportado por
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar">
              {ticket.reporter.initials}
            </div>
            <div className="ticket-detail__person-info">
              <span className="ticket-detail__person-name">
                {ticket.reporter.name}
              </span>
              <span className="ticket-detail__person-email">
                {ticket.reporter.email}
              </span>
            </div>
          </div>
        </div>

        <hr className="ticket-detail__separator" />

        {/* Fechas */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Clock size={12} />
            Creado
          </div>
          <span className="ticket-detail__meta-value">{ticket.created}</span>
        </div>

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Clock size={12} />
            Actualizado
          </div>
          <span className="ticket-detail__meta-value">{ticket.updated}</span>
        </div>

        <hr className="ticket-detail__separator" />

        {/* Tags */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Tag size={12} />
            Tags
          </div>
          <div className="ticket-detail__tags">
            {ticket.tags.map((tag) => (
              <span key={tag} className="ticket-detail__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Panel central — Mensajes */}
      <main className="ticket-detail__main">
        <MessageThread ticket={ticket} />
      </main>

      {/* Panel derecho — Actividad */}
      <aside className="ticket-detail__activity">
        <ActivityPanel activity={ticket.activity} />
      </aside>
    </div>
  );
}