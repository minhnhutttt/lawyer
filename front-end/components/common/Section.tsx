import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, title, description, className = '' }) => {
  return (
    <div className={`bg-white p-6 shadow-sm border border-gray-200 rounded-md ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default Section;
