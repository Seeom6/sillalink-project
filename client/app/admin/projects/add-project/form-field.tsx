"use client"

import type React from "react"

interface FormFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  min?: string
  max?: string
  step?: string
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  min,
  max,
  step,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
