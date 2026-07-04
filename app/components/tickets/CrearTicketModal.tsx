import React, { useState, useMemo } from "react";
import "./CrearTicketModal.css";
import { X, Ticket, Clock, ChevronDown, ChevronUp, Search, User, Plus, UserPlus } from "lucide-react";
import {
  CrearTicketForm,
  TicketPrioridad,
  TicketCanal,
} from "../../lib/types/ticket.types";
import { ClientePerfil } from "../../lib/types/cliente.types";

interface CrearTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (form: CrearTicketForm) => void;
  onCrearCliente?: (cliente: { nombre_completo: string; email: string; telefono?: string }) => Promise<ClientePerfil>;
  clientes?: ClientePerfil[];
}

const canales: TicketCanal[] = ["chat", "email", "telefono", "app"];
const prioridades: TicketPrioridad[] = ["baja", "media", "alta", "critica"];

const slaHoras: Record<TicketPrioridad, number> = {
  critica: 8,
  alta: 24,
  media: 48,
  baja: 72,
};

const initialForm: CrearTicketForm = {
  cliente_id: null,
  asunto: "",
  prioridad: "media",
  canal: "email",
  descripcion: "",
  pedido_id_ref: "",
  suscripcion_id_ref: "",
};

const initialClienteForm = {
  nombre_completo: "",
  email: "",
  telefono: "",
};

function getSlaClass(prioridad: TicketPrioridad): string {
  if (prioridad === "critica") return "modal__sla-preview--critical";
  if (prioridad === "alta") return "modal__sla-preview--warning";
  return "";
}

