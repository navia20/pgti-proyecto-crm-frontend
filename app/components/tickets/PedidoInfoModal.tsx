"use client";

import React from "react";
import { X, User, MapPin, Package, ShoppingCart } from "lucide-react";
import { PedidoOrden } from "../../lib/types/ticket.types";

interface PedidoInfoModalProps {
  data: PedidoOrden;
  onClose: () => void;
}

const estadoColors: Record<string, string> = {
  CONFIRMADO: "#16a34a",
  PENDIENTE: "#eab308",
  ENVIADO: "#3b82f6",
  ENTREGADO: "#6b7280",
  CANCELADO: "#ef4444",
};

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <Icon size={14} style={{ color: "#3c6e71" }} />
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#353535" }}>{title}</span>
      </div>
      <div style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem" }}>
      <span style={{ color: "#6b7280", minWidth: "110px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#353535", fontWeight: 500 }}>{String(value)}</span>
    </div>
  );
}

export default function PedidoInfoModal({ data, onClose }: PedidoInfoModalProps) {
  const color = estadoColors[data.estado] || "#6b7280";

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "520px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#353535", margin: 0 }}>
              Orden de Pedido
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
              {data.id_canal}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "#6b7280" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", backgroundColor: color, color: "#fff",
          }}>
            {data.estado}
          </span>
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", backgroundColor: "#f0f7f7", color: "#3c6e71",
            border: "1px solid #3c6e71",
          }}>
            {data.prioridad}
          </span>
        </div>

        <Field label="ID" value={data.id} />
        <Field
          label="Fecha creación"
          value={new Date(data.fecha_creacion).toLocaleString("es-ES")}
        />

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <Section title="Cliente" icon={User}>
          <Field label="Nombre" value={data.cliente.nombre} />
          <Field label="Email" value={data.cliente.email} />
          <Field label="Teléfono" value={data.cliente.telefono} />
        </Section>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <Section title="Dirección de Envío" icon={MapPin}>
          <Field label="Calle" value={`${data.direccion_envio.calle} ${data.direccion_envio.numero}`} />
          <Field label="Ciudad" value={data.direccion_envio.ciudad} />
          <Field label="Región" value={data.direccion_envio.region} />
          <Field label="País" value={data.direccion_envio.pais} />
          <Field label="Código postal" value={data.direccion_envio.codigo_postal} />
        </Section>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <Section title="Items" icon={Package}>
          {data.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.4rem 0.6rem",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                fontSize: "0.78rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShoppingCart size={12} style={{ color: "#6b7280" }} />
                <span style={{ fontWeight: 500 }}>{item.sku}</span>
                <span style={{ color: "#6b7280" }}>x{item.cantidad}</span>
              </div>
              <span style={{ fontWeight: 500 }}>
                ${item.precio_unitario.toLocaleString("es-CL")}
                {item.descuento > 0 && (
                  <span style={{ color: "#ef4444", marginLeft: "0.25rem" }}>
                    (-${item.descuento.toLocaleString("es-CL")})
                  </span>
                )}
              </span>
            </div>
          ))}
        </Section>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", paddingLeft: "1.25rem" }}>
          <Field label="Subtotal" value={`$${data.subtotal.toLocaleString("es-CL")}`} />
          <Field label="Impuestos" value={`$${data.impuestos.toLocaleString("es-CL")}`} />
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>
            <span style={{ color: "#353535", minWidth: "110px", flexShrink: 0 }}>Total:</span>
            <span style={{ color: "#16a34a" }}>${data.total.toLocaleString("es-CL")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
