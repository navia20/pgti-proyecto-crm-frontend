"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TicketDetail from "../../../components/tickets/TicketDetail";
import { ticketsApi } from "../../../lib/api/tickets.api";
import { interaccionesApi } from "../../../lib/api/interacciones.api";
import { TicketDetalle } from "../../../lib/types/ticket.types";
import { useRole } from "../../../lib/context/RoleContext";

export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { esAdmin } = useRole();
  const [ticket, setTicket] = useState<TicketDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    Promise.all([
      ticketsApi.getById(id),
      interaccionesApi.getByTicket(id),
    ]).then(([detalle, interacciones]) => {
      setTicket({ ...detalle, interacciones });
    }).catch(() => {
      setError("No se pudo cargar el ticket");
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center gap-4 px-6 py-3 border-b border-[#d9d9d9] bg-white" style={{ minHeight: "52px" }}>
        <button onClick={() => router.push("/pages/tickets")} className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors">
          <ArrowLeft size={16} />
          Volver a tickets
        </button>
        <span className="text-[#d9d9d9]">|</span>
        <span className="text-sm font-mono text-[#6b7280]">{id}</span>
        {ticket && <span className="text-sm text-[#353535] font-medium">{ticket.asunto}</span>}
      </div>
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#6b7280]">
          <div className="w-8 h-8 border-2 border-[#d9d9d9] border-t-[#284b63] rounded-full animate-spin" />
          <span className="text-sm">Cargando mensajes...</span>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-[#6b7280]">{error}</div>
      ) : ticket ? (
        <TicketDetail ticket={ticket} esAdmin={esAdmin} />
      ) : null}
    </div>
  );
}
