// Types for add employee functionality

export interface ImageDimensions {
  width: number;
  height: number;
  objectFit: ObjectFitType;
  aspectRatio: string;
}

export type ObjectFitType = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface ObjectFitOption {
  value: ObjectFitType;
  label: string;
  description: string;
}

export interface AspectRatio {
  value: string;
  label: string;
  width: number;
  height: number;
}

// File upload related types
export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  initialDimensions?: Partial<ImageDimensions>;
  showSettings?: boolean;
  allowMultiple?: boolean;
}

export interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  dimensions?: ImageDimensions;
  objectFit?: ObjectFitType;
}

export interface ImageSettingsPanelProps {
  dimensions: ImageDimensions;
  objectFit: ObjectFitType;
  onDimensionsChange: (dimensions: ImageDimensions) => void;
  onObjectFitChange: (objectFit: ObjectFitType) => void;
}

// Employee form related types
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  employmentStatus?: string;
  role?: string;
  managerId?: string;
  projectIds?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  salary?: {
    amount?: number;
    currency?: string;
    frequency?: string;
  };
  image?: string;
}

export interface EmployeeFormErrors {
  [key: string]: string;
}

export interface EmployeeFormSection {
  id: string;
  title: string;
  fields: string[];
}

// Constants
export const OBJECT_FIT_OPTIONS: ObjectFitOption[] = [
  { value: 'contain', label: 'Contain' },
  { value: 'cover', label: 'Cover' },
  { value: 'fill', label: 'Fill' },
  { value: 'none', label: 'None' },
  { value: 'scale-down', label: 'Scale Down' }
];

export const ASPECT_RATIOS: AspectRatio[] = [
  { value: '1:1', label: 'Square (1:1)', ratio: 1 },
  { value: '4:3', label: 'Standard (4:3)', ratio: 4/3 },
  { value: '16:9', label: 'Widescreen (16:9)', ratio: 16/9 },
  { value: '3:2', label: 'Photo (3:2)', ratio: 3/2 },
  { value: 'free', label: 'Free Form', ratio: 0 }
];

export const DEFAULT_IMAGE_DIMENSIONS: ImageDimensions = {
  width: 300,
  height: 300,
  objectFit: 'cover',
  aspectRatio: '1:1'
};

export const DEFAULT_OBJECT_FIT: ObjectFitType = 'cover';

// File validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }

  return { isValid: true };
};
