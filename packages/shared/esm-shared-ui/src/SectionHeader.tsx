import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

/** En-tête de section standardisé */
export function SectionHeader({ title, subtitle, actions, icon }: SectionHeaderProps) {
  return (
    <div className="egen-section-header">
      <div className="egen-section-header__left">
        {icon && <span className="egen-section-header__icon">{icon}</span>}
        <div>
          <h2 className="egen-section-header__title">{title}</h2>
          {subtitle && <p className="egen-section-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="egen-section-header__actions">{actions}</div>}
    </div>
  );
}
