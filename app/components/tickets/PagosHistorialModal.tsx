"use client";

import React from "react";
import { X, ArrowLeft, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { PagoCenit } from "../../lib/types/ticket.types";

interface PagosHistorialModalProps {
  pagos: PagoCenit[];
  idUsers: string;
  onBack: () => void;
  onClose: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  APROBADO: { color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle },
  RECHAZADO: { color: "#ef4444", bg: "#fef2f2", icon: XCircle },
  PENDIENTE: { color: "#eab308", bg: "#fefce8", icon: Clock },
};

function formatMoney(amount: string): string {
  const num = parseFloat(amount);
  return `$${num.toLocaleString("es-CL")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PagosHistorialModal({ pagos, idUsers, onBack, onClose }: PagosHistorialModalProps) {
  const aprobados = pagos.filter((p) => p.status === "APROBADO").length;
  const rechazados = pagos.filter((p) => p.status === "RECHAZADO").length;
  const pendientes = pagos.filter((p) => p.status === "PENDIENTE").length;
  const total = pagos.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "600px",
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
              Historial de Pagos
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
              {idUsers}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "#6b7280" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem", borderRadius: "9999px", backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #16a34a" }}>
            {aprobados} aprobados
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem", borderRadius: "9999px", backgroundColor: "#fef2f2", color: "#ef4444", border: "1px solid #ef4444" }}>
            {rechazados} rechazados
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem", borderRadius: "9999px", backgroundColor: "#fefce8", color: "#eab308", border: "1px solid #eab308" }}>
            {pendientes} pendientes
          </span>
        </div>

        {pagos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280", fontSize: "0.85rem" }}>
            No hay pagos registrados para este usuario.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {pagos.map((pago) => {
              const config = statusConfig[pago.status] || statusConfig.PENDIENTE;
              const StatusIcon = config.icon;
              return (
                <div
                  key={pago.id_payments}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: config.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <StatusIcon size={14} style={{ color: config.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#353535", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {pago.concept}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                      {formatDate(pago.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#353535" }}>
                      {formatMoney(pago.amount)}
                    </div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 500, color: config.color }}>
                      {pago.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Total histórico:
          </span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#353535" }}>
            {formatMoney(String(total))}
          </span>
        </div>

        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            marginTop: "1rem",
            padding: "0.4rem 0.75rem",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "#3c6e71",
            backgroundColor: "#f0f7f7",
            border: "1px solid #3c6e71",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={12} />
          Volver a suscripción
        </button>
      </div>
    </div>
  );
}
