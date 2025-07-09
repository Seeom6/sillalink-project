"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { MoreHorizontal, Info, Trash2 } from "lucide-react"
import { useGetEmployees } from "@/app/hooks/employee/useEmployee"
import { empApi } from "@/app/api/employee/employee.api"
import { Employee } from "@/app/types/employeeTypes"
import { EmployeeAvatar } from "./employeeAvatar"
import { StatusBadge } from "./employeeBadge"
import { EmptyState } from "./employeeStatus"
import { TableFilters } from "./tabelFilter"
import { TablePagination } from "./tablePagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/ui/table"
import { Checkbox } from "@/app/shared/ui/checkbox"
import Button from "@/app/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"
import { Badge } from "@/app/shared/ui/badge"

interface EmployeesTableProps {
  onAddUser?: () => void
  onEditUser?: (employee: Employee) => void
  onDeleteUser?: (employee: Employee) => void
  onViewUser?: (employee: Employee) => void
}

export const EmployeesTable = ({
  onAddUser = () => {},
  onEditUser = (employee) => {},
  onDeleteUser = (employee) => {},
  onViewUser = (employee) => {},
}: EmployeesTableProps) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    limit: 10,
  })
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  // Use React Query with proper authentication handling
  const { data: employees, isLoading, error, refetch } = useGetEmployees(filters)

  // Handle authentication errors
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      // Redirect to unified login if unauthorized
      window.location.href = '/login';
    }
  }, [error]);

  console.log("📊 EmployeesTable state:", { employees, isLoading, error, filters })

  // Manual test function
  const testApiCall = async () => {
    console.log("🧪 Manual API test started");
    try {
      const result = await empApi.getEmp();
      console.log("✅ Manual API test result:", result);
    } catch (error) {
      console.error("❌ Manual API test error:", error);
    }
  }
  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked && employees) {
        setSelectedEmployees(employees.data.map((emp: any) => emp._id || emp.id))
      } else {
        setSelectedEmployees([])
      }
    },
    [employees],
  )

  const handleSelectEmployee = useCallback(
    (employeeId: string, checked: boolean) => {
      setSelectedEmployees((prev) =>
        checked ? [...prev, employeeId] : prev.filter((id) => id !== employeeId)
      )
    },
    [],
  )

  const isAllSelected = useMemo(() => {
    return (
      employees &&
      employees.data.length > 0 &&
      selectedEmployees.length === employees.data.length
    )
  }, [selectedEmployees.length, employees])

  const isIndeterminate = useMemo(() => {
    return (
      selectedEmployees.length > 0 &&
      selectedEmployees.length < (employees?.data?.length || 0)
    )
  }, [selectedEmployees.length, employees?.data?.length])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading employees. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Debug button */}
      <div className="mb-4">
        <Button onClick={testApiCall} variant="outline">
          🧪 Test API Call
        </Button>
      </div>

      <TableFilters
        search={filters.search}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onAddUser={onAddUser}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !employees?.data?.length ? (
        <EmptyState onAction={onAddUser} />
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el && el.querySelector("input")) {
                          ;(el.querySelector("input") as HTMLInputElement).indeterminate =
                            isIndeterminate
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-medium">Employee</TableHead>
                  <TableHead className="font-medium">Department</TableHead>
                  <TableHead className="font-medium">Position</TableHead>
                  <TableHead className="font-medium">Employment Status</TableHead>
                  <TableHead className="font-medium">Hire Date</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.data.map((employee: Employee) => {
                  const employeeId = employee._id || employee.id || ''
                  const fullName = `${employee.firstName} ${employee.lastName}`
                  const position = employee.employee?.position || 'N/A'
                  const department = employee.employee?.department || 'N/A'
                  const employmentStatus = employee.employee?.employmentStatus || 'N/A'
                  const hireDate = employee.employee?.startDate
                    ? new Date(employee.employee.startDate).toLocaleDateString()
                    : 'N/A'
                  const status = employee.isActive ? 'Active' : 'Inactive'

                  return (
                  <TableRow key={employeeId} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employeeId)}
                        onCheckedChange={(checked) =>
                          handleSelectEmployee(employeeId, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          name={fullName}
                          avatar={employee.employee?.image}
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                          {employee.phone && (
                            <div className="text-xs text-gray-400">
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge variant="outline">
                        {department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                        {position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge
                        variant={employmentStatus === 'full-time' ? 'default' : 'secondary'}
                        className={
                          employmentStatus === 'full-time' ? 'bg-green-100 text-green-800' :
                          employmentStatus === 'part-time' ? 'bg-yellow-100 text-yellow-800' :
                          employmentStatus === 'contractor' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {employmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {hireDate}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status as "Active" | "Offline" | "Wait"} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewUser(employee)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewUser(employee)}>
                            <Info className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditUser(employee)}>
                            Edit Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteUser(employee)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <TablePagination currentPage={filters.page} totalPages={4} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}
