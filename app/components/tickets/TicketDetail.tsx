"use client";

import "./TicketDetail.css";
import React, { useState, useEffect } from "react";
import {
  Circle, AlertCircle, User,
  Clock, Tag, Link, ChevronDown, Share2, Check,
} from "lucide-react";
import { enlacesApi } from "../../lib/api/enlaces.api";
import { FRONTEND_URL } from "../../lib/api/config";
import { TicketDetalle, TicketActivity, Interaccion, TicketEstado, TicketPrioridad, TicketCanal } from "../../lib/types/ticket.types";
import { ticketsApi } from "../../lib/api/tickets.api";
import { interaccionesApi } from "../../lib/api/interacciones.api";
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

const estadosAgente: TicketEstado[] = ["abierto", "progreso", "resuelto"];
const estadosAdmin: TicketEstado[] = ["abierto", "progreso", "resuelto", "cerrado"];

function PanelReferencias({ ticket }: { ticket: TicketDetalle }) {
  return (
    <div className="ticket-referencias">
      <div className="ticket-referencias__title">
        <Link size={12} style={{ display: "inline", marginRight: "0.375rem" }} />
        Referencias Externas
      </div>
      <div className="ticket-referencias__list">
        {ticket.pedido_id_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Pedido</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.pedido_id_ref}
            </span>
          </div>
        )}
        {ticket.suscripcion_id_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Suscripción</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.suscripcion_id_ref}
            </span>
          </div>
        )}
        {ticket.salud_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Salud</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.salud_ref}
            </span>
          </div>
        )}
        {!ticket.pedido_id_ref && !ticket.suscripcion_id_ref && !ticket.salud_ref && (
          <div className="ticket-referencias__empty">
            Sin referencias externas
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketDetail({ ticket, esAdmin = false }: TicketDetailProps) {
  const [interacciones, setInteracciones] = useState(ticket.interacciones);
  const [estadoActual, setEstadoActual] = useState<TicketEstado>(ticket.estado);
  const [prioridadActual, setPrioridadActual] = useState(ticket.prioridad);
  const [canalActual, setCanalActual] = useState(ticket.canal);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [generandoEnlace, setGenerandoEnlace] = useState(false);
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);

  const handleInteraccionCreada = (nueva: Interaccion) => {
    setInteracciones((prev) => [...prev, nueva]);
  };

  const handleCambiarEstado = async (nuevoEstado: TicketEstado) => {
    if (nuevoEstado === estadoActual) return;
    try {
      setCambiandoEstado(true);
      await ticketsApi.actualizar(ticket.id, { estado: nuevoEstado });
      setEstadoActual(nuevoEstado);
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

  const handleCambiarPrioridad = async (nuevaPrioridad: TicketPrioridad) => {
    if (nuevaPrioridad === prioridadActual) return;
    try {
      await ticketsApi.actualizar(ticket.id, { prioridad: nuevaPrioridad });
      setPrioridadActual(nuevaPrioridad);
    } catch (error) {
      console.error("Error al cambiar prioridad:", error);
    }
  };

  const handleCambiarCanal = async (nuevoCanal: TicketCanal) => {
    if (nuevoCanal === canalActual) return;
    try {
      await ticketsApi.actualizar(ticket.id, { canal: nuevoCanal });
      setCanalActual(nuevoCanal);
    } catch (error) {
      console.error("Error al cambiar canal:", error);
    }
  };

  const handleCopiarEnlace = async () => {
    try {
      setGenerandoEnlace(true);
      const { url } = await enlacesApi.crear(ticket.id);
      const fullUrl = `${FRONTEND_URL}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setEnlaceCopiado(true);
      setTimeout(() => setEnlaceCopiado(false), 3000);
    } catch (error) {
      console.error("Error al generar enlace:", error);
    } finally {
      setGenerandoEnlace(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const nuevas = await interaccionesApi.getByTicket(ticket.id);
        setInteracciones((prev) => {
          if (nuevas.length !== prev.length) return nuevas;
          return prev;
        });
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [ticket.id]);

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

      <aside className="ticket-detail__sidebar" style={ticketCerrado ? { paddingTop: "2.5rem" } : {}}>
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

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <AlertCircle size={12} />
            Prioridad
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={prioridadActual}
              onChange={(e) => handleCambiarPrioridad(e.target.value as TicketPrioridad)}
              style={{
                appearance: "none",
                border: "1px solid #d9d9d9",
                borderRadius: "9999px",
                padding: "0.2rem 1.5rem 0.2rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: prioridadActual === "critica" ? "#ffffff"
                  : prioridadActual === "alta" ? "#ffffff"
                  : prioridadActual === "media" ? "#ffffff"
                  : "#6b7280",
                backgroundColor: prioridadActual === "critica" ? "#ef4444"
                  : prioridadActual === "alta" ? "#f97316"
                  : prioridadActual === "media" ? "#eab308"
                  : "transparent",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              {Object.entries(prioridadLabel).map(([value, label]) => (
                <option key={value} value={value} style={{ color: "#353535", backgroundColor: "#ffffff" }}>
                  {label}
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
                color: prioridadActual === "baja" ? "#6b7280" : "#ffffff",
              }}
            />
          </div>
        </div>

        <hr className="ticket-detail__separator" />

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Tag size={12} />
            Canal
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={canalActual}
              onChange={(e) => handleCambiarCanal(e.target.value as TicketCanal)}
              style={{
                appearance: "none",
                border: "1px solid #d9d9d9",
                borderRadius: "9999px",
                padding: "0.2rem 1.5rem 0.2rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#353535",
                backgroundColor: "transparent",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {["chat", "email", "telefono", "app"].map((c) => (
                <option key={c} value={c} style={{ color: "#353535", backgroundColor: "#ffffff" }}>
                  {c === "telefono" ? "Teléfono" : c.charAt(0).toUpperCase() + c.slice(1)}
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
                color: "#6b7280",
              }}
            />
          </div>
        </div>

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Gestionado por
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar" style={{ backgroundColor: "#284b63" }}>
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

        <div className="ticket-detail__meta-group">
          <button
            onClick={handleCopiarEnlace}
            disabled={generandoEnlace || enlaceCopiado}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[#d9d9d9] hover:border-[#3c6e71] hover:text-[#3c6e71] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enlaceCopiado ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600">Enlace copiado</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Compartir con cliente</span>
              </>
            )}
          </button>
        </div>

        <hr className="ticket-detail__separator" />

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Clock size={12} />
            Vencimiento SLA
          </div>
          <span className="ticket-detail__meta-value">
            {new Date(ticket.fecha_vencimiento_sla).toLocaleString("es-ES")}
          </span>
        </div>
      </aside>

      <main className="ticket-detail__main" style={ticketCerrado ? { paddingTop: "2rem", pointerEvents: ticketCerrado && !esAdmin ? "none" : "auto", opacity: ticketCerrado ? 0.7 : 1 } : {}}>
        <MessageThread
          ticket={{ ...ticket, interacciones }}
          onInteraccionCreada={handleInteraccionCreada}
        />
      </main>

      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PanelReferencias ticket={ticket} />
        <aside className="ticket-detail__activity">
          <ActivityPanel activity={activityItems} />
        </aside>
      </div>
    </div>
  );
}
