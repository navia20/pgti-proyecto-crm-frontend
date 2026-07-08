"use client";

import React from "react";
import { X, CreditCard, CheckCircle, XCircle, Clock, Hash, Building2 } from "lucide-react";
import { TransaccionUcnpay } from "../../lib/types/ticket.types";

interface PagoInfoModalProps {
  data: TransaccionUcnpay;
  onClose: () => void;
}

function getStatusConfig(status: string) {
  const upper = status.toUpperCase();
  if (upper.includes("APROBADO")) return { color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle };
  if (upper.includes("RECHAZADO")) return { color: "#ef4444", bg: "#fef2f2", icon: XCircle };
  return { color: "#eab308", bg: "#fefce8", icon: Clock };
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem" }}>
      <span style={{ color: "#6b7280", minWidth: "130px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#353535", fontWeight: 500 }}>{String(value)}</span>
    </div>
  );
}

export default function PagoInfoModal({ data, onClose }: PagoInfoModalProps) {
  const { paymentInfo } = data;
  const statusConfig = getStatusConfig(paymentInfo.status);
  const StatusIcon = statusConfig.icon;

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
          maxWidth: "500px",
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
              Información de Pago
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
              {data.transactionId}
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
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "0.25rem",
            backgroundColor: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.color}`,
          }}>
            <StatusIcon size={12} />
            {paymentInfo.status}
          </span>
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", backgroundColor: "#f0f7f7", color: "#3c6e71",
            border: "1px solid #3c6e71",
          }}>
            {paymentInfo.paymentType}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "1rem" }}>
          <Field label="Monto" value={`$${paymentInfo.amount.toLocaleString("es-CL")} ${paymentInfo.currency}`} />
          <Field label="Orden" value={data.orderId} />
          <Field label="Tipo operación" value={paymentInfo.operationType} />
          <Field label="Cuotas" value={paymentInfo.installments} />
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <CreditCard size={14} style={{ color: "#3c6e71" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#353535" }}>Datos de tarjeta</span>
          </div>
          <div style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <Field label="Emisor" value={paymentInfo.cardIssuer} />
            <Field label="Últimos 4 dígitos" value={`**** ${paymentInfo.last4Digits}`} />
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Hash size={14} style={{ color: "#3c6e71" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#353535" }}>Autorización</span>
          </div>
          <div style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <Field label="Código autorización" value={paymentInfo.authorizationCode} />
            <Field label="RRN" value={paymentInfo.rrn} />
          </div>
        </div>
      </div>
    </div>
  );
}
