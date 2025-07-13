"use client"

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { empApi } from '@/app/api/employee/employee.api';
import Button from '@/app/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/ui/Card';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/shared/ui/select';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { updateEmpPayload } from '@/app/api/employee/emp-api-type';

// Standardized Employee interface for edit operations
interface StandardizedEmployee {
  _id: string; // Use _id as the primary identifier to match backend
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  employee?: {
    position?: string;
    startDate?: string;
    endDate?: string;
    image?: string;
    department?: string;
    employmentStatus?: string;
    managerId?: string;
    projectIds?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    salary?: {
      amount: number;
      currency: string;
      frequency: 'hourly' | 'monthly' | 'yearly';
    };
  };
}

// Enhanced error handling types
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Logging utility to replace console.log statements
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EditEmployee] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[EditEmployee] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[EditEmployee] ${message}`, data);
    }
  }
};

// Enhanced validation schema that matches backend expectations
const editEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  department: z.string().optional(),
  employmentStatus: z.enum(['full-time', 'part-time', 'contractor', 'intern']).optional(),
  role: z.enum(['user', 'admin', 'operator', 'employee']).optional(),
  hireDate: z.string().optional(),
  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  // Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  // Salary
  salaryAmount: z.number().optional(),
  salaryCurrency: z.string().optional(),
  salaryFrequency: z.enum(['hourly', 'monthly', 'yearly']).optional(),
});

type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;

// Enhanced error handling utility
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

const EditEmployeePage = memo(() => {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<StandardizedEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    mode: 'onChange' // Enable real-time validation
  });

  // Memoized form values to prevent unnecessary re-renders
  const formValues = watch();

  // Development-only debug logging
  if (process.env.NODE_ENV === 'development') {
    logger.info('Form state', { formValues, errors, isValid, isDirty });
  }

  // Optimized mock data function for testing (development only)
  const addMockData = useCallback(() => {
    if (process.env.NODE_ENV !== 'development') return;

    logger.info('Adding mock test data');
    setValue('firstName', 'John');
    setValue('lastName', 'Doe');
    setValue('email', 'john.doe@example.com');
    setValue('position', 'Software Engineer');
    setValue('phone', '+1234567890');
    setValue('department', 'Engineering');
    setValue('employmentStatus', 'full-time');
    setValue('role', 'employee');
  }, [setValue]);

  // Optimized data fetching with proper error handling and type safety
  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Starting smart API call with fallback', { employeeId });

      // Smart API call: Try employee endpoint first, fallback to user endpoint
      let apiResponse: any;

      try {
        // First try the employee endpoint (for users with employee role)
        logger.info('Attempting employee endpoint');
        const response = await empApi.getEmpById(employeeId);
        apiResponse = response?.data || response;
        logger.info('Employee endpoint successful');
      } catch (employeeError: any) {
        logger.warn('Employee endpoint failed, trying user endpoint', {
          status: employeeError?.response?.status
        });

        try {
          // Fallback to user endpoint (for admin, operator, user roles)
          const response = await empApi.getUserById(employeeId);
          apiResponse = response?.data || response;
          logger.info('User endpoint successful');
        } catch (userError: any) {
          logger.error('Both endpoints failed', { employeeError, userError });
          throw userError;
        }
      }

      logger.info('API response received', { apiResponse });

      // Transform the response to standardized format with consistent ID handling
      const transformedEmployee: StandardizedEmployee = {
        _id: apiResponse._id || apiResponse.id, // Standardize on _id
        firstName: apiResponse.firstName || '',
        lastName: apiResponse.lastName || '',
        email: apiResponse.email || '',
        phone: apiResponse.phone,
        role: apiResponse.role || 'user',
        isActive: apiResponse.isActive !== undefined ? apiResponse.isActive : true,
        employee: apiResponse.employee || {
          position: '',
          department: '',
          employmentStatus: 'full-time',
          image: null,
          startDate: null,
          endDate: null,
          managerId: null,
          projectIds: []
        }
      };

      logger.info('Employee data transformed', { transformedEmployee });
      setEmployee(transformedEmployee);

      // Populate form with existing data using optimized setValue calls
      logger.info('Populating form fields');

      // Basic information
      setValue('firstName', transformedEmployee.firstName || '');
      setValue('lastName', transformedEmployee.lastName || '');
      setValue('email', transformedEmployee.email || '');
      setValue('phone', transformedEmployee.phone || '');
      setValue('position', transformedEmployee.employee?.position || '');
      setValue('department', transformedEmployee.employee?.department || '');
      setValue('employmentStatus', (transformedEmployee.employee?.employmentStatus as any) || 'full-time');
      setValue('role', (transformedEmployee.role as any) || 'user');

      // Format date for input
      if (transformedEmployee.employee?.startDate) {
        try {
          const date = new Date(transformedEmployee.employee.startDate);
          setValue('hireDate', date.toISOString().split('T')[0]);
        } catch (dateError) {
          logger.warn('Invalid date format for startDate', { startDate: transformedEmployee.employee.startDate });
        }
      }

      // Emergency contact
      const emergencyContact = transformedEmployee.employee?.emergencyContact;
      if (emergencyContact) {
        setValue('emergencyContactName', emergencyContact.name || '');
        setValue('emergencyContactPhone', emergencyContact.phone || '');
        setValue('emergencyContactRelationship', emergencyContact.relationship || '');
      }

      // Address
      const address = transformedEmployee.employee?.address;
      if (address) {
        setValue('street', address.street || '');
        setValue('city', address.city || '');
        setValue('state', address.state || '');
        setValue('zipCode', address.zipCode || '');
        setValue('country', address.country || '');
      }

      // Salary
      const salary = transformedEmployee.employee?.salary;
      if (salary) {
        setValue('salaryAmount', salary.amount || 0);
        setValue('salaryCurrency', salary.currency || 'USD');
        setValue('salaryFrequency', salary.frequency as any || 'yearly');
      }

      logger.info('Form populated successfully');

    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Failed to fetch employee data', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId, setValue]);

  // Optimized useEffect with proper dependency array
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId, fetchEmployeeData]);

  // Enhanced form submission with proper error handling and password validation fix
  const onSubmit = useCallback(async (data: EditEmployeeFormData) => {
    logger.info('Form submission started', { data });

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Prepare the payload with required fields
      const payload: updateEmpPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        position: data.position,
      };

      // Add optional fields only if they have values
      if (data.phone) payload.phone = data.phone;
      if (data.department) payload.department = data.department;
      if (data.employmentStatus) payload.employmentStatus = data.employmentStatus;
      if (data.role) payload.role = data.role;
      if (data.hireDate) payload.hireDate = data.hireDate;

      // Note: Password is intentionally omitted to fix the validation inconsistency
      // between employee and user endpoints identified in the analysis

      // Add emergency contact if provided
      if (data.emergencyContactName || data.emergencyContactPhone || data.emergencyContactRelationship) {
        payload.emergencyContact = {
          name: data.emergencyContactName || '',
          phone: data.emergencyContactPhone || '',
          relationship: data.emergencyContactRelationship || ''
        };
      }

      // Add address if provided
      if (data.street || data.city || data.state || data.zipCode || data.country) {
        payload.address = {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: data.country || ''
        };
      }

      // Add salary if provided
      if (data.salaryAmount && data.salaryCurrency && data.salaryFrequency) {
        payload.salary = {
          amount: data.salaryAmount,
          currency: data.salaryCurrency,
          frequency: data.salaryFrequency
        };
      }

      logger.info('Payload prepared for API call', { payload });

      // Use smart update API that handles both employee and user endpoints
      await empApi.smartUpdateUser(employeeId, payload);
      logger.info('Update successful');

      // Force a fresh fetch of employee data to bypass any caching
      // Add a small delay to ensure the database update is committed
      setTimeout(async () => {
        await fetchEmployeeData();
      }, 100);

      // Show success message
      setSuccessMessage('Employee information updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  }, [employeeId, fetchEmployeeData]);

  // Optimized navigation handler
  const handleBack = useCallback(() => {
    router.push(`/admin/employees/${employeeId}`);
  }, [router, employeeId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Employee</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
              <p className="text-gray-600">Update employee information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Display */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 text-green-500">✓</div>
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={`${errors.firstName ? 'border-red-500' : ''} bg-white` }
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={`${errors.lastName ? 'border-red-500' : ''} bg-white` }
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  
                  {...register('email')}
                  className={`${errors.email ? 'border-red-500' : ''} bg-white` }
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                                  className='bg-white'

                  id="phone"
                  {...register('phone')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  {...register('position')}
                  className={`${errors.position ? 'border-red-500' : ''} bg-white` }
                />
                {errors.position && (
                  <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                                    className='bg-white'

                  {...register('department')}
                />
              </div>
              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={watch('employmentStatus') || ''}
                  onValueChange={(value) => setValue('employmentStatus', value as any)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={watch('role') || ''}
                  onValueChange={(value) => setValue('role', value as any)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                                    className='bg-white'

                  type="date"
                  {...register('hireDate')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input
                  id="emergencyContactName"
                                    className='bg-white'

                  {...register('emergencyContactName')}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Phone</Label>
                <Input
                  id="emergencyContactPhone"
                                    className='bg-white'

                  {...register('emergencyContactPhone')}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                                  className='bg-white'
                  id="emergencyContactRelationship"
                  {...register('emergencyContactRelationship')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                                className='bg-white'

                id="street"
                {...register('street')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                                  className='bg-white'

                  id="city"
                  {...register('city')}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  className='bg-white'
                  {...register('state')}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                                  className='bg-white'

                  id="zipCode"
                  {...register('zipCode')}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                                  className='bg-white'

                  id="country"
                  {...register('country')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryAmount">Amount</Label>
                <Input
                                  className='bg-white'

                  id="salaryAmount"
                  type="number"
                  step="0.01"
                  {...register('salaryAmount', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="salaryCurrency">Currency</Label>
                <Select
                  value={watch('salaryCurrency') || ''}
                  onValueChange={(value) => setValue('salaryCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salaryFrequency">Frequency</Label>
                <Select
                  value={watch('salaryFrequency') || ''}
                  onValueChange={(value) => setValue('salaryFrequency', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !isValid}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <p><strong>Form Valid:</strong> {isValid ? 'Yes' : 'No'}</p>
            <p><strong>Form Dirty:</strong> {isDirty ? 'Yes' : 'No'}</p>
            <p><strong>Errors:</strong> {Object.keys(errors).length > 0 ? Object.keys(errors).join(', ') : 'None'}</p>
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <div className="mt-2">
              <Button type="button" onClick={addMockData} variant="outline" size="sm">
                🧪 Add Test Data
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

// Set display name for debugging
EditEmployeePage.displayName = 'EditEmployeePage';

export default EditEmployeePage;
