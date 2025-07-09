"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, User, Briefcase, MapPin, DollarSign, Users, Phone } from "lucide-react"
import Button from "@/app/shared/ui/button"
import FileUpload from "./file-upload"
import FormField from "./form-field"
import FormSelect from "./form-select"
import FormMultiSelect from "./form-multi-select"
import FormTextarea from "./form-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/shared/ui/tabs"
import type { EmployeeData, EmployeeFormProps } from "@/app/types/employeeTypes"
import { EMPLOYMENT_STATUSES, USER_ROLES, POSITIONS, DEPARTMENTS } from "@/app/types/employeeTypes"
import { useGetProjects, useGetManagers } from "@/app/hooks/employee/useEmployee"

const initialEmployeeData: EmployeeData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  position: "",
  images: [],
  department: "",
  hireDate: "",
  phone: "",
  employmentStatus: "full-time",
  role: "employee",
  managerId: "",
  projectIds: [],
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  salary: {
    amount: 0,
    currency: "USD",
    frequency: "yearly",
  },
}

export default function AddEmployeeForm({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}: EmployeeFormProps) {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    ...initialEmployeeData,
    ...initialData,
  })
  const [activeTab, setActiveTab] = useState("basic")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch projects and managers
  const { data: projectsResponse } = useGetProjects()
  const { data: managersResponse } = useGetManagers()

  const projects = projectsResponse?.data || []
  const managers = managersResponse?.data || []

  const projectOptions = Array.isArray(projects) ? projects.map((project: any) => ({
    value: project.id,
    label: project.name,
  })) : []

  const managerOptions = Array.isArray(managers) ? managers.map((manager: any) => ({
    value: manager.id,
    label: `${manager.firstName} ${manager.lastName} (${manager.position})`,
  })) : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmployeeData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setEmployeeData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNestedChange = (section: string, field: string, value: string | number) => {
    setEmployeeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof EmployeeData],
        [field]: value,
      },
    }))
  }

  const handleFileChange = (files: File[]) => {
    setEmployeeData((prev) => ({ ...prev, images: files }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic information validation
    if (!employeeData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!employeeData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!employeeData.email.trim()) newErrors.email = "Email is required"
    if (!employeeData.password.trim()) newErrors.password = "Password is required"
    if (!employeeData.position) newErrors.position = "Position is required"
    if (!employeeData.department) newErrors.department = "Department is required"
    if (!employeeData.hireDate) newErrors.hireDate = "Hire date is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (employeeData.email && !emailRegex.test(employeeData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (employeeData.password && employeeData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit?.(employeeData)
    }
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
            type="button"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800">Add Employee</h1>
        </div>

        {/* Tabbed Form Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Employment
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="compensation" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Compensation
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Basic Information</h2>
              <p className="text-gray-500 text-sm mb-6">Essential employee details and login credentials</p>
            </div>

            {/* Profile Photo Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Profile Photo</h3>
              <FileUpload
                onFilesSelected={handleFileChange}
                maxFileSize={10 * 1024 * 1024} // 10MB
                acceptedTypes={["image/*"]}
                showSettings={true}
                allowMultiple={false}
              />
            </div>

            {/* Basic Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  id="firstName"
                  label="First Name"
                  value={employeeData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <FormField
                  id="lastName"
                  label="Last Name"
                  value={employeeData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  value={employeeData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min. 6 characters)"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={employeeData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </TabsContent>

          {/* Employment Information Tab */}
          <TabsContent value="employment" className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Employment Details</h2>
              <p className="text-gray-500 text-sm mb-6">Job position, department, and employment status information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormSelect
                  id="position"
                  label="Position"
                  value={employeeData.position}
                  onValueChange={(value) => handleSelectChange("position", value)}
                  placeholder="Select position"
                  required
                  options={POSITIONS}
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <FormSelect
                  id="department"
                  label="Department"
                  value={employeeData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                  placeholder="Select department"
                  required
                  options={DEPARTMENTS}
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <FormField
                  id="hireDate"
                  label="Hire Date"
                  type="date"
                  value={employeeData.hireDate}
                  onChange={handleInputChange}
                  required
                />
                {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
              </div>

              <FormSelect
                id="employmentStatus"
                label="Employment Status"
                value={employeeData.employmentStatus}
                onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                placeholder="Select employment status"
                required
                options={EMPLOYMENT_STATUSES}
              />

              <FormSelect
                id="role"
                label="User Role"
                value={employeeData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
                placeholder="Select user role"
                required
                options={USER_ROLES}
              />

              {managerOptions.length > 0 && (
                <FormSelect
                  id="managerId"
                  label="Manager/Supervisor"
                  value={employeeData.managerId || ""}
                  onValueChange={(value) => handleSelectChange("managerId", value)}
                  placeholder="Select manager (optional)"
                  options={[{ value: "", label: "No manager" }, ...managerOptions]}
                />
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Project Assignments</h2>
              <p className="text-gray-500 text-sm mb-6">Assign employee to projects they will work on</p>
            </div>

            {projectOptions.length > 0 ? (
              <FormMultiSelect
                id="projectIds"
                label="Assigned Projects"
                value={employeeData.projectIds}
                onChange={(value) => setEmployeeData(prev => ({ ...prev, projectIds: value }))}
                placeholder="Select projects to assign"
                options={projectOptions}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No projects available for assignment</p>
                <p className="text-sm">Create projects first to assign them to employees</p>
              </div>
            )}
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Contact Information</h2>
              <p className="text-gray-500 text-sm mb-6">Address and emergency contact details</p>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="address.street"
                  label="Street Address"
                  value={employeeData.address?.street || ""}
                  onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                  placeholder="Enter street address"
                  className="md:col-span-2"
                />

                <FormField
                  id="address.city"
                  label="City"
                  value={employeeData.address?.city || ""}
                  onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                  placeholder="Enter city"
                />

                <FormField
                  id="address.state"
                  label="State/Province"
                  value={employeeData.address?.state || ""}
                  onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                  placeholder="Enter state or province"
                />

                <FormField
                  id="address.zipCode"
                  label="ZIP/Postal Code"
                  value={employeeData.address?.zipCode || ""}
                  onChange={(e) => handleNestedChange("address", "zipCode", e.target.value)}
                  placeholder="Enter ZIP or postal code"
                />

                <FormField
                  id="address.country"
                  label="Country"
                  value={employeeData.address?.country || ""}
                  onChange={(e) => handleNestedChange("address", "country", e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="emergencyContact.name"
                  label="Contact Name"
                  value={employeeData.emergencyContact?.name || ""}
                  onChange={(e) => handleNestedChange("emergencyContact", "name", e.target.value)}
                  placeholder="Enter emergency contact name"
                />

                <FormField
                  id="emergencyContact.phone"
                  label="Contact Phone"
                  type="tel"
                  value={employeeData.emergencyContact?.phone || ""}
                  onChange={(e) => handleNestedChange("emergencyContact", "phone", e.target.value)}
                  placeholder="Enter emergency contact phone"
                />

                <FormField
                  id="emergencyContact.relationship"
                  label="Relationship"
                  value={employeeData.emergencyContact?.relationship || ""}
                  onChange={(e) => handleNestedChange("emergencyContact", "relationship", e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>
          </TabsContent>

          {/* Compensation Tab */}
          <TabsContent value="compensation" className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Compensation Details</h2>
              <p className="text-gray-500 text-sm mb-6">Salary and compensation information (optional)</p>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  id="salary.amount"
                  label="Salary Amount"
                  type="number"
                  value={employeeData.salary?.amount?.toString() || ""}
                  onChange={(e) => handleNestedChange("salary", "amount", parseFloat(e.target.value) || 0)}
                  placeholder="Enter salary amount"
                />

                <FormSelect
                  id="salary.currency"
                  label="Currency"
                  value={employeeData.salary?.currency || "USD"}
                  onValueChange={(value) => handleNestedChange("salary", "currency", value)}
                  placeholder="Select currency"
                  options={[
                    { value: "USD", label: "USD ($)" },
                    { value: "EUR", label: "EUR (€)" },
                    { value: "GBP", label: "GBP (£)" },
                    { value: "CAD", label: "CAD (C$)" },
                  ]}
                />

                <FormSelect
                  id="salary.frequency"
                  label="Pay Frequency"
                  value={employeeData.salary?.frequency || "yearly"}
                  onValueChange={(value) => handleNestedChange("salary", "frequency", value)}
                  placeholder="Select frequency"
                  options={[
                    { value: "hourly", label: "Hourly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons - At Bottom */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8 border-t border-gray-200">
          {/* Tab Navigation Buttons */}
          <div className="flex gap-2 sm:order-1">
            {activeTab !== "basic" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "employment", "projects", "contact", "compensation"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1])
                  }
                }}
                disabled={isLoading}
                className="px-6 py-3 h-12"
              >
                Previous
              </Button>
            )}

            {activeTab !== "compensation" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "employment", "projects", "contact", "compensation"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
                disabled={isLoading}
                className="px-6 py-3 h-12"
              >
                Next
              </Button>
            )}
          </div>

          {/* Main Action Buttons */}
          <div className="flex gap-3 sm:ml-auto sm:order-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-8 py-3 h-12 font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 h-12 font-medium disabled:opacity-50"
            >
              {isLoading ? "Creating Employee..." : "Create Employee"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
