import "./EmptyState.css";
import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={24} />
      </div>
      <div className="empty-state__title">{title}</div>
      <p className="empty-state__description">{description}</p>
      <div className="flex gap-3">
        {actionLabel && onAction && (
          <button className="empty-state__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            className="empty-state__action empty-state__action--secondary"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}