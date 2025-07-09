import type { AspectRatio, ObjectFitOption, ImageDimensions } from "@/app/types/add-employee-type"

export const ASPECT_RATIOS: AspectRatio[] = [
  { label: "Square (1:1)", value: "1/1", width: 200, height: 200 },
  { label: "Portrait (3:4)", value: "3/4", width: 150, height: 200 },
  { label: "Landscape (4:3)", value: "4/3", width: 200, height: 150 },
  { label: "Wide (16:9)", value: "16/9", width: 200, height: 112 },
  { label: "Circle", value: "circle", width: 200, height: 200 },
  { label: "Custom", value: "custom", width: 200, height: 200 },
]

export const OBJECT_FIT_OPTIONS: ObjectFitOption[] = [
  {
    label: "Cover (Fill & Crop)",
    value: "cover",
    description: "Fill the container, crop if needed",
  },
  {
    label: "Contain (Fit Inside)",
    value: "contain",
    description: "Fit entire image inside container",
  },
  {
    label: "Fill (Stretch)",
    value: "fill",
    description: "Stretch to fill container exactly",
  },
  {
    label: "Scale Down",
    value: "scale-down",
    description: "Scale down if larger than container",
  },
  {
    label: "None (Original)",
    value: "none",
    description: "Keep original size",
  },
]

export const DEFAULT_DIMENSIONS: ImageDimensions = {
  width: 200,
  height: 200,
  objectFit: "cover",
  aspectRatio: "1/1",
}

export const DIMENSION_LIMITS = {
  MIN_SIZE: 50,
  MAX_SIZE: 500,
  DEFAULT_MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
}
