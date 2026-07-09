"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Users,
  X,
  Ticket,
  ShoppingCart,
  CreditCard,
  HeartPulse,
  RefreshCw,
  Pencil,
  Trash2,
} from "lucide-react";
import ClienteHeader from "../../components/clientes/ClienteHeader";
import TicketsList from "../../components/clientes/TicketsList";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonTable, SkeletonProfile } from "../../components/ui/Skeleton";
import { clientesApi } from "../../lib/api/clientes.api";
import { ticketsApi } from "../../lib/api/tickets.api";
import {
  ClientePerfil,
  TicketCliente,
  PedidoResumen,
  SuscripcionResumen,
  PagoResumen,
  SaludResumen,
} from "../../lib/types/cliente.types";
import { Ticket as TicketType } from "../../lib/types/ticket.types";

interface ClienteForm {
  nombre_completo: string;
  email: string;
  telefono: string;
  empresa: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

const initialForm: ClienteForm = {
  nombre_completo: "",
  email: "",
  telefono: "",
  empresa: "",
  direccion: "",
  ciudad: "",
  pais: "",
};

function mapTicketToClienteTicket(t: TicketType): TicketCliente {
  const statusMap: Record<string, TicketCliente["status"]> = {
    abierto: "abierto",
    progreso: "en_progreso",
    resuelto: "resuelto",
    cerrado: "resuelto",
  };
  const priorityMap: Record<string, TicketCliente["priority"]> = {
    critica: "urgente",
    alta: "alta",
    media: "media",
    baja: "baja",
  };
  return {
    id: t.id,
    title: t.asunto,
    description: `Canal: ${t.canal}`,
    status: statusMap[t.estado] ?? "abierto",
    priority: priorityMap[t.prioridad] ?? "media",
    created: new Date(t.fecha_vencimiento_sla).toLocaleDateString("es-ES"),
    assignee: t.agente_nombre,
  };
}

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<ClientePerfil[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClientePerfil | null>(
    null
  );
  const [ticketsCliente, setTicketsCliente] = useState<TicketCliente[]>([]);
  const [pedidosRef, setPedidosRef] = useState<PedidoResumen[]>([]);
  const [suscripcionesRef, setSuscripcionesRef] = useState<SuscripcionResumen[]>([]);
  const [pagosRef] = useState<PagoResumen[]>([]);
  const [saludRef] = useState<SaludResumen[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalType, setModalType] = useState<"create" | "edit" | "delete" | null>(null);
  const [form, setForm] = useState<ClienteForm>(initialForm);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await clientesApi.getAll();
      setClientes(data);
    } catch {
      setError("Usando datos locales — backend no disponible");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchClientes();
  }, [fetchClientes]);

  const handleSelectCliente = async (cliente: ClientePerfil) => {
    setSelectedCliente(cliente);
    setIsLoadingPerfil(true);
    try {
      const result = await ticketsApi.getAll({ cliente_id: cliente.id });
      const tickets = result.data;
      setTicketsCliente(tickets.map(mapTicketToClienteTicket));

      const pedidos = [
        ...new Set(
          tickets
            .filter((t) => t.pedido_id_ref)
            .map((t) => t.pedido_id_ref!)
        ),
      ].map(
        (id) =>
          ({
            pedido_id: id,
            descripcion: "Pedido referenciado desde tickets",
            estado: "activo",
            fecha: new Date().toLocaleDateString("es-ES"),
            total: "—",
          }) as PedidoResumen
      );
      setPedidosRef(pedidos);

      const suscripciones = [
        ...new Set(
          tickets
            .filter((t) => t.suscripcion_id_ref)
            .map((t) => t.suscripcion_id_ref!)
        ),
      ].map(
        (id) =>
          ({
            suscripcion_id: id,
            plan: "Premium",
            ciclo: "Mensual",
            estado: "activo",
            renovacion: "—",
          }) as SuscripcionResumen
      );
      setSuscripcionesRef(suscripciones);
    } catch {
      setTicketsCliente([]);
      setPedidosRef([]);
      setSuscripcionesRef([]);
    } finally {
      setIsLoadingPerfil(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setFormError(null);
    setModalType("create");
  };

  const openEditModal = () => {
    if (!selectedCliente) return;
    setForm({
      nombre_completo: selectedCliente.nombre_completo,
      email: selectedCliente.email,
      telefono: selectedCliente.telefono ?? "",
      empresa: selectedCliente.empresa ?? "",
      direccion: "",
      ciudad: "",
      pais: "",
    });
    setFormError(null);
    setModalType("edit");
  };

  const openDeleteModal = () => {
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setForm(initialForm);
    setFormError(null);
  };

  const handleCrearCliente = async () => {
    if (!form.nombre_completo.trim() || !form.email.trim()) {
      setFormError("Nombre y email son obligatorios.");
      return;
    }
    try {
      setGuardando(true);
      setFormError(null);
      await clientesApi.crear({
        nombre_completo: form.nombre_completo,
        email: form.email,
        telefono: form.telefono || undefined,
        empresa: form.empresa || undefined,
        direccion: form.direccion || undefined,
        ciudad: form.ciudad || undefined,
        pais: form.pais || undefined,
      });
      closeModal();
      await fetchClientes();
    } catch {
      setFormError(
        "Error al crear el cliente. Verifica que el email no esté en uso."
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleSaveEdit = async () => {
    if (
      !selectedCliente ||
      !form.nombre_completo.trim() ||
      !form.email.trim()
    ) {
      setFormError("Nombre y email son obligatorios.");
      return;
    }
    try {
      setGuardando(true);
      setFormError(null);
      await clientesApi.actualizar(selectedCliente.id, {
        nombre_completo: form.nombre_completo,
        email: form.email,
        telefono: form.telefono || undefined,
        empresa: form.empresa || undefined,
      });
      closeModal();
      await fetchClientes();
      setSelectedCliente({
        ...selectedCliente,
        nombre_completo: form.nombre_completo,
        email: form.email,
        telefono: form.telefono,
        empresa: form.empresa,
      });
    } catch {
      setFormError("Error al actualizar el cliente.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDeleteCliente = async () => {
    if (!selectedCliente) return;
    try {
      setGuardando(true);
      await clientesApi.eliminar(selectedCliente.id);
      closeModal();
      setSelectedCliente(null);
      await fetchClientes();
    } catch {
      setFormError("Error al eliminar el cliente.");
    } finally {
      setGuardando(false);
    }
  };

  const handleTicketClick = (ticketId: string) => {
    router.push("/pages/tickets/" + ticketId);
  };

  const filtered = clientes.filter(
    (c) =>
      c.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.empresa ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Vista perfil
  if (selectedCliente) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#d9d9d9] bg-white">
          <button
            onClick={() => setSelectedCliente(null)}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a clientes
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={openEditModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3c6e71] border border-[#3c6e71] rounded-lg hover:bg-[#3c6e71] hover:text-white transition-colors"
            >
              <Pencil size={12} />
              Editar
            </button>
            <button
              onClick={openDeleteModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 size={12} />
              Eliminar
            </button>
          </div>
        </div>

        {isLoadingPerfil ? (
          <SkeletonProfile />
        ) : (
          <>
            <ClienteHeader cliente={selectedCliente} />

            {/* Tickets del cliente */}
            <div className="px-8 py-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#353535]">
                  Tickets del cliente
                </h3>
                <span className="text-sm text-[#6b7280]">
                  {ticketsCliente.length} ticket
                  {ticketsCliente.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t border-[#d9d9d9] pt-4">
                {ticketsCliente.length === 0 ? (
                  <EmptyState
                    icon={Ticket}
                    title="Sin tickets"
                    description="Este cliente no tiene tickets registrados."
                  />
                ) : (
                  <TicketsList
                    tickets={ticketsCliente}
                    onTicketClick={handleTicketClick}
                  />
                )}
              </div>

              {/* Referencias externas */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {/* Pedidos */}
                <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart size={16} className="text-[#284b63]" />
                    <h4 className="text-sm font-semibold text-[#353535]">
                      Pedidos
                    </h4>
                    <span className="text-xs text-[#6b7280] ml-auto">
                      {pedidosRef.length}
                    </span>
                  </div>
                  {pedidosRef.length === 0 ? (
                    <p className="text-xs text-[#9ca3af]">
                      Sin pedidos registrados
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pedidosRef.map((p) => (
                        <div
                          key={p.pedido_id}
                          className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="font-mono text-[#284b63]">
                            {p.pedido_id}
                          </span>
                          <span className="text-[#6b7280]">{p.estado}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suscripciones */}
                <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw size={16} className="text-[#3c6e71]" />
                    <h4 className="text-sm font-semibold text-[#353535]">
                      Suscripciones
                    </h4>
                    <span className="text-xs text-[#6b7280] ml-auto">
                      {suscripcionesRef.length}
                    </span>
                  </div>
                  {suscripcionesRef.length === 0 ? (
                    <p className="text-xs text-[#9ca3af]">
                      Sin suscripciones registradas
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {suscripcionesRef.map((s) => (
                        <div
                          key={s.suscripcion_id}
                          className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="font-mono text-[#3c6e71]">
                            {s.suscripcion_id}
                          </span>
                          <span className="text-[#6b7280]">{s.plan}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagos */}
                <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={16} className="text-[#6b7280]" />
                    <h4 className="text-sm font-semibold text-[#353535]">
                      Pagos
                    </h4>
                    <span className="text-xs text-[#6b7280] ml-auto">
                      {pagosRef.length}
                    </span>
                  </div>
                  {pagosRef.length === 0 ? (
                    <p className="text-xs text-[#9ca3af]">
                      Sin pagos registrados
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pagosRef.map((p) => (
                        <div
                          key={p.pago_id}
                          className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="font-mono text-[#6b7280]">
                            {p.pago_id}
                          </span>
                          <span className="text-[#6b7280]">{p.estado}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Salud */}
                <div className="bg-white border border-[#d9d9d9] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HeartPulse size={16} className="text-[#3c6e71]" />
                    <h4 className="text-sm font-semibold text-[#353535]">
                      Salud
                    </h4>
                    <span className="text-xs text-[#6b7280] ml-auto">
                      {saludRef.length}
                    </span>
                  </div>
                  {saludRef.length === 0 ? (
                    <p className="text-xs text-[#9ca3af]">
                      Sin registros de salud
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {saludRef.map((s) => (
                        <div
                          key={s.salud_ref}
                          className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="font-mono text-[#3c6e71]">
                            {s.salud_ref}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              s.nivel === "verde"
                                ? "bg-green-100 text-green-700"
                                : s.nivel === "amarillo"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {s.nivel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Crear / Editar */}
        {(modalType === "create" || modalType === "edit") && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
                <div>
                  <div className="text-base font-semibold text-[#353535]">
                    {modalType === "create" ? "Nuevo Cliente" : "Editar Cliente"}
                  </div>
                  <div className="text-xs text-[#6b7280] mt-0.5">
                    {modalType === "create"
                      ? "Completa los campos para registrar un nuevo cliente"
                      : "Modifica los datos del cliente"}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-[#6b7280] hover:text-[#353535] transition-colors p-1 rounded-lg hover:bg-gray-100"
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
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={form.nombre_completo}
                    onChange={handleFormChange}
                    placeholder="Ej: María González"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="Ej: maria@empresa.com"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#353535]">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleFormChange}
                      placeholder="+56 9 1234 5678"
                      className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#353535]">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={form.empresa}
                      onChange={handleFormChange}
                      placeholder="Ej: TechCorp"
                      className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleFormChange}
                    placeholder="Ej: Av. Principal 123"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#353535]">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleFormChange}
                      placeholder="Ej: Santiago"
                      className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#353535]">
                      País
                    </label>
                    <input
                      type="text"
                      name="pais"
                      value={form.pais}
                      onChange={handleFormChange}
                      placeholder="Ej: Chile"
                      className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
                <button
                  onClick={closeModal}
                  className="text-sm text-[#6b7280] border border-[#d9d9d9] px-4 py-2 rounded-lg hover:border-[#353535] hover:text-[#353535] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={modalType === "create" ? handleCrearCliente : handleSaveEdit}
                  disabled={
                    guardando ||
                    !form.nombre_completo.trim() ||
                    !form.email.trim()
                  }
                  className="flex items-center gap-2 bg-[#3c6e71] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando
                    ? "Guardando..."
                    : modalType === "create"
                    ? "Crear Cliente"
                    : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Eliminar */}
        {modalType === "delete" && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9d9d9]">
                <div className="text-base font-semibold text-[#353535]">
                  Eliminar Cliente
                </div>
                <button
                  onClick={closeModal}
                  className="text-[#6b7280] hover:text-[#353535] transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5">
                {formError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                    {formError}
                  </div>
                )}
                <p className="text-sm text-[#6b7280]">
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <strong className="text-[#353535]">
                    {selectedCliente?.nombre_completo}
                  </strong>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#d9d9d9]">
                <button
                  onClick={closeModal}
                  className="text-sm text-[#6b7280] border border-[#d9d9d9] px-4 py-2 rounded-lg hover:border-[#353535] hover:text-[#353535] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCliente}
                  disabled={guardando}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista lista de clientes
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Clientes
          </h1>
          <p className="text-sm text-[#6b7280]">
            {clientes.length} clientes registrados
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#3c6e71] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors"
        >
          + Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white mb-6 max-w-sm">
        <Search size={14} className="text-[#6b7280]" />
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o email..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="text-sm text-[#353535] bg-transparent outline-none w-full placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Tabla */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <div className="border border-[#d9d9d9] rounded-xl">
          <EmptyState
            icon={Users}
            title="No se encontraron clientes"
            description={
              search
                ? `No hay clientes que coincidan con "${search}".`
                : "Aún no hay clientes registrados en el sistema."
            }
            actionLabel={search ? "Limpiar búsqueda" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        </div>
      ) : (
        <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#284b63]">
                {["Nombre", "Email", "Teléfono", "Empresa", "Estado", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-white text-xs font-medium px-4 py-3 tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-[#d9d9d9] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSelectCliente(cliente)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-[#353535]">
                    {cliente.nombre_completo}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.telefono ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.empresa ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cliente.estado === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cliente.estado === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs text-[#3c6e71] hover:underline font-medium"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleSelectCliente(cliente);
                      }}
                    >
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear Cliente (desde la vista lista) */}
      {modalType === "create" && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
              <div>
                <div className="text-base font-semibold text-[#353535]">
                  Nuevo Cliente
                </div>
                <div className="text-xs text-[#6b7280] mt-0.5">
                  Completa los campos para registrar un nuevo cliente
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-[#6b7280] hover:text-[#353535] transition-colors p-1 rounded-lg hover:bg-gray-100"
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
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleFormChange}
                  placeholder="Ej: María González"
                  className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#353535]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Ej: maria@empresa.com"
                  className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleFormChange}
                    placeholder="+56 9 1234 5678"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={form.empresa}
                    onChange={handleFormChange}
                    placeholder="Ej: TechCorp"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#353535]">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleFormChange}
                  placeholder="Ej: Av. Principal 123"
                  className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleFormChange}
                    placeholder="Ej: Santiago"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#353535]">
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={form.pais}
                    onChange={handleFormChange}
                    placeholder="Ej: Chile"
                    className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="text-sm text-[#6b7280] border border-[#d9d9d9] px-4 py-2 rounded-lg hover:border-[#353535] hover:text-[#353535] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCliente}
                disabled={
                  guardando ||
                  !form.nombre_completo.trim() ||
                  !form.email.trim()
                }
                className="flex items-center gap-2 bg-[#3c6e71] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardando ? "Guardando..." : "Crear Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
