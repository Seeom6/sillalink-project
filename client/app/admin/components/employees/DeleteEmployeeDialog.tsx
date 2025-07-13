"use client"

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/ui/dialog';
import Button from '@/app/shared/ui/button';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { empApi } from '@/app/api/employee/employee.api';
import { Employee } from '@/app/types/employeeTypes';

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteEmployeeDialog({
  employee,
  isOpen,
  onClose,
  onSuccess
}: DeleteEmployeeDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedConfirmText = 'DELETE';
  const isConfirmValid = confirmText === expectedConfirmText;

  const handleDelete = async () => {
    if (!employee || !isConfirmValid) return;

    // Ensure we have a valid employee ID
    const employeeId = employee.id || employee._id;
    if (!employeeId) {
      setError('Employee ID is missing');
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      await empApi.deleteEmp(employeeId);

      // Reset state
      setConfirmText('');
      onSuccess();
      onClose();

    } catch (err: any) {
      console.error('Error deleting employee:', err);
      setError(err.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setConfirmText('');
    setError(null);
    onClose();
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete Employee</span>
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{employee.firstName} {employee.lastName}</strong>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">This action cannot be undone.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All employee data will be permanently deleted</li>
                    <li>The employee will lose access to their account</li>
                    <li>Any associated projects and tasks will need to be reassigned</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="confirmText" className="text-sm font-medium">
              Type <span className="font-mono bg-gray-100 px-1 rounded">{expectedConfirmText}</span> to confirm:
            </Label>
            <Input
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedConfirmText}
              className={`mt-1 bg-white ${!isConfirmValid && confirmText ? 'border-red-500' : ''}`}
              disabled={isDeleting}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-500 mt-1">
                Please type "{expectedConfirmText}" exactly as shown
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Employee
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using the delete dialog
export function useDeleteEmployeeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const openDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedEmployee(null);
  };

  return {
    isOpen,
    selectedEmployee,
    openDialog,
    closeDialog,
  };
}
