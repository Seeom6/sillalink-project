"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, File, Image as ImageIcon } from "lucide-react"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  variant?: "admin" | "main"
  preview?: string | null
  placeholder?: string
  className?: string
}

export const FileUpload = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  variant = "main",
  preview,
  placeholder = "Click to upload file",
  className = ""
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isImage = accept.includes("image")

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    
    if (accept && !accept.split(',').some(type => 
      file.type.match(type.trim().replace('*', '.*'))
    )) {
      return `File type not supported. Accepted types: ${accept}`
    }
    
    return null
  }, [accept, maxSize])

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError(null)
    onFileSelect(file)
  }, [validateFile, onFileSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemove = () => {
    setError(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const containerStyles = {
    admin: "space-y-4",
    main: "space-y-6"
  }

  const uploadAreaStyles = {
    admin: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer touch-manipulation transition-colors ${
      dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
    }`,
    main: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer touch-manipulation transition-colors ${
      dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
    }`
  }

  const iconStyles = {
    admin: "w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2",
    main: "w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-4"
  }

  const textStyles = {
    admin: "text-sm text-gray-600",
    main: "text-base text-gray-600"
  }

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      {preview ? (
        <div className="relative">
          {isImage ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 sm:h-40 object-cover rounded-lg"
            />
          ) : (
            <Card className="p-4 flex items-center gap-3">
              <File className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">File selected</span>
            </Card>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={uploadAreaStyles[variant]}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          {isImage ? (
            <ImageIcon className={iconStyles[variant]} />
          ) : (
            <Upload className={iconStyles[variant]} />
          )}
          <p className={textStyles[variant]}>
            {placeholder}
          </p>
          {maxSize && (
            <p className="text-xs text-gray-500 mt-1">
              Max size: {maxSize}MB
            </p>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
