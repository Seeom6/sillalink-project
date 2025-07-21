'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiUpload,
  FiX,
  FiImage,
  FiAlertCircle,
  FiCheck,
  FiLoader
} from 'react-icons/fi';
import { cn } from '@/lib/utils/cn';

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null, preview?: string) => void;
  onUploadComplete?: (url: string) => void;
  className?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  showPreview?: boolean;
  placeholder?: string;
  error?: string | null;
  isUploading?: boolean;
}

const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE = 5; // 5MB

// Helper function to validate and format image URLs
const getValidImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's a data URL (base64), return it as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // If it's already a full URL, validate it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return null;
    }
  }

  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
  }

  // For other cases, try to construct a valid URL
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's not a valid URL, treat it as a relative path
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl}`;
  }
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onUploadComplete,
  className,
  disabled = false,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  showPreview = true,
  placeholder = 'Click to upload or drag and drop',
  error,
  isUploading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(getValidImageUrl(value));
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(getValidImageUrl(value));
  }, [value]);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size too large. Maximum size: ${maxSize}MB`;
    }

    return null;
  }, [acceptedFormats, maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onChange(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [validateFile, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, isUploading, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <motion.div
        whileHover={{ scale: disabled || isUploading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isUploading ? 1 : 0.98 }}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer',
          'bg-slate-800/30 backdrop-blur-sm',
          {
            'border-slate-600 hover:border-slate-500': !isDragOver && !error && !disabled,
            'border-purple-500 bg-purple-500/10': isDragOver && !disabled,
            'border-red-500 bg-red-500/10': error,
            'border-green-500 bg-green-500/10': preview && !error,
            'opacity-50 cursor-not-allowed': disabled || isUploading,
          }
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Icon */}
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            {
              'bg-slate-700 text-slate-400': !isDragOver && !error && !preview,
              'bg-purple-500/20 text-purple-400': isDragOver,
              'bg-red-500/20 text-red-400': error,
              'bg-green-500/20 text-green-400': preview && !error,
            }
          )}>
            {isUploading ? (
              <FiLoader className="w-6 h-6 animate-spin" />
            ) : error ? (
              <FiAlertCircle className="w-6 h-6" />
            ) : preview ? (
              <FiCheck className="w-6 h-6" />
            ) : (
              <FiUpload className="w-6 h-6" />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-gray-300 font-medium">
              {isUploading ? 'Uploading...' : placeholder}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {acceptedFormats.map(f => f.split('/')[1]).join(', ')} up to {maxSize}MB
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full max-w-xs">
              <div className="bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Preview */}
      <AnimatePresence>
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <div className="relative w-full h-48 bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => {
                    setPreview(null);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FiImage className="w-12 h-12 text-slate-500" />
                </div>
              )}
              
              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                disabled={disabled || isUploading}
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-400 text-sm"
        >
          <FiAlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;
