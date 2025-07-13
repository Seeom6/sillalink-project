"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"

interface FormMultiSelectProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  className?: string
}

export default function FormMultiSelect({
  label,
  values,
  onChange,
  options,
  placeholder = "Select options...",
  error,
  className = "",
}: FormMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleOption = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue))
    } else {
      onChange([...values, optionValue])
    }
  }

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(values.filter(v => v !== valueToRemove))
  }



  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        {/* Selected Values Display */}
        <div
          className={`w-full min-h-[40px] px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {values.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {values.map((selectedValue) => {
                const option = options.find(opt => opt.value === selectedValue);
                const label = option?.label || selectedValue;
                return (
                  <span
                    key={selectedValue}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveValue(selectedValue)
                      }}
                      className="hover:bg-blue-200 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">No options available</div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    values.includes(option.value) ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => handleToggleOption(option.value)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={values.includes(option.value)}
                      onChange={() => {}} // Handled by onClick
                      className="mr-2"
                    />
                    {option.label}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
