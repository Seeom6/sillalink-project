"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/shared/ui/select"
import { Input } from "@/app/shared/ui/input"
import { Label } from "@/app/shared/ui/label"
import { ASPECT_RATIOS, OBJECT_FIT_OPTIONS } from "@/app/lib/image-settings"
import type { ImageDimensions, ObjectFitType } from "@/app/types/add-employee-type"

interface ImageSettingsPanelProps {
  dimensions: ImageDimensions
  onDimensionsChange: (dimensions: ImageDimensions) => void
}

export default function ImageSettingsPanel({ dimensions, onDimensionsChange }: ImageSettingsPanelProps) {
  const handleAspectRatioChange = (value: string) => {
    const ratio = ASPECT_RATIOS.find((r) => r.value === value)
    if (ratio) {
      onDimensionsChange({
        ...dimensions,
        aspectRatio: value,
        width: ratio.width,
        height: ratio.height,
      })
    }
  }

  const handleDimensionChange = (field: "width" | "height", value: string) => {
    const numValue = Number.parseInt(value) || 0
    onDimensionsChange({
      ...dimensions,
      [field]: numValue,
      aspectRatio: "custom",
    })
  }

  const handleObjectFitChange = (value: ObjectFitType) => {
    onDimensionsChange({
      ...dimensions,
      objectFit: value,
    })
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Image Display Settings</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Aspect Ratio</Label>
          <Select value={dimensions.aspectRatio} onValueChange={handleAspectRatioChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Object Fit */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Display Mode</Label>
          <Select value={dimensions.objectFit} onValueChange={handleObjectFitChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBJECT_FIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Dimensions */}
        {dimensions.aspectRatio === "custom" && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Width (px)</Label>
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                min="50"
                max="500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Height (px)</Label>
              <Input
                type="number"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange("height", e.target.value)}
                min="50"
                max="500"
              />
            </div>
          </>
        )}
      </div>

      {/* Current Settings Display */}
      <div className="bg-white p-3 rounded border text-xs text-gray-600">
        <strong>Current Settings:</strong> {dimensions.width}×{dimensions.height}px,{" "}
        {OBJECT_FIT_OPTIONS.find((o) => o.value === dimensions.objectFit)?.label}
      </div>
    </div>
  )
}
