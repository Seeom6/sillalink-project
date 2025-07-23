'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiSave, 
  FiX, 
  FiImage,
  FiMail,
  FiPhone,
  FiCalendar,
  FiGlobe
} from 'react-icons/fi';
import {
  Employee,
  UpdateEmployeeData,
  EmployeeDepartment,
  EmployeeStatus,
  EmploymentType,
  ContractType,
  Gender,
  MaritalStatus,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CONTRACT_TYPE_OPTIONS
} from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useEmployees } from '@/lib/hooks/use-employees';

interface EmployeeEditFormProps {
  employee: Employee;
  onSubmit: (data: UpdateEmployeeData, imageFile?: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(employee?.profileImage || employee?.avatar || null);

  // Get employees list for manager selection
  const { data: employeesData } = useEmployees({
    page: 1,
    limit: 1000, // Get all employees for manager selection
    needPagination: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<UpdateEmployeeData>({
    defaultValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      gender: employee?.gender,
      birthDate: employee?.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : '',
      dateOfBirth: employee?.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
      nationalId: employee?.nationalId || '',
      passportNumber: employee?.passportNumber || '',
      maritalStatus: employee?.maritalStatus,
      position: employee?.position || '',
      jobTitle: employee?.jobTitle || '',
      department: employee?.department || EmployeeDepartment.OTHER,
      employmentType: employee?.employmentType || EmploymentType.FULL_TIME,
      status: employee?.status || EmployeeStatus.ACTIVE,
      hireDate: employee?.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      startDate: employee?.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '',
      endDate: employee?.endDate ? new Date(employee.endDate).toISOString().split('T')[0] : '',
      managerId: employee?.managerId || '',
      salary: employee?.salary,
      contractType: employee?.contractType,
      contractStartDate: employee?.contractStartDate ? new Date(employee.contractStartDate).toISOString().split('T')[0] : '',
      contractEndDate: employee?.contractEndDate ? new Date(employee.contractEndDate).toISOString().split('T')[0] : '',
      city: employee?.city || '',
      country: employee?.country || '',
      emergencyContact: employee?.emergencyContact || '',
      emergencyPhone: employee?.emergencyPhone || '',
      bio: employee?.bio || '',
      skills: Array.isArray(employee?.skills) ? employee.skills.join(', ') : (employee?.skills || ''),
      certifications: Array.isArray(employee?.certifications) ? employee.certifications.join(', ') : (employee?.certifications || ''),
      linkedinProfile: employee?.linkedinProfile || '',
      githubProfile: employee?.githubProfile || '',
      portfolioUrl: employee?.portfolioUrl || '',
      notes: employee?.notes || '',
      isFeatured: employee?.isFeatured || false,
      performanceRating: employee?.performanceRating
    }
  });

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const onFormSubmit = (data: UpdateEmployeeData) => {
    console.log('🔥 EmployeeEditForm: Form submitted');
    console.log('🔥 EmployeeEditForm: Original employee data:', employee);
    console.log('🔥 EmployeeEditForm: Form data:', data);
    console.log('🔥 EmployeeEditForm: Form data keys:', Object.keys(data));
    console.log('🔥 EmployeeEditForm: Image file:', imageFile);
    console.log('🔥 EmployeeEditForm: Image preview:', imagePreview);

    // Helper function to validate URLs
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Helper function to clean optional string fields
    const cleanOptionalString = (value: any): string | undefined => {
      if (!value || typeof value !== 'string') return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    // Process the data
    const processedData: UpdateEmployeeData = {
      ...data,
      // Convert skills and certifications from comma-separated strings to arrays
      skills: typeof data.skills === 'string'
        ? (data.skills as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : data.skills || [],
      certifications: typeof data.certifications === 'string'
        ? (data.certifications as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : data.certifications || [],
      // Convert numbers
      salary: data.salary ? Number(data.salary) : undefined,
      performanceRating: data.performanceRating ? Number(data.performanceRating) : undefined,
      // Convert dates to ISO format
      hireDate: data.hireDate ? new Date(data.hireDate).toISOString() : undefined,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      contractStartDate: data.contractStartDate ? new Date(data.contractStartDate).toISOString() : undefined,
      contractEndDate: data.contractEndDate ? new Date(data.contractEndDate).toISOString() : undefined,
      // Clean optional string fields
      managerId: cleanOptionalString(data.managerId),
      nationalId: cleanOptionalString(data.nationalId),
      passportNumber: cleanOptionalString(data.passportNumber),
      jobTitle: cleanOptionalString(data.jobTitle),
      city: cleanOptionalString(data.city),
      country: cleanOptionalString(data.country),
      emergencyContact: cleanOptionalString(data.emergencyContact),
      emergencyPhone: cleanOptionalString(data.emergencyPhone),
      bio: cleanOptionalString(data.bio),
      notes: cleanOptionalString(data.notes),
      // Validate and clean URLs
      linkedinProfile: data.linkedinProfile && cleanOptionalString(data.linkedinProfile) && isValidUrl(cleanOptionalString(data.linkedinProfile)!)
        ? cleanOptionalString(data.linkedinProfile)
        : undefined,
      githubProfile: data.githubProfile && cleanOptionalString(data.githubProfile) && isValidUrl(cleanOptionalString(data.githubProfile)!)
        ? cleanOptionalString(data.githubProfile)
        : undefined,
      portfolioUrl: data.portfolioUrl && cleanOptionalString(data.portfolioUrl) && isValidUrl(cleanOptionalString(data.portfolioUrl)!)
        ? cleanOptionalString(data.portfolioUrl)
        : undefined
    };

    console.log('🔥 EmployeeEditForm: Processed data:', processedData);
    onSubmit(processedData, imageFile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Employee</h1>
            <p className="text-primary-300 mt-2">Update {employee.firstName} {employee.lastName}'s information</p>
          </div>
          <div className="flex items-center space-x-4">
            <EnhancedButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </EnhancedButton>
            <EnhancedButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-violet"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Update Employee'}</span>
            </EnhancedButton>
          </div>
        </div>

        {/* Profile Image Section */}
        <GlassCard className="p-6">
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
          />
        </GlassCard>

        {/* Basic Information */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiUser className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-red-400">{errors.firstName.message}</p>
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
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-400">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Email *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Gender
              </label>
              <select
                {...register('gender')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Birth Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="date"
                  {...register('birthDate')}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* National ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                National ID
              </label>
              <input
                {...register('nationalId')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter national ID"
              />
            </div>

            {/* Passport Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Passport Number
              </label>
              <input
                {...register('passportNumber')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter passport number"
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Marital Status
              </label>
              <select
                {...register('maritalStatus')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select marital status</option>
                {MARITAL_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Professional Information */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiBriefcase className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Professional Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter position"
              />
              {errors.position && (
                <p className="text-sm text-red-400">{errors.position.message}</p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Job Title
              </label>
              <input
                {...register('jobTitle')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter job title"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Department *
              </label>
              <select
                {...register('department', { required: 'Department is required' })}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select department</option>
                {DEPARTMENT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-sm text-red-400">{errors.department.message}</p>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Employment Type
              </label>
              <select
                {...register('employmentType')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPE_OPTIONS.map(option => (
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
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hire Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Hire Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="date"
                  {...register('hireDate', { required: 'Hire date is required' })}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.hireDate && (
                <p className="text-sm text-red-400">{errors.hireDate.message}</p>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Contact & Location */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiMapPin className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Contact & Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                City
              </label>
              <input
                {...register('city')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter city"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Country
              </label>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  {...register('country')}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Emergency Contact
              </label>
              <input
                {...register('emergencyContact')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter emergency contact name"
              />
            </div>

            {/* Emergency Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Emergency Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="tel"
                  {...register('emergencyPhone')}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter emergency phone"
                />
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                LinkedIn Profile
              </label>
              <input
                type="url"
                {...register('linkedinProfile')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* GitHub Profile */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                GitHub Profile
              </label>
              <input
                type="url"
                {...register('githubProfile')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://github.com/username"
              />
            </div>

            {/* Portfolio URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Portfolio URL
              </label>
              <input
                type="url"
                {...register('portfolioUrl')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://portfolio.com"
              />
            </div>
          </div>
        </GlassCard>

        {/* Compensation & Contract */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiDollarSign className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Compensation & Contract</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Salary */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Annual Salary
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="number"
                  {...register('salary')}
                  className="w-full rounded-lg border border-dark-600 bg-dark-700/50 pl-10 pr-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter annual salary"
                />
              </div>
            </div>

            {/* Contract Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Contract Type
              </label>
              <select
                {...register('contractType')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select contract type</option>
                {CONTRACT_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Performance Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Performance Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                {...register('performanceRating')}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter rating (1-5)"
              />
            </div>
          </div>
        </GlassCard>

        {/* Skills & Additional Information */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiUser className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Skills & Additional Information</h2>
          </div>

          <div className="space-y-6">
            {/* Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Skills (comma-separated)
              </label>
              <textarea
                {...register('skills')}
                rows={3}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., JavaScript, React, Node.js, Python, Project Management"
              />
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Certifications (comma-separated)
              </label>
              <textarea
                {...register('certifications')}
                rows={3}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., AWS Certified Developer, PMP, Scrum Master, Google Analytics"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description about the employee..."
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-300">
                Internal Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Internal notes about the employee (not visible to employee)..."
              />
            </div>

            {/* Featured Employee */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-primary-300">
                Featured Employee
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Action Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 bg-dark-900/95 backdrop-blur-sm border-t border-dark-600 p-6 -mx-6 -mb-6">
          <div className="flex items-center justify-end space-x-4">
            <EnhancedButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </EnhancedButton>
            <EnhancedButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-violet"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Update Employee'}</span>
            </EnhancedButton>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
