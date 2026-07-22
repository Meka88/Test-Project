import { useId, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, id, className = '', children, ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="field">
      <label htmlFor={selectId} className="field-label">
        {label}
      </label>
      <select id={selectId} className={`field-input ${className}`.trim()} {...rest}>
        {children}
      </select>
    </div>
  )
}
