"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Ticket } from "lucide-react";
import TicketDetail from "../../components/tickets/TicketDetail";
import TicketsTable from "../../components/dashboard/TicketsTable";
import EmptyState from "../../components/ui/EmptyState";
import FiltersBar, { TicketFilters } from "../../components/ui/FiltersBar";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { mockTicketDetalle } from "../../lib/mocks/tickets.mock";
import { ticketsApi } from "../../lib/api/tickets.api";
import { interaccionesApi } from "../../lib/api/interacciones.api";
import { Ticket as TicketType, TicketDetalle } from "../../lib/types/ticket.types";
import { useRole } from "../../lib/context/RoleContext";

const AGENTE_ID = "00000000-0000-0000-0000-000000000001";
const PAGE_SIZE = 15;

const defaultFilters: TicketFilters = {
  search: "",
  referencia: "",
  estado: "",
  prioridad: "",
  canal: "",
};

export default function TicketsPage() {
  const { esAdmin } = useRole();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TicketFilters>(defaultFilters);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketDetalle, setTicketDetalle] = useState<TicketDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const skip = (page - 1) * PAGE_SIZE;
      const result = await ticketsApi.getAll({
        skip,
        take: PAGE_SIZE,
        estado: filters.estado || undefined,
        prioridad: filters.prioridad || undefined,
        canal: filters.canal || undefined,
        search: filters.search || undefined,
        referencia: filters.referencia || undefined,
        agente_id: !esAdmin ? AGENTE_ID : undefined,
      });
      setTickets(result.data);
      setTotal(result.total);
    } catch {
      setTickets([]);
      setTotal(0);
      setError("Usando datos locales — backend no disponible");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, esAdmin]);

  const handleFilterChange = (newFilters: TicketFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleTicketClick = (ticket: TicketType) => {
    if (ticket.estado === "cerrado" && !esAdmin) return;
    setSelectedTicket(ticket);
    sessionStorage.setItem("selectedTicketId", ticket.id);
    setIsLoadingDetalle(true);
    void Promise.all([
      ticketsApi.getById(ticket.id),
      interaccionesApi.getByTicket(ticket.id),
    ]).then(([detalle, interacciones]) => {
      setTicketDetalle({ ...detalle, interacciones });
    }).catch(() => {
      setTicketDetalle(mockTicketDetalle);
    }).finally(() => {
      setIsLoadingDetalle(false);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const selectedId = sessionStorage.getItem("selectedTicketId");
    if (selectedId && !selectedTicket) {
      sessionStorage.removeItem("selectedTicketId");
      setIsLoadingDetalle(true);
      void ticketsApi.getById(selectedId).then((detalle) => {
        setSelectedTicket({ id: detalle.id, asunto: detalle.asunto, estado: detalle.estado, prioridad: detalle.prioridad, canal: detalle.canal, cliente_id: detalle.cliente_id, cliente_nombre: detalle.cliente_nombre, agente_id: detalle.agente_id, fecha_vencimiento_sla: detalle.fecha_vencimiento_sla, pedido_id_ref: detalle.pedido_id_ref, suscripcion_id_ref: detalle.suscripcion_id_ref, salud_ref: detalle.salud_ref, slaPercent: 0, agente_nombre: detalle.agente_nombre, resolucion: detalle.resolucion });
        setTicketDetalle(detalle);
      }).catch(() => {
        sessionStorage.removeItem("selectedTicketId");
      }).finally(() => {
        setIsLoadingDetalle(false);
      });
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedTicket(null);
    setTicketDetalle(null);
  }, [esAdmin]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (selectedTicket) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div
          className="flex items-center gap-4 px-6 py-3 border-b border-[#d9d9d9] bg-white"
          style={{ minHeight: "52px" }}
        >
          <button
            onClick={() => { setSelectedTicket(null); setTicketDetalle(null); }}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a tickets
          </button>
          <span className="text-[#d9d9d9]">|</span>
          <span className="text-sm font-mono text-[#6b7280]">
            {selectedTicket.id}
          </span>
          <span className="text-sm text-[#353535] font-medium">
            {selectedTicket.asunto}
          </span>
        </div>

        {isLoadingDetalle ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#6b7280]">
            Cargando detalle del ticket...
          </div>
        ) : (
          <TicketDetail
            ticket={ticketDetalle ?? mockTicketDetalle}
            esAdmin={esAdmin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Tickets
          </h1>
          <p className="text-sm text-[#6b7280]">
            {esAdmin ? "Todos los tickets" : "Mis tickets asignados"} — {total} en total
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : (
        <>
          <FiltersBar
            filters={filters}
            onFilterChange={handleFilterChange}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />

          {tickets.length === 0 ? (
            <div className="border border-[#d9d9d9] rounded-xl">
              <EmptyState
                icon={Ticket}
                title="No hay tickets"
                description="No se encontraron tickets con los filtros seleccionados."
                actionLabel="Limpiar filtros"
                onAction={() => {
                  setFilters(defaultFilters);
                  setPage(1);
                }}
              />
            </div>
          ) : (
            <TicketsTable
              tickets={tickets}
              filter=""
              onTicketClick={handleTicketClick}
            />
          )}
        </>
      )}
    </div>
  );
}
