"use client";

import "./MessageThread.css";
import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { TicketDetalle, Interaccion } from "../../lib/types/ticket.types";

interface MessageThreadProps {
  ticket: TicketDetalle;
}

export default function MessageThread({ ticket }: MessageThreadProps) {
  const [reply, setReply] = useState("");

  return (
    <div className="message-thread">
      <div className="message-thread__list">
        {ticket.interacciones.map((message: Interaccion, index: number) => (
          <div key={message.id}>
            <div className="message-thread__item">
              <div
                className={`message-thread__avatar ${
                  message.autor_tipo === "Agente"
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
                  {message.autor_tipo === "Agente" && (
                    <span className="message-thread__staff-badge">Staff</span>
                  )}
                  {message.autor_tipo === "Sistema" && (
                    <span className="message-thread__staff-badge">Sistema</span>
                  )}
                  <span className="message-thread__timestamp">
                    {message.creado_en}
                  </span>
                </div>
                {message.es_nota_interna && (
                  <div className="message-thread__internal-badge">
                    Nota interna
                  </div>
                )}
                <p className="message-thread__text">{message.contenido}</p>
              </div>
            </div>
            {index < ticket.interacciones.length - 1 && (
              <hr className="message-thread__separator" />
            )}
          </div>
        ))}
      </div>

      <div className="message-thread__reply">
        <textarea
          className="message-thread__textarea"
          placeholder="Escribe una respuesta..."
          value={reply}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReply(e.target.value)
          }
        />
        <div className="message-thread__reply-actions">
          <button className="message-thread__attach-btn">
            <Paperclip size={14} />
            Adjuntar
          </button>
          <button className="message-thread__send-btn">
            <Send size={14} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}