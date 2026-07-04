"use client";

import React, { useState, useEffect } from "react";
import { Plus, Ticket, CheckCircle2, Clock, X } from "lucide-react";
import ClienteDashboardHeader from "../../components/cliente-dashboard/ClienteDashboardHeader";
import ClienteTicketCard from "../../components/cliente-dashboard/ClienteTicketCard";
import { SkeletonList } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { ticketsApi } from "../../lib/api/tickets.api";
import { interaccionesApi } from "../../lib/api/interacciones.api";
import {
  Ticket as TicketType,
  Interaccion,
  TicketCanal,
  TicketPrioridad,
} from "../../lib/types/ticket.types";
import { ClientePerfil } from "../../lib/types/cliente.types";

const CLIENTE_MOCK: ClientePerfil = {
  id: 1,
  identidad_id: "idt-001",
  nombre_completo: "María González Test",
  email: "maria.test@email.com",
  telefono: "+56 9 1234 5678",
  fecha_nacimiento: "",
  creado_en: "2026-01-01T00:00:00Z",
  estado: "active",
};

const CLIENTE_ID = 1;

type TabType = "tickets" | "perfil";

interface NuevoTicketForm {
  asunto: string;
  canal: TicketCanal;
  prioridad: TicketPrioridad;
  descripcion: string;
}

const initialForm: NuevoTicketForm = {
  asunto: "",
  canal: "email",
  prioridad: "media",
  descripcion: "",
};

