'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import {
  Technology,
  TechnologyFormData,
  TechnologyCategory,
  TechnologyStatus,
  DifficultyLevel
} from '@/lib/types/technology';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ImageUpload } from '@/components/ui/image-upload';

interface TechnologyFormProps {
  technology?: Technology;
  onSubmit: (data: TechnologyFormData, imageFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TechnologyForm: React.FC<TechnologyFormProps> = ({
  technology,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(technology?.image || null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TechnologyFormData>({
    defaultValues: {
      name: technology?.name ?? '',
      description: technology?.description ?? '',
      category: technology?.category ?? TechnologyCategory.OTHER,
      status: technology?.status ?? TechnologyStatus.ACTIVE,
      difficultyLevel: technology?.difficultyLevel ?? DifficultyLevel.BEGINNER,
      proficiencyLevel: technology?.proficiencyLevel ?? 0,
      estimatedLearningHours: technology?.estimatedLearningHours ?? 0,
      isFeatured: technology?.isFeatured ?? false,
      tags: [],
      prerequisites: [],
      learningResources: []
    }
  });

  const handleFormSubmit = (data: TechnologyFormData) => {
    onSubmit(data, imageFile || undefined);
  };

  const handleImageChange = (file: File | null, preview?: string) => {
    setImageFile(file);
    setImagePreview(preview || null);
    setImageError(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-primary-500/20 pb-2">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-300 mb-2">
              Technology Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50"
              placeholder="e.g., React, Node.js, PostgreSQL"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-300 mb-2">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white focus:outline-none focus:border-primary-500/50"
            >
              {Object.values(TechnologyCategory).map((category) => (
                <option key={category} value={category} className="bg-dark-800">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-300 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50 resize-vertical"
            placeholder="Brief description of the technology..."
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-primary-500/20 pb-2 flex items-center space-x-2">
          <FiImage className="w-5 h-5" />
          <span>Technology Image</span>
        </h3>

        <div className="space-y-2">
          <p className="text-sm text-primary-300">
            Upload an image to represent this technology. This will be displayed in cards and listings.
          </p>

          <ImageUpload
            value={imagePreview}
            onChange={handleImageChange}
            error={imageError}
            placeholder="Click to upload technology image or drag and drop"
            maxSize={5}
            acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
            className="w-full"
          />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-primary-500/20 pb-2">
          Classification
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-300 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white focus:outline-none focus:border-primary-500/50"
            >
              {Object.values(TechnologyStatus).map((status) => (
                <option key={status} value={status} className="bg-dark-800">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-300 mb-2">
              Difficulty Level
            </label>
            <select
              {...register('difficultyLevel')}
              className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white focus:outline-none focus:border-primary-500/50"
            >
              {Object.values(DifficultyLevel).map((difficulty) => (
                <option key={difficulty} value={difficulty} className="bg-dark-800">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-300 mb-2">
              Proficiency Level (0-100)
            </label>
            <input
              type="number"
              {...register('proficiencyLevel', { min: 0, max: 100, valueAsNumber: true })}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50"
              placeholder="0-100"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('isFeatured')}
            className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
          />
          <label className="text-primary-300">Featured Technology</label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary-500/20">
        <EnhancedButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-primary-500/30 hover:border-primary-500/50"
        >
          <FiX size={16} />
          Cancel
        </EnhancedButton>
        
        <EnhancedButton
          type="submit"
          variant="gradient"
          disabled={isLoading}
          glow
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {technology ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <FiSave size={16} />
              {technology ? 'Update Technology' : 'Create Technology'}
            </>
          )}
        </EnhancedButton>
      </div>
    </motion.form>
  );
};
