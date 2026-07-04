"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { Send, AlertCircle, Clock, MessageSquare } from "lucide-react";
import { enlacesApi } from "../../../lib/api/enlaces.api";
import { EnlaceResponse } from "../../../lib/types/enlace.types";
import { Interaccion } from "../../../lib/types/ticket.types";

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
  abierto: "bg-transparent border border-[#284b63] text-[#284b63]",
  progreso: "bg-[#284b63] text-white",
  resuelto: "bg-[#3c6e71] text-white",
  cerrado: "bg-[#d9d9d9] text-[#353535]",
};

const prioridadClass: Record<string, string> = {
  critica: "bg-red-500 text-white",
  alta: "bg-[#353535] text-white",
  media: "bg-[#d9d9d9] text-[#353535]",
  baja: "border border-[#d9d9d9] text-[#6b7280]",
};

function getAutorInfo(autor_tipo: string, clienteNombre?: string) {
  switch (autor_tipo) {
    case "agente":
      return { label: "Agente", color: "#284b63", initials: "AG" };
    case "cliente": {
      const nombre = clienteNombre || "Cliente";
      const initials = nombre.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2);
      return { label: "Tú", color: "#3c6e71", initials };
    }
    case "sistema":
      return { label: "Sistema", color: "#284b63", initials: "SI" };
    default:
      return { label: "Desconocido", color: "#9ca3af", initials: "??" };
  }
}

export default function EnlacePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<EnlaceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchEnlace = async () => {
      try {
        setIsLoading(true);
        const result = await enlacesApi.getByToken(token);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el enlace"
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchEnlace();
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const interval = setInterval(async () => {
      try {
        const result = await enlacesApi.getByToken(token);
        setData((prev) => {
          if (!prev) return prev;
          if (result.interacciones.length !== prev.interacciones.length) {
            return result;
          }
          return prev;
        });
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [token, data]);

  const handleEnviar = async () => {
    if (!respuesta.trim()) return;
    try {
      setEnviando(true);
      const nuevaInteraccion = await enlacesApi.responder(token, respuesta.trim());
      setData((prev) =>
        prev
          ? { ...prev, interacciones: [...prev.interacciones, nuevaInteraccion] }
          : prev
      );
      setRespuesta("");
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch {
      setError("Error al enviar tu respuesta. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="text-sm text-[#6b7280]">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#f9fafb] flex items-center justify-center p-4">
        <div className="bg-white border border-[#d9d9d9] rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle size={40} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-lg font-semibold text-[#353535] mb-2">
            No se pudo acceder
          </h1>
          <p className="text-sm text-[#6b7280]">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { ticket, interacciones, expira_en } = data;

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      {/* Header fijo */}
      <div className="bg-white border-b border-[#d9d9d9] px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={16} className="text-[#3c6e71]" />
            <span className="text-xs font-medium text-[#3c6e71]">Soporte</span>
          </div>
          <h1 className="text-base font-semibold text-[#353535]">
            {ticket.asunto}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${estadoClass[ticket.estado]}`}
            >
              {estadoLabel[ticket.estado]}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${prioridadClass[ticket.prioridad]}`}
            >
              {prioridadLabel[ticket.prioridad]}
            </span>
            <span className="text-[10px] text-[#9ca3af] flex items-center gap-1">
              <Clock size={10} />
              {new Date(ticket.creado_en).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>
      </div>

      {/* Área de mensajes - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {interacciones.length === 0 ? (
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-6 text-center">
              <MessageSquare
                size={24}
                className="mx-auto mb-2 text-[#d9d9d9]"
              />
              <p className="text-sm text-[#6b7280]">
                Aún no hay mensajes. Escribe tu primera consulta más abajo.
              </p>
            </div>
          ) : (
            interacciones.map((interaccion: Interaccion) => {
              const autor = getAutorInfo(interaccion.autor_tipo, ticket.cliente_nombre);
              const esCliente = interaccion.autor_tipo === "cliente";
              const esSistema = interaccion.autor_tipo === "sistema";

              return (
                <div
                  key={interaccion.id}
                  className={`flex gap-2.5 ${esCliente ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: autor.color }}
                  >
                    {autor.initials}
                  </div>
                  <div className={`flex flex-col ${esCliente ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-medium text-[#353535]">
                        {autor.label}
                      </span>
                      <span className="text-[10px] text-[#9ca3af]">
                        {new Date(interaccion.creado_en).toLocaleTimeString(
                          "es-ES",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        esCliente
                          ? "bg-[#3c6e71] text-white rounded-br-md"
                          : esSistema
                          ? "bg-[#284b63] text-white rounded-bl-md"
                          : "bg-white border border-[#d9d9d9] text-[#353535] rounded-bl-md"
                      }`}
                    >
                      {interaccion.contenido}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input fijo abajo */}
      <div className="bg-white border-t border-[#d9d9d9] px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          {ticket.estado !== "cerrado" ? (
            <>
              <div className="flex items-end gap-2">
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu respuesta..."
                  rows={1}
                  className="flex-1 border border-[#d9d9d9] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af] resize-none min-h-[40px] max-h-[120px]"
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 120) + "px";
                  }}
                  disabled={enviando}
                />
                <button
                  onClick={handleEnviar}
                  disabled={enviando || !respuesta.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#3c6e71] text-white hover:bg-[#2d5557] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
              {exito && (
                <span className="text-[11px] text-green-600 mt-1 block">
                  Enviado
                </span>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-[#6b7280]">
                Este ticket está cerrado.
              </p>
            </div>
          )}
          <p className="text-[10px] text-[#9ca3af] text-center mt-2">
            Enlace expira el {new Date(expira_en).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  );
}
