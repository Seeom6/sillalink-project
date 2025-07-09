"use client"

import type React from "react"

import { useState, useRef } from "react"
import Button from "@/app/shared/ui/button"
import { Upload, X, User, Camera, Edit3, Settings } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/shared/ui/select"
import { Input } from "@/app/shared/ui/input"
import { Label } from "@/app/shared/ui/label"

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void
    maxFileSize?: number
    acceptedTypes?: string[]
    showSettings?: boolean
    allowMultiple?: boolean
}

interface ImageDimensions {
    width: number
    height: number
    objectFit: "cover" | "contain" | "fill" | "scale-down" | "none"
    aspectRatio: string
}

const ASPECT_RATIOS = [
    { label: "Square (1:1)", value: "1/1", width: 200, height: 200 },
    { label: "Portrait (3:4)", value: "3/4", width: 150, height: 200 },
    { label: "Landscape (4:3)", value: "4/3", width: 200, height: 150 },
    { label: "Wide (16:9)", value: "16/9", width: 200, height: 112 },
    { label: "Circle", value: "circle", width: 200, height: 200 },
    { label: "Custom", value: "custom", width: 200, height: 200 },
]

const OBJECT_FIT_OPTIONS = [
    { label: "Cover (Fill & Crop)", value: "cover", description: "Fill the container, crop if needed" },
    { label: "Contain (Fit Inside)", value: "contain", description: "Fit entire image inside container" },
    { label: "Fill (Stretch)", value: "fill", description: "Stretch to fill container exactly" },
    { label: "Scale Down", value: "scale-down", description: "Scale down if larger than container" },
    { label: "None (Original)", value: "none", description: "Keep original size" },
]

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>("")
    const [showSettings, setShowSettings] = useState(false)
    const [dimensions, setDimensions] = useState<ImageDimensions>({
        width: 200,
        height: 200,
        objectFit: "cover",
        aspectRatio: "1/1",
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFile = e.dataTransfer.files[0]
            if (newFile.type.startsWith("image/")) {
                addFile(newFile)
            }
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFile = e.target.files[0]
            if (newFile.type.startsWith("image/")) {
                addFile(newFile)
            }
        }
    }

    const addFile = (newFile: File) => {
        setFile(newFile)
        onFilesSelected([newFile])

        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(newFile)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const removeFile = () => {
        setFile(null)
        setPreview("")
        onFilesSelected([])
        setShowSettings(false)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const changeFile = () => {
        fileInputRef.current?.click()
    }

    const handleAspectRatioChange = (value: string) => {
        const ratio = ASPECT_RATIOS.find((r) => r.value === value)
        if (ratio) {
            setDimensions((prev) => ({
                ...prev,
                aspectRatio: value,
                width: ratio.width,
                height: ratio.height,
            }))
        }
    }

    const handleDimensionChange = (field: "width" | "height", value: string) => {
        const numValue = Number.parseInt(value) || 0
        setDimensions((prev) => ({
            ...prev,
            [field]: numValue,
            aspectRatio: "custom",
        }))
    }

    const handleObjectFitChange = (value: "cover" | "contain" | "fill" | "scale-down" | "none") => {
        setDimensions((prev) => ({
            ...prev,
            objectFit: value,
        }))
    }

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
        <div className="w-full space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

            {!file ? (
                /* Upload Area - Show when no file is selected */
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${isDragging
                        ? "border-purple-400 bg-purple-50 scale-[1.02]"
                        : "border-gray-300 hover:border-purple-300 hover:bg-gray-50"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
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
                            onClick={handleButtonClick}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 mb-3"
                        >
                            Choose Photo
                        </Button>

                        <p className="text-xs text-gray-400">Or drag and drop your image here</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB • Recommended: 400x400px</p>
                    </div>
                </div>
            ) : (
                /* Image Preview - Show when file is selected */
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                <Settings className="h-4 w-4 mr-1" />
                                Settings
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={changeFile}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                <Edit3 className="h-4 w-4 mr-1" />
                                Change
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeFile}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>

                    {/* Image Settings Panel */}
                    {showSettings && (
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
                                                className="bg-transparent"

                                                onChange={(e) => handleDimensionChange("width", e.target.value)}
                                                min="50"
                                                max="500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Height (px)</Label>
                                            <Input
                                                type="number"
                                                className="bg-transparent"
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
                    )}

                    {/* Image Preview Card */}
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
                                    className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center cursor-pointer"
                                    style={{ borderRadius: dimensions.aspectRatio === "circle" ? "50%" : "8px" }}
                                    onClick={changeFile}
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

                    {/* Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Camera className="h-3 w-3 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-blue-900 mb-1">Display Tips</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>
                                        • <strong>Cover:</strong> Best for profile photos - fills space and crops if needed
                                    </li>
                                    <li>
                                        • <strong>Contain:</strong> Shows entire image - may have empty space
                                    </li>
                                    <li>
                                        • <strong>Fill:</strong> Stretches image to exact dimensions - may distort
                                    </li>
                                    <li>
                                        • <strong>Circle:</strong> Perfect for profile pictures with round display
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
