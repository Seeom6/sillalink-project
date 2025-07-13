"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/app/shared/ui/label"
import { Checkbox } from "@/app/shared/ui/checkbox"
import { Badge } from "@/app/shared/ui/badge"
import { X } from "lucide-react"

interface FormMultiSelectProps {
  id: string
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  required?: boolean
  className?: string
  options: { value: string; label: string }[]
}

export default function FormMultiSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  options,
}: FormMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleRemove = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }



  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {/* Selected items display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((selectedValue) => {
            const option = options.find(opt => opt.value === selectedValue);
            const label = option?.label || selectedValue;
            return (
              <Badge key={selectedValue} variant="secondary" className="flex items-center gap-1">
                {label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemove(selectedValue)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="w-full h-12 px-3 py-2 bg-transparent border border-gray-300 rounded-md text-left focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <span>{value.length} selected</span>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
