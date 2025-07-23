'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiArrowLeft,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import {
  CreateEmployeeData,
  EmployeeDepartment,
  EmployeeStatus,
  EmploymentType,
  ContractType,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CONTRACT_TYPE_OPTIONS
} from '@/lib/types/employee';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useEmployees } from '@/lib/hooks/use-employees';

interface MultiStepEmployeeFormProps {
  initialData?: Partial<CreateEmployeeData & { _id?: string }>;
  onSubmit: (data: CreateEmployeeData, image?: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'update';
  submitButtonText?: string;
}

type FormStep = 'basic' | 'professional' | 'contact' | 'compensation' | 'review';

interface Step {
  key: FormStep;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const MultiStepEmployeeForm: React.FC<MultiStepEmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = 'create',
  submitButtonText
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(new Set());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get existing employees for validation
  const { data: employeesData } = useEmployees();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<CreateEmployeeData>({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      gender: initialData?.gender,
      maritalStatus: initialData?.maritalStatus,
      position: initialData?.position || '',
      department: initialData?.department || EmployeeDepartment.OTHER,
      employmentType: initialData?.employmentType || EmploymentType.FULL_TIME,
      status: initialData?.status || EmployeeStatus.ACTIVE,
      contractType: initialData?.contractType || ContractType.PERMANENT,
      salary: initialData?.salary,
      hireDate: initialData?.hireDate || new Date().toISOString().split('T')[0],
      isFeatured: initialData?.isFeatured || false,
      ...initialData
    } as CreateEmployeeData
  });

  const steps: Step[] = [
    {
      key: 'basic',
      title: 'Basic Information',
      description: 'Personal details and contact information',
      icon: FiUser
    },
    {
      key: 'professional',
      title: 'Professional Details',
      description: 'Job title, department, and employment information',
      icon: FiBriefcase
    },
    {
      key: 'contact',
      title: 'Contact & Location',
      description: 'Address and emergency contact details',
      icon: FiMapPin
    },
    {
      key: 'compensation',
      title: 'Compensation',
      description: 'Salary and contract information',
      icon: FiDollarSign
    },
    {
      key: 'review',
      title: 'Review & Submit',
      description: `Review all information before ${mode === 'create' ? 'creating' : 'updating'}`,
      icon: FiCheck
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Validation functions
  const validateUniqueFields = (data: CreateEmployeeData): string[] => {
    const errors: string[] = [];
    const employees = employeesData?.employees || [];

    // Check for duplicate National ID
    if (data.nationalId && data.nationalId.trim()) {
      const nationalId = data.nationalId.trim();
      const existingEmployee = employees.find(emp =>
        emp.nationalId === nationalId &&
        emp._id !== initialData?._id // Exclude current employee when editing
      );
      if (existingEmployee) {
        errors.push(`An employee with National ID "${nationalId}" already exists (${existingEmployee.firstName} ${existingEmployee.lastName})`);
      }
    }

    // Check for duplicate Email
    if (data.email && data.email.trim()) {
      const email = data.email.trim().toLowerCase();
      const existingEmployee = employees.find(emp =>
        emp.email.toLowerCase() === email &&
        emp._id !== initialData?._id
      );
      if (existingEmployee) {
        errors.push(`An employee with email "${data.email}" already exists (${existingEmployee.firstName} ${existingEmployee.lastName})`);
      }
    }

    // Check for duplicate Phone (if provided)
    if (data.phone && data.phone.trim()) {
      const phone = data.phone.trim();
      const existingEmployee = employees.find(emp =>
        emp.phone === phone &&
        emp._id !== initialData?._id
      );
      if (existingEmployee) {
        errors.push(`An employee with phone number "${phone}" already exists (${existingEmployee.firstName} ${existingEmployee.lastName})`);
      }
    }

    return errors;
  };

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    // Additional validation for required fields
    if (currentStep === 'professional') {
      const formData = watch();
      if (!formData.position || formData.position.trim().length < 2) {
        toast.error('Position is required and must be at least 2 characters');
        return false;
      }
    }

    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }

    return isValid;
  };

