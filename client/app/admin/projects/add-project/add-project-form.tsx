"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, FolderOpen, Calendar, DollarSign, Users, Building, Target } from "lucide-react"
import Button from "@/app/shared/ui/button"
import FileUpload from "./file-upload"
import FormField from "./form-field"
import FormSelect from "./form-select"
import FormMultiSelect from "./form-multi-select"
import FormTextarea from "./form-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/shared/ui/tabs"
import { PROJECT_STATUSES, PROJECT_PRIORITIES, CURRENCIES } from "@/app/types/adminProjectTypes"
import { useGetAvailableEmployees, useGetAvailableManagers } from "@/app/hooks/project/useProject"

const initialProjectData: AdminProjectData = {
  name: "",
  description: "",
  status: "active",
  startDate: "",
  endDate: "",
  budget: {
    amount: 0,
    currency: "USD",
  },
  client: {
    name: "",
    email: "",
    phone: "",
    company: "",
  },
  assignedEmployees: [],
  managerId: "",
  priority: "medium",
  progress: 0,
  tags: [],
  attachments: [],
}

export default function AddProjectForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AdminProjectFormProps) {
  const [formData, setFormData] = useState<AdminProjectData>({
    ...initialProjectData,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("basic")

  // Fetch data for dropdowns
  const { employees = [] } = useGetAvailableEmployees()
  const { managers = [] } = useGetAvailableManagers()

  const handleInputChange = (field: keyof AdminProjectData, value: any) => {
    setFormData((prev: AdminProjectData) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field as string]: "",
      }))
    }
  }

  const handleNestedInputChange = (
    parentField: keyof AdminProjectData,
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [field]: value,
      },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    // Budget validation
    if (formData.budget && formData.budget.amount < 0) {
      newErrors.budget = "Budget amount cannot be negative"
    }

    // Progress validation
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = "Progress must be between 0 and 100"
    }

    // Client email validation
    if (formData.client?.email && !/\S+@\S+\.\S+/.test(formData.client.email)) {
      newErrors.clientEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }

  const employeeOptions = employees.map((emp: any) => ({
    value: emp._id || emp.id,
    label: `${emp.firstName} ${emp.lastName} - ${emp.employee?.position || emp.position || 'N/A'}`,
  }))

  const managerOptions = managers.map((manager: any) => ({
    value: manager._id || manager.id,
    label: `${manager.firstName} ${manager.lastName}`,
  }))

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Information</h2>
          <p className="text-gray-600">Fill in the details for the new project</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Project Details
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team & Assignment
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Client & Budget
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Project Name"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Enter project name"
              required
              error={errors.name}
            />

            <FormSelect
              label="Status"
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              options={PROJECT_STATUSES}
              required
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Describe the project objectives and scope"
                required
                error={errors.description}
                rows={4}
              />
            </div>

            <FormSelect
              label="Priority"
              value={formData.priority}
              onChange={(value) => handleInputChange("priority", value)}
              options={PROJECT_PRIORITIES}
              required
            />

            <FormField
              label="Progress (%)"
              type="number"
              value={formData.progress.toString()}
              onChange={(value) => handleInputChange("progress", parseInt(value) || 0)}
              placeholder="0"
              min="0"
              max="100"
              error={errors.progress}
            />
          </div>
        </TabsContent>

        {/* Project Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(value) => handleInputChange("startDate", value)}
              required
              error={errors.startDate}
            />

            <FormField
              label="End Date"
              type="date"
              value={formData.endDate || ""}
              onChange={(value) => handleInputChange("endDate", value)}
              error={errors.endDate}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Tags
              </label>
              <FormField
                value={formData.tags?.join(", ") || ""}
                onChange={(value) => handleInputChange("tags", value.split(",").map(tag => tag.trim()).filter(Boolean))}
                placeholder="Enter tags separated by commas (e.g., web, mobile, api)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Project Attachments"
                files={formData.attachments || []}
                onChange={(files) => handleInputChange("attachments", files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                multiple
              />
            </div>
          </div>
        </TabsContent>

        {/* Team & Assignment Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormSelect
              label="Project Manager"
              value={formData.managerId || ""}
              onChange={(value) => handleInputChange("managerId", value)}
              options={[
                { value: "", label: "Select a manager" },
                ...managerOptions,
              ]}
            />

            <FormMultiSelect
              label="Assigned Employees"
              values={formData.assignedEmployees}
              onChange={(values) => handleInputChange("assignedEmployees", values)}
              options={employeeOptions}
              placeholder="Select employees to assign to this project"
            />
          </div>
        </TabsContent>

        {/* Client & Budget Tab */}
        <TabsContent value="client" className="space-y-6">
          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Client Name"
                  value={formData.client?.name || ""}
                  onChange={(value) => handleNestedInputChange("client", "name", value)}
                  placeholder="Enter client name"
                />

                <FormField
                  label="Company"
                  value={formData.client?.company || ""}
                  onChange={(value) => handleNestedInputChange("client", "company", value)}
                  placeholder="Enter company name"
                />

                <FormField
                  label="Email"
                  type="email"
                  value={formData.client?.email || ""}
                  onChange={(value) => handleNestedInputChange("client", "email", value)}
                  placeholder="client@company.com"
                  error={errors.clientEmail}
                />

                <FormField
                  label="Phone"
                  value={formData.client?.phone || ""}
                  onChange={(value) => handleNestedInputChange("client", "phone", value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Budget Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Budget Amount"
                  type="number"
                  value={formData.budget?.amount?.toString() || ""}
                  onChange={(value) => handleNestedInputChange("budget", "amount", parseFloat(value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  error={errors.budget}
                />

                <FormSelect
                  label="Currency"
                  value={formData.budget?.currency || "USD"}
                  onChange={(value) => handleNestedInputChange("budget", "currency", value)}
                  options={CURRENCIES}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#2496ED] hover:bg-[#1976D2] text-white"
        >
          {isLoading ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
