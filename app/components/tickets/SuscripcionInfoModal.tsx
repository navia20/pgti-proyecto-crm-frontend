"use client";

import React from "react";
import { X, FileText, Package, CreditCard } from "lucide-react";
import { ContratoCenit, PlanCenit, PagoCenit } from "../../lib/types/ticket.types";

interface SuscripcionInfoModalProps {
  contrato: ContratoCenit;
  plan: PlanCenit | null;
  pagos: PagoCenit[];
  onVerPagos: () => void;
  onClose: () => void;
}

const contratoStatusColors: Record<string, string> = {
  ACTIVE: "#16a34a",
  TERMINATED: "#6b7280",
  SUSPENDED: "#eab308",
  DRAFT: "#3b82f6",
  CANCELLED: "#ef4444",
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
      <span style={{ color: "#6b7280", minWidth: "130px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#353535", fontWeight: 500 }}>{String(value)}</span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMoney(amount: string): string {
  const num = parseFloat(amount);
  return `$${num.toLocaleString("es-CL")}`;
}

export default function SuscripcionInfoModal({ contrato, plan, pagos, onVerPagos, onClose }: SuscripcionInfoModalProps) {
  const statusColor = contratoStatusColors[contrato.status] || "#6b7280";

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
              Información de Suscripción
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
              Contrato #{contrato.id_contracts} · {contrato.id_users}
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
            borderRadius: "9999px", backgroundColor: statusColor, color: "#fff",
          }}>
            {contrato.status}
          </span>
          {plan && (
            <span style={{
              fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
              borderRadius: "9999px", backgroundColor: "#f0f7f7", color: "#3c6e71",
              border: "1px solid #3c6e71",
            }}>
              {plan.name} · {formatMoney(plan.amount)}/mes
            </span>
          )}
        </div>

        <Section title="Contrato" icon={FileText}>
          <Field label="ID Contrato" value={contrato.id_contracts} />
          <Field label="Estado" value={contrato.status} />
          <Field label="Fecha inicio" value={formatDate(contrato.start_date)} />
          <Field label="Fecha fin" value={formatDate(contrato.end_date)} />
          <Field label="Última actualización" value={formatDate(contrato.updated_at)} />
        </Section>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <Section title="Plan / Suscripción" icon={Package}>
          {plan ? (
            <>
              <Field label="Nombre" value={plan.name} />
              <Field label="Ciclo de facturación" value={plan.billing_cycle === "monthly" ? "Mensual" : plan.billing_cycle} />
              <Field label="Monto" value={formatMoney(plan.amount)} />
              <Field label="Estado" value={plan.isActive ? "Activo ✓" : "Inactivo"} />
            </>
          ) : (
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>No se pudo cargar la información del plan.</span>
          )}
        </Section>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <button
          onClick={onVerPagos}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            width: "100%",
            justifyContent: "center",
            padding: "0.5rem 0.75rem",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "#3c6e71",
            backgroundColor: "#f0f7f7",
            border: "1px solid #3c6e71",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <CreditCard size={14} />
          Ver historial de pagos ({pagos.length})
        </button>
      </div>
    </div>
  );
}
