'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Upload, X, Calendar, DollarSign, Users, Code, Flag, Star } from 'lucide-react';
import Button from '@/app/shared/ui/button';
import { Input } from '@/app/shared/ui/input';
import { Textarea } from '@/app/shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/ui/Card';
import { Label } from '@/app/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/shared/ui/select';
import { Switch } from '@/app/shared/ui/switch';
import { Badge } from '@/app/shared/ui/badge';
import { useToast } from '@/app/hooks/useToast';
import { useProjectActions } from '@/app/hooks/project/useProject';
import { useGetEmployees } from '@/app/hooks/employee/useEmployee';
import { useTechnologies } from '@/app/hooks/technology/useTechnology';
import {
  ProjectFormData,
  ProjectStatus,
  ProjectPriority,
  TaskStatus,
  TaskPriority,
  projectFormSchema,
  ProjectFormSchema,
  DEFAULT_PROJECT_FORM_VALUES,
  PROJECT_STATUS_LABELS,
  PROJECT_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS
} from '@/app/types/projectTypes';

export default function AddProjectPage() {
  const router = useRouter();
  const toast = useToast();
  const { createProject, loading } = useProjectActions();
  const { data: employeesData, isLoading: employeesLoading, error: employeesError } = useGetEmployees({});

  // Debug logs removed - issue resolved

  // Employee interface for type safety
  interface Employee {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    employee?: {
      position?: string;
      image?: string;
    };
  }

  // Ensure employees is always an array - handle different possible response structures
  const employees: Employee[] = React.useMemo(() => {
    // If there's an error or no data, return mock data for development
    if (employeesError || !employeesData) {
      return [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', employee: { position: 'Frontend Developer' } },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', employee: { position: 'Backend Developer' } },
        { _id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', employee: { position: 'UI/UX Designer' } },
        { _id: '4', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com', employee: { position: 'Project Manager' } },
        { _id: '5', firstName: 'David', lastName: 'Brown', email: 'david@example.com', employee: { position: 'DevOps Engineer' } }
      ];
    }

    // Handle different possible response structures
    if (Array.isArray(employeesData?.data)) return employeesData.data;
    if (Array.isArray(employeesData?.employees)) return employeesData.employees;
    if (Array.isArray(employeesData)) return employeesData;

    return [];
  }, [employeesData, employeesError]);
  const { technologies: technologiesData, loading: technologiesLoading } = useTechnologies();

  // Technology interface for type safety
  interface Technology {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    icon?: string;
  }

  // Ensure technologies is always an array with mock data fallback
  const technologies: Technology[] = React.useMemo(() => {
    if (technologiesLoading || !technologiesData || technologiesData.length === 0) {
      return [
        { _id: '1', name: 'React', description: 'JavaScript library for building user interfaces', category: 'Frontend' },
        { _id: '2', name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine', category: 'Backend' },
        { _id: '3', name: 'TypeScript', description: 'Typed superset of JavaScript', category: 'Language' },
        { _id: '4', name: 'MongoDB', description: 'NoSQL document database', category: 'Database' },
        { _id: '5', name: 'Next.js', description: 'React framework for production', category: 'Framework' },
        { _id: '6', name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'Styling' }
      ];
    }
    return technologiesData;
  }, [technologiesData, technologiesLoading]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    trigger
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: DEFAULT_PROJECT_FORM_VALUES,
    mode: 'onChange'
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control,
    name: 'tasks'
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedAssignedEmployees = watch('assignedEmployees') || [];

  // Validate end date when start date changes
  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      trigger('endDate');
    }
  }, [watchedStartDate, watchedEndDate, trigger]);

  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error('Error', `${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error('Error', `${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > 10) {
      toast.error('Error', 'Maximum 10 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [selectedImages.length, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addTask = useCallback(() => {
    appendTask({
      name: '',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignee: 'unassigned',
      dueDate: ''
    });
  }, [appendTask]);

  const onSubmit = async (data: ProjectFormSchema) => {
    try {
      // Validate that at least one task exists
      if (!data.tasks || data.tasks.length === 0) {
        toast.error('Error', 'At least one task is required for new projects');
        return;
      }

      // Filter out empty tasks and transform to proper ProjectTask format
      const validTasks = data.tasks.filter(task => task.name.trim() !== '').map(task => ({
        ...task,
        description: task.description || undefined,
        assignee: task.assignee === 'unassigned' ? undefined : task.assignee,
        dueDate: task.dueDate || undefined
      }));

      if (validTasks.length === 0) {
        toast.error('Error', 'At least one task with a name is required');
        return;
      }

      const projectData = {
        ...data,
        tasks: validTasks,
        cost: data.cost || undefined,
        endDate: data.endDate || undefined,
        externalLink: data.externalLink || undefined,
        description: data.description || undefined
      } as ProjectFormData;

      const result = await createProject(projectData, selectedImages);
      
      if (result) {
        toast.success('Success', 'Project created successfully!');
        router.push('/admin/projects');
      }
    } catch (error) {
      toast.error('Error', 'Failed to create project. Please try again.');
    }
  };

  const handleReset = useCallback(() => {
    reset(DEFAULT_PROJECT_FORM_VALUES);
    setSelectedImages([]);
    setImagePreviews([]);
  }, [reset]);

  // Removed unused formatCurrency function

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4">Loading employees and technologies...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
        <p className="text-gray-600 mt-2">
          Create a new project with team members, tasks, and timeline
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter project name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your project..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* External Link */}
            <div>
              <Label htmlFor="externalLink">External Link</Label>
              <Input
                id="externalLink"
                {...register('externalLink')}
                placeholder="https://github.com/user/project"
                type="url"
                className={errors.externalLink ? 'border-red-500' : ''}
              />
              {errors.externalLink && (
                <p className="text-red-500 text-sm mt-1">{errors.externalLink.message}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_PRIORITY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="featured"
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured Project
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Timeline and Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  min={watchedStartDate}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <Label htmlFor="cost">Project Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="cost"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="1"
                      className={`pl-10 ${errors.cost ? 'border-red-500' : ''}`}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
                />
              </div>
              {errors.cost && (
                <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team and Technologies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Members */}
            <div>
              <Label htmlFor="assignedEmployees">Team Members</Label>
              <Controller
                name="assignedEmployees"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team members" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem
                          key={employee._id}
                          value={employee._id}
                          disabled={watchedAssignedEmployees.includes(employee._id)}
                        >
                          {employee.firstName} {employee.lastName} - {employee.employee?.position || 'Employee'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Selected Team Members */}
              {watchedAssignedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchedAssignedEmployees.map((employeeId) => {
                    const employee = employees.find(emp => emp._id === employeeId);
                    if (!employee) return null;

                    return (
                      <Badge key={employeeId} variant="secondary" className="flex items-center gap-1">
                        {employee.firstName} {employee.lastName}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const currentValues = watchedAssignedEmployees;
                            setValue('assignedEmployees', currentValues.filter(id => id !== employeeId));
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}

              {errors.assignedEmployees && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedEmployees.message}</p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <Label htmlFor="technologiesUsed">Technologies</Label>
              <Controller
                name="technologiesUsed"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technologies" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map((tech) => (
                        <SelectItem
                          key={tech._id}
                          value={tech._id}
                          disabled={(field.value || []).includes(tech._id)}
                        >
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            {tech.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Selected Technologies */}
              {(watch('technologiesUsed') || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(watch('technologiesUsed') || []).map((techId) => {
                    const tech = technologies.find(t => t._id === techId);
                    if (!tech) return null;

                    return (
                      <Badge key={techId} variant="outline" className="flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        {tech.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const currentValues = watch('technologiesUsed') || [];
                            setValue('technologiesUsed', currentValues.filter(id => id !== techId));
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}

              {errors.technologiesUsed && (
                <p className="text-red-500 text-sm mt-1">{errors.technologiesUsed.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Project Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PNG, JPG, GIF up to 5MB each (max 10 images)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Selected Images ({imagePreviews.length}/10)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Project Tasks
              </div>
              <Button type="button" onClick={addTask} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No tasks added yet. Add at least one task to continue.</p>
                <Button type="button" onClick={addTask} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {taskFields.map((field, index) => (
                  <Card key={field.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Task {index + 1}
                        </h4>
                        {taskFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Task Name */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`tasks.${index}.name`}>Task Name *</Label>
                          <Input
                            {...register(`tasks.${index}.name` as const)}
                            placeholder="Enter task name"
                            className={errors.tasks?.[index]?.name ? 'border-red-500' : ''}
                          />
                          {errors.tasks?.[index]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.tasks[index]?.name?.message}
                            </p>
                          )}
                        </div>

                        {/* Task Description */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`tasks.${index}.description`}>Description</Label>
                          <Textarea
                            {...register(`tasks.${index}.description` as const)}
                            placeholder="Describe the task..."
                            rows={2}
                            className={errors.tasks?.[index]?.description ? 'border-red-500' : ''}
                          />
                          {errors.tasks?.[index]?.description && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.tasks[index]?.description?.message}
                            </p>
                          )}
                        </div>

                        {/* Task Assignee */}
                        <div>
                          <Label htmlFor={`tasks.${index}.assignee`}>Assignee</Label>
                          <Controller
                            name={`tasks.${index}.assignee` as const}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value || "unassigned"}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">No assignee</SelectItem>
                                  {watchedAssignedEmployees.map((employeeId) => {
                                    const employee = employees.find(emp => emp._id === employeeId);
                                    if (!employee) return null;
                                    return (
                                      <SelectItem key={employee._id} value={employee._id}>
                                        {employee.firstName} {employee.lastName}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Task Due Date */}
                        <div>
                          <Label htmlFor={`tasks.${index}.dueDate`}>Due Date</Label>
                          <Input
                            type="date"
                            {...register(`tasks.${index}.dueDate` as const)}
                            min={watchedStartDate}
                            max={watchedEndDate || undefined}
                          />
                        </div>

                        {/* Task Status */}
                        <div>
                          <Label htmlFor={`tasks.${index}.status`}>Status</Label>
                          <Controller
                            name={`tasks.${index}.status` as const}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Task Priority */}
                        <div>
                          <Label htmlFor={`tasks.${index}.priority`}>Priority</Label>
                          <Controller
                            name={`tasks.${index}.priority` as const}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {errors.tasks && (
              <p className="text-red-500 text-sm mt-2">{errors.tasks.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting || loading}
          >
            Reset Form
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="min-w-[120px]"
          >
            {isSubmitting || loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </div>
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
