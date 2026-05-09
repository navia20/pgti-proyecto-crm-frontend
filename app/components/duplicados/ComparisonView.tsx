"use client";

import "./ComparisonView.css";
import { useState } from "react";
import { GitMerge } from "lucide-react";
import { DuplicateGroup } from "../../lib/types/cliente.types";

interface ComparisonViewProps {
  duplicate: DuplicateGroup;
}

type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "address"
  | "city"
  | "country"
  | "createdAt"
  | "lastPurchase"
  | "totalSpent";

const fields: { key: FieldKey; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Teléfono" },
  { key: "company", label: "Empresa" },
  { key: "address", label: "Dirección" },
  { key: "city", label: "Ciudad" },
  { key: "country", label: "País" },
  { key: "createdAt", label: "Creado" },
  { key: "lastPurchase", label: "Última compra" },
  { key: "totalSpent", label: "Total gastado" },
];

export default function ComparisonView({ duplicate }: ComparisonViewProps) {
  const [recordA, recordB] = duplicate.records;
  const [selections, setSelections] = useState<Record<string, "A" | "B">>({});

  const selectedCount = Object.keys(selections).length;

  const handleSelect = (field: string, record: "A" | "B") => {
    setSelections((prev) => ({ ...prev, [field]: record }));
  };

  const isEqual = (field: FieldKey): boolean =>
    recordA[field] === recordB[field];

  return (
    <div className="comparison-view">
      {/* Header */}
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
        >
          <GitMerge size={15} />
          Fusionar Registros
        </button>
      </div>

      {/* Tabla comparativa */}
      <div className="comparison-view__table">
        <table>
          <tbody>
            {/* Cabecera de columnas */}
            <tr className="comparison-view__col-header">
              <td className="comparison-view__field-label" />
              <td className="comparison-view__field-value">
                <div className="comparison-view__col-label">Registro A</div>
                <div className="comparison-view__col-id">{recordA.id}</div>
                <div className="comparison-view__col-selected">
                  Seleccionados:{" "}
                  {Object.values(selections).filter((v) => v === "A").length}
                </div>
              </td>
              <td className="comparison-view__field-value">
                <div className="comparison-view__col-label">Registro B</div>
                <div className="comparison-view__col-id">{recordB.id}</div>
                <div className="comparison-view__col-selected">
                  Seleccionados:{" "}
                  {Object.values(selections).filter((v) => v === "B").length}
                </div>
              </td>
            </tr>

            {/* Filas de campos */}
            {fields.map(({ key, label }) => {
              const equal = isEqual(key);
              const selectedA = selections[key] === "A";
              const selectedB = selections[key] === "B";
              const valueA = String(recordA[key]);
              const valueB = String(recordB[key]);

              return (
                <tr key={key} className="comparison-view__field-row">
                  <td className="comparison-view__field-label">{label}</td>

                  {/* Valor A */}
                  <td
                    className={`comparison-view__field-value ${
                      selectedA ? "comparison-view__field-value--selected" : ""
                    }`}
                  >
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

                  {/* Valor B */}
                  <td
                    className={`comparison-view__field-value ${
                      selectedB ? "comparison-view__field-value--selected" : ""
                    }`}
                  >
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