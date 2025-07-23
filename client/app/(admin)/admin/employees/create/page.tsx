'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCreateEmployee } from '@/lib/hooks/use-employees';
import { useQueryClient } from '@tanstack/react-query';
import { employeeKeys } from '@/lib/hooks/use-employees';
import { employeesApi } from '@/lib/api/admin/employees';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { CreateEmployeeData, EmployeeDepartment, EmployeeStatus, EmploymentType } from '@/lib/types/employee';
import { toast } from 'react-hot-toast';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

// Import the form component
import { MultiStepEmployeeForm } from '../components/MultiStepEmployeeForm';
import { ErrorTestComponent } from '../components/ErrorTestComponent';

export default function CreateEmployeePage() {
  const router = useRouter();
  const createEmployeeMutation = useCreateEmployee();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateEmployeeData, image?: File | null) => {
    setIsSubmitting(true);
    try {
      // First create the employee
      const newEmployee = await createEmployeeMutation.mutateAsync(data);

      // If an image was selected, upload it
      const employeeId = newEmployee._id || (newEmployee as any).id;
      if (image && employeeId) {
        try {
          console.log('🔥 Uploading image for new employee:', employeeId);
          const uploadResult = await employeesApi.uploadImage(employeeId, image);
          console.log('🔥 Image upload result:', uploadResult);

          // Invalidate cache to refresh employee data with new image
          queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
          queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });

          toast.success('Profile image uploaded successfully!');
        } catch (imageError: any) {
          console.error('Failed to upload image:', imageError);
          const imageErrorMessage = extractErrorMessage(imageError, 'Failed to upload profile image');
          toast.error(imageErrorMessage);
          // Don't fail the entire process if image upload fails
        }
      }

      router.push('/admin/employees');
    } catch (error: any) {
      // Error is handled by the mutation, but let's log it for debugging
      console.error('Create employee error in component:', {
        error,
        message: error?.message,
        response: error?.response,
        responseData: error?.response?.data,
        status: error?.response?.status
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/employees');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/employees">
              <EnhancedButton
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Employees</span>
              </EnhancedButton>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Add New Employee</h1>
                <p className="text-primary-300 mt-1">Create a new employee record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MultiStepEmployeeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </motion.div>

        {/* Error Testing Component - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8"
          >
            <ErrorTestComponent />
          </motion.div>
        )}
      </div>
    </div>
  );
}
