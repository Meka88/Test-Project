import { useId, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string | null
}

export function Textarea({ label, error, id, className = '', ...rest }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className="field">
      <label htmlFor={textareaId} className="field-label">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`field-input ${error ? 'field-input-error' : ''} ${className}`.trim()}
        aria-invalid={Boolean(error) || undefined}
        {...rest}
      />
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
