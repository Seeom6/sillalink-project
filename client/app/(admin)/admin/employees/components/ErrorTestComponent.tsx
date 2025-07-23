'use client';

import React from 'react';
import { toast } from 'react-hot-toast';
import { useCreateEmployee, useDeleteEmployee, useEmployees } from '@/lib/hooks/use-employees';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import { CreateEmployeeData, EmployeeDepartment, EmployeeStatus, EmploymentType, Gender, MaritalStatus } from '@/lib/types/employee';
import employeesApi from '@/lib/api/admin/employees';
import { extractErrorMessage, isDuplicateKeyError, extractDuplicateFieldInfo } from '@/lib/utils/error-handler';

export const ErrorTestComponent: React.FC = () => {
  const createEmployeeMutation = useCreateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const { data: employeesData } = useEmployees();

  const testDuplicateError = () => {
    // Create employee data that will trigger duplicate key error
    const duplicateEmployeeData: CreateEmployeeData = {
      firstName: 'Test',
      lastName: 'Duplicate',
      email: 'test.duplicate@example.com',
      nationalId: '12120003660', // This should trigger duplicate error
      phone: '1234567890',
      position: 'Test Position',
      department: EmployeeDepartment.ENGINEERING,
      status: EmployeeStatus.ACTIVE,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: new Date().toISOString().split('T')[0] as any,
      startDate: new Date().toISOString().split('T')[0] as any,
    };

    console.log('Testing duplicate error with data:', duplicateEmployeeData);
    createEmployeeMutation.mutate(duplicateEmployeeData);
  };

  const testValidationError = () => {
    // Create employee data that will trigger validation errors
    const invalidEmployeeData: CreateEmployeeData = {
      firstName: '', // Empty - should trigger validation error
      lastName: '', // Empty - should trigger validation error
      email: 'invalid-email', // Invalid email format
      nationalId: '',
      phone: '',
      position: 'Test Position', // Valid position to avoid backend validation error
      department: EmployeeDepartment.ENGINEERING,
      status: EmployeeStatus.ACTIVE,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: new Date().toISOString().split('T')[0] as any,
      startDate: new Date().toISOString().split('T')[0] as any,
      performanceRating: 10, // Invalid - should be max 5
      gender: 'invalid' as any, // Invalid gender
    };

    console.log('Testing validation error with data:', invalidEmployeeData);
    createEmployeeMutation.mutate(invalidEmployeeData);
  };

  const testDirectAPICall = async () => {
    try {
      console.log('Testing direct API call...');
      const duplicateEmployeeData: CreateEmployeeData = {
        firstName: 'Direct',
        lastName: 'API Test',
        email: 'direct.test@example.com',
        nationalId: '12120003660', // This should trigger duplicate error
        phone: '1234567890',
        position: 'Test Position',
        department: EmployeeDepartment.ENGINEERING,
        status: EmployeeStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        hireDate: new Date().toISOString().split('T')[0] as any,
        startDate: new Date().toISOString().split('T')[0] as any,
      };

      const result = await employeesApi.create(duplicateEmployeeData);
      console.log('Direct API call succeeded:', result);
      toast.success('Direct API call succeeded (unexpected!)');
    } catch (error) {
      console.group('🔍 Direct API Call Error Analysis');
      console.log('Raw Error:', error);
      console.log('Is Duplicate Key Error:', isDuplicateKeyError(error as any));

      const duplicateInfo = extractDuplicateFieldInfo(error as any);
      if (duplicateInfo) {
        console.log('Duplicate Field Info:', duplicateInfo);
      }

      const message = extractErrorMessage(error as any, 'Direct API call failed');
      console.log('Extracted Message:', message);
      console.groupEnd();

      toast.error(message);
    }
  };

  const testValidEmployeeCreation = () => {
    // Create valid employee data that should succeed
    const validEmployeeData: CreateEmployeeData = {
      firstName: 'Test',
      lastName: 'Employee',
      email: `test.employee.${Date.now()}@example.com`, // Unique email
      nationalId: `TEST${Date.now()}`, // Unique national ID
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`, // Random phone
      position: 'Software Engineer',
      department: EmployeeDepartment.ENGINEERING,
      status: EmployeeStatus.ACTIVE,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: new Date().toISOString().split('T')[0] as any, // Convert to date string
      startDate: new Date().toISOString().split('T')[0] as any, // Convert to date string
      performanceRating: 4,
      gender: Gender.PREFER_NOT_TO_SAY,
      maritalStatus: MaritalStatus.SINGLE
    };

    console.log('Testing valid employee creation with data:', validEmployeeData);
    createEmployeeMutation.mutate(validEmployeeData);
  };

  const testNestedErrorStructure = async () => {
    try {
      console.log('Testing nested error structure handling...');

      // Create a mock error that matches the structure you described
      const mockNestedError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              path: '/api/v1/admin/employees',
              time: '2025-07-22T11:35:07.305Z',
              message: 'Duplicate key error. A document with the same value already exists.',
              code: 11000,
              keyValue: { nationalId: '12120003660' }
            }
          }
        }
      };

      console.group('🧪 Testing Nested Error Structure');
      console.log('Mock Error:', mockNestedError);

      const isDuplicate = isDuplicateKeyError(mockNestedError as any);
      console.log('Is Duplicate Key Error:', isDuplicate);

      const duplicateInfo = extractDuplicateFieldInfo(mockNestedError as any);
      console.log('Duplicate Field Info:', duplicateInfo);

      const message = extractErrorMessage(mockNestedError as any, 'Test failed');
      console.log('Extracted Message:', message);
      console.groupEnd();

      toast.success(`Nested Error Test: ${message}`);

    } catch (error) {
      console.error('Nested error test failed:', error);
      toast.error('Nested error test failed');
    }
  };

  const testDeleteEmployee = async () => {
    try {
      console.log('🗑️ Testing delete functionality...');

      // Get the first employee from the list
      const employees = employeesData?.employees || [];
      if (employees.length === 0) {
        toast.error('No employees found to delete');
        return;
      }

      const employeeToDelete = employees[0];
      if (!employeeToDelete) {
        toast.error('No employee found to delete');
        return;
      }

      console.log('🗑️ Attempting to delete employee:', {
        id: employeeToDelete._id,
        name: `${employeeToDelete.firstName} ${employeeToDelete.lastName}`
      });

      // Test the delete mutation directly
      await deleteEmployeeMutation.mutateAsync(employeeToDelete._id);

      toast.success(`Successfully deleted ${employeeToDelete.firstName} ${employeeToDelete.lastName}`);

    } catch (error) {
      console.error('🗑️ Delete test failed:', error);
      toast.error('Delete test failed');
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Error Testing (Development Only)</h3>
      <p className="text-sm text-primary-300 mb-4">
        Use these buttons to test different error scenarios and verify toast notifications.
      </p>
      
      <div className="space-y-3">
        <EnhancedButton
          onClick={testDuplicateError}
          disabled={createEmployeeMutation.isPending}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          {createEmployeeMutation.isPending ? 'Testing...' : 'Test Duplicate Key Error (National ID)'}
        </EnhancedButton>

        <EnhancedButton
          onClick={testValidationError}
          disabled={createEmployeeMutation.isPending}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          {createEmployeeMutation.isPending ? 'Testing...' : 'Test Validation Errors'}
        </EnhancedButton>

        <EnhancedButton
          onClick={testDirectAPICall}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Test Direct API Call (Bypass Hook)
        </EnhancedButton>

        <EnhancedButton
          onClick={testValidEmployeeCreation}
          variant="primary"
          size="sm"
          className="w-full"
        >
          Test Valid Employee Creation
        </EnhancedButton>

        <EnhancedButton
          onClick={testNestedErrorStructure}
          variant="gradient"
          size="sm"
          className="w-full"
        >
          Test Nested Error Structure
        </EnhancedButton>

        <EnhancedButton
          onClick={testDeleteEmployee}
          variant="secondary"
          size="sm"
          className="w-full bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
          disabled={deleteEmployeeMutation.isPending}
        >
          {deleteEmployeeMutation.isPending ? 'Deleting...' : 'Test Delete Employee'}
        </EnhancedButton>

        <div className="text-xs text-primary-400 mt-4">
          <p><strong>Expected Results:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Duplicate Key: "An employee with National ID '12120003660' already exists"</li>
            <li>Validation: Multiple validation error messages</li>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
};