  const getFieldsForStep = (step: FormStep): (keyof CreateEmployeeData)[] => {
    switch (step) {
      case 'basic':
        return ['firstName', 'lastName', 'email', 'phone'];
      case 'professional':
        return ['position', 'department', 'employmentType', 'status'];
      case 'contact':
        return []; // Optional fields
      case 'compensation':
        return ['hireDate'];
      case 'review':
        return [];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && !isLastStep) {
      const nextIndex = currentStepIndex + 1;
      if (steps[nextIndex]) {
        setCurrentStep(steps[nextIndex].key);
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      if (steps[prevIndex]) {
        setCurrentStep(steps[prevIndex].key);
      }
    }
  };

  const handleStepClick = async (stepKey: FormStep) => {
    const stepIndex = steps.findIndex(step => step.key === stepKey);
    
    // Allow going to previous steps or completed steps
    if (stepIndex <= currentStepIndex || completedSteps.has(stepKey)) {
      setCurrentStep(stepKey);
    } else {
      // Validate current step before allowing forward navigation
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(stepKey);
      }
    }
  };

  const onFormSubmit = async (data: any) => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      // Validate unique fields before submission (only on review step)
      if (currentStep === 'review') {
        const validationErrors = validateUniqueFields(data);
        if (validationErrors.length > 0) {
          // Show validation errors
          validationErrors.forEach(error => toast.error(error));
          return;
        }
      }

