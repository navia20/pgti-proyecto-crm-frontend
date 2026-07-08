"use client";

import React, { useState } from "react";
import { X, Copy, Check, Link } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CompartirEnlaceModalProps {
  url: string;
  ticketId: string;
  onClose: () => void;
}

export default function CompartirEnlaceModal({ url, ticketId, onClose }: CompartirEnlaceModalProps) {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          borderRadius: "16px",
          padding: "1.5rem",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link size={16} style={{ color: "#3c6e71" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#353535" }}>Compartir enlace</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* URL input + copy */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.35rem", display: "block" }}>
            Enlace para el cliente
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              readOnly
              value={url}
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
                fontSize: "0.8rem",
                color: "#353535",
                background: "#f9fafb",
                outline: "none",
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopiar}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.5rem 0.85rem",
                borderRadius: "8px",
                border: "none",
                background: copiado ? "#dcfce7" : "#3c6e71",
                color: copiado ? "#166534" : "#fff",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {copiado ? <Check size={14} /> : <Copy size={14} />}
              {copiado ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Escanea para acceder al ticket
          </span>
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <QRCodeSVG
              value={url}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#353535"
              includeMargin={false}
            />
          </div>
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
            Ticket {ticketId}
          </span>
        </div>
      </div>
    </div>
  );
}
