"use client"
import Image from "next/image"
import { Edit3, User } from "lucide-react"
import type { ImageDimensions } from "@/app/types/add-employee-type"

interface ImagePreviewProps {
  file: File
  preview: string
  dimensions: ImageDimensions
  onChangeFile: () => void
  onRemoveFile: () => void
}

export default function ImagePreview({ file, preview, dimensions, onChangeFile, onRemoveFile }: ImagePreviewProps) {
  const getImageStyle = () => {
    const isCircle = dimensions.aspectRatio === "circle"
    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      objectFit: dimensions.objectFit,
      borderRadius: isCircle ? "50%" : "8px",
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Image Preview */}
        <div className="relative group">
          <div className="overflow-hidden bg-gray-100 border-4 border-white shadow-lg" style={getImageStyle()}>
            {preview ? (
              <Image
                src={preview || "/placeholder.svg"}
                alt="Profile preview"
                width={dimensions.width}
                height={dimensions.height}
                className="w-full h-full"
                style={{ objectFit: dimensions.objectFit }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Edit overlay on hover */}
          <div
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center cursor-pointer"
            style={{ borderRadius: dimensions.aspectRatio === "circle" ? "50%" : "8px" }}
            onClick={onChangeFile}
          >
            <Edit3 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 text-center lg:text-left">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Photo Selected</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">File:</span> {file.name}
            </p>
            <p>
              <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p>
              <span className="font-medium">Type:</span> {file.type}
            </p>
            <p>
              <span className="font-medium">Display:</span> {dimensions.width}×{dimensions.height}px
            </p>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Ready to upload
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
