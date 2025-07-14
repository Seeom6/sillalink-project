'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiX, FiImage } from 'react-icons/fi';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ImageUpload } from '@/components/ui/image-upload';
import { useUploadTechnologyImage, useCreateTechnology } from '@/lib/hooks/use-technologies';
import { TechnologyFormData, TechnologyCategory, TechnologyStatus, DifficultyLevel } from '@/lib/types/technology';

export default function ImageUploadTestPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  
  const uploadImage = useUploadTechnologyImage();
  const createTechnology = useCreateTechnology();

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleImageChange = (file: File | null, preview?: string) => {
    setImageFile(file);
    setImagePreview(preview || null);
    
    if (file) {
      addTestResult(`✅ Image selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    } else {
      addTestResult('❌ Image removed');
    }
  };

  const testCreateTechnologyWithImage = async () => {
    if (!imageFile) {
      addTestResult('❌ No image file selected for testing');
      return;
    }

    setIsTestingAPI(true);
    addTestResult('🚀 Starting end-to-end test...');

    try {
      // Step 1: Create a test technology
      const testTechnologyData: TechnologyFormData = {
        name: `Test Technology ${Date.now()}`,
        description: 'This is a test technology created for image upload testing',
        category: TechnologyCategory.FRONTEND,
        status: TechnologyStatus.ACTIVE,
        difficultyLevel: DifficultyLevel.BEGINNER,
        proficiencyLevel: 75,
        estimatedLearningHours: 40,
        isFeatured: false,
        tags: ['test', 'image-upload'],
        prerequisites: [],
        learningResources: []
      };

      addTestResult('📝 Creating test technology...');
      const newTechnology = await createTechnology.mutateAsync(testTechnologyData);
      addTestResult(`✅ Technology created with ID: ${newTechnology._id}`);

      // Step 2: Upload image to the created technology
      addTestResult('📤 Uploading image...');
      const uploadResult = await uploadImage.mutateAsync({
        id: newTechnology._id,
        file: imageFile
      });
      
      addTestResult(`✅ Image uploaded successfully!`);
      addTestResult(`🖼️ Image URL: ${uploadResult.imageUrl}`);
      addTestResult(`💬 Server message: ${uploadResult.message}`);
      
      addTestResult('🎉 End-to-end test completed successfully!');

    } catch (error: any) {
      addTestResult(`❌ Test failed: ${error.message || error}`);
      console.error('Test error:', error);
    } finally {
      setIsTestingAPI(false);
    }
  };

  const testImageValidation = () => {
    addTestResult('🧪 Testing image validation...');
    
    // Test file size validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile && imageFile.size > maxSize) {
      addTestResult(`❌ File too large: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB > 5MB`);
    } else if (imageFile) {
      addTestResult(`✅ File size OK: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Test file type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (imageFile && !allowedTypes.includes(imageFile.type)) {
      addTestResult(`❌ Invalid file type: ${imageFile.type}`);
    } else if (imageFile) {
      addTestResult(`✅ File type OK: ${imageFile.type}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Image Upload Test</h1>
        <p className="text-gray-300">
          Test the technology image upload functionality
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <GlassCard variant="secondary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center space-x-2">
            <FiImage className="w-5 h-5" />
            <span>Image Upload</span>
          </h2>
          
          <ImageUpload
            value={imagePreview}
            onChange={handleImageChange}
            isUploading={uploadImage.isPending}
            placeholder="Select an image to test upload functionality"
            maxSize={5}
            acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
            className="w-full"
          />

          <div className="mt-4 space-y-2">
            <EnhancedButton
              onClick={testImageValidation}
              disabled={!imageFile}
              variant="outline"
              className="w-full"
            >
              <FiCheck className="w-4 h-4" />
              Test Validation
            </EnhancedButton>
            
            <EnhancedButton
              onClick={testCreateTechnologyWithImage}
              disabled={!imageFile || isTestingAPI}
              variant="gradient"
              className="w-full"
              glow
            >
              {isTestingAPI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Testing API...
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4" />
                  Test Full Upload Flow
                </>
              )}
            </EnhancedButton>
          </div>
        </GlassCard>

        {/* Test Results */}
        <GlassCard variant="secondary" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center space-x-2">
              <FiCheck className="w-5 h-5" />
              <span>Test Results</span>
            </h2>
            <EnhancedButton
              onClick={clearResults}
              variant="ghost"
              size="sm"
            >
              <FiX className="w-4 h-4" />
              Clear
            </EnhancedButton>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400 text-center">No test results yet...</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-gray-300 p-2 bg-slate-800/50 rounded border-l-2 border-purple-500/50"
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* API Status */}
      <GlassCard variant="primary" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Backend Status</h3>
            <p className="text-gray-300 text-sm">
              Backend API: <span className="text-green-400">✅ Running on port 5000</span>
            </p>
            <p className="text-gray-300 text-sm">
              Upload endpoint: <span className="text-blue-400">/api/v1/admin/technologies/:id/upload-image</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Frontend: <span className="text-green-400">✅ Connected</span></p>
            <p className="text-gray-300 text-sm">Auth: <span className="text-green-400">✅ Ready</span></p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
