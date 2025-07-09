"use client"

import type React from "react"
import { Label } from "@/app/shared/ui/label"
import { Input } from "@/app/shared/ui/input"

interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full h-12 bg-transparent border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
