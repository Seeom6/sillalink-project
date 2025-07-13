"use client"

import React, { useEffect, useState, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { useAddEmployee } from "@/app/hooks/employee/useEmployee"
import AddEmployeeForm from "./add-employee-form"
import type { EmployeeData } from "@/app/types/employeeTypes"
import { createEmpPayload } from "@/app/api/employee/emp-api-type"
import { useAuth } from "@/contexts/AuthContext"

// Standardized logging utility (consistent with edit page)
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CreateEmployee] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[CreateEmployee] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CreateEmployee] ${message}`, data);
    }
  }
};

// Enhanced error handling utility (consistent with edit page)
const handleApiError = (error: any): string => {
  logger.error('API Error occurred', error);

  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return error.response?.data?.message || 'Invalid data provided. Please check your input.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 409:
        return error.response?.data?.message || 'This email address is already in use.';
      case 422:
        return error.response?.data?.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        break;
    }
  }

  const message =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred. Please try again.';

  return message;
};

const AddEmployeePage = memo(() => {
  const router = useRouter()
  const { mutate, isPending } = useAddEmployee()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)

  // Enhanced form submission with consistent error handling (MOVED BEFORE EARLY RETURN)
  const handleSubmit = useCallback(async (data: EmployeeData) => {
    logger.info('Form submission started', { data });

    try {
      // Validate required fields
      if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim() || !data.password?.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Handle image upload with proper error handling
      let imageData: string | undefined = undefined;
      if (data.images && data.images.length > 0) {
        const file = data.images[0];

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image file size must be less than 5MB');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file');
        }

        try {
          // Convert image to base64 for now - in production, you'd upload to a file service
          imageData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
          });
          logger.info('Image processed successfully');
        } catch (imageError) {
          logger.error('Image processing failed', imageError);
          throw new Error('Failed to process image file');
        }
      }

      // Transform the form data to match the API payload (consistent with edit page)
      const payload: createEmpPayload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password, // Required for creation
        position: data.position,
        image: imageData,
        department: data.department,
        hireDate: data.hireDate,
        phone: data.phone?.trim() || undefined,
        employmentStatus: data.employmentStatus as 'full-time' | 'part-time' | 'contractor' | 'intern',
        role: data.role as 'user' | 'admin' | 'operator' | 'employee',
        managerId: data.managerId || undefined,
        projectIds: data.projectIds?.length ? data.projectIds : undefined,
        emergencyContact: data.emergencyContact?.name?.trim() ? {
          name: data.emergencyContact.name.trim(),
          phone: data.emergencyContact.phone?.trim() || '',
          relationship: data.emergencyContact.relationship?.trim() || ''
        } : undefined,
        address: data.address?.street?.trim() ? {
          street: data.address.street.trim(),
          city: data.address.city?.trim() || '',
          state: data.address.state?.trim() || '',
          zipCode: data.address.zipCode?.trim() || '',
          country: data.address.country?.trim() || ''
        } : undefined,
        salary: data.salary?.amount && data.salary.amount > 0 ? {
          amount: data.salary.amount,
          currency: data.salary.currency || 'USD',
          frequency: data.salary.frequency || 'yearly'
        } : undefined,
      }

      logger.info('Payload prepared for API call', { payload });

      mutate(payload, {
        onSuccess: (response: any) => {
          logger.info('Employee creation successful', response);
          router.push("/admin/employees")
        },
        onError: (error: any) => {
          const errorMessage = handleApiError(error);
          logger.error('Employee creation failed', error);
          // Error will be handled by the useAddEmployee hook with proper user feedback
        }
      })
    } catch (error) {
      const errorMessage = handleApiError(error);
      logger.error('Error processing employee data', error);
      // Show user-friendly error message instead of alert
      throw error; // Let the form component handle the error display
    }
  }, [mutate, router])

  // Optimized navigation handler (consistent with edit page)
  const handleCancel = useCallback(() => {
    router.back()
  }, [router])

  // Permission check with useEffect (AFTER all hooks are defined)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        logger.warn('User not authenticated, redirecting to login');
        router.push('/login')
        return
      }

      if (!user || !['admin', 'operator'].includes(user.role)) {
        logger.warn('User lacks permission to create employees', { userRole: user?.role });
        router.push('/admin/dashboard')
        return
      }

      logger.info('User has access to create employees', { userRole: user.role });
      setHasAccess(true)
    }
  }, [isAuthenticated, user, isLoading, router])

  // Show loading while checking permissions (AFTER all hooks)
  if (isLoading || !hasAccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AddEmployeeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isPending}
      />
    </main>
  )
});

// Set display name for debugging
AddEmployeePage.displayName = 'AddEmployeePage';

export default AddEmployeePage;
