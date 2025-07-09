"use client"
import Button from "@/app/shared/ui/button"
import { Settings, Edit3, X } from "lucide-react"
import { useFileUpload } from "@/app/hooks/useFileUpload"
import UploadArea from "./uploade-area"
import ImagePreview from "./image-preview"
import ImageSettingsPanel from "./image-settings-panel"
import UploadTips from "./upload-tips"
import type { FileUploadProps } from "@/app/types/add-employee-type"

export default function FileUpload({
  onFilesSelected,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ["image/*"],
  initialDimensions = {},
  showSettings = true,
  allowMultiple = false,
}: FileUploadProps) {
  const {
    isDragging,
    file,
    preview,
    showSettings: showSettingsState,
    dimensions,
    fileInputRef,
    setShowSettings,
    setDimensions,
    removeFile,
    triggerFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  } = useFileUpload({
    onFilesSelected,
    maxFileSize,
    acceptedTypes,
    allowMultiple,
    initialDimensions,
  })

  return (
    <div className="w-full space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={acceptedTypes?.join(",") || "image/*"}
        multiple={allowMultiple}
      />

      {!file ? (
        /* Upload Area - Show when no file is selected */
        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onButtonClick={triggerFileSelect}
        />
      ) : (
        /* Image Preview - Show when file is selected */
        <div className="space-y-4">
          {/* Header with Action Buttons */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
            <div className="flex gap-2">
              {showSettings && (
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(!showSettingsState)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              )}
              <Button
                variant="outline"
                onClick={triggerFileSelect}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Change
              </Button>
              <Button variant="outline" onClick={removeFile} className="text-red-600 border-red-200 hover:bg-red-50">
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Image Settings Panel */}
          {showSettingsState && showSettings && (
            <ImageSettingsPanel dimensions={dimensions} onDimensionsChange={setDimensions} />
          )}

          {/* Image Preview */}
          <ImagePreview
            file={file}
            preview={preview}
            dimensions={dimensions}
            onChangeFile={triggerFileSelect}
            onRemoveFile={removeFile}
          />

          {/* Upload Tips */}
          <UploadTips />
        </div>
      )}
    </div>
  )
}
