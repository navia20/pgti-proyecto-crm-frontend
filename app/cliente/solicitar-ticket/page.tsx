"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Ticket } from "lucide-react";
import { solicitudesApi } from "../../lib/api/solicitudes.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^(\+569\d{8}|9\d{8})$/;

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  asunto?: string;
  descripcion?: string;
}

function validate(nombre: string, email: string, telefono: string, asunto: string, descripcion: string): FormErrors {
  const errors: FormErrors = {};

  if (!nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (nombre.trim().length > 100) {
    errors.nombre = "El nombre no puede superar 100 caracteres";
  }

  if (!email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Ingresa un email válido";
  }

  if (telefono.trim() && !TELEFONO_REGEX.test(telefono.trim())) {
    errors.telefono = "Formato: +569XXXXXXXX o 9XXXXXXXX";
  }

  if (!asunto.trim()) {
    errors.asunto = "El asunto es obligatorio";
  } else if (asunto.trim().length > 100) {
    errors.asunto = "El asunto no puede superar 100 caracteres";
  }

  if (!descripcion.trim()) {
    errors.descripcion = "La descripción es obligatoria";
  } else if (descripcion.trim().length > 500) {
    errors.descripcion = "La descripción no puede superar 500 caracteres";
  }

  return errors;
}

export default function SolicitarTicketPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const formErrors = validate(nombre, email, telefono, asunto, descripcion);
  const isValid = Object.keys(formErrors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(nombre, email, telefono, asunto, descripcion));
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "nombre": setNombre(value); break;
      case "email": setEmail(value); break;
      case "telefono": setTelefono(value); break;
      case "asunto": setAsunto(value); break;
      case "descripcion": setDescripcion(value); break;
    }
    if (touched[field]) {
      setErrors(validate(
        field === "nombre" ? value : nombre,
        field === "email" ? value : email,
        field === "telefono" ? value : telefono,
        field === "asunto" ? value : asunto,
        field === "descripcion" ? value : descripcion,
      ));
    }
  };

  const showFieldError = (field: keyof FormErrors) => touched[field] && errors[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, telefono: true, asunto: true, descripcion: true });
    const validationErrors = validate(nombre, email, telefono, asunto, descripcion);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setEnviando(true);
    setError(null);

    try {
      await solicitudesApi.crear({
        nombre,
        email,
        telefono: telefono || undefined,
        asunto,
        descripcion,
      });
      setExito(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud");
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-[#d9d9d9] p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-[#353535] mb-3">
            Solicitud enviada
          </h1>
          <p className="text-[#6b7280] mb-6">
            Tu solicitud fue recibida correctamente. Recibirás un correo electrónico cuando sea revisada por nuestro equipo.
          </p>
          <button
            onClick={() => {
              setExito(false);
              setNombre("");
              setEmail("");
              setTelefono("");
              setAsunto("");
              setDescripcion("");
            }}
            className="px-6 py-2.5 bg-[#3c6e71] text-white rounded-lg font-medium hover:bg-[#2f5f62] transition-colors"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-[#d9d9d9] max-w-lg w-full overflow-hidden">
        <div className="bg-[#3c6e71] px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Ticket size={24} className="text-white" />
            <h1 className="text-xl font-semibold text-white">
              Solicitar soporte
            </h1>
          </div>
          <p className="text-teal-100 text-sm">
            Cuéntanos tu problema y te contactaremos pronto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Nombre completo *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              onBlur={() => handleBlur("nombre")}
              maxLength={100}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent ${showFieldError("nombre") ? "border-red-400" : "border-[#d9d9d9]"}`}
              placeholder="Tu nombre"
            />
            {showFieldError("nombre") && (
              <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Email *
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent ${showFieldError("email") ? "border-red-400" : "border-[#d9d9d9]"}`}
              placeholder="tu@email.com"
            />
            {showFieldError("email") && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Teléfono <span className="text-[#9ca3af]">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              onBlur={() => handleBlur("telefono")}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent ${showFieldError("telefono") ? "border-red-400" : "border-[#d9d9d9]"}`}
              placeholder="+569XXXXXXXX"
            />
            {showFieldError("telefono") && (
              <p className="text-xs text-red-600 mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Asunto *
            </label>
            <input
              type="text"
              required
              value={asunto}
              onChange={(e) => handleChange("asunto", e.target.value)}
              onBlur={() => handleBlur("asunto")}
              maxLength={100}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent ${showFieldError("asunto") ? "border-red-400" : "border-[#d9d9d9]"}`}
              placeholder="Resumen breve del problema"
            />
            {showFieldError("asunto") && (
              <p className="text-xs text-red-600 mt-1">{errors.asunto}</p>
            )}
            <p className="text-xs text-[#9ca3af] mt-1">{asunto.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              onBlur={() => handleBlur("descripcion")}
              maxLength={500}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent resize-none ${showFieldError("descripcion") ? "border-red-400" : "border-[#d9d9d9]"}`}
              placeholder="Describe tu problema con detalle..."
            />
            {showFieldError("descripcion") && (
              <p className="text-xs text-red-600 mt-1">{errors.descripcion}</p>
            )}
            <p className="text-xs text-[#9ca3af] mt-1">{descripcion.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={enviando || !isValid}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#3c6e71] text-white rounded-lg font-medium hover:bg-[#2f5f62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={16} />
                Enviar solicitud
              </>
            )}
          </button>

          <p className="text-xs text-[#9ca3af] text-center">
            Máximo 3 solicitudes por hora. Serás contactado por email.
          </p>
        </form>
      </div>
    </div>
  );
}
