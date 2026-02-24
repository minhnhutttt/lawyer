import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {actions && <div>{actions}</div>}
      </div>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeader;
