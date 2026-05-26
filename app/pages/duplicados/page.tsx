"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import DuplicatesList from "../../components/duplicados/DuplicatesList";
import ComparisonView from "../../components/duplicados/ComparisonView";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonList } from "../../components/ui/Skeleton";
import { mockDuplicados } from "../../lib/mocks/clientes.mock";
import { DuplicateGroup } from "../../lib/types/cliente.types";

export default function DuplicadosPage() {
  const [selected, setSelected] = useState<DuplicateGroup | null>(null);
  const [isLoading] = useState(false); // TODO: reemplazar con fetch real

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
      {isLoading ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] border-r border-[#d9d9d9] p-3">
            <SkeletonList items={4} />
          </div>
          <div className="flex-1 flex items-center justify-center text-[#6b7280] text-sm">
            Cargando grupos de duplicados...
          </div>
        </div>
      ) : mockDuplicados.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Copy}
            title="Sin duplicados detectados"
            description="No se han encontrado registros de clientes duplicados. El sistema revisará automáticamente cuando se agreguen nuevos clientes."
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <DuplicatesList
            duplicates={mockDuplicados}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
          {selected ? (
            <ComparisonView duplicate={selected} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Copy}
                title="Selecciona un grupo"
                description="Haz clic en un grupo de duplicados de la lista para comparar los registros y decidir cuál conservar."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}