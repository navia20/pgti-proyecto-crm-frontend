"use client";

import "./TicketDetail.css";
import React, { useState } from "react";
import {
  Circle, AlertCircle, User,
  Clock, Tag, BookOpen, Link, ChevronDown,
} from "lucide-react";
import { TicketDetalle, TicketActivity, ArticuloKB, Interaccion, TicketEstado } from "../../lib/types/ticket.types";
import { mockArticulosKB } from "../../lib/mocks/tickets.mock";
import { ticketsApi } from "../../lib/api/tickets.api";
import MessageThread from "./MessageThread";
import ActivityPanel from "./ActivityPanel";

interface TicketDetailProps {
  ticket: TicketDetalle;
  esAdmin?: boolean;
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

// Estados disponibles según rol
const estadosAgente: TicketEstado[] = ["abierto", "progreso", "resuelto"];
const estadosAdmin: TicketEstado[] = ["abierto", "progreso", "resuelto", "cerrado"];

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
                    <span className="ticket-kb__badge">✓ Adjuntado</span>
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
              <input type="text" placeholder="ped-123" className="ticket-enlaces__input" />
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
              <input type="text" placeholder="sus-456" className="ticket-enlaces__input" />
            )}
          </div>
          {!ticket.pedido_id_ref && !ticket.suscripcion_id_ref && (
            <button className="ticket-enlaces__save-btn">Guardar referencias</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketDetail({ ticket, esAdmin = false }: TicketDetailProps) {
  const [interacciones, setInteracciones] = useState(ticket.interacciones);
  const [estadoActual, setEstadoActual] = useState<TicketEstado>(ticket.estado);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const handleInteraccionCreada = (nueva: Interaccion) => {
    setInteracciones((prev) => [...prev, nueva]);
  };

  const handleCambiarEstado = async (nuevoEstado: TicketEstado) => {
    if (nuevoEstado === estadoActual) return;
    try {
      setCambiandoEstado(true);
      await ticketsApi.actualizar(ticket.id, { estado: nuevoEstado });
      setEstadoActual(nuevoEstado);
      // Agregar nota de sistema en actividad
      const nuevaInteraccion: Interaccion = {
        id: `sys-${Date.now()}`,
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Estado cambiado a "${estadoLabel[nuevoEstado]}"`,
        es_nota_interna: true,
        creado_en: new Date().toISOString(),
        autor_nombre: "Sistema",
        autor_iniciales: "SI",
      };
      setInteracciones((prev) => [...prev, nuevaInteraccion]);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const estadosDisponibles = esAdmin ? estadosAdmin : estadosAgente;

  const activityItems: TicketActivity[] = [
    {
      id: 1,
      type: "status_change",
      user: "Sistema",
      timestamp: ticket.interacciones[0]?.creado_en ?? "",
      from: "nuevo",
      to: estadoActual,
    },
  ];

  const ticketCerrado = estadoActual === "cerrado";

  return (
    <div className="ticket-detail">
      {/* Banner ticket cerrado */}
      {ticketCerrado && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            backgroundColor: "#f3f4f6",
            borderBottom: "1px solid #d9d9d9",
            padding: "0.5rem 1.5rem",
            fontSize: "0.8rem",
            color: "#6b7280",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          🔒 Este ticket está cerrado.
          {esAdmin && (
            <button
              onClick={() => handleCambiarEstado("abierto")}
              style={{
                marginLeft: "0.5rem",
                color: "#3c6e71",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              Reabrir ticket
            </button>
          )}
        </div>
      )}

      {/* Panel izquierdo — Metadatos */}
      <aside className="ticket-detail__sidebar" style={ticketCerrado ? { paddingTop: "2.5rem" } : {}}>

        {/* Estado con selector */}
        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Circle size={12} />
            Estado
          </div>
          {ticketCerrado && !esAdmin ? (
            <span className={`badge-status-detail ${estadoClass[estadoActual]}`}>
              {estadoLabel[estadoActual]}
            </span>
          ) : (
            <div style={{ position: "relative" }}>
              <select
                value={estadoActual}
                onChange={(e) => handleCambiarEstado(e.target.value as TicketEstado)}
                disabled={cambiandoEstado}
                style={{
                  appearance: "none",
                  border: "1px solid #d9d9d9",
                  borderRadius: "9999px",
                  padding: "0.2rem 1.5rem 0.2rem 0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: estadoActual === "abierto" ? "#284b63"
                    : estadoActual === "progreso" ? "#ffffff"
                    : estadoActual === "resuelto" ? "#ffffff"
                    : "#353535",
                  backgroundColor: estadoActual === "abierto" ? "transparent"
                    : estadoActual === "progreso" ? "#284b63"
                    : estadoActual === "resuelto" ? "#3c6e71"
                    : "#d9d9d9",
                  cursor: cambiandoEstado ? "not-allowed" : "pointer",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              >
                {estadosDisponibles.map((e) => (
                  <option key={e} value={e} style={{ color: "#353535", backgroundColor: "#ffffff" }}>
                    {estadoLabel[e]}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={10}
                style={{
                  position: "absolute",
                  right: "0.4rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: estadoActual === "abierto" ? "#284b63" : "#ffffff",
                }}
              />
            </div>
          )}
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
          <span className="ticket-detail__meta-value capitalize">{ticket.canal}</span>
        </div>

{/* Agente */}
<div className="ticket-detail__meta-group">
  <div className="ticket-detail__meta-label">
    <User size={12} />
    Gestionado por
  </div>
  <div className="ticket-detail__person">
    <div className="ticket-detail__avatar"
      style={{ backgroundColor: "#284b63" }}
    >
      AS
    </div>
    <div className="ticket-detail__person-info">
      <span className="ticket-detail__person-name">
        Administrador del Sistema
      </span>
      <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
        Sin módulo de usuarios activo
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
                <span key={tag} className="ticket-detail__tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Panel central — Mensajes */}
      <main className="ticket-detail__main" style={ticketCerrado ? { paddingTop: "2rem", pointerEvents: ticketCerrado && !esAdmin ? "none" : "auto", opacity: ticketCerrado ? 0.7 : 1 } : {}}>
        <MessageThread
          ticket={{ ...ticket, interacciones }}
          onInteraccionCreada={handleInteraccionCreada}
        />
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