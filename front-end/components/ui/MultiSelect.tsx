import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
  minHeight?: string;
  maxHeight?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  helperText,
  minHeight = '80px',
  maxHeight = '200px',
  label,
  required = false,
  disabled = false,
  error,
}: MultiSelectProps) {
  console.log(selectedValues, options)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== value);
    onChange(newValues);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div 
          className={`w-full px-4 py-3 rounded-md border ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{ minHeight }}
          onClick={handleToggle}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedValues.map(value => {
                const option = options.find(opt => opt.value === value);
                return (
                  <span 
                    key={value} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {option?.label}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-800 p-0 h-auto"
                        onClick={(e) => handleRemove(value, e)}
                      >
                        <FiX className="h-3 w-3" />
                      </Button>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500">{placeholder}</div>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
        
        {isOpen && !disabled && (
          <div 
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-300"
            style={{ maxHeight }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                  selectedValues.includes(option.value) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span className={`block truncate ${
                  selectedValues.includes(option.value) ? 'font-medium text-blue-700' : 'font-normal'
                }`}>
                  {option.label}
                </span>
                {selectedValues.includes(option.value) && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-700">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
} 