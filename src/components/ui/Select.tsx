export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, id, className = '', ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-text-primary">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`
          w-full border rounded-lg px-4 py-3 text-body-lg
          text-text-primary bg-surface
          border-border
          focus:outline-none focus:border-cta focus:ring-2 focus:ring-cta/20
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none
          ${error ? 'border-red-400' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p id={`${inputId}-error`} className="text-body-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  )
}
