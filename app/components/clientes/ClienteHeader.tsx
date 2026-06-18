import "./ClienteHeader.css";
import React from "react";
import {
  Building2, MapPin, Calendar,
  Mail, Phone, MessageSquare, MoreHorizontal,
} from "lucide-react";
import { ClientePerfil, ClienteSalud } from "../../lib/types/cliente.types";

interface ClienteHeaderProps {
  cliente: ClientePerfil;
  salud?: ClienteSalud;
}

const saludLabel: Record<string, string> = {
  verde: "Salud: Buena",
  amarillo: "Salud: En riesgo",
  rojo: "Salud: Crítica",
};

export default function ClienteHeader({ cliente, salud }: ClienteHeaderProps) {
  const nombre = cliente.nombre_completo;
  const empresa = cliente.empresa ?? cliente.company ?? "—";
  const ubicacion = cliente.ubicacion ?? cliente.location ?? "—";
  const desde = cliente.customerSince ??
    new Date(cliente.creado_en).toLocaleDateString("es-ES", {
      month: "long", year: "numeric",
    });
  const telefono = cliente.telefono ?? cliente.phone ?? "—";
  const estadoCliente = cliente.estado ?? cliente.status ?? "inactive";

  return (
    <div className="cliente-header">
      <div className="cliente-header__top">
        {/* Identidad */}
        <div className="cliente-header__identity">
          <div className="cliente-header__avatar">
            {nombre.charAt(0)}
          </div>
          <div className="cliente-header__info">
            <div className="cliente-header__name">
              {nombre}
              <span className={`cliente-header__status cliente-header__status--${estadoCliente}`}>
                {estadoCliente === "active" ? "active" : "inactive"}
              </span>
              {/* Indicador de salud */}
              {salud && (
                <span className={`cliente-header__salud cliente-header__salud--${salud.nivel}`}>
                  <span className={`cliente-header__salud-dot cliente-header__salud-dot--${salud.nivel}`} />
                  {saludLabel[salud.nivel]}
                </span>
              )}
            </div>
            <div className="cliente-header__meta">
              <span className="cliente-header__meta-item">
                <Building2 size={13} />
                {empresa}
              </span>
              <span className="cliente-header__meta-item">
                <MapPin size={13} />
                {ubicacion}
              </span>
              <span className="cliente-header__meta-item">
                <Calendar size={13} />
                Cliente desde {desde}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="cliente-header__actions">
          <button className="cliente-header__action-btn">
            <Mail size={14} />
            Email
          </button>
          <button className="cliente-header__action-btn">
            <Phone size={14} />
            Llamar
          </button>
          <button className="cliente-header__action-btn">
            <MessageSquare size={14} />
            Mensaje
          </button>
          <button className="cliente-header__action-btn cliente-header__action-btn--more">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Contacto */}
      <div className="cliente-header__contact">
        <div className="cliente-header__contact-item">
          <span className="cliente-header__contact-label">Email</span>
          {cliente.email}
        </div>
        <div className="cliente-header__contact-item">
          <span className="cliente-header__contact-label">Teléfono</span>
          {telefono}
        </div>
      </div>
    </div>
  );
}