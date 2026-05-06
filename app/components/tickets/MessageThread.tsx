"use client";

import "./MessageThread.css";
import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { TicketDetail } from "../../lib/types/ticket.types";

interface MessageThreadProps {
  ticket: TicketDetail;
}

export default function MessageThread({ ticket }: MessageThreadProps) {
  const [reply, setReply] = useState("");

  return (
    <div className="message-thread">
      {/* Lista de mensajes */}
      <div className="message-thread__list">
        {ticket.messages.map((message, index) => (
          <div key={message.id}>
            <div className="message-thread__item">
              <div
                className={`message-thread__avatar ${
                  message.isStaff ? "message-thread__avatar--staff" : ""
                }`}
              >
                {message.initials}
              </div>
              <div className="message-thread__content">
                <div className="message-thread__header">
                  <span className="message-thread__author">{message.author}</span>
                  {message.isStaff && (
                    <span className="message-thread__staff-badge">Staff</span>
                  )}
                  <span className="message-thread__timestamp">
                    {message.timestamp}
                  </span>
                </div>
                <p className="message-thread__text">{message.content}</p>
              </div>
            </div>
            {index < ticket.messages.length - 1 && (
              <hr className="message-thread__separator" />
            )}
          </div>
        ))}
      </div>

      {/* Caja de respuesta */}
      <div className="message-thread__reply">
        <textarea
          className="message-thread__textarea"
          placeholder="Escribe una respuesta..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
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