import "./Skeleton.css";
import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height, className = "", style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonKpiGrid() {
  return (
    <div className="skeleton-kpi-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-kpi-card">
          <div className="flex justify-between items-center">
            <Skeleton width="120px" className="skeleton--text" />
            <Skeleton width="18px" height="18px" className="skeleton--circle" />
          </div>
          <Skeleton width="80px" className="skeleton--title" />
          <Skeleton width="140px" className="skeleton--text-sm" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table__header">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} height="12px" className="skeleton--text-sm" style={{ opacity: 0.3 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table__row">
          <Skeleton width="60px" className="skeleton--text-sm" />
          <Skeleton className="skeleton--text" />
          <Skeleton width="60px" className="skeleton--text-sm" />
          <Skeleton width="60px" className="skeleton--text-sm" />
          <Skeleton width="80px" className="skeleton--text-sm" />
          <Skeleton width="90px" className="skeleton--text-sm" />
          <Skeleton width="70px" className="skeleton--text-sm" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 4 }: { items?: number }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list__item">
          <div className="flex justify-between">
            <Skeleton width="60%" className="skeleton--text" />
            <Skeleton width="60px" className="skeleton--text-sm" />
          </div>
          <Skeleton width="80%" className="skeleton--text-sm" />
          <Skeleton width="40%" className="skeleton--text-sm" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #d9d9d9" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Skeleton width="72px" height="72px" className="skeleton--circle" />
          <div className="flex flex-col gap-2">
            <Skeleton width="200px" className="skeleton--text-lg" />
            <Skeleton width="300px" className="skeleton--text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="80px" height="34px" className="skeleton--card" />
          ))}
        </div>
      </div>
      <div className="flex gap-8 pt-4" style={{ borderTop: "1px solid #d9d9d9" }}>
        <Skeleton width="200px" className="skeleton--text-sm" />
        <Skeleton width="160px" className="skeleton--text-sm" />
      </div>
    </div>
  );
}