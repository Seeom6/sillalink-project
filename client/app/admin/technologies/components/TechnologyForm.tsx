"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import {
  TechnologyCategory,
  TechnologyStatus,
  DifficultyLevel,
  TECHNOLOGY_CATEGORIES,
  CreateTechnologyPayload,
  Technology
} from "@/app/types/technologyTypes";
import { Card } from "@/app/shared/ui/Card";
import Button from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Label } from "@/app/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select";

// Hydration-safe Select wrapper component
interface HydrationSafeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  children: React.ReactNode;
  isHydrated: boolean;
}

const HydrationSafeSelect: React.FC<HydrationSafeSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  className,
  children,
  isHydrated
}) => {
  if (!isHydrated) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
        <span className="text-muted-foreground">{placeholder}</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
};

// Simplified validation schema
const technologySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  version: z.string().max(50, "Version must be less than 50 characters").optional(),
  category: z.nativeEnum(TechnologyCategory),
  image: z.string().optional(),
  projectsUsedIn: z.number().min(0, "Projects used in must be at least 0"), // 🔧 Fixed: Required field without default
});

type TechnologyFormData = z.infer<typeof technologySchema>;

interface AddTechnologyFormProps {
  onSubmit: (data: CreateTechnologyPayload, imageFile?: File) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Partial<CreateTechnologyPayload>;
}

export const AddTechnologyForm: React.FC<AddTechnologyFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image && initialData.image !== 'undefined' ? initialData.image : null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || TechnologyCategory.OTHER,
      projectsUsedIn: 0,
      ...(initialData?.version && { version: initialData.version }),
      ...(initialData?.image && { image: initialData.image }),
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL (object URL instead of base64)
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Just store the file name, not the entire base64 data
      setValue("image", file.name);
    }
  };

  const removeImage = () => {
    // Clean up object URL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setValue("image", "");
  };



  const handleFormSubmit = (data: any) => {
    const formData = data as TechnologyFormData;
    const payload: CreateTechnologyPayload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: TechnologyStatus.ACTIVE,
      difficultyLevel: DifficultyLevel.BEGINNER,
      proficiencyLevel: 0,
      estimatedLearningHours: 0,
      projectsUsedIn: formData.projectsUsedIn || 0, // 🔧 Fixed: Use form data instead of hardcoded 0
      tags: [],
      relatedTechnologies: [],
      prerequisites: [],
      learningResources: [],
      images: [],
      isFeatured: false,
      ...(formData.version && { version: formData.version }),
      ...(formData.image && { image: formData.image }),
    };

    onSubmit(payload, selectedImage || undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Add New Technology</h3>
        
        <div className="space-y-6">
          {/* Technology Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Technology Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., React, Node.js, Python"
              className="w-full bg-white"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              placeholder="Brief description of the technology..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              {...register("version")}
              placeholder="e.g., 18.2.0, 3.9, latest"
              className="w-full bg-white"
            />
            {errors.version && (
              <p className="text-sm text-red-600">{errors.version.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <HydrationSafeSelect
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as TechnologyCategory)}
              placeholder="Select a category"
              className="w-full"
              isHydrated={isHydrated}
            >
              {TECHNOLOGY_CATEGORIES.map((category) => (
                <SelectItem key={`category-${category.value}`} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </HydrationSafeSelect>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Projects Used In */}
          <div className="space-y-2">
            <Label htmlFor="projectsUsedIn">Projects Used In</Label>
            <Input
              id="projectsUsedIn"
              type="number"
              min="0"
              {...register("projectsUsedIn", { valueAsNumber: true })}
              placeholder="Number of projects using this technology"
              className="w-full bg-white"
            />
            {errors.projectsUsedIn && (
              <p className="text-sm text-red-600">{errors.projectsUsedIn.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Technology Image</Label>
            <div className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Technology preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
                <span className="text-sm text-gray-500">
                  Optional - PNG, JPG, GIF up to 10MB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Adding Technology..." : "Add Technology"}
          </Button>
        </div>
      </Card>
    </form>
  );
};

// Extended validation schema for edit form
const editTechnologySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  category: z.nativeEnum(TechnologyCategory),
  status: z.nativeEnum(TechnologyStatus),
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  proficiencyLevel: z.number().min(0).max(10),
  estimatedLearningHours: z.number().min(0),
  projectsUsedIn: z.number().min(0),
  version: z.string().max(50, "Version must be less than 50 characters").optional(),
  officialWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  documentation: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  isFeatured: z.boolean(),
});

type EditTechnologyFormData = z.infer<typeof editTechnologySchema>;

