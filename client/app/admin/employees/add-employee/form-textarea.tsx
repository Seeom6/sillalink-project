"use client"

import type React from "react"
import { Label } from "@/app/shared/ui/label"
import { Textarea } from "@/app/shared/ui/textarea"

interface FormTextareaProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
  rows?: number
}

export default function FormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  )
}
