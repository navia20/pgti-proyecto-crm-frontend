"use client";

import "./MessageThread.css";
import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { TicketDetalle, Interaccion } from "../../lib/types/ticket.types";
import { interaccionesApi } from "../../lib/api/interacciones.api";

interface MessageThreadProps {
  ticket: TicketDetalle;
  onInteraccionCreada?: (interaccion: Interaccion) => void;
}

function getAutorDisplay(message: Interaccion, clienteNombre?: string) {
  if (message.autor_tipo === "cliente") {
    const nombre = clienteNombre || "Cliente";
    const iniciales = nombre.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2);
    return { nombre, iniciales, color: "#3c6e71" };
  }
  if (message.autor_tipo === "sistema") {
    return { nombre: "Sistema", iniciales: "SI", color: "#284b63" };
  }
  return { nombre: message.autor_nombre, iniciales: message.autor_iniciales, color: "#284b63" };
}

export default function MessageThread({ ticket, onInteraccionCreada }: MessageThreadProps) {
  const [reply, setReply] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const [esNotaInterna, setEsNotaInterna] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.interacciones]);

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
      setEsNotaInterna(false);
      onInteraccionCreada?.(nueva);
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
    } finally {
      setIsEnviando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  return (
    <div className="message-thread">
      {/* Lista de mensajes */}
      <div className="message-thread__list">
        {ticket.interacciones.length === 0 ? (
          <div className="message-thread__empty">
            No hay interacciones aún. Sé el primero en responder.
          </div>
        ) : (
          ticket.interacciones.map((message: Interaccion, index: number) => {
            const autor = getAutorDisplay(message, ticket.cliente_nombre);
            const esCliente = message.autor_tipo === "cliente";
            const esSistema = message.autor_tipo === "sistema";

            return (
              <div key={message.id}>
                <div className={`message-thread__bubble-row ${!esCliente ? "message-thread__bubble-row--right" : ""}`}>
                  {esCliente && (
                    <div
                      className="message-thread__bubble-avatar"
                      style={{ backgroundColor: autor.color }}
                    >
                      {autor.iniciales}
                    </div>
                  )}
                  <div className={`message-thread__bubble-group ${!esCliente ? "message-thread__bubble-group--right" : ""}`}>
                    <div className="message-thread__bubble-meta">
                      <span className="message-thread__bubble-name">{autor.nombre}</span>
                      <span className="message-thread__bubble-time">
                        {new Date(message.creado_en).toLocaleString("es-ES")}
                      </span>
                      {message.autor_tipo === "agente" && (
                        <span className="message-thread__bubble-badge">Staff</span>
                      )}
                      {message.autor_tipo === "sistema" && (
                        <span className="message-thread__bubble-badge">Sistema</span>
                      )}
                      {message.es_nota_interna && (
                        <span className="message-thread__bubble-badge message-thread__bubble-badge--nota">
                          Nota interna
                        </span>
                      )}
                    </div>
                    <div
                      className={`message-thread__bubble ${
                        esCliente
                          ? "message-thread__bubble--cliente"
                          : esSistema
                          ? "message-thread__bubble--sistema"
                          : "message-thread__bubble--agente"
                      }`}
                    >
                      {message.contenido}
                    </div>
                  </div>
                  {!esCliente && (
                    <div
                      className="message-thread__bubble-avatar"
                      style={{ backgroundColor: autor.color }}
                    >
                      {autor.iniciales}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Caja de respuesta */}
      <div className="message-thread__reply">
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
        <div className="flex items-end gap-2">
          <textarea
            className="message-thread__textarea"
            placeholder={esNotaInterna ? "Escribe una nota interna..." : "Escribe una respuesta..."}
            value={reply}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setReply(e.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={1}
            style={esNotaInterna ? { backgroundColor: "#fefce8", borderColor: "#eab308" } : {}}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
          <button
            className="message-thread__send-btn"
            onClick={handleEnviar}
            disabled={isEnviando || !reply.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
