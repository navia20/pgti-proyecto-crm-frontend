"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Ticket } from "lucide-react";
import { solicitudesApi } from "../../lib/api/solicitudes.api";

export default function SolicitarTicketPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Teléfono <span className="text-[#9ca3af]">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent"
              placeholder="+569XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Asunto *
            </label>
            <input
              type="text"
              required
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent"
              placeholder="Resumen breve del problema"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#353535] mb-1.5">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3c6e71] focus:border-transparent resize-none"
              placeholder="Describe tu problema con detalle..."
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
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
