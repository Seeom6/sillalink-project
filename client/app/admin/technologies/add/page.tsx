"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Button from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Label } from "@/app/shared/ui/label";
import { Textarea } from "@/app/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select";
import { Checkbox } from "@/app/shared/ui/checkbox";
import {
  TechnologyFormData,
  TechnologyCategory,
  TechnologyStatus,
  DifficultyLevel,
  TECHNOLOGY_CATEGORIES,
  TECHNOLOGY_STATUSES,
  DIFFICULTY_LEVELS,
} from "@/app/types/technologyTypes";
import { useTechnologyActions } from "@/app/hooks/technology/useTechnology";
import { useToast } from "@/app/hooks/useToast";
import { FileUpload } from "@/app/shared/components/forms/FileUpload";

export default function AddTechnologyPage() {
  const router = useRouter();
  const { createTechnology, loading } = useTechnologyActions();
  const toast = useToast();

  const [formData, setFormData] = useState<TechnologyFormData>({
    name: "",
    description: "",
    longDescription: "",
    category: TechnologyCategory.OTHER,
    status: TechnologyStatus.ACTIVE,
    difficultyLevel: DifficultyLevel.BEGINNER,
    icon: "",
    officialWebsite: "",
    documentation: "",
    tags: [],
    relatedTechnologies: [],
    proficiencyLevel: 0,
    estimatedLearningHours: 0,
    prerequisites: [],
    learningResources: [],
    notes: "",
    projectsUsedIn: 0,
    isFeatured: false,
    version: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [resourceInput, setResourceInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (
    field: keyof TechnologyFormData,
    value: string | number | boolean | string[] | TechnologyCategory | TechnologyStatus | DifficultyLevel
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddPrerequisite = () => {
    if (
      prerequisiteInput.trim() &&
      !(formData.prerequisites || []).includes(prerequisiteInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), prerequisiteInput.trim()],
      }));
      setPrerequisiteInput("");
    }
  };

  const handleRemovePrerequisite = (prereqToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: (prev.prerequisites || []).filter(
        (prereq) => prereq !== prereqToRemove
      ),
    }));
  };

  const handleAddResource = () => {
    if (
      resourceInput.trim() &&
      !(formData.learningResources || []).includes(resourceInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        learningResources: [...(prev.learningResources || []), resourceInput.trim()],
      }));
      setResourceInput("");
    }
  };

  const handleRemoveResource = (resourceToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      learningResources: (prev.learningResources || []).filter(
        (resource) => resource !== resourceToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    try {
      const result = await createTechnology(formData, imageFile || undefined);
      if (result) {
        toast.success("Technology created successfully!");
        router.push("/admin/technologies");
      } else {
        toast.error("Failed to create technology");
      }
    } catch (error) {
      toast.error("Failed to create technology");
    }
  };

  const handleCancel = () => {
    router.push("/admin/technologies");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Technology
            </h1>
            <p className="text-gray-600 mt-1">Create a new technology entry</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., React, Node.js, Python"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => handleInputChange("version", e.target.value)}
                placeholder="e.g., 18.2.0, 3.11"
                className="bg-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the technology"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) =>
                  handleInputChange("longDescription", e.target.value)
                }
                placeholder="Detailed description of the technology"
                rows={4}
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Technology Image</h2>

          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleImageSelect}
              accept="image/*"
              maxSize={5}
              variant="main"
              preview={imagePreview}
              placeholder="Click to upload technology image or drag & drop"
              className="w-full"
            />

            {imagePreview && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Technology preview"
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {imageFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {imageFile && (imageFile.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageRemove}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Upload an image to represent this technology. Supported formats:
              JPG, PNG, GIF. Maximum size: 5MB.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Classification</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  handleInputChange("category", value as TechnologyCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNOLOGY_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as TechnologyStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNOLOGY_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Difficulty Level</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value) =>
                  handleInputChange("difficultyLevel", value as DifficultyLevel)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Technology
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
