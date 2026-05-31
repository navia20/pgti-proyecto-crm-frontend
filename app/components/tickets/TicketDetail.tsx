"use client";

import "./TicketDetail.css";
import React, { useState } from "react";
import {
  Circle, AlertCircle, User,
  Clock, Tag, BookOpen, Link,
} from "lucide-react";
import { TicketDetalle, TicketActivity, ArticuloKB } from "../../lib/types/ticket.types";
import { mockArticulosKB } from "../../lib/mocks/tickets.mock";
import MessageThread from "./MessageThread";
import ActivityPanel from "./ActivityPanel";

interface TicketDetailProps {
  ticket: TicketDetalle;
}

const estadoLabel: Record<string, string> = {
  abierto: "Abierto",
  progreso: "En progreso",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

const prioridadLabel: Record<string, string> = {
  critica: "Crítica",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const estadoClass: Record<string, string> = {
  abierto: "badge-status-detail--open",
  progreso: "badge-status-detail--in-progress",
  resuelto: "badge-status-detail--resolved",
  cerrado: "badge-status-detail--resolved",
};

const prioridadClass: Record<string, string> = {
  critica: "badge-priority-detail--urgent",
  alta: "badge-priority-detail--high",
  media: "badge-priority-detail--medium",
  baja: "badge-priority-detail--low",
};

// Componente panel KB
function PanelKB({ ticket }: { ticket: TicketDetalle }) {
  const [usados, setUsados] = useState<string[]>([]);

  const marcarUsado = (id: string) => {
    setUsados((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <div className="ticket-kb">
      <div className="ticket-kb__header">
        <div className="ticket-kb__title">
          <BookOpen size={13} style={{ display: "inline", marginRight: "0.375rem" }} />
          Base de Conocimiento
        </div>
        <div className="ticket-kb__subtitle">
          Artículos sugeridos para este ticket
        </div>
      </div>

      <div className="ticket-kb__list">
        {mockArticulosKB.length === 0 ? (
          <div className="ticket-kb__empty">
            No hay artículos sugeridos para esta categoría
          </div>
        ) : (
          mockArticulosKB.map((articulo: ArticuloKB) => {
            const usado = usados.includes(articulo.id);
            return (
              <div
                key={articulo.id}
                className={`ticket-kb__item ${usado ? "ticket-kb__item--used" : ""}`}
              >
                <div className="ticket-kb__item-category">{articulo.categoria}</div>
                <div className="ticket-kb__item-title">{articulo.titulo}</div>
                <div className="ticket-kb__item-actions">
                  <button className="ticket-kb__btn">Ver</button>
                  {!usado ? (
                    <button
                      className="ticket-kb__btn ticket-kb__btn--primary"
                      onClick={() => marcarUsado(articulo.id)}
                    >
                      Adjuntar
                    </button>
                  ) : (
                    <span className="ticket-kb__badge">
                      ✓ Adjuntado
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Panel de enlaces externos */}
      <div className="ticket-enlaces">
        <div className="ticket-enlaces__title">
          <Link size={12} style={{ display: "inline", marginRight: "0.375rem" }} />
          Referencias Externas
        </div>
        <div className="ticket-enlaces__form">
          <div className="ticket-enlaces__row">
            <span className="ticket-enlaces__label">Pedido</span>
            {ticket.pedido_id_ref ? (
              <span className="ticket-enlaces__badge">
                <Link size={10} />
                {ticket.pedido_id_ref}
              </span>
            ) : (
              <input
                type="text"
                placeholder="ped-123"
                className="ticket-enlaces__input"
              />
            )}
          </div>
          <div className="ticket-enlaces__row">
            <span className="ticket-enlaces__label">Suscripción</span>
            {ticket.suscripcion_id_ref ? (
              <span className="ticket-enlaces__badge">
                <Link size={10} />
                {ticket.suscripcion_id_ref}
              </span>
            ) : (
              <input
                type="text"
                placeholder="sus-456"
                className="ticket-enlaces__input"
              />
            )}
          </div>
          {!ticket.pedido_id_ref && !ticket.suscripcion_id_ref && (
            <button className="ticket-enlaces__save-btn">
              Guardar referencias
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const activityItems: TicketActivity[] = [
    {
      id: 1,
      type: "status_change",
      user: "Sistema",
      timestamp: ticket.interacciones[0]?.creado_en ?? "",
      from: "nuevo",
      to: ticket.estado,
    },
  ];

  return (
    <div className="ticket-detail">
      {/* Panel izquierdo — Metadatos */}
      <aside className="ticket-detail__sidebar">
        {/* Estado */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Circle size={12} />
            Estado
          </div>
          <span className={`badge-status-detail ${estadoClass[ticket.estado]}`}>
            {estadoLabel[ticket.estado]}
          </span>
        </div>

        {/* Prioridad */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <AlertCircle size={12} />
            Prioridad
          </div>
          <span className={`badge-priority-detail ${prioridadClass[ticket.prioridad]}`}>
            {prioridadLabel[ticket.prioridad]}
          </span>
        </div>

        <hr className="ticket-detail__separator" />

        {/* Canal */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Tag size={12} />
            Canal
          </div>
          <span className="ticket-detail__meta-value">{ticket.canal}</span>
        </div>

        {/* Agente */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Asignado a
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar">
              {ticket.agente_nombre.charAt(0)}
            </div>
            <div className="ticket-detail__person-info">
              <span className="ticket-detail__person-name">
                {ticket.agente_nombre}
              </span>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Cliente
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar">
              {ticket.cliente_nombre.charAt(0)}
            </div>
            <div className="ticket-detail__person-info">
              <span className="ticket-detail__person-name">
                {ticket.cliente_nombre}
              </span>
            </div>
          </div>
        </div>

        <hr className="ticket-detail__separator" />

        {/* SLA */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Clock size={12} />
            Vencimiento SLA
          </div>
          <span className="ticket-detail__meta-value">
            {new Date(ticket.fecha_vencimiento_sla).toLocaleString("es-ES")}
          </span>
        </div>

        <hr className="ticket-detail__separator" />

        {/* Tags */}
        {ticket.tags.length > 0 && (
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
        )}
      </aside>

      {/* Panel central — Mensajes */}
      <main className="ticket-detail__main">
        <MessageThread ticket={ticket} />
      </main>

      {/* Panel derecho — KB + Referencias + Actividad */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PanelKB ticket={ticket} />
        <aside className="ticket-detail__activity">
          <ActivityPanel activity={activityItems} />
        </aside>
      </div>
    </div>
  );
}