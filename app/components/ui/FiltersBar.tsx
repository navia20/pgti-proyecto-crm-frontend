"use client";

import React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface TicketFilters {
  search: string;
  referencia: string;
  estado: string;
  prioridad: string;
  canal: string;
}

interface FiltersBarProps {
  filters: TicketFilters;
  onFilterChange: (filters: TicketFilters) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

const referenciaOptions = [
  { value: "", label: "Todas" },
  { value: "ninguna", label: "Sin referencia" },
  { value: "pedido", label: "Pedidos" },
  { value: "suscripcion", label: "Suscripciones" },
  { value: "salud", label: "Salud" },
];

const estadoOptions = [
  { value: "", label: "Todos" },
  { value: "abierto", label: "Abierto" },
  { value: "progreso", label: "En progreso" },
  { value: "resuelto", label: "Resuelto" },
  { value: "cerrado", label: "Cerrado" },
];

const prioridadOptions = [
  { value: "", label: "Todas" },
  { value: "critica", label: "Crítica" },
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

const canalOptions = [
  { value: "", label: "Todos" },
  { value: "chat", label: "Chat" },
  { value: "email", label: "Email" },
  { value: "telefono", label: "Teléfono" },
  { value: "app", label: "App" },
];

function SelectFilter({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-[#6b7280] hidden sm:inline">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#d9d9d9] rounded-lg px-2 py-1.5 text-xs text-[#353535] outline-none focus:border-[#3c6e71] bg-white cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FiltersBar({
  filters,
  onFilterChange,
  page,
  totalPages,
  total,
  onPageChange,
  pageSize,
}: FiltersBarProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Fila 1: Buscador */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="Buscar por asunto..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full border border-[#d9d9d9] rounded-lg pl-9 pr-3 py-2 text-sm text-[#353535] outline-none focus:border-[#3c6e71] placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Fila 2: Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          label="Referencia"
          value={filters.referencia}
          onChange={(v) => handleFilterChange("referencia", v)}
          options={referenciaOptions}
        />
        <SelectFilter
          label="Estado"
          value={filters.estado}
          onChange={(v) => handleFilterChange("estado", v)}
          options={estadoOptions}
        />
        <SelectFilter
          label="Prioridad"
          value={filters.prioridad}
          onChange={(v) => handleFilterChange("prioridad", v)}
          options={prioridadOptions}
        />
        <SelectFilter
          label="Canal"
          value={filters.canal}
          onChange={(v) => handleFilterChange("canal", v)}
          options={canalOptions}
        />
      </div>

      {/* Fila 3: Paginación */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">
            Mostrando {from}–{to} de {total} tickets
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#d9d9d9] text-[#6b7280] hover:border-[#3c6e71] hover:text-[#3c6e71] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-[#353535] px-2 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#d9d9d9] text-[#6b7280] hover:border-[#3c6e71] hover:text-[#3c6e71] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
