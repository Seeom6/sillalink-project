"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EmployeesTable } from "../components/employees/employeeTable"
import { DeleteEmployeeDialog, useDeleteEmployeeDialog } from "../components/employees/DeleteEmployeeDialog"

export default function EmployeesPage() {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0);

  // Delete dialog state
  const {
    isOpen: isDeleteDialogOpen,
    selectedEmployee,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
  } = useDeleteEmployeeDialog();

  const handleAddUser = () => {
    router.push("/admin/employees/add-employee")
  }

  const handleEditUser = (employee: any) => {
    const employeeId = employee.id || employee._id;
    if (employeeId) {
      router.push(`/admin/employees/${employeeId}/edit`);
    } else {
      console.error('Employee ID not found:', employee);
      alert('Unable to edit employee: ID not found');
    }
  }

  const handleDeleteUser = (employee: any) => {
    openDeleteDialog(employee);
  }

  const handleViewUser = (employee: any) => {
    console.log('🔍 handleViewUser called with employee:', employee);
    const employeeId = employee.id || employee._id;
    console.log('📋 Employee ID extracted:', employeeId);
    if (employeeId) {
      console.log(`🚀 Navigating to: /admin/employees/${employeeId}`);
      router.push(`/admin/employees/${employeeId}`);
    } else {
      console.error('❌ Employee ID not found:', employee);
      alert('Unable to view employee: ID not found');
    }
  }

  const handleDeleteSuccess = () => {
    // Refresh the employee table
    setRefreshKey(prev => prev + 1);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Employees</h1>
        <p className="text-gray-600">Manage your team members and their information</p>
      </div>

      <EmployeesTable
        key={refreshKey}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onViewUser={handleViewUser}
      />

      <DeleteEmployeeDialog
        employee={selectedEmployee}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