interface EditTechnologyFormProps {
  initialData: Technology;
  onSubmit: (data: EditTechnologyFormData, imageFile?: File) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const EditTechnologyForm: React.FC<EditTechnologyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image && initialData.image !== 'undefined' ? initialData.image : null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<EditTechnologyFormData>({
    resolver: zodResolver(editTechnologySchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      category: initialData.category || TechnologyCategory.FRONTEND,
      status: initialData.status || TechnologyStatus.ACTIVE,
      difficultyLevel: initialData.difficultyLevel || DifficultyLevel.BEGINNER,
      proficiencyLevel: initialData.proficiencyLevel || 0,
      estimatedLearningHours: initialData.estimatedLearningHours || 0,
      projectsUsedIn: initialData.projectsUsedIn || 0,
      version: initialData.version || "",
      officialWebsite: initialData.officialWebsite || "",
      documentation: initialData.documentation || "",
      notes: initialData.notes || "",
      isFeatured: initialData.isFeatured || false,
    }
  });

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(
      initialData?.image && initialData.image !== 'undefined' ? initialData.image : null
    );
  };

  const handleFormSubmit = (data: EditTechnologyFormData) => {
    onSubmit(data, selectedImage || undefined);
  };

  return (
    <Card className="p-6" suppressHydrationWarning>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" suppressHydrationWarning>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Technology Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., React, Node.js, Python"
              className={errors.name ? "border-red-500" : "" + "bg-white"}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Version */}
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              {...register("version")}
              placeholder="e.g., 18.2.0, 3.9.0"
              className={errors.version ? "border-red-500" : "" + "bg-white"}
            />
            {errors.version && (
              <p className="text-red-500 text-sm mt-1">{errors.version.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            placeholder="Brief description of the technology..."
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <Label>Technology Image</Label>
          <div className="mt-2">
            <div className="flex items-center gap-4">
              {/* Current Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Technology preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageChange(file);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category, Status, Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as TechnologyCategory)}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : "" }>
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
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status *</Label>
            <HydrationSafeSelect
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as TechnologyStatus)}
              placeholder="Select status"
              className={errors.status ? "border-red-500" : ""}
              isHydrated={isHydrated}
            >
              <SelectItem key="status-active" value={TechnologyStatus.ACTIVE}>Active</SelectItem>
              <SelectItem key="status-inactive" value={TechnologyStatus.INACTIVE}>Inactive</SelectItem>
              <SelectItem key="status-deprecated" value={TechnologyStatus.DEPRECATED}>Deprecated</SelectItem>
            </HydrationSafeSelect>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Difficulty Level */}
          <div>
            <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
            <HydrationSafeSelect
              value={watch("difficultyLevel")}
              onValueChange={(value) => setValue("difficultyLevel", value as DifficultyLevel)}
              placeholder="Select difficulty"
              className={errors.difficultyLevel ? "border-red-500" : ""}
              isHydrated={isHydrated}
            >
              <SelectItem key="difficulty-beginner" value={DifficultyLevel.BEGINNER}>Beginner</SelectItem>
              <SelectItem key="difficulty-intermediate" value={DifficultyLevel.INTERMEDIATE}>Intermediate</SelectItem>
              <SelectItem key="difficulty-advanced" value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
              <SelectItem key="difficulty-expert" value={DifficultyLevel.EXPERT}>Expert</SelectItem>
            </HydrationSafeSelect>
            {errors.difficultyLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel.message}</p>
            )}
          </div>
        </div>

        {/* Proficiency and Learning */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Proficiency Level */}
          <div>
            <Label htmlFor="proficiencyLevel">Proficiency Level (0-10) *</Label>
            <Input
              id="proficiencyLevel"
              type="number"
              min="0"
              max="10"
              {...register("proficiencyLevel", { valueAsNumber: true })}
              className={errors.proficiencyLevel ? "border-red-500" : "" + "bg-white"}
            />
            {errors.proficiencyLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.proficiencyLevel.message}</p>
            )}
          </div>

          {/* Estimated Learning Hours */}
          <div>
            <Label htmlFor="estimatedLearningHours">Learning Hours *</Label>
            <Input
              id="estimatedLearningHours"
              type="number"
              min="0"
              {...register("estimatedLearningHours", { valueAsNumber: true })}
              className={errors.estimatedLearningHours ? "border-red-500" : "" + "bg-white"}
            />
            {errors.estimatedLearningHours && (
              <p className="text-red-500 text-sm mt-1">{errors.estimatedLearningHours.message}</p>
            )}
          </div>

          {/* Projects Used In */}
          <div>
            <Label htmlFor="projectsUsedIn">Projects Used In *</Label>
            <Input
              id="projectsUsedIn"
              type="number"
              min="0"
              {...register("projectsUsedIn", { valueAsNumber: true })}
              className={errors.projectsUsedIn ? "border-red-500" : "" + "bg-white"}
            />
            {errors.projectsUsedIn && (
              <p className="text-red-500 text-sm mt-1">{errors.projectsUsedIn.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Updating Technology..." : "Update Technology"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Export the new optimized form as well
export { TechnologyForm } from './forms/TechnologyForm';
