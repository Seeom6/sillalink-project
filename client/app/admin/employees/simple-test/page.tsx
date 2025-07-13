"use client"

import React, { useState, useEffect } from 'react';
import { empApi } from '@/app/api/employee/employee.api';
import apiClient from '@/app/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export default function SimpleEmployeeTest() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const { user, isAuthenticated } = useAuth();

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Testing direct API call...');
      const response = await apiClient.get('/admin/employee');
      console.log('✅ Direct API Response:', response);
      setApiResponse(response);
      
      if (Array.isArray(response)) {
        setEmployees(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setEmployees([]);
      }
    } catch (err: any) {
      console.error('❌ Direct API Error:', err);
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const testEmpAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Testing empApi.getEmp()...');
      const response = await empApi.getEmp();
      console.log('✅ empApi Response:', response);
      setApiResponse(response);
      
      if (Array.isArray(response)) {
        setEmployees(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setEmployees([]);
      }
    } catch (err: any) {
      console.error('❌ empApi Error:', err);
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Component mounted, auth status:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Employee API Test</h1>
      
      {/* Auth Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Authentication Status:</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? `${user.firstName} ${user.lastName} (${user.role})` : 'None'}</p>
      </div>

      {/* Test Buttons */}
      <div className="mb-6 space-x-4">
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Direct API
        </button>
        <button 
          onClick={testEmpAPI}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test empApi
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 rounded">
          Loading employees...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <h3 className="font-semibold text-red-800">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* API Response Debug */}
      {apiResponse && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Raw API Response:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* Employees List */}
      <div>
        <h3 className="font-semibold mb-4">Employees ({employees.length}):</h3>
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees found</p>
        ) : (
          <div className="grid gap-4">
            {employees.map((employee, index) => (
              <div key={employee.id || employee._id || index} className="border p-4 rounded">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>ID:</strong> {employee.id || employee._id || 'N/A'}</div>
                  <div><strong>Name:</strong> {employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'N/A'}</div>
                  <div><strong>Email:</strong> {employee.email || 'N/A'}</div>
                  <div><strong>Role:</strong> {employee.role || 'N/A'}</div>
                  <div><strong>Position:</strong> {employee.position || employee.employee?.position || 'N/A'}</div>
                  <div><strong>Active:</strong> {employee.isActive !== undefined ? (employee.isActive ? 'Yes' : 'No') : 'N/A'}</div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                  <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(employee, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
