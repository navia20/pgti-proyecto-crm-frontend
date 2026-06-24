import "./ClienteHeader.css";
import React from "react";
import { Building2, MapPin, Calendar, Mail, Phone } from "lucide-react";
import { ClientePerfil } from "../../lib/types/cliente.types";

interface ClienteHeaderProps {
  cliente: ClientePerfil;
}

export default function ClienteHeader({ cliente }: ClienteHeaderProps) {
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
                {estadoCliente === "active" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="cliente-header__meta">
              {empresa !== "—" && (
                <span className="cliente-header__meta-item">
                  <Building2 size={13} />
                  {empresa}
                </span>
              )}
              {ubicacion !== "—" && (
                <span className="cliente-header__meta-item">
                  <MapPin size={13} />
                  {ubicacion}
                </span>
              )}
              <span className="cliente-header__meta-item">
                <Calendar size={13} />
                Cliente desde {desde}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="cliente-header__contact">
        <div className="cliente-header__contact-item">
          <Mail size={13} className="cliente-header__contact-label" />
          <span className="cliente-header__contact-label">Email</span>
          {cliente.email}
        </div>
        <div className="cliente-header__contact-item">
          <Phone size={13} className="cliente-header__contact-label" />
          <span className="cliente-header__contact-label">Teléfono</span>
          {telefono}
        </div>
      </div>
    </div>
  );
}