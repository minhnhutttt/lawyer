'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div 
          className={cn(
            'relative flex w-full items-center rounded-md border transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
            error
              ? 'border-red-500 text-red-900 focus-within:border-red-500 focus-within:ring-red-500'
              : 'border-gray-300 text-gray-900',
            fullWidth && 'w-full'
          )}
        >
          {leftIcon && (
            <div className="pointer-events-none pl-3">
              <span className="text-gray-500">{leftIcon}</span>
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-md bg-transparent px-3 py-2 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-2',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">{rightIcon}</span>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <div className="mt-1 text-sm">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : helperText ? (
              <p className="text-gray-500">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input } 