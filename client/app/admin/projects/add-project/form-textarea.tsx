"use client"

interface FormTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  rows?: number
}

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
