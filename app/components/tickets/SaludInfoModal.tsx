"use client";

import React from "react";
import { X, User, Stethoscope, Calendar, MapPin, Clock } from "lucide-react";
import { SaludIncidente } from "../../lib/types/ticket.types";

interface SaludInfoModalProps {
  data: SaludIncidente;
  onClose: () => void;
}

const severidadColors: Record<string, string> = {
  BAJA: "#6b7280",
  MEDIA: "#eab308",
  ALTA: "#f97316",
  CRITICA: "#ef4444",
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

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem" }}>
      <span style={{ color: "#6b7280", minWidth: "110px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#353535", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function SaludInfoModal({ data, onClose }: SaludInfoModalProps) {
  const color = severidadColors[data.severidad] || "#6b7280";

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
              Incidente de Salud
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
              {data.id}
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
            {data.severidad}
          </span>
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", backgroundColor: "#f0f7f7", color: "#3c6e71",
            border: "1px solid #3c6e71",
          }}>
            {data.tipo}
          </span>
          <span style={{
            fontSize: "0.72rem", fontWeight: 500, padding: "0.2rem 0.6rem",
            borderRadius: "9999px", backgroundColor: "#f3f4f6", color: "#353535",
          }}>
            {data.origen}
          </span>
        </div>

        <Field label="Título" value={data.titulo} />
        <Field
          label="Fecha creación"
          value={new Date(data.createdAt).toLocaleString("es-ES")}
        />

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />

        <Section title="Paciente" icon={User}>
          <Field label="RUT" value={data.paciente.rut} />
          <Field label="Nombre" value={`${data.paciente.nombres} ${data.paciente.apellidos}`} />
          <Field label="Email" value={data.paciente.email} />
          <Field label="Teléfono" value={data.paciente.telefono} />
          <Field label="Fecha nacimiento" value={data.paciente.fechaNacimiento} />
          <Field label="Sexo" value={data.paciente.sexo === "M" ? "Masculino" : data.paciente.sexo === "F" ? "Femenino" : data.paciente.sexo} />
          <Field label="Dirección" value={data.paciente.direccion} />
        </Section>

        {data.visita && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />
            <Section title="Visita" icon={Calendar}>
              <Field label="Fecha" value={data.visita.fechaProgramada} />
              <Field label="Hora" value={data.visita.horaProgramada} />
              <Field label="Estado" value={data.visita.estado} />
              <Field label="Duración est." value={`${data.visita.duracionEstimadaMin} min`} />
              <Field label="Prioridad" value={data.visita.prioridad} />
              {data.visita.checkInAt && (
                <Field label="Check-in" value={new Date(data.visita.checkInAt).toLocaleString("es-ES")} />
              )}
              {data.visita.checkOutAt && (
                <Field label="Check-out" value={new Date(data.visita.checkOutAt).toLocaleString("es-ES")} />
              )}
            </Section>
          </>
        )}

        {data.profesionalSalud && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" }} />
            <Section title="Profesional de Salud" icon={Stethoscope}>
              <Field label="Profesión" value={data.profesionalSalud.profesion} />
              <Field label="N° Registro" value={data.profesionalSalud.numeroRegistro} />
              <Field label="Nombre" value={`${data.profesionalSalud.nombres} ${data.profesionalSalud.apellidos}`} />
              <Field label="Email" value={data.profesionalSalud.email} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
