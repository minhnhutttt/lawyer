import React from 'react';

interface TooltipProps {
  /** The element you want to wrap with a tooltip */
  children: React.ReactNode;
  /** The content to show in the tooltip */
  content: string;
  /** Optional extra classes for tooltip styling */
  className?: string;
}

/**
 * Fancy Tailwind tooltip for Gen Z admins 😎
 * Usage:
 * <Tooltip content="Full description here">short desc...</Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({ children, content, className = '' }) => {
  return (
    <span className="relative group cursor-pointer">
      {children}
      <span
        className={
          `pointer-events-none absolute left-1/2 z-20 bottom-full mb-2 w-max max-w-xs 
          -translate-x-1/2 rounded-md bg-gray-800 px-3 py-1 text-xs text-white 
          opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-pre-line shadow-lg ${className}`
        }
      >
        {content}
        {/* Arrow */}
        <span className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-800 z-10"></span>
      </span>
    </span>
  );
};

export default Tooltip;
