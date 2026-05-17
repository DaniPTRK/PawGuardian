import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

// Used for the header for each page
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;

