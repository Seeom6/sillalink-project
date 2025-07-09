"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import type { ImageDimensions } from "@/app/types/add-employee-type"
import { DEFAULT_DIMENSIONS } from "@/app/lib/image-settings"

interface UseFileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFileSize?: number
  acceptedTypes?: string[]
  allowMultiple?: boolean
  initialDimensions?: Partial<ImageDimensions>
}

export function useFileUpload({
  onFilesSelected,
  maxFileSize = 10 * 1024 * 1024,
  acceptedTypes = ["image/*"],
  allowMultiple = false,
  initialDimensions = {},
}: UseFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [showSettings, setShowSettings] = useState(false)
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    ...DEFAULT_DIMENSIONS,
    ...initialDimensions,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file size
      if (file.size > maxFileSize) {
        console.error(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`)
        return false
      }

      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type === "image/*") return file.type.startsWith("image/")
        return file.type === type
      })

      if (!isValidType) {
        console.error(`File type ${file.type} is not accepted`)
        return false
      }

      return true
    },
    [maxFileSize, acceptedTypes],
  )

  const createPreview = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const addFile = useCallback(
    (newFile: File) => {
      if (!validateFile(newFile)) return

      setFile(newFile)
      onFilesSelected([newFile])
      createPreview(newFile)
    },
    [validateFile, onFilesSelected, createPreview],
  )

  const removeFile = useCallback(() => {
    setFile(null)
    setPreview("")
    setShowSettings(false)
    onFilesSelected([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onFilesSelected])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFile = e.dataTransfer.files[0]
        addFile(newFile)
      }
    },
    [addFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFile = e.target.files[0]
        addFile(newFile)
      }
    },
    [addFile],
  )

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return {
    // State
    isDragging,
    file,
    preview,
    showSettings,
    dimensions,
    fileInputRef,

    // Actions
    setShowSettings,
    setDimensions,
    addFile,
    removeFile,
    triggerFileSelect,

    // Event handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  }
}
