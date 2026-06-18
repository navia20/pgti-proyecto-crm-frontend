"use client";

import "./MessageThread.css";
import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { TicketDetalle, Interaccion } from "../../lib/types/ticket.types";
import { interaccionesApi } from "../../lib/api/interacciones.api";

interface MessageThreadProps {
  ticket: TicketDetalle;
  onInteraccionCreada?: (interaccion: Interaccion) => void;
}

export default function MessageThread({ ticket, onInteraccionCreada }: MessageThreadProps) {
  const [reply, setReply] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const [esNotaInterna, setEsNotaInterna] = useState(false);

  const handleEnviar = async () => {
    if (!reply.trim()) return;
    try {
      setIsEnviando(true);
      const nueva = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "agente",
        autor_id: "00000000-0000-0000-0000-000000000001",
        contenido: reply,
        es_nota_interna: esNotaInterna,
      });
      setReply("");
      onInteraccionCreada?.(nueva);
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
    } finally {
      setIsEnviando(false);
    }
  };

  return (
    <div className="message-thread">
      {/* Lista de mensajes */}
      <div className="message-thread__list">
        {ticket.interacciones.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", fontSize: "0.875rem" }}>
            No hay interacciones aún. Sé el primero en responder.
          </div>
        ) : (
          ticket.interacciones.map((message: Interaccion, index: number) => (
            <div key={message.id}>
              <div className="message-thread__item">
                <div
                  className={`message-thread__avatar ${
                    message.autor_tipo === "agente"
                      ? "message-thread__avatar--staff"
                      : ""
                  }`}
                >
                  {message.autor_iniciales}
                </div>
                <div className="message-thread__content">
                  <div className="message-thread__header">
                    <span className="message-thread__author">
                      {message.autor_nombre}
                    </span>
                    {message.autor_tipo === "agente" && (
                      <span className="message-thread__staff-badge">Staff</span>
                    )}
                    {message.autor_tipo === "sistema" && (
                      <span className="message-thread__staff-badge">Sistema</span>
                    )}
                    {message.es_nota_interna && (
                      <span className="message-thread__staff-badge" style={{ backgroundColor: "#fef9c3", color: "#ca8a04" }}>
                        Nota interna
                      </span>
                    )}
                    <span className="message-thread__timestamp">
                      {new Date(message.creado_en).toLocaleString("es-ES")}
                    </span>
                  </div>
                  <p className="message-thread__text">{message.contenido}</p>
                </div>
              </div>
              {index < ticket.interacciones.length - 1 && (
                <hr className="message-thread__separator" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Caja de respuesta */}
      <div className="message-thread__reply">
        {/* Toggle nota interna */}
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-1.5 text-xs text-[#6b7280] cursor-pointer">
            <input
              type="checkbox"
              checked={esNotaInterna}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEsNotaInterna(e.target.checked)
              }
              className="accent-[#3c6e71]"
            />
            Nota interna (solo visible para agentes)
          </label>
        </div>

        <textarea
          className="message-thread__textarea"
          placeholder={esNotaInterna ? "Escribe una nota interna..." : "Escribe una respuesta..."}
          value={reply}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReply(e.target.value)
          }
          style={esNotaInterna ? { backgroundColor: "#fefce8", borderColor: "#eab308" } : {}}
        />
        <div className="message-thread__reply-actions">
          <button className="message-thread__attach-btn">
            <Paperclip size={14} />
            Adjuntar
          </button>
          <button
            className="message-thread__send-btn"
            onClick={handleEnviar}
            disabled={isEnviando || !reply.trim()}
            style={isEnviando ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          >
            <Send size={14} />
            {isEnviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}