"use client";

import { useState } from "react";
import DuplicatesList from "../../components/duplicados/DuplicatesList";
import ComparisonView from "../../components/duplicados/ComparisonView";
import { mockDuplicados } from "../../lib/mocks/clientes.mock";
import { DuplicateGroup } from "../../lib/types/cliente.types";

export default function DuplicadosPage() {
  const [selected, setSelected] = useState<DuplicateGroup | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d9d9d9] bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#353535] tracking-tight">
            Gestión de Duplicados
          </h1>
          <p className="text-sm text-[#6b7280] mt-0.5">
            {mockDuplicados.length} grupos detectados
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 overflow-hidden">
        <DuplicatesList
          duplicates={mockDuplicados}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />

        {selected ? (
          <ComparisonView duplicate={selected} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#6b7280] text-sm">
            Selecciona un grupo para comparar los registros
          </div>
        )}
      </div>
    </div>
  );
}