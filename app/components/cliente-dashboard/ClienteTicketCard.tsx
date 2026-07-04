"use client";

import "./ClienteTicketCard.css";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { Ticket, Interaccion } from "../../lib/types/ticket.types";
import { interaccionesApi } from "../../lib/api/interacciones.api";

interface ClienteTicketCardProps {
  ticket: Ticket;
  interacciones?: Interaccion[];
  onInteraccionEnviada?: () => void;
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

export default function ClienteTicketCard({
  ticket,
  interacciones = [],
  onInteraccionEnviada,
}: ClienteTicketCardProps) {
  const [expandido, setExpandido] = useState(false);
  const [reply, setReply] = useState("");
  const [enviando, setEnviando] = useState(false);

  const slaColor =
    ticket.slaPercent >= 100 ? "#ef4444"
    : ticket.slaPercent >= 75 ? "#eab308"
    : "#22c55e";

  const handleEnviar = async () => {
    if (!reply.trim()) return;
    try {
      setEnviando(true);
      await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "cliente",
        autor_id: "00000000-0000-0000-0000-000000000001",
        contenido: reply,
        es_nota_interna: false,
      });
      setReply("");
      onInteraccionEnviada?.();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  const interaccionesPublicas = interacciones.filter(
    (i) => !i.es_nota_interna
  );

  return (
    <div className="cliente-ticket-card">
      <div
        className="cliente-ticket-card__top"
        onClick={() => setExpandido((prev) => !prev)}
      >
        <div className="cliente-ticket-card__asunto">{ticket.asunto}</div>
        <div className="cliente-ticket-card__badges">
          <span className={`cliente-ticket-card__badge cliente-ticket-card__badge--${ticket.estado}`}>
            {estadoLabel[ticket.estado]}
          </span>
          <span className={`cliente-ticket-card__badge cliente-ticket-card__badge--${ticket.prioridad}`}>
            {prioridadLabel[ticket.prioridad]}
          </span>
          {expandido ? <ChevronUp size={14} color="#6b7280" /> : <ChevronDown size={14} color="#6b7280" />}
        </div>
      </div>

      <div className="cliente-ticket-card__meta">
        <span>#{ticket.id.slice(0, 8)}</span>
        <span>{ticket.canal}</span>
        <div className="cliente-ticket-card__sla">
          <div
            className="cliente-ticket-card__sla-dot"
            style={{ backgroundColor: slaColor }}
          />
          <span style={{ color: slaColor }}>
            {ticket.slaPercent >= 100 ? "SLA vencido"
            : ticket.slaPercent >= 75 ? "SLA en riesgo"
            : "SLA OK"}
          </span>
        </div>
      </div>

      {/* Detalle expandido */}
      {expandido && (
        <div className="cliente-ticket-detalle">
          {/* Interacciones */}
          {interaccionesPublicas.length > 0 && (
            <div className="cliente-ticket-detalle__interacciones">
              {interaccionesPublicas.map((msg) => (
                <div key={msg.id} className="cliente-ticket-detalle__msg">
                  <div
                    className={`cliente-ticket-detalle__msg-avatar ${
                      msg.autor_tipo === "cliente"
                        ? "cliente-ticket-detalle__msg-avatar--cliente"
                        : ""
                    }`}
                  >
                    {msg.autor_iniciales}
                  </div>
                  <div className="cliente-ticket-detalle__msg-content">
                    <div className="cliente-ticket-detalle__msg-autor">
                      {msg.autor_tipo === "cliente" ? "Tú" : "Soporte"}
                    </div>
                    <div className="cliente-ticket-detalle__msg-texto">
                      {msg.contenido}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Responder — solo si no está cerrado */}
          {ticket.estado !== "cerrado" && ticket.estado !== "resuelto" && (
            <div className="cliente-ticket-detalle__reply">
              <textarea
                className="cliente-ticket-detalle__textarea"
                placeholder="Escribe una respuesta a tu ticket..."
                value={reply}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReply(e.target.value)
                }
              />
              <button
                className="cliente-ticket-detalle__send-btn"
                onClick={handleEnviar}
                disabled={enviando || !reply.trim()}
              >
                <Send size={13} />
                {enviando ? "Enviando..." : "Enviar respuesta"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}