      // Transform data to match backend expectations
      const transformedData: CreateEmployeeData = {
        ...data,
        // Convert salary to number (keep for backward compatibility)
        salary: data.salary ? Number(data.salary) : undefined,
        // Create salary details object if salary is provided
        salaryDetails: data.salary ? {
          amount: Number(data.salary),
          currency: 'USD' // Default currency
        } : undefined,
        // Convert performance rating to number (max 5)
        performanceRating: data.performanceRating ? Math.min(Number(data.performanceRating), 5) : undefined,
        // Convert date strings to Date objects
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        hireDate: data.hireDate ? new Date(data.hireDate) : new Date(), // Default to current date if not provided
        startDate: data.startDate ? new Date(data.startDate) : new Date(), // Default to current date if not provided
        contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : undefined,
        contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : undefined,
        // Convert skills string to array
        skills: data.skills ?
          (typeof data.skills === 'string' ?
            data.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) :
            data.skills
          ) : [],
        // Convert certifications string to array
        certifications: data.certifications ?
          (typeof data.certifications === 'string' ?
            data.certifications.split(',').map((s: string) => s.trim()).filter((s: string) => s) :
            data.certifications
          ) : [],
        // Ensure URLs are properly formatted or undefined
        linkedinProfile: data.linkedinProfile && data.linkedinProfile.trim() && isValidUrl(data.linkedinProfile.trim()) ? data.linkedinProfile.trim() : undefined,
        githubProfile: data.githubProfile && data.githubProfile.trim() && isValidUrl(data.githubProfile.trim()) ? data.githubProfile.trim() : undefined,
        portfolioUrl: data.portfolioUrl && data.portfolioUrl.trim() && isValidUrl(data.portfolioUrl.trim()) ? data.portfolioUrl.trim() : undefined,
        // Ensure jobTitle is properly formatted or undefined
        jobTitle: data.jobTitle && data.jobTitle.trim().length >= 2 ? data.jobTitle.trim() : undefined,
        // Handle address - create proper address object only if we have required fields
        address: (data.address && data.city && data.country) ? {
          street: data.address,
          city: data.city,
          country: data.country,
          postalCode: ''
        } : undefined
      };

      console.log('Transformed employee data:', transformedData);
      console.log('Selected image:', selectedImage);

      // Pass both the employee data and the selected image to the parent
      onSubmit(transformedData, selectedImage);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return <BasicInformationStep
          register={register}
          errors={errors}
          imagePreview={imagePreview}
          handleImageSelect={handleImageSelect}
          handleImageRemove={handleImageRemove}
          fileInputRef={fileInputRef}
        />;
      case 'professional':
        return <ProfessionalDetailsStep register={register} errors={errors} />;
      case 'contact':
        return <ContactLocationStep register={register} />;
      case 'compensation':
        return <CompensationStep register={register} errors={errors} />;
      case 'review':
        return <ReviewStep watch={watch} imagePreview={imagePreview} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.key;
            const isCompleted = completedSteps.has(step.key);
            const isAccessible = index <= currentStepIndex || completedSteps.has(step.key);

            return (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => handleStepClick(step.key)}
                  disabled={!isAccessible}
                  className={`
                    flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-accent-violet text-white' 
                      : isCompleted
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : isAccessible
                          ? 'text-primary-300 hover:bg-dark-700/50 hover:text-white'
                          : 'text-primary-600 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${isActive 
                      ? 'border-white bg-white/20' 
                      : isCompleted
                        ? 'border-green-400 bg-green-500/20'
                        : 'border-current'
                    }
                  `}>
                    {isCompleted ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs opacity-75 hidden sm:block">{step.description}</div>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${completedSteps.has(step.key) 
                      ? 'bg-green-400' 
                      : 'bg-dark-600'
                    }
                  `} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </GlassCard>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onFormSubmit as any)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <div>
            {!isFirstStep && (
              <EnhancedButton
                type="button"
                variant="secondary"
                onClick={handlePrevious}
                className="flex items-center space-x-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </EnhancedButton>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <EnhancedButton
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </EnhancedButton>

            {isLastStep ? (
              <EnhancedButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-violet"
              >
                <FiCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (mode === 'create' ? 'Creating...' : 'Updating...')
                    : (submitButtonText || (mode === 'create' ? 'Create Employee' : 'Update Employee'))
                  }
                </span>
              </EnhancedButton>
            ) : (
              <EnhancedButton
                type="button"
                variant="primary"
                onClick={handleNext}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-violet"
              >
                <span>Next</span>
                <FiArrowRight className="w-4 h-4" />
              </EnhancedButton>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// Step Components
const BasicInformationStep: React.FC<any> = ({
  register,
  errors,
  imagePreview,
  handleImageSelect,
  handleImageRemove,
  fileInputRef
}) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>

    {/* Profile Image Upload */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-primary-300 mb-3">
        Profile Image
      </label>
      <div className="flex items-center space-x-4">
        {/* Image Preview */}
        <div className="relative">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
              />
              <button
                type="button"
                onClick={handleImageRemove}
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
          >
            {imagePreview ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="text-xs text-primary-400 mt-1">
            JPG, PNG or GIF (max 5MB)
          </p>
        </div>
      </div>
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
          <p className="text-sm text-red-400">{(errors.firstName as any)?.message}</p>
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
          <p className="text-sm text-red-400">{(errors.lastName as any)?.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Email Address *
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
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{(errors.email as any)?.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Phone Number
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter phone number"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Gender
        </label>
        <select
          {...register('gender')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select gender</option>
          {GENDER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Marital Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Marital Status
        </label>
        <select
          {...register('maritalStatus')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select marital status</option>
          {MARITAL_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Birth Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Date of Birth
        </label>
        <input
          type="date"
          {...register('birthDate')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* National ID */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          National ID / Passport Number
        </label>
        <input
          {...register('nationalId')}
          className={`w-full rounded-lg border px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 ${
            errors.nationalId
              ? 'border-red-500 bg-red-500/10 focus:ring-red-500'
              : 'border-dark-600 bg-dark-700/50 focus:ring-primary-500'
          }`}
          placeholder="Enter national ID or passport number"
        />
        {errors.nationalId && (
          <p className="text-sm text-red-400">{errors.nationalId.message}</p>
        )}
      </div>
    </div>
  </GlassCard>
);

const ProfessionalDetailsStep: React.FC<any> = ({ register, errors }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Professional Details</h3>

    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
          placeholder="Enter job position"
        />
        {errors.position && (
          <p className="text-sm text-red-400">{(errors.position as any)?.message}</p>
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
          placeholder="Enter job title (if different from position)"
        />
      </div>

      {/* Department */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Department *
        </label>
        <select
          {...register('department', { required: 'Department is required' })}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select department</option>
          {DEPARTMENT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="text-sm text-red-400">{(errors.department as any)?.message}</p>
        )}
      </div>

      {/* Employment Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Employment Type
        </label>
        <select
          {...register('employmentType')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
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
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contract Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Contract Type
        </label>
        <select
          {...register('contractType')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {CONTRACT_TYPE_OPTIONS.map(option => (
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
        <input
          type="date"
          {...register('hireDate', { required: 'Hire date is required' })}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.hireDate && (
          <p className="text-sm text-red-400">{(errors.hireDate as any)?.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Start Date
        </label>
        <input
          type="date"
          {...register('startDate')}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>

    {/* Skills Section */}
    <div className="mt-6 space-y-4">
      <h4 className="text-lg font-medium text-white">Skills & Expertise</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Skills */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Skills (comma-separated)
          </label>
          <textarea
            {...register('skills')}
            rows={3}
            className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., JavaScript, React, Node.js, Python"
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
            placeholder="e.g., AWS Certified Developer, PMP, Scrum Master"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary-300">
          Bio / Description
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Brief description about the employee..."
        />
      </div>
    </div>
  </GlassCard>
);

const ContactLocationStep: React.FC<any> = ({ register }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Contact & Location</h3>

    <div className="space-y-6">
      {/* Address Section */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Address Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Street Address
            </label>
            <input
              {...register('address')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter street address"
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Country
            </label>
            <input
              {...register('country')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Emergency Contact Name
            </label>
            <input
              {...register('emergencyContact')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter emergency contact name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              {...register('emergencyPhone')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter emergency contact phone"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Professional Profiles</h4>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  </GlassCard>
);

const CompensationStep: React.FC<any> = ({ register, errors }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Compensation & Contract</h3>

    <div className="space-y-6">
      {/* Salary Information */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Salary Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Annual Salary
            </label>
            <input
              type="number"
              {...register('salary', { min: 0 })}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter annual salary"
            />
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Contract Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Contract Start Date
            </label>
            <input
              type="date"
              {...register('contractStartDate')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Contract End Date
            </label>
            <input
              type="date"
              {...register('contractEndDate')}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Additional Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('isFeatured')}
              className="size-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500"
            />
            <label className="text-sm text-primary-300">
              Feature this employee (will be highlighted in listings)
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Performance Rating (0-5)
            </label>
            <input
              type="number"
              {...register('performanceRating', {
                min: { value: 0, message: 'Performance rating must be at least 0' },
                max: { value: 5, message: 'Performance rating must not exceed 5' },
                valueAsNumber: true
              })}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter initial performance rating (0-5)"
              step="0.1"
              min="0"
              max="5"
            />
            {errors.performanceRating && (
              <p className="text-sm text-red-400">{(errors.performanceRating as any)?.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-300">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full rounded-lg border border-dark-600 bg-dark-700/50 px-4 py-3 text-white placeholder-primary-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any additional notes about the employee..."
            />
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

const ReviewStep: React.FC<any> = ({ watch, imagePreview }) => {
  const formData = watch();

  // Helper function to safely render values
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return 'Not provided';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      // Handle address object specifically
      if (value.street || value.city || value.country || value.postalCode) {
        return `${value.street || ''}, ${value.city || ''}, ${value.country || ''}${value.postalCode ? ` ${value.postalCode}` : ''}`.replace(/^,\s*|,\s*$/, '').replace(/,\s*,/g, ',');
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Review & Submit</h3>
      <p className="text-primary-300 mb-6">Please review all information before creating the employee record.</p>

      <div className="space-y-6">
        {/* Profile Image Preview */}
        {imagePreview && (
          <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
            <h4 className="text-lg font-medium text-white mb-3">Profile Image</h4>
            <div className="flex items-center space-x-4">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
              />
              <p className="text-sm text-primary-300">Profile image selected</p>
            </div>
          </div>
        )}
        {/* Basic Information */}
        <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
          <h4 className="text-lg font-medium text-white mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <span className="text-sm text-primary-400">Name:</span>
              <p className="text-white">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Email:</span>
              <p className="text-white">{formData.email}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Phone:</span>
              <p className="text-white">{formData.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Gender:</span>
              <p className="text-white">{formData.gender ? GENDER_OPTIONS.find(g => g.value === formData.gender)?.label : 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
          <h4 className="text-lg font-medium text-white mb-3">Professional Information</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <span className="text-sm text-primary-400">Position:</span>
              <p className="text-white">{formData.position}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Department:</span>
              <p className="text-white">{DEPARTMENT_OPTIONS.find(d => d.value === formData.department)?.label}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Employment Type:</span>
              <p className="text-white">{EMPLOYMENT_TYPE_OPTIONS.find(e => e.value === formData.employmentType)?.label}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Status:</span>
              <p className="text-white">{STATUS_OPTIONS.find(s => s.value === formData.status)?.label}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Hire Date:</span>
              <p className="text-white">{formData.hireDate ? new Date(formData.hireDate).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm text-primary-400">Contract Type:</span>
              <p className="text-white">{CONTRACT_TYPE_OPTIONS.find(c => c.value === formData.contractType)?.label}</p>
            </div>
          </div>
        </div>

        {/* Compensation */}
        {formData.salary && (
          <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
            <h4 className="text-lg font-medium text-white mb-3">Compensation</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <span className="text-sm text-primary-400">Annual Salary:</span>
                <p className="text-white">${formData.salary?.toLocaleString()}</p>
              </div>
              {formData.performanceRating && (
                <div>
                  <span className="text-sm text-primary-400">Performance Rating:</span>
                  <p className="text-white">{formData.performanceRating}/5</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills & Bio */}
        {(formData.skills || formData.certifications || formData.bio) && (
          <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
            <h4 className="text-lg font-medium text-white mb-3">Skills & Information</h4>
            {formData.skills && (
              <div className="mb-3">
                <span className="text-sm text-primary-400">Skills:</span>
                <p className="text-white">{renderValue(formData.skills)}</p>
              </div>
            )}
            {formData.certifications && (
              <div className="mb-3">
                <span className="text-sm text-primary-400">Certifications:</span>
                <p className="text-white">{renderValue(formData.certifications)}</p>
              </div>
            )}
            {formData.bio && (
              <div>
                <span className="text-sm text-primary-400">Bio:</span>
                <p className="text-white">{renderValue(formData.bio)}</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        {(formData.address || formData.emergencyContact) && (
          <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
            <h4 className="text-lg font-medium text-white mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {formData.address && (
                <div>
                  <span className="text-sm text-primary-400">Address:</span>
                  <p className="text-white">{renderValue(formData.address)}</p>
                </div>
              )}
              {formData.emergencyContact && (
                <div>
                  <span className="text-sm text-primary-400">Emergency Contact:</span>
                  <p className="text-white">{formData.emergencyContact}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Settings */}
        <div className="rounded-lg border border-dark-600 bg-dark-800/30 p-4">
          <h4 className="text-lg font-medium text-white mb-3">Additional Settings</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${formData.isFeatured ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span className="text-sm text-primary-300">
                {formData.isFeatured ? 'Featured Employee' : 'Regular Employee'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
