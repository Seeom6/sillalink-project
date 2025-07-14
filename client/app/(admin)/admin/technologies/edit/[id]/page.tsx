'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiLoader } from 'react-icons/fi';
import { useTechnology, useUpdateTechnology } from '@/lib/hooks/use-technologies';
import { TechnologyFormData } from '@/lib/types/technology';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

// Import form component
import { TechnologyForm } from '../../components/TechnologyForm';

interface EditTechnologyPageProps {
  params: {
    id: string;
  };
}

export default function EditTechnologyPage({ params }: EditTechnologyPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: technology, isLoading, error } = useTechnology(params.id);
  const updateTechnology = useUpdateTechnology();

  const handleSubmit = async (data: TechnologyFormData) => {
    setIsSubmitting(true);
    try {
      await updateTechnology.mutateAsync({
        id: params.id,
        data
      });
      router.push('/admin/technologies');
    } catch (error) {
      console.error('Failed to update technology:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/technologies');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-primary-300">
          <FiLoader className="w-6 h-6 animate-spin" />
          <span>Loading technology...</span>
        </div>
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="space-y-6">
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
            <h1 className="text-3xl font-bold text-white">Technology Not Found</h1>
            <p className="text-primary-300 mt-1">
              The technology you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </div>
        
        <GlassCard className="p-8 text-center">
          <div className="text-red-400 mb-4">
            Failed to load technology data
          </div>
          <Link href="/admin/technologies">
            <EnhancedButton variant="primary">
              Back to Technologies
            </EnhancedButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white">Edit Technology</h1>
            <p className="text-primary-300 mt-1">
              Update {technology.name} information
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
            technology={technology}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting || updateTechnology.isPending}
          />
        </GlassCard>
      </motion.div>
    </div>
  );
}
