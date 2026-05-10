import React from 'react';

interface StructureInfoCardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const StructureInfoCard: React.FC<StructureInfoCardProps> = ({
  title, subtitle, value, icon, className, children
}) => (
  <div className={`structure-info-card rounded-lg p-4 bg-white/5 border border-white/10 ${className ?? ''}`}>
    {icon && <div className="icon mb-2">{icon}</div>}
    {title && <h3 className="text-sm font-medium opacity-70">{title}</h3>}
    {value !== undefined && <p className="text-2xl font-bold mt-1">{value}</p>}
    {subtitle && <p className="text-xs opacity-50 mt-1">{subtitle}</p>}
    {children}
  </div>
);

export default StructureInfoCard;
