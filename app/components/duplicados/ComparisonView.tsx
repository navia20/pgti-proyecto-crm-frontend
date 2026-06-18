"use client";

import "./ComparisonView.css";
import React, { useState } from "react";
import { GitMerge } from "lucide-react";
import { DuplicateGroup, ClienteDuplicado } from "../../lib/types/cliente.types";

interface ComparisonViewProps {
  duplicate: DuplicateGroup;
  onMerge?: (
    principalId: number,
    secundarioId: number,
    campos: Record<string, unknown>
  ) => void;
}

type FieldKey =
  | "nombre_completo"
  | "email"
  | "telefono"
  | "company"
  | "address"
  | "city"
  | "country"
  | "creado_en"
  | "lastPurchase"
  | "totalSpent";

const fields: { key: FieldKey; label: string }[] = [
  { key: "nombre_completo", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
  { key: "company", label: "Empresa" },
  { key: "address", label: "Dirección" },
  { key: "city", label: "Ciudad" },
  { key: "country", label: "País" },
  { key: "creado_en", label: "Creado" },
  { key: "lastPurchase", label: "Última compra" },
  { key: "totalSpent", label: "Total gastado" },
];

export default function ComparisonView({ duplicate, onMerge }: ComparisonViewProps) {
  const [recordA, recordB] = duplicate.records;
  const [selections, setSelections] = useState<Record<string, "A" | "B">>({});

  const selectedCount = Object.keys(selections).length;

  const handleSelect = (field: string, record: "A" | "B") => {
    setSelections((prev: Record<string, "A" | "B">) => ({ ...prev, [field]: record }));
  };

  const isEqual = (field: FieldKey): boolean => {
    const valA = recordA[field as keyof ClienteDuplicado];
    const valB = recordB[field as keyof ClienteDuplicado];
    return valA === valB;
  };

  const getValue = (record: ClienteDuplicado, field: FieldKey): string => {
    const val = record[field as keyof ClienteDuplicado];
    return val !== undefined && val !== null ? String(val) : "—";
  };

  return (
    <div className="comparison-view">
      <div className="comparison-view__header">
        <div>
          <div className="comparison-view__title">Comparación de Registros</div>
          <div className="comparison-view__subtitle">
            Similitud: {duplicate.similarityScore}% · Selecciona los valores a conservar
          </div>
        </div>
        <button
          className="comparison-view__merge-btn"
          disabled={selectedCount === 0}
          onClick={()=> {
            if (onMerge){
              onMerge(
                recordA.id,
                recordB.id,
                selections as Record<string, unknown>
              );
            }
          }}
        >
          <GitMerge size={15} />
          Fusionar Registros
        </button>
      </div>

      <div className="comparison-view__table">
        <table>
          <tbody>
            <tr className="comparison-view__col-header">
              <td className="comparison-view__field-label" />
              <td className="comparison-view__field-value">
                <div className="comparison-view__col-label">Registro A</div>
                <div className="comparison-view__col-id">{recordA.id}</div>
                <div className="comparison-view__col-selected">
                  Seleccionados: {Object.values(selections).filter((v) => v === "A").length}
                </div>
              </td>
              <td className="comparison-view__field-value">
                <div className="comparison-view__col-label">Registro B</div>
                <div className="comparison-view__col-id">{recordB.id}</div>
                <div className="comparison-view__col-selected">
                  Seleccionados: {Object.values(selections).filter((v) => v === "B").length}
                </div>
              </td>
            </tr>

            {fields.map(({ key, label }) => {
              const equal = isEqual(key);
              const selectedA = selections[key] === "A";
              const selectedB = selections[key] === "B";
              const valueA = getValue(recordA, key);
              const valueB = getValue(recordB, key);

              return (
                <tr key={key} className="comparison-view__field-row">
                  <td className="comparison-view__field-label">{label}</td>

                  <td className={`comparison-view__field-value ${selectedA ? "comparison-view__field-value--selected" : ""}`}>
                    {equal ? (
                      <span className="comparison-view__equal">{valueA}</span>
                    ) : (
                      <label className="comparison-view__radio-row">
                        <input
                          type="radio"
                          name={key}
                          value="A"
                          checked={selectedA}
                          onChange={() => handleSelect(key, "A")}
                          className="comparison-view__radio"
                        />
                        {valueA}
                      </label>
                    )}
                  </td>

                  <td className={`comparison-view__field-value ${selectedB ? "comparison-view__field-value--selected" : ""}`}>
                    {equal ? (
                      <span className="comparison-view__equal">{valueB}</span>
                    ) : (
                      <label className="comparison-view__radio-row">
                        <input
                          type="radio"
                          name={key}
                          value="B"
                          checked={selectedB}
                          onChange={() => handleSelect(key, "B")}
                          className="comparison-view__radio"
                        />
                        {valueB}
                      </label>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}