"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
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
import { Textarea } from "@/app/shared/ui/textarea";
import { Checkbox } from "@/app/shared/ui/checkbox";

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

// Constants and utilities
const VALIDATION_RULES = {
  NAME: { MIN_LENGTH: 2, MAX_LENGTH: 100 },
  DESCRIPTION: { MIN_LENGTH: 10, MAX_LENGTH: 500 },
  LONG_DESCRIPTION: { MAX_LENGTH: 2000 },
  VERSION: { MAX_LENGTH: 50 },
  NOTES: { MAX_LENGTH: 1000 },
  PROFICIENCY: { MIN: 0, MAX: 100 },
  LEARNING_HOURS: { MIN: 0, MAX: 10000 },
  PROJECTS: { MIN: 0, MAX: 1000 }
};

const IMAGE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'svg']
};

const sanitizeImageUrl = (imageUrl: string | undefined): string | null => {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === 'undefined' || imageUrl.trim().length === 0 || imageUrl.includes('/undefined')) {
    return null;
  }
  return imageUrl;
};

// Optimized validation schema using constants
const technologySchema = z.object({
  name: z.string()
    .min(VALIDATION_RULES.NAME.MIN_LENGTH, `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.NAME.MAX_LENGTH, `Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`),
  description: z.string()
    .min(VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.DESCRIPTION.MAX_LENGTH, `Description must be less than ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`),
  longDescription: z.string()
    .max(VALIDATION_RULES.LONG_DESCRIPTION.MAX_LENGTH, `Long description must be less than ${VALIDATION_RULES.LONG_DESCRIPTION.MAX_LENGTH} characters`)
    .optional()
    .or(z.literal("")),
  category: z.nativeEnum(TechnologyCategory),
  status: z.nativeEnum(TechnologyStatus),
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  proficiencyLevel: z.number()
    .min(VALIDATION_RULES.PROFICIENCY.MIN)
    .max(VALIDATION_RULES.PROFICIENCY.MAX),
  estimatedLearningHours: z.number()
    .min(VALIDATION_RULES.LEARNING_HOURS.MIN)
    .max(VALIDATION_RULES.LEARNING_HOURS.MAX),
  projectsUsedIn: z.number()
    .min(VALIDATION_RULES.PROJECTS.MIN)
    .max(VALIDATION_RULES.PROJECTS.MAX),
  version: z.string()
    .max(VALIDATION_RULES.VERSION.MAX_LENGTH)
    .optional()
    .or(z.literal("")),
  officialWebsite: z.string().optional().or(z.literal("")),
  documentation: z.string().optional().or(z.literal("")),
  notes: z.string()
    .max(VALIDATION_RULES.NOTES.MAX_LENGTH)
    .optional()
    .or(z.literal("")),
  isFeatured: z.boolean(),
  image: z.string().optional().or(z.literal("")),
});

type TechnologyFormData = z.infer<typeof technologySchema>;

interface TechnologyFormProps {
  mode: 'create' | 'edit';
  initialData?: Technology | Partial<CreateTechnologyPayload>;
  onSubmit: (data: TechnologyFormData, imageFile?: File) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const TechnologyForm = memo<TechnologyFormProps>(({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    sanitizeImageUrl(initialData?.image)
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
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      longDescription: initialData?.longDescription || "",
      category: initialData?.category || TechnologyCategory.FRONTEND,
      status: initialData?.status || TechnologyStatus.ACTIVE,
      difficultyLevel: initialData?.difficultyLevel || DifficultyLevel.BEGINNER,
      proficiencyLevel: initialData?.proficiencyLevel || 0,
      estimatedLearningHours: initialData?.estimatedLearningHours || 0,
      projectsUsedIn: initialData?.projectsUsedIn || 0,
      version: initialData?.version || "",
      officialWebsite: initialData?.officialWebsite || "",
      documentation: initialData?.documentation || "",
      notes: initialData?.notes || "",
      isFeatured: initialData?.isFeatured || false,
    }
  });

  const handleImageChange = useCallback((file: File) => {
    // Validate file type
    if (!IMAGE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      alert(`Invalid file type. Allowed types: ${IMAGE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
      alert(`File too large. Maximum size: ${IMAGE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageRemove = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(sanitizeImageUrl(initialData?.image));
  }, [initialData?.image]);

  const handleFormSubmit = useCallback((data: any) => {
    const formData = data as TechnologyFormData;
    onSubmit(formData, selectedImage || undefined);
  }, [onSubmit, selectedImage]);

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Add New Technology' : 'Edit Technology'}
            </h1>
          </div>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Technology'}
          </Button>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Technology Name *</Label>
            <Input
              id="name"
              {...register("name")}
              className={errors.name ? "border-red-500" : "" + "bg-white"}
              placeholder="e.g., React, Node.js, Python"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              {...register("version")}
              className={errors.version ? "border-red-500" : "" + "bg-white"}
              placeholder="e.g., 18.2.0, 3.9"
            />
            {errors.version && (
              <p className="text-sm text-red-600">{errors.version.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
            placeholder="Brief description of the technology..."
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Long Description */}
        <div className="space-y-2">
          <Label htmlFor="longDescription">Detailed Description</Label>
          <Textarea
            id="longDescription"
            {...register("longDescription")}
            className={errors.longDescription ? "border-red-500" : ""}
            placeholder="Detailed description, use cases, benefits..."
            rows={5}
          />
          {errors.longDescription && (
            <p className="text-sm text-red-600">{errors.longDescription.message}</p>
          )}
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Category *</Label>
            <HydrationSafeSelect
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as TechnologyCategory)}
              placeholder="Select category"
              className={errors.category ? "border-red-500" : ""}
              isHydrated={isHydrated}
            >
              {TECHNOLOGY_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </HydrationSafeSelect>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <HydrationSafeSelect
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as TechnologyStatus)}
              placeholder="Select status"
              isHydrated={isHydrated}
            >
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </HydrationSafeSelect>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <HydrationSafeSelect
              value={watch("difficultyLevel")}
              onValueChange={(value) => setValue("difficultyLevel", value as DifficultyLevel)}
              placeholder="Select difficulty"
              isHydrated={isHydrated}
            >
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </HydrationSafeSelect>
          </div>
        </div>

        {/* Numeric Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="proficiencyLevel">Proficiency Level (%)</Label>
            <Input
              id="proficiencyLevel"
              type="number"
              min="0"
              max="100"
              {...register("proficiencyLevel", { valueAsNumber: true })}
              className={errors.proficiencyLevel ? "border-red-500" : "" + "bg-white"}
            />
            {errors.proficiencyLevel && (
              <p className="text-sm text-red-600">{errors.proficiencyLevel.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedLearningHours">Learning Hours</Label>
            <Input
              id="estimatedLearningHours"
              type="number"
              min="0"
              {...register("estimatedLearningHours", { valueAsNumber: true })}
              className={errors.estimatedLearningHours ? "border-red-500" : "" + "bg-white"}
            />
            {errors.estimatedLearningHours && (
              <p className="text-sm text-red-600">{errors.estimatedLearningHours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectsUsedIn">Projects Used In</Label>
            <Input
              id="projectsUsedIn"
              type="number"
              min="0"
              {...register("projectsUsedIn", { valueAsNumber: true })}
              className={errors.projectsUsedIn ? "border-red-500" : "" + "bg-white"}
            />
            {errors.projectsUsedIn && (
              <p className="text-sm text-red-600">{errors.projectsUsedIn.message}</p>
            )}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="officialWebsite">Official Website</Label>
            <Input
              id="officialWebsite"
              type="url"
              {...register("officialWebsite")}
              placeholder="https://example.com"
            />
            {errors.officialWebsite && (
              <p className="text-sm text-red-600">{errors.officialWebsite.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentation">Documentation URL</Label>
            <Input
              id="documentation"
              type="url"
              {...register("documentation")}
              placeholder="https://docs.example.com"
            />
            {errors.documentation && (
              <p className="text-sm text-red-600">{errors.documentation.message}</p>
            )}
          </div>
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
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  id="image-upload"
                  type="file"
                  accept={IMAGE_UPLOAD.ALLOWED_TYPES.join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageChange(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF up to {IMAGE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Additional notes, tips, or personal observations..."
            rows={3}
          />
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={watch("isFeatured")}
            onCheckedChange={(checked) => setValue("isFeatured", checked as boolean)}
          />
          <Label htmlFor="featured">Featured Technology</Label>
        </div>
      </form>
    </Card>
  );
});

TechnologyForm.displayName = 'TechnologyForm';
