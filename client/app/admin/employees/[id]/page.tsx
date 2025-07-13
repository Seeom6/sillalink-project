"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { empApi } from '@/app/api/employee/employee.api';
import Button from '@/app/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/ui/Card';
import { Badge } from '@/app/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  User,
  Shield,
  DollarSign,
  Users,
  Briefcase,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Employee } from '@/app/types/employeeTypes';

interface EmployeeProfilePageProps {}

export default function EmployeeProfilePage({}: EmployeeProfilePageProps) {
  console.log('🎯 EmployeeProfilePage component rendered');
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  console.log('📋 Employee ID:', employeeId);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  console.log('🔍 Component state before useEffect:', {
    employeeId,
    loading,
    error,
    hasEmployee: !!employee
  });

  // Fetch employee data using useEffect - Smart API call with fallback
  useEffect(() => {
    if (!employeeId) {
      console.log('❌ No employeeId provided');
      setLoading(false);
      return;
    }

    console.log('🚀 useEffect: Starting employee fetch for ID:', employeeId);

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);

        // Smart API call: Try employee endpoint first, fallback to user endpoint
        let response: any;
        let apiResponse: any;

        try {
          // First try the employee endpoint (for users with employee role)
          console.log('🔄 useEffect: Trying employee endpoint first... (refresh key:', refreshKey, ')');
          response = await empApi.getEmpById(employeeId);
          console.log('✅ useEffect: Employee endpoint success:', response);

          // Handle employee endpoint response
          if (response && response.data) {
            apiResponse = response.data;
          } else {
            apiResponse = response;
          }

          // Transform employee response
          const transformedEmployee: Employee = {
            id: apiResponse.id,
            _id: apiResponse.id,
            firstName: apiResponse.firstName || '',
            lastName: apiResponse.lastName || '',
            name: `${apiResponse.firstName || ''} ${apiResponse.lastName || ''}`.trim(),
            email: apiResponse.email || '',
            phone: apiResponse.phone,
            role: apiResponse.role || 'employee',
            isActive: apiResponse.isActive !== undefined ? apiResponse.isActive : true,
            position: apiResponse.position,
            image: apiResponse.image,
            avatar: apiResponse.image,
            startDate: apiResponse.startDate,
            employee: {
              position: apiResponse.position,
              department: apiResponse.department,
              employmentStatus: apiResponse.employmentStatus,
              image: apiResponse.image,
              startDate: apiResponse.startDate,
              endDate: apiResponse.endDate,
              managerId: apiResponse.managerId,
              projectIds: apiResponse.projectIds || []
            }
          };

          console.log('🔄 useEffect: Employee endpoint - Transformed:', transformedEmployee);
          setEmployee(transformedEmployee);

        } catch (employeeError: any) {
          console.log('⚠️ useEffect: Employee endpoint failed, trying user endpoint...');
          console.log('📋 useEffect: Employee error:', employeeError?.response?.status);

          // Fallback to user endpoint (for admin, operator, user roles)
          response = await empApi.getUserById(employeeId);
          console.log('✅ useEffect: User endpoint success:', response);

          // Handle user endpoint response
          if (response && response.data) {
            apiResponse = response.data;
          } else {
            apiResponse = response;
          }

          console.log('🔍 useEffect: User data structure:', {
            id: apiResponse._id || apiResponse.id,
            role: apiResponse.role,
            hasEmployee: !!apiResponse.employee,
            employeeData: apiResponse.employee
          });

          // Transform user response
          const transformedEmployee: Employee = {
            id: apiResponse._id || apiResponse.id,
            _id: apiResponse._id || apiResponse.id,
            firstName: apiResponse.firstName || '',
            lastName: apiResponse.lastName || '',
            name: `${apiResponse.firstName || ''} ${apiResponse.lastName || ''}`.trim(),
            email: apiResponse.email || '',
            phone: apiResponse.phone,
            role: apiResponse.role || 'user',
            isActive: apiResponse.isActive !== undefined ? apiResponse.isActive : true,
            // For users with employee data, use it; otherwise use defaults
            position: apiResponse.employee?.position || 'N/A',
            image: apiResponse.employee?.image || null,
            avatar: apiResponse.employee?.image || null,
            startDate: apiResponse.employee?.startDate || null,
            employee: apiResponse.employee || {
              position: 'N/A',
              department: 'N/A',
              employmentStatus: 'N/A',
              image: null,
              startDate: null,
              endDate: null,
              managerId: null,
              projectIds: []
            }
          };

          console.log('🔄 useEffect: User endpoint - Transformed:', transformedEmployee);
          setEmployee(transformedEmployee);
        }
      } catch (error: any) {
        console.error('❌ useEffect: API Error:', error);
        setError(error.message || 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId, refreshKey]); // Added refreshKey to force re-fetch

  // Add window focus listener to refresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focus detected, refreshing data');
      setRefreshKey(prev => prev + 1);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page visibility changed, refreshing data');
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);



  const handleEdit = () => {
    router.push(`/admin/employees/${employeeId}/edit`);
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        await empApi.deleteEmp(employeeId);
        router.push('/admin/employees');
      } catch (err: any) {
        alert('Failed to delete employee: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleBack = () => {
    router.push('/admin/employees');
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    try {
      return new Date(dateValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contractor': return 'bg-purple-100 text-purple-800';
      case 'intern': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  console.log('🎨 Rendering profile page with state:', {
    loading,
    error,
    employee: employee ? {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      position: employee.position,
      department: employee.employee?.department,
      employmentStatus: employee.employee?.employmentStatus
    } : null
  });

  if (loading) {
    console.log('🔄 Showing loading state');
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

  if (error) {
    console.log('❌ Showing error state:', error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Employee</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Employees
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    console.log('❌ Showing not found state');
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Not Found</h2>
            <p className="text-gray-600 mb-4">The employee you're looking for doesn't exist.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Employees
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Showing employee profile for:', employee.name);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
              <p className="text-gray-600">View and manage employee information</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={handleEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="secondary"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={employee.avatar || employee.image || employee.employee?.image} 
                alt={`${employee.firstName} ${employee.lastName}`} 
              />
              <AvatarFallback className="text-xl">
                {getInitials(employee.firstName, employee.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h2>
                <Badge
                  className={getStatusColor(employee.employee?.employmentStatus || (employee as any).employmentStatus)}
                >
                  {employee.employee?.employmentStatus || (employee as any).employmentStatus || 'N/A'}
                </Badge>
                {employee.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {employee.position || employee.employee?.position || 'No position specified'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{employee.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{employee.employee?.department || (employee as any).department || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Started: {formatDate(employee.employee?.startDate || employee.startDate || (employee as any).startDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Employment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                <p className="text-gray-900">{employee.id || employee._id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900 capitalize">{employee.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900">{employee.position || employee.employee?.position || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{employee.employee?.department || (employee as any).department || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <p className="text-gray-900 capitalize">{employee.employee?.employmentStatus || (employee as any).employmentStatus || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">{formatDate(employee.employee?.startDate || employee.startDate || (employee as any).startDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-gray-900">{employee.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900">{employee.phone || 'N/A'}</p>
            </div>
            {employee.employee?.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="text-gray-900">
                  <p>{employee.employee.address.street}</p>
                  <p>{employee.employee.address.city}, {employee.employee.address.state} {employee.employee.address.zipCode}</p>
                  <p>{employee.employee.address.country}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        {employee.employee?.emergencyContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{employee.employee.emergencyContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{employee.employee.emergencyContact.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Relationship</label>
                <p className="text-gray-900">{employee.employee.emergencyContact.relationship}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Information */}
        {employee.employee?.salary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Salary Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900">
                  {employee.employee.salary.currency} {employee.employee.salary.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Frequency</label>
                <p className="text-gray-900 capitalize">{employee.employee.salary.frequency}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Management Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Management & Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Manager ID</label>
              <p className="text-gray-900">{employee.employee?.managerId || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Assigned Projects</label>
              <p className="text-gray-900">
                {employee.employee?.projectIds?.length
                  ? `${employee.employee.projectIds.length} project(s)`
                  : 'No projects assigned'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Account Status</label>
              <div className="text-gray-900">
                {employee.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">User Role</label>
              <p className="text-gray-900 capitalize">{employee.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{formatDate(employee.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
