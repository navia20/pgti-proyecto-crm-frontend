"use client";

import "./TicketDetail.css";
import React, { useState, useEffect } from "react";
import {
  Circle, AlertCircle, User,
  Clock, Tag, Link, ChevronDown, Share2, Check, FileText,
} from "lucide-react";
import { enlacesApi } from "../../lib/api/enlaces.api";
import { FRONTEND_URL } from "../../lib/api/config";
import { TicketDetalle, TicketActivity, Interaccion, TicketEstado, TicketPrioridad, TicketCanal, SaludIncidente, PedidoOrden, ContratoCenit, PlanCenit, PagoCenit } from "../../lib/types/ticket.types";
import { ticketsApi } from "../../lib/api/tickets.api";
import { interaccionesApi } from "../../lib/api/interacciones.api";
import MessageThread from "./MessageThread";
import ActivityPanel from "./ActivityPanel";
import SaludInfoModal from "./SaludInfoModal";
import PedidoInfoModal from "./PedidoInfoModal";
import SuscripcionInfoModal from "./SuscripcionInfoModal";
import PagosHistorialModal from "./PagosHistorialModal";

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

const AGENTES_CONOCIDOS = [
  { id: "p7.admin@ucn.cl", nombre: "Admin CRM" },
  { id: "p7.agent@ucn.cl", nombre: "Agente CRM" },
];

function PanelReferencias({ ticket, onVerSalud, onVerPedido, onVerSuscripcion }: { ticket: TicketDetalle; onVerSalud?: () => void; onVerPedido?: () => void; onVerSuscripcion?: () => void }) {
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
            {onVerPedido && (
              <button
                onClick={onVerPedido}
                style={{
                  marginLeft: "0.25rem",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#3c6e71",
                  backgroundColor: "#f0f7f7",
                  border: "1px solid #3c6e71",
                  borderRadius: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Ver información
              </button>
            )}
          </div>
        )}
        {ticket.suscripcion_id_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Suscripción</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.suscripcion_id_ref}
            </span>
            {onVerSuscripcion && (
              <button
                onClick={onVerSuscripcion}
                style={{
                  marginLeft: "0.25rem",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#3c6e71",
                  backgroundColor: "#f0f7f7",
                  border: "1px solid #3c6e71",
                  borderRadius: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Ver información
              </button>
            )}
          </div>
        )}
        {ticket.salud_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Salud</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.salud_ref}
            </span>
            {onVerSalud && (
              <button
                onClick={onVerSalud}
                style={{
                  marginLeft: "0.25rem",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#3c6e71",
                  backgroundColor: "#f0f7f7",
                  border: "1px solid #3c6e71",
                  borderRadius: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Ver información
              </button>
            )}
          </div>
        )}
        {ticket.pago_id_ref && (
          <div className="ticket-referencias__row">
            <span className="ticket-referencias__label">Pago</span>
            <span className="ticket-referencias__badge">
              <Link size={10} />
              {ticket.pago_id_ref}
            </span>
          </div>
        )}
        {!ticket.pedido_id_ref && !ticket.suscripcion_id_ref && !ticket.salud_ref && !ticket.pago_id_ref && (
          <div className="ticket-referencias__empty">
            Sin referencias externas
          </div>
        )}
      </div>
    </div>
  );
}

