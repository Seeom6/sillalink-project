"use client"

import type React from "react"
import { Label } from "@/app/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/shared/ui/select"

interface FormSelectProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  options: { value: string; label: string }[]
}

export default function FormSelect({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  required = false,
  className = "",
  options,
}: FormSelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 bg-transparent border-gray-300 focus:border-purple-500 focus:ring-purple-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
