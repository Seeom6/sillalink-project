"use client"

import React, { useState, useEffect } from 'react';
import { empApi } from '@/app/api/employee/employee.api';

export default function DateTestPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log('🔍 Fetching employees for date test...');
        const response = await empApi.getEmp();
        console.log('✅ Raw API Response:', response);
        
        if (Array.isArray(response)) {
          setEmployees(response);
          console.log('📅 Date fields analysis:');
          response.forEach((emp, index) => {
            console.log(`Employee ${index + 1}:`, {
              id: emp.id,
              name: `${emp.firstName} ${emp.lastName}`,
              startDate: emp.startDate,
              hireDate: emp.hireDate,
              date: emp.date,
              employee_startDate: emp.employee?.startDate,
              rawEmployee: emp
            });
          });
        } else {
          console.log('❌ Response is not an array:', response);
          setError('Response is not an array');
        }
      } catch (err: any) {
        console.error('❌ Error fetching employees:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) return <div className="p-6">Loading employees...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employee Date Test</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">Found {employees.length} employees</p>
      </div>

      <div className="space-y-4">
        {employees.map((employee, index) => (
          <div key={employee.id || index} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">
              {employee.firstName} {employee.lastName}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Email:</strong> {employee.email}
              </div>
              <div>
                <strong>Position:</strong> {employee.position}
              </div>
              <div>
                <strong>Department:</strong> {employee.department || 'N/A'}
              </div>
              <div>
                <strong>Employment Status:</strong> {employee.employmentStatus || 'N/A'}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Date Fields Analysis:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>startDate:</strong> 
                  <div className="ml-2">
                    Raw: {JSON.stringify(employee.startDate)}<br/>
                    Formatted: {formatDate(employee.startDate)}
                  </div>
                </div>
                <div>
                  <strong>hireDate:</strong> 
                  <div className="ml-2">
                    Raw: {JSON.stringify(employee.hireDate)}<br/>
                    Formatted: {formatDate(employee.hireDate)}
                  </div>
                </div>
                <div>
                  <strong>date:</strong> 
                  <div className="ml-2">
                    Raw: {JSON.stringify(employee.date)}<br/>
                    Formatted: {formatDate(employee.date)}
                  </div>
                </div>
                <div>
                  <strong>employee.startDate:</strong> 
                  <div className="ml-2">
                    Raw: {JSON.stringify(employee.employee?.startDate)}<br/>
                    Formatted: {formatDate(employee.employee?.startDate)}
                  </div>
                </div>
              </div>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 font-semibold">
                View Full Employee Object
              </summary>
              <pre className="mt-2 bg-white p-3 rounded border text-xs overflow-x-auto">
                {JSON.stringify(employee, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
