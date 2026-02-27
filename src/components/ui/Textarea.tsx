'use client'

import { useState } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  maxLength?: number
}

export function Textarea({ label, error, maxLength, id, className = '', onChange, ...props }: TextareaProps) {
  const [charCount, setCharCount] = useState(0)
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-text-primary">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={inputId}
          maxLength={maxLength}
          onChange={handleChange}
          className={`
            w-full border rounded-lg px-4 py-3 text-body-lg
            text-text-primary bg-surface
            border-border
            placeholder:text-text-muted
            resize-none min-h-[120px]
            focus:outline-none focus:border-cta focus:ring-2 focus:ring-cta/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {maxLength && (
          <span className={`absolute bottom-3 right-3 text-body-sm ${charCount >= maxLength * 0.9 ? 'text-red-500' : 'text-text-muted'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-body-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  )
}
