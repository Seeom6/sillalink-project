'use client';

import React, { useState, use } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiSave, FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEmployee, useUpdateEmployee, employeeKeys } from '@/lib/hooks/use-employees';
import { employeesApi } from '@/lib/api/admin/employees';
import { useQueryClient } from '@tanstack/react-query';
import { UpdateEmployeeData } from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

// Import the form component
import { EmployeeEditForm } from '../../components/EmployeeEditForm';

interface EditEmployeePageProps {
  params: Promise<{ id: string }>;
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  console.log('🔥 EditEmployeePage: Resolved params:', resolvedParams);
  console.log('🔥 EditEmployeePage: Employee ID:', resolvedParams.id);

  // Validate that we have a valid ID
  if (!resolvedParams.id || resolvedParams.id === 'undefined') {
    console.error('🔥 EditEmployeePage: Invalid or missing employee ID');
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <GlassCard className="p-8 text-center">
            <div className="text-red-400 mb-4">
              <p className="text-lg font-semibold">Invalid Employee ID</p>
              <p className="text-sm text-primary-300 mt-2">
                The employee ID is missing or invalid. Please go back to the employee list and try again.
              </p>
            </div>
            <Link href="/admin/employees">
              <EnhancedButton variant="primary">
                Back to Employees
              </EnhancedButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  const { data: employee, isLoading, error } = useEmployee(resolvedParams.id);
  const updateEmployeeMutation = useUpdateEmployee();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UpdateEmployeeData, imageFile?: File | null) => {
    console.log('🔥 EditEmployee: handleSubmit called');
    console.log('🔥 EditEmployee: Employee ID:', resolvedParams.id);
    console.log('🔥 EditEmployee: Update data received:', data);
    console.log('🔥 EditEmployee: Update data keys:', Object.keys(data));
    console.log('🔥 EditEmployee: Image file:', imageFile);
    console.log('🔥 EditEmployee: Current employee data:', employee);

    setIsSubmitting(true);
    try {
      console.log('🔥 EditEmployee: Starting employee data update');

      // First update the employee data
      const updateResult = await updateEmployeeMutation.mutateAsync({ id: resolvedParams.id, data });
      console.log('🔥 EditEmployee: Employee data update successful:', updateResult);

      // If an image was selected, upload it
      if (imageFile) {
        try {
          console.log('🔥 EditEmployee: Starting image upload for employee:', resolvedParams.id);
          const uploadResult = await employeesApi.uploadImage(resolvedParams.id, imageFile);
          console.log('🔥 EditEmployee: Image upload result:', uploadResult);

          // Invalidate cache to refresh employee data with new image
          queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
          queryClient.invalidateQueries({ queryKey: employeeKeys.detail(resolvedParams.id) });

          console.log('🔥 EditEmployee: Employee updated and image uploaded successfully');
        } catch (imageError: any) {
          console.error('🔥 EditEmployee: Image upload failed:', imageError);
          // Don't fail the entire process if image upload fails
          // The employee data was already updated successfully
        }
      }

      console.log('🔥 EditEmployee: All updates completed, redirecting to employee list');
      router.push('/admin/employees');
    } catch (error: any) {
      console.error('🔥 EditEmployee: Update failed:', error);
      console.error('🔥 EditEmployee: Error details:', {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data
      });
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/employees');
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3 text-primary-300">
              <FiLoader className="w-6 h-6 animate-spin" />
              <span>Loading employee...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <GlassCard className="p-8 text-center">
            <div className="text-red-400 mb-4">
              <p className="text-lg font-semibold">Error loading employee</p>
              <p className="text-sm text-primary-300 mt-2">
                {error instanceof Error ? error.message : 'Employee not found'}
              </p>
            </div>
            <Link href="/admin/employees">
              <EnhancedButton variant="primary">
                Back to Employees
              </EnhancedButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
                <h1 className="text-3xl font-bold text-white">
                  Edit Employee: {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-primary-300 mt-1">Update employee information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <EmployeeEditForm
          employee={employee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
