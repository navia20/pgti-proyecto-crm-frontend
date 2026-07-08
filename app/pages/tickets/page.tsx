"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Inbox } from "lucide-react";
import TicketsTable from "../../components/dashboard/TicketsTable";
import TicketsGrid from "../../components/dashboard/TicketsGrid";
import EmptyState from "../../components/ui/EmptyState";
import FiltersBar, { TicketFilters, ViewMode } from "../../components/ui/FiltersBar";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { ticketsApi } from "../../lib/api/tickets.api";
import { solicitudesApi } from "../../lib/api/solicitudes.api";
import { Ticket as TicketType } from "../../lib/types/ticket.types";
import { useRole } from "../../lib/context/RoleContext";
import SolicitudesPanel from "../../components/solicitudes/SolicitudesPanel";

const PAGE_SIZE = 15;

const STORAGE_KEY_FILTERS = "tickets_filters";
const STORAGE_KEY_PAGE = "tickets_page";
const STORAGE_KEY_VIEW = "tickets_view_mode";
const STORAGE_KEY_TAB = "tickets_tab";

function loadFilters(): TicketFilters {
  if (typeof window === "undefined") return defaultFilters;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY_FILTERS);
    return saved ? JSON.parse(saved) : defaultFilters;
  } catch {
    return defaultFilters;
  }
}

function loadPage(): number {
  if (typeof window === "undefined") return 1;
  const saved = sessionStorage.getItem(STORAGE_KEY_PAGE);
  return saved ? Number(saved) || 1 : 1;
}

function loadViewMode(): ViewMode {
  if (typeof window === "undefined") return "table";
  return (sessionStorage.getItem(STORAGE_KEY_VIEW) as ViewMode) || "table";
}

function loadTab(): TabVista {
  if (typeof window === "undefined") return "tickets";
  return (sessionStorage.getItem(STORAGE_KEY_TAB) as TabVista) || "tickets";
}

const defaultFilters: TicketFilters = {
  search: "",
  referencia: "",
  estado: "",
  prioridad: "",
  canal: "",
  mis_tickets: false,
};

type TabVista = "tickets" | "solicitudes";

export default function TicketsPage() {
  const router = useRouter();
  const { esAdmin, userEmail } = useRole();
  const [tabActiva, setTabActiva] = useState<TabVista>(loadTab);
  const [pendientesCount, setPendientesCount] = useState(0);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(loadPage);
  const [filters, setFilters] = useState<TicketFilters>(loadFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode);

  useEffect(() => {
    if (esAdmin) {
      void solicitudesApi.getPendientesCount().then(setPendientesCount);
    }
  }, [esAdmin, tabActiva]);

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
        agente_id: filters.mis_tickets ? userEmail : (!esAdmin ? userEmail : undefined),
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
  }, [page, filters, esAdmin, userEmail]);

  const handleFilterChange = (newFilters: TicketFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleTicketClick = (ticket: TicketType) => {
    if (ticket.estado === "cerrado" && !esAdmin) return;
    router.push("/pages/tickets/" + ticket.id);
  };

  const handleAsignarAgente = async (ticketId: string, agenteId: string | null) => {
    try {
      await ticketsApi.actualizar(ticketId, { agente_id: agenteId || undefined });
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, agente_id: agenteId, agente_nombre: agenteId ? (agenteId === "p7.admin@ucn.cl" ? "Admin CRM" : "Agente CRM") : "Sin asignar" }
            : t
        )
      );
    } catch (err) {
      console.error("Error al asignar agente:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [esAdmin]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_PAGE, String(page));
  }, [page]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_VIEW, viewMode);
  }, [viewMode]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_TAB, tabActiva);
  }, [tabActiva]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Tickets
          </h1>
          <p className="text-sm text-[#6b7280]">
            {tabActiva === "tickets"
              ? `${filters.mis_tickets ? "Mis tickets asignados" : "Todos los tickets"} — ${total} en total`
              : "Solicitudes pendientes de revisión"
            }
          </p>
        </div>
        {esAdmin && (
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!filters.mis_tickets ? "text-[#353535] font-medium" : "text-[#6b7280]"}`}>
              Todos
            </span>
            <button
              onClick={() => handleFilterChange({ ...filters, mis_tickets: !filters.mis_tickets })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                filters.mis_tickets ? "bg-[#3c6e71]" : "bg-[#d9d9d9]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  filters.mis_tickets ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm ${filters.mis_tickets ? "text-[#353535] font-medium" : "text-[#6b7280]"}`}>
              Mis tickets
            </span>
          </div>
        )}
      </div>

      {esAdmin && (
        <div className="flex gap-1 mb-6 border-b border-[#d9d9d9]">
          <button
            onClick={() => setTabActiva("tickets")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tabActiva === "tickets"
                ? "border-[#3c6e71] text-[#3c6e71]"
                : "border-transparent text-[#6b7280] hover:text-[#353535]"
            }`}
          >
            <Ticket size={16} />
            Tickets
          </button>
          <button
            onClick={() => setTabActiva("solicitudes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tabActiva === "solicitudes"
                ? "border-[#3c6e71] text-[#3c6e71]"
                : "border-transparent text-[#6b7280] hover:text-[#353535]"
            }`}
          >
            <Inbox size={16} />
            Solicitudes
            {pendientesCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                {pendientesCount}
              </span>
            )}
          </button>
        </div>
      )}

      {tabActiva === "solicitudes" && esAdmin ? (
        <SolicitudesPanel />
      ) : (
        <>
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
                esAdmin={esAdmin}
                userEmail={userEmail}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
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
              ) : viewMode === "grid" ? (
                <TicketsGrid
                  tickets={tickets}
                  filter=""
                  onTicketClick={handleTicketClick}
                  esAdmin={esAdmin}
                  onAsignarAgente={handleAsignarAgente}
                />
              ) : (
                <TicketsTable
                  tickets={tickets}
                  filter=""
                  onTicketClick={handleTicketClick}
                  esAdmin={esAdmin}
                  onAsignarAgente={handleAsignarAgente}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