function PanelDescripcion({ ticket }: { ticket: TicketDetalle }) {
  if (!ticket.descripcion) return null;
  return (
    <div className="ticket-referencias">
      <div className="ticket-referencias__title">
        <FileText size={12} style={{ display: "inline", marginRight: "0.375rem" }} />
        Descripción
      </div>
      <div style={{ padding: "0 0.75rem 0.75rem", fontSize: "0.8rem", color: "#353535", lineHeight: "1.5" }}>
        {ticket.descripcion}
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
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolucionTexto, setResolucionTexto] = useState("");
  const [agenteActual, setAgenteActual] = useState<string | null>(ticket.agente_id ?? null);
  const [showSaludModal, setShowSaludModal] = useState(false);
  const [saludData, setSaludData] = useState<SaludIncidente | null>(null);
  const [cargandoSalud, setCargandoSalud] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [pedidoData, setPedidoData] = useState<PedidoOrden | null>(null);
  const [cargandoPedido, setCargandoPedido] = useState(false);
  const [showSuscripcionModal, setShowSuscripcionModal] = useState(false);
  const [contratoData, setContratoData] = useState<ContratoCenit | null>(null);
  const [planData, setPlanData] = useState<PlanCenit | null>(null);
  const [pagosData, setPagosData] = useState<PagoCenit[]>([]);
  const [cargandoSuscripcion, setCargandoSuscripcion] = useState(false);
  const [showPagosModal, setShowPagosModal] = useState(false);
  const [clienteNombreResuelto, setClienteNombreResuelto] = useState(ticket.cliente_nombre);

  const handleInteraccionCreada = (nueva: Interaccion) => {
    setInteracciones((prev) => [...prev, nueva]);
    if (nueva.autor_tipo === "agente" && estadoActual === "abierto") {
      setEstadoActual("progreso");
    }
  };

  const handleCambiarEstado = async (nuevoEstado: TicketEstado) => {
    if (nuevoEstado === estadoActual) return;
    const anterior = estadoLabel[estadoActual];
    const nuevo = estadoLabel[nuevoEstado];
    try {
      setCambiandoEstado(true);
      await ticketsApi.actualizar(ticket.id, { estado: nuevoEstado });
      setEstadoActual(nuevoEstado);
      const interaccion = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Estado cambiado de "${anterior}" a "${nuevo}"`,
        es_nota_interna: false,
      });
      setInteracciones((prev) => [...prev, interaccion]);
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
      const interaccion = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Prioridad cambiada de "${prioridadLabel[prioridadActual]}" a "${prioridadLabel[nuevaPrioridad]}"`,
        es_nota_interna: false,
      });
      setInteracciones((prev) => [...prev, interaccion]);
    } catch (error) {
      console.error("Error al cambiar prioridad:", error);
    }
  };

  const handleCambiarCanal = async (nuevoCanal: TicketCanal) => {
    if (nuevoCanal === canalActual) return;
    try {
      await ticketsApi.actualizar(ticket.id, { canal: nuevoCanal });
      setCanalActual(nuevoCanal);
      const interaccion = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Canal cambiado de "${canalActual}" a "${nuevoCanal}"`,
        es_nota_interna: false,
      });
      setInteracciones((prev) => [...prev, interaccion]);
    } catch (error) {
      console.error("Error al cambiar canal:", error);
    }
  };

  const handleResolver = async () => {
    if (!resolucionTexto.trim()) return;
    try {
      await ticketsApi.actualizar(ticket.id, {
        estado: "resuelto",
        resolucion: resolucionTexto.trim(),
      });
      setEstadoActual("resuelto");
      const interaccion = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Ticket resuelto: ${resolucionTexto.trim()}`,
        es_nota_interna: false,
      });
      setInteracciones((prev) => [...prev, interaccion]);
      setShowResolveModal(false);
      setResolucionTexto("");
    } catch (error) {
      console.error("Error al resolver ticket:", error);
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

  const handleAsignarAgente = async (nuevoAgenteId: string) => {
    const valor = nuevoAgenteId || null;
    if (valor === agenteActual) return;
    try {
      await ticketsApi.actualizar(ticket.id, { agente_id: valor || undefined });
      setAgenteActual(valor);
      const nombreAgente = valor
        ? AGENTES_CONOCIDOS.find((a) => a.id === valor)?.nombre ?? valor
        : "Sin asignar";
      const interaccion = await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "sistema",
        autor_id: "sistema",
        contenido: `Ticket asignado a ${nombreAgente}`,
        es_nota_interna: false,
      });
      setInteracciones((prev) => [...prev, interaccion]);
    } catch (error) {
      console.error("Error al asignar agente:", error);
    }
  };

  useEffect(() => {
    if (!ticket.cliente_nombre && ticket.pedido_id_ref) {
      ticketsApi.getPedidoOrden(ticket.pedido_id_ref).then((orden) => {
        if (orden?.cliente?.nombre) {
          setClienteNombreResuelto(orden.cliente.nombre);
        }
      });
    }
  }, [ticket.cliente_nombre, ticket.pedido_id_ref]);

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

  const activityItems: TicketActivity[] = interacciones
    .filter((i) => i.autor_tipo === "sistema" && !i.es_nota_interna)
    .map((i, idx) => {
      let type: TicketActivity["type"] = "status_change";
      let from = "";
      let to = "";

      if (i.contenido.startsWith("Estado cambiado")) {
        type = "status_change";
        const match = i.contenido.match(/de "(.+?)" a "(.+)"/);
        if (match) { from = match[1]; to = match[2]; }
      } else if (i.contenido.startsWith("Ticket resuelto")) {
        type = "status_change";
        from = "abierto";
        to = "resuelto";
      } else if (i.contenido.startsWith("Prioridad cambiada")) {
        type = "priority_change";
        const match = i.contenido.match(/de "(.+?)" a "(.+)"/);
        if (match) { from = match[1]; to = match[2]; }
      } else if (i.contenido.startsWith("Canal cambiado")) {
        type = "assignment";
        const match = i.contenido.match(/de "(.+?)" a "(.+)"/);
        if (match) { from = match[1]; to = match[2]; }
      }

      return { id: idx + 1, type, user: i.autor_nombre, timestamp: i.creado_en, from, to };
    });

  const ticketCerrado = estadoActual === "cerrado";

  const handleVerSalud = async () => {
    if (!ticket.salud_ref) return;
    setCargandoSalud(true);
    setShowSaludModal(true);
    const data = await ticketsApi.getSaludIncidente(ticket.salud_ref);
    setSaludData(data);
    setCargandoSalud(false);
  };

  const handleVerPedido = async () => {
    if (!ticket.pedido_id_ref) return;
    setCargandoPedido(true);
    setShowPedidoModal(true);
    const data = await ticketsApi.getPedidoOrden(ticket.pedido_id_ref);
    setPedidoData(data);
    setCargandoPedido(false);
  };

  const handleVerSuscripcion = async () => {
    if (!ticket.suscripcion_id_ref) return;
    setCargandoSuscripcion(true);
    setShowSuscripcionModal(true);
    const contrato = await ticketsApi.getContratoCenit(ticket.suscripcion_id_ref);
    setContratoData(contrato);
    if (contrato) {
      const [plan, pagos] = await Promise.all([
        ticketsApi.getPlanCenit(contrato.id_plans),
        ticketsApi.getPagosUsuario(contrato.id_users),
      ]);
      setPlanData(plan);
      setPagosData(pagos);
    }
    setCargandoSuscripcion(false);
  };

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
          {esAdmin ? (
            <div className="relative">
              <select
                value={agenteActual ?? ""}
                onChange={(e) => handleAsignarAgente(e.target.value)}
                className="w-full appearance-none bg-white border border-[#d9d9d9] rounded-lg px-3 py-2 pr-8 text-sm text-[#353535] focus:outline-none focus:border-[#3c6e71] cursor-pointer"
              >
                <option value="">Sin asignar</option>
                {AGENTES_CONOCIDOS.map((agente) => (
                  <option key={agente.id} value={agente.id}>
                    {agente.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#6b7280",
                }}
              />
            </div>
          ) : (
            <div className="ticket-detail__person">
              <div className="ticket-detail__avatar" style={{ backgroundColor: "#284b63" }}>
                {agenteActual ? AGENTES_CONOCIDOS.find((a) => a.id === agenteActual)?.nombre.charAt(0) ?? "A" : "SA"}
              </div>
              <div className="ticket-detail__person-info">
                <span className="ticket-detail__person-name">
                  {agenteActual
                    ? AGENTES_CONOCIDOS.find((a) => a.id === agenteActual)?.nombre ?? agenteActual
                    : "Sin asignar"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <User size={12} />
            Cliente
          </div>
          <div className="ticket-detail__person">
            <div className="ticket-detail__avatar">
              {clienteNombreResuelto.charAt(0) || "?"}
            </div>
            <div className="ticket-detail__person-info">
              <span className="ticket-detail__person-name">
                {clienteNombreResuelto || "Sin nombre"}
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

        {!ticketCerrado && estadoActual !== "resuelto" && (
          <>
            <hr className="ticket-detail__separator" />
            <div className="ticket-detail__meta-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                onClick={() => setShowResolveModal(true)}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[#3c6e71] text-[#3c6e71] hover:bg-[#3c6e71] hover:text-white"
              >
                Resolver
              </button>
              <button
                onClick={() => setShowConfirmClose(true)}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                Cerrar ticket
              </button>
            </div>
          </>
        )}

        <hr className="ticket-detail__separator" />

        <div className="ticket-detail__meta-group">
          <div className="ticket-detail__meta-label">
            <Clock size={12} />
            Vencimiento SLA
          </div>
          <span className="ticket-detail__meta-value">
            {(ticket.estado === "resuelto" || ticket.estado === "cerrado")
              ? "Completado"
              : new Date(ticket.fecha_vencimiento_sla).toLocaleString("es-ES")}
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
        <PanelDescripcion ticket={ticket} />
        <PanelReferencias ticket={ticket} onVerSalud={ticket.salud_ref ? handleVerSalud : undefined} onVerPedido={ticket.pedido_id_ref ? handleVerPedido : undefined} onVerSuscripcion={ticket.suscripcion_id_ref ? handleVerSuscripcion : undefined} />
        <aside className="ticket-detail__activity">
          <ActivityPanel activity={activityItems} />
        </aside>
      </div>

      {showConfirmClose && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowConfirmClose(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Cerrar ticket
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.25rem" }}>
              ¿Estás seguro de cerrar este ticket? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowConfirmClose(false)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirmClose(false);
                  handleCambiarEstado("cerrado");
                }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showResolveModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => { setShowResolveModal(false); setResolucionTexto(""); }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Resolver ticket
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
              Describe la resolución de esta solicitud. Esta información será visible para el cliente y otros módulos.
            </p>
            <textarea
              value={resolucionTexto}
              onChange={(e) => setResolucionTexto(e.target.value)}
              placeholder="Ej: Se reprogramó el envío para el 5 de julio..."
              rows={4}
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                padding: "0.6rem 0.75rem",
                fontSize: "0.85rem",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#3c6e71"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d9d9d9"; }}
            />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                onClick={() => { setShowResolveModal(false); setResolucionTexto(""); }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleResolver}
                disabled={!resolucionTexto.trim()}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: resolucionTexto.trim() ? "#3c6e71" : "#d9d9d9",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: resolucionTexto.trim() ? "pointer" : "not-allowed",
                }}
              >
                Resolver ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaludModal && (
        cargandoSalud ? (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowSaludModal(false); setSaludData(null); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Cargando información de salud...</div>
            </div>
          </div>
        ) : saludData ? (
          <SaludInfoModal data={saludData} onClose={() => { setShowSaludModal(false); setSaludData(null); }} />
        ) : (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowSaludModal(false); setSaludData(null); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
                No se pudo cargar la información del incidente de salud.
              </p>
              <button
                onClick={() => { setShowSaludModal(false); setSaludData(null); }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      )}

      {showPedidoModal && (
        cargandoPedido ? (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowPedidoModal(false); setPedidoData(null); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Cargando información del pedido...</div>
            </div>
          </div>
        ) : pedidoData ? (
          <PedidoInfoModal data={pedidoData} onClose={() => { setShowPedidoModal(false); setPedidoData(null); }} />
        ) : (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowPedidoModal(false); setPedidoData(null); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
                No se pudo cargar la información del pedido.
              </p>
              <button
                onClick={() => { setShowPedidoModal(false); setPedidoData(null); }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      )}

      {showSuscripcionModal && (
        cargandoSuscripcion ? (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowSuscripcionModal(false); setContratoData(null); setPlanData(null); setPagosData([]); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Cargando información de suscripción...</div>
            </div>
          </div>
        ) : contratoData ? (
          <>
            <SuscripcionInfoModal
              contrato={contratoData}
              plan={planData}
              pagos={pagosData}
              onVerPagos={() => setShowPagosModal(true)}
              onClose={() => { setShowSuscripcionModal(false); setContratoData(null); setPlanData(null); setPagosData([]); }}
            />
            {showPagosModal && (
              <PagosHistorialModal
                pagos={pagosData}
                idUsers={contratoData.id_users}
                onBack={() => setShowPagosModal(false)}
                onClose={() => { setShowPagosModal(false); setShowSuscripcionModal(false); setContratoData(null); setPlanData(null); setPagosData([]); }}
              />
            )}
          </>
        ) : (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => { setShowSuscripcionModal(false); setContratoData(null); setPlanData(null); setPagosData([]); }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
                No se pudo cargar la información de la suscripción.
              </p>
              <button
                onClick={() => { setShowSuscripcionModal(false); setContratoData(null); setPlanData(null); setPagosData([]); }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
