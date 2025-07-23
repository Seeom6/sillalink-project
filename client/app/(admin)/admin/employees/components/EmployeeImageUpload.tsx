'use client';

import React, { useState, useRef } from 'react';
import { FiUser, FiCamera, FiTrash2, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import employeesApi from '@/lib/api/admin/employees';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface EmployeeImageUploadProps {
  employeeId: string;
  currentImageUrl?: string;
  onImageUpdate?: (newImageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export const EmployeeImageUpload: React.FC<EmployeeImageUploadProps> = ({
  employeeId,
  currentImageUrl,
  onImageUpdate,
  size = 'md',
  editable = true
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await employeesApi.uploadImage(employeeId, file);
      setImageUrl(response.imageUrl);
      setPreviewUrl(null);
      onImageUpdate?.(response.imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (confirm('Are you sure you want to remove the profile image?')) {
      try {
        // Note: You might want to add a remove image endpoint to the backend
        setImageUrl('');
        setPreviewUrl(null);
        onImageUpdate?.('');
      } catch (error) {
        console.error('Failed to remove image:', error);
        alert('Failed to remove image. Please try again.');
      }
    }
  };

  const displayUrl = previewUrl || imageUrl;

  return (
    <div className="relative inline-block">
      {/* Image Display */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-primary-500 bg-dark-700`}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiUser className={`${iconSizes[size]} text-primary-400`} />
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FiUpload className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}

        {/* Edit Overlay */}
        {editable && !isUploading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <FiCamera className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {editable && (
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Upload new image"
          >
            <FiCamera className="w-3 h-3" />
          </button>

          {/* Remove Button */}
          {displayUrl && (
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              title="Remove image"
            >
              <FiTrash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
};

// Standalone Upload Component for Forms
interface ImageUploadFieldProps {
  value?: string;
  onChange?: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  error,
  label = "Profile Image",
  required = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewUrl(url);
        onChange?.(file, url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="flex items-center space-x-4">
        {/* Image Preview */}
        <div className="relative">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-dark-700 border-2 border-dashed border-primary-500 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-primary-400" />
            </div>
          )}
        </div>
        
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <EnhancedButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <FiCamera className="w-4 h-4" />
            <span>{previewUrl ? 'Change Image' : 'Upload Image'}</span>
          </EnhancedButton>
          <p className="text-xs text-primary-400 mt-1">
            JPG, PNG or GIF (max 5MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
