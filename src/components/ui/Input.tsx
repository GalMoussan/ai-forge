export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-text-primary">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full border rounded-lg px-4 py-3 text-body-lg
          text-text-primary bg-surface
          border-border
          placeholder:text-text-muted
          focus:outline-none focus:border-cta focus:ring-2 focus:ring-cta/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-body-sm text-red-600" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-body-sm text-text-muted">{hint}</p>
      )}
    </div>
  )
}
