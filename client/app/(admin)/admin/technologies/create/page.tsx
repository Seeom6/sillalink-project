'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useCreateTechnology, useUploadTechnologyImage } from '@/lib/hooks/use-technologies';
import { TechnologyFormData } from '@/lib/types/technology';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

// Import form component
import { TechnologyForm } from '../components/TechnologyForm';

export default function CreateTechnologyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTechnology = useCreateTechnology();
  const uploadImage = useUploadTechnologyImage();

  const handleSubmit = async (data: TechnologyFormData, imageFile?: File) => {
    setIsSubmitting(true);
    try {
      // First create the technology
      const newTechnology = await createTechnology.mutateAsync(data);

      // If there's an image file, upload it
      const technologyId = newTechnology._id || newTechnology.id;
      if (imageFile && technologyId) {
        try {
          await uploadImage.mutateAsync({
            id: technologyId,
            file: imageFile
          });
        } catch (uploadError) {
          // Don't throw the error, just log it and continue
          alert(`Image upload failed: ${uploadError?.response?.data?.message || uploadError?.message || 'Unknown error'}`);
        }
      }

      router.push('/admin/technologies');
    } catch (error) {
      console.error('Failed to create technology:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/technologies');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link href="/admin/technologies">
            <EnhancedButton
              variant="ghost"
              className="text-primary-400 hover:text-white"
            >
              <FiArrowLeft size={20} />
            </EnhancedButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Technology</h1>
            <p className="text-primary-300 mt-1">
              Add a new technology to your stack
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <EnhancedButton
            variant="outline"
            onClick={handleCancel}
            className="border-primary-500/30 hover:border-primary-500/50"
          >
            <FiX size={16} />
            Cancel
          </EnhancedButton>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GlassCard className="p-8">
          <TechnologyForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting || createTechnology.isPending || uploadImage.isPending}
          />
        </GlassCard>
      </motion.div>
    </div>
  );
}
