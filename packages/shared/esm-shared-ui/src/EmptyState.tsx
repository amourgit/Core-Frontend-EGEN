import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/** Composant d'état vide standardisé pour tous les MFEs */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="egen-empty-state" role="status">
      {icon && <div className="egen-empty-state__icon">{icon}</div>}
      <h3 className="egen-empty-state__title">{title}</h3>
      {description && <p className="egen-empty-state__desc">{description}</p>}
      {action && <div className="egen-empty-state__action">{action}</div>}
    </div>
  );
}
