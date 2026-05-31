"use client";

import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import DuplicatesList from "../../components/duplicados/DuplicatesList";
import ComparisonView from "../../components/duplicados/ComparisonView";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonList } from "../../components/ui/Skeleton";
import { clientesApi } from "../../lib/api/clientes.api";
import { DuplicateGroup, ClienteDuplicado } from "../../lib/types/cliente.types";

export default function DuplicadosPage() {
  const [duplicados, setDuplicados] = useState<DuplicateGroup[]>([]);
  const [selected, setSelected] = useState<DuplicateGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDuplicados = async () => {
      try {
        setIsLoading(true);
        const data = await clientesApi.getDuplicados(80);
        // Mapear respuesta del backend al formato DuplicateGroup
        const grupos: DuplicateGroup[] = Array.isArray(data)
          ? data.map((grupo: Record<string, unknown>, index: number) => ({
              id: `dup-${index}`,
              similarityScore: (grupo.similarityScore as number) ?? 80,
              records: ((grupo.records as Record<string, unknown>[]) ?? []).map(
                (r: Record<string, unknown>): ClienteDuplicado => ({
                  id: r.id as number,
                  identidad_id: (r.identidad_id as string) ?? "",
                  nombre_completo: r.nombre_completo as string,
                  email: r.email as string,
                  telefono: (r.telefono as string) ?? "",
                  fecha_nacimiento: (r.fecha_nacimiento as string) ?? "",
                  creado_en: r.creado_en as string,
                  company: r.empresa as string | undefined,
                  city: r.ciudad as string | undefined,
                  country: r.pais as string | undefined,
                  address: r.direccion as string | undefined,
                  lastPurchase: r.fecha_ultima_compra as string | undefined,
                  totalSpent: r.total_gastado
                    ? `€${r.total_gastado}`
                    : undefined,
                  orders: r.pedidos_totales as number | undefined,
                })
              ),
            }))
          : [];
        setDuplicados(grupos);
      } catch {
        setError("No se pudieron cargar los duplicados");
        setDuplicados([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDuplicados();
  }, []);

  const handleMerge = async (
    principalId: number,
    secundarioId: number,
    campos: Record<string, unknown>
  ) => {
    try {
      await clientesApi.merge({
        cliente_principal_id: principalId,
        cliente_secundario_id: secundarioId,
        campos_a_conservar: campos,
      });
      // Recargar duplicados después del merge
      setSelected(null);
      const data = await clientesApi.getDuplicados(80);
      setDuplicados(Array.isArray(data) ? data : []);
    } catch {
      console.error("Error al fusionar clientes");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d9d9d9] bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#353535] tracking-tight">
            Gestión de Duplicados
          </h1>
          <p className="text-sm text-[#6b7280] mt-0.5">
            {isLoading ? "Detectando..." : `${duplicados.length} grupos detectados`}
          </p>
        </div>
      </div>

      {error && (
        <div className="px-6 py-2 text-sm text-amber-700 bg-amber-50 border-b border-amber-200">
          ⚠️ {error}
        </div>
      )}

      {/* Contenido */}
      {isLoading ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] border-r border-[#d9d9d9] p-3">
            <SkeletonList items={4} />
          </div>
          <div className="flex-1 flex items-center justify-center text-[#6b7280] text-sm">
            Detectando grupos de duplicados...
          </div>
        </div>
      ) : duplicados.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Copy}
            title="Sin duplicados detectados"
            description="No se han encontrado registros de clientes duplicados."
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <DuplicatesList
            duplicates={duplicados}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
          {selected ? (
            <ComparisonView
              duplicate={selected}
              onMerge={handleMerge}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Copy}
                title="Selecciona un grupo"
                description="Haz clic en un grupo de duplicados para comparar los registros."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}