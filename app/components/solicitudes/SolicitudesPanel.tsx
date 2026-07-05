"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  User,
  FileText,
  AlertCircle,
  Inbox,
  Pen,
} from "lucide-react";
import {
  solicitudesApi,
  Solicitud,
  AprobarSolicitudPayload,
} from "../../lib/api/solicitudes.api";

type SolicitudFiltro = "pendiente" | "aprobada" | "rechazada" | "";

export default function SolicitudesPanel() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtro, setFiltro] = useState<SolicitudFiltro>("pendiente");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<Solicitud | null>(null);
  const [modalAprobar, setModalAprobar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const [reescribir, setReescribir] = useState(false);
  const [editarAsunto, setEditarAsunto] = useState("");
  const [editarDescripcion, setEditarDescripcion] = useState("");
  const [editarPrioridad, setEditarPrioridad] = useState<string>("media");
  const [editarCanal, setEditarCanal] = useState<string>("email");

  const [procesando, setProcesando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await solicitudesApi.getAll(filtro || undefined);
      setSolicitudes(result.data);
    } catch {
      setError("Error al cargar solicitudes");
      setSolicitudes([]);
    } finally {
      setIsLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSolicitudes();
  }, [fetchSolicitudes]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const abrirModalAprobar = (s: Solicitud) => {
    setSolicitudSeleccionada(s);
    setEditarAsunto(s.asunto);
    setEditarDescripcion(s.descripcion);
    setEditarPrioridad("media");
    setEditarCanal("email");
    setReescribir(false);
    setModalAprobar(true);
  };

  const abrirModalRechazar = (s: Solicitud) => {
    setSolicitudSeleccionada(s);
    setMotivoRechazo("");
    setModalRechazar(true);
  };

  const handleAprobar = async () => {
    if (!solicitudSeleccionada) return;
    setProcesando(true);
    try {
      const dto: AprobarSolicitudPayload = {};
      if (reescribir) {
        if (editarAsunto !== solicitudSeleccionada.asunto) dto.asunto = editarAsunto;
        if (editarDescripcion !== solicitudSeleccionada.descripcion) dto.descripcion = editarDescripcion;
      }
      dto.prioridad = editarPrioridad as AprobarSolicitudPayload["prioridad"];
      dto.canal = editarCanal as AprobarSolicitudPayload["canal"];
      await solicitudesApi.aprobar(solicitudSeleccionada.id, dto);
      setModalAprobar(false);
      setSolicitudSeleccionada(null);
      setMensajeExito("Solicitud aprobada. Ticket creado exitosamente.");
      void fetchSolicitudes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (!solicitudSeleccionada || !motivoRechazo.trim()) return;
    setProcesando(true);
    try {
      await solicitudesApi.rechazar(solicitudSeleccionada.id, motivoRechazo);
      setModalRechazar(false);
      setSolicitudSeleccionada(null);
      setMensajeExito("Solicitud rechazada.");
      void fetchSolicitudes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setProcesando(false);
    }
  };

  const tabs: { key: SolicitudFiltro; label: string }[] = [
    { key: "pendiente", label: "Pendientes" },
    { key: "aprobada", label: "Aprobadas" },
    { key: "rechazada", label: "Rechazadas" },
    { key: "", label: "Todas" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#353535]">
            Solicitudes de clientes
          </h2>
          <p className="text-sm text-[#6b7280]">
            Revisa y aprueba tickets solicitados por clientes
          </p>
        </div>
      </div>

      {mensajeExito && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle size={16} />
          {mensajeExito}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            x
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-[#d9d9d9]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFiltro(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              filtro === tab.key
                ? "border-[#3c6e71] text-[#3c6e71]"
                : "border-transparent text-[#6b7280] hover:text-[#353535]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-[#6b7280]">
          <div className="w-6 h-6 border-2 border-[#d9d9d9] border-t-[#3c6e71] rounded-full animate-spin mr-3" />
          Cargando...
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#6b7280]">
          <Inbox size={48} className="mb-4 text-[#d9d9d9]" />
          <p className="text-lg font-medium mb-1">Sin solicitudes</p>
          <p className="text-sm">No hay solicitudes {filtro ? `con estado "${filtro}"` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-[#d9d9d9] rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : s.estado === "aprobada"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.estado === "pendiente" && <Clock size={12} />}
                      {s.estado === "aprobada" && <CheckCircle size={12} />}
                      {s.estado === "rechazada" && <XCircle size={12} />}
                      {s.estado}
                    </span>
                    <span className="text-xs text-[#9ca3af]">
                      {new Date(s.creado_en).toLocaleString("es-CL")}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#353535] mb-1">
                    {s.asunto}
                  </h3>
                  <p className="text-sm text-[#6b7280] mb-3 line-clamp-2">
                    {s.descripcion}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {s.nombre}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {s.email}
                    </span>
                    {s.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {s.telefono}
                      </span>
                    )}
                  </div>

                  {s.motivo_rechazo && (
                    <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      <strong>Motivo de rechazo:</strong> {s.motivo_rechazo}
                    </div>
                  )}
                </div>

                {s.estado === "pendiente" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => abrirModalAprobar(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Aprobar
                    </button>
                    <button
                      onClick={() => abrirModalRechazar(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={14} />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAprobar && solicitudSeleccionada && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModalAprobar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#3c6e71] px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-white">
                Aprobar solicitud
              </h3>
              <p className="text-sm text-teal-100 mt-0.5">
                Revisa la información y crea el ticket
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-xs text-[#6b7280] bg-[#f9fafb] rounded-lg px-4 py-3 border border-[#d9d9d9]">
                <strong>Solicitante:</strong> {solicitudSeleccionada.nombre} — {solicitudSeleccionada.email}
                {solicitudSeleccionada.telefono && ` — ${solicitudSeleccionada.telefono}`}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Asunto
                  </label>
                  {!reescribir && (
                    <button
                      onClick={() => {
                        setReescribir(true);
                        setEditarAsunto(solicitudSeleccionada.asunto);
                        setEditarDescripcion(solicitudSeleccionada.descripcion);
                      }}
                      className="flex items-center gap-1 text-xs text-[#3c6e71] hover:text-[#2f5f62] font-medium transition-colors"
                    >
                      <Pen size={12} />
                      Reescribir
                    </button>
                  )}
                </div>
                {reescribir ? (
                  <input
                    type="text"
                    value={editarAsunto}
                    onChange={(e) => setEditarAsunto(e.target.value)}
                    className="w-full px-3 py-2 border border-[#3c6e71] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71]"
                  />
                ) : (
                  <div className="px-3 py-2 bg-[#f9fafb] border border-[#d9d9d9] rounded-lg text-sm text-[#353535]">
                    {solicitudSeleccionada.asunto}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#353535] mb-1.5">
                  Descripción del cliente
                </label>
                {reescribir ? (
                  <textarea
                    rows={4}
                    value={editarDescripcion}
                    onChange={(e) => setEditarDescripcion(e.target.value)}
                    className="w-full px-3 py-2 border border-[#3c6e71] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-[#f9fafb] border border-[#d9d9d9] rounded-lg text-sm text-[#353535] whitespace-pre-wrap">
                    {solicitudSeleccionada.descripcion}
                  </div>
                )}
              </div>

              {reescribir && (
                <div className="text-xs text-[#6b7280] bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5">
                  La descripción original se guardará como primera interacción del sistema en el ticket.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#353535] mb-1.5">
                    Prioridad
                  </label>
                  <select
                    value={editarPrioridad}
                    onChange={(e) => setEditarPrioridad(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71]"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#353535] mb-1.5">
                    Canal
                  </label>
                  <select
                    value={editarCanal}
                    onChange={(e) => setEditarCanal(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71]"
                  >
                    <option value="email">Email</option>
                    <option value="chat">Chat</option>
                    <option value="telefono">Teléfono</option>
                    <option value="app">App</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#d9d9d9] flex items-center justify-end gap-3">
              <button
                onClick={() => setModalAprobar(false)}
                className="px-4 py-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAprobar}
                disabled={procesando}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {procesando ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText size={16} />
                )}
                Crear ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {modalRechazar && solicitudSeleccionada && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModalRechazar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#3c6e71] px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-white">
                Rechazar solicitud
              </h3>
              <p className="text-sm text-teal-100 mt-0.5">
                Indica el motivo del rechazo
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-[#353535] mb-1.5">
                Motivo *
              </label>
              <textarea
                rows={3}
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                className="w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] resize-none"
                placeholder="Ej: La solicitud no aplica a nuestro servicio..."
              />
            </div>

            <div className="px-6 py-4 border-t border-[#d9d9d9] flex items-center justify-end gap-3">
              <button
                onClick={() => setModalRechazar(false)}
                className="px-4 py-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                disabled={procesando || !motivoRechazo.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {procesando ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
