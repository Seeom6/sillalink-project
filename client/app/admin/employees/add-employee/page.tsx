"use client"

import { useRouter } from "next/navigation"
import { useAddEmployee } from "@/app/hooks/employee/useEmployee"
import AddEmployeeForm from "./add-employee-form"
import type { EmployeeData } from "@/app/types/employeeTypes"
import { createEmpPayload } from "@/app/api/employee/emp-api-type"

export default function AddEmployeePage() {
  const router = useRouter()
  const { mutate, isPending } = useAddEmployee()

  const handleSubmit = (data: EmployeeData) => {
    // Transform the form data to match the API payload
    const payload: createEmpPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      position: data.position,
      image: data.images[0] ? URL.createObjectURL(data.images[0]) : undefined,
      department: data.department,
      hireDate: data.hireDate,
      phone: data.phone,
      employmentStatus: data.employmentStatus,
      role: data.role,
      managerId: data.managerId || undefined,
      projectIds: data.projectIds,
      emergencyContact: data.emergencyContact?.name ? data.emergencyContact : undefined,
      address: data.address?.street ? data.address : undefined,
      salary: data.salary?.amount ? data.salary : undefined,
    }

    mutate(payload, {
      onSuccess: () => {
        router.push("/admin/employees")
      },
    })
  }

  const handleCancel = () => {
    router.back()
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
}
