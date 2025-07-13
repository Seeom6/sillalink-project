"use client"

import React, { useState } from 'react';
import { empApi } from '@/app/api/employee/employee.api';
import Button from '@/app/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/ui/Card';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/shared/ui/select';

/**
 * Test component to verify smart update functionality works for all user types
 * This component should only be used in development for testing purposes
 */
export default function TestSmartUpdate() {
  const [userId, setUserId] = useState('');
  const [testData, setTestData] = useState({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    position: 'Test Position',
    department: 'Test Department',
    role: 'employee' as 'user' | 'admin' | 'operator' | 'employee'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      success,
      data
    }]);
  };

  const testSmartUpdate = async () => {
    if (!userId.trim()) {
      alert('Please enter a user ID to test');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      // Test 1: Basic update with smart fallback
      console.log('🧪 Testing smart update with basic data...');
      const basicPayload = {
        firstName: testData.firstName,
        lastName: testData.lastName,
        email: testData.email,
        position: testData.position
      };

      try {
        const response = await empApi.smartUpdateUser(userId, basicPayload);
        addResult('Basic Smart Update', true, response);
        console.log('✅ Basic smart update successful');
      } catch (error) {
        addResult('Basic Smart Update', false, error);
        console.error('❌ Basic smart update failed:', error);
      }

      // Test 2: Update with employee-specific data
      console.log('🧪 Testing smart update with employee data...');
      const employeePayload = {
        ...basicPayload,
        department: testData.department,
        employmentStatus: 'full-time' as const,
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1234567890',
          relationship: 'Spouse'
        }
      };

      try {
        const response = await empApi.smartUpdateUser(userId, employeePayload);
        addResult('Employee Data Update', true, response);
        console.log('✅ Employee data update successful');
      } catch (error) {
        addResult('Employee Data Update', false, error);
        console.error('❌ Employee data update failed:', error);
      }

      // Test 3: Update with role change
      console.log('🧪 Testing smart update with role change...');
      const rolePayload = {
        ...basicPayload,
        role: testData.role
      };

      try {
        const response = await empApi.smartUpdateUser(userId, rolePayload);
        addResult('Role Change Update', true, response);
        console.log('✅ Role change update successful');
      } catch (error) {
        addResult('Role Change Update', false, error);
        console.error('❌ Role change update failed:', error);
      }

      // Test 4: Test direct user endpoint
      console.log('🧪 Testing direct user endpoint...');
      try {
        const response = await empApi.updateUser(userId, basicPayload);
        addResult('Direct User Update', true, response);
        console.log('✅ Direct user update successful');
      } catch (error) {
        addResult('Direct User Update', false, error);
        console.error('❌ Direct user update failed:', error);
      }

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      addResult('Test Suite', false, error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">This test component is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Smart Update System Test</CardTitle>
          <p className="text-gray-600">Test the smart update functionality for different user types</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId">User ID to Test *</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="role">Test Role</Label>
              <Select value={testData.role} onValueChange={(value: any) => setTestData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={testData.firstName}
                onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={testData.lastName}
                onChange={(e) => setTestData(prev => ({ ...prev, lastName: e.target.value }))}
                className="bg-white"
              />
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex space-x-4">
            <Button onClick={testSmartUpdate} disabled={loading}>
              {loading ? 'Running Tests...' : 'Run Smart Update Tests'}
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.test}</span>
                    <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{result.timestamp}</div>
                  {!result.success && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {result.data?.message || 'Unknown error'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
