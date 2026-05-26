import "./DuplicatesList.css";
import React from "react";
import { DuplicateGroup, ClienteDuplicado } from "../../lib/types/cliente.types";

interface DuplicatesListProps {
  duplicates: DuplicateGroup[];
  selectedId: string | null;
  onSelect: (duplicate: DuplicateGroup) => void;
}

function getScoreClass(score: number): string {
  if (score >= 90) return "duplicates-list__score--high";
  if (score >= 80) return "duplicates-list__score--medium";
  return "duplicates-list__score--low";
}

function getNombre(record: ClienteDuplicado): string {
  return record.nombre_completo;
}

export default function DuplicatesList({ duplicates, selectedId, onSelect }: DuplicatesListProps) {
  return (
    <div className="duplicates-list">
      <div className="duplicates-list__header">
        <div className="duplicates-list__title">Duplicados Detectados</div>
        <div className="duplicates-list__subtitle">
          {duplicates.length} grupos detectados
        </div>
      </div>

      <div className="duplicates-list__items">
        {duplicates.map((dup) => {
          const primary = dup.records[0];
          const secondary = dup.records[1];
          const isActive = selectedId === dup.id;

          return (
            <div
              key={dup.id}
              className={`duplicates-list__item ${isActive ? "duplicates-list__item--active" : ""}`}
              onClick={() => onSelect(dup)}
            >
              <div className="duplicates-list__item-top">
                <div>
                  <div className="duplicates-list__item-name">
                    {getNombre(primary)}
                  </div>
                  <div className="duplicates-list__item-email">
                    {primary.email}
                  </div>
                </div>
                <span className={`duplicates-list__score ${getScoreClass(dup.similarityScore)}`}>
                  {dup.similarityScore}%
                </span>
              </div>

              <div className="duplicates-list__item-secondary">
                <div className="duplicates-list__item-secondary-name">
                  {getNombre(secondary)}
                </div>
                <div className="duplicates-list__item-secondary-email">
                  {secondary.email}
                </div>
              </div>

              <div className="duplicates-list__item-ids">
                IDs: {primary.id} · {secondary.id}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}