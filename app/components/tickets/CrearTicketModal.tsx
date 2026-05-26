"use client";
import React from "react";
import "./CrearTicketModal.css";
import { useState } from "react";
import { X, Ticket, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  CrearTicketForm,
  TicketPrioridad,
  TicketCanal,
} from "../../lib/types/ticket.types";

interface CrearTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (form: CrearTicketForm) => void;
}

const canales: TicketCanal[] = ["Chat", "Email", "Telefono", "App"];
const prioridades: TicketPrioridad[] = ["Baja", "Media", "Alta", "Critica"];

const slaHoras: Record<TicketPrioridad, number> = {
  Critica: 8,
  Alta: 24,
  Media: 48,
  Baja: 72,
};

const mockClientes = [
  { id: 1, nombre: "María González" },
  { id: 2, nombre: "Carlos Rodríguez" },
  { id: 3, nombre: "Ana Martínez" },
  { id: 4, nombre: "Pedro Sánchez" },
];

const initialForm: CrearTicketForm = {
  cliente_id: null,
  asunto: "",
  prioridad: "Media",
  canal: "Email",
  descripcion: "",
  pedido_id_ref: "",
  suscripcion_id_ref: "",
};

function getSlaClass(prioridad: TicketPrioridad): string {
  if (prioridad === "Critica") return "modal__sla-preview--critical";
  if (prioridad === "Alta") return "modal__sla-preview--warning";
  return "";
}

export default function CrearTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CrearTicketModalProps) {
  const [form, setForm] = useState<CrearTicketForm>(initialForm);
  const [showOpcionales, setShowOpcionales] = useState(false);

  if (!isOpen) return null;

  const isValid =
    form.cliente_id !== null &&
    form.asunto.trim() !== "" &&
    form.descripcion.trim() !== "";

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setForm((prev: CrearTicketForm) => ({
    ...prev,
    [name]: name === "cliente_id" ? Number(value) : value,
  }));
};

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit?.(form);
    setForm(initialForm);
    setShowOpcionales((prev: boolean) => !prev);
    onClose();
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
          {/* Cliente */}
          <div className="modal__field">
            <label className="modal__label modal__label--required">
              Cliente
            </label>
            <select
              name="cliente_id"
              value={form.cliente_id ?? ""}
              onChange={handleChange}
              className="modal__select"
            >
              <option value="">Selecciona un cliente...</option>
              {mockClientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
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
                    {c}
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
                    {p}
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
              placeholder="Describe el problema en detalle. Incluye pasos para reproducirlo, mensajes de error, etc."
              className="modal__textarea"
            />
          </div>

          {/* Campos opcionales */}
          <div>
            <button
              className="modal__optional-toggle"
              onClick={() => setShowOpcionales((prev) => !prev)}
            >
              {showOpcionales ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              {showOpcionales ? "Ocultar" : "Mostrar"} campos opcionales
              (referencias externas)
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