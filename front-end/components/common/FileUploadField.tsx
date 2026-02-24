"use client";

import React from "react";
import type { UseFormSetValue, UseFormClearErrors, UseFormSetError } from "react-hook-form";

// Simplified interface that doesn't require the full UseFormReturn object
interface FileUploadFieldProps {
  name: string;
  label: string;
  // Only define the specific form methods we need
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  watch: (name: string) => any;
  errors: Record<string, any>;
  accept?: string;
  maxSize?: number; // in bytes
  required?: boolean;
  currentFileUrl?: string;
  currentFileLabel?: string;
  dragInstructions?: string;
  dragActiveInstructions?: string;
  removeButtonText?: string;
  fileTypesText?: string;
  className?: string;
}

const FileUploadField = ({
  name,
  label,
  setValue,
  setError,
  clearErrors,
  watch,
  errors,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB default
  required = false,
  currentFileUrl,
  currentFileLabel = "View current document",
  dragInstructions = "Drag and drop your file here, or click to select file",
  dragActiveInstructions = "Drop the file here...",
  removeButtonText = "Remove file",
  fileTypesText = "PDF, JPG, JPEG or PNG (max 5MB)",
  className = "",
}: FileUploadFieldProps) => {
  const fieldValue = watch(name);
  // Safely access the error message
  const errorMessage = errors?.[name]?.message as string | undefined;
  
  // Extract file types for validation
  const acceptedTypes = accept.split(',').map(type => {
    if (type === '.pdf') return 'application/pdf';
    if (type === '.jpg' || type === '.jpeg') return 'image/jpeg';
    if (type === '.png') return 'image/png';
    return type;
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-primary/10');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = Array.from(acceptedTypes);
      
      // Type validation (check both MIME type and extension)
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidType = validTypes.some(type => {
        if (type.includes('/')) {
          // MIME type check
          return file.type === type;
        } else {
          // Extension check
          return fileExtension === type;
        }
      });
      
      // Size validation
      const isSizeValid = file.size <= maxSize;
      
      if (isValidType && isSizeValid) {
        setValue(name, file);
        clearErrors(name);
      } else {
        // Show error in validation errors
        if (!isValidType) {
          setError(name, {
            type: "manual",
            message: `Invalid file type. Please upload ${fileTypesText}`
          });
        } else {
          setError(name, {
            type: "manual",
            message: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`
          });
        }
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(name, file);
    if (file) clearErrors(name);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, null);
  };
  
  return (
    <div className={className}>
      <label htmlFor={`${name}_input`} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="mt-2">
        <div
          className="border-2 border-dashed p-6 rounded-md cursor-pointer transition-colors hover:border-primary/50 relative"
          onClick={() => document.getElementById(`${name}_input`)?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id={`${name}_input`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="text-center">
            {fieldValue ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 text-primary mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">
                  {fieldValue?.name || "Selected file"}
                </p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs text-red-500 hover:text-red-700 mt-2"
                >
                  {removeButtonText}
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {dragInstructions}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {fileTypesText}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
      
      {currentFileUrl && (
        <a 
          href={currentFileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:underline mt-2 block"
        >
          {currentFileLabel}
        </a>
      )}
    </div>
  );
};

export default FileUploadField;
