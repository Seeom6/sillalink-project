'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiImage, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from 'react-icons/fi';
import {
  Employee,
  CreateEmployeeData,
  EmployeeDepartment,
  EmployeeStatus,
  EmploymentType,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS
} from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ImageUpload } from '@/components/ui/image-upload';

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: any, imageFile?: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = 'Save Employee',
  cancelText = 'Cancel'
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.profileImage || null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
      position: initialData?.position || '',
      department: initialData?.department || EmployeeDepartment.OTHER,
      employmentType: initialData?.employmentType || EmploymentType.FULL_TIME,
      salary: initialData?.salary || undefined,
      hireDate: initialData?.hireDate ? initialData.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      address: initialData?.address || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      emergencyContact: initialData?.emergencyContact || '',
      emergencyPhone: initialData?.emergencyPhone || '',
      managerId: initialData?.managerId || '',
      status: initialData?.status || EmployeeStatus.ACTIVE,
      bio: initialData?.bio || '',
      skills: initialData?.skills || [],
      certifications: initialData?.certifications || [],
      linkedinProfile: initialData?.linkedinProfile || '',
      githubProfile: initialData?.githubProfile || '',
      portfolioUrl: initialData?.portfolioUrl || '',
      notes: initialData?.notes || '',
      isFeatured: initialData?.isFeatured || false,
      performanceRating: initialData?.performanceRating || 0
    }
  });

  const handleImageChange = (file: File | null, preview?: string) => {
    setImageFile(file);
    setImagePreview(preview || null);
    setImageError(null);
  };

  const onFormSubmit = (data: any) => {
    console.log('🔥 EmployeeForm: onFormSubmit called');
    console.log('🔥 EmployeeForm: Raw form data:', data);
    console.log('🔥 EmployeeForm: Form data keys:', Object.keys(data));
    console.log('🔥 EmployeeForm: Image file:', imageFile);
    console.log('🔥 EmployeeForm: Initial data:', initialData);

    // Convert skills and certifications from comma-separated strings to arrays
    // Convert date strings to ISO format for backend compatibility
    const processedData: CreateEmployeeData = {
      ...data,
      skills: typeof data.skills === 'string'
        ? (data.skills as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : data.skills || [],
      certifications: typeof data.certifications === 'string'
        ? (data.certifications as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : data.certifications || [],
      salary: data.salary ? Number(data.salary) : undefined,
      performanceRating: data.performanceRating ? Number(data.performanceRating) : undefined,
      // Convert date strings to ISO format
      hireDate: data.hireDate ? new Date(data.hireDate).toISOString() : undefined,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      contractStartDate: data.contractStartDate ? new Date(data.contractStartDate).toISOString() : undefined,
      contractEndDate: data.contractEndDate ? new Date(data.contractEndDate).toISOString() : undefined
    };

    console.log('🔥 EmployeeForm: Processed data:', processedData);
    console.log('🔥 EmployeeForm: Processed data keys:', Object.keys(processedData));
    console.log('🔥 EmployeeForm: Calling onSubmit with processed data and image file');

    // Pass both the processed data and the image file
    onSubmit(processedData, imageFile);
  };



  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 sm:space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="mb-4 flex items-center space-x-3 sm:mb-6">
          <div className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-violet p-2 shadow-glow-sm">
            <FiUser className="size-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              First Name *
            </label>
            <input
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-400">{(errors.firstName as any)?.message || 'This field is required'}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Last Name *
            </label>
            <input
              {...register('lastName', { 
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm">{(errors.lastName as any)?.message || 'This field is required'}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{(errors.email as any)?.message || 'This field is required'}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter phone number"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Date of Birth
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiBriefcase className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold text-white">Professional Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Position *
            </label>
            <input
              {...register('position', { 
                required: 'Position is required',
                minLength: { value: 2, message: 'Position must be at least 2 characters' }
              })}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter job position"
            />
            {errors.position && (
              <p className="text-red-400 text-sm">{(errors.position as any)?.message || 'This field is required'}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Department *
            </label>
            <select
              {...register('department', { required: 'Department is required' })}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-400 text-sm">{(errors.department as any)?.message || 'This field is required'}</p>
            )}
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Employment Type
            </label>
            <select
              {...register('employmentType')}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Salary (Annual)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              {...register('salary')}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter annual salary"
            />
          </div>

          {/* Hire Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Hire Date *
            </label>
            <input
              type="date"
              {...register('hireDate', { required: 'Hire date is required' })}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            {errors.hireDate && (
              <p className="text-red-400 text-sm">{errors.hireDate.message as any}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiImage className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold text-white">Profile Image</h2>
        </div>

        <ImageUpload
          value={imagePreview}
          onChange={handleImageChange}
          maxSize={5} // 5MB
          acceptedFormats={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
          className="max-w-md"
          error={imageError}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-dark-600">
        <EnhancedButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <FiX className="w-4 h-4 mr-2" />
          {cancelText}
        </EnhancedButton>
        
        <EnhancedButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary-500 to-accent-purple hover:from-primary-600 hover:to-accent-purple/90"
        >
          <FiSave className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : submitText}
        </EnhancedButton>
      </div>
    </form>
  );
};
