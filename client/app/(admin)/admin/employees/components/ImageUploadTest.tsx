'use client';

import React, { useState } from 'react';
import { FiUpload, FiImage, FiCheck, FiX } from 'react-icons/fi';
import employeesApi from '@/lib/api/admin/employees';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';

interface ImageUploadTestProps {
  employeeId: string;
  employeeName: string;
  currentImageUrl?: string;
  onImageUploaded?: (newImageUrl: string) => void;
}

export const ImageUploadTest: React.FC<ImageUploadTestProps> = ({
  employeeId,
  employeeName,
  currentImageUrl,
  onImageUploaded
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    imageUrl?: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setUploadResult({
          success: false,
          message: 'Please select an image file'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadResult({
          success: false,
          message: 'File size must be less than 5MB'
        });
        return;
      }

      setSelectedFile(file);
      setUploadResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      console.log('Uploading image for employee:', employeeId);
      const response = await employeesApi.uploadImage(employeeId, selectedFile);
      
      console.log('Upload response:', response);
      
      setUploadResult({
        success: true,
        message: response.message || 'Image uploaded successfully',
        imageUrl: response.imageUrl
      });

      onImageUploaded?.(response.imageUrl);
      
      // Clear selection
      setSelectedFile(null);
      setPreviewUrl(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: error.response?.data?.message || error.message || 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadResult(null);
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Test Image Upload for {employeeName}
      </h3>

      {/* Current Image */}
      {currentImageUrl && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-primary-300 mb-2">Current Image:</h4>
          <div className="flex items-center space-x-4">
            <img
              src={currentImageUrl}
              alt="Current profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
              onError={(e) => {
                console.error('Current image failed to load:', currentImageUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-xs text-primary-400">
              <div>URL: {currentImageUrl}</div>
            </div>
          </div>
        </div>
      )}

      {/* File Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary-300 mb-2">
          Select Image File:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-primary-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-500 file:text-white hover:file:bg-primary-600"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-primary-300 mb-2">Preview:</h4>
          <div className="flex items-center space-x-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
            />
            <div className="text-xs text-primary-400">
              <div>File: {selectedFile?.name}</div>
              <div>Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB</div>
              <div>Type: {selectedFile?.type}</div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center space-x-2 mb-4">
        <EnhancedButton
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          variant="primary"
          size="sm"
          className="flex items-center space-x-2"
        >
          <FiUpload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
        </EnhancedButton>

        {selectedFile && (
          <EnhancedButton
            onClick={clearSelection}
            disabled={isUploading}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiX className="w-4 h-4" />
            <span>Clear</span>
          </EnhancedButton>
        )}
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`p-3 rounded-lg flex items-center space-x-2 ${
          uploadResult.success 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {uploadResult.success ? (
            <FiCheck className="w-4 h-4" />
          ) : (
            <FiX className="w-4 h-4" />
          )}
          <div className="flex-1">
            <div className="text-sm font-medium">{uploadResult.message}</div>
            {uploadResult.imageUrl && (
              <div className="text-xs mt-1">
                New URL: {uploadResult.imageUrl}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-dark-700/30 rounded-lg">
        <h4 className="text-xs font-medium text-primary-400 mb-2">Debug Info:</h4>
        <div className="text-xs text-primary-300 space-y-1">
          <div>Employee ID: {employeeId}</div>
          <div>API Base URL: {process.env.NEXT_PUBLIC_API_URL}</div>
          <div>Expected Upload Path: media/image/employees/[filename]</div>
        </div>
      </div>
    </GlassCard>
  );
};