export default function ClienteDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("tickets");
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [interaccionesPorTicket, setInteraccionesPorTicket] = useState<Record<string, Interaccion[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NuevoTicketForm>(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const result = await ticketsApi.getAll({ cliente_id: CLIENTE_ID, take: 50 });
      const ticketList = result.data;
      setTickets(ticketList);
      const interaccionesMap: Record<string, Interaccion[]> = {};
      await Promise.all(
        ticketList.map(async (ticket) => {
          try {
            const ints = await interaccionesApi.getByTicket(ticket.id);
            interaccionesMap[ticket.id] = ints;
          } catch {
            interaccionesMap[ticket.id] = [];
          }
        })
      );
      setInteraccionesPorTicket(interaccionesMap);
    } catch {
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  }, []);

  const handleCrearTicket = async () => {
    if (!form.asunto.trim() || !form.descripcion.trim()) {
      setFormError("Asunto y descripción son obligatorios.");
      return;
    }
    try {
      setEnviando(true);
      setFormError(null);
      const ticket = await ticketsApi.crear({
        cliente_id: CLIENTE_ID,
        asunto: form.asunto,
        canal: form.canal,
        prioridad: form.prioridad,
        descripcion: form.descripcion,
        pedido_id_ref: "",
        suscripcion_id_ref: "",
        pago_id_ref: "",
        salud_ref: "",
      });
      if (form.descripcion.trim() && ticket.id) {
        await interaccionesApi.crear({
          ticket_id: ticket.id,
          autor_tipo: "cliente",
          autor_id: "00000000-0000-0000-0000-000000000001",
          contenido: form.descripcion,
          es_nota_interna: false,
        });
      }
      setModalOpen(false);
      setForm(initialForm);
      await fetchTickets();
    } catch {
      setFormError("Error al crear el ticket. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const ticketsAbiertos = tickets.filter((t) => t.estado === "abierto").length;
  const ticketsEnProgreso = tickets.filter((t) => t.estado === "progreso").length;
  const ticketsResueltos = tickets.filter((t) => t.estado === "resuelto").length;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ClienteDashboardHeader cliente={CLIENTE_MOCK} />

      <div className="bg-white border-b border-[#d9d9d9] px-6">
        <div className="flex gap-1 max-w-3xl mx-auto">
          {[
            { value: "tickets", label: "Mis Tickets" },
            { value: "perfil", label: "Mi Perfil" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as TabType)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.value
                  ? "border-[#3c6e71] text-[#3c6e71]"
                  : "border-transparent text-[#6b7280] hover:text-[#353535]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {activeTab === "tickets" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={15} className="text-[#284b63]" />
                  <span className="text-xs text-[#6b7280]">Abiertos</span>
                </div>
                <div className="text-2xl font-semibold text-[#284b63]">
                  {ticketsAbiertos}
                </div>
              </div>
              <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={15} className="text-[#353535]" />
                  <span className="text-xs text-[#6b7280]">En progreso</span>
                </div>
                <div className="text-2xl font-semibold text-[#353535]">
                  {ticketsEnProgreso}
                </div>
              </div>
              <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={15} className="text-[#3c6e71]" />
                  <span className="text-xs text-[#6b7280]">Resueltos</span>
                </div>
                <div className="text-2xl font-semibold text-[#3c6e71]">
                  {ticketsResueltos}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#353535]">
                Mis solicitudes de soporte
              </h2>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#3c6e71] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors"
              >
                <Plus size={14} />
                Nueva solicitud
              </button>
            </div>

            {isLoading ? (
              <SkeletonList items={3} />
            ) : tickets.length === 0 ? (
              <EmptyState
                icon={Ticket}
                title="Sin solicitudes"
                description="No tienes solicitudes de soporte registradas."
                actionLabel="Crear solicitud"
                onAction={() => setModalOpen(true)}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {tickets.map((ticket) => (
                  <ClienteTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    interacciones={interaccionesPorTicket[ticket.id] ?? []}
                    onInteraccionEnviada={fetchTickets}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "perfil" && (
          <div className="bg-white border border-[#d9d9d9] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#353535] mb-4">
              Mis datos
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6b7280]">Nombre completo</label>
                <div className="text-sm font-medium text-[#353535]">
                  {CLIENTE_MOCK.nombre_completo}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6b7280]">Email</label>
                <div className="text-sm text-[#353535]">{CLIENTE_MOCK.email}</div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6b7280]">Teléfono</label>
                <div className="text-sm text-[#353535]">
                  {CLIENTE_MOCK.telefono ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6b7280]">Estado</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 w-fit">
                  Activo
                </span>
              </div>
              <div className="mt-2 pt-4 border-t border-[#d9d9d9]">
                <p className="text-xs text-[#9ca3af]">
                  Para modificar tus datos de perfil contacta a soporte.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white">
              <div>
                <div className="text-base font-semibold text-[#353535]">
                  Nueva solicitud de soporte
                </div>
                <div className="text-xs text-[#6b7280] mt-0.5">
                  Cuéntanos en qué podemos ayudarte
                </div>
              </div>
              <button
                onClick={() => { setModalOpen(false); setForm(initialForm); setFormError(null); }}
                className="text-[#6b7280] hover:text-[#353535] p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#353535]">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.asunto}
                  onChange={(e) => setForm((p) => ({ ...p, asunto: e.target.value }))}
                  placeholder="Describe brevemente tu problema..."
                  className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  maxLength={120}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">Canal</label>
                  <select
                    value={form.canal}
                    onChange={(e) => setForm((p) => ({ ...p, canal: e.target.value as TicketCanal }))}
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3c6e71] bg-white"
                  >
                    <option value="email">Email</option>
                    <option value="chat">Chat</option>
                    <option value="telefono">Teléfono</option>
                    <option value="app">App</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">Prioridad</label>
                  <select
                    value={form.prioridad}
                    onChange={(e) => setForm((p) => ({ ...p, prioridad: e.target.value as TicketPrioridad }))}
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3c6e71] bg-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#353535]">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Describe tu problema en detalle..."
                  className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af] resize-none min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
              <button
                onClick={() => { setModalOpen(false); setForm(initialForm); setFormError(null); }}
                className="text-sm text-[#6b7280] border border-[#d9d9d9] px-4 py-2 rounded-lg hover:border-[#353535] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearTicket}
                disabled={enviando || !form.asunto.trim() || !form.descripcion.trim()}
                className="flex items-center gap-2 bg-[#3c6e71] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}