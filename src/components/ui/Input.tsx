import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="field">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <input
        id={inputId}
        className={`field-input ${error ? 'field-input-error' : ''} ${className}`.trim()}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