export default function CrearTicketModal({
  isOpen,
  onClose,
  onSubmit,
  onCrearCliente,
  clientes = [],
}: CrearTicketModalProps) {
  const [form, setForm] = useState<CrearTicketForm>(initialForm);
  const [showOpcionales, setShowOpcionales] = useState(false);
  const [clienteSearch, setClienteSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCrearCliente, setShowCrearCliente] = useState(false);
  const [clienteForm, setClienteForm] = useState(initialClienteForm);
  const [guardandoCliente, setGuardandoCliente] = useState(false);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);

  const clienteSeleccionado = useMemo(() => {
    if (!form.cliente_id) return null;
    return clientes.find((c) => c.id === form.cliente_id) ?? null;
  }, [form.cliente_id, clientes]);

  const clientesFiltrados = useMemo(() => {
    if (!clienteSearch.trim()) return [];
    const query = clienteSearch.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nombre_completo.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.telefono ?? "").toLowerCase().includes(query)
    );
  }, [clienteSearch, clientes]);

  if (!isOpen) return null;

  const isValid =
    form.cliente_id !== null &&
    form.asunto.trim() !== "" &&
    form.descripcion.trim() !== "";

  const isValidCliente = clienteForm.nombre_completo.trim() && clienteForm.email.trim();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: CrearTicketForm) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClienteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCliente = (cliente: ClientePerfil) => {
    setForm((prev) => ({ ...prev, cliente_id: cliente.id }));
    setClienteSearch("");
    setShowDropdown(false);
  };

  const handleClearCliente = () => {
    setForm((prev) => ({ ...prev, cliente_id: null }));
    setClienteSearch("");
  };

  const handleCrearCliente = async () => {
    if (!onCrearCliente || !isValidCliente) return;
    try {
      setGuardandoCliente(true);
      setErrorCliente(null);
      const nuevoCliente = await onCrearCliente({
        nombre_completo: clienteForm.nombre_completo,
        email: clienteForm.email,
        telefono: clienteForm.telefono || undefined,
      });
      setForm((prev) => ({ ...prev, cliente_id: nuevoCliente.id }));
      setClienteForm(initialClienteForm);
      setShowCrearCliente(false);
      setClienteSearch("");
      setShowDropdown(false);
    } catch {
      setErrorCliente("Error al crear el cliente. Verifica que el email no esté en uso.");
    } finally {
      setGuardandoCliente(false);
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit?.(form);
    setForm(initialForm);
    setClienteSearch("");
    setShowOpcionales(false);
    setShowCrearCliente(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const horas = slaHoras[form.prioridad];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <div>
            <div className="modal__title">Crear Nuevo Ticket</div>
            <div className="modal__subtitle">
              Complete los campos obligatorios para abrir el ticket
            </div>
          </div>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {/* Cliente con búsqueda */}
          <div className="modal__field">
            <label className="modal__label modal__label--required">
              Cliente
            </label>

            {clienteSeleccionado ? (
              <div className="modal__cliente-selected">
                <div className="modal__cliente-info">
                  <User size={16} className="text-[#3c6e71]" />
                  <div>
                    <div className="text-sm font-medium text-[#353535]">
                      {clienteSeleccionado.nombre_completo}
                    </div>
                    <div className="text-xs text-[#6b7280]">
                      {clienteSeleccionado.email}
                      {clienteSeleccionado.telefono && ` · ${clienteSeleccionado.telefono}`}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearCliente}
                  className="text-xs text-[#6b7280] hover:text-red-500 transition-colors"
                >
                  Cambiar
                </button>
              </div>
            ) : showCrearCliente ? (
              <div className="modal__crear-cliente">
                <div className="modal__crear-cliente-header">
                  <UserPlus size={14} className="text-[#3c6e71]" />
                  <span className="text-sm font-medium text-[#353535]">Nuevo Cliente</span>
                  <button
                    type="button"
                    onClick={() => { setShowCrearCliente(false); setErrorCliente(null); setClienteForm(initialClienteForm); }}
                    className="ml-auto text-xs text-[#6b7280] hover:text-[#353535]"
                  >
                    Cancelar
                  </button>
                </div>

                {errorCliente && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
                    {errorCliente}
                  </div>
                )}

                <div className="modal__crear-cliente-fields">
                  <input
                    type="text"
                    name="nombre_completo"
                    value={clienteForm.nombre_completo}
                    onChange={handleClienteFormChange}
                    placeholder="Nombre completo *"
                    className="modal__input modal__input--small"
                  />
                  <input
                    type="email"
                    name="email"
                    value={clienteForm.email}
                    onChange={handleClienteFormChange}
                    placeholder="Email *"
                    className="modal__input modal__input--small"
                  />
                  <input
                    type="tel"
                    name="telefono"
                    value={clienteForm.telefono}
                    onChange={handleClienteFormChange}
                    placeholder="Teléfono (opcional)"
                    className="modal__input modal__input--small"
                  />
                  <button
                    type="button"
                    onClick={handleCrearCliente}
                    disabled={!isValidCliente || guardandoCliente}
                    className="modal__btn-crear-cliente"
                  >
                    {guardandoCliente ? "Guardando..." : "Crear y seleccionar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal__search-wrapper">
                <Search size={14} className="modal__search-icon" />
                <input
                  type="text"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Buscar por nombre, email o teléfono..."
                  className="modal__input modal__input--search"
                />
                {showDropdown && (
                  <div className="modal__dropdown">
                    {clientesFiltrados.length > 0 && (
                      <>
                        {clientesFiltrados.slice(0, 6).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="modal__dropdown-item"
                            onMouseDown={() => handleSelectCliente(c)}
                          >
                            <div className="font-medium text-[#353535] text-sm">
                              {c.nombre_completo}
                            </div>
                            <div className="text-xs text-[#6b7280]">
                              {c.email}
                              {c.telefono && ` · ${c.telefono}`}
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                    {clientesFiltrados.length === 0 && !clienteSearch && (
                      <div className="modal__dropdown modal__dropdown--empty">
                        Escribe para buscar un cliente...
                      </div>
                    )}
                    {clientesFiltrados.length === 0 && clienteSearch && (
                      <div className="modal__dropdown modal__dropdown--empty">
                        No se encontraron clientes con &quot;{clienteSearch}&quot;
                      </div>
                    )}
                    <button
                      type="button"
                      className="modal__dropdown-add"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowCrearCliente(true);
                        setShowDropdown(false);
                        setClienteSearch("");
                      }}
                    >
                      <Plus size={14} />
                      Crear nuevo cliente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Asunto */}
          <div className="modal__field">
            <label className="modal__label modal__label--required">
              Asunto
            </label>
            <input
              type="text"
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              placeholder="Describe brevemente el problema..."
              className="modal__input"
              maxLength={120}
            />
          </div>

          {/* Canal + Prioridad */}
          <div className="modal__field-row">
            <div className="modal__field">
              <label className="modal__label modal__label--required">
                Canal
              </label>
              <select
                name="canal"
                value={form.canal}
                onChange={handleChange}
                className="modal__select"
              >
                {canales.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal__field">
              <label className="modal__label modal__label--required">
                Prioridad
              </label>
              <select
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                className="modal__select"
              >
                {prioridades.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SLA preview */}
          <div className={`modal__sla-preview ${getSlaClass(form.prioridad)}`}>
            <Clock size={14} />
            SLA asignado automáticamente:{" "}
            <strong>{horas} horas</strong> para resolución
          </div>

          {/* Descripción */}
          <div className="modal__field">
            <label className="modal__label modal__label--required">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el problema en detalle..."
              className="modal__textarea"
            />
          </div>

          {/* Campos opcionales */}
          <div>
            <button
              className="modal__optional-toggle"
              onClick={() => setShowOpcionales((prev: boolean) => !prev)}
            >
              {showOpcionales ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showOpcionales ? "Ocultar" : "Mostrar"} campos opcionales
            </button>

            {showOpcionales && (
              <div className="modal__optional-section">
                <div className="modal__field-row">
                  <div className="modal__field">
                    <label className="modal__label">ID Pedido</label>
                    <input
                      type="text"
                      name="pedido_id_ref"
                      value={form.pedido_id_ref}
                      onChange={handleChange}
                      placeholder="ped-123"
                      className="modal__input"
                    />
                    <span className="modal__hint">
                      Referencia al Proyecto 3 (Pedidos)
                    </span>
                  </div>
                  <div className="modal__field">
                    <label className="modal__label">ID Suscripción</label>
                    <input
                      type="text"
                      name="suscripcion_id_ref"
                      value={form.suscripcion_id_ref}
                      onChange={handleChange}
                      placeholder="sus-456"
                      className="modal__input"
                    />
                    <span className="modal__hint">
                      Referencia al Proyecto 10 (Suscripciones)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <button className="modal__btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="modal__btn-submit"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            <Ticket size={15} />
            Crear Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
