"use client"

import type React from "react"
import  Button  from "@/app/shared/ui/button"
import { Upload, Camera } from "lucide-react"

interface UploadAreaProps {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onButtonClick: () => void
}

export default function UploadArea({ isDragging, onDragOver, onDragLeave, onDrop, onButtonClick }: UploadAreaProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
        isDragging
          ? "border-purple-400 bg-purple-50 scale-[1.02]"
          : "border-gray-300 hover:border-purple-300 hover:bg-gray-50"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-purple-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <Upload className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Profile Photo</h3>
        <p className="text-gray-500 text-sm mb-4">Add a professional photo to help colleagues recognize you</p>

        {/* Button */}
        <Button
          type="button"
          onClick={onButtonClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 mb-3"
        >
          Choose Photo
        </Button>

        <p className="text-xs text-gray-400">Or drag and drop your image here</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB • Recommended: 400x400px</p>
      </div>
    </div>
  )
}